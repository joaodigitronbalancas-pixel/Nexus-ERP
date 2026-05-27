import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Layers, ShieldAlert, Home, Trash2 } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an untrapped exception:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };

  private handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-rose-500/30 selection:text-white">
          {/* Futuristic ambient background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-2/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 animate-fade-in">
            {/* Header / Brand status */}
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-widest mb-6">
              <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>NEXUS ERP OS • Sistema de Recuperação</span>
            </div>

            {/* Error Title */}
            <div className="space-y-4">
              <div className="inline-flex p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-white">
                Ocorreu uma exceção inesperada
              </h1>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Nossos sub-módulos de segurança capturaram uma desconexão no fluxo de renderização principal. 
                Sua integridade de dados foi preservada. Veja os detalhes abaixo:
              </p>
            </div>

            {/* Diagnostic Logs Panel */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 bg-slate-950/40 p-2 px-3 rounded-lg border border-slate-800/40">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  MÓDULO: RENDERER_ENGINE_CRITICAL
                </span>
                <span>UTC {new Date().toISOString().substring(11, 19)}</span>
              </div>

              <div className="bg-slate-950 border border-slate-800/60 rounded-2xl p-4 md:p-5 font-mono text-xs text-rose-400/90 overflow-x-auto max-h-48 shadow-inner leading-relaxed">
                <div className="text-rose-500 font-bold mb-1">
                  [Erro] {this.state.error?.name || "Exception"}: {this.state.error?.message || "Erro desconhecido"}
                </div>
                {this.state.error?.stack && (
                  <pre className="text-[10px] text-slate-500 mt-2 whitespace-pre-wrap leading-normal overflow-y-auto max-h-32">
                    {this.state.error.stack}
                  </pre>
                )}
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-[9px] text-slate-600 mt-2 border-t border-slate-900 pt-2 whitespace-pre-wrap leading-normal">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-550/10 cursor-pointer transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                Recarregar Sistema
              </button>

              <button
                onClick={this.handleClearCache}
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm px-6 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 outline-none focus:ring-2 focus:ring-slate-500"
                title="Limpar todos os dados locais salvos (redefine a simulação)"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Cache Local
              </button>
            </div>

            {/* Footer diagnostic tag */}
            <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-slate-500">
              <span>NEXUS CLOUD OS v2.4.9</span>
              <span className="text-slate-600">ID: {Math.random().toString(36).substring(2, 9).toUpperCase()}</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
