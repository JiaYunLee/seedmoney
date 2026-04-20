"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconSettings, IconLogout, IconChevronLeft, IconChevronRight } from "@/app/components/Icons";

// ── types ─────────────────────────────────────────────────────────────────────
export type SelectedNav =
  | { type: "pending"; idx: number }
  | { type: "draft" }
  | null;

export interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  pendingCampaigns: { title: string }[];
  draftTitle: string | null;
  selectedNav: SelectedNav;
  onSelectPending: (idx: number) => void;
  onSelectDraft: () => void;
  onNewCampaign: () => void;
  onSettings?: () => void;
  onLogout: () => void;
  disableNewCampaign?: boolean;
  activeCampaigns?: string[];
  selectedActiveIdx?: number;
  onSelectActive?: (idx: number) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

// ── component ─────────────────────────────────────────────────────────────────
export function Sidebar({
  collapsed,
  onToggle,
  pendingCampaigns,
  draftTitle,
  selectedNav,
  onSelectPending,
  onSelectDraft,
  onNewCampaign,
  onSettings,
  onLogout,
  disableNewCampaign = false,
  activeCampaigns = [],
  selectedActiveIdx,
  onSelectActive,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const hasDraft = draftTitle != null;
  const draftLabel = (draftTitle?.trim() || "Untitled") + " (Draft)";
  const isNewCampaignDisabled = disableNewCampaign || hasDraft;

  return (
    <>
    {/* ── Mobile bottom-sheet nav ── */}
    {mobileOpen && (
      <>
        {/* Backdrop — tap to close */}
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onMobileClose}
        />
        {/* Sheet — slides up from the bottom */}
        <div className="animate-slide-up fixed bottom-0 left-0 right-0 z-50 bg-[#2d7a45] rounded-tl-[24px] rounded-tr-[24px] flex flex-col md:hidden max-h-[72vh] overflow-y-auto">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-white/40" />
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4 p-6 shrink-0">
            <button
              onClick={() => { router.push("/dashboard"); onMobileClose?.(); }}
              className="bg-white rounded-full size-[48px] shrink-0 overflow-hidden hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              <img src="/seedmoney-logo.png" alt="SeedMoney" className="size-full object-contain p-1.5" />
            </button>
            <div className="flex flex-col items-start overflow-hidden">
              <p className="font-bold text-[20px] leading-[1.334] text-white whitespace-nowrap">John Doe</p>
              <p className="text-[14px] leading-[1.5] text-white/70 whitespace-nowrap">Campaign Leader</p>
            </div>
          </div>

          {/* Campaign list */}
          <div className="flex flex-col items-start w-full">
            <div className="flex items-center pb-[6px] px-6 w-full">
              <p className="text-[16px] leading-[1.5] text-white/90">2026 Campaign</p>
            </div>
            {activeCampaigns.map((name, idx) => (
              <button
                key={`m-active-${idx}`}
                onClick={() => { onSelectActive?.(idx); onMobileClose?.(); }}
                className={`flex items-center px-8 py-6 w-full text-left transition-colors ${
                  selectedActiveIdx === idx ? "bg-[#123a1e]" : "hover:bg-[#245f37]"
                }`}
              >
                <p className="font-bold text-[20px] leading-[1.334] text-white">{name}</p>
              </button>
            ))}
            {pendingCampaigns.map((pc, idx) => (
              <button
                key={`m-pending-${idx}`}
                onClick={() => { onSelectPending(idx); onMobileClose?.(); }}
                className={`flex items-center px-8 py-6 w-full text-left transition-colors ${
                  selectedNav?.type === "pending" && selectedNav.idx === idx
                    ? "bg-[#123a1e]" : "hover:bg-[#245f37]"
                }`}
              >
                <p className="font-bold text-[20px] leading-[1.334] text-white">
                  {(pc.title.trim() || "Untitled") + " (Pending)"}
                </p>
              </button>
            ))}
            {hasDraft && (
              <button
                onClick={() => { onSelectDraft(); onMobileClose?.(); }}
                className={`flex items-center px-8 py-6 w-full text-left transition-colors ${
                  selectedNav?.type === "draft" ? "bg-[#123a1e]" : "hover:bg-[#245f37]"
                }`}
              >
                <p className="font-bold text-[20px] leading-[1.334] text-white">{draftLabel}</p>
              </button>
            )}
          </div>

          {/* Bottom actions */}
          <div className="flex flex-col gap-2 w-full px-6 py-4 shrink-0">
            {/* New Campaign */}
            <button
              onClick={isNewCampaignDisabled ? undefined : () => { onNewCampaign(); onMobileClose?.(); }}
              disabled={isNewCampaignDisabled}
              className={`flex items-center gap-2 justify-center px-[26px] py-3 rounded-[8px] w-full transition-colors ${
                isNewCampaignDisabled
                  ? "bg-white/20 cursor-not-allowed"
                  : "bg-white hover:bg-[#f0f7f1]"
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M12 5v14M5 12h14" stroke={isNewCampaignDisabled ? "#a6a6a6" : "#123a1e"} strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className={`font-bold text-[20px] leading-[1.5] uppercase whitespace-nowrap ${
                isNewCampaignDisabled ? "text-[#a6a6a6]" : "text-[#123a1e]"
              }`}>New Campaign</span>
            </button>

            {/* Settings + Log out — side by side */}
            <div className="flex gap-2 items-start w-full">
              <button
                onClick={() => setShowSettings(true)}
                className="flex flex-1 items-center gap-2 px-2 py-[10px] rounded-[8px] hover:bg-white/10 transition-colors"
              >
                <IconSettings size={32} color="white" className="shrink-0" />
                <span className="font-bold text-[16px] leading-[26px] text-white uppercase whitespace-nowrap">Settings</span>
              </button>
              <button
                onClick={onLogout}
                className="flex flex-1 items-center gap-2 px-2 py-[10px] rounded-[8px] hover:bg-white/10 transition-colors"
              >
                <IconLogout size={20} color="white" className="shrink-0" />
                <span className="font-bold text-[16px] leading-[26px] text-white uppercase whitespace-nowrap">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </>
    )}

    {/* ── Desktop sidebar ── */}
    <div
      className={`hidden md:flex bg-[#2d7a45] flex-col h-full items-center justify-between shrink-0 relative transition-all duration-200 ${
        collapsed ? "w-[105px]" : "w-[280px]"
      }`}
    >
      {/* Top: profile + campaigns */}
      <div className="flex flex-col items-center w-full">
        {/* Profile */}
        <div
          className={`flex items-center pt-[60px] pb-8 px-6 w-full ${
            collapsed ? "justify-center" : "gap-4"
          }`}
        >
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white rounded-full size-[60px] shrink-0 overflow-hidden hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            <img src="/seedmoney-logo.png" alt="SeedMoney" className="size-full object-contain p-2" />
          </button>
          {!collapsed && (
            <div className="flex flex-col items-start overflow-hidden">
              <p className="font-bold text-[24px] leading-[1.334] text-white whitespace-nowrap">
                John Doe
              </p>
              <p className="text-[16px] leading-[1.5] text-white/70 whitespace-nowrap">
                Campaign Leader
              </p>
            </div>
          )}
        </div>

        {/* Campaign list */}
        <div className="flex flex-col items-start w-full">
          {collapsed ? (
            <>
              <div className="h-[48px] w-full" />
              {activeCampaigns.map((_, idx) => (
                <button
                  key={`active-${idx}`}
                  onClick={() => onSelectActive?.(idx)}
                  className={`flex h-[80px] items-center px-6 w-full transition-colors ${
                    selectedActiveIdx === idx ? "bg-[#1a4a28]" : "hover:bg-[#245f37]"
                  }`}
                >
                  <div className="bg-white rounded-full size-[13px] shrink-0" />
                </button>
              ))}
              {pendingCampaigns.map((_, idx) => (
                <button
                  key={`pending-${idx}`}
                  onClick={() => onSelectPending(idx)}
                  className={`flex h-[80px] items-center px-6 w-full transition-colors ${
                    selectedNav?.type === "pending" && selectedNav.idx === idx
                      ? "bg-[#1a4a28]"
                      : "hover:bg-[#245f37]"
                  }`}
                >
                  <div className="bg-white rounded-full size-[13px] shrink-0" />
                </button>
              ))}
              {hasDraft && (
                <button
                  onClick={onSelectDraft}
                  className={`flex h-[80px] items-center px-6 w-full transition-colors ${
                    selectedNav?.type === "draft" ? "bg-[#1a4a28]" : "hover:bg-[#245f37]"
                  }`}
                >
                  <div className="bg-white rounded-full size-[13px] shrink-0" />
                </button>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center px-6 py-3 w-full">
                <p className="text-[16px] leading-[1.5] text-white/90">2026 Campaign</p>
              </div>
              {activeCampaigns.map((name, idx) => (
                <button
                  key={`active-${idx}`}
                  onClick={() => onSelectActive?.(idx)}
                  className={`flex items-center px-12 py-6 w-full text-left transition-colors ${
                    selectedActiveIdx === idx ? "bg-[#1a4a28]" : "hover:bg-[#245f37]"
                  }`}
                >
                  <p className="font-bold text-[20px] leading-[1.6] text-white">{name}</p>
                </button>
              ))}
              {pendingCampaigns.map((pc, idx) => (
                <button
                  key={`pending-${idx}`}
                  onClick={() => onSelectPending(idx)}
                  className={`flex items-center px-12 py-6 w-full text-left transition-colors ${
                    selectedNav?.type === "pending" && selectedNav.idx === idx
                      ? "bg-[#1a4a28]"
                      : "hover:bg-[#245f37]"
                  }`}
                >
                  <p className="font-bold text-[20px] leading-[1.6] text-white">
                    {(pc.title.trim() || "Untitled") + " (Pending)"}
                  </p>
                </button>
              ))}
              {hasDraft && (
                <button
                  onClick={onSelectDraft}
                  className={`flex items-center px-12 py-6 w-full text-left transition-colors ${
                    selectedNav?.type === "draft" ? "bg-[#1a4a28]" : "hover:bg-[#245f37]"
                  }`}
                >
                  <p className="font-bold text-[20px] leading-[1.6] text-white">{draftLabel}</p>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom: actions */}
      <div
        className={`flex flex-col gap-2 w-full py-8 ${
          collapsed ? "px-3 items-center" : "px-6"
        }`}
      >
        {collapsed ? (
          <>
            <button
              onClick={isNewCampaignDisabled ? undefined : onNewCampaign}
              disabled={isNewCampaignDisabled}
              className={`rounded-[4px] flex items-center justify-center p-[14px] w-full transition-colors ${
                isNewCampaignDisabled
                  ? "bg-white border border-[#a6a6a6] cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M12 5v14M5 12h14" stroke={isNewCampaignDisabled ? "#a6a6a6" : "#123a1e"} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button onClick={onSettings} className="flex items-center justify-center py-[10px] w-full hover:bg-white/10 transition-colors rounded-[8px]">
              <IconSettings size={20} color="white" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center justify-center py-[10px] w-full hover:bg-white/10 transition-colors rounded-[8px]"
            >
              <IconLogout size={20} color="white" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={isNewCampaignDisabled ? undefined : onNewCampaign}
              disabled={isNewCampaignDisabled}
              className={`rounded-[8px] flex items-center gap-2 justify-center px-[26px] py-3 w-full transition-colors ${
                isNewCampaignDisabled
                  ? "bg-white/20 cursor-not-allowed"
                  : "bg-white hover:bg-[#f0f7f1]"
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M12 5v14M5 12h14" stroke={isNewCampaignDisabled ? "#a6a6a6" : "#123a1e"} strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span
                className={`font-bold text-[20px] leading-[1.5] uppercase whitespace-nowrap ${
                  isNewCampaignDisabled ? "text-[#a6a6a6]" : "text-[#123a1e]"
                }`}
              >
                New Campaign
              </span>
            </button>
            <button onClick={onSettings} className="flex items-center gap-2 px-2 py-[10px] rounded-[8px] hover:bg-white/10 transition-colors">
              <IconSettings size={20} color="white" className="shrink-0" />
              <span className="font-bold text-[16px] leading-[26px] text-white uppercase whitespace-nowrap">
                Settings
              </span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-2 py-[10px] rounded-[8px] hover:bg-white/10 transition-colors"
            >
              <IconLogout size={20} color="white" className="shrink-0" />
              <span className="font-bold text-[16px] leading-[26px] text-white uppercase whitespace-nowrap">
                Log Out
              </span>
            </button>
          </>
        )}
      </div>

      {/* Collapse / expand toggle button */}
      <button
        onClick={onToggle}
        className={`absolute top-[124px] bg-white border-[3.4px] border-[#2d7a45] rounded-full size-[48px] flex items-center justify-center z-10 hover:bg-gray-50 transition-colors ${
          collapsed ? "-right-[24px]" : "-right-[25px]"
        }`}
      >
        {collapsed ? (
          <IconChevronRight size={27} color="#2d7a45" />
        ) : (
          <IconChevronLeft size={27} color="#2d7a45" />
        )}
      </button>
    </div>

    {/* ── Settings overlay (mobile) ── */}
    {showSettings && (
      <>
        {/* Dim backdrop — sits above the nav sheet (z-50) but below the dialog */}
        <div
          className="fixed inset-0 z-[60] bg-black/10"
          onClick={() => setShowSettings(false)}
        />
        {/* Dialog card */}
        <div className="fixed inset-0 z-[61] flex items-center justify-center px-4 pointer-events-none">
          <div
            className="pointer-events-auto bg-white rounded-[4px] w-full max-w-[400px] shadow-[0px_11px_15px_-7px_rgba(0,0,0,0.20),0px_24px_38px_3px_rgba(0,0,0,0.14),0px_9px_46px_8px_rgba(0,0,0,0.12)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
              <span className="font-bold text-[20px] leading-[1.334] text-[#123a1e]">Settings</span>
              <button
                onClick={() => setShowSettings(false)}
                className="flex items-center justify-center size-8 rounded-full hover:bg-black/5 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="#123a1e" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Rows */}
            <div className="flex flex-col divide-y divide-black/10">
              {/* Name */}
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] leading-[1.5] text-[#666666] uppercase tracking-wide">Name</span>
                  <span className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">John Doe</span>
                </div>
                <button className="border border-[#123a1e] rounded-[4px] px-4 py-1.5 bg-white hover:bg-[#f0f7f1] transition-colors">
                  <span className="font-bold text-[14px] leading-[1.5] text-[#123a1e] uppercase">Edit</span>
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] leading-[1.5] text-[#666666] uppercase tracking-wide">Email</span>
                  <span className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">johndoe@email.com</span>
                </div>
                <button className="border border-[#123a1e] rounded-[4px] px-4 py-1.5 bg-white hover:bg-[#f0f7f1] transition-colors">
                  <span className="font-bold text-[14px] leading-[1.5] text-[#123a1e] uppercase">Edit</span>
                </button>
              </div>

              {/* Password */}
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] leading-[1.5] text-[#666666] uppercase tracking-wide">Password</span>
                  <span className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)] tracking-widest">••••••••</span>
                </div>
                <button className="border border-[#123a1e] rounded-[4px] px-4 py-1.5 bg-white hover:bg-[#f0f7f1] transition-colors">
                  <span className="font-bold text-[14px] leading-[1.5] text-[#123a1e] uppercase">Edit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
}
