"use client";

import Image from "next/image";

// ── icon assets ───────────────────────────────────────────────────────────────
const imgAvatar =
  "https://www.figma.com/api/mcp/asset/a99ed0bb-5887-47ce-a031-8877365c9cfb";
const imgIconPlusExpanded =
  "https://www.figma.com/api/mcp/asset/cebfd962-7862-4f3d-a6a8-660175f45cbb";
const imgIconPlusCollapsed =
  "https://www.figma.com/api/mcp/asset/2e4b306b-cbed-487e-8d17-76e18314a513";
const imgIconSettings =
  "https://www.figma.com/api/mcp/asset/c38ba6d5-69d8-42f0-babc-1ad9b9b72461";
const imgIconLogout =
  "https://www.figma.com/api/mcp/asset/6033bc7f-a19b-4928-ab6b-499b7343012c";
const imgIconLogoutCollapsed =
  "https://www.figma.com/api/mcp/asset/bbd7c7c7-02cc-4905-b4e8-c853db851445";
const imgIconCollapseLeft =
  "https://www.figma.com/api/mcp/asset/8371b03c-eae1-4053-8d41-f4587501d654";
const imgIconExpandRight =
  "https://www.figma.com/api/mcp/asset/16b1db03-fce3-4e6d-97a2-4b2a6c94c29b";

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
  onLogout: () => void;
  disableNewCampaign?: boolean;
  activeCampaigns?: string[];
  selectedActiveIdx?: number;
  onSelectActive?: (idx: number) => void;
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
  onLogout,
  disableNewCampaign = false,
  activeCampaigns = [],
  selectedActiveIdx,
  onSelectActive,
}: SidebarProps) {
  const hasDraft = draftTitle != null;
  const draftLabel = (draftTitle?.trim() || "Untitled") + " (Draft)";
  const isNewCampaignDisabled = disableNewCampaign || hasDraft;

  return (
    <div
      className={`bg-[#2d7a45] flex flex-col h-full items-center justify-between shrink-0 relative transition-all duration-200 ${
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
          <div className="bg-white rounded-full size-[60px] shrink-0 relative overflow-hidden">
            <Image
              src={imgAvatar}
              alt="Avatar"
              fill
              className="object-cover object-left"
              unoptimized
            />
          </div>
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
              {isNewCampaignDisabled ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path d="M12 5v14M5 12h14" stroke="#a6a6a6" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <div className="relative size-6 shrink-0">
                  <Image src={imgIconPlusCollapsed} alt="New Campaign" fill className="object-contain" unoptimized />
                </div>
              )}
            </button>
            <button className="flex items-center justify-center py-[10px] w-full hover:bg-white/10 transition-colors rounded-[8px]">
              <div className="relative size-5 shrink-0">
                <Image src={imgIconSettings} alt="Settings" fill className="object-contain" unoptimized />
              </div>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center justify-center py-[10px] w-full hover:bg-white/10 transition-colors rounded-[8px]"
            >
              <div className="relative size-5 shrink-0">
                <Image src={imgIconLogoutCollapsed} alt="Log Out" fill className="object-contain" unoptimized />
              </div>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={isNewCampaignDisabled ? undefined : onNewCampaign}
              disabled={isNewCampaignDisabled}
              className={`border rounded-[8px] flex items-center gap-2 justify-center px-[26px] py-3 w-full transition-colors ${
                isNewCampaignDisabled
                  ? "bg-white border-[#a6a6a6] cursor-not-allowed"
                  : "bg-white border-[#2d7a45] hover:bg-gray-50"
              }`}
            >
              {isNewCampaignDisabled ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path d="M12 5v14M5 12h14" stroke="#a6a6a6" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <div className="relative size-6 shrink-0">
                  <Image src={imgIconPlusExpanded} alt="" fill className="object-contain" unoptimized />
                </div>
              )}
              <span
                className={`font-bold text-[20px] leading-[1.5] uppercase whitespace-nowrap ${
                  isNewCampaignDisabled ? "text-[#a6a6a6]" : "text-[#2d7a45]"
                }`}
              >
                New Campaign
              </span>
            </button>
            <button className="flex items-center gap-2 px-2 py-[10px] rounded-[8px] hover:bg-white/10 transition-colors">
              <div className="relative size-5 shrink-0">
                <Image src={imgIconSettings} alt="" fill className="object-contain" unoptimized />
              </div>
              <span className="font-bold text-[16px] leading-[26px] text-white uppercase whitespace-nowrap">
                Settings
              </span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-2 py-[10px] rounded-[8px] hover:bg-white/10 transition-colors"
            >
              <div className="relative size-5 shrink-0">
                <Image src={imgIconLogout} alt="" fill className="object-contain" unoptimized />
              </div>
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
        <div className="relative size-[27px]">
          <Image
            src={collapsed ? imgIconExpandRight : imgIconCollapseLeft}
            alt={collapsed ? "Expand" : "Collapse"}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </button>
    </div>
  );
}
