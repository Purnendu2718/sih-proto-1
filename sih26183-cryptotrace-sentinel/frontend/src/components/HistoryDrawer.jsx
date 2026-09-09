import React, { useState } from "react";
import {
  X, Trash2, Folder, FolderPlus, ArrowUp, ArrowDown,
  ExternalLink, Clock, Shield, Link, CheckSquare, Square,
  AlertCircle, Check, ChevronDown, ChevronRight, Sparkles
} from "lucide-react";
import { formatTabTitle } from "./TabBar";

/**
 * Format relative time from a timestamp (e.g., "9s ago", "4m ago", "3 hours ago", "yesterday")
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp) return "recently";
  const now = Date.now();
  const diff = Math.max(0, now - Number(timestamp));
  const seconds = Math.floor(diff / 1000);

  if (seconds < 2) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;

  return new Date(timestamp).toLocaleDateString();
}

export default function HistoryDrawer({
  isOpen = false,
  onClose,
  history = [],
  openTabs = [],
  onOpenItem, // (item) => void
  onDeleteItem, // (id) => void
  onClearAll, // () => void
  onReorderItem, // (fromIndex, toIndex) => void
  onGroupItems, // (selectedIds, groupName) => void
  onUngroupItem, // (id) => void
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());

  if (!isOpen) return null;

  // Toggle selection for case grouping
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === history.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(history.map((h) => h.id)));
    }
  };

  // Submit group creation
  const handleConfirmGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim() || selectedIds.size < 2) return;
    onGroupItems(Array.from(selectedIds), newGroupName.trim());
    setSelectedIds(new Set());
    setNewGroupName("");
    setGroupModalOpen(false);
  };

  // Toggle group collapse
  const toggleGroupCollapse = (groupName) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  };

  // Check if an address is open in one of the active tabs
  const isAddressOpen = (address) => {
    return openTabs.some(
      (t) => t.address && t.address.toLowerCase() === (address || "").toLowerCase()
    );
  };

  // Group items by their .group property
  const groupedCases = {};
  const ungroupedItems = [];

  history.forEach((item, index) => {
    const enriched = { ...item, originalIndex: index };
    if (item.group && item.group.trim()) {
      if (!groupedCases[item.group]) {
        groupedCases[item.group] = [];
      }
      groupedCases[item.group].push(enriched);
    } else {
      ungroupedItems.push(enriched);
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      {/* Drawer Container */}
      <div className="w-full max-w-xl h-full bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 animate-in slide-in-from-right duration-300">
        {/* 1. Header Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-lg shadow-sm">
              👻
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-white tracking-wide">
                  Recent Investigations & Case Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                  {history.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Organize, prioritize, and group forensic suspect addresses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setClearConfirmOpen(true)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/60 rounded-md transition"
                title="Clear all search history"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Group Action Bar (Visible when items are selected) */}
        {selectedIds.size > 0 && (
          <div className="px-4 py-2.5 bg-cyan-950/50 border-b border-cyan-800/60 flex items-center justify-between text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-cyan-300 font-medium">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <span>{selectedIds.size} searches selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="px-2 py-1 text-slate-400 hover:text-slate-200 text-[11px]"
              >
                Deselect
              </button>
              <button
                type="button"
                onClick={() => setGroupModalOpen(true)}
                disabled={selectedIds.size < 2}
                className="flex items-center gap-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold rounded-md shadow transition"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Group into Case</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Group Name Dialog (Modal overlay when clicking Group into Case) */}
        {groupModalOpen && (
          <div className="p-4 bg-slate-900 border-b border-slate-800 animate-in fade-in duration-150">
            <form onSubmit={handleConfirmGroup} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Create Case Folder for {selectedIds.size} Addresses</span>
                </span>
                <button
                  type="button"
                  onClick={() => setGroupModalOpen(false)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                autoFocus
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g. Telegram Task Scam Syndicate #402"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              />
              <div className="flex items-center justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setGroupModalOpen(false)}
                  className="px-3 py-1 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newGroupName.trim()}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold rounded-md transition"
                >
                  Confirm Group
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. Clear All Confirmation Box */}
        {clearConfirmOpen && (
          <div className="p-4 bg-rose-950/40 border-b border-rose-800/80 flex items-center justify-between text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Clear entire investigation history? This cannot be undone.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setClearConfirmOpen(false)}
                className="px-2.5 py-1 text-slate-300 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setClearConfirmOpen(false);
                }}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-md shadow text-xs"
              >
                Yes, Clear
              </button>
            </div>
          </div>
        )}

        {/* 5. Main History List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <div className="text-4xl mb-3">👻</div>
              <div className="text-sm font-semibold text-slate-400">No Recent Searches</div>
              <p className="text-xs max-w-xs mt-1">
                Any suspect addresses you investigate will be tracked here for instant access, custom case grouping, and priority ranking.
              </p>
            </div>
          ) : (
            <>
              {/* Grouped Folders Section */}
              {Object.entries(groupedCases).map(([groupName, items]) => {
                const isCollapsed = collapsedGroups.has(groupName);

                return (
                  <div
                    key={groupName}
                    className="border border-slate-800/90 rounded-xl bg-slate-900/40 overflow-hidden shadow-sm"
                  >
                    {/* Folder Header */}
                    <div
                      onClick={() => toggleGroupCollapse(groupName)}
                      className="px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition select-none"
                    >
                      <div className="flex items-center gap-2">
                        {isCollapsed ? (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                        <Folder className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-semibold text-slate-200">
                          {groupName}
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          {items.length}
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                        Case Folder
                      </span>
                    </div>

                    {/* Folder Items */}
                    {!isCollapsed && (
                      <div className="divide-y divide-slate-800/40 p-1">
                        {items.map((item) =>
                          renderHistoryRow(item, item.originalIndex)
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Ungrouped Searches Section */}
              {ungroupedItems.length > 0 && (
                <div className="space-y-1.5">
                  {Object.keys(groupedCases).length > 0 && (
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-1 pt-2">
                      Ungrouped Investigations ({ungroupedItems.length})
                    </div>
                  )}
                  <div className="divide-y divide-slate-800/40 border border-slate-800/60 rounded-xl bg-slate-900/20 p-1">
                    {ungroupedItems.map((item) =>
                      renderHistoryRow(item, item.originalIndex)
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Helper to render individual history row
  function renderHistoryRow(item, index) {
    const isSelected = selectedIds.has(item.id);
    const isOpen = isAddressOpen(item.address);
    const relativeTime = formatRelativeTime(item.timestamp);
    const canMoveUp = index > 0;
    const canMoveDown = index < history.length - 1;

    return (
      <div
        key={item.id}
        className={`group flex items-center justify-between p-2.5 rounded-lg transition ${
          isSelected
            ? "bg-cyan-950/40 border border-cyan-800/60"
            : "hover:bg-slate-900/80 border border-transparent"
        }`}
      >
        {/* Left: Checkbox + Priority Move controls + Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Checkbox */}
          <button
            type="button"
            onClick={() => handleToggleSelect(item.id)}
            className="text-slate-500 hover:text-cyan-400 shrink-0 transition"
            title={isSelected ? "Deselect" : "Select for grouping"}
          >
            {isSelected ? (
              <CheckSquare className="w-4 h-4 text-cyan-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Manual Priority Reorder Buttons (▲ / ▼) */}
          <div className="flex flex-col gap-0.5 shrink-0 opacity-40 group-hover:opacity-100 transition">
            <button
              type="button"
              disabled={!canMoveUp}
              onClick={() => onReorderItem(index, index - 1)}
              className="p-0.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 disabled:opacity-20 disabled:pointer-events-none rounded"
              title="Move Priority Up"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              disabled={!canMoveDown}
              onClick={() => onReorderItem(index, index + 1)}
              className="p-0.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 disabled:opacity-20 disabled:pointer-events-none rounded"
              title="Move Priority Down"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>

          {/* Address & Meta */}
          <div
            onClick={() => onOpenItem(item)}
            className="cursor-pointer min-w-0 flex-1"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate transition">
                {item.address}
              </span>
              {isOpen && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 shrink-0">
                  Open Tab
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 text-[11px] text-slate-400 mt-0.5 flex-wrap">
              {/* Chain Badge */}
              <span
                className={`inline-flex items-center gap-0.5 font-mono font-semibold px-1 py-0.2 rounded text-[10px] ${
                  item.chain === "EVM"
                    ? "text-amber-400 bg-amber-950/40 border border-amber-800/50"
                    : "text-blue-400 bg-blue-950/40 border border-blue-800/50"
                }`}
              >
                <Link className="w-2.5 h-2.5" />
                <span>{item.chain || "TRON"}</span>
              </span>

              {/* Destination VASP */}
              {item.destination && (
                <span className="text-cyan-400 font-medium">
                  → {item.destination}
                </span>
              )}

              {/* Relative Timestamp */}
              <span className="flex items-center gap-1 text-slate-500 font-mono text-[10px]">
                <Clock className="w-2.5 h-2.5" />
                <span>{relativeTime}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {/* Quick Open Action */}
          <button
            type="button"
            onClick={() => onOpenItem(item)}
            className="px-2.5 py-1 bg-slate-800/80 hover:bg-cyan-950/80 hover:text-cyan-300 text-slate-300 rounded border border-slate-700/80 hover:border-cyan-700/60 text-xs font-medium transition flex items-center gap-1"
            title="Open in investigation tab"
          >
            <span>Open</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          {/* Delete Record */}
          <button
            type="button"
            onClick={() => onDeleteItem(item.id)}
            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition"
            title="Delete this search record"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }
}
