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
  Server
} from 'lucide-react';
import { WALLPAPERS } from '../../data/mockData';
import { DesktopWidgetsConfig } from '../../types';

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
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      setUploadFeedback('Erro: Por favor, selecione um arquivo de imagem válido (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onSelectWallpaper(result);
        setUploadFeedback(`Papel de parede "${file.name}" carregado do seu PC com sucesso!`);
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

  const isCustomActive = !WALLPAPERS.some((wp) => wp.url === currentWallpaper);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto p-6 space-y-6">
      {/* Top Banner */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Settings className="w-5 h-5 text-slate-400" />
          <span>Ajustes do InoveCloud OS</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Personalização de interface Liquid Glass, papéis de parede próprios, aceleração de hardware e configurações da nuvem.
        </p>
      </div>

      {/* Custom Wallpaper Section */}
      <div className="p-5 rounded-3xl liquid-glass-card border border-white/15 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <ImageIcon className="w-4 h-4 text-purple-400" />
            <span>Papel de Parede Próprio (Do seu PC ou Link)</span>
          </h3>
          {isCustomActive && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Wallpaper Personalizado Ativo</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option A: Upload from Local PC */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center space-x-2 text-white font-semibold text-xs">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Carregar Imagem do seu Computador</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Selecione qualquer foto ou papel de parede em alta resolução direto do seu computador.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition cursor-pointer shadow-lg shadow-cyan-600/25 active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Escolher Arquivo do PC</span>
            </button>
          </div>

          {/* Option B: Insert Custom Web URL */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center space-x-2 text-white font-semibold text-xs">
                <Link className="w-4 h-4 text-indigo-400" />
                <span>Inserir Link / URL da Imagem</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Cole o link direto de uma imagem (Unsplash, Imgur, CDN, etc).
              </p>
            </div>

            <form onSubmit={handleApplyUrl} className="flex items-center space-x-2">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="https://exemplo.com/wallpaper.jpg"
                className="flex-1 bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer shadow-md active:scale-95"
              >
                Aplicar
              </button>
            </form>
          </div>
        </div>

        {uploadFeedback && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{uploadFeedback}</span>
          </div>
        )}
      </div>

      {/* Preset Wallpapers Gallery */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Coleção de Papéis de Parede InoveCloud & macOS</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {WALLPAPERS.map((wp) => {
            const isSelected = currentWallpaper === wp.url;
            return (
              <div
                key={wp.id}
                onClick={() => onSelectWallpaper(wp.url)}
                className={`group relative rounded-2xl overflow-hidden aspect-video border-2 cursor-pointer transition shadow-md ${
                  isSelected ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={wp.thumbnail}
                  alt={wp.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2.5 flex flex-col justify-end">
                  <span className="text-[11px] font-semibold text-white leading-tight">{wp.name}</span>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Widgets Configuration Section (Umbrel OS Style) */}
      {widgetsConfig && onUpdateWidgetsConfig && (
        <div className="p-5 rounded-3xl liquid-glass-card border border-white/15 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span>Configuração de Widgets da Tela Inicial (Área de Trabalho)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Escolha quais widgets exibir ou remover para deixar a área de trabalho minimalista como no Umbrel OS.
              </p>
            </div>

            {onResetWidgetsConfig && (
              <button
                onClick={onResetWidgetsConfig}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[10px] font-bold transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restaurar Padrão</span>
              </button>
            )}
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() =>
                onUpdateWidgetsConfig({
                  showTopBar: true,
                  showClockWidget: true,
                  showRamWidget: true,
                  showDesktopAppsWidget: true,
                  showWebShortcutsWidget: true,
                  showKvmWidget: true,
                })
              }
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-cyan-600/20 border border-white/10 hover:border-cyan-400/40 text-left transition cursor-pointer text-xs"
            >
              <div className="font-bold text-white">Completo</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Todos os widgets ativos</div>
            </button>

            <button
              onClick={() =>
                onUpdateWidgetsConfig({
                  showTopBar: true,
                  showClockWidget: true,
                  showRamWidget: false,
                  showDesktopAppsWidget: true,
                  showWebShortcutsWidget: false,
                  showKvmWidget: false,
                })
              }
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-400/40 text-left transition cursor-pointer text-xs"
            >
              <div className="font-bold text-white">UmbrelOS Clean</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Apps e relógio</div>
            </button>

            <button
              onClick={() =>
                onUpdateWidgetsConfig({
                  showTopBar: false,
                  showClockWidget: false,
                  showRamWidget: false,
                  showDesktopAppsWidget: true,
                  showWebShortcutsWidget: false,
                  showKvmWidget: false,
                })
              }
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-400/40 text-left transition cursor-pointer text-xs"
            >
              <div className="font-bold text-white">Só Aplicativos</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Apenas grade de apps</div>
            </button>

            <button
              onClick={() =>
                onUpdateWidgetsConfig({
                  showTopBar: false,
                  showClockWidget: false,
                  showRamWidget: false,
                  showDesktopAppsWidget: false,
                  showWebShortcutsWidget: false,
                  showKvmWidget: false,
                })
              }
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-emerald-600/20 border border-white/10 hover:border-emerald-400/40 text-left transition cursor-pointer text-xs"
            >
              <div className="font-bold text-white">Wallpaper Puro</div>
              <div className="text-[10px] text-slate-400 mt-0.5">100% tela limpa</div>
            </button>
          </div>

          {/* Toggle List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
              <div className="flex items-center space-x-2.5">
                <Cloud className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-white">Barra Superior de Status</span>
              </div>
              <input
                type="checkbox"
                checked={widgetsConfig.showTopBar}
                onChange={(e) => onUpdateWidgetsConfig({ showTopBar: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-white">Relógio & Calendário Digital</span>
              </div>
              <input
                type="checkbox"
                checked={widgetsConfig.showClockWidget}
                onChange={(e) => onUpdateWidgetsConfig({ showClockWidget: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
              <div className="flex items-center space-x-2.5">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-white">Memória RAM & Recursos</span>
              </div>
              <input
                type="checkbox"
                checked={widgetsConfig.showRamWidget}
                onChange={(e) => onUpdateWidgetsConfig({ showRamWidget: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
              <div className="flex items-center space-x-2.5">
                <Home className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">Aplicativos na Tela Inicial</span>
              </div>
              <input
                type="checkbox"
                checked={widgetsConfig.showDesktopAppsWidget}
                onChange={(e) => onUpdateWidgetsConfig({ showDesktopAppsWidget: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
              <div className="flex items-center space-x-2.5">
                <Globe className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-white">Atalhos Web & Links</span>
              </div>
              <input
                type="checkbox"
                checked={widgetsConfig.showWebShortcutsWidget}
                onChange={(e) => onUpdateWidgetsConfig({ showWebShortcutsWidget: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
              <div className="flex items-center space-x-2.5">
                <Server className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-white">Card KVM Virtualization</span>
              </div>
              <input
                type="checkbox"
                checked={widgetsConfig.showKvmWidget}
                onChange={(e) => onUpdateWidgetsConfig({ showKvmWidget: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hardware & GPU Acceleration */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Aceleração de Hardware & GPU (Umbrel Style)</span>
        </h3>

        <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
          <div>
            <div className="font-semibold text-xs text-white">Aceleração GPU (Passthrough)</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              NVIDIA RTX A5000 24GB dedicado para VNs e modelos de inteligência artificial (Ollama / LLMs).
            </div>
          </div>

          <button
            onClick={onToggleGpu}
            className={`relative w-12 h-6 rounded-full transition cursor-pointer p-0.5 ${
              gpuEnabled ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition ${
                gpuEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Cluster Node Information */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>Especificações do Nó Cloud</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-black/40 rounded-xl">
            <div className="text-slate-400">Processador</div>
            <div className="font-semibold text-white mt-1">AMD EPYC 9654 (96-Cores)</div>
          </div>
          <div className="p-3 bg-black/40 rounded-xl">
            <div className="text-slate-400">Memória Física</div>
            <div className="font-semibold text-white mt-1">64 GB DDR5 ECC 5600MHz</div>
          </div>
          <div className="p-3 bg-black/40 rounded-xl">
            <div className="text-slate-400">Storage Pool</div>
            <div className="font-semibold text-white mt-1">2x 2TB NVMe PCIe 5.0 (RAID 1)</div>
          </div>
          <div className="p-3 bg-black/40 rounded-xl">
            <div className="text-slate-400">Sistema Operacional Host</div>
            <div className="font-semibold text-white mt-1">InoveCloud CoreOS (Linux 6.8)</div>
          </div>
          <div className="p-3 bg-black/40 rounded-xl">
            <div className="text-slate-400">Região Cloud</div>
            <div className="font-semibold text-white mt-1">sa-east-1 (São Paulo, Brasil)</div>
          </div>
          <div className="p-3 bg-black/40 rounded-xl">
            <div className="text-slate-400">Latência de Rede</div>
            <div className="font-semibold text-emerald-400 mt-1">12 ms (Ultra-Low)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
