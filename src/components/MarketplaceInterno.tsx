import React, { useState } from "react";
import { Star, ShieldAlert, Award, Grid, Info, Download, Trash } from "lucide-react";

interface MarketplaceProps {
  onAddAuditLog: (msg: string) => void;
  onEmitAlert: (title: string, category: string) => void;
}

export default function MarketplaceInterno({ onAddAuditLog, onEmitAlert }: MarketplaceProps) {
  const [plugins, setPlugins] = useState([
    {
      id: "p_1",
      name: "Robô Auto-WhatsApp PRO",
      desc: "Disparo automático de links, lembretes de faturas e lembretes de ponto eletrônico diretamente no celular.",
      installed: true,
      category: "Comercial / CRM",
      price: "Incluso no Plano"
    },
    {
      id: "p_2",
      name: "Auditoria de Integridade LGPD",
      desc: "MFA reforçado, rastreabilidade completa por IP, hashing SHA-256 e termos de consentimento ativos de colaboradores.",
      installed: false,
      category: "Segurança",
      price: "Solicitar Ativação"
    },
    {
      id: "p_3",
      name: "Emissor NF-e Regional Automático",
      desc: "Integrado com prefeituras municipais para faturamento expresso sem dependências locais de certificado.",
      installed: false,
      category: "Faturamento",
      price: "Incluso no Plano"
    },
    {
      id: "p_4",
      name: "Integração Hub Slack / MS Teams",
      desc: "Envio de relatórios em tempo real de OEE industrial e fluxo de caixa negativo para canais empresariais.",
      installed: false,
      category: "Produtividade",
      price: "R$ 49/mês"
    }
  ]);

  const handleTogglePlugin = (id: string, name: string, currentlyInstalled: boolean) => {
    setPlugins(
      plugins.map((p) => {
        if (p.id === id) {
          const toggledValue = !currentlyInstalled;
          onAddAuditLog(`Plugin [Marketplace] '${name}' alterado para estado: ${toggledValue ? "Instalado" : "Desinstalado"}`);
          onEmitAlert(`Modo Marketplace: '${name}' ${toggledValue ? "instalado com sucesso" : "desvinculado da empresa"}.`, "🔵 Informativo");
          return { ...p, installed: toggledValue };
        }
        return p;
      })
    );
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/90 rounded-3xl p-6 text-white space-y-6" id="marketplace-interno-widget">
      <div>
        <span className="text-[9px] bg-indigo-505 bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 font-mono px-2.5 py-1 rounded-full uppercase font-black tracking-wider">
          Marketplace Integrado de Extensões SaaS
        </span>
        <h3 className="text-lg font-black mt-1">Habilitar Serviços & Conectores de Terceiros</h3>
        <p className="text-xs text-slate-400">Dimensione seu ecossistema adicionando apis homologadas, conectores bancários e canais de comunicação.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plugins.map((plu) => (
          <div key={plu.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition duration-300">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-1 px-2.5 bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-slate-400">
                  {plu.category}
                </span>
                <span className="text-[10px] text-indigo-400 font-mono font-bold">
                  {plu.price}
                </span>
              </div>
              <h4 className="font-extrabold text-sm">{plu.name}</h4>
              <p className="text-xs text-slate-450 text-slate-400 leading-relaxed font-sans">{plu.desc}</p>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-900/40 flex items-center justify-between">
              <span className="text-[10px] text-slate-555 text-slate-550 font-mono flex items-center gap-1">
                <Info size={11} /> Homologado Sandbox
              </span>

              <button
                onClick={() => handleTogglePlugin(plu.id, plu.name, plu.installed)}
                className={`p-2 px-4 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  plu.installed
                    ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
              >
                {plu.installed ? (
                  <>
                    <Trash size={12} /> Remover
                  </>
                ) : (
                  <>
                    <Download size={12} /> Instalar
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
