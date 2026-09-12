#!/usr/bin/env bash
# ==============================================================================
# InoveCloud OS - Automated Debian 12 Live ISO Builder
# Kiosk Appliance: Boots directly into InoveCloud OS Launcher via Wayland (Cage)
# ==============================================================================
set -euo pipefail

# ANSI Color codes
BOLD="\033[1m"
GREEN="\033[0;32m"
CYAN="\033[0;36m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
RESET="\033[0m"

echo -e "${CYAN}${BOLD}"
echo "================================================================"
echo "    InoveCloud OS - Appliance ISO Generator (Debian 12 Live)    "
echo "    Kiosk Mode: Boots directly into InoveCloud Web Launcher     "
echo "================================================================"
echo -e "${RESET}"

# Verify running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}[ERRO] Este script precisa ser executado como root (sudo).${RESET}"
  echo "Exemplo: sudo ./build-iso.sh"
  exit 1
fi

WORK_DIR="$(pwd)/iso_build_workspace"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOTFS_DIR="${WORK_DIR}/chroot"
IMAGE_DIR="${WORK_DIR}/image"
OUTPUT_DIR="${REPO_ROOT}/dist-iso"
ISO_NAME="inovecloud-os-debian12-amd64.iso"
DEBIAN_MIRROR="http://deb.debian.org/debian"
DEBIAN_SUITE="bookworm"

echo -e "${YELLOW}[1/7] Instalando ferramentas essenciais de compilação de ISO...${RESET}"
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
  debootstrap \
  debian-archive-keyring \
  squashfs-tools \
  xorriso \
  isolinux \
  syslinux-efi \
  grub-pc-bin \
  grub-efi-amd64-bin \
  mtools \
  curl \
  ca-certificates \
  git \
  rsync

# Clean up previous builds and traps
umount -lf "${ROOTFS_DIR}/dev/pts" 2>/dev/null || true
umount -lf "${ROOTFS_DIR}/dev" 2>/dev/null || true
umount -lf "${ROOTFS_DIR}/proc" 2>/dev/null || true
umount -lf "${ROOTFS_DIR}/sys" 2>/dev/null || true
rm -rf "${WORK_DIR}"
mkdir -p "${ROOTFS_DIR}" "${IMAGE_DIR}" "${OUTPUT_DIR}"

echo -e "${YELLOW}[2/7] Executando debootstrap para Debian 12 Bookworm minimal...${RESET}"
debootstrap --arch=amd64 --variant=minbase "${DEBIAN_SUITE}" "${ROOTFS_DIR}" "${DEBIAN_MIRROR}"

echo -e "${YELLOW}[3/7] Configurando Chroot, DNS e Repositórios Debian...${RESET}"
# Ensure DNS resolution works inside chroot
cp /etc/resolv.conf "${ROOTFS_DIR}/etc/resolv.conf" 2>/dev/null || echo "nameserver 1.1.1.1" > "${ROOTFS_DIR}/etc/resolv.conf"

cat << 'EOF' > "${ROOTFS_DIR}/etc/apt/sources.list"
deb http://deb.debian.org/debian bookworm main contrib non-free non-free-firmware
deb http://deb.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware
deb http://deb.debian.org/debian bookworm-updates main contrib non-free non-free-firmware
EOF

# Mount virtual filesystems for chroot
mount --bind /dev "${ROOTFS_DIR}/dev"
mount --bind /dev/pts "${ROOTFS_DIR}/dev/pts"
mount --bind /proc "${ROOTFS_DIR}/proc"
mount --bind /sys "${ROOTFS_DIR}/sys"

cleanup() {
  echo -e "${YELLOW}Desmontando sistemas de arquivos virtuais do chroot...${RESET}"
  umount -lf "${ROOTFS_DIR}/dev/pts" 2>/dev/null || true
  umount -lf "${ROOTFS_DIR}/dev" 2>/dev/null || true
  umount -lf "${ROOTFS_DIR}/proc" 2>/dev/null || true
  umount -lf "${ROOTFS_DIR}/sys" 2>/dev/null || true
}
trap cleanup EXIT

echo -e "${YELLOW}[4/7] Instalando Kernel, Cage (Wayland Kiosk), Chromium e Drivers dentro da ISO...${RESET}"
chroot "${ROOTFS_DIR}" /bin/bash << 'CHROOT_EXEC'
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive
apt-get update

# Instalação do Kernel e live-boot
apt-get install -y --no-install-recommends \
  linux-image-amd64 \
  live-boot \
  systemd-sysv \
  firmware-linux-free

# Rede, Ferramentas essenciais e Drivers de Vídeo Mesa
apt-get install -y --no-install-recommends \
  network-manager \
  iproute2 \
  curl \
  wget \
  sudo \
  pciutils \
  mesa-va-drivers \
  mesa-vulkan-drivers \
  libgl1-mesa-dri \
  xwayland \
  cage \
  chromium \
  fonts-dejavu-core \
  fonts-freefont-ttf \
  fonts-noto-color-emoji \
  ca-certificates \
  nodejs \
  htop

# Criar usuário 'inove' sem senha para live session
useradd -m -s /bin/bash inove || true
echo "inove:inove" | chpasswd
usermod -aG sudo,video,input,render inove || true

# Configurar sudo sem senha para o usuário inove
echo "inove ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/inove-nopasswd
chmod 0440 /etc/sudoers.d/inove-nopasswd

# Configurar Hostname do Sistema
echo "inovecloud-os" > /etc/hostname
cat << 'HOSTS_EOF' > /etc/hosts
127.0.0.1   localhost
127.0.1.1   inovecloud-os
HOSTS_EOF

# Configurar serviço do NetworkManager
systemctl enable NetworkManager || true

# Criar diretório da aplicação
mkdir -p /opt/inovecloud
chown -R inove:inove /opt/inovecloud

apt-get clean
rm -rf /var/lib/apt/lists/*
CHROOT_EXEC

echo -e "${YELLOW}[5/7] Copiando e compilando o InoveCloud OS para dentro da imagem...${RESET}"
mkdir -p "${ROOTFS_DIR}/opt/inovecloud"
if [ -d "${REPO_ROOT}/dist" ] && [ -n "$(ls -A "${REPO_ROOT}/dist" 2>/dev/null)" ]; then
  cp -r "${REPO_ROOT}/dist"/* "${ROOTFS_DIR}/opt/inovecloud/"
elif [ -d "./dist" ] && [ -n "$(ls -A "./dist" 2>/dev/null)" ]; then
  cp -r ./dist/* "${ROOTFS_DIR}/opt/inovecloud/"
elif [ -d "../dist" ] && [ -n "$(ls -A "../dist" 2>/dev/null)" ]; then
  cp -r ../dist/* "${ROOTFS_DIR}/opt/inovecloud/"
fi

# Cria mini servidor HTTP em Node.js de alta performance caso sirva estático
cat << 'NODE_SRV' > "${ROOTFS_DIR}/opt/inovecloud/server.js"
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let safePath = path.normalize(req.url.split('?')[0]);
  if (safePath === '/') safePath = '/index.html';
  
  let filePath = path.join(PUBLIC_DIR, safePath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`InoveCloud OS Local Server running on http://127.0.0.1:${PORT}`);
});
NODE_SRV

# Configurar systemd service para o Node.js InoveCloud
cat << 'SERVICE_EOF' > "${ROOTFS_DIR}/etc/systemd/system/inovecloud.service"
[Unit]
Description=InoveCloud OS Local Application Server
After=network.target

[Service]
Type=simple
User=inove
WorkingDirectory=/opt/inovecloud
ExecStart=/usr/bin/node /opt/inovecloud/server.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
SERVICE_EOF

# Configurar inicialização do Wayland Cage em modo Kiosk na TTY1
cat << 'CAGE_LAUNCHER' > "${ROOTFS_DIR}/usr/local/bin/inovecloud-kiosk"
#!/usr/bin/env bash
# Esperar o servidor local responder
until curl -s http://127.0.0.1:3000 > /dev/null 2>&1; do
  sleep 0.5
done

# Variaveis de ambiente para compatibilidade com VirtualBox / Mesa / Wayland
export WLR_NO_HARDWARE_CURSORS=1
export LIBGL_ALWAYS_SOFTWARE=1

# Executa Cage Wayland com Chromium em tela cheia (Kiosk Mode)
exec /usr/bin/cage -- /usr/bin/chromium \
  --kiosk \
  --no-sandbox \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-translate \
  --check-for-update-interval=31536000 \
  --ozone-platform=wayland \
  --enable-features=UseOzonePlatform \
  --app=http://127.0.0.1:3000
CAGE_LAUNCHER
chmod +x "${ROOTFS_DIR}/usr/local/bin/inovecloud-kiosk"

# Configurar auto-login na TTY1 para iniciar o Cage Kiosk
mkdir -p "${ROOTFS_DIR}/etc/systemd/system/getty@tty1.service.d"
cat << 'GETTY_OVERRIDE' > "${ROOTFS_DIR}/etc/systemd/system/getty@tty1.service.d/override.conf"
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin inove --noclear %I $TERM
GETTY_OVERRIDE

# Configurar .bash_profile do usuário 'inove' para subir o Kiosk se estiver na TTY1
cat << 'BASH_PROFILE' >> "${ROOTFS_DIR}/home/inove/.bash_profile"
if [ -z "$WAYLAND_DISPLAY" ] && [ "$XDG_VTNR" -eq 1 ]; then
  exec /usr/local/bin/inovecloud-kiosk
fi
BASH_PROFILE
chroot "${ROOTFS_DIR}" chown inove:inove /home/inove/.bash_profile

# Habilitar o serviço InoveCloud no boot
chroot "${ROOTFS_DIR}" systemctl enable inovecloud.service

# Desmontar explicitamente antes de gerar o SquashFS
cleanup
trap - EXIT

echo -e "${YELLOW}[6/7] Empacotando SquashFS e preparando estrutura de Boot (GRUB EFI + BIOS)...${RESET}"
mkdir -p "${IMAGE_DIR}/live" "${IMAGE_DIR}/boot/grub"

# Copiar kernel e initrd para o diretório de boot da ISO
cp "${ROOTFS_DIR}/boot"/vmlinuz-* "${IMAGE_DIR}/live/vmlinuz"
cp "${ROOTFS_DIR}/boot"/initrd.img-* "${IMAGE_DIR}/live/initrd"

# Criar o SquashFS comprimido com XZ (alta compressão)
mksquashfs "${ROOTFS_DIR}" "${IMAGE_DIR}/live/filesystem.squashfs" \
  -comp xz -wildcards \
  -e "proc/*" "sys/*" "dev/*" "tmp/*"

# Configuração do GRUB para UEFI e BIOS
cat << 'GRUB_CFG' > "${IMAGE_DIR}/boot/grub/grub.cfg"
set default="0"
set timeout=5

insmod font
if loadfont /boot/grub/fonts/unicode.pf2; then
  insmod gfxterm
  set gfxmode=auto
  set gfxpayload=keep
  terminal_output gfxterm
fi

menuentry "InoveCloud OS 2026 (Live Kiosk Appliance)" {
  linux /live/vmlinuz boot=live quiet splash components
  initrd /live/initrd
}

menuentry "InoveCloud OS (Modo Seguro / Fallback VESA)" {
  linux /live/vmlinuz boot=live nomodeset components
  initrd /live/initrd
}
GRUB_CFG

echo -e "${YELLOW}[7/7] Criando imagem híbrida final ${ISO_NAME}...${RESET}"
grub-mkrescue -o "${OUTPUT_DIR}/${ISO_NAME}" "${IMAGE_DIR}"

echo -e "${GREEN}${BOLD}"
echo "================================================================"
echo "    SUCESSO! ISO GERADA COM ÊXITO:                             "
echo "    Arquivo: ${OUTPUT_DIR}/${ISO_NAME}                         "
echo "================================================================"
echo -e "${RESET}"
echo "Como testar:"
echo "1. No VirtualBox ou Proxmox: crie uma VM com 2GB RAM e aponte esta ISO."
echo "2. No Pen Drive real: use 'dd' no Linux ou grave com BalenaEtcher/Rufus no Windows:"
echo "   sudo dd if=${OUTPUT_DIR}/${ISO_NAME} of=/dev/sdX bs=4M status=progress oflag=sync"
echo ""
