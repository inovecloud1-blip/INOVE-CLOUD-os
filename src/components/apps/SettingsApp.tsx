import React, { useState, useRef } from 'react';
import {
  Settings,
  Image as ImageIcon,
  Zap,
  Cpu,
  HardDrive,
  Shield,
  Wifi,
  Globe,
  Check,
  Upload,
  Link,
  Sparkles,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  RotateCcw,
  Clock,
  Home,
  Cloud,
  Server,
  Bluetooth,
  Mouse,
  Monitor,
  Volume2,
  BatteryCharging,
  Palette,
  User,
  Accessibility,
  Info,
  Radio,
  Lock,
  QrCode,
  Headphones,
  Sliders,
  VolumeX,
  Volume1,
  Sun,
  Moon,
  ChevronRight,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { WALLPAPERS } from '../../data/mockData';
import { DesktopWidgetsConfig } from '../../types';
import { AppIcon } from '../desktop/AppIcon';

interface SettingsAppProps {
  currentWallpaper: string;
  onSelectWallpaper: (url: string) => void;
  gpuEnabled: boolean;
  onToggleGpu: () => void;
  widgetsConfig?: DesktopWidgetsConfig;
  onUpdateWidgetsConfig?: (config: Partial<DesktopWidgetsConfig>) => void;
  onResetWidgetsConfig?: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  currentWallpaper,
  onSelectWallpaper,
  gpuEnabled,
  onToggleGpu,
  widgetsConfig,
  onUpdateWidgetsConfig,
  onResetWidgetsConfig,
}) => {
  const [activeSection, setActiveSection] = useState<
    'wifi' | 'bluetooth' | 'mouse' | 'display' | 'sound' | 'power' | 'themes' | 'user' | 'accessibility' | 'about'
  >('wifi');

  // Wi-Fi States
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [connectedSsid, setConnectedSsid] = useState('InoveCloud-5G-Ultra');
  const [connectingSsid, setConnectingSsid] = useState<string | null>(null);
  const [wifiPasswordPrompt, setWifiPasswordPrompt] = useState<string | null>(null);
  const [wifiPasswordInput, setWifiPasswordInput] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [wifiNetworks, setWifiNetworks] = useState([
    { ssid: 'InoveCloud-5G-Ultra', signal: 4, secured: true, frequency: '5 GHz', ip: '192.168.1.145' },
    { ssid: 'Home-Fiber-HighSpeed', signal: 4, secured: true, frequency: '5 GHz', ip: null },
    { ssid: 'Corporativo-Inove-Guest', signal: 3, secured: false, frequency: '2.4 GHz', ip: null },
    { ssid: 'Starlink-Satellite-Mesh', signal: 3, secured: true, frequency: '5 GHz', ip: null },
    { ssid: 'Lab-IoT-Sensors', signal: 2, secured: true, frequency: '2.4 GHz', ip: null },
  ]);

  // Bluetooth States
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [isScanningBt, setIsScanningBt] = useState(false);
  const [pairedDevices, setPairedDevices] = useState([
    { id: 'bt-1', name: 'AirPods Pro 2 (Inove Audio)', type: 'audio', battery: 92, connected: true },
    { id: 'bt-2', name: 'Mouse Logitech MX Master 3S', type: 'mouse', battery: 78, connected: true },
    { id: 'bt-3', name: 'Teclado Mecânico Keychron K2', type: 'keyboard', battery: 85, connected: true },
  ]);
  const [availableBtDevices, setAvailableBtDevices] = useState([
    { id: 'bt-4', name: 'Smart TV Samsung Neo QLED 65"', type: 'display' },
    { id: 'bt-5', name: 'Controle Sony PS5 DualSense', type: 'gamepad' },
    { id: 'bt-6', name: 'Caixa de Som JBL Flip 6', type: 'audio' },
  ]);

  // Mouse & Touchpad States
  const [pointerSpeed, setPointerSpeed] = useState(6);
  const [naturalScrolling, setNaturalScrolling] = useState(true);
  const [primaryButton, setPrimaryButton] = useState<'left' | 'right'>('left');
  const [mouseAcceleration, setMouseAcceleration] = useState(true);
  const [tapToClick, setTapToClick] = useState(true);
  const [scrollSpeed, setScrollSpeed] = useState(5);
  const [testClickCount, setTestClickCount] = useState(0);

  // Display & Video States
  const [resolution, setResolution] = useState('1920x1080');
  const [refreshRate, setRefreshRate] = useState('60Hz');
  const [uiScale, setUiScale] = useState('100%');
  const [nightLight, setNightLight] = useState(false);
  const [nightLightTemp, setNightLightTemp] = useState(50);
  const [brightness, setBrightness] = useState(90);

  // Sound States
  const [outputDevice, setOutputDevice] = useState('Alto-falantes Realtek High Definition Audio');
  const [masterVolume, setMasterVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [inputDevice, setInputDevice] = useState('Microfone USB Blue Yeti');
  const [systemSounds, setSystemSounds] = useState(true);

  // Power & Battery States
  const [powerMode, setPowerMode] = useState<'performance' | 'balanced' | 'power_saver'>('balanced');
  const [screenOffTimeout, setScreenOffTimeout] = useState('15m');
  const [sleepTimeout, setSleepTimeout] = useState('30m');

  // Custom Themes States
  const [selectedThemePreset, setSelectedThemePreset] = useState('candy');
  const [accentColor, setAccentColor] = useState('#ef4444');
  const [glassBlur, setGlassBlur] = useState<'soft' | 'medium' | 'ultra'>('medium');
  const [dockStyle, setDockStyle] = useState<'floating' | 'mac' | 'compact'>('floating');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User States
  const [userName, setUserName] = useState('Administrador Inove');
  const [userLogin, setUserLogin] = useState('inove');
  const [userAvatar, setUserAvatar] = useState('👑');
  const [userPasswordMessage, setUserPasswordMessage] = useState<string | null>(null);

  // Accessibility States
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState<'normal' | 'large' | 'extralarge'>('normal');
  const [screenReaderActive, setScreenReaderActive] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [stickyKeys, setStickyKeys] = useState(false);
  const [monoAudio, setMonoAudio] = useState(false);
  const [largeCursor, setLargeCursor] = useState(false);

  // Play audio test sound
  const playSoundTest = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.log('AudioContext not allowed without interaction');
    }
  };

  // Test Speech Synthesis
  const testSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('InoveCloud OS. Acessibilidade e leitor de tela ativados com sucesso.');
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
      setScreenReaderActive(true);
    }
  };

  // Handle local file upload for wallpaper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadFeedback('Erro: Por favor, selecione um arquivo de imagem válido (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onSelectWallpaper(result);
        setUploadFeedback(`Papel de parede "${file.name}" aplicado com sucesso!`);
        setTimeout(() => setUploadFeedback(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle direct URL apply
  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    onSelectWallpaper(customUrlInput.trim());
    setUploadFeedback('Papel de parede via URL aplicado com sucesso!');
    setTimeout(() => setUploadFeedback(null), 4000);
  };

  // Connect to Wi-Fi
  const handleConnectWifi = (ssid: string) => {
    const net = wifiNetworks.find((n) => n.ssid === ssid);
    if (net?.secured) {
      setWifiPasswordPrompt(ssid);
      setWifiPasswordInput('');
    } else {
      setConnectingSsid(ssid);
      setTimeout(() => {
        setConnectedSsid(ssid);
        setConnectingSsid(null);
      }, 1200);
    }
  };

  const confirmWifiPassword = () => {
    if (!wifiPasswordPrompt) return;
    const target = wifiPasswordPrompt;
    setConnectingSsid(target);
    setWifiPasswordPrompt(null);
    setTimeout(() => {
      setConnectedSsid(target);
      setConnectingSsid(null);
    }, 1500);
  };

  // Bluetooth pair
  const handlePairBt = (device: { id: string; name: string; type: string }) => {
    setAvailableBtDevices((prev) => prev.filter((d) => d.id !== device.id));
    setPairedDevices((prev) => [
      ...prev,
      { id: device.id, name: device.name, type: device.type, battery: 100, connected: true },
    ]);
  };

  const handleDisconnectBt = (id: string) => {
    setPairedDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, connected: !d.connected } : d))
    );
  };

  const handleForgetBt = (id: string) => {
    const dev = pairedDevices.find((d) => d.id === id);
    if (!dev) return;
    setPairedDevices((prev) => prev.filter((d) => d.id !== id));
    setAvailableBtDevices((prev) => [...prev, { id: dev.id, name: dev.name, type: dev.type }]);
  };

  // Navigation Items
  const menuItems = [
    { id: 'wifi', label: 'Wi-Fi & Internet', icon: Wifi, badge: connectedSsid ? 'Conectado' : 'Desligado' },
    { id: 'bluetooth', label: 'Bluetooth & Dispositivos', icon: Bluetooth, badge: `${pairedDevices.filter(d => d.connected).length} ativos` },
    { id: 'mouse', label: 'Mouse & Touchpad', icon: Mouse },
    { id: 'display', label: 'Tela, Resolução & Luz', icon: Monitor },
    { id: 'sound', label: 'Som & Microfone', icon: Volume2 },
    { id: 'power', label: 'Energia & Bateria', icon: BatteryCharging, badge: '88%' },
    { id: 'themes', label: 'Temas & Wallpapers', icon: Palette, badge: 'Candy' },
    { id: 'user', label: 'Usuário & Contas', icon: User, badge: 'inove' },
    { id: 'accessibility', label: 'Acessibilidade', icon: Accessibility },
    { id: 'about', label: 'Sobre o PC & Sistema', icon: Info, badge: 'v2026.1' },
  ];

  return (
    <div className="flex h-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* LEFT SIDEBAR NAVIGATION */}
      <div className="w-64 border-r border-white/10 bg-slate-900/60 flex flex-col p-3 shrink-0">
        <div className="flex items-center space-x-2.5 px-3 py-3 mb-2 border-b border-white/10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-md shadow-red-600/30">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white tracking-wide">Configurações</h2>
            <p className="text-[10px] text-slate-400">InoveCloud OS Control Center</p>
          </div>
        </div>

        {/* Menu list */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Host Status Footer */}
        <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400 flex items-center justify-between px-2">
          <span>Debian 12 Bookworm</span>
          <span className="flex items-center space-x-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kiosk Ativo</span>
          </span>
        </div>
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* =================================================================== */}
        {/* 1. WI-FI & INTERNET */}
        {/* =================================================================== */}
        {activeSection === 'wifi' && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Wifi className="w-5 h-5 text-cyan-400" />
                  <span>Rede Sem Fio (Wi-Fi)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Conecte-se a redes Wi-Fi locais, pontos de acesso e gerencie adaptadores de rede.
                </p>
              </div>
              {/* Wi-Fi Main Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={wifiEnabled}
                  onChange={() => setWifiEnabled(!wifiEnabled)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {wifiEnabled ? (
              <>
                {/* Connected Network Card */}
                {connectedSsid && (
                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                          <Radio className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-bold text-white">{connectedSsid}</h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Conectado
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">IPv4: 192.168.1.145 • Frequência: 5 GHz • Segurança: WPA3</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowQrModal(true)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>QR Code</span>
                        </button>
                        <button
                          onClick={() => setConnectedSsid('')}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition cursor-pointer"
                        >
                          Desconectar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Available Networks */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Redes Wi-Fi Disponíveis
                  </h4>
                  <div className="space-y-2">
                    {wifiNetworks.map((net) => {
                      const isCurrent = connectedSsid === net.ssid;
                      const isConnecting = connectingSsid === net.ssid;
                      return (
                        <div
                          key={net.ssid}
                          className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                            isCurrent
                              ? 'bg-white/10 border-cyan-500/40'
                              : 'bg-white/5 border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Wifi className={`w-4 h-4 ${isCurrent ? 'text-cyan-400' : 'text-slate-400'}`} />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-white">{net.ssid}</span>
                                {net.secured && <Lock className="w-3 h-3 text-slate-400" />}
                              </div>
                              <span className="text-[10px] text-slate-400">{net.frequency} • Sinal Excelente</span>
                            </div>
                          </div>

                          <div>
                            {isCurrent ? (
                              <span className="text-xs font-semibold text-cyan-400">Em Uso</span>
                            ) : isConnecting ? (
                              <span className="flex items-center space-x-1 text-xs text-amber-400">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span>Conectando...</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleConnectWifi(net.ssid)}
                                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer"
                              >
                                Conectar
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs">
                O Wi-Fi está desligado. Ligue a chave acima para buscar redes.
              </div>
            )}

            {/* Password Modal */}
            {wifiPasswordPrompt && (
              <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="w-full max-w-sm p-5 rounded-2xl bg-slate-900 border border-white/20 shadow-2xl space-y-4">
                  <h4 className="text-sm font-bold text-white">Conectar a "{wifiPasswordPrompt}"</h4>
                  <p className="text-xs text-slate-300">Digite a senha de segurança de rede (WPA/WPA2/WPA3):</p>
                  <input
                    type="password"
                    autoFocus
                    placeholder="Senha do Wi-Fi..."
                    value={wifiPasswordInput}
                    onChange={(e) => setWifiPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => setWifiPasswordPrompt(null)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={confirmWifiPassword}
                      className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-md shadow-cyan-600/30"
                    >
                      Conectar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* QR Code Modal */}
            {showQrModal && (
              <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="w-full max-w-xs p-6 rounded-2xl bg-slate-900 border border-white/20 shadow-2xl space-y-4 text-center">
                  <h4 className="text-sm font-bold text-white">Compartilhar Wi-Fi</h4>
                  <p className="text-xs text-slate-400">Aponte a câmera do celular para conectar sem digitar senha:</p>
                  <div className="p-4 bg-white rounded-xl inline-block mx-auto">
                    <QrCode className="w-36 h-36 text-slate-950" />
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400">SSID: {connectedSsid}</div>
                  <button
                    onClick={() => setShowQrModal(false)}
                    className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* 2. BLUETOOTH & DISPOSITIVOS */}
        {/* =================================================================== */}
        {activeSection === 'bluetooth' && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Bluetooth className="w-5 h-5 text-indigo-400" />
                  <span>Bluetooth & Dispositivos Conectados</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Conecte fones de ouvido sem fio, mouses, teclados mecânicos e controles Bluetooth.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={bluetoothEnabled}
                  onChange={() => setBluetoothEnabled(!bluetoothEnabled)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>

            {bluetoothEnabled ? (
              <>
                {/* Paired devices */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Meus Dispositivos Pareados
                    </h4>
                    <span className="text-[11px] text-slate-400">Visível para outros aparelhos como "InoveCloud-PC"</span>
                  </div>

                  <div className="space-y-2">
                    {pairedDevices.map((dev) => (
                      <div
                        key={dev.id}
                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                            {dev.type === 'audio' ? (
                              <Headphones className="w-4 h-4" />
                            ) : (
                              <Mouse className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-white">{dev.name}</span>
                              {dev.connected && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                              )}
                            </div>
                            <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                              <span>{dev.connected ? 'Conectado' : 'Desconectado'}</span>
                              <span>•</span>
                              <span>Bateria: {dev.battery}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDisconnectBt(dev.id)}
                            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer"
                          >
                            {dev.connected ? 'Desconectar' : 'Reconectar'}
                          </button>
                          <button
                            onClick={() => handleForgetBt(dev.id)}
                            className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition cursor-pointer"
                            title="Esquecer dispositivo"
                          >
                            Esquecer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available for pairing */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                      <span>Outros Dispositivos Próximos</span>
                      <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" />
                    </h4>
                    <button
                      onClick={() => setIsScanningBt(!isScanningBt)}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      Atualizar busca
                    </button>
                  </div>

                  <div className="space-y-2">
                    {availableBtDevices.map((dev) => (
                      <div
                        key={dev.id}
                        className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-white/20 transition"
                      >
                        <div className="flex items-center space-x-3">
                          <Bluetooth className="w-4 h-4 text-slate-400" />
                          <span className="text-xs font-semibold text-white">{dev.name}</span>
                        </div>
                        <button
                          onClick={() => handlePairBt(dev)}
                          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition cursor-pointer active:scale-95"
                        >
                          Parear
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs">
                O Bluetooth está desativado.
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* 3. MOUSE & TOUCHPAD */}
        {/* =================================================================== */}
        {activeSection === 'mouse' && (
          <div className="space-y-6 max-w-3xl">
            <div className="pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Mouse className="w-5 h-5 text-amber-400" />
                <span>Mouse, Ponteiro & Touchpad</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ajuste a velocidade do cursor, rolagem natural, clique duplo e preferências de precisão.
              </p>
            </div>

            {/* Pointer Speed */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Velocidade do Ponteiro</h4>
                  <p className="text-[11px] text-slate-400">Sensibilidade do sensor do mouse na tela</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">{pointerSpeed}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={pointerSpeed}
                onChange={(e) => setPointerSpeed(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Primary Button */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Botão Primário do Mouse</h4>
                <p className="text-[11px] text-slate-400">Alterne para canhotos caso use o botão direito para selecionar</p>
              </div>
              <div className="flex space-x-1 p-1 bg-slate-900 rounded-xl border border-white/10">
                <button
                  onClick={() => setPrimaryButton('left')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    primaryButton === 'left' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'
                  }`}
                >
                  Esquerdo
                </button>
                <button
                  onClick={() => setPrimaryButton('right')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    primaryButton === 'right' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'
                  }`}
                >
                  Direito
                </button>
              </div>
            </div>

            {/* Natural Scrolling */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Rolagem Natural (Estilo Touchpad / Mac)</h4>
                <p className="text-[11px] text-slate-400">O conteúdo se move na mesma direção dos seus dedos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={naturalScrolling}
                  onChange={() => setNaturalScrolling(!naturalScrolling)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Pointer Acceleration & Tap to click */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Aceleração do Cursor</h4>
                  <p className="text-[10px] text-slate-400">Aumenta velocidade em movimentos rápidos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mouseAcceleration}
                    onChange={() => setMouseAcceleration(!mouseAcceleration)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Toque para Clicar (Touchpad)</h4>
                  <p className="text-[10px] text-slate-400">Toque levemente sem pressionar o botão físico</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tapToClick}
                    onChange={() => setTapToClick(!tapToClick)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>

            {/* Test Mouse Interactive Area */}
            <div
              onClick={() => setTestClickCount((c) => c + 1)}
              className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/5 border border-amber-500/30 text-center cursor-pointer hover:border-amber-400/50 transition select-none active:scale-[0.99]"
            >
              <h4 className="text-xs font-bold text-amber-300">Área de Teste de Clique & Sensibilidade</h4>
              <p className="text-[11px] text-slate-300 mt-1">
                Clique repetidamente ou use o scroll aqui para sentir a resposta. Cliques registrados:{' '}
                <span className="font-mono font-bold text-white">{testClickCount}</span>
              </p>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 4. TELA & VÍDEO (DISPLAY) */}
        {/* =================================================================== */}
        {activeSection === 'display' && (
          <div className="space-y-6 max-w-3xl">
            <div className="pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-sky-400" />
                <span>Monitores, Resolução & Luz Noturna</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configurações de vídeo Wayland, taxa de atualização, escala DPI e filtro de luz azul.
              </p>
            </div>

            {/* Resolution Selector */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-white">Resolução de Exibição</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { res: '1920x1080', name: 'Full HD 1080p' },
                  { res: '2560x1440', name: '2K QHD 1440p' },
                  { res: '3840x2160', name: '4K Ultra HD' },
                  { res: '1366x768', name: 'HD Laptop' },
                ].map((item) => (
                  <button
                    key={item.res}
                    onClick={() => setResolution(item.res)}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      resolution === item.res
                        ? 'bg-sky-500/20 border-sky-400 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs">{item.res}</div>
                    <div className="text-[10px] opacity-75">{item.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Refresh Rate & Scale */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-white">Taxa de Atualização</h4>
                <div className="flex space-x-2">
                  {['60Hz', '120Hz', '144Hz'].map((hz) => (
                    <button
                      key={hz}
                      onClick={() => setRefreshRate(hz)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                        refreshRate === hz ? 'bg-sky-500 text-slate-950' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {hz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-white">Escala da Interface (DPI)</h4>
                <div className="flex space-x-2">
                  {['100%', '125%', '150%'].map((scale) => (
                    <button
                      key={scale}
                      onClick={() => setUiScale(scale)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                        uiScale === scale ? 'bg-sky-500 text-slate-950' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {scale}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Night Light */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Luz Noturna (Filtro de Luz Azul)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">Torna a tela com tons mais quentes para não cansar os olhos à noite</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nightLight}
                    onChange={() => setNightLight(!nightLight)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
              {nightLight && (
                <div className="pt-2">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Mais Frio</span>
                    <span className="text-amber-400 font-bold">Temperatura Quente</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={nightLightTemp}
                    onChange={(e) => setNightLightTemp(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Brightness */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Brilho da Tela</span>
                <span className="text-xs font-mono text-sky-400">{brightness}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 5. SOM & ÁUDIO */}
        {/* =================================================================== */}
        {activeSection === 'sound' && (
          <div className="space-y-6 max-w-3xl">
            <div className="pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-emerald-400" />
                <span>Som, Volume & Microfone</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Controle de nível de áudio do sistema, dispositivos de saída e entrada (PipeWire / ALSA).
              </p>
            </div>

            {/* Master Volume */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-400"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <div>
                    <h4 className="text-xs font-bold text-white">Volume Principal</h4>
                    <span className="text-[11px] text-slate-400">{outputDevice}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={playSoundTest}
                    className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    <span>Testar Som</span>
                  </button>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {isMuted ? 'Mudo' : `${masterVolume}%`}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                disabled={isMuted}
                value={masterVolume}
                onChange={(e) => setMasterVolume(Number(e.target.value))}
                className="w-full accent-emerald-500 disabled:opacity-30"
              />
            </div>

            {/* Output Selector */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-white">Dispositivo de Saída de Áudio</h4>
              <div className="space-y-1">
                {[
                  'Alto-falantes Realtek High Definition Audio',
                  'AirPods Pro 2 (Inove Audio - Bluetooth)',
                  'Saída de Áudio HDMI / DisplayPort',
                ].map((device) => (
                  <button
                    key={device}
                    onClick={() => setOutputDevice(device)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between transition ${
                      outputDevice === device
                        ? 'bg-emerald-500/20 text-white font-bold border border-emerald-500/30'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{device}</span>
                    {outputDevice === device && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Device */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-white">Microfone / Entrada de Voz</h4>
              <div className="space-y-1">
                {[
                  'Microfone USB Blue Yeti',
                  'Microfone Embutido (Realtek Audio)',
                ].map((device) => (
                  <button
                    key={device}
                    onClick={() => setInputDevice(device)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between transition ${
                      inputDevice === device
                        ? 'bg-emerald-500/20 text-white font-bold border border-emerald-500/30'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{device}</span>
                    {inputDevice === device && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 6. ENERGIA & BATERIA */}
        {/* =================================================================== */}
        {activeSection === 'power' && (
          <div className="space-y-6 max-w-3xl">
            <div className="pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <BatteryCharging className="w-5 h-5 text-emerald-400" />
                <span>Energia, Bateria & Desempenho</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Gerencie perfis de consumo elétrico, turbo boost da CPU e economia de bateria.
              </p>
            </div>

            {/* Battery Status Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                  88%
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Conectado ao Carregador USB-C</h4>
                  <p className="text-xs text-slate-400">Carregando em 65W PD • Tempo estimado até 100%: 24 minutos</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300">
                Saúde: 97%
              </span>
            </div>

            {/* Power Profile Mode */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-white">Modo de Energia do Processador</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'performance', title: 'Alto Desempenho', desc: 'Clock máximo e turbo desbloqueado' },
                  { id: 'balanced', title: 'Equilibrado', desc: 'Ajuste dinâmico automático (Padrão)' },
                  { id: 'power_saver', title: 'Economia de Energia', desc: 'Reduz consumo e aquece menos' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setPowerMode(mode.id as any)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      powerMode === mode.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold shadow'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs">{mode.title}</div>
                    <div className="text-[10px] opacity-75 mt-0.5">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sleep Timers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-white">Desligar Tela após Inatividade</h4>
                <div className="flex space-x-1">
                  {['5m', '15m', '30m', 'Nunca'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setScreenOffTimeout(time)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                        screenOffTimeout === time ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-white">Suspender Computador</h4>
                <div className="flex space-x-1">
                  {['15m', '30m', '1h', 'Nunca'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setSleepTimeout(time)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                        sleepTimeout === time ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 7. TEMAS & PERSONALIZAÇÃO */}
        {/* =================================================================== */}
        {activeSection === 'themes' && (
          <div className="space-y-6 max-w-4xl">
            <div className="pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Palette className="w-5 h-5 text-rose-400" />
                <span>Temas Personalizados & Wallpapers</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Escolha esquemas de cores, vidro Liquid Glass, papéis de parede ou envie sua própria imagem do computador.
              </p>
            </div>

            {/* Presets Theme Cards */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Pacotes de Temas
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {[
                  { id: 'candy', name: 'Candy Craze', color: 'from-rose-500 via-purple-500 to-amber-400' },
                  { id: 'cyber', name: 'Cyber Obsidian', color: 'from-slate-950 via-slate-900 to-cyan-500' },
                  { id: 'sunset', name: 'Sunset Gold', color: 'from-amber-500 via-orange-600 to-red-600' },
                  { id: 'slate', name: 'Titanium Slate', color: 'from-slate-400 via-slate-600 to-slate-800' },
                  { id: 'neon', name: 'Neon Mint', color: 'from-emerald-400 via-teal-500 to-cyan-700' },
                  { id: 'tokyo', name: 'Tokyo Twilight', color: 'from-fuchsia-500 via-indigo-600 to-purple-900' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedThemePreset(preset.id)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      selectedThemePreset === preset.id
                        ? 'border-rose-400 bg-white/10 shadow-lg'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className={`h-8 rounded-lg bg-gradient-to-r ${preset.color} mb-1.5 shadow`} />
                    <span className="text-[11px] font-bold text-white">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Picker */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-white">Cor de Destaque (Accent Color)</h4>
              <div className="flex space-x-3">
                {[
                  { color: '#ef4444', name: 'Vermelho Inove' },
                  { color: '#06b6d4', name: 'Ciano Cyber' },
                  { color: '#8b5cf6', name: 'Violeta' },
                  { color: '#10b981', name: 'Esmeralda' },
                  { color: '#f59e0b', name: 'Âmbar Dourado' },
                  { color: '#ec4899', name: 'Rosa Chiclete' },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => setAccentColor(c.color)}
                    className={`w-7 h-7 rounded-full shadow-md transition transform hover:scale-110 ${
                      accentColor === c.color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : ''
                    }`}
                    style={{ backgroundColor: c.color }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Icon Theme Pack Preview (Candy Pastel Neon 3D) */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Pacote de Ícones do Sistema</h4>
                  <p className="text-[11px] text-slate-400">Novo tema 3D Candy Squircles Pastel &amp; Neon (Flathub, IA, Arquivos, ISO, KVM, etc.)</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
                  Ativo no Sistema
                </span>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-slate-950/60 rounded-xl border border-white/5 overflow-x-auto">
                <div className="flex flex-col items-center space-y-1">
                  <AppIcon appId="appstore" size="md" />
                  <span className="text-[10px] text-slate-400">Flathub</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <AppIcon appId="aiagent" size="md" />
                  <span className="text-[10px] text-slate-400">IA Copilot</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <AppIcon appId="storage" size="md" />
                  <span className="text-[10px] text-slate-400">Arquivos</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <AppIcon appId="isobuilder" size="md" />
                  <span className="text-[10px] text-slate-400">ISO Disco</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <AppIcon appId="linuxpedia" size="md" />
                  <span className="text-[10px] text-slate-400">Docs</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <AppIcon appId="vn" size="md" />
                  <span className="text-[10px] text-slate-400">VMs</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <AppIcon appId="terminal" size="md" />
                  <span className="text-[10px] text-slate-400">Terminal</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <AppIcon appId="settings" size="md" />
                  <span className="text-[10px] text-slate-400">Ajustes</span>
                </div>
              </div>
            </div>

            {/* Wallpapers Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Papéis de Parede Incluídos
                </h4>
                <div className="flex space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/30 transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload do meu PC</span>
                  </button>
                </div>
              </div>

              {uploadFeedback && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{uploadFeedback}</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WALLPAPERS.map((wp) => {
                  const isCurrent = currentWallpaper === wp.url;
                  return (
                    <button
                      key={wp.id}
                      onClick={() => onSelectWallpaper(wp.url)}
                      className={`group relative h-28 rounded-xl overflow-hidden border transition cursor-pointer ${
                        isCurrent ? 'border-red-500 ring-2 ring-red-500/50' : 'border-white/10 hover:border-white/40'
                      }`}
                    >
                      <img
                        src={wp.url}
                        alt={wp.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                        <span className="text-xs font-bold text-white truncate">{wp.name}</span>
                      </div>
                      {isCurrent && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Direct URL input */}
              <form onSubmit={handleApplyUrl} className="flex gap-2 pt-2">
                <input
                  type="url"
                  placeholder="Ou cole a URL direta de uma imagem da internet..."
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition cursor-pointer"
                >
                  Aplicar URL
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 8. USUÁRIO & CONTAS */}
        {/* =================================================================== */}
        {activeSection === 'user' && (
          <div className="space-y-6 max-w-3xl">
            <div className="pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <User className="w-5 h-5 text-indigo-400" />
                <span>Usuário do Sistema & Contas de Acesso</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Gerencie credenciais Linux root, conta ativa no Kiosk e permissões administrativas.
              </p>
            </div>

            {/* Current Active User Profile */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                  {userAvatar}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-bold text-white">{userName}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Superusuário
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Usuário do Linux: <span className="font-mono text-slate-300">{userLogin}</span> (Sudo NOPASSWD)</p>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">Sessão iniciada via Wayland Cage TTY1</p>
                </div>
              </div>
            </div>

            {/* Avatar Selector */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-white">Escolher Avatar</h4>
              <div className="flex space-x-2">
                {['👑', '🚀', '💻', '⚡', '🐧', '🛡️', '👾', '🦊'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setUserAvatar(emoji)}
                    className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition ${
                      userAvatar === emoji ? 'bg-indigo-600 scale-110 shadow' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Change Password */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-white">Alterar Senha do Usuário 'inove'</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="password"
                  placeholder="Nova senha..."
                  className="px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="password"
                  placeholder="Confirmar nova senha..."
                  className="px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={() => {
                  setUserPasswordMessage('Senha do usuário inove atualizada no Linux com sucesso!');
                  setTimeout(() => setUserPasswordMessage(null), 3500);
                }}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition cursor-pointer"
              >
                Salvar Nova Senha
              </button>
              {userPasswordMessage && (
                <p className="text-xs text-emerald-400 font-semibold">{userPasswordMessage}</p>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 9. ACESSIBILIDADE */}
        {/* =================================================================== */}
        {activeSection === 'accessibility' && (
          <div className="space-y-6 max-w-3xl">
            <div className="pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Accessibility className="w-5 h-5 text-purple-400" />
                <span>Acessibilidade & Facilidades de Uso</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Opções para pessoas com baixa visão, sensibilidade motora e leitor de tela por sintetizador de voz.
              </p>
            </div>

            {/* High Contrast */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Modo de Alto Contraste</h4>
                <p className="text-[11px] text-slate-400">Aumenta o contraste visual entre textos e fundos (Razão WCAG AAA 7:1)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={() => setHighContrast(!highContrast)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            {/* Font Scaling */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-white">Tamanho do Texto do Sistema</h4>
              <div className="flex space-x-2">
                {[
                  { id: 'normal', label: 'Padrão (100%)' },
                  { id: 'large', label: 'Grande (125%)' },
                  { id: 'extralarge', label: 'Extra Grande (150%)' },
                ].map((scale) => (
                  <button
                    key={scale.id}
                    onClick={() => setFontSizeScale(scale.id as any)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                      fontSizeScale === scale.id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {scale.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen Reader Speech */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Leitor de Tela / Síntese de Voz (TTS)</h4>
                <p className="text-[11px] text-slate-400">Lê os botões e janelas ativas em voz alta em Português</p>
              </div>
              <button
                onClick={testSpeech}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Ouvir Voz</span>
              </button>
            </div>

            {/* Reduce Motion & Sticky Keys */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Reduzir Animações</h4>
                  <p className="text-[10px] text-slate-400">Desativa transições para evitar enjoos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reduceMotion}
                    onChange={() => setReduceMotion(!reduceMotion)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Áudio Mono</h4>
                  <p className="text-[10px] text-slate-400">Mescla canais E/D em um só</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={monoAudio}
                    onChange={() => setMonoAudio(!monoAudio)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 10. SOBRE O PC & SISTEMA */}
        {/* =================================================================== */}
        {activeSection === 'about' && (
          <div className="space-y-6 max-w-3xl">
            <div className="pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Info className="w-5 h-5 text-slate-400" />
                <span>Especificações do Computador & Sistema Operacional</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Informações de Kernel, arquitetura x86_64, processador, drivers Mesa e status do Kiosk.
              </p>
            </div>

            {/* OS Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-950 border border-red-500/30 flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-600/40">
                IC
              </div>
              <div>
                <h4 className="text-base font-bold text-white">InoveCloud OS 2026.1 LTS</h4>
                <p className="text-xs text-slate-300">Base: Debian 12 (Bookworm) 64-bit • Wayland Cage Compositor</p>
                <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                  <span>Kernel: Linux 6.1.0-28-amd64</span>
                  <span>•</span>
                  <span>Chromium Kiosk Engine v124</span>
                </div>
              </div>
            </div>

            {/* Hardware Specs List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Componentes de Hardware
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Processador (CPU)</span>
                  </div>
                  <div className="text-xs font-bold text-white">AMD EPYC™ 7763 / Intel® Core™ i9-14900K</div>
                  <div className="text-[10px] text-slate-400">8 vCPUs alocadas • Aceleração KVM / VT-x Ativa</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Memória RAM</span>
                  </div>
                  <div className="text-xs font-bold text-white">16.0 GB DDR5 5600 MHz</div>
                  <div className="text-[10px] text-slate-400">4.2 GB em uso pelo Live System & Cache</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-rose-400" />
                    <span>Armazenamento</span>
                  </div>
                  <div className="text-xs font-bold text-white">NVMe M.2 PCIe 4.0 (512 GB)</div>
                  <div className="text-[10px] text-slate-400">Sistema rodando em Live RAM SquashFS XZ</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Segurança & Boot</span>
                  </div>
                  <div className="text-xs font-bold text-white">UEFI Secure Boot Híbrido</div>
                  <div className="text-[10px] text-slate-400">GRUB2 Multiboot (Compatível com BIOS antiga e EFI)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default SettingsApp;
