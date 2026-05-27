/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Hash,
  Send,
  Video,
  Mic,
  Volume2,
  PhoneCall,
  UserCheck,
  Search,
  CheckCheck,
  X,
  XCircle,
  Play
} from "lucide-react";
import { MensagemChat } from "../../types";

interface ChatInternoSectionProps {
  empresaId: string;
  usuarioNome: string;
  mensagens: MensagemChat[];
  onAddMensagem: (mensagem: string, para: string, tipo?: "texto" | "audio") => void;
}

export default function ChatInternoSection({
  empresaId,
  usuarioNome,
  mensagens,
  onAddMensagem
}: ChatInternoSectionProps) {
  // Navigation lists of channels or people
  const channels = [
    { id: "all_rh", label: "recursos-humanos", icon: "Hash" },
    { id: "all_producao", label: "fabrica-pcp", icon: "Hash" },
    { id: "all_financeiro", label: "financeiro-fiscal", icon: "Hash" }
  ];

  const mates = [
    { id: "antonio.alfa", username: "Antônio Ferreira", cargo: "Diretor Comercial", avatar: "💼" },
    { id: "bruno.fin", username: "Bruno Silva", cargo: "Analista Sênior", avatar: "💰" },
    { id: "marcia.rh", username: "Márcia Souza", cargo: "Gerente RH", avatar: "👩‍💼" },
    { id: "carlos.prod", username: "Carlos Ramos", cargo: "Supervisor PCP", avatar: "🏭" }
  ];

  const [selectedPara, setSelectedPara] = useState("all_producao");
  const [textoMensagem, setTextoMensagem] = useState("");

  // Video call simulation overlay state
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  // Voice message simulation state
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textoMensagem.trim()) return;
    onAddMensagem(textoMensagem, selectedPara, "texto");
    setTextoMensagem("");
  };

  const handleSendVoiceMsg = () => {
    onAddMensagem("🎙️ Mensagem de voz emitida (0:04 segundos)", selectedPara, "audio");
    alert("Mensagem de áudio faturada e enviada para o canal!");
  };

  // Filter messages based on destination
  const activeChannelMsgs = mensagens.filter(
    (m) => m.paraUsuario === selectedPara || (m.deUsuario === selectedPara && m.paraUsuario === usuarioNome)
  );

  const activeMateDetail = mates.find(m => m.id === selectedPara) || { username: selectedPara, cargo: "Canal Corporativo" };

  return (
    <div id="chat-interno-layout" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Módulo Chat & Comunicação Interna</h2>
          <p className="text-xs text-slate-500">Canais de departamentos isolados por Tenant corporativa e comunicações privadas de diretoria.</p>
        </div>
      </div>

      {/* Primary chat workspace */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs grid grid-cols-1 md:grid-cols-4 h-[550px] overflow-hidden">
        {/* Left Side: Directory and channels list */}
        <div className="md:col-span-1 border-r border-slate-100 bg-slate-50/50 flex flex-col justify-between py-4">
          <div className="space-y-4">
            <div className="px-4">
              <h5 className="font-extrabold text-[11px] text-slate-405 uppercase tracking-wider">Canais por Setor</h5>
              <div className="space-y-1.5 mt-2 text-xs">
                {channels.map((chan) => (
                  <button
                    key={chan.id}
                    onClick={() => setSelectedPara(chan.id)}
                    className={`w-full p-2.5 rounded-xl flex items-center gap-2 font-semibold transition text-left cursor-pointer ${
                      selectedPara === chan.id ? "bg-slate-900 text-white shadow-2xs" : "text-slate-650 hover:bg-slate-100"
                    }`}
                  >
                    <Hash size={14} className="opacity-70" />
                    <span>#{chan.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4">
              <h5 className="font-extrabold text-[11px] text-slate-405 uppercase tracking-wider">Membros Online</h5>
              <div className="space-y-1 mt-2 text-xs">
                {mates.map((mate) => (
                  <button
                    key={mate.id}
                    onClick={() => setSelectedPara(mate.id)}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between transition text-left cursor-pointer ${
                      selectedPara === mate.id ? "bg-slate-900 text-white" : "text-slate-650 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 leading-tight">
                      <span>{mate.avatar}</span>
                      <div>
                        <p className="font-bold">{mate.username}</p>
                        <p className={`text-[9px] ${selectedPara === mate.id ? "text-indigo-200" : "text-slate-400"}`}>{mate.cargo}</p>
                      </div>
                    </div>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 leading-normal">
              Logado como:<br/><strong>{usuarioNome} (ERP)</strong>
            </p>
          </div>
        </div>

        {/* Right Side: Message Logs and Input console */}
        <div className="md:col-span-3 flex flex-col justify-between h-full bg-white relative">
          {/* Header */}
          <div className="border-b border-slate-100 p-4 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
              <div>
                <h5 className="font-extrabold text-sm text-slate-900">
                  {selectedPara.startsWith("all_") ? `Canal: #${selectedPara.replace("all_", "")}` : activeMateDetail.username}
                </h5>
                <p className="text-[10px] text-zinc-400 leading-none mt-0.5">{activeMateDetail.cargo}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 scale-90">
              <button
                onClick={() => setShowVideoCall(true)}
                className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition"
                title="Chamada de Vídeo"
              >
                <Video size={16} />
              </button>
            </div>
          </div>

          {/* Messages lists */}
          <div className="grow p-6 overflow-y-auto space-y-4 bg-slate-50/10">
            {activeChannelMsgs.length > 0 ? (
              activeChannelMsgs.map((msg) => {
                const isDeMim = msg.deUsuario === usuarioNome || msg.deUsuario === "antonio.alfa" || msg.deUsuario === "admin";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[70%] rounded-2xl p-3.5 text-xs font-sans ${
                      isDeMim
                        ? "ml-auto bg-slate-900 text-white rounded-br-none"
                        : "mr-auto bg-white border border-slate-205 text-slate-800 rounded-bl-none shadow-3xs"
                    }`}
                  >
                    <span className="font-extrabold opacity-65 text-[10px] pb-1 block">
                      {msg.deUsuario}
                    </span>
                    {msg.tipo === "audio" ? (
                      <div className="flex items-center gap-2 py-1">
                        <button
                          onClick={() => alert("Reproduzindo de áudio (4s)...")}
                          className="p-1.5 bg-white text-indigo-950 rounded-full shrink-0"
                        >
                          <Play size={10} fill="currentColor" />
                        </button>
                        <span>{msg.mensagem}</span>
                      </div>
                    ) : (
                      <p className="leading-relaxed">{msg.mensagem}</p>
                    )}
                    <div className="flex items-center gap-1 justify-end font-mono text-[9px] opacity-65 mt-1.5">
                      <span>11:58</span>
                      <CheckCheck size={12} className="text-emerald-400" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-slate-400 text-center space-y-1">
                <MessageSquare size={26} className="mb-1 text-slate-300" />
                <h5 className="font-bold text-slate-700">Início de Conversa</h5>
                <p className="text-xs">Este canal foi isolado e criptografado para o plano corporativo ativo.</p>
              </div>
            )}
          </div>

          {/* Input control panel */}
          <form onSubmit={handleSendMessage} className="border-t border-slate-100 p-4 flex items-center gap-2 bg-white shrink-0">
            <button
              type="button"
              onClick={handleSendVoiceMsg}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-650 rounded-xl transition"
              title="Disparar mensagem de voz rápida"
            >
              <Mic size={16} />
            </button>
            <input
              type="text"
              value={textoMensagem}
              onChange={(e) => setTextoMensagem(e.target.value)}
              placeholder="Digite sua mensagem direta ou canal..."
              className="grow p-2 pl-3 border border-slate-200 bg-slate-50 rounded-xl text-xs focus:outline-hidden focus:border-slate-800 bg-white"
            />
            <button
              type="submit"
              className="p-2.5 bg-slate-900 text-white rounded-xl active:scale-95 transition"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* CHAMADA DE VIDEO SIMULAÇÃO OVERLAY */}
      {showVideoCall && (
        <div className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-sans">
          <div className="max-w-xl w-full border border-slate-800 rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl relative flex flex-col justify-between h-[450px]">
            {/* Upper header */}
            <div className="p-4 flex items-center justify-between text-xs text-slate-400 font-bold bg-slate-950/60 shrink-0">
              <span className="flex items-center gap-1.5"><PhoneCall size={14} className="text-indigo-400 animate-bounce" /> Chamada de Vídeo Segura ERP</span>
              <span>Canal: {activeMateDetail.username}</span>
            </div>

            {/* Video stream simulator box */}
            <div className="grow bg-radial from-slate-800 to-slate-900 p-8 flex items-center justify-center relative overflow-hidden">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center text-4xl mx-auto border-4 border-slate-700 shadow-md">
                  💼
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base">{activeMateDetail.username}</h4>
                  <p className="text-xs text-indigo-400">Aguardando atendente iniciar câmera...</p>
                </div>
              </div>

              {/* Sub screen of my webcam simulator */}
              {!isVideoMuted && (
                <div className="absolute bottom-4 right-4 w-32 h-20 bg-slate-950 border border-slate-700 rounded-xl flex items-center justify-center text-xs text-slate-400">
                  Sua Câmera 🟢
                </div>
              )}
            </div>

            {/* Sub console buttons footer */}
            <div className="p-4 bg-slate-950/80 flex items-center justify-center gap-4 shrink-0">
              <button
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                className={`p-3 rounded-full font-bold transition text-xs flex items-center gap-1.5 ${
                  isVideoMuted ? "bg-rose-600 text-white hover:bg-rose-500" : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
              >
                {isVideoMuted ? "Ligar Câmera" : "Desligar Câmera"}
              </button>
              <button
                onClick={() => setShowVideoCall(false)}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-full font-sans transition flex items-center gap-2 text-xs"
              >
                <XCircle size={16} /> Encerrar Reunião
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
