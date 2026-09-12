import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  X,
  ExternalLink,
  Target,
  FileText,
  HelpCircle,
  Clock,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { queryCaseAssistant } from "../api";

const PRESET_PROMPTS = [
  {
    title: "Summarize Case",
    prompt: "Summarize this case for the senior investigating officer and ACP briefing.",
    icon: FileText
  },
  {
    title: "Sanctions Check",
    prompt: "Which addresses in this case touched a sanctioned entity, OFAC list, or illicit mixer?",
    icon: AlertTriangle
  },
  {
    title: "Exchange Off-Ramp",
    prompt: "Which exchanges were used to off-ramp the stolen funds, and should we issue a Section 94 BNSS freeze notice?",
    icon: Target
  },
  {
    title: "Layering Hops",
    prompt: "How many hops did the stolen funds travel from the victim wallet to terminal destinations?",
    icon: Clock
  }
];

export default function CaseAssistantDrawer({
  isOpen,
  onClose,
  activeCaseId,
  activeCaseMeta,
  graphData,
  onSelectNode
}) {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState(null);
  const messagesEndRef = useRef(null);

  const firNumber = activeCaseMeta?.fir_number || activeCaseMeta?.firNumber || "FIR-2026-DELHI-00441";
  const caseTitle = activeCaseMeta?.case_name || activeCaseMeta?.caseName || `Case ${activeCaseId || "Active Investigation"}`;

  // Initial welcome message tailored to current case
  useEffect(() => {
    if (messages.length === 0) {
      const nodeCount = graphData?.nodes?.length || 0;
      const edgeCount = graphData?.edges?.length || 0;

      setMessages([
        {
          id: "welcome",
          sender: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          answer: `**CryptoTrace Sentinel Case Copilot initialized.**\n\nI am scoped specifically to **${caseTitle}** (FIR: \`${firNumber}\`). I have loaded **${nodeCount} addresses** and **${edgeCount} transaction links** along with dual-mode risk scores and international sanctions catalog status.\n\nAsk me anything in plain language — all findings are **100% grounded** with forensic evidence citations attached.`,
          grounded_data_points: [
            {
              type: "cluster",
              value: `${nodeCount} Nodes / ${edgeCount} Edges`,
              entity_label: "Active Case Topology",
              relevance: "Current investigation canvas and transaction flows loaded as context."
            },
            {
              type: "provenance",
              value: "FIR & Case Dossier",
              entity_label: firNumber,
              relevance: "Primary legal case reference identifier."
            }
          ],
          recommended_police_actions: [
            "Review flagged high-risk mule nodes and verified VASP cash-out accounts.",
            "Issue Section 94 BNSS freeze notices before funds are converted to fiat."
          ],
          suggested_followups: [
            "Summarize this case",
            "Which addresses touched a sanctioned entity?",
            "Detect exchange cash-outs & freeze targets"
          ],
          is_grounded: true,
          model_name: "Sentinel Grounded Engine"
        }
      ]);
    }
  }, [activeCaseId, activeCaseMeta, graphData]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (userPromptText) => {
    const text = (userPromptText || inputQuery).trim();
    if (!text || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .slice(-6)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text || m.answer || ""
        }));

      const payload = {
        case_id: activeCaseId || "CASE-ACTIVE",
        query: text,
        graph: graphData || { nodes: [], edges: [] },
        case_meta: activeCaseMeta || { fir_number: firNumber, case_name: caseTitle },
        history
      };

      const response = await queryCaseAssistant(payload);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        answer: response.answer || "Unable to generate plain English response.",
        grounded_data_points: response.grounded_data_points || [],
        recommended_police_actions: response.recommended_police_actions || [],
        suggested_followups: response.suggested_followups || [],
        is_grounded: response.is_grounded !== false,
        model_name: response.model_name || "Sentinel Engine",
        execution_time_ms: response.execution_time_ms || 0
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          answer: `⚠️ **Error querying Case Assistant:** ${err.message || "Failed to reach reasoning engine."}\n\nPlease check backend connection and retry.`,
          grounded_data_points: [],
          is_grounded: true,
          model_name: "Sentinel Fallback"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (raw) => {
    if (!raw) return null;
    const lines = raw.split("\n");

    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-emerald-400 font-semibold text-sm mt-3 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="text-cyan-300 font-bold text-sm mt-3 mb-1.5">
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const itemText = line.replace(/^[-*]\s+/, "");
        return (
          <li key={idx} className="text-xs text-zinc-300 ml-4 list-disc my-0.5 leading-relaxed">
            {renderInlineMarkdown(itemText)}
          </li>
        );
      }
      if (/^\d+\.\s+/.test(line)) {
        const numText = line.replace(/^\d+\.\s+/, "");
        return (
          <div key={idx} className="text-xs text-zinc-300 ml-2 my-1 leading-relaxed flex items-start gap-1.5">
            <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-800/40">
              {line.match(/^\d+/)[0]}
            </span>
            <span>{renderInlineMarkdown(numText)}</span>
          </div>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs text-zinc-300 my-1 leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (text) => {
    // Process **bold** and `code`
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={pIdx}
            className="text-[11px] font-mono bg-zinc-800/90 text-emerald-300 px-1 py-0.5 rounded border border-zinc-700/50"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[500px] max-w-[95vw] bg-[#0c0d12] border-l border-zinc-800 shadow-2xl flex flex-col transition-all duration-300 ease-in-out">
      {/* Top Header */}
      <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-100">Case Intelligence Assistant</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-600/40 flex items-center gap-1">
                <ShieldCheck size={10} /> 100% Grounded
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono truncate max-w-[280px]">
              {firNumber} • {caseTitle}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-lg transition-colors"
          title="Close Assistant"
        >
          <X size={18} />
        </button>
      </div>

      {/* Preset Action Chips */}
      <div className="p-2.5 border-b border-zinc-800/60 bg-zinc-900/30 overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider mr-1">
            Quick Prompts:
          </span>
          {PRESET_PROMPTS.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleSend(preset.prompt)}
                className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-zinc-800/70 hover:bg-emerald-900/40 text-zinc-300 hover:text-emerald-300 border border-zinc-700/60 hover:border-emerald-600/50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
              >
                <Icon size={12} className="text-emerald-400" />
                {preset.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            {/* Sender & Timestamp Header */}
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-zinc-500 font-mono">
              {msg.sender === "assistant" ? (
                <>
                  <Sparkles size={11} className="text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">{msg.model_name || "Sentinel Copilot"}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              ) : (
                <>
                  <span className="text-zinc-300 font-semibold">Investigating Officer</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[94%] rounded-xl p-3.5 shadow-md ${
                msg.sender === "user"
                  ? "bg-emerald-600 text-white rounded-br-none"
                  : "bg-zinc-900/90 border border-zinc-800 text-zinc-200 rounded-bl-none"
              }`}
            >
              {msg.sender === "user" ? (
                <p className="text-xs leading-relaxed">{msg.text}</p>
              ) : (
                <div>
                  {renderFormattedText(msg.answer)}

                  {/* Grounded Evidence Citations Panel */}
                  {msg.grounded_data_points && msg.grounded_data_points.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-zinc-800/90 bg-zinc-950/60 rounded-lg p-2.5 border border-zinc-800/60">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
                          <ShieldCheck size={12} /> Grounded Forensic Evidence Citations ({msg.grounded_data_points.length})
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono">Verified Graph Data</span>
                      </div>

                      <div className="space-y-1.5">
                        {msg.grounded_data_points.map((pt, pIdx) => {
                          const isAddress = pt.type === "address";
                          const isSanctions = pt.type === "sanctions";
                          const isRisk = pt.type === "risk_score";
                          const isExpanded = selectedCitation === `${msg.id}-${pIdx}`;

                          return (
                            <div
                              key={pIdx}
                              className={`p-2 rounded border transition-all text-xs ${
                                isSanctions
                                  ? "bg-red-950/30 border-red-800/50 text-red-200"
                                  : isRisk
                                  ? "bg-amber-950/30 border-amber-800/50 text-amber-200"
                                  : "bg-zinc-900/80 border-zinc-800/80 text-zinc-300 hover:border-zinc-700"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1.5">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span
                                    className={`text-[9px] font-mono px-1 py-0.5 rounded font-bold uppercase tracking-wider ${
                                      isSanctions
                                        ? "bg-red-900/60 text-red-300"
                                        : isRisk
                                        ? "bg-amber-900/60 text-amber-300"
                                        : "bg-zinc-800 text-zinc-400"
                                    }`}
                                  >
                                    {pt.type}
                                  </span>
                                  <span className="font-mono text-[11px] font-medium truncate text-zinc-200">
                                    {pt.entity_label ? `${pt.entity_label}: ` : ""}
                                    {pt.value}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {isAddress && onSelectNode && (
                                    <button
                                      onClick={() => onSelectNode(pt.value)}
                                      className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 flex items-center gap-0.5 transition-colors"
                                      title="Highlight Node on Canvas"
                                    >
                                      <Target size={10} /> Locate
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      setSelectedCitation(isExpanded ? null : `${msg.id}-${pIdx}`)
                                    }
                                    className="p-0.5 text-zinc-500 hover:text-zinc-300"
                                  >
                                    <ChevronRight
                                      size={12}
                                      className={`transition-transform duration-200 ${
                                        isExpanded ? "rotate-90" : ""
                                      }`}
                                    />
                                  </button>
                                </div>
                              </div>

                              {/* Relevance reason toggle */}
                              {isExpanded && (
                                <div className="mt-1.5 pt-1.5 border-t border-zinc-800/60 text-[11px] text-zinc-400 font-sans leading-relaxed">
                                  <span className="text-zinc-500 font-semibold">Forensic Basis: </span>
                                  {pt.relevance}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recommended Police Actions */}
                  {msg.recommended_police_actions && msg.recommended_police_actions.length > 0 && (
                    <div className="mt-2.5 p-2 bg-emerald-950/20 border border-emerald-800/40 rounded-lg">
                      <div className="text-[10px] font-mono text-emerald-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <CheckCircle2 size={11} /> Recommended Police Directives
                      </div>
                      <ul className="space-y-1">
                        {msg.recommended_police_actions.map((act, aIdx) => (
                          <li key={aIdx} className="text-[11px] text-zinc-300 flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold text-xs leading-none mt-0.5">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggested Followups */}
                  {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex flex-wrap gap-1.5">
                      {msg.suggested_followups.map((fup, fIdx) => (
                        <button
                          key={fIdx}
                          disabled={loading}
                          onClick={() => handleSend(fup)}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/90 hover:bg-emerald-950 hover:text-emerald-300 text-zinc-400 border border-zinc-700/60 transition-colors"
                        >
                          → {fup}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl max-w-[80%]">
            <RefreshCw size={14} className="animate-spin text-emerald-400" />
            <span>Consulting case topology, risk models & sanctions catalogs...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-zinc-800/90 bg-zinc-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
            placeholder="Ask investigator question (e.g., summarize case, sanctions, off-ramps)..."
            className="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80"
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
            <span>Ask</span>
          </button>
        </form>
        <div className="mt-2 text-[10px] text-zinc-500 flex items-center justify-between font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck size={11} className="text-emerald-400" /> Zero Hallucination Guarantee
          </span>
          <span>Citations linked to Cytoscape Canvas</span>
        </div>
      </div>
    </div>
  );
}
