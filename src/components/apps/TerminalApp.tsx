import React, { useState } from 'react';
import { Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { VirtualNode, WebApp } from '../../types';

interface TerminalAppProps {
  vns: VirtualNode[];
  webApps: WebApp[];
  onToggleVnStatus: (id: string) => void;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({
  vns,
  webApps,
  onToggleVnStatus,
}) => {
  const [history, setHistory] = useState<string[]>([
    'InoveCloud Hypervisor Cloud Shell (x86_64)',
    'Linux inovecloud-alpha 6.8.0-31-generic #31-InoveCloud-SMP',
    'Type "help" to see available inovectl and system commands.',
    '',
  ]);
  const [input, setInput] = useState('');

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const newHistory = [...history, `root@inovecloud-node01:~# ${cmd}`];
    const parts = cmd.split(' ');
    const main = parts[0].toLowerCase();

    if (main === 'help') {
      newHistory.push('Comandos disponíveis:');
      newHistory.push('  inovectl status       - Exibe o status geral da infraestrutura');
      newHistory.push('  vn list               - Lista todas as Máquinas Virtuais (VNs)');
      newHistory.push('  vn start <id>         - Inicia uma Máquina Virtual');
      newHistory.push('  vn stop <id>          - Desliga uma Máquina Virtual');
      newHistory.push('  web list              - Lista aplicações web e domínios');
      newHistory.push('  docker ps             - Lista contêineres em execução');
      newHistory.push('  neofetch              - Informações do cluster e hardware');
      newHistory.push('  uptime                - Tempo de atividade do nó');
      newHistory.push('  clear                 - Limpa o terminal');
    } else if (main === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (main === 'neofetch') {
      newHistory.push('        .---.         OS: InoveCloud OS 2.4 Enterprise x86_64');
      newHistory.push('       /     \\        Host: InoveCloud HyperCluster H100 Node');
      newHistory.push('      | () () |       Kernel: 6.8.0-31-InoveCloud');
      newHistory.push('       \\  _  /        Uptime: 14 days, 8 hours, 42 mins');
      newHistory.push('        \'---\'         Packages: 1420 (dpkg), 12 (flatpak)');
      newHistory.push('                      Shell: inove-bash 5.2.21');
      newHistory.push('                      CPU: AMD EPYC 9654 96-Core (192) @ 2.400GHz');
      newHistory.push('                      GPU: NVIDIA RTX A5000 24GB');
      newHistory.push('                      Memory: 6.2GB / 64.0GB (64%)');
    } else if (main === 'uptime') {
      newHistory.push(' 12:45:00 up 14 days, 8:42, 4 users, load average: 0.42, 0.38, 0.25');
    } else if (main === 'inovectl' && parts[1] === 'status') {
      newHistory.push('=== INOVECLOUD CLUSTER STATUS ===');
      newHistory.push(`Total VNs: ${vns.length} (Ativas: ${vns.filter(v => v.status === 'running').length})`);
      newHistory.push(`Web Apps: ${webApps.length} (Todas com SSL Let's Encrypt)`);
      newHistory.push('Rede: Subnet 10.240.0.0/16 (WireGuard VPN Ativa)');
      newHistory.push('Armazenamento: Ceph NVMe Pool [HEALTH_OK]');
    } else if (main === 'vn' && parts[1] === 'list') {
      newHistory.push('ID                    NOME                     STATUS      IP              VCPU/RAM');
      newHistory.push('----------------------------------------------------------------------------------');
      vns.forEach((v) => {
        newHistory.push(
          `${v.id.padEnd(21)} ${v.name.padEnd(24)} ${v.status.padEnd(11)} ${v.ip.padEnd(15)} ${v.vCpu}c/${v.ramGb}GB`
        );
      });
    } else if (main === 'vn' && (parts[1] === 'start' || parts[1] === 'stop')) {
      const targetId = parts[2];
      const found = vns.find((v) => v.id === targetId || v.name === targetId);
      if (found) {
        onToggleVnStatus(found.id);
        newHistory.push(`Operação enviada para a VN [${found.name}]. Novo estado alternado.`);
      } else {
        newHistory.push(`Erro: VN "${targetId}" não encontrada. Use "vn list" para ver IDs.`);
      }
    } else if (main === 'web' && parts[1] === 'list') {
      newHistory.push('DOMINIO                     FRAMEWORK   PORTA    HTTPS');
      newHistory.push('-------------------------------------------------------');
      webApps.forEach((a) => {
        newHistory.push(
          `${a.domain.padEnd(27)} ${a.framework.padEnd(11)} :${a.internalPort.toString().padEnd(7)} ${a.httpsEnabled ? 'SIM' : 'NAO'}`
        );
      });
    } else if (main === 'docker' && parts[1] === 'ps') {
      newHistory.push('CONTAINER ID   IMAGE                 STATUS         PORTS');
      newHistory.push('4a9c8f1b203d   nextcloud:29.0        Up 4 days      0.0.0.0:8081->80/tcp');
      newHistory.push('8e2f10b49c71   portainer/ce:2.20     Up 14 days     0.0.0.0:9443->9443/tcp');
      newHistory.push('3b7c91d4e82f   postgres:16-alpine    Up 14 days     0.0.0.0:5432->5432/tcp');
      newHistory.push('1f9d4b8e203c   ollama/ollama:latest  Up 2 days      0.0.0.0:11434->11434/tcp');
    } else {
      newHistory.push(`inove-bash: comando não encontrado: ${cmd}. Digite "help" para ver opções.`);
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-black font-mono text-xs text-emerald-400 p-4 select-text">
      <div className="flex-1 overflow-y-auto space-y-1">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed text-slate-200">
            {line}
          </div>
        ))}
      </div>

      <form onSubmit={handleCommand} className="pt-3 border-t border-slate-800 flex items-center space-x-2">
        <span className="text-emerald-400 font-bold shrink-0">root@inovecloud-node01:~#</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite um comando (ex: vn list, help, neofetch, inovectl status)..."
          className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none"
          autoFocus
        />
      </form>
    </div>
  );
};
