/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw, ShieldCheck, Database, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error captured by Nexus ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetStorage = () => {
    if (window.confirm("Atenção: Isso restaurará todos os dados originais de simulação industrial e comercial (limpando o cache local). Deseja continuar?")) {
      window.localStorage.clear();
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white">
          {/* Decorative premium elements */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 shadow-[0_1px_10px_rgba(99,102,241,0.5)]"></div>
          
          <div className="max-w-2xl w-full bg-slate-900/40 backdrop-blur-md rounded-3xl border border-indigo-500/20 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col items-center text-center space-y-6">
              {/* Shield/Alert Logo */}
              <div className="relative">
                <div className="h-16 w-16 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                  <AlertTriangle size={32} className="animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-slate-900 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400">
                  <ShieldCheck size={12} />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest font-black text-indigo-400 px-2.5 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                  Sistema de Redundância Ativo
                </span>
                <h1 className="text-2xl font-black tracking-tight text-white font-sans mt-3">
                  Nexus ERP: Desvio de Runtime Recuperado
                </h1>
                <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
                  O ambiente detectou uma falha de rendering na UI. O motor corporativo Nexus isolou o erro para proteger a persistência local e integridade de faturamento de filiais.
                </p>
              </div>

              {/* Diagnostic Box */}
              {this.state.error && (
                <div className="w-full text-left bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-xs font-mono space-y-1.5 overflow-x-auto max-h-40 shadow-inner scrollbar-thin">
                  <p className="text-rose-405 font-bold">Error: {this.state.error.message}</p>
                  {this.state.error.stack && (
                    <pre className="text-[10px] text-zinc-500 select-all leading-normal whitespace-pre-wrap font-sans mt-1">
                      {this.state.error.stack.split("\n").slice(0, 4).join("\n")}
                    </pre>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
                <button
                  type="button"
                  id="error-boundary-reload"
                  onClick={this.handleReload}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20 active:scale-98"
                >
                  <RefreshCcw size={14} />
                  Reiniciar Interface
                </button>
                <button
                  type="button"
                  id="error-boundary-reset-storage"
                  onClick={this.handleResetStorage}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Database size={14} />
                  Restaurar Dados Originais ERP
                </button>
              </div>

              <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                <span>Multi-Tenant Enterprise Console</span>
                <span>•</span>
                <span>v3.4.1</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
