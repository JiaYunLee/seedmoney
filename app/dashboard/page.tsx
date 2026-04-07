"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";

// ── icon assets ──────────────────────────────────────────────────────────────
const imgAvatar =
  "https://www.figma.com/api/mcp/asset/a99ed0bb-5887-47ce-a031-8877365c9cfb";
// sidebar expanded state icons
const imgIconPlusExpanded =
  "https://www.figma.com/api/mcp/asset/cebfd962-7862-4f3d-a6a8-660175f45cbb";
const imgIconSettings =
  "https://www.figma.com/api/mcp/asset/c38ba6d5-69d8-42f0-babc-1ad9b9b72461";
const imgIconLogout =
  "https://www.figma.com/api/mcp/asset/6033bc7f-a19b-4928-ab6b-499b7343012c";
// collapse arrow (< when expanded, > when collapsed)
const imgIconCollapseLeft =
  "https://www.figma.com/api/mcp/asset/8371b03c-eae1-4053-8d41-f4587501d654";
const imgIconExpandRight =
  "https://www.figma.com/api/mcp/asset/16b1db03-fce3-4e6d-97a2-4b2a6c94c29b";
// sidebar collapsed state icons
const imgIconPlusCollapsed =
  "https://www.figma.com/api/mcp/asset/2e4b306b-cbed-487e-8d17-76e18314a513";
const imgIconSettingsCollapsed =
  "https://www.figma.com/api/mcp/asset/c38ba6d5-69d8-42f0-babc-1ad9b9b72461";
const imgIconLogoutCollapsed =
  "https://www.figma.com/api/mcp/asset/bbd7c7c7-02cc-4905-b4e8-c853db851445";
// dashboard content icons
const imgIconDollar =
  "https://www.figma.com/api/mcp/asset/fc65b734-bd9c-4aa4-a7e7-2a10991848e0";
const imgIconPeople =
  "https://www.figma.com/api/mcp/asset/f53e3da8-3e76-474a-bc1d-63167359e164";
const imgIconDays =
  "https://www.figma.com/api/mcp/asset/eeaf5cc8-ceb7-4d8d-aaba-286661878105";
const imgIconArrowOut =
  "https://www.figma.com/api/mcp/asset/976d1267-6bc8-4019-8fa1-df91ddf1c5f0";
const imgIconCaretDown =
  "https://www.figma.com/api/mcp/asset/4ab9620f-28f5-4421-92b1-57d98917f6da";
// dialog close icon
const imgIconClose =
  "https://www.figma.com/api/mcp/asset/4d365179-df4b-40e0-85ac-ac8e544f226b";
// analytics chart assets
const imgChartHorizontalLines =
  "https://www.figma.com/api/mcp/asset/cd9a157c-65d6-4cec-a0cc-53ccd9ddcf80";
const imgChartVerticalLines =
  "https://www.figma.com/api/mcp/asset/91bc9913-11d0-4637-86c3-b2f00ab3b99b";
const imgChartAreaFill =
  "https://www.figma.com/api/mcp/asset/5e962a56-bdf3-4c26-bd7f-99f7b0c469fa";
const imgChartDailyLine =
  "https://www.figma.com/api/mcp/asset/ae4e3678-502c-4e9c-bb50-8537e57d9a7e";
const imgChartTotalFill =
  "https://www.figma.com/api/mcp/asset/18951f09-16c9-4fd5-8878-b528eb37583c";
const imgChartTotalLine =
  "https://www.figma.com/api/mcp/asset/19f27dfc-3d57-43c9-8a81-a09c1ae3116c";
const imgChartToday =
  "https://www.figma.com/api/mcp/asset/095c7883-d58d-49f2-b6c3-af47b3d405df";
const imgChartGoal =
  "https://www.figma.com/api/mcp/asset/92e34e01-e94d-4686-ab33-4de3ba820e48";
const imgChartLegendDaily =
  "https://www.figma.com/api/mcp/asset/07311517-dd52-4d91-82f0-ee9dda37612c";
const imgChartLegendTotal =
  "https://www.figma.com/api/mcp/asset/b8bfb574-19d7-42ee-b241-380d0b7402d8";

// ── mock data ─────────────────────────────────────────────────────────────────
const CAMPAIGNS = [
  { id: 1, name: "Save the Ocean Campaign" },
  { id: 2, name: "Community Garden Project" },
  { id: 3, name: "Save the Garden" },
];

const FAQ_ITEMS = [
  {
    q: "What grants are available?",
    a: "Every approved campaign in the SeedMoney Challenge is eligible for a matching grant of up to $500. Grants are awarded based on fundraising milestones: campaigns that raise at least $150 from 3 or more donors qualify for a base grant, with larger grants for campaigns that reach higher thresholds. Full details are in your Grantee Agreement.",
  },
  {
    q: "How and when do I thank my donors?",
    a: "We encourage you to thank donors within 48 hours of their contribution. You can send personal messages directly through your campaign dashboard. SeedMoney also sends an automated receipt to every donor, but a personal note from you goes a long way.",
  },
  {
    q: "When will my project receive its funds?",
    a: "Funds are typically disbursed within 30 days after your campaign closes, provided all required documentation has been submitted and verified. International projects may take slightly longer due to transfer processing times.",
  },
  {
    q: "How do I update my payment or contact details?",
    a: "You can update your payment and contact information at any time from the Settings page in your dashboard. If you run into any issues, use the Need Help form below and our team will assist you within one business day.",
  },
];

const DONORS = Array.from({ length: 10 }, () => ({
  id: 3640,
  reward: "No Reward -...",
  amount: "$100.00",
  contributor: "Robert Ande...",
  email: "randerson@...",
  card: "**** **** ***...",
  date: "2025-12-10",
  status: "Success",
}));

// ── shared footer ─────────────────────────────────────────────────────────────
function DashboardFooter({ className }: { className?: string }) {
  return (
    <div
      className={`border-t border-[#b5b5b5] flex items-center justify-between pt-6 font-[family-name:var(--font-opensans)] text-[14px] text-[#666] ${className ?? ""}`}
    >
      <span>© 2026 SeedMoney All Rights Reserved.</span>
      <div className="flex gap-6 items-center">
        <a href="#" className="hover:underline">SeedMoney Challenge</a>
        <a href="#" className="hover:underline">Contact</a>
        <a href="#" className="hover:underline">FAQ</a>
        <a href="#" className="hover:underline">Terms</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
      </div>
    </div>
  );
}

// ── new campaign modal ────────────────────────────────────────────────────────
function NewCampaignModal({
  onClose,
  onStart,
}: {
  onClose: () => void;
  onStart: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[4px] shadow-[0px_9px_46px_8px_rgba(0,0,0,0.12),0px_24px_38px_3px_rgba(0,0,0,0.14),0px_11px_15px_-7px_rgba(0,0,0,0.2)] w-[657px] max-w-[90vw] flex flex-col overflow-hidden">
        {/* Title */}
        <div className="flex items-center justify-between px-6 py-4">
          <p className="font-bold text-[20px] leading-[1.6] text-[#1a4a28]">
            SeedMoney Challenge Application
          </p>
          <button
            onClick={onClose}
            className="size-6 relative flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <Image src={imgIconClose} alt="Close" fill className="object-contain" unoptimized />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 px-6 pb-5 font-normal text-[16px] leading-[1.5]">
          <p className="text-[#666]">
            SeedMoney supports nonprofit and community-based food garden
            projects through a combination of online fundraising tools and grant
            funding.
          </p>
          <ul className="list-disc ms-6 text-black">
            <li>
              By completing this application, you are applying to participate in
              the SeedMoney Challenge and to run a 30-day online fundraising
              campaign supported by SeedMoney running from 11/15/2026-12/15/2026
            </li>
          </ul>
          <p className="text-[#666]">
            Most applicants complete this application in 20–30 minutes.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end p-2">
          <button
            onClick={onStart}
            className="bg-[#2d7a45] text-white font-bold text-[14px] leading-[16px] px-[14px] py-[10px] rounded-[8px] uppercase hover:bg-[#245f37] transition-colors"
          >
            Start application
          </button>
        </div>
      </div>
    </div>
  );
}

// ── sidebar ───────────────────────────────────────────────────────────────────
type SelectedNav =
  | { type: "pending"; idx: number }
  | { type: "draft" }
  | null;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeCampaignId: number | null;
  onCampaignSelect: (id: number) => void;
  onNewCampaign: () => void;
  onLogout: () => void;
  campaigns?: typeof CAMPAIGNS;
  draftTitle?: string | null;
  pendingCampaigns: { title: string }[];
  selectedNav: SelectedNav;
  onSelectPending: (idx: number) => void;
  onSelectDraft: () => void;
}

function Sidebar({
  collapsed,
  onToggle,
  activeCampaignId,
  onCampaignSelect,
  onNewCampaign,
  onLogout,
  campaigns = [],
  draftTitle,
  pendingCampaigns,
  selectedNav,
  onSelectPending,
  onSelectDraft,
}: SidebarProps) {
  const hasDraft = draftTitle != null;
  const draftLabel = (draftTitle?.trim() || "Untitled") + " (Draft)";
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
              {campaigns.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCampaignSelect(c.id)}
                  className={`flex h-[80px] items-center px-6 w-full transition-colors ${
                    activeCampaignId === c.id ? "bg-[#1a4a28]" : "hover:bg-[#245f37]"
                  }`}
                >
                  <div className="bg-white rounded-full size-[13px] shrink-0" />
                </button>
              ))}
            </>
          ) : (
            <>
              <div className="flex items-center px-6 py-3 w-full">
                <p className="text-[16px] leading-[1.5] text-white/90">2026 Campaign</p>
              </div>
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
              {campaigns.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCampaignSelect(c.id)}
                  className={`flex items-center px-12 py-6 w-full text-left transition-colors ${
                    activeCampaignId === c.id ? "bg-[#1a4a28]" : "hover:bg-[#245f37]"
                  }`}
                >
                  <p className="font-bold text-[20px] leading-[1.6] text-white">{c.name}</p>
                </button>
              ))}
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
            {/* Collapsed: icon-only buttons */}
            <button
              onClick={hasDraft ? undefined : onNewCampaign}
              disabled={hasDraft}
              className={`rounded-[4px] flex items-center justify-center p-[14px] w-full transition-colors ${hasDraft ? "bg-white opacity-50 cursor-not-allowed" : "bg-white hover:bg-gray-50"}`}
            >
              <div className="relative size-6 shrink-0">
                <Image src={imgIconPlusCollapsed} alt="New Campaign" fill className="object-contain" unoptimized />
              </div>
            </button>
            <button className="flex items-center justify-center py-[10px] w-full hover:bg-white/10 transition-colors rounded-[8px]">
              <div className="relative size-5 shrink-0">
                <Image src={imgIconSettingsCollapsed} alt="Settings" fill className="object-contain" unoptimized />
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
            {/* Expanded: full buttons with labels */}
            <button
              onClick={hasDraft ? undefined : onNewCampaign}
              disabled={hasDraft}
              className={`border rounded-[8px] flex items-center gap-2 justify-center px-[26px] py-3 w-full transition-colors ${
                hasDraft
                  ? "bg-white border-[#a6a6a6] cursor-not-allowed"
                  : "bg-white border-[#2d7a45] hover:bg-gray-50"
              }`}
            >
              <div className="relative size-6 shrink-0">
                <Image src={imgIconPlusExpanded} alt="" fill className="object-contain" unoptimized />
              </div>
              <span className={`font-bold text-[20px] leading-[1.5] uppercase whitespace-nowrap ${hasDraft ? "text-[#a6a6a6]" : "text-[#2d7a45]"}`}>
                New Campaign
              </span>
            </button>
            <button className="flex items-center gap-2 justify-center px-2 py-[10px] rounded-[8px] hover:bg-white/10 transition-colors">
              <div className="relative size-5 shrink-0">
                <Image src={imgIconSettings} alt="" fill className="object-contain" unoptimized />
              </div>
              <span className="font-bold text-[16px] leading-[26px] text-white uppercase whitespace-nowrap">
                Settings
              </span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 justify-center px-2 py-[10px] rounded-[8px] hover:bg-white/10 transition-colors"
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

// ── stats cards ───────────────────────────────────────────────────────────────
function StatsCards() {
  return (
    <div className="flex gap-4 h-[296px] items-stretch w-full">
      {/* Total Raised */}
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col justify-between flex-1 p-px">
        <div className="flex items-start justify-between pt-6 px-6">
          <p className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">Total Raised</p>
          <div className="relative size-7">
            <Image src={imgIconDollar} alt="" fill className="object-contain" unoptimized />
          </div>
        </div>
        <div className="px-6">
          <div className="flex h-[80px] rounded-full overflow-hidden items-center">
            <div className="bg-[#56bd60] flex items-center justify-center h-full w-[20%] shrink-0">
              <span className="text-white text-[14px]">20%</span>
            </div>
            <div className="flex-1 h-1 bg-[#56bd60] opacity-30" />
          </div>
        </div>
        <div className="pb-6 px-6 flex flex-col gap-1">
          <p className="font-bold text-[32px] leading-[1.235] text-[#101828]">$130</p>
          <div className="flex gap-2 items-center">
            <p className="flex-1 text-[14px] leading-[1.33] text-[#6a7282]">20% of $1,200 goal</p>
            <p className="text-[14px] leading-[1.33] text-[#00a63e]">+12.5% from last week</p>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-4 flex-1">
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col justify-between flex-1 p-px">
          <div className="flex items-start justify-between pt-6 px-6">
            <p className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">Total Donors</p>
            <div className="relative size-7">
              <Image src={imgIconPeople} alt="" fill className="object-contain" unoptimized />
            </div>
          </div>
          <div className="pb-6 px-6 flex flex-col gap-1">
            <p className="font-bold text-[32px] leading-[1.235] text-[#101828]">12</p>
            <div className="flex gap-2 items-center">
              <p className="flex-1 text-[14px] leading-[1.33] text-[#6a7282]">Donors</p>
              <p className="text-[14px] leading-[1.33] text-[#00a63e]">+12.5% from last week</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col justify-between flex-1 p-px">
          <div className="flex items-start justify-between pt-6 px-6">
            <p className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">Days Remaining</p>
            <div className="relative size-7">
              <Image src={imgIconDays} alt="" fill className="object-contain" unoptimized />
            </div>
          </div>
          <div className="pb-6 px-6 flex flex-col gap-1">
            <p className="font-bold text-[32px] leading-[1.235] text-[#101828]">23</p>
            <p className="text-[14px] leading-[1.33] text-[#6a7282]">days until campaign ends</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── overview tab ──────────────────────────────────────────────────────────────
function OverviewTab() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [helpTopic, setHelpTopic] = useState("");
  const [helpDetail, setHelpDetail] = useState("");
  const canSubmit = helpTopic !== "" && helpDetail.trim() !== "";

  return (
    <div className="flex flex-col gap-12">
      <StatsCards />
      <hr className="border-[rgba(0,0,0,0.12)]" />

      {/* FAQ */}
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col gap-10 p-[25px]">
        <div className="flex items-end gap-5">
          <p className="font-bold text-[24px] leading-[1.334] text-[rgba(0,0,0,0.87)]">
            Frequently Asked Questions
          </p>
          <button className="flex items-center gap-1 shrink-0">
            <span className="text-[#0288d1] text-[16px] leading-[1.5] underline">View more</span>
            <div className="relative size-6">
              <Image src={imgIconArrowOut} alt="" fill className="object-contain" unoptimized />
            </div>
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="border border-[rgba(0,0,0,0.1)] rounded-[8px] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <p className="font-bold text-[16px] leading-[1.5] text-black">{item.q}</p>
                  <div
                    className={`relative size-6 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <Image src={imgIconCaretDown} alt="" fill className="object-contain" unoptimized />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6">
                    <p className="text-[16px] leading-[1.5] text-[#666]">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <hr className="border-[rgba(0,0,0,0.12)]" />

      {/* Need Help */}
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col gap-10 p-[25px]">
        <div className="flex flex-col gap-[10px]">
          <p className="font-bold text-[24px] leading-[1.334] text-[rgba(0,0,0,0.87)]">Need Help?</p>
          <p className="text-[16px] leading-[1.5] text-[#666]">
            Send a request to the SeedMoney team and we&apos;ll get back to you within one business day.
          </p>
        </div>
        <div className="flex flex-col gap-[10px]">
          <p className="font-bold text-[16px] leading-[1.5] text-black">What do you need help with?</p>
          <div className="relative">
            <select
              value={helpTopic}
              onChange={(e) => setHelpTopic(e.target.value)}
              className="w-full text-[16px] leading-[1.5] border-0 border-b border-[rgba(0,0,0,0.42)] bg-transparent pb-[6px] appearance-none focus:border-[#2d7a45] transition-colors text-[rgba(0,0,0,0.38)]"
            >
              <option value="">Choose a topic</option>
              <option value="campaign-edit">Request a campaign page edit</option>
              <option value="stretch-goal">Request a stretch Goal</option>
              <option value="account-issue">Request an account issue</option>
              <option value="something-else">Something else</option>
            </select>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 10l5 5 5-5" stroke="rgba(0,0,0,0.54)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[10px]">
          <p className="font-bold text-[16px] leading-[1.5] text-black">Tell us more</p>
          <input
            type="text"
            value={helpDetail}
            onChange={(e) => setHelpDetail(e.target.value)}
            placeholder="Describe what you need, the more detail, the faster we can help"
            className="w-full text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)] border-0 border-b border-[rgba(0,0,0,0.42)] bg-transparent pb-[6px] focus:border-[#2d7a45] transition-colors placeholder:text-[rgba(0,0,0,0.38)]"
          />
        </div>
        <button
          disabled={!canSubmit}
          className={`self-start flex items-center gap-2 px-5 py-[10px] rounded-[8px] transition-colors font-bold text-[16px] leading-[26px] uppercase ${
            canSubmit
              ? "bg-[#2d7a45] text-white hover:bg-[#245f37] cursor-pointer"
              : "bg-[#e0e0e0] text-[#a6a6a6] cursor-not-allowed"
          }`}
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}

// ── donors tab ────────────────────────────────────────────────────────────────
function DonorsTab() {
  return (
    <div className="flex flex-col gap-6">
      <StatsCards />
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-6 flex flex-col gap-4">
        <div>
          <p className="font-bold text-[16px] text-[rgba(0,0,0,0.87)]">Donor List</p>
          <p className="text-[14px] text-[rgba(0,0,0,0.6)]">12 donors</p>
        </div>
        <input
          type="text"
          placeholder="Contributor, Amount, etc..."
          className="w-full border border-[rgba(0,0,0,0.23)] rounded px-3 py-2 text-[14px] text-[rgba(0,0,0,0.87)] focus:border-[#2d7a45] transition-colors"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.12)]">
                {["ID", "Reward", "Amount", "Contributor", "Email", "Card", "Date", "Status"].map((h) => (
                  <th key={h} className="text-left py-3 px-2 font-bold text-[rgba(0,0,0,0.87)] whitespace-nowrap">
                    {h} ↓
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DONORS.map((d, i) => (
                <tr key={i} className="border-b border-[rgba(0,0,0,0.06)] hover:bg-gray-50">
                  <td className="py-3 px-2">{d.id}</td>
                  <td className="py-3 px-2 text-[rgba(0,0,0,0.6)]">{d.reward}</td>
                  <td className="py-3 px-2">{d.amount}</td>
                  <td className="py-3 px-2 text-[rgba(0,0,0,0.6)]">{d.contributor}</td>
                  <td className="py-3 px-2 text-[rgba(0,0,0,0.6)]">{d.email}</td>
                  <td className="py-3 px-2 text-[rgba(0,0,0,0.6)]">{d.card}</td>
                  <td className="py-3 px-2">{d.date}</td>
                  <td className="py-3 px-2">
                    <span className="border border-[#00a63e] text-[#00a63e] text-[12px] px-2 py-0.5 rounded-full">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end gap-4 text-[14px] text-[rgba(0,0,0,0.6)]">
          <span>Rows per page: 10 ▾</span>
          <span>1-5 of 13</span>
          <button className="hover:text-[rgba(0,0,0,0.87)]">{"<"}</button>
          <button className="hover:text-[rgba(0,0,0,0.87)]">{">"}</button>
        </div>
      </div>
      <button className="self-start bg-white border border-[#2d7a45] text-[#2d7a45] font-bold text-[14px] leading-[16px] px-[14px] py-[10px] rounded-[8px] uppercase hover:bg-[#def2df] transition-colors">
        Export to CSV
      </button>
    </div>
  );
}

// ── analytics tab ─────────────────────────────────────────────────────────────
function AnalyticsTab() {
  return (
    <div className="flex flex-col gap-6">
      <StatsCards />
      {/* Earnings Trend chart */}
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col gap-7 px-[25px] py-6 w-full">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <p className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">Earnings Trend</p>
            <p className="text-[14px] leading-[1.33] text-[#6a7282]">Your earnings over the campaign</p>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex gap-3 items-center">
              <div className="relative h-0 w-4">
                <Image src={imgChartLegendDaily} alt="" fill className="object-contain" unoptimized />
              </div>
              <p className="text-[14px] leading-[1.33] text-[#717182] whitespace-nowrap">Daily Earnings</p>
            </div>
            <div className="flex gap-3 items-center">
              <div className="relative h-0 w-4">
                <Image src={imgChartLegendTotal} alt="" fill className="object-contain" unoptimized />
              </div>
              <p className="text-[14px] leading-[1.33] text-[#717182] whitespace-nowrap">Total Earnings</p>
            </div>
          </div>
        </div>

        {/* Chart area */}
        <div className="relative h-[350px] w-full overflow-hidden">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-[23px] flex flex-col gap-[63px] items-end w-[30px] text-[12px] text-[#6b7280] text-right font-['Inter',sans-serif]">
            <span>$200</span>
            <span>$150</span>
            <span>$100</span>
            <span>$50</span>
            <span>$0</span>
          </div>

          {/* Horizontal grid lines */}
          <div className="absolute left-[39px] top-[23px] right-0 h-[312px]">
            <Image src={imgChartHorizontalLines} alt="" fill className="object-fill" unoptimized />
          </div>

          {/* Vertical axis line */}
          <div className="absolute left-[39px] top-[23px] w-[calc(100%-39px)] h-[310px]">
            <Image src={imgChartVerticalLines} alt="" fill className="object-fill" unoptimized />
          </div>

          {/* Daily earnings area fill */}
          <div className="absolute left-[39px] top-[45%] bottom-[9.57%] w-[60%]">
            <Image src={imgChartAreaFill} alt="" fill className="object-fill" unoptimized />
          </div>

          {/* Daily earnings line */}
          <div className="absolute left-[39px] top-[45%] bottom-[16.68%] w-[60%]">
            <Image src={imgChartDailyLine} alt="" fill className="object-fill" unoptimized />
          </div>

          {/* Total earnings fill */}
          <div className="absolute left-[39px] top-[15.71%] bottom-[8.71%] w-[60%]">
            <Image src={imgChartTotalFill} alt="" fill className="object-fill" unoptimized />
          </div>

          {/* Total earnings line */}
          <div className="absolute left-[39px] top-[15.71%] bottom-[35.43%] w-[60%]">
            <Image src={imgChartTotalLine} alt="" fill className="object-fill" unoptimized />
          </div>

          {/* Today marker */}
          <div className="absolute left-[65%] top-[23px] w-0 h-[295px]">
            <Image src={imgChartToday} alt="" fill className="object-fill" unoptimized />
          </div>

          {/* Goal line */}
          <div className="absolute left-[39px] top-[23px] right-0 h-0">
            <Image src={imgChartGoal} alt="" fill className="object-fill" unoptimized />
          </div>

          {/* Goal label chip */}
          <div className="absolute right-4 top-[5px] bg-white px-1 py-0.5">
            <span className="border border-[#2e7d32] text-[#2e7d32] text-[13px] px-2 py-0.5 rounded-full whitespace-nowrap">
              Your Goal: $180
            </span>
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-[8px] left-[39px] right-0 flex justify-between text-[12px] text-[#6b7280]">
            {["Nov 15", "Nov 20", "Nov 25", "Nov 30", "Dec 5", "Dec 10", "Dec 15"].map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── draft state ───────────────────────────────────────────────────────────────
function DraftState({ title, onContinue }: { title: string; onContinue: () => void }) {
  const displayTitle = title.trim() || "Untitled";
  return (
    <div className="flex flex-col gap-4 flex-1">
      <p className="font-bold text-[32px] leading-[1.235] text-[#1a4a28]">{displayTitle}</p>
      <div className="flex items-center border-b border-[rgba(0,0,0,0.12)]">
        {["Overview", "Donors", "Analytics"].map((tab, i) => (
          <div
            key={tab}
            className={`px-4 py-[9px] font-bold text-[14px] font-[family-name:var(--font-opensans)] ${
              i === 0 ? "text-[#2d7a45] border-b-2 border-[#2d7a45] -mb-px" : "text-[rgba(0,0,0,0.38)]"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col gap-6 items-center py-[81px] px-px">
        <div className="border-[2.1px] border-[#00a63e] rounded-full size-20 flex items-center justify-center relative overflow-hidden">
          <Image src={imgAvatar} alt="" fill className="object-cover object-left scale-[4]" unoptimized />
        </div>
        <p className="font-bold text-[24px] leading-[1.334] text-[#666] text-center max-w-[525px]">
          Your application haven&apos;t been submitted
        </p>
        <p className="text-[16px] leading-[1.5] text-[#666] text-center">
          Your application is saved as a draft. Complete your submission to move forward.
        </p>
        <button
          onClick={onContinue}
          className="bg-[#2d7a45] text-white font-bold text-[20px] leading-[1.5] uppercase px-[26px] py-3 rounded-[8px] hover:bg-[#245f37] transition-colors"
        >
          Continue Application
        </button>
      </div>
      <div className="mt-auto pt-5">
        <DashboardFooter />
      </div>
    </div>
  );
}

// ── dashboard state views ─────────────────────────────────────────────────────
function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <p className="font-bold text-[32px] leading-[1.235] text-[#096b2e]">Dashboard</p>
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col gap-6 items-center py-[81px] px-px">
        <div className="border-[2.1px] border-[#00a63e] rounded-full size-20 flex items-center justify-center relative overflow-hidden">
          <Image src={imgAvatar} alt="" fill className="object-cover object-left scale-[4]" unoptimized />
        </div>
        <p className="font-bold text-[24px] leading-[1.334] text-[#666] text-center">No campaigns created</p>
        <p className="text-[16px] leading-[1.5] text-[#666] text-center max-w-md">
          Create your first campaign to start sharing your story and receiving support.
        </p>
        <button
          onClick={onNew}
          className="bg-[#2d7a45] flex items-center gap-2 px-[26px] py-3 rounded-[8px] hover:bg-[#245f37] transition-colors"
        >
          <div className="relative size-6 shrink-0">
            <Image src={imgIconPlusExpanded} alt="" fill className="object-contain" unoptimized />
          </div>
          <span className="font-bold text-[20px] leading-[1.5] text-white uppercase whitespace-nowrap">
            New Campaign
          </span>
        </button>
      </div>
      <div className="mt-auto pt-5">
        <DashboardFooter />
      </div>
    </div>
  );
}

function ReviewState({ campaignName }: { campaignName: string }) {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <p className="font-bold text-[32px] leading-[1.235] text-[#1a4a28]">{campaignName}</p>
      <div className="flex items-center border-b border-[rgba(0,0,0,0.12)]">
        {["Overview", "Donors", "Analytics"].map((tab, i) => (
          <div
            key={tab}
            className={`px-4 py-[9px] font-bold text-[14px] font-[family-name:var(--font-opensans)] ${
              i === 0
                ? "text-[#2d7a45] border-b-2 border-[#2d7a45] -mb-px"
                : "text-[rgba(0,0,0,0.38)]"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col gap-6 items-center py-[81px] px-px">
        <div className="border-[2.1px] border-[#00a63e] rounded-full size-20 flex items-center justify-center relative overflow-hidden">
          <Image src={imgAvatar} alt="" fill className="object-cover object-left scale-[4]" unoptimized />
        </div>
        <p className="font-bold text-[24px] leading-[1.334] text-[#666] text-center">
          Your campaign is under reviewed
        </p>
        <p className="text-[16px] leading-[1.5] text-[#666] text-center max-w-md">
          We&apos;ll email you once your application is approved.
        </p>
      </div>
      <div className="mt-auto pt-5">
        <DashboardFooter />
      </div>
    </div>
  );
}

function ActiveState({
  campaignName,
  activeTab,
  onTabChange,
}: {
  campaignName: string;
  activeTab: "overview" | "donors" | "analytics";
  onTabChange: (t: "overview" | "donors" | "analytics") => void;
}) {
  const TABS: { key: "overview" | "donors" | "analytics"; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "donors", label: "Donors" },
    { key: "analytics", label: "Analytics" },
  ];

  return (
    <div className="flex flex-col gap-4 flex-1">
      <p className="font-bold text-[32px] leading-[1.235] text-[#1a4a28]">{campaignName}</p>
      <div className="flex items-center border-b border-[rgba(0,0,0,0.12)]">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={`px-4 py-[9px] font-bold text-[14px] font-[family-name:var(--font-opensans)] transition-colors ${
              activeTab === t.key
                ? "text-[#1976d2] border-b-2 border-[#1976d2] -mb-px"
                : "text-[rgba(0,0,0,0.6)] hover:text-[rgba(0,0,0,0.87)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex gap-4 items-center flex-wrap">
        <button className="bg-[#2d7a45] text-white font-bold text-[14px] leading-[16px] px-[14px] py-[10px] rounded-[8px] uppercase hover:bg-[#245f37] transition-colors">
          View Campaign Site
        </button>
        <button className="bg-white border border-[#2d7a45] text-[#2d7a45] font-bold text-[14px] leading-[16px] px-[14px] py-[10px] rounded-[8px] uppercase hover:bg-[#def2df] transition-colors">
          Copy Campaign Site Link
        </button>
        <button className="bg-white border border-[#2d7a45] text-[#2d7a45] font-bold text-[14px] leading-[16px] px-[14px] py-[10px] rounded-[8px] uppercase hover:bg-[#def2df] transition-colors">
          View Leaderboard
        </button>
      </div>
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "donors" && <DonorsTab />}
      {activeTab === "analytics" && <AnalyticsTab />}
      <div className="mt-8 pt-5">
        <DashboardFooter />
      </div>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────
// Secret key sequence: type "seed" anywhere to activate the active dashboard state
const SECRET = "seed";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams.get("state") ?? "empty";

  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "donors" | "analytics">("overview");
  const [activeCampaignId, setActiveCampaignId] = useState<number | null>(
    state === "review" ? 1 : state === "active" ? 1 : null
  );
  const [showModal, setShowModal] = useState(false);
  const [keyBuffer, setKeyBuffer] = useState("");
  const [draftTitle, setDraftTitle] = useState<string | null>(null);
  const [pendingCampaigns, setPendingCampaigns] = useState<{ title: string }[]>([]);
  const [selectedNav, setSelectedNav] = useState<SelectedNav>(null);

  // Check for saved draft / pending submission on mount
  useEffect(() => {
    const rawDraft = sessionStorage.getItem("seedmoney_draft");
    let hasDraftOnMount = false;
    if (rawDraft) {
      try { setDraftTitle(JSON.parse(rawDraft).campaignTitle ?? ""); hasDraftOnMount = true; } catch {}
    }
    const rawPending = sessionStorage.getItem("seedmoney_pending");
    let pendingArr: { title: string }[] = [];
    if (rawPending) {
      try {
        const parsed = JSON.parse(rawPending);
        if (Array.isArray(parsed)) {
          pendingArr = parsed;
        } else if (parsed && typeof parsed.title === "string") {
          // migrate old single-object format → array
          pendingArr = [{ title: parsed.title }];
          sessionStorage.setItem("seedmoney_pending", JSON.stringify(pendingArr));
        }
      } catch {}
    }
    setPendingCampaigns(pendingArr);
    // Default selection: last pending if any, otherwise draft if any
    if (pendingArr.length > 0) {
      setSelectedNav({ type: "pending", idx: pendingArr.length - 1 });
    } else if (hasDraftOnMount) {
      setSelectedNav({ type: "draft" });
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore key events when user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      const next = (keyBuffer + e.key.toLowerCase()).slice(-SECRET.length);
      setKeyBuffer(next);
      if (next === SECRET) {
        setKeyBuffer("");
        router.push("/dashboard?state=active");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyBuffer, router]);

  const hasDraft = draftTitle != null;
  const hasPending = pendingCampaigns.length > 0;
  const campaignsToShow =
    hasDraft || hasPending ? [] : state === "empty" ? [] : state === "review" ? [CAMPAIGNS[0]] : CAMPAIGNS;

  function handleNewCampaign() {
    if (hasDraft) return;
    setShowModal(true);
  }

  function handleStartApplication() {
    setShowModal(false);
    router.push("/application");
  }

  function handleContinueDraft() {
    router.push("/application");
  }

  function handleLogout() {
    router.push("/");
  }

  return (
    <>
      <div className="flex h-screen bg-[#f6faf9] overflow-hidden">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          activeCampaignId={activeCampaignId}
          onCampaignSelect={setActiveCampaignId}
          onNewCampaign={handleNewCampaign}
          onLogout={handleLogout}
          campaigns={campaignsToShow}
          draftTitle={draftTitle}
          pendingCampaigns={pendingCampaigns}
          selectedNav={selectedNav}
          onSelectPending={(idx) => setSelectedNav({ type: "pending", idx })}
          onSelectDraft={() => setSelectedNav({ type: "draft" })}
        />
        <div className="flex flex-col flex-1 min-w-0 h-full overflow-y-auto px-10 pt-[60px] pb-5">
          {state !== "active" && selectedNav?.type === "pending" && (
            <ReviewState
              campaignName={
                (pendingCampaigns[selectedNav.idx]?.title.trim() || "Untitled")
              }
            />
          )}
          {state !== "active" && selectedNav?.type === "draft" && hasDraft && (
            <DraftState title={draftTitle!} onContinue={handleContinueDraft} />
          )}
          {state !== "active" && !selectedNav && !hasDraft && !hasPending && state === "empty" && (
            <EmptyState onNew={handleNewCampaign} />
          )}
          {state !== "active" && !selectedNav && !hasDraft && !hasPending && state === "review" && (
            <ReviewState campaignName="Fully Belly Community Garden" />
          )}
          {state === "active" && (
            <ActiveState
              campaignName="Save the Ocean"
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}
        </div>
      </div>

      {showModal && (
        <NewCampaignModal
          onClose={() => setShowModal(false)}
          onStart={handleStartApplication}
        />
      )}
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
