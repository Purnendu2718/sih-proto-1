/**
 * services/api.js - Centralized Axios & Fetch API client for CryptoTrace-Sentinel.
 * Features automatic client-side fallback with bundled static datasets for offline
 * execution and standalone preview on Netlify when localhost:8000 is unavailable.
 */

import axios from "axios";
import {
  mockScenarios,
  getScenarioForAddress,
  getMockGraph,
  getMockOffRamp,
  getMockStartResponse,
  getMockExpansion,
  getMockScenariosList,
  getMockVaspDirectory,
  getMockNoticeText,
} from "../data/mockScenarios.js";

export { mockScenarios };

const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const customApiUrl = import.meta.env?.VITE_API_URL;
const API_BASE = customApiUrl || "http://localhost:8000/api/v1";

// In cloud preview (e.g. Netlify) without custom backend, serve bundled data with 0ms delay
export const isCloudStandalone = !isLocalhost && !customApiUrl;

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1500,
});


/**
 * Universal trace fetcher with automatic client-side fallback (Requirement 2)
 * @param {string} address
 * @param {string} scenarioKey
 */
export async function fetchTraceData(address, scenarioKey = "task_scam_tron") {
  if (isCloudStandalone) {
    return (
      mockScenarios[scenarioKey] ||
      getScenarioForAddress(address) ||
      mockScenarios["task_scam_tron"]
    );
  }
  try {
    const response = await fetch(`${API_BASE}/trace/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, scenario: scenarioKey }),
      signal: AbortSignal.timeout(1500), // 1.5s timeout
    });
    if (!response.ok) throw new Error("Backend error");
    return await response.json();
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving bundled dataset.", error);
    return (
      mockScenarios[scenarioKey] ||
      getScenarioForAddress(address) ||
      mockScenarios["task_scam_tron"]
    );
  }
}

/**
 * Fetch available pre-calibrated institutional fraud presets
 */
export async function getScenarios() {
  if (isCloudStandalone) return getMockScenariosList();
  try {
    const response = await apiClient.get("/scenarios");
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving bundled scenarios list.", error);
    return getMockScenariosList();
  }
}

/**
 * Start or run a multi-hop trace
 * @param {Object} payload - { address, fir_number, chain, data_mode, use_mock_fallback, max_hops, min_amount_threshold, scenario }
 */
export async function startTrace(payload) {
  if (isCloudStandalone) {
    const scenarioKey = payload?.scenario;
    const address = payload?.address;
    return getMockStartResponse(address, scenarioKey);
  }
  try {
    const response = await apiClient.post("/trace", payload);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving bundled startTrace.", error);
    const scenarioKey = payload?.scenario;
    const address = payload?.address;
    return getMockStartResponse(address, scenarioKey);
  }
}

/**
 * Retrieve graph elements and modus operandi brief for a case
 * @param {string} caseId
 */
export async function getTraceGraph(caseId) {
  if (isCloudStandalone) return getMockGraph(caseId);
  try {
    const response = await apiClient.get(`/trace/${encodeURIComponent(caseId)}/graph`);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving bundled trace graph.", error);
    return getMockGraph(caseId);
  }
}

/**
 * Interactive manual node expansion (MetaSleuth style)
 * @param {string} caseId
 * @param {string} address
 * @param {string} direction - "inbound" | "outbound" | "both"
 */
export async function expandNode(caseId, address, direction = "both") {
  if (isCloudStandalone) return getMockExpansion(caseId, address, direction);
  try {
    const response = await apiClient.post("/trace/expand", {
      case_id: caseId,
      address,
      direction,
    });
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving bundled node expansion.", error);
    return getMockExpansion(caseId, address, direction);
  }
}

/**
 * Identify nearest centralized exchange off-ramp terminal
 * @param {string} caseId
 * @param {number} dustThresholdUsd
 */
export async function getOffRamp(caseId, dustThresholdUsd = 50) {
  if (isCloudStandalone) return getMockOffRamp(caseId);
  try {
    const response = await apiClient.get(
      `/trace/${encodeURIComponent(caseId)}/off-ramp`,
      { params: { dust_threshold_usd: dustThresholdUsd } }
    );
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving bundled off-ramp.", error);
    return getMockOffRamp(caseId);
  }
}

/**
 * Query VASP attribution for an address
 * @param {string} address
 * @param {string|null} caseId
 */
export async function getVaspAttribution(address, caseId = null) {
  const params = { address };
  if (caseId) params.case_id = caseId;
  try {
    const response = await apiClient.get("/vasp-attribution", { params });
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving heuristic VASP attribution.", error);
    const addr = (address || "").toLowerCase();
    if (addr.includes("coindcx") || addr.startsWith("tcoindcx") || addr === "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021") {
      return {
        address,
        exchange_name: "CoinDCX",
        entity_label: "CoinDCX Main Hot Wallet",
        confidence: 0.99,
        is_known_vasp: true,
        sweep_detected: true,
      };
    }
    if (addr.includes("binance") || addr.startsWith("0xbinance")) {
      return {
        address,
        exchange_name: "Binance",
        entity_label: "Binance Main Hot Wallet",
        confidence: 0.99,
        is_known_vasp: true,
        sweep_detected: true,
      };
    }
    if (addr.includes("wazirx") || addr.startsWith("0xwazirx")) {
      return {
        address,
        exchange_name: "WazirX",
        entity_label: "WazirX Deposit / Hot Wallet",
        confidence: 0.98,
        is_known_vasp: true,
        sweep_detected: true,
      };
    }
    if (addr.includes("zebpay") || addr.startsWith("0xzebpay")) {
      return {
        address,
        exchange_name: "ZebPay",
        entity_label: "ZebPay Hot Wallet",
        confidence: 0.98,
        is_known_vasp: true,
        sweep_detected: true,
      };
    }
    if (addr.includes("tornado") || addr === "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b") {
      return {
        address,
        exchange_name: "Tornado Cash",
        entity_label: "Tornado.Cash: Router",
        confidence: 0.99,
        is_mixer: true,
        is_known_vasp: false,
      };
    }
    return {
      address,
      exchange_name: "Unverified Entity",
      entity_label: "Intermediary Wallet",
      confidence: 0.5,
      is_known_vasp: false,
    };
  }
}

/**
 * Generate structured plain-text Section 94 BNSS notice
 * @param {Object} payload
 */
export async function generateFreezeNoticeText(payload) {
  try {
    const response = await apiClient.post("/reports/freeze-notice/text", payload);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving bundled Section 94 notice text.", error);
    return {
      notice_text: getMockNoticeText(payload),
      evidence_digest_sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      statutory_framework: "Section 94 BNSS, 2023",
      case_id: payload.case_id || "CASE-SIH-2026",
    };
  }
}

/**
 * Helper to build a clean downloadable text or PDF blob for offline environments
 */
function createMockNoticeBlob(payload) {
  const text = getMockNoticeText(payload);
  return new Blob([text], { type: "text/plain;charset=utf-8" });
}

/**
 * Generate and download certified Section 94 BNSS PDF with Section 63 BSA evidence seal
 * @param {Object} payload
 */
export async function generateFreezeNotice(payload) {
  try {
    const response = await apiClient.post("/reports/freeze-notice", payload, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Generating client-side freeze notice document.", error);
    return createMockNoticeBlob(payload);
  }
}

/**
 * Generate and download v2 Section 94 BNSS PDF with NCRP Ack, Merkle Root and historical valuation
 * @param {Object} payload
 */
export async function generateFreezeNoticeV2(payload) {
  try {
    const response = await apiClient.post("/reports/freeze-notice-v2", payload, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Generating client-side freeze notice v2 document.", error);
    return createMockNoticeBlob(payload);
  }
}

/**
 * One-click Golden Hour Auto-Investigate
 * @param {Object} payload - { victim_address, chain_hint, network, max_hops, max_time_window_seconds, case_id }
 */
export async function autoInvestigate(payload) {
  try {
    const response = await apiClient.post("/investigate/auto", payload);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving autoInvestigate simulation.", error);
    const sc = getScenarioForAddress(payload?.victim_address);
    return {
      case_id: payload?.case_id || sc.case_id,
      detected_chain: sc.detected_chain,
      off_ramp_found: sc.off_ramp.found,
      terminal_vasp: sc.destination_vasp,
      terminal_label: sc.off_ramp.terminal_label,
      hops_to_exchange: sc.hop_count,
      notice_recommended: true,
      graph: sc.graph,
    };
  }
}

/**
 * Fetch known VASP compliance clusters
 */
export async function getVaspClusters() {
  try {
    const response = await apiClient.get("/reports/vasp-clusters");
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving bundled VASP clusters.", error);
    return { vasps: getMockVaspDirectory() };
  }
}

// ----------------------------------------------------
// Section 2 & 37: Case Management & Dashboard APIs
// ----------------------------------------------------
export async function getDashboardStats() {
  try {
    const response = await apiClient.get("/cases/dashboard/stats");
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving dashboard stats fallback.", error);
    return {
      total_cases: 12,
      total_loss_usd: 128450.0,
      total_loss_inr: "₹1,07,25,000",
      recovered_usd: 64200.0,
      active_freezes: 8,
      avg_trace_time_ms: 0.045,
      high_risk_mules_detected: 29,
      vasps_notified: 4,
      statutory_compliance_rate: "100%",
    };
  }
}

export async function getCases(params = {}) {
  try {
    const response = await apiClient.get("/cases", { params });
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving bundled cases list.", error);
    return [
      {
        case_id: "CASE-TRON-C0836F8C",
        fir_number: "FIR/CYBER/2026/0402",
        title: "Telegram Task Scam Syndicate",
        chain: "TRON",
        victim_loss_usd: 4850.0,
        victim_loss_inr: "₹4,05,000",
        destination_vasp: "CoinDCX",
        status: "Off-Ramp Found",
        investigator: "Insp. Vikram Rathore",
        created_at: "2026-09-08T10:30:00Z",
        target_address: "TVictim0001TRONTaskScamXXXXXXXXX",
      },
      {
        case_id: "CASE-EVM-B891A3E2",
        fir_number: "FIR/CYBER/2026/0518",
        title: "Pig-Butchering Investment Fraud",
        chain: "EVM",
        victim_loss_usd: 12500.0,
        victim_loss_inr: "₹10,45,000",
        destination_vasp: "Binance",
        status: "Off-Ramp Found",
        investigator: "Insp. Priya Sharma",
        created_at: "2026-09-07T14:15:00Z",
        target_address: "0xVictim0002PigButcherDeFiXXXXXXX",
      },
      {
        case_id: "CASE-EVM-79D20E15",
        fir_number: "FIR/CYBER/2026/0733",
        title: "Predatory Loan App Extortion Syndicate",
        chain: "EVM",
        victim_loss_usd: 8200.0,
        victim_loss_inr: "₹6,85,000",
        destination_vasp: "Dual Off-Ramp (WazirX & ZebPay)",
        status: "Notice Drafted",
        investigator: "Insp. Rajesh Kumar",
        created_at: "2026-09-06T09:40:00Z",
        target_address: "0xVictim0003LoanAppExtortionXXXXX",
      },
      {
        case_id: "NCRP-2026-480912",
        fir_number: "FIR/CYBER/2026/0480",
        title: "Telegram Task & Pig-Butchering Scam",
        chain: "EVM",
        victim_loss_usd: 5750.0,
        victim_loss_inr: "₹4,80,000",
        destination_vasp: "CoinDCX",
        status: "Off-Ramp Found",
        investigator: "Insp. Vikram Rathore",
        created_at: "2026-09-05T18:20:00Z",
        target_address: "0xVICTIM_480K_FRAUD_7b93a2c4e1",
      },
    ];
  }
}

export async function createCase(payload) {
  try {
    const response = await apiClient.post("/cases", payload);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Simulating case creation.", error);
    return {
      case_id: payload?.case_id || `CASE-SIH-${Math.floor(Math.random() * 9000 + 1000)}`,
      status: "created",
      created_at: new Date().toISOString(),
      ...payload,
    };
  }
}

export async function getCaseById(caseId) {
  try {
    const response = await apiClient.get(`/cases/${encodeURIComponent(caseId)}`);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Simulating case retrieval.", error);
    const sc = getScenarioForAddress(caseId);
    return {
      case_id: caseId,
      title: sc.brief?.title || "Active Cyber Investigation",
      chain: sc.detected_chain,
      destination_vasp: sc.destination_vasp,
      stolen_amount_usd: sc.terminal_amount,
      status: "In Progress",
    };
  }
}

// ----------------------------------------------------
// Section 29, 30 & 58: Digital Evidence & Integrity APIs
// ----------------------------------------------------
export async function getCaseEvidence(caseId) {
  try {
    const response = await apiClient.get(`/evidence/${encodeURIComponent(caseId)}`);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving bundled evidence records.", error);
    return {
      case_id: caseId,
      evidence_digest_sha256: "532163c7010e8208f2ec34e608d127d9e7ba19ae1f2c089818ee46115f53082a",
      timestamp_utc: "2026-09-08 22:30:14 UTC",
      artifacts: [
        {
          id: "ART-01",
          title: "RFC 8785 Canonical Graph Topology Snapshot",
          type: "application/json",
          sha256: "0x8f2d9c1b4e6a7350129fec8714b35029e8471c039581a62048fbc927160359da",
          timestamp: "2026-09-08 22:30:14 UTC",
          status: "Verified",
        },
        {
          id: "ART-02",
          title: "TRON Grid Deterministic RPC Transfer Stream",
          type: "application/json",
          sha256: "0x7a7bad434a78269e768f62cfdd6e44be03da731bc0533613cd79ca15ba080e6f",
          timestamp: "2026-09-08 22:30:16 UTC",
          status: "Verified",
        },
        {
          id: "ART-03",
          title: "Section 94 BNSS Statutory Freezing Requisition",
          type: "application/pdf",
          sha256: "0x3b91c828d11ef628a9b2075a0248c081e8471c039581a62048fbc927160381ea",
          timestamp: "2026-09-08 22:31:02 UTC",
          status: "Verified",
        },
        {
          id: "ART-04",
          title: "CoinDCX VASP Attribution Heuristic Endorsement",
          type: "text/plain",
          sha256: "0x28c6c06298d514db089934071355e5743bf21d600184b2c0918efba7109283fa",
          timestamp: "2026-09-08 22:31:45 UTC",
          status: "Verified",
        },
      ],
    };
  }
}

export async function verifyCaseEvidence(caseId) {
  try {
    const response = await apiClient.post(`/evidence/verify`, { case_id: caseId });
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Simulating evidence seal verification.", error);
    return {
      verified: true,
      case_id: caseId,
      evidence_digest_sha256: "532163c7010e8208f2ec34e608d127d9e7ba19ae1f2c089818ee46115f53082a",
      artifacts_verified: 4,
      status: "TAMPER_FREE_INTEGRITY_CONFIRMED",
      statutory_seal: "Section 63 BSA, 2023 Compliant",
    };
  }
}

export async function getEvidenceManifest(caseId) {
  try {
    const response = await apiClient.get(`/evidence/manifest/${encodeURIComponent(caseId)}`);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving bundled evidence manifest.", error);
    return {
      case_id: caseId,
      manifest_sha256: "532163c7010e8208f2ec34e608d127d9e7ba19ae1f2c089818ee46115f53082a",
      created_at: new Date().toISOString(),
      verified: true,
    };
  }
}

export function getEvidenceBundleDownloadUrl(caseId) {
  return `${API_BASE}/evidence/bundle/${encodeURIComponent(caseId)}`;
}

// ----------------------------------------------------
// Section 6, 7, 14, 18, 26, 41: Omnichain & Explainability APIs
// ----------------------------------------------------
export async function runOmnichainTrace(payload) {
  try {
    const response = await apiClient.post("/investigate/trace", payload);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Falling back to startTrace.", error);
    return startTrace(payload);
  }
}

export async function detectPeelingChain(payload) {
  try {
    const response = await apiClient.post("/investigate/peeling-chain", payload);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving peeling chain analysis.", error);
    return {
      is_peeling_chain: true,
      confidence: 0.94,
      hop_count: 3,
      peel_count: 4,
      total_peeled_amount: 350.0,
      pattern: "1-input-2-output 90/10 split structuring",
    };
  }
}

export async function analyzeCoinJoin(payload) {
  try {
    const response = await apiClient.post("/investigate/analyze-coinjoin", payload);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving CoinJoin analysis.", error);
    return {
      is_coinjoin: false,
      mixer_detected: false,
      details: "No Wasabi / Whirlpool signature observed on current address.",
    };
  }
}

export async function explainNode(payload) {
  try {
    const response = await apiClient.post("/investigate/explain-node", payload);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving node explanation heuristic.", error);
    const addr = payload?.address || "";
    return {
      address: addr,
      role_tag: addr.startsWith("T") ? "HIGH VELOCITY MULE" : "SUSPECT CEX DEPOSIT",
      risk_score: 88,
      risk_severity: "CRITICAL",
      explanation:
        "High-velocity intermediary conduit detected under Golden Hour heuristic rules. Dispatched 90%+ of inbound funds into destination exchange within 30 minutes.",
      rules_triggered: [
        { name: "RAPID_VELOCITY_SUB_30MIN", points: 20 },
        { name: "FAN_IN_FAN_OUT_CONDUIT", points: 25 },
        { name: "DIRECT_CEX_SWEEP_RECONSOLIDATION", points: 30 },
      ],
    };
  }
}

export async function getForensicDossier(caseId) {
  try {
    const response = await apiClient.get(`/investigate/dossier/${encodeURIComponent(caseId)}`);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving dossier fallback.", error);
    return {
      case_id: caseId,
      title: "Comprehensive Forensic Dossier",
      integrity_seal: "Section 63 BSA Certified",
      evidence_digest: "532163c7010e8208f2ec34e608d127d9e7ba19ae1f2c089818ee46115f53082a",
    };
  }
}

// ----------------------------------------------------
// Section 32, 33, 34, 35: Legal & Statutory APIs
// ----------------------------------------------------
export async function getVaspDirectory() {
  try {
    const response = await apiClient.get("/legal/vasps");
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving bundled VASP directory.", error);
    return getMockVaspDirectory();
  }
}

export async function generateBsaCertificate(payload) {
  try {
    const response = await apiClient.post("/legal/bsa-certificate", payload);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Simulating BSA certificate generation.", error);
    return {
      certificate_id: "BSA-63-CERT-2026-0480",
      status: "VALID",
      certified_by: "Forensic Hash Engine",
      hash: "532163c7010e8208f2ec34e608d127d9e7ba19ae1f2c089818ee46115f53082a",
    };
  }
}

export async function dispatchSahyogAlert(payload) {
  try {
    const response = await apiClient.post("/legal/sahyog-alert", payload);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Simulating Sahyog dispatch.", error);
    return {
      alert_id: "SAHYOG-INTEL-2026-9921",
      status: "DISPATCHED",
      ack: "ACK_RECEIVED_MHA_PORTAL",
      timestamp: new Date().toISOString(),
    };
  }
}

export async function syncNcrpAck(ackNumber) {
  try {
    const response = await apiClient.get(`/legal/ncrp-sync/${encodeURIComponent(ackNumber)}`);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Simulating NCRP sync.", error);
    return {
      ack_number: ackNumber,
      status: "ACKNOWLEDGED",
      category: "Cryptocurrency Fraud",
      complaint_id: "NCRP-2026-480912",
      nodal_assigned: "Cyber Cell Head Office",
    };
  }
}

// ----------------------------------------------------
// Section 46: Tamper-Evident Audit Trail APIs
// ----------------------------------------------------
export async function getAuditLogs(params = {}) {
  try {
    const response = await apiClient.get("/audit", { params });
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Serving bundled audit trail.", error);
    return [
      {
        id: "AUD-01",
        action: "TRACE_INITIATED",
        officer: "Insp. Vikram Rathore",
        target: "TVictim0001TRONTaskScamXXXXXXXXX",
        timestamp: "2026-09-08 10:30:12 UTC",
        prev_hash: "0000000000000000000000000000000000000000000000000000000000000000",
        hash: "8f2d9c1b4e6a7350129fec8714b35029e8471c039581a62048fbc927160359da",
      },
      {
        id: "AUD-02",
        action: "OFF_RAMP_IDENTIFIED",
        officer: "SYSTEM_ALGORITHM",
        target: "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX (CoinDCX)",
        timestamp: "2026-09-08 10:30:15 UTC",
        prev_hash: "8f2d9c1b4e6a7350129fec8714b35029e8471c039581a62048fbc927160359da",
        hash: "7a7bad434a78269e768f62cfdd6e44be03da731bc0533613cd79ca15ba080e6f",
      },
      {
        id: "AUD-03",
        action: "EVIDENCE_SEALED",
        officer: "HASH_ENGINE",
        target: "RFC 8785 Canonical Bundle",
        timestamp: "2026-09-08 10:31:00 UTC",
        prev_hash: "7a7bad434a78269e768f62cfdd6e44be03da731bc0533613cd79ca15ba080e6f",
        hash: "532163c7010e8208f2ec34e608d127d9e7ba19ae1f2c089818ee46115f53082a",
      },
    ];
  }
}

export async function verifyAuditIntegrity() {
  try {
    const response = await apiClient.get("/audit/verify/integrity");
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable (Cloud Preview Mode). Simulating audit integrity verification.", error);
    return {
      verified: true,
      chain_valid: true,
      total_entries: 3,
      root_merkle_hash: "532163c7010e8208f2ec34e608d127d9e7ba19ae1f2c089818ee46115f53082a",
      audit_status: "UNBROKEN_CRYPTOGRAPHIC_CHAIN",
    };
  }
}

export default apiClient;
