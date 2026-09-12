import React, { useState } from 'react';
import {
  Layers,
  Search,
  Download,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle2,
  Sparkles,
  Zap,
  Play,
  Terminal,
  ShieldCheck,
  RefreshCw,
  Box,
  Copy,
  Check
} from 'lucide-react';
import { AppStoreItem } from '../../types';

interface AppStoreAppProps {
  catalog: AppStoreItem[];
  onToggleInstall: (id: string) => void;
}

interface FlathubApp {
  id: string;
  appId: string; // Flatpak reverse-dns ID
  name: string;
  tagline: string;
  category: 'Desenvolvimento' | 'Produtividade' | 'Jogos' | 'Áudio & Vídeo' | 'Gráficos';
  version: string;
  developer: string;
  size: string;
  rating: number;
  downloads: string;
  installed: boolean;
  iconGradient: string;
  permissions: string[];
}

export const AppStoreApp: React.FC<AppStoreAppProps> = ({
  catalog,
  onToggleInstall,
}) => {
  const [activeTab, setActiveTab] = useState<'flathub' | 'installed' | 'remotes'>('flathub');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [installProgress, setInstallProgress] = useState(0);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [selectedAppDetail, setSelectedAppDetail] = useState<FlathubApp | null>(null);

  // Master list of real Linux Flatpak / Flathub apps
  const [flathubApps, setFlathubApps] = useState<FlathubApp[]>([
    {
      id: 'vscode',
      appId: 'com.visualstudio.code',
      name: 'Visual Studio Code',
      tagline: 'Editor de código profissional com suporte a extensões, Git e depuração integrada.',
      category: 'Desenvolvimento',
      version: '1.93.1',
      developer: 'Microsoft Corporation',
      size: '98.4 MB',
      rating: 4.9,
      downloads: '14.2M',
      installed: true,
      iconGradient: 'from-blue-600 via-sky-500 to-indigo-700',
      permissions: ['Acesso ao Sistema de Arquivos (host)', 'Rede (network)', 'Wayland & X11'],
    },
    {
      id: 'spotify',
      appId: 'com.spotify.Client',
      name: 'Spotify Music',
      tagline: 'Milhões de músicas, podcasts e playlists com áudio de alta fidelidade no Linux.',
      category: 'Áudio & Vídeo',
      version: '1.2.45',
      developer: 'Spotify AB',
      size: '185.0 MB',
      rating: 4.8,
      downloads: '9.8M',
      installed: false,
      iconGradient: 'from-emerald-500 via-green-600 to-teal-800',
      permissions: ['PipeWire / PulseAudio', 'Rede', 'Notificações do Sistema'],
    },
    {
      id: 'discord',
      appId: 'com.discordapp.Discord',
      name: 'Discord',
      tagline: 'Plataforma para conversar com amigos, canais de voz com baixa latência e compartilhamento de tela.',
      category: 'Produtividade',
      version: '0.0.64',
      developer: 'Discord Inc.',
      size: '92.1 MB',
      rating: 4.7,
      downloads: '8.4M',
      installed: false,
      iconGradient: 'from-indigo-600 via-blue-600 to-purple-700',
      permissions: ['Microfone & Câmera', 'Rede', 'Wayland ScreenCapture'],
    },
    {
      id: 'steam',
      appId: 'com.valvesoftware.Steam',
      name: 'Steam (Valve)',
      tagline: 'Plataforma definitiva de jogos no Linux com compatibilidade Proton para jogos Windows.',
      category: 'Jogos',
      version: '1.0.0.79',
      developer: 'Valve Corporation',
      size: '220.5 MB',
      rating: 4.9,
      downloads: '12.1M',
      installed: false,
      iconGradient: 'from-slate-800 via-blue-950 to-indigo-900',
      permissions: ['Aceleração 3D Vulkan/OpenGL', 'Controles Gamepad', 'Rede'],
    },
    {
      id: 'obs',
      appId: 'com.obsproject.Studio',
      name: 'OBS Studio',
      tagline: 'Software livre e de código aberto para gravação de vídeo e transmissão ao vivo profissional.',
      category: 'Áudio & Vídeo',
      version: '30.2.2',
      developer: 'OBS Project',
      size: '142.3 MB',
      rating: 4.9,
      downloads: '5.6M',
      installed: false,
      iconGradient: 'from-slate-700 via-zinc-800 to-black',
      permissions: ['Captura de Tela Wayland PipeWire', 'Câmera V4L2', 'Áudio ALSA/Pulse'],
    },
    {
      id: 'blender',
      appId: 'org.blender.Blender',
      name: 'Blender 3D',
      tagline: 'Suíte de criação 3D completa para modelagem, animação, simulação e renderização Cycles.',
      category: 'Gráficos',
      version: '4.2.1 LTS',
      developer: 'Blender Foundation',
      size: '310.8 MB',
      rating: 5.0,
      downloads: '4.7M',
      installed: false,
      iconGradient: 'from-orange-500 via-amber-600 to-blue-600',
      permissions: ['GPU Compute (CUDA / ROCm / Vulkan)', 'Sistema de Arquivos'],
    },
    {
      id: 'gimp',
      appId: 'org.gimp.GIMP',
      name: 'GIMP',
      tagline: 'Editor de imagens GNU avançado para retoque fotográfico, composição e criação artística.',
      category: 'Gráficos',
      version: '2.10.38',
      developer: 'The GIMP Team',
      size: '124.0 MB',
      rating: 4.6,
      downloads: '6.3M',
      installed: false,
      iconGradient: 'from-amber-700 via-yellow-800 to-stone-900',
      permissions: ['Sistema de Arquivos', 'Tablets Gráficos'],
    },
    {
      id: 'vlc',
      appId: 'org.videolan.VLC',
      name: 'VLC Media Player',
      tagline: 'O reprodutor multimídia que reproduz a maioria dos codecs e arquivos de áudio/vídeo.',
      category: 'Áudio & Vídeo',
      version: '3.0.21',
      developer: 'VideoLAN Organization',
      size: '68.0 MB',
      rating: 4.8,
      downloads: '11.0M',
      installed: true,
      iconGradient: 'from-orange-500 via-amber-500 to-yellow-600',
      permissions: ['Aceleração de Hardware VA-API', 'Áudio PipeWire'],
    },
    {
      id: 'libreoffice',
      appId: 'org.libreoffice.LibreOffice',
      name: 'LibreOffice Fresh',
      tagline: 'Poderosa suíte de escritório livre com editor de texto Writer, planilhas Calc e slides Impress.',
      category: 'Produtividade',
      version: '24.8.1',
      developer: 'The Document Foundation',
      size: '275.4 MB',
      rating: 4.7,
      downloads: '7.8M',
      installed: false,
      iconGradient: 'from-emerald-600 via-teal-700 to-cyan-800',
      permissions: ['Acesso a Documentos', 'Impressão CUPS'],
    },
    {
      id: 'telegram',
      appId: 'org.telegram.desktop',
      name: 'Telegram Desktop',
      tagline: 'Aplicativo de mensagens rápido e seguro com sincronização instantânea em nuvem.',
      category: 'Produtividade',
      version: '5.4.1',
      developer: 'Telegram FZ-LLC',
      size: '52.0 MB',
      rating: 4.8,
      downloads: '9.2M',
      installed: false,
      iconGradient: 'from-sky-400 via-blue-500 to-indigo-600',
      permissions: ['Rede', 'Microfone', 'Notificações'],
    },
    {
      id: 'chrome',
      appId: 'com.google.Chrome',
      name: 'Google Chrome',
      tagline: 'O navegador mais popular do mundo com velocidade, segurança e integração Google.',
      category: 'Produtividade',
      version: '128.0',
      developer: 'Google LLC',
      size: '110.0 MB',
      rating: 4.5,
      downloads: '15.4M',
      installed: false,
      iconGradient: 'from-red-500 via-yellow-400 to-green-500',
      permissions: ['Rede', 'GPU Acceleration', 'Câmera & Microfone'],
    },
    {
      id: 'postman',
      appId: 'com.getpostman.Postman',
      name: 'Postman API Platform',
      tagline: 'Construa, teste e monitore APIs REST, GraphQL e gRPC com facilidade.',
      category: 'Desenvolvimento',
      version: '11.10.0',
      developer: 'Postman Inc.',
      size: '135.0 MB',
      rating: 4.8,
      downloads: '3.9M',
      installed: false,
      iconGradient: 'from-orange-600 via-red-600 to-amber-700',
      permissions: ['Rede (localhost & WAN)', 'Armazenamento de coleções'],
    },
  ]);

  const categories = ['Todos', 'Desenvolvimento', 'Produtividade', 'Jogos', 'Áudio & Vídeo', 'Gráficos'];

  // Handle simulated Flatpak Installation
  const handleInstallFlatpak = (app: FlathubApp) => {
    setInstallingId(app.id);
    setInstallProgress(10);

    const interval = setInterval(() => {
      setInstallProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setInstallingId(null);
          setFlathubApps((prevApps) =>
            prevApps.map((a) => (a.id === app.id ? { ...a, installed: true } : a))
          );
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handleUninstall = (appId: string) => {
    setFlathubApps((prevApps) =>
      prevApps.map((a) => (a.id === appId ? { ...a, installed: false } : a))
    );
  };

  const copyFlatpakCmd = (appId: string) => {
    const cmd = `flatpak install flathub ${appId} -y`;
    navigator.clipboard?.writeText(cmd);
    setCopiedCmd(appId);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const filteredApps = flathubApps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.appId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'installed') return app.installed;
    if (selectedCategory === 'Todos') return true;
    return app.category === selectedCategory;
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans">
      {/* Top Banner Flathub */}
      <div className="p-5 bg-gradient-to-r from-blue-950/60 via-indigo-950/50 to-slate-900 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Box className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white tracking-wide">
                Flathub App Store & Flatpak Linux
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                <span>Flathub Oficial Conectado</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Aplicativos Linux isolados em sandbox com suporte a Wayland, GPU e atualizações automáticas via Flatpak.
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar apps Linux no Flathub..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="px-5 py-2.5 border-b border-white/10 bg-slate-900/40 flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('flathub')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'flathub' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Explorar Flathub
          </button>
          <button
            onClick={() => setActiveTab('installed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'installed' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Instalados no Sistema</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
              {flathubApps.filter((a) => a.installed).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('remotes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'remotes' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Repositórios Remotos
          </button>
        </div>

        {activeTab === 'flathub' && (
          <div className="hidden sm:flex items-center space-x-1 overflow-x-auto text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white/15 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Body */}
      {activeTab === 'remotes' ? (
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-3xl">
          <h3 className="text-sm font-bold text-white">Repositórios Flatpak Ativos no InoveCloud OS</h3>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  FH
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">flathub (Repositório Principal)</h4>
                  <p className="text-[11px] font-mono text-slate-400">https://dl.flathub.org/repo/flathub.flatpakrepo</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Ativo • Verificado GPG
              </span>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Branch: stable • Arquitetura: x86_64</span>
              <button
                onClick={() => alert('flatpak update executado com sucesso!')}
                className="text-blue-400 hover:underline flex items-center space-x-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Atualizar Catálogo</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => {
            const isInstalling = installingId === app.id;
            return (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.iconGradient} flex items-center justify-center text-white shadow-md shrink-0 font-black text-lg`}
                    >
                      {app.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-white truncate">{app.name}</h3>
                        <div className="flex items-center space-x-1 text-amber-400 text-xs">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{app.rating}</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-blue-300 truncate">{app.appId}</div>
                      <div className="text-[10px] text-slate-400">{app.category} • v{app.version}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                    {app.tagline}
                  </p>
                </div>

                {/* Progress bar if installing */}
                {isInstalling && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-blue-300">
                      <span>Baixando Flatpak do Flathub...</span>
                      <span>{installProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${installProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => copyFlatpakCmd(app.appId)}
                    className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-white transition cursor-pointer font-mono"
                    title="Copiar comando de terminal: flatpak install"
                  >
                    {copiedCmd === app.appId ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="w-3 h-3" />
                        <span>CLI</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center space-x-2">
                    {app.installed ? (
                      <>
                        <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Instalado</span>
                        </span>
                        <button
                          onClick={() => handleUninstall(app.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                          title="Desinstalar app"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleInstallFlatpak(app)}
                        disabled={isInstalling}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Instalar Flatpak</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default AppStoreApp;
