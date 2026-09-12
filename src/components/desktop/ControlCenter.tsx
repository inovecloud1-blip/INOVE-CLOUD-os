import React from 'react';
import {
  Wifi,
  Zap,
  Moon,
  Sun,
  Volume2,
  Sliders,
  ShieldCheck,
  Server,
  Cloud,
  HardDrive
} from 'lucide-react';
import { AppId, SystemStats } from '../../types';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  stats: SystemStats;
  gpuEnabled: boolean;
  onToggleGpu: () => void;
  onOpenApp: (id: AppId) => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  stats,
  gpuEnabled,
  onToggleGpu,
  onOpenApp,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed right-3 top-9 z-50 w-80 liquid-glass rounded-2xl p-4 shadow-2xl border border-white/25 text-slate-100 space-y-3.5 select-none animate-fade-in">
        {/* Top 2 Big Toggles */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Cloud VPC */}
          <div className="p-3 liquid-glass-subcard rounded-xl flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-white">Cloud VPC</div>
              <div className="text-[10px] text-slate-400">10.240.0.0/16</div>
            </div>
          </div>

          {/* GPU Acceleration */}
          <div
            onClick={onToggleGpu}
            className="p-3 liquid-glass-subcard rounded-xl flex items-center space-x-3 cursor-pointer hover:bg-white/10 transition"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition ${
                gpuEnabled ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-700 text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-white">GPU Turbo</div>
              <div className="text-[10px] text-slate-400">{gpuEnabled ? 'Ativado' : 'Desativado'}</div>
            </div>
          </div>
        </div>

        {/* Small Toggles Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div
            onClick={() => { onOpenApp('webapps'); onClose(); }}
            className="p-2.5 liquid-glass-subcard rounded-xl flex items-center space-x-2.5 cursor-pointer hover:bg-white/10 transition"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <div className="font-semibold text-white">HTTPS Wildcard</div>
              <div className="text-[10px] text-emerald-400">Let's Encrypt Ativo</div>
            </div>
          </div>

          <div
            onClick={() => { onOpenApp('vn'); onClose(); }}
            className="p-2.5 liquid-glass-subcard rounded-xl flex items-center space-x-2.5 cursor-pointer hover:bg-white/10 transition"
          >
            <Server className="w-4 h-4 text-cyan-400" />
            <div className="text-xs">
              <div className="font-semibold text-white">Nós Virtuais</div>
              <div className="text-[10px] text-slate-400">{stats.vnsRunning} de {stats.vnsTotal} ativos</div>
            </div>
          </div>
        </div>

        {/* Display / Brightness Slider */}
        <div className="p-3 liquid-glass-subcard rounded-xl space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-300 font-medium">
            <span>Brilho da Tela</span>
            <span>100%</span>
          </div>
          <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div className="h-full bg-white rounded-full w-full" />
          </div>
        </div>

        {/* System Load Micro Bar */}
        <div className="p-3 liquid-glass-subcard rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between font-medium">
            <span className="text-slate-400">Carga do Cluster</span>
            <span className="text-emerald-400 font-bold">{stats.cpuUsage}% CPU • {stats.ramUsage}% RAM</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
            <div className="bg-cyan-500 h-full" style={{ width: `${stats.cpuUsage}%` }} />
            <div className="bg-indigo-500 h-full" style={{ width: `${stats.ramUsage * 0.4}%` }} />
          </div>
        </div>

        {/* Quick Link to Settings */}
        <button
          onClick={() => { onOpenApp('settings'); onClose(); }}
          className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-md shadow-blue-600/30"
        >
          Abrir Todos os Ajustes...
        </button>
      </div>
    </>
  );
};
