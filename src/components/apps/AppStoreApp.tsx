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
  Play
} from 'lucide-react';
import { AppStoreItem } from '../../types';

interface AppStoreAppProps {
  catalog: AppStoreItem[];
  onToggleInstall: (id: string) => void;
}

export const AppStoreApp: React.FC<AppStoreAppProps> = ({
  catalog,
  onToggleInstall,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Todos', 'Instalados', 'Cloud & DevOps', 'Databases', 'AI & ML', 'Media', 'Security'];

  const filteredItems = catalog.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (activeCategory === 'Todos') return true;
    if (activeCategory === 'Instalados') return item.installed;
    return item.category === activeCategory;
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100">
      {/* Top Banner (Umbrel 2.0 Hero) */}
      <div className="p-5 bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide">
              InoveCloud App Store & Ecosystem
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Instale aplicações, bancos de dados e ferramentas com 1 clique. Isolamento total por contêineres Docker.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar apps e serviços..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Categories Bar */}
      <div className="px-5 py-2.5 border-b border-white/10 flex items-center space-x-2 overflow-x-auto text-xs bg-slate-900/40">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
              activeCategory === cat
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-white/20 transition flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start space-x-3.5">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.iconBg} p-2.5 flex items-center justify-center shrink-0 shadow-md`}
              >
                <Layers className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white truncate">{item.name}</h3>
                  <div className="flex items-center space-x-1 text-amber-400 text-xs">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                <div className="text-[11px] text-purple-300 font-medium">{item.category} • {item.version}</div>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {item.tagline}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-400">
                Portas: <span className="font-mono text-slate-300">{item.ports}</span>
              </div>

              <div className="flex items-center space-x-2">
                {item.installed ? (
                  <>
                    <span className="flex items-center space-x-1 text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Instalado</span>
                    </span>
                    <button
                      onClick={() => onToggleInstall(item.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                      title="Desinstalar app"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onToggleInstall(item.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-600/30 transition active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Instalar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
