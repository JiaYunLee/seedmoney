"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import { Sidebar, type SelectedNav } from "@/app/components/Sidebar";
import { LineChart } from "@mui/x-charts/LineChart";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import MuiAlert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import Slide, { type SlideProps } from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import MuiIconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MuiMenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Menu from "@mui/material/Menu";

// ── snackbar slide transition (right → left, ease-out-back) ──────────────────
function SlideLeft(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

// ── icons ─────────────────────────────────────────────────────────────────────
import { IconClose, IconDollar, IconPeople, IconTrendingUp, IconArrowSquareOut, IconCaretDown, IconExternalLink, IconExternalLinkBox, IconLegendStroke } from "@/app/components/Icons";

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

const DONORS = [
  { id: 3640, contributor: "John Smith",      amount: "$10,000.00", email: "johnsmith@gmail.com",      card: "**** **** **** 4821", date: "2025-11-03", status: "Success" },
  { id: 3641, contributor: "Jane Doe",         amount: "$15,000.00", email: "janedoe@gmail.com",         card: "**** **** **** 3307", date: "2025-11-07", status: "Success" },
  { id: 3642, contributor: "Alice Johnson",    amount: "$12,000.00", email: "alicejohnson@gmail.com",    card: "**** **** **** 9914", date: "2025-11-12", status: "Success" },
  { id: 3643, contributor: "Michael Brown",    amount: "$8,500.00",  email: "mbrown@outlook.com",        card: "**** **** **** 5562", date: "2025-11-15", status: "Success" },
  { id: 3644, contributor: "Sarah Williams",   amount: "$3,250.00",  email: "swilliams@yahoo.com",       card: "**** **** **** 7743", date: "2025-11-19", status: "Success" },
  { id: 3645, contributor: "David Martinez",   amount: "$20,000.00", email: "dmartinez@gmail.com",       card: "**** **** **** 1196", date: "2025-11-22", status: "Success" },
  { id: 3646, contributor: "Emily Chen",       amount: "$5,750.00",  email: "echen@icloud.com",          card: "**** **** **** 8834", date: "2025-11-28", status: "Success" },
  { id: 3647, contributor: "Robert Taylor",    amount: "$9,100.00",  email: "rtaylor@outlook.com",       card: "**** **** **** 2251", date: "2025-12-01", status: "Success" },
  { id: 3648, contributor: "Olivia Garcia",    amount: "$1,800.00",  email: "ogarcia@gmail.com",         card: "**** **** **** 6678", date: "2025-12-05", status: "Success" },
  { id: 3649, contributor: "James Wilson",     amount: "$14,300.00", email: "jwilson@yahoo.com",         card: "**** **** **** 4490", date: "2025-12-08", status: "Success" },
  { id: 3650, contributor: "Sophia Lee",       amount: "$6,600.00",  email: "sophialee@gmail.com",       card: "**** **** **** 3315", date: "2025-12-10", status: "Success" },
  { id: 3651, contributor: "Daniel Thompson",  amount: "$11,200.00", email: "dthompson@icloud.com",      card: "**** **** **** 7729", date: "2025-12-12", status: "Success" },
];

// ── external link confirmation modal ─────────────────────────────────────────
function ExternalLinkModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: "4px", fontFamily: "Lato, sans-serif" } }}>
      <DialogTitle sx={{ px: 3, py: 2, pb: 1 }}>
        <span style={{ fontFamily: "Lato, sans-serif", fontWeight: 700, fontSize: 20, color: "#123a1e", lineHeight: "32px" }}>
          You are about to leave the site
        </span>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 3 }}>
        <p style={{ fontFamily: "Lato, sans-serif", fontSize: 16, color: "#666", lineHeight: 1.5 }}>
          The link you have clicked will open a new website in a separate tab. Would you like to proceed?
        </p>
      </DialogContent>
      <DialogActions sx={{ px: 1, py: 1 }}>
        <button
          onClick={onClose}
          style={{ fontFamily: "Lato, sans-serif", fontWeight: 700, fontSize: 14, lineHeight: "16px", textTransform: "uppercase", color: "#666", background: "none", border: "none", cursor: "pointer", padding: "10px 8px", borderRadius: 8 }}
        >
          Cancel
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          style={{ fontFamily: "Lato, sans-serif", fontWeight: 700, fontSize: 14, lineHeight: "16px", textTransform: "uppercase", color: "white", background: "#2d7a45", border: "none", cursor: "pointer", padding: "10px 14px", borderRadius: 8, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#245f37")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2d7a45")}
        >
          Proceed
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6.667 3.333H3.333C2.597 3.333 2 3.93 2 4.667v8c0 .736.597 1.333 1.333 1.333h8c.736 0 1.333-.597 1.333-1.333V9.333" stroke="white" strokeWidth="1.333" strokeLinecap="round"/>
            <path d="M10 2h4m0 0v4M14 2L7.333 8.667" stroke="white" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </DialogActions>
    </Dialog>
  );
}

// ── shared footer ─────────────────────────────────────────────────────────────
const FOOTER_LINKS = [
  { label: "SeedMoney", href: "https://donate.seedmoney.org/" },
  { label: "Contact", href: "https://donate.seedmoney.org/contact" },
  { label: "FAQ", href: "https://donate.seedmoney.org/faq" },
  { label: "Terms", href: "https://donate.seedmoney.org/tos" },
  { label: "Privacy Policy", href: "https://donate.seedmoney.org/privacy" },
];

function DashboardFooter({ className }: { className?: string }) {
  const [externalUrl, setExternalUrl] = useState<string | null>(null);

  return (
    <>
      <div
        className={`border-t border-[#b5b5b5] pt-6 font-[family-name:var(--font-opensans)] text-[14px] text-[#666] ${className ?? ""}`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-start md:items-center order-1 md:order-2">
            {FOOTER_LINKS.map(({ label, href }) => (
              <button
                key={label}
                onClick={() => setExternalUrl(href)}
                className="hover:underline font-[family-name:var(--font-opensans)] text-[14px] text-[#666] bg-transparent border-none cursor-pointer p-0 text-left"
              >
                {label}
              </button>
            ))}
          </div>
          <span className="order-2 md:order-1">© 2026 SeedMoney All Rights Reserved.</span>
        </div>
      </div>
      {externalUrl && (
        <ExternalLinkModal url={externalUrl} onClose={() => setExternalUrl(null)} />
      )}
    </>
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
            className="size-6 flex-shrink-0 hover:opacity-70 transition-opacity flex items-center justify-center"
          >
            <IconClose size={24} color="rgba(0,0,0,0.54)" />
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

// ── sidebar: imported from @/app/components/Sidebar ──────────────────────────


// ── stats cards ───────────────────────────────────────────────────────────────
function StatsCards() {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:h-[296px] md:items-stretch w-full">
      {/* Total Raised */}
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col gap-3 md:gap-0 md:justify-between md:flex-1 p-px">
        <div className="flex items-start justify-between pt-4 px-4 md:pt-6 md:px-6">
          <p className="text-[14px] md:text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">Total Raised</p>
          <IconDollar size={20} color="#666666" className="md:hidden" />
          <IconDollar size={28} color="#666666" className="hidden md:block" />
        </div>
        <div className="px-4 md:px-6">
          <div className="flex h-10 md:h-[80px] rounded-full overflow-hidden">
            <div className="bg-[#56bd60] flex items-center justify-center h-full w-[20%] shrink-0">
              <span className="text-white text-[12px] md:text-[14px]">20%</span>
            </div>
            <div className="flex-1 h-full relative">
              <div className="absolute inset-0 bg-[#56bd60]" />
              <div className="absolute inset-0 bg-white opacity-60" />
            </div>
          </div>
        </div>
        <div className="pb-4 px-4 md:pb-6 md:px-6 flex flex-col gap-1">
          <p className="font-bold text-[24px] md:text-[32px] leading-[1.2] md:leading-[1.235] text-[#101828]">$130</p>
          <div className="flex gap-2 items-center">
            <p className="flex-1 text-[12px] md:text-[14px] leading-[1.33] text-[#6a7282]">20% of $1,200 goal</p>
            <p className="text-[12px] md:text-[14px] leading-[1.33] text-[#00a63e]">+12.5% from last week</p>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-row md:flex-col gap-4 md:flex-1">
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col justify-between flex-1 p-px">
          <div className="flex items-start justify-between pt-4 px-4 md:pt-6 md:px-6">
            <p className="text-[14px] md:text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">Total Donors</p>
            <IconPeople size={20} color="#666666" className="md:hidden" />
            <IconPeople size={28} color="#666666" className="hidden md:block" />
          </div>
          <div className="pb-4 px-4 md:pb-6 md:px-6 flex flex-col gap-1">
            <p className="font-bold text-[24px] md:text-[32px] leading-[1.2] md:leading-[1.235] text-[#101828]">12</p>
            <div className="flex gap-2 items-center">
              <p className="flex-1 text-[12px] md:text-[14px] leading-[1.33] text-[#6a7282]">Donors</p>
              <p className="hidden md:block text-[14px] leading-[1.33] text-[#00a63e]">+12.5% from last week</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col justify-between flex-1 p-px">
          <div className="flex items-start justify-between pt-4 px-4 md:pt-6 md:px-6">
            <p className="text-[14px] md:text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">Days Remaining</p>
            <IconTrendingUp size={20} color="#666666" className="md:hidden" />
            <IconTrendingUp size={28} color="#666666" className="hidden md:block" />
          </div>
          <div className="pb-4 px-4 md:pb-6 md:px-6 flex flex-col gap-1">
            <p className="font-bold text-[24px] md:text-[32px] leading-[1.2] md:leading-[1.235] text-[#101828]">23</p>
            <p className="text-[12px] md:text-[14px] leading-[1.33] text-[#6a7282]">days until campaign ends</p>
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
  const [showSubmitted, setShowSubmitted] = useState(false);
  const canSubmit = helpTopic !== "" && helpDetail.trim() !== "";

  function handleSubmit() {
    setShowSubmitted(true);
    setHelpTopic("");
    setHelpDetail("");
  }

  return (
    <div className="flex flex-col gap-4 md:gap-12">
      <StatsCards />
      <hr className="hidden md:block border-[rgba(0,0,0,0.12)]" />

      {/* FAQ */}
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col gap-4 md:gap-10 p-[25px]">
        <div className="flex items-end gap-5">
          <p className="font-bold text-[20px] md:text-[24px] leading-[1.334] text-[rgba(0,0,0,0.87)]">
            Frequently Asked Questions
          </p>
          <button className="flex items-center gap-1 shrink-0">
            <span className="text-[#0288d1] text-[16px] leading-[1.5] underline">View more</span>
            <IconArrowSquareOut size={24} color="#0288d1" />
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
                    className={`shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <IconCaretDown size={24} color="rgba(0,0,0,0.54)" />
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

      <hr className="hidden md:block border-[rgba(0,0,0,0.12)]" />

      {/* Need Help */}
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col gap-4 md:gap-10 p-[25px]">
        <div className="flex flex-col gap-[10px]">
          <p className="font-bold text-[20px] md:text-[24px] leading-[1.334] text-[rgba(0,0,0,0.87)]">Need Help?</p>
          <p className="text-[14px] md:text-[16px] leading-[1.5] text-[#666]">
            Send a request to the SeedMoney team and we&apos;ll get back to you within one business day.
          </p>
        </div>
        <div className="flex flex-col gap-[10px]">
          <p className="font-bold text-[14px] md:text-[16px] leading-[1.5] text-black">What do you need help with?</p>
          <FormControl variant="standard" fullWidth>
            <InputLabel sx={{ fontFamily: "Lato, sans-serif" }}>Choose a topic</InputLabel>
            <Select
              value={helpTopic}
              onChange={(e) => setHelpTopic(e.target.value)}
              sx={{
                fontFamily: "Lato, sans-serif",
                fontSize: 16,
                "&:after": { borderBottomColor: "#2d7a45" },
              }}
            >
              <MuiMenuItem value="campaign-edit" sx={{ fontFamily: "Lato, sans-serif" }}>Request a campaign page edit</MuiMenuItem>
              <MuiMenuItem value="stretch-goal" sx={{ fontFamily: "Lato, sans-serif" }}>Request a stretch goal</MuiMenuItem>
              <MuiMenuItem value="account-issue" sx={{ fontFamily: "Lato, sans-serif" }}>Request an account issue</MuiMenuItem>
              <MuiMenuItem value="something-else" sx={{ fontFamily: "Lato, sans-serif" }}>Something else</MuiMenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="flex flex-col gap-[10px]">
          <p className="font-bold text-[14px] md:text-[16px] leading-[1.5] text-black">Tell us more</p>
          <input
            type="text"
            value={helpDetail}
            onChange={(e) => setHelpDetail(e.target.value)}
            placeholder="Describe what you need, the more detail, the faster we can help"
            className="w-full text-[14px] md:text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)] border-0 border-b border-[rgba(0,0,0,0.42)] bg-transparent pb-[6px] focus:border-[#2d7a45] transition-colors placeholder:text-[rgba(0,0,0,0.38)]"
          />
        </div>
        <button
          disabled={!canSubmit}
          onClick={handleSubmit}
          className={`self-start flex items-center gap-2 px-5 py-[10px] rounded-[8px] transition-colors font-bold text-[16px] leading-[26px] uppercase ${
            canSubmit
              ? "bg-[#2d7a45] text-white hover:bg-[#245f37] cursor-pointer"
              : "bg-[#e0e0e0] text-[#a6a6a6] cursor-not-allowed"
          }`}
        >
          Submit Request
        </button>
      </div>

      <Snackbar
        open={showSubmitted}
        autoHideDuration={3000}
        onClose={() => setShowSubmitted(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={SlideLeft}
        TransitionProps={{
          style: { transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)", transitionDuration: "400ms" },
        }}
      >
        <MuiAlert
          severity="success"
          onClose={() => setShowSubmitted(false)}
          sx={{
            backgroundColor: "#edf7ed",
            color: "#1e4620",
            fontFamily: "Lato, sans-serif",
            "& .MuiAlert-icon": { color: "#2e7d32" },
            "& .MuiAlertTitle-root": { color: "#1e4620", fontWeight: 600, fontFamily: "Lato, sans-serif" },
            "& .MuiAlert-message": { fontFamily: "Lato, sans-serif" },
          }}
        >
          <AlertTitle>Request submitted</AlertTitle>
          We&apos;ve received your request and will get back to you as soon as possible
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

// ── donors tab ────────────────────────────────────────────────────────────────
type DonorRow = typeof DONORS[0];
type SortField = "id" | "amount_asc" | "amount_desc" | "contributor" | "email";

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "id", label: "ID" },
  { value: "amount_asc", label: "Amount Low to High" },
  { value: "amount_desc", label: "Amount High to Low" },
  { value: "contributor", label: "Contributor Name" },
  { value: "email", label: "Contributor Email" },
];

function DonorsTab() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("id");
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);

  const filtered = DONORS.filter((d) =>
    Object.values(d).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  const parseAmount = (s: string) => parseFloat(s.replace(/[$,]/g, ""));

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "id") return a.id - b.id;
    if (sortBy === "amount_asc") return parseAmount(a.amount) - parseAmount(b.amount);
    if (sortBy === "amount_desc") return parseAmount(b.amount) - parseAmount(a.amount);
    if (sortBy === "contributor") return a.contributor.localeCompare(b.contributor);
    if (sortBy === "email") return a.email.localeCompare(b.email);
    return 0;
  });

  const cols: GridColDef<DonorRow>[] = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth: 70 },
    { field: "contributor", headerName: "Contributor", flex: 1.5, minWidth: 130 },
    { field: "amount", headerName: "Amount", flex: 1, minWidth: 90 },
    { field: "email", headerName: "Contributor Email", flex: 2, minWidth: 160 },
    { field: "card", headerName: "Card/Reference No.", flex: 1.8, minWidth: 150 },
    { field: "date", headerName: "Date", flex: 1, minWidth: 100 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color="success"
          size="small"
          variant="outlined"
          sx={{ fontFamily: "Lato, sans-serif" }}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StatsCards />

      {/* ── mobile card layout ─────────────────────────────────── */}
      <div className="md:hidden">
        {/* header */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex flex-col">
            <span className="font-bold text-[20px] leading-[1.334] text-black" style={{ fontFamily: "Lato, sans-serif" }}>Donation List</span>
            <span className="text-[14px] leading-[1.5] text-[#666]" style={{ fontFamily: "Lato, sans-serif" }}>12 Donations</span>
          </div>
          <button className="bg-white border border-[#123a1e] text-[#123a1e] font-bold text-[14px] leading-[16px] px-[14px] py-[10px] rounded-[8px] uppercase hover:bg-[#f0f7f1] transition-colors">
            Export to CSV
          </button>
        </div>

        {/* search + sort row */}
        <div className="flex items-center gap-[10px] pb-4">
          <div className="flex-1 flex items-center bg-white border border-[rgba(0,0,0,0.23)] rounded-[4px] px-[14px] py-[8px] gap-[8px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" stroke="rgba(0,0,0,0.54)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="flex-1 text-[16px] leading-[1.33] bg-transparent outline-none text-[rgba(0,0,0,0.87)] placeholder:text-[rgba(0,0,0,0.6)]"
              style={{ fontFamily: "Lato, sans-serif" }}
            />
          </div>
          <button
            onClick={(e) => setSortAnchor(e.currentTarget)}
            className="bg-white border border-[rgba(0,0,0,0.23)] rounded-[4px] h-[40px] px-[10px] flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 8h13M3 12h9M3 16h5" stroke="rgba(0,0,0,0.54)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M19 4v16m0 0l-3-3m3 3l3-3" stroke="rgba(0,0,0,0.54)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <Menu
            anchorEl={sortAnchor}
            open={Boolean(sortAnchor)}
            onClose={() => setSortAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: { borderRadius: "8px", minWidth: 200, boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" },
            }}
          >
            <div className="px-4 py-3">
              <p className="font-bold text-[14px] text-[rgba(0,0,0,0.87)]" style={{ fontFamily: "Lato, sans-serif" }}>Sort By</p>
            </div>
            {SORT_OPTIONS.map((opt) => (
              <MuiMenuItem
                key={opt.value}
                onClick={() => { setSortBy(opt.value); setSortAnchor(null); }}
                sx={{ fontFamily: "Lato, sans-serif", fontSize: 14, display: "flex", justifyContent: "space-between", gap: 2 }}
              >
                {opt.label}
                {sortBy === opt.value && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L20 7" stroke="#2d7a45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </MuiMenuItem>
            ))}
          </Menu>
        </div>

        {/* cards */}
        <div className="flex flex-col gap-3 pb-5">
          {sorted.map((row) => (
            <div key={row.id} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[16px] overflow-hidden">
              {/* card header */}
              <div className="px-[20px] py-[10px] border-b border-[rgba(0,0,0,0.23)]">
                <p className="font-bold text-[14px] leading-[1.5] text-black" style={{ fontFamily: "Lato, sans-serif" }}>
                  ID: {row.id}
                </p>
              </div>
              {/* card rows */}
              <div className="px-[20px]">
                <div className="flex items-center gap-[10px] py-[10px] border-b border-[rgba(0,0,0,0.23)]">
                  <span className="w-[140px] shrink-0 text-[14px] leading-[1.5] text-[#666]" style={{ fontFamily: "Lato, sans-serif" }}>Amount</span>
                  <span className="text-[14px] leading-[1.5] text-black" style={{ fontFamily: "Lato, sans-serif" }}>{row.amount}</span>
                </div>
                <div className="flex items-center gap-[10px] py-[10px] border-b border-[rgba(0,0,0,0.23)]">
                  <span className="w-[140px] shrink-0 text-[14px] leading-[1.5] text-[#666]" style={{ fontFamily: "Lato, sans-serif" }}>Contributor Name</span>
                  <span className="text-[14px] leading-[1.5] text-black" style={{ fontFamily: "Lato, sans-serif" }}>{row.contributor}</span>
                </div>
                <div className="flex items-center gap-[10px] py-[10px] border-b border-[rgba(0,0,0,0.23)]">
                  <span className="w-[140px] shrink-0 text-[14px] leading-[1.5] text-[#666]" style={{ fontFamily: "Lato, sans-serif" }}>Contributor Email</span>
                  <span className="text-[14px] leading-[1.5] text-black break-all" style={{ fontFamily: "Lato, sans-serif" }}>{row.email}</span>
                </div>
                <div className="flex items-center gap-[10px] py-[10px]">
                  <span className="w-[140px] shrink-0 text-[14px] leading-[1.5] text-[#666]" style={{ fontFamily: "Lato, sans-serif" }}>Status</span>
                  <Chip
                    label={row.status}
                    color="success"
                    size="small"
                    variant="outlined"
                    sx={{ fontFamily: "Lato, sans-serif", fontSize: 12, letterSpacing: "0.4px" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── desktop table layout ───────────────────────────────── */}
      <div className="hidden md:block bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl overflow-hidden">
        <div className="px-4 pt-6 pb-2">
          <p className="font-bold text-[16px] text-[rgba(0,0,0,0.87)]">Donation List</p>
          <p className="text-[14px] text-[rgba(0,0,0,0.6)]">12 donors</p>
        </div>
        <div className="px-4 pb-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contributor, amount, etc..."
            style={{
              width: "100%",
              border: "1px solid rgba(0,0,0,0.23)",
              borderRadius: 4,
              padding: "8px 14px",
              fontSize: 14,
              fontFamily: "Lato, sans-serif",
              outline: "none",
            }}
          />
        </div>
        <DataGrid
          rows={filtered}
          columns={cols}
          autoHeight
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            fontFamily: "Lato, sans-serif",
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 700, fontFamily: "Lato, sans-serif" },
            "& .MuiDataGrid-cell": { fontFamily: "Lato, sans-serif" },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              fontFamily: "Lato, sans-serif",
            },
          }}
        />
      </div>

      <button className="hidden md:inline-flex self-start bg-[#2d7a45] text-white font-bold text-[16px] leading-[26px] px-[20px] py-[10px] rounded-[8px] uppercase hover:bg-[#245f37] transition-colors">
        Export to CSV
      </button>
    </div>
  );
}

// ── analytics tab ─────────────────────────────────────────────────────────────
// ── chart data (Nov 15 – Dec 15 x-axis, data only through Dec 2) ─────────────
const CHART_DATES = [
  "Nov 15","Nov 16","Nov 17","Nov 18","Nov 19","Nov 20","Nov 21","Nov 22",
  "Nov 23","Nov 24","Nov 25","Nov 26","Nov 27","Nov 28","Nov 29","Nov 30",
  "Dec 1","Dec 2","Dec 3","Dec 4","Dec 5","Dec 6","Dec 7","Dec 8","Dec 9",
  "Dec 10","Dec 11","Dec 12","Dec 13","Dec 14","Dec 15",
];
// Data through Dec 2 (index 17), null after
const _daily = [75,45,68,72,65,60,88,112,120,118,115,98,44,58,62,48,52,46];
const _total = [82,90,96,104,110,116,122,128,133,137,141,144,132,136,139,134,140,144];
const NULL_TAIL = Array(CHART_DATES.length - _daily.length).fill(null);
const DAILY_EARNINGS: (number | null)[] = [..._daily, ...NULL_TAIL];
const TOTAL_EARNINGS: (number | null)[] = [..._total, ...NULL_TAIL];
// Show every 5th label on x-axis
const xTickInterval = (_: string, i: number) => i % 5 === 0;

function AnalyticsTab() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    // Read the layout width (overflow-hidden ensures SVG can't inflate this)
    const observer = new ResizeObserver(() => {
      setChartWidth(el.getBoundingClientRect().width);
    });
    observer.observe(el);
    // Measure immediately after mount
    setChartWidth(el.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <StatsCards />
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col gap-4 px-4 md:px-[25px] py-6 w-full">
        {/* Header: title + custom legend */}
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div className="flex flex-col">
            <p className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">Earnings Trend</p>
            <p className="text-[14px] leading-[1.33] text-[#6a7282]">Your earnings over the campaign</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 items-center">
              <IconLegendStroke width={20} color="#00a87e" />
              <span className="text-[14px] text-[#717182]">Daily Earnings</span>
            </div>
            <div className="flex gap-2 items-center">
              <IconLegendStroke width={20} color="#5c6bc0" />
              <span className="text-[14px] text-[#717182]">Total Earnings</span>
            </div>
          </div>
        </div>

        {/* Tooltip font override — rendered in a portal outside the chart container */}
        <style>{`.MuiChartsTooltip-root, .MuiChartsTooltip-root * { font-family: Lato, sans-serif !important; }`}</style>

        {/* Chart with overlaid goal badge */}
        <div className="relative w-full overflow-hidden" ref={chartRef}>
          <LineChart
            width={chartWidth || undefined}
            height={320}
            margin={{ top: 20, bottom: 30, left: 0, right: 16 }}
            series={[
              {
                id: "daily",
                data: DAILY_EARNINGS,
                label: "Daily Earnings",
                area: true,
                curve: "natural",
                color: "#00a87e",
                showMark: false,
                connectNulls: false,
                valueFormatter: (v: number | null) => v !== null ? `$${v}` : "",
              },
              {
                id: "total",
                data: TOTAL_EARNINGS,
                label: "Total Earnings",
                area: true,
                curve: "natural",
                color: "#5c6bc0",
                showMark: false,
                connectNulls: false,
                valueFormatter: (v: number | null) => v !== null ? `$${v}` : "",
              },
            ]}
            xAxis={[{
              data: CHART_DATES,
              scaleType: "point",
              tickInterval: xTickInterval,
              tickLabelStyle: { fontFamily: "Lato, sans-serif", fontSize: 12, fill: "#6b7280" },
            }]}
            yAxis={[{
              min: 0,
              max: 220,
              width: 45,
              valueFormatter: (v: number) => `$${v}`,
              tickLabelStyle: { fontFamily: "Lato, sans-serif", fontSize: 12, fill: "#6b7280" },
            }]}
            sx={{
              "& .MuiAreaElement-series-daily": { fill: "url(#dailyGrad)" },
              "& .MuiAreaElement-series-total": { fill: "url(#totalGrad)" },
              "& .MuiLineElement-root": { strokeWidth: 2 },
              "& .MuiChartsGrid-line": { stroke: "#e5e7eb", strokeDasharray: "4 4" },
              "& .MuiChartsLegend-root": { display: "none" },
              fontFamily: "Lato, sans-serif",
              "& text": { fontFamily: "Lato, sans-serif", fill: "#6b7280", fontSize: 12 },
            }}
            grid={{ horizontal: true, vertical: true }}
          >
            <defs>
              <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00a87e" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#00a87e" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5c6bc0" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#5c6bc0" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <ChartsReferenceLine
              y={180}
              lineStyle={{ stroke: "#2e7d32", strokeDasharray: "6 3", strokeWidth: 1.5 }}
            />
          </LineChart>

          {/* Goal badge — aligned with the y=180 reference line
              Chart data area: top=20px, height=320-20-30=270px
              y=180 out of 0–220: from top = 20 + (1 - 180/220) * 270 ≈ 69px
              Badge height ≈ 26px → center at 69 - 13 = 56px */}
          <div
            className="absolute border border-[#2e7d32] text-[#2e7d32] text-[13px] px-3 py-0.5 rounded-full whitespace-nowrap bg-white pointer-events-none"
            style={{ top: 56, right: 24 }}
          >
            Your Goal: $180
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
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col gap-6 items-center py-[81px] px-px">
        <img src="/seedmoney-logo-circle.png" alt="SeedMoney" width={80} height={80} />
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
        <img src="/seedmoney-logo-circle.png" alt="SeedMoney" width={80} height={80} />
        <p className="font-bold text-[24px] leading-[1.334] text-[#666] text-center">No campaigns created</p>
        <p className="text-[16px] leading-[1.5] text-[#666] text-center max-w-md">
          Create your first campaign to start sharing your story and receiving support.
        </p>
        <button
          onClick={onNew}
          className="bg-[#2d7a45] flex items-center gap-2 px-[26px] py-3 rounded-[8px] hover:bg-[#245f37] transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
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
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl flex flex-col gap-6 items-center py-[81px] px-px">
        <img src="/seedmoney-logo-circle.png" alt="SeedMoney" width={80} height={80} />
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
  onCopyLink,
}: {
  campaignName: string;
  activeTab: "overview" | "donors" | "analytics";
  onTabChange: (t: "overview" | "donors" | "analytics") => void;
  onCopyLink: () => void;
}) {
  const TABS: { key: "overview" | "donors" | "analytics"; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "donors", label: "Donors" },
    { key: "analytics", label: "Analytics" },
  ];

  return (
    <div className="flex flex-col gap-4 flex-1">
      <p className="font-bold text-[24px] md:text-[32px] leading-[1.235] text-[#1a4a28]">{campaignName}</p>
      <div className="flex items-center border-b border-[rgba(0,0,0,0.12)] overflow-x-auto no-scrollbar">
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
      {/* Mobile buttons — no icons, horizontal scroll, Share uses native share */}
      <div className="flex md:hidden flex-nowrap gap-4 items-center overflow-x-auto no-scrollbar">
        <a
          href="https://donate.seedmoney.org/13865/full-belly-community-garden"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-[#2d7a45] text-white font-bold text-[14px] leading-[16px] px-[14px] py-[10px] rounded-[8px] uppercase hover:bg-[#245f37] transition-colors whitespace-nowrap"
        >
          View Campaign
        </a>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "SeedMoney Campaign",
                url: "https://donate.seedmoney.org/13865/full-belly-community-garden",
              });
            } else {
              onCopyLink();
            }
          }}
          className="shrink-0 bg-white border border-[#123a1e] text-[#123a1e] font-bold text-[14px] leading-[16px] px-[14px] py-[9px] rounded-[8px] uppercase hover:bg-[#f0f7f1] transition-colors whitespace-nowrap"
        >
          Share Campaign
        </button>
        <a
          href="https://donate.seedmoney.org/explore"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-white border border-[#123a1e] text-[#123a1e] font-bold text-[14px] leading-[16px] px-[14px] py-[9px] rounded-[8px] uppercase hover:bg-[#f0f7f1] transition-colors whitespace-nowrap"
        >
          Leaderboard
        </a>
      </div>

      {/* Desktop buttons — with icons, wraps */}
      <div className="hidden md:flex flex-wrap gap-4 items-center">
        <a
          href="https://donate.seedmoney.org/13865/full-belly-community-garden"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#2d7a45] text-white font-bold text-[14px] leading-[16px] px-[14px] py-[10px] rounded-[8px] uppercase hover:bg-[#245f37] transition-colors flex items-center gap-1"
        >
          View Campaign
          <IconExternalLink size={16} color="white" />
        </a>
        <button
          onClick={onCopyLink}
          className="bg-white border border-[#123a1e] text-[#123a1e] font-bold text-[14px] leading-[16px] px-[14px] py-[9px] rounded-[8px] uppercase hover:bg-[#f0f7f1] transition-colors"
        >
          Copy Campaign Link
        </button>
        <a
          href="https://donate.seedmoney.org/explore"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-[#123a1e] text-[#123a1e] font-bold text-[14px] leading-[16px] px-[14px] py-[9px] rounded-[8px] uppercase hover:bg-[#f0f7f1] transition-colors flex items-center gap-[4px]"
        >
          View Leaderboard
          <IconExternalLinkBox size={16} color="#123a1e" className="shrink-0" />
        </a>
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

// ── settings modal ────────────────────────────────────────────────────────────
type SettingsStep =
  | "main" | "edit-name" | "edit-email"
  | "verify-email-for-email" | "code-for-email" | "confirm-new-email"
  | "verify-email-for-password" | "code-for-password";

function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<SettingsStep>("main");
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Smith");
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showCodeResent, setShowCodeResent] = useState(false);
  const CURRENT_EMAIL = "johnsmith@gmail.com";

  function handleClose() {
    setStep("main");
    setNewEmail("");
    setVerificationCode("");
    onClose();
  }

  function goToMain() {
    setStep("main");
    setNewEmail("");
    setVerificationCode("");
  }

  function handleSendVerification() {
    setShowCodeResent(true);
    if (step === "verify-email-for-email") setStep("code-for-email");
    else setStep("code-for-password");
  }

  const nameChanged = firstName !== "John" || lastName !== "Smith";
  const canNextEmail = newEmail.trim().length > 0;
  const canNextCode = verificationCode.trim().length > 0;

  const stepTitles: Record<SettingsStep, string> = {
    "main": "Settings",
    "edit-name": "Change Name",
    "edit-email": "Change Email",
    "verify-email-for-email": "Verify Email",
    "code-for-email": "Verify Email",
    "confirm-new-email": "Confirm New Email",
    "verify-email-for-password": "Verify Email",
    "code-for-password": "Verify Email",
  };

  const cancelSty: CSSProperties = {
    fontFamily: "Lato, sans-serif", fontWeight: 700, fontSize: 14, lineHeight: "16px",
    textTransform: "uppercase", color: "#666", background: "none", border: "none",
    cursor: "pointer", padding: "10px 8px", borderRadius: 8,
  };

  function primarySty(enabled: boolean): CSSProperties {
    return {
      fontFamily: "Lato, sans-serif", fontWeight: 700, fontSize: 14, lineHeight: "16px",
      textTransform: "uppercase", color: enabled ? "white" : "#a6a6a6",
      background: enabled ? "#2d7a45" : "#e0e0e0", border: "none",
      cursor: enabled ? "pointer" : "not-allowed", padding: "10px 14px", borderRadius: 8,
    };
  }

  return (
    <>
      <Dialog open={open} onClose={undefined} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: "4px", fontFamily: "Lato, sans-serif" } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 2 }}>
          <span style={{ fontFamily: "Lato, sans-serif", fontWeight: 700, fontSize: 20, color: "#123a1e", lineHeight: "32px" }}>
            {stepTitles[step]}
          </span>
          <MuiIconButton onClick={step === "main" ? handleClose : goToMain} size="small" sx={{ color: "rgba(0,0,0,0.54)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </MuiIconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: 1, pb: 1 }}>
          {step === "main" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Name", value: `${firstName} ${lastName}`, onClick: () => setStep("edit-name") },
                { label: "Email", value: CURRENT_EMAIL, onClick: () => setStep("edit-email") },
                { label: "Password", value: "***********************", onClick: () => setStep("verify-email-for-password") },
              ].map(({ label, value, onClick }) => (
                <div key={label}>
                  <p style={{ fontFamily: "Lato, sans-serif", fontWeight: 700, fontSize: 16, color: "#000", marginBottom: 4 }}>{label}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 36 }}>
                    <p style={{ fontFamily: "Lato, sans-serif", fontSize: 16, color: "#666", flex: 1 }}>{value}</p>
                    <button
                      onClick={onClick}
                      style={{ fontFamily: "Lato, sans-serif", fontWeight: 700, fontSize: 14, color: "#123a1e", border: "1px solid #123a1e", borderRadius: 8, padding: "9px 14px", background: "white", cursor: "pointer", textTransform: "uppercase", lineHeight: "16px" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f7f1")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                    >Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === "edit-name" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4, paddingBottom: 4 }}>
              <TextField label="First Name" variant="outlined" fullWidth value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={{ "& *": { fontFamily: "Lato, sans-serif" } }} />
              <TextField label="Last Name" variant="outlined" fullWidth value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={{ "& *": { fontFamily: "Lato, sans-serif" } }} />
            </div>
          )}

          {step === "edit-email" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 15, paddingTop: 20, paddingBottom: 20 }}>
              <TextField label="Current Email" variant="outlined" fullWidth value={CURRENT_EMAIL} disabled
                sx={{ "& *": { fontFamily: "Lato, sans-serif" } }} />
              <TextField label="New Email" variant="outlined" fullWidth value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New email address"
                sx={{ "& *": { fontFamily: "Lato, sans-serif" } }} />
            </div>
          )}

          {(step === "verify-email-for-email" || step === "verify-email-for-password") && (
            <div style={{ fontFamily: "Lato, sans-serif", fontSize: 16, color: "#000", display: "flex", flexDirection: "column", gap: 8, paddingBottom: 20 }}>
              <p>
                {step === "verify-email-for-email"
                  ? `Please verify your old email ${CURRENT_EMAIL} before changing to your new email.`
                  : `Please verify your email ${CURRENT_EMAIL} before changing your password.`}
              </p>
              <p>We&apos;ll send a verification code to your email.</p>
            </div>
          )}

          {(step === "code-for-email" || step === "code-for-password") && (
            <div style={{ display: "flex", flexDirection: "column", gap: 25, paddingBottom: 20 }}>
              <p style={{ fontFamily: "Lato, sans-serif", fontSize: 16, color: "#000" }}>
                A code has been sent to your email {CURRENT_EMAIL}.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <TextField label="Enter Verification Code" variant="outlined" fullWidth
                  value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)}
                  sx={{ "& *": { fontFamily: "Lato, sans-serif" } }} />
                <p style={{ fontFamily: "Lato, sans-serif", fontSize: 16 }}>
                  <span style={{ color: "#666" }}>Link expired or didn&apos;t receive it? </span>
                  <button onClick={() => setShowCodeResent(true)}
                    style={{ color: "#0288d1", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "Lato, sans-serif", fontSize: 16, padding: 0 }}>
                    Resend
                  </button>
                </p>
              </div>
            </div>
          )}

          {step === "confirm-new-email" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 20 }}>
              <p style={{ fontFamily: "Lato, sans-serif", fontSize: 16, color: "#000" }}>
                To complete your email change, verify your new address. We&apos;ve sent a confirmation link to {newEmail || "your new email"}.
              </p>
              <p style={{ fontFamily: "Lato, sans-serif", fontSize: 16 }}>
                <span style={{ color: "#666" }}>Didn&apos;t receive it? </span>
                <button onClick={() => setShowCodeResent(true)}
                  style={{ color: "#0288d1", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "Lato, sans-serif", fontSize: 16, padding: 0 }}>
                  Resend
                </button>
              </p>
            </div>
          )}
        </DialogContent>

        {step !== "main" && step !== "confirm-new-email" && (
          <DialogActions sx={{ px: 1, py: 1 }}>
            <button onClick={goToMain} style={cancelSty}>Cancel</button>
            {step === "edit-name" && (
              <button onClick={nameChanged ? goToMain : undefined} disabled={!nameChanged}
                style={primarySty(nameChanged)}>Save</button>
            )}
            {step === "edit-email" && (
              <button onClick={canNextEmail ? () => setStep("verify-email-for-email") : undefined}
                disabled={!canNextEmail} style={primarySty(canNextEmail)}>Next</button>
            )}
            {(step === "verify-email-for-email" || step === "verify-email-for-password") && (
              <button onClick={handleSendVerification} style={primarySty(true)}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#245f37")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#2d7a45")}>
                Send Verification Email
              </button>
            )}
            {step === "code-for-email" && (
              <button
                onClick={canNextCode ? () => { setVerificationCode(""); setStep("confirm-new-email"); } : undefined}
                disabled={!canNextCode} style={primarySty(canNextCode)}>Next</button>
            )}
            {step === "code-for-password" && (
              <button onClick={canNextCode ? handleClose : undefined}
                disabled={!canNextCode} style={primarySty(canNextCode)}>Next</button>
            )}
          </DialogActions>
        )}
      </Dialog>

      <Snackbar
        open={showCodeResent}
        autoHideDuration={3000}
        onClose={() => setShowCodeResent(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={SlideLeft}
        TransitionProps={{ style: { transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)", transitionDuration: "400ms" } }}
      >
        <MuiAlert severity="success" onClose={() => setShowCodeResent(false)}
          sx={{ backgroundColor: "#edf7ed", color: "#1e4620", fontFamily: "Lato, sans-serif", "& .MuiAlert-icon": { color: "#2e7d32" }, "& .MuiAlert-message": { fontFamily: "Lato, sans-serif" } }}>
          Code Resent!
        </MuiAlert>
      </Snackbar>
    </>
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
  const [showModal, setShowModal] = useState(false);
  const [keyBuffer, setKeyBuffer] = useState("");
  const [draftTitle, setDraftTitle] = useState<string | null>(null);
  const [pendingCampaigns, setPendingCampaigns] = useState<{ title: string }[]>([]);
  const [selectedNav, setSelectedNav] = useState<SelectedNav>(null);
  const [selectedActiveIdx, setSelectedActiveIdx] = useState<number>(0);
  const [showCopied, setShowCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    // Check if we arrived here from a form submit (flag set by application/page.tsx)
    const fromSubmit = sessionStorage.getItem("seedmoney_from_submit") === "1";
    sessionStorage.removeItem("seedmoney_from_submit"); // consume immediately

    if (!fromSubmit) {
      // Any other entry (browser refresh, direct URL, back button) → clear everything
      sessionStorage.removeItem("seedmoney_draft");
      sessionStorage.removeItem("seedmoney_pending");
      return;
    }

    // Arrived from form submit → restore session data
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
          pendingArr = [{ title: parsed.title }];
        }
      } catch {}
    }
    setPendingCampaigns(pendingArr);
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
          pendingCampaigns={state === "active" ? [] : pendingCampaigns}
          draftTitle={state === "active" ? null : draftTitle}
          selectedNav={state === "active" ? null : selectedNav}
          onSelectPending={(idx) => { setSelectedNav({ type: "pending", idx }); setMobileNavOpen(false); }}
          onSelectDraft={() => { setSelectedNav({ type: "draft" }); setMobileNavOpen(false); }}
          onNewCampaign={handleNewCampaign}
          onSettings={() => setShowSettings(true)}
          onLogout={handleLogout}
          activeCampaigns={state === "active" ? ["Save the Ocean Campaign"] : []}
          selectedActiveIdx={state === "active" ? selectedActiveIdx : undefined}
          onSelectActive={setSelectedActiveIdx}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
        />
        <div className="flex flex-col flex-1 min-w-0 h-full overflow-y-auto px-4 md:px-10 pt-[60px] pb-[60px] md:pb-5">
          {state === "active" && (
            <ActiveState
              campaignName="Save the Ocean Campaign"
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onCopyLink={() => {
                navigator.clipboard.writeText("https://donate.seedmoney.org/13865/full-belly-community-garden");
                setShowCopied(true);
              }}
            />
          )}
          {state !== "active" && selectedNav?.type === "pending" && (
            <ReviewState campaignName={pendingCampaigns[selectedNav.idx]?.title.trim() || "Untitled"} />
          )}
          {state !== "active" && selectedNav?.type === "draft" && hasDraft && (
            <DraftState title={draftTitle!} onContinue={handleContinueDraft} />
          )}
          {state !== "active" && !selectedNav && (
            <EmptyState onNew={handleNewCampaign} />
          )}
        </div>

        {/* Floating hamburger button — mobile only */}
        <button
          onClick={() => setMobileNavOpen(true)}
          className="fixed bottom-6 right-6 z-30 md:hidden bg-white border border-[#123a1e] rounded-full size-16 flex items-center justify-center shadow-[0px_1px_8px_0px_rgba(0,0,0,0.12),0px_3px_4px_0px_rgba(0,0,0,0.14),0px_3px_3px_-2px_rgba(0,0,0,0.2)] hover:bg-[#f0f7f1] transition-colors"
          aria-label="Open navigation"
        >
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
            <path d="M0 1.5C0 0.672 0.672 0 1.5 0h21a1.5 1.5 0 0 1 0 3h-21A1.5 1.5 0 0 1 0 1.5Z" fill="#2d7a45"/>
            <path d="M0 9C0 8.172 0.672 7.5 1.5 7.5h21a1.5 1.5 0 0 1 0 3h-21A1.5 1.5 0 0 1 0 9Z" fill="#2d7a45"/>
            <path d="M0 16.5C0 15.672 0.672 15 1.5 15h21a1.5 1.5 0 0 1 0 3h-21A1.5 1.5 0 0 1 0 16.5Z" fill="#2d7a45"/>
          </svg>
        </button>
      </div>

      {showModal && (
        <NewCampaignModal
          onClose={() => setShowModal(false)}
          onStart={handleStartApplication}
        />
      )}

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />

      <Snackbar
        open={showCopied}
        autoHideDuration={3000}
        onClose={() => setShowCopied(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={SlideLeft}
        TransitionProps={{
          style: { transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)", transitionDuration: "400ms" },
        }}
      >
        <MuiAlert
          severity="success"
          onClose={() => setShowCopied(false)}
          sx={{
            backgroundColor: "#edf7ed",
            color: "#1e4620",
            fontFamily: "Lato, sans-serif",
            "& .MuiAlert-icon": { color: "#2e7d32" },
            "& .MuiAlertTitle-root": { color: "#1e4620", fontWeight: 600, fontFamily: "Lato, sans-serif" },
            "& .MuiAlert-message": { fontFamily: "Lato, sans-serif" },
          }}
        >
          <AlertTitle>Successfully Copied!</AlertTitle>
          Link has been copied to clipboard
        </MuiAlert>
      </Snackbar>
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
