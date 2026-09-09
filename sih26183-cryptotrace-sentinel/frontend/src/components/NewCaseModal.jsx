import React, { useState } from "react";
import { FolderPlus, Shield, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { createCase } from "../services/api";

const FRAUD_TYPES = [
  "Investment Fraud",
  "Pig-Butchering",
  "Task Scam",
  "Fake Loan App",
  "Romance Scam",
  "Extortion",
  "Ransom",
  "Account Takeover",
  "Payment Fraud",
  "Other",
];

const CHAINS = ["TRON", "EVM", "Bitcoin", "Polygon", "Solana", "BNB Chain"];
const PRIORITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export default function NewCaseModal({ isOpen, onClose, onCaseCreated }) {
  const [formData, setFormData] = useState({
    case_id: `CASE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    fir_number: "FIR/CYBER/2026/",
    ncrp_ack: "NCRP-2026-",
    police_unit: "State Cyber Crime Cell, Bengaluru",
    investigator: "Inspector Rajesh Sharma",
    supervisor: "ACP K. V. Raman",
    incident_date: new Date().toISOString().split("T")[0],
    fraud_type: "Task Scam",
    victim_identifier: "VIC-REF-9021",
    reported_wallet: "",
    blockchain: "TRON",
    asset: "USDT",
    estimated_fraud_value_inr: 480000,
    incident_description: "Victim defrauded via Telegram task scam promising returns for rating hotel reviews.",
    priority: "HIGH",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reported_wallet.trim()) {
      setError("Victim-reported wallet address is mandatory.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await createCase({
        ...formData,
        estimated_fraud_value_inr: Number(formData.estimated_fraud_value_inr),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onCaseCreated) onCaseCreated(res);
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Failed to register case:", err);
      setError(err.response?.data?.detail || err.message || "Failed to create case.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07111F]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#091525] border border-[#223247] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#223247] bg-[#0E1B2D]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#00AEEF]/10 border border-[#00AEEF]/30 text-[#00AEEF]">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F5F7FA] flex items-center gap-2">
                Register New Cyber-Fraud Case
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#00AEEF]/10 border border-[#00AEEF]/30 text-[#00AEEF] font-normal">
                  Sec. 2 Case Intake
                </span>
              </h2>
              <p className="text-xs text-[#AAB7C7]">
                Sovereign electronic FIR registry conforming to NCRP & BNSS investigation standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6F7C8D] hover:text-[#F5F7FA] rounded-lg hover:bg-[#122238] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-[#EF4444]/15 border border-[#EF4444]/40 rounded-lg text-[#EF4444] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-[#22C55E]/15 border border-[#22C55E]/40 rounded-lg text-[#22C55E] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#22C55E]" />
              <span>Case registered successfully. Initializing audit trail...</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Case ID */}
            <div>
              <label className="block text-[#AAB7C7] font-semibold mb-1">Case Identifier</label>
              <input
                type="text"
                value={formData.case_id}
                onChange={(e) => setFormData({ ...formData, case_id: e.target.value })}
                className="w-full px-3 py-2 bg-[#07111F] border border-[#223247] rounded-lg text-[#F5F7FA] font-mono focus:border-[#00AEEF] outline-none"
                required
              />
            </div>

            {/* FIR Number */}
            <div>
              <label className="block text-[#AAB7C7] font-semibold mb-1">FIR Number</label>
              <input
                type="text"
                value={formData.fir_number}
                onChange={(e) => setFormData({ ...formData, fir_number: e.target.value })}
                className="w-full px-3 py-2 bg-[#07111F] border border-[#223247] rounded-lg text-[#F5F7FA] font-mono focus:border-[#00AEEF] outline-none"
                required
              />
            </div>

            {/* NCRP Acknowledgment */}
            <div>
              <label className="block text-[#AAB7C7] font-semibold mb-1">NCRP Acknowledgment No.</label>
              <input
                type="text"
                value={formData.ncrp_ack}
                onChange={(e) => setFormData({ ...formData, ncrp_ack: e.target.value })}
                className="w-full px-3 py-2 bg-[#07111F] border border-[#223247] rounded-lg text-[#F5F7FA] font-mono focus:border-[#00AEEF] outline-none"
                required
              />
            </div>

            {/* Police Unit */}
            <div>
              <label className="block text-[#AAB7C7] font-semibold mb-1">Police Unit / PS</label>
              <input
                type="text"
                value={formData.police_unit}
                onChange={(e) => setFormData({ ...formData, police_unit: e.target.value })}
                className="w-full px-3 py-2 bg-[#07111F] border border-[#223247] rounded-lg text-[#F5F7FA] focus:border-[#00AEEF] outline-none"
                required
              />
            </div>

            {/* Investigating Officer */}
            <div>
              <label className="block text-[#AAB7C7] font-semibold mb-1">Investigating Officer (IO)</label>
              <input
                type="text"
                value={formData.investigator}
                onChange={(e) => setFormData({ ...formData, investigator: e.target.value })}
                className="w-full px-3 py-2 bg-[#07111F] border border-[#223247] rounded-lg text-[#F5F7FA] focus:border-[#00AEEF] outline-none"
                required
              />
            </div>

            {/* Supervisor */}
            <div>
              <label className="block text-[#AAB7C7] font-semibold mb-1">Supervisory Officer</label>
              <input
                type="text"
                value={formData.supervisor}
                onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                className="w-full px-3 py-2 bg-[#07111F] border border-[#223247] rounded-lg text-[#F5F7FA] focus:border-[#00AEEF] outline-none"
              />
            </div>

            {/* Fraud Typology */}
            <div>
              <label className="block text-[#AAB7C7] font-semibold mb-1">Fraud Typology</label>
              <select
                value={formData.fraud_type}
                onChange={(e) => setFormData({ ...formData, fraud_type: e.target.value })}
                className="w-full px-3 py-2 bg-[#07111F] border border-[#223247] rounded-lg text-[#F5F7FA] focus:border-[#00AEEF] outline-none"
              >
                {FRAUD_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[#AAB7C7] font-semibold mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-[#07111F] border border-[#223247] rounded-lg text-[#F5F7FA] focus:border-[#00AEEF] outline-none"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Wallet Address & Blockchain */}
          <div className="pt-2 border-t border-[#223247]">
            <h3 className="text-xs font-bold text-[#F5F7FA] mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#00AEEF]" />
              Primary Target / Victim-Reported Wallet
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="md:col-span-2">
                <label className="block text-[#AAB7C7] font-semibold mb-1">Reported Wallet Address *</label>
                <input
                  type="text"
                  placeholder="e.g. TVictim0001XXXXXXXXXXXXXXXXXXXXXXX or 0x..."
                  value={formData.reported_wallet}
                  onChange={(e) => setFormData({ ...formData, reported_wallet: e.target.value })}
                  className="w-full px-3 py-2 bg-[#07111F] border border-[#223247] rounded-lg text-[#00AEEF] font-mono focus:border-[#00AEEF] outline-none text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[#AAB7C7] font-semibold mb-1">Blockchain Network</label>
                <select
                  value={formData.blockchain}
                  onChange={(e) => setFormData({ ...formData, blockchain: e.target.value })}
                  className="w-full px-3 py-2 bg-[#07111F] border border-[#223247] rounded-lg text-[#F5F7FA] focus:border-[#00AEEF] outline-none"
                >
                  {CHAINS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-3">
              <div>
                <label className="block text-[#AAB7C7] font-semibold mb-1">Estimated Value (INR ₹)</label>
                <input
                  type="number"
                  value={formData.estimated_fraud_value_inr}
                  onChange={(e) => setFormData({ ...formData, estimated_fraud_value_inr: e.target.value })}
                  className="w-full px-3 py-2 bg-[#07111F] border border-[#223247] rounded-lg text-[#22C55E] font-mono focus:border-[#00AEEF] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#AAB7C7] font-semibold mb-1">Asset Symbol</label>
                <input
                  type="text"
                  value={formData.asset}
                  onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
                  className="w-full px-3 py-2 bg-[#07111F] border border-[#223247] rounded-lg text-[#F5F7FA] font-mono focus:border-[#00AEEF] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#AAB7C7] font-semibold mb-1 text-xs">Modus Operandi Brief</label>
            <textarea
              rows={2}
              value={formData.incident_description}
              onChange={(e) => setFormData({ ...formData, incident_description: e.target.value })}
              className="w-full px-3 py-2 bg-[#07111F] border border-[#223247] rounded-lg text-[#F5F7FA] text-xs focus:border-[#00AEEF] outline-none resize-none"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-[#223247] flex items-center justify-between">
            <span className="text-[10px] text-[#6F7C8D]">
              * Conforms to BNS/BNSS Statutory Retention Rules (7 Years)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#0E1B2D] hover:bg-[#162A40] border border-[#223247] text-[#AAB7C7] hover:text-[#F5F7FA] text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-[#00AEEF] hover:bg-[#19B5FE] text-[#07111F] text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Create Case & Initialize Trace"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
