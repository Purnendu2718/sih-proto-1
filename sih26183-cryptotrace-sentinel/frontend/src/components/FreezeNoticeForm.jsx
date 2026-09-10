import { useState } from "react";
import { generateFreezeNotice } from "../api";

const initialState = {
  case_id: "", fir_number: "", ncrp_ack_number: "", investigating_officer: "",
  police_station: "", exchange_name: "", compliance_email: "",
  frozen_addresses: "", transaction_hashes: "", victim_amount_inr: "",
  narrative: "", fraud_date_ddmmyyyy: "", primary_token_symbol: "USDT",
};

export default function FreezeNoticeForm({ onClose }) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const blob = await generateFreezeNotice({
        ...form,
        frozen_addresses: form.frozen_addresses.split(",").map((s) => s.trim()).filter(Boolean),
        transaction_hashes: form.transaction_hashes.split(",").map((s) => s.trim()).filter(Boolean),
        victim_amount_inr: Number(form.victim_amount_inr),
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `freeze_notice_${form.case_id || "case"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    ["case_id", "Case ID"], ["fir_number", "FIR Number"], ["ncrp_ack_number", "NCRP Ack. No."],
    ["investigating_officer", "Investigating Officer"], ["police_station", "Police Station"],
    ["exchange_name", "Exchange Name"], ["compliance_email", "Compliance Email"],
    ["frozen_addresses", "Frozen Address(es), comma-separated"],
    ["transaction_hashes", "Transaction Hash(es), comma-separated"],
    ["victim_amount_inr", "Victim Amount (INR)"], ["fraud_date_ddmmyyyy", "Fraud Date (DD-MM-YYYY)"],
    ["primary_token_symbol", "Primary Token Symbol"],
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
      <form onSubmit={handleSubmit} className="bg-gray-800 text-gray-100 rounded-lg p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto space-y-3">
        <h3 className="text-lg font-semibold mb-2">Generate Section 94 BNSS Freeze Notice</h3>
        {fields.map(([key, label]) => (
          <div key={key}>
            <label className="text-xs text-gray-400 block mb-1">{label}</label>
            <input required value={form[key]} onChange={update(key)}
              className="w-full bg-gray-700 rounded px-2 py-1 text-sm" />
          </div>
        ))}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Narrative</label>
          <textarea required value={form.narrative} onChange={update("narrative")}
            className="w-full bg-gray-700 rounded px-2 py-1 text-sm" rows={3} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-3 py-1 text-sm rounded bg-gray-600">Cancel</button>
          <button type="submit" disabled={submitting} className="px-3 py-1 text-sm rounded bg-blue-600">
            {submitting ? "Generating…" : "Generate PDF"}
          </button>
        </div>
      </form>
    </div>
  );
}
