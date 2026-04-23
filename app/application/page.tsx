"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Sidebar } from "@/app/components/Sidebar";
import Image from "next/image";
import { IconUpload, IconCloudUpload, IconErrorOutline, IconPencil, StepDot, getDotState } from "@/app/components/Icons";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

const muiTheme = createTheme({
  typography: {
    fontFamily: "var(--font-lato), Lato, sans-serif",
  },
});

const fieldSx = {
  "& .MuiInput-underline:after": { borderBottomColor: "#2d7a45" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#2d7a45" },
} as const;


// ── draft persistence ─────────────────────────────────────────────────────────
const DRAFT_KEY = "seedmoney_draft";
const DRAFT_KEY_NEW = "seedmoney_draft_new";

// ── geo types ─────────────────────────────────────────────────────────────────
type GeoOption = { code: string; name: string };

const FALLBACK_COUNTRIES: GeoOption[] = [
  { code: "US", name: "United States" },
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AR", name: "Argentina" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "BD", name: "Bangladesh" },
  { code: "BE", name: "Belgium" },
  { code: "BR", name: "Brazil" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "CD", name: "Congo, DR" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "CU", name: "Cuba" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "ET", name: "Ethiopia" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinea" },
  { code: "HT", name: "Haiti" },
  { code: "HN", name: "Honduras" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "MX", name: "Mexico" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NG", name: "Nigeria" },
  { code: "NO", name: "Norway" },
  { code: "PK", name: "Pakistan" },
  { code: "PA", name: "Panama" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "RW", name: "Rwanda" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "ZA", name: "South Africa" },
  { code: "KR", name: "South Korea" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "VN", name: "Vietnam" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
];

// ── step config ───────────────────────────────────────────────────────────────
const STEPS = [
  "Grantee Agreement",
  "Campaign Information",
  "Garden Information",
  "Garden Story",
  "Contact Information",
  "Review & Submit",
] as const;

type Step = 0 | 1 | 2 | 3 | 4 | 5;

// ── standard MUI text field ───────────────────────────────────────────────────
function StdField({
  label,
  type = "text",
  helperText,
  placeholder,
  value,
  onChange,
  maxLength,
}: {
  label: string;
  type?: string;
  helperText?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  maxLength?: number;
}) {
  const controlled = value !== undefined && onChange !== undefined;
  const inputProps: Record<string, unknown> = {};
  if (type === "number") { inputProps.min = 0; inputProps.step = 1; }
  if (maxLength) inputProps.maxLength = maxLength;
  if (placeholder) inputProps.placeholder = placeholder;
  return (
    <div className="flex flex-col w-full group">
      <p className="text-[12px] leading-[1.4] tracking-[0.01em] text-[rgba(0,0,0,0.6)] group-focus-within:text-[#2d7a45] transition-colors">
        {label}
      </p>
      <TextField
        variant="standard"
        type={type}
        helperText={helperText}
        fullWidth
        {...(type !== "number" && { multiline: true })}
        sx={fieldSx}
        slotProps={Object.keys(inputProps).length ? { htmlInput: inputProps } : undefined}
        {...(controlled ? { value, onChange: (e) => onChange(e.target.value) } : {})}
      />
    </div>
  );
}

// ── section card ──────────────────────────────────────────────────────────────
function SectionCard({
  title,
  required,
  description,
  children,
}: {
  title: string;
  required?: boolean;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-5 md:p-[25px] flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="font-bold text-[20px] leading-[1.6] text-[rgba(0,0,0,0.87)]">
            {title}
          </p>
          {required && <p className="font-bold text-[20px]" style={{ color: "var(--color-error)" }}>*</p>}
        </div>
        {description && (
          <p className="text-[14px] leading-[1.33] text-black">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ── AI Opt-In Modal ───────────────────────────────────────────────────────────
function AiOptInModal({ onClose, onOptIn }: { onClose: () => void; onOptIn: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <div
        className="bg-white rounded-[4px] flex flex-col w-full max-w-[600px] max-h-[90vh] overflow-hidden"
        style={{ boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0">
          <p className="font-bold text-[20px] leading-[1.6] text-[#123a1e]">AI Editing Opt-In Statement</p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 ml-4 text-[rgba(0,0,0,0.54)] hover:text-[rgba(0,0,0,0.87)] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-5 text-[16px] leading-[1.5] text-black overflow-y-auto flex-1">
          <p>
            If you opt in, any text from your application that is displayed on the publicly facing campaign page may be processed using GPT-5-mini for the purpose of light editing and polishing, such as grammar and clarity improvements, while preserving your original style, intent, and content. No substantive changes will be made.
          </p>
          <p className="mt-4">
            AI editing will only be applied if you explicitly opt in. By selecting this option, you consent to the use of AI in editing your campaign text and authorize SeedMoney, the ability to review, accept, or deny any suggested edits on your behalf. Once edits introduced by GPT-5-mini are finalized and implemented, you will not have the ability to make further changes to your campaign page text.
          </p>
          <p className="mt-4">
            Please note that OpenAI may retain data and use submitted content in prompts for model training purposes, as outlined in their Terms of Use{" "}
            <a href="https://openai.com/policies/row-terms-of-use/" target="_blank" rel="noopener noreferrer" className="underline text-black">
              here.
            </a>{" "}
            You are responsible for ensuring that your submission does not include any sensitive information or personally identifiable information (PII). For guidance on what constitutes PII, reference{" "}
            <a href="https://www.dol.gov/general/ppii" target="_blank" rel="noopener noreferrer" className="underline text-black">
              this definition{" "}
            </a>
            from the U.S. Department of Labor.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 p-2 shrink-0">
          <button
            onClick={onClose}
            className="px-2 py-[10px] rounded-[8px] font-bold text-[14px] leading-[16px] uppercase text-[#666] hover:text-[rgba(0,0,0,0.87)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onOptIn(); onClose(); }}
            className="bg-[#2d7a45] hover:bg-[#245f37] transition-colors px-[14px] py-[10px] rounded-[8px] font-bold text-[14px] leading-[16px] uppercase text-white"
          >
            Opt In
          </button>
        </div>
      </div>
    </div>
  );
}

// ── step 1: Grantee Agreement ─────────────────────────────────────────────────
const GRANTEE_ITEMS = [
  "I am not seeking to raise funds for personal use or a personal garden. Funds must benefit a nonprofit or community-serving garden project.*",
  "I am applying on behalf of a nonprofit or community-based organization that can document its nonprofit or public-service status.*",
  "I understand SeedMoney cannot send funds to personal accounts or via informal transfer services.*",
  "I understand international projects must raise at least $50 to be eligible for electronic transfers.*",
  "I understand SeedMoney may request a brief progress report if my project receives funding.*",
  "I authorize SeedMoney to reuse submitted text and photos for educational or promotional purposes.*",
  "I certify that the information provided is accurate and complete.*",
  "I authorize SeedMoney to use artificial intelligence (AI) to edit my campaign page text hosted on Givebutter, as described in the opt-in statement.",
];

function Step1({ checked, onChange }: { checked: boolean[]; onChange: (i: number) => void }) {
  const [showAiModal, setShowAiModal] = useState(false);
  const aiIndex = GRANTEE_ITEMS.length - 1;

  return (
    <>
      {showAiModal && (
        <AiOptInModal
          onClose={() => setShowAiModal(false)}
          onOptIn={() => { if (!checked[aiIndex]) onChange(aiIndex); }}
        />
      )}
      <SectionCard
        title="Grantee Agreement"
        required
        description="By checking all boxes below and continuing, you are agreeing to the SeedMoney Challenge Grantee Agreement"
      >
        <div className="flex flex-col gap-6 md:gap-4">
          <p className="text-[16px] leading-[1.5] text-black tracking-[0.15px]">
            I confirm that:
          </p>
          {GRANTEE_ITEMS.map((item, i) => (
            <label
              key={i}
              className="flex items-center gap-0 cursor-pointer"
            >
              <div className="flex items-center p-[9px] shrink-0">
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={() => onChange(i)}
                  className="size-[18px] accent-[#2d7a45] cursor-pointer"
                />
              </div>
              <p className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)] tracking-[0.15px]">
                {item.endsWith("*") ? (
                  <>
                    {item.slice(0, -1)}
                    <span style={{ color: "var(--color-error)" }}>*</span>
                  </>
                ) : i === aiIndex ? (
                  <>
                    I authorize SeedMoney to use artificial intelligence (AI) to edit my campaign page text hosted on Givebutter, as described in the{" "}
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setShowAiModal(true); }}
                      className="underline text-[#1976d2] hover:text-[#1565c0] transition-colors"
                    >
                      opt-in statement
                    </button>
                    .{" "}
                    <span className="text-[14px] text-[rgba(0,0,0,0.5)]">(optional)</span>
                  </>
                ) : (
                  <>
                    {item}
                    <span className="ml-1 text-[14px] text-[rgba(0,0,0,0.5)]">(Optional)</span>
                  </>
                )}
              </p>
            </label>
          ))}
        </div>
      </SectionCard>
    </>
  );
}

// ── step 2: Campaign Information ──────────────────────────────────────────────
function Step2({
  campaignTitle, setCampaignTitle,
  peopleCount, setPeopleCount,
  gardenSize, setGardenSize,
  gardenType, setGardenType,
  fundraisingGoal, setFundraisingGoal,
}: {
  campaignTitle: string; setCampaignTitle: (v: string) => void;
  peopleCount: string; setPeopleCount: (v: string) => void;
  gardenSize: string; setGardenSize: (v: string) => void;
  gardenType: string; setGardenType: (v: string) => void;
  fundraisingGoal: string; setFundraisingGoal: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionCard
        title="Campaign Title"
        required
        description="This will be the public title of your fundraising campaign. Choose something clear and recognizable, e.g. Fairview Community Garden, Pleasantville Primary School Garden, Holy Jalapeno Church Garden, etc."
      >
        <StdField
          label="Campaign Title"
          value={campaignTitle}
          onChange={setCampaignTitle}
          maxLength={60}
          helperText="60 max characters"
        />
      </SectionCard>

      <SectionCard title="Project Details & Impact" required>
        <div className="flex flex-col gap-4 w-full">
          <StdField
            label="About how many people will benefit from this garden this year?"
            type="number"
            value={peopleCount}
            onChange={setPeopleCount}
          />
          <StdField
            label="Approximate garden size or scope"
            helperText="Examples: one raised bed, multiple sites, two-acre farm."
            value={gardenSize}
            onChange={setGardenSize}
          />
          <div className="flex flex-col gap-3">
            <p className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">
              Is this a new or existing garden?
            </p>
            {(["New garden", "Existing garden"] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="garden-type"
                  checked={gardenType === opt}
                  onChange={() => setGardenType(opt)}
                  className="accent-[#2d7a45] size-4"
                />
                <span className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Fundraising Goal"
        required
        description="Most SeedMoney projects set goals between $500 and $5,000"
      >
        <TextField
          variant="standard"
          label="Fundraising Goal (USD)"
          type="number"
          fullWidth
          sx={fieldSx}
          value={fundraisingGoal}
          onChange={(e) => setFundraisingGoal(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            },
          }}
        />
      </SectionCard>
    </div>
  );
}

// ── step 3: Garden Information ────────────────────────────────────────────────
const PROJECT_CATEGORIES = [
  "Community Garden",
  "School or Youth Garden",
  "Food Pantry or Food Bank Garden",
  "Urban Farm",
  "Refugee or Immigrant Garden",
  "Tribal or Indigenous Garden Project",
  "Shelter or Transitional Housing Garden",
  "Therapeutic or Healing Garden",
  "Job Training or Vocational Garden",
  "Demonstration or Education Garden",
  "Multi-Site Garden Program",
  "Other (please specify)",
];

const BENEFICIARY_POPULATIONS = [
  "Children (ages 0–12)",
  "Youth / Adolescents (ages 13–18)",
  "Families",
  "Seniors / Older adults",
  "Low-income individuals or households",
  "Food-insecure individuals or households",
  "Immigrants and refugees",
  "Indigenous / Native communities",
  "People with disabilities",
  "Veterans and military families",
  "People experiencing homelessness or housing insecurity",
  "Unemployed or underemployed individuals",
  "Justice-involved individuals",
  "Rural communities",
  "Urban communities",
  "Other (please specify)",
];

function Step3({
  gardenCity, setGardenCity,
  gardenState, setGardenState,
  gardenCountry, setGardenCountry,
  projectCategory, setProjectCategory,
  projectCategoryOther, setProjectCategoryOther,
  beneficiaryPops, setBeneficiaryPops,
  beneficiaryOther, setBeneficiaryOther,
  statesMap, countries,
}: {
  gardenCity: string; setGardenCity: (v: string) => void;
  gardenState: string; setGardenState: (v: string) => void;
  gardenCountry: string; setGardenCountry: (v: string) => void;
  projectCategory: string; setProjectCategory: (v: string) => void;
  projectCategoryOther: string; setProjectCategoryOther: (v: string) => void;
  beneficiaryPops: string[]; setBeneficiaryPops: (v: string[]) => void;
  beneficiaryOther: string; setBeneficiaryOther: (v: string) => void;
  statesMap: Record<string, GeoOption[]>;
  countries: GeoOption[];
}) {
  function togglePop(pop: string) {
    if (beneficiaryPops.includes(pop)) {
      setBeneficiaryPops(beneficiaryPops.filter((p) => p !== pop));
    } else if (beneficiaryPops.length < 3) {
      setBeneficiaryPops([...beneficiaryPops, pop]);
    }
  }
  const gardenStateOptions = statesMap[gardenCountry] ?? [];
  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionCard title="Garden Location" required>
        <div className="flex flex-col gap-4 w-full">
          <TextField
            select
            variant="standard"
            label="Country"
            value={gardenCountry}
            onChange={(e) => setGardenCountry(e.target.value)}
            fullWidth
            sx={fieldSx}
          >
            {countries.map(({ code, name }) => (
              <MenuItem key={code} value={code}>{name}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            variant="standard"
            label="State / Province"
            value={gardenState}
            onChange={(e) => setGardenState(e.target.value)}
            fullWidth
            sx={fieldSx}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {gardenStateOptions.map(({ code, name }) => (
              <MenuItem key={code} value={code}>{name}</MenuItem>
            ))}
          </TextField>
          <StdField label="City" value={gardenCity} onChange={setGardenCity} />
        </div>
      </SectionCard>

      <SectionCard title="Primary Project Category" required>
        <div className="flex flex-col gap-0">
          <p className="text-[14px] text-[rgba(0,0,0,0.6)] mb-3">Select one:</p>
          {PROJECT_CATEGORIES.map((cat) => {
            const isOther = cat === "Other (please specify)";
            return (
              <label key={cat} className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="radio"
                  name="category"
                  checked={projectCategory === cat}
                  onChange={() => setProjectCategory(cat)}
                  className="accent-[#2d7a45] size-4 shrink-0"
                />
                {isOther && projectCategory === cat ? (
                  <input
                    autoFocus
                    type="text"
                    value={projectCategoryOther}
                    onChange={(e) => setProjectCategoryOther(e.target.value)}
                    placeholder="Please specify"
                    className="flex-1 text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)] border-b border-[rgba(0,0,0,0.42)] focus:border-[#2d7a45] outline-none bg-transparent pb-[2px]"
                  />
                ) : (
                  <span className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">{cat}</span>
                )}
              </label>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Beneficiary Populations Served" required>
        <div className="flex flex-col gap-0">
          <p className="text-[14px] text-[rgba(0,0,0,0.6)] mb-3">
            Select up to three populations:
          </p>
          {BENEFICIARY_POPULATIONS.map((pop) => {
            const isOther = pop === "Other (please specify)";
            const checked = beneficiaryPops.includes(pop);
            const disabled = !checked && beneficiaryPops.length >= 3;
            return (
              <label key={pop} className={`flex items-center gap-0 py-1 ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}>
                <div className="flex items-center p-[9px] shrink-0">
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => togglePop(pop)}
                    className="size-[18px] accent-[#2d7a45] cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
                {isOther && checked ? (
                  <input
                    autoFocus
                    type="text"
                    value={beneficiaryOther}
                    onChange={(e) => setBeneficiaryOther(e.target.value)}
                    placeholder="Please specify"
                    className="flex-1 text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)] border-b border-[rgba(0,0,0,0.42)] focus:border-[#2d7a45] outline-none bg-transparent pb-[2px]"
                  />
                ) : (
                  <span className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">{pop}</span>
                )}
              </label>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

// ── step 4: Garden Story ──────────────────────────────────────────────────────
const MAX_FILE_BYTES = 3 * 1024 * 1024; // 3 MB

// ── helpers ───────────────────────────────────────────────────────────────────
function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rad = (rotation * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(rad) * width) + Math.abs(Math.sin(rad) * height),
    height: Math.abs(Math.sin(rad) * width) + Math.abs(Math.cos(rad) * height),
  };
}

async function getCroppedImg(file: File, croppedAreaPixels: Area, rotation = 0): Promise<File> {
  const url = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new window.Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = url;
  });
  URL.revokeObjectURL(url);

  const rad = (rotation * Math.PI) / 180;
  const { width: bw, height: bh } = rotateSize(img.width, img.height, rotation);

  // Draw the rotated full image onto an intermediate canvas
  const rotCanvas = document.createElement("canvas");
  rotCanvas.width = bw;
  rotCanvas.height = bh;
  const rotCtx = rotCanvas.getContext("2d")!;
  rotCtx.translate(bw / 2, bh / 2);
  rotCtx.rotate(rad);
  rotCtx.translate(-img.width / 2, -img.height / 2);
  rotCtx.drawImage(img, 0, 0);

  // Crop from the rotated canvas
  const canvas = document.createElement("canvas");
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    rotCanvas,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], file.name, { type: file.type }));
    }, file.type);
  });
}

// ── CropModal ─────────────────────────────────────────────────────────────────
function CropModal({
  file,
  onClose,
  onApply,
}: {
  file: File;
  onClose: () => void;
  onApply: (cropped: File) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [objectUrl, setObjectUrl] = useState("");

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleApply() {
    if (!croppedAreaPixels) return;
    const cropped = await getCroppedImg(file, croppedAreaPixels, rotation);
    onApply(cropped);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <div className="bg-white rounded-2xl shadow-xl flex flex-col w-[480px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <p className="font-bold text-[20px] leading-[1.6] text-[rgba(0,0,0,0.87)]">Crop Image</p>
            <p className="text-[14px] text-[rgba(0,0,0,0.6)] mt-0.5">
              Drag to reposition, use slider to zoom.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[rgba(0,0,0,0.54)] hover:text-[rgba(0,0,0,0.87)] text-2xl leading-none ml-4"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Crop area */}
        <div className="relative w-full bg-[#e0e0e0]" style={{ height: 320 }}>
          <Cropper
            image={objectUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom + Rotate controls */}
        <div className="flex items-center gap-3 px-6 py-4">
          <p className="text-[14px] text-[rgba(0,0,0,0.6)] shrink-0">Zoom:</p>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-[#2d7a45]"
          />
          <p className="text-[14px] text-[rgba(0,0,0,0.87)] shrink-0 w-10 text-right">
            {zoom.toFixed(1)}x
          </p>
          <button
            type="button"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            title="Rotate 90°"
            className="shrink-0 flex items-center justify-center gap-1 px-2 h-8 rounded-[6px] border border-[rgba(0,0,0,0.23)] text-[rgba(0,0,0,0.7)] hover:bg-gray-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 12a8 8 0 1 1-8-8V2l6 3-6 3V6a6 6 0 1 0 6 6h2Z" fill="currentColor"/>
            </svg>
            <span className="text-[13px] leading-none">Rotate</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="text-[14px] font-bold text-[rgba(0,0,0,0.54)] uppercase px-4 py-2 hover:text-[rgba(0,0,0,0.87)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="bg-[#2d7a45] text-white font-bold text-[14px] uppercase px-5 py-2 rounded-[8px] hover:bg-[#245f37] transition-colors"
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PhotoPreviewCard ──────────────────────────────────────────────────────────
function PhotoPreviewCard({
  file,
  onRemove,
  onCrop,
  extraActions,
}: {
  file: File;
  onRemove?: () => void;
  onCrop?: () => void;
  extraActions?: React.ReactNode;
}) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  return (
    <div className="flex flex-col w-full border border-[rgba(0,0,0,0.1)] rounded-[8px] overflow-hidden" style={{ maxWidth: 650 }}>
      {/* Image with overlay buttons — 16:9 ratio */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "16/9" }}
      >
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={file.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        {/* Overlay buttons top-left */}
        {(extraActions || onCrop) && (
          <div className="absolute top-3 left-3 flex gap-2">
            {extraActions}
            {onCrop && (
              <button
                type="button"
                onClick={onCrop}
                className="bg-white border border-[#2d7a45] text-[#2d7a45] font-bold text-[12px] uppercase px-3 py-1.5 rounded-[6px] hover:bg-[#def2df] transition-colors"
              >
                Crop
              </button>
            )}
          </div>
        )}
      </div>
      {/* File info row */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white">
        <IconUpload size={20} color="#2d7a45" className="shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] leading-[1.33] text-[rgba(0,0,0,0.87)] truncate">{file.name}</p>
          <p className="text-[12px] text-[rgba(0,0,0,0.6)]">{formatSize(file.size)}</p>
        </div>
        <div className="size-2 rounded-full bg-[#00a63e] shrink-0" />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-[rgba(0,0,0,0.38)] hover:text-[#d32f2f] transition-colors shrink-0 text-xl leading-none ml-1"
            aria-label="Remove file"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

// ── drop zone ─────────────────────────────────────────────────────────────────
function DropZone({
  multiple,
  maxFiles,
  onFiles,
}: {
  multiple: boolean;
  maxFiles: number;
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  function processIncoming(list: FileList | null, existing: File[]) {
    if (!list) return;
    setError("");
    const valid: File[] = [];
    for (const f of Array.from(list)) {
      if (f.size > MAX_FILE_BYTES) {
        setError(`"${f.name}" exceeds the 3 MB limit.`);
        continue;
      }
      valid.push(f);
    }
    if (multiple) {
      const merged = [...existing, ...valid].slice(0, maxFiles);
      if (existing.length + valid.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed.`);
      }
      onFiles(merged);
    } else {
      if (valid.length > 0) onFiles([valid[0]]);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          processIncoming(e.dataTransfer.files, []);
        }}
        className={`border border-dashed rounded-[8px] p-10 flex flex-col items-center gap-2 cursor-pointer transition-colors select-none ${
          dragging
            ? "border-[#2d7a45] bg-[#f0faf3]"
            : "border-[rgba(0,0,0,0.23)] hover:border-[#2d7a45] hover:bg-[#f9fdfb]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/svg+xml"
          multiple={multiple}
          className="hidden"
          onChange={(e) => processIncoming(e.target.files, [])}
        />
        <IconUpload size={40} color="#2d7a45" className="shrink-0" />
        <p className="text-[14px] text-[rgba(0,0,0,0.87)] text-center">
          <span className="text-[#1976d2] underline">Click to upload</span>
          {" or drag and drop"}
        </p>
        <p className="text-[12px] text-[rgba(0,0,0,0.6)] text-center">
          PNG, JPG, GIF or SVG · max 3 MB
          {multiple && maxFiles > 1 ? ` · up to ${maxFiles} files` : ""}
        </p>
      </div>
      {error && <p className="text-[12px] text-[#d32f2f]">{error}</p>}
    </div>
  );
}

// ── MainPhotoUpload ───────────────────────────────────────────────────────────
function MainPhotoUpload({
  file,
  onFileChange,
}: {
  file: File | null;
  onFileChange: (f: File | null) => void;
}) {
  const [cropFile, setCropFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {file ? (
        <PhotoPreviewCard
          file={file}
          onRemove={() => onFileChange(null)}
          onCrop={() => setCropFile(file)}
        />
      ) : (
        <DropZone
          multiple={false}
          maxFiles={1}
          onFiles={(files) => onFileChange(files[0] ?? null)}
        />
      )}
      {cropFile && (
        <CropModal
          file={cropFile}
          onClose={() => setCropFile(null)}
          onApply={(cropped) => { onFileChange(cropped); setCropFile(null); }}
        />
      )}
    </div>
  );
}

// ── SupportingPhotosUpload ────────────────────────────────────────────────────
function SupportingPhotosUpload({
  files,
  onFilesChange,
  mainPhoto,
  onSwapWithMain,
}: {
  files: File[];
  onFilesChange: (files: File[]) => void;
  mainPhoto: File | null;
  onSwapWithMain: (index: number) => void;
}) {
  const [cropTarget, setCropTarget] = useState<{ file: File; index: number } | null>(null);

  function removeFile(i: number) {
    onFilesChange(files.filter((_, idx) => idx !== i));
  }

  function applyCrop(cropped: File) {
    if (cropTarget === null) return;
    const next = [...files];
    next[cropTarget.index] = cropped;
    onFilesChange(next);
    setCropTarget(null);
  }

  return (
    <div className="flex flex-col gap-3">
      {files.map((file, i) => (
        <PhotoPreviewCard
          key={i}
          file={file}
          onRemove={() => removeFile(i)}
          onCrop={() => setCropTarget({ file, index: i })}
          extraActions={
            <button
              type="button"
              onClick={() => onSwapWithMain(i)}
              className="bg-white border border-[#2d7a45] text-[#2d7a45] font-bold text-[12px] uppercase px-3 py-1.5 rounded-[6px] hover:bg-[#def2df] transition-colors"
            >
              Set as main photo
            </button>
          }
        />
      ))}

      {files.length < 5 && (
        <DropZone
          multiple
          maxFiles={5 - files.length}
          onFiles={(incoming) => {
            const merged = [...files, ...incoming].slice(0, 5);
            onFilesChange(merged);
          }}
        />
      )}

      {cropTarget && (
        <CropModal
          file={cropTarget.file}
          onClose={() => setCropTarget(null)}
          onApply={applyCrop}
        />
      )}
    </div>
  );
}

function Step4({
  gardenStory1, setGardenStory1,
  gardenStory2, setGardenStory2,
  gardenStory3, setGardenStory3,
  gardenStory4, setGardenStory4,
  mainPhoto, setMainPhoto,
  supportingPhotos, setSupportingPhotos,
}: {
  gardenStory1: string; setGardenStory1: (v: string) => void;
  gardenStory2: string; setGardenStory2: (v: string) => void;
  gardenStory3: string; setGardenStory3: (v: string) => void;
  gardenStory4: string; setGardenStory4: (v: string) => void;
  mainPhoto: File | null; setMainPhoto: (f: File | null) => void;
  supportingPhotos: File[]; setSupportingPhotos: (f: File[]) => void;
}) {
  function handleSwapWithMain(index: number) {
    const supporting = supportingPhotos[index];
    if (!supporting) return;
    const newSupporting = [...supportingPhotos];
    if (mainPhoto) {
      newSupporting[index] = mainPhoto;
    } else {
      newSupporting.splice(index, 1);
    }
    setMainPhoto(supporting);
    setSupportingPhotos(newSupporting);
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionCard
        title="Garden Story"
        required
        description="2–3 sentences each"
      >
        <div className="flex flex-col gap-4 w-full">
          <StdField label="Where is your garden, and who does it serve?" value={gardenStory1} onChange={setGardenStory1} />
          <StdField label="What challenge does your garden help address, and why does it matter locally?" value={gardenStory2} onChange={setGardenStory2} />
          <StdField label="What happens in the garden during the growing season?" value={gardenStory3} onChange={setGardenStory3} />
          <StdField label="What will this year's SeedMoney campaign make possible?" value={gardenStory4} onChange={setGardenStory4} />
        </div>
      </SectionCard>

      <SectionCard
        title="Main Photo"
        required
        description="Upload one clear, high-quality photo that best represents your project. This photo will appear at the top of your campaign page."
      >
        <MainPhotoUpload file={mainPhoto} onFileChange={setMainPhoto} />
      </SectionCard>

      <SectionCard
        title="Supporting Photos"
        description={
          "You may upload up to five additional photos that help tell your garden's story.\n*Please choose real, authentic photos of your project and do not upload logos, flyers, graphics, or AI-generated images."
        }
      >
        <SupportingPhotosUpload
          files={supportingPhotos}
          onFilesChange={setSupportingPhotos}
          mainPhoto={mainPhoto}
          onSwapWithMain={handleSwapWithMain}
        />
      </SectionCard>
    </div>
  );
}

// ── step 5: Contact Information ───────────────────────────────────────────────
function Step5({
  orgName, setOrgName,
  orgEIN, setOrgEIN,
  street1, setStreet1,
  street2, setStreet2,
  mailCity, setMailCity,
  mailState, setMailState,
  mailCountry, setMailCountry,
  mailZip, setMailZip,
  firstName, setFirstName,
  lastName, setLastName,
  contactEmail, setContactEmail,
  contactRole, setContactRole,
  statesMap, countries,
}: {
  orgName: string; setOrgName: (v: string) => void;
  orgEIN: string; setOrgEIN: (v: string) => void;
  street1: string; setStreet1: (v: string) => void;
  street2: string; setStreet2: (v: string) => void;
  mailCity: string; setMailCity: (v: string) => void;
  mailState: string; setMailState: (v: string) => void;
  mailCountry: string; setMailCountry: (v: string) => void;
  mailZip: string; setMailZip: (v: string) => void;
  firstName: string; setFirstName: (v: string) => void;
  lastName: string; setLastName: (v: string) => void;
  contactEmail: string; setContactEmail: (v: string) => void;
  contactRole: string; setContactRole: (v: string) => void;
  statesMap: Record<string, GeoOption[]>;
  countries: GeoOption[];
}) {
  const mailStateOptions = statesMap[mailCountry] ?? [];
  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionCard title="Organization Information" required>
        <div className="flex flex-col gap-4 w-full">
          <StdField label="Legal Name of Beneficiary Organization" value={orgName} onChange={setOrgName} />
          <StdField
            label="EIN or Public-Sector Identifier"
            value={orgEIN}
            onChange={setOrgEIN}
            placeholder="e.g., 52-3456789"
            helperText="For US nonprofits, your 9-digit IRS EIN. For schools or government entities, your institutional identifier."
          />
        </div>
      </SectionCard>

      <SectionCard title="Beneficiary Organization Mailing Address" required>
        <div className="flex flex-col gap-4 w-full">
          <StdField label="Street 1" value={street1} onChange={setStreet1} />
          <StdField label="Street 2" value={street2} onChange={setStreet2} />
          <StdField label="City" value={mailCity} onChange={setMailCity} />
          <TextField
            select
            variant="standard"
            label="State / Province"
            value={mailState}
            onChange={(e) => setMailState(e.target.value)}
            fullWidth
            sx={fieldSx}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {mailStateOptions.map(({ code, name }) => (
              <MenuItem key={code} value={code}>{name}</MenuItem>
            ))}
          </TextField>
          <StdField label="ZIP / Postal Code" value={mailZip} onChange={setMailZip} />
          <TextField
            select
            variant="standard"
            label="Country"
            value={mailCountry}
            onChange={(e) => setMailCountry(e.target.value)}
            fullWidth
            sx={fieldSx}
          >
            {countries.map(({ code, name }) => (
              <MenuItem key={code} value={code}>{name}</MenuItem>
            ))}
          </TextField>
        </div>
      </SectionCard>

      <SectionCard title="Primary Contact Information" required>
        <div className="flex flex-col gap-4 w-full">
          <StdField label="First Name" value={firstName} onChange={setFirstName} />
          <StdField label="Last Name" value={lastName} onChange={setLastName} />
          <StdField label="Email" type="email" value={contactEmail} onChange={setContactEmail} />
          <StdField label="Role or Title" value={contactRole} onChange={setContactRole} />
        </div>
      </SectionCard>
    </div>
  );
}

// ── review field ──────────────────────────────────────────────────────────────
function ReviewField({ label, value, error }: { label: string; value?: string; error?: boolean }) {
  const showError = error && !value;
  return (
    <div className={`flex flex-col w-full border-b pb-3 ${showError ? "border-[#d32f2f]" : "border-[rgba(0,0,0,0.1)]"}`}>
      <p className={`text-[12px] leading-[1.33] ${showError ? "text-[#d32f2f]" : "text-[rgba(0,0,0,0.6)]"}`}>{label}</p>
      <p className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)] mt-0.5 min-h-[24px]">
        {value}
      </p>
    </div>
  );
}

function ReviewSectionTitle({ title }: { title: string }) {
  return (
    <p className="font-bold text-[20px] leading-[1.6] text-[rgba(0,0,0,0.87)] mt-6 mb-2 first:mt-0">
      {title}
    </p>
  );
}

function ReviewSubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-5 md:p-[25px] flex flex-col gap-4 w-full">
      <p className="font-bold text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">
        {title}
      </p>
      {children}
    </div>
  );
}

function ReviewErrorBanner({ message, onEdit }: { message: string; onEdit: () => void }) {
  return (
    <div className="bg-[#fdeded] rounded-[4px] flex items-start px-4 py-[6px] w-full">
      {/* ErrorOutline icon */}
      <div className="shrink-0 pt-[7px] pr-3">
        <IconErrorOutline size={22} color="#d32f2f" />
      </div>
      {/* Message */}
      <p className="flex-1 py-2 text-[14px] leading-[1.43] tracking-[0.15px] text-[#5f2120] min-w-0">
        {message}
      </p>
      {/* Edit button */}
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 flex items-center gap-1.5 pl-4 pt-1 hover:opacity-80 transition-opacity"
      >
        <IconPencil size={18} color="#d32f2f" />
        <span className="text-[13px] font-bold leading-[22px] tracking-[0.46px] uppercase text-[#d32f2f]">
          Edit
        </span>
      </button>
    </div>
  );
}

function ReviewUploadedFile({ name, size }: { name: string; size: string }) {
  return (
    <div className="flex items-center justify-between border border-[rgba(0,0,0,0.1)] rounded-[8px] px-4 py-3">
      <div className="flex items-center gap-3">
        <IconUpload size={20} color="#2d7a45" className="shrink-0" />
        <div>
          <p className="text-[14px] leading-[1.33] text-[rgba(0,0,0,0.87)]">{name}</p>
          <p className="text-[12px] text-[rgba(0,0,0,0.6)]">{size}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="size-2 rounded-full bg-[#00a63e]" />
      </div>
    </div>
  );
}

// ── step 6: Review & Submit ───────────────────────────────────────────────────
type Step6Props = {
  campaignTitle: string; peopleCount: string; gardenSize: string;
  gardenType: string; fundraisingGoal: string;
  gardenCity: string; gardenState: string; gardenCountry: string;
  projectCategory: string; projectCategoryOther: string;
  beneficiaryPops: string[]; beneficiaryOther: string;
  gardenStory1: string; gardenStory2: string; gardenStory3: string; gardenStory4: string;
  mainPhoto: File | null; supportingPhotos: File[];
  orgName: string; orgEIN: string;
  street1: string; street2: string; mailCity: string; mailState: string;
  mailZip: string; mailCountry: string;
  firstName: string; lastName: string; contactEmail: string; contactRole: string;
  statesMap: Record<string, GeoOption[]>; countries: GeoOption[];
  onGoToStep: (step: Step) => void;
};

function Step6(props: Step6Props) {
  const {
    campaignTitle, peopleCount, gardenSize, gardenType, fundraisingGoal,
    gardenCity, gardenState, gardenCountry, projectCategory, projectCategoryOther, beneficiaryPops, beneficiaryOther,
    gardenStory1, gardenStory2, gardenStory3, gardenStory4,
    mainPhoto, supportingPhotos,
    orgName, orgEIN, street1, street2, mailCity, mailState, mailZip, mailCountry,
    firstName, lastName, contactEmail, contactRole,
    statesMap, countries, onGoToStep,
  } = props;

  function lookupName(list: GeoOption[], code: string) {
    return list.find((o) => o.code === code)?.name ?? code;
  }

  const campaignError = !campaignTitle || !peopleCount || !gardenSize || !gardenType || !fundraisingGoal;
  const gardenInfoError = !gardenCity || !gardenState || !projectCategory || beneficiaryPops.length === 0;
  const gardenStoryError = !gardenStory1 || !gardenStory2 || !gardenStory3 || !gardenStory4 || !mainPhoto;
  const contactError = !orgName || !street1 || !mailCity || !mailState || !mailZip || !firstName || !lastName || !contactEmail;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ── Campaign Information ── */}
      <ReviewSectionTitle title="Campaign Information" />
      {campaignError && <ReviewErrorBanner message="Please complete campaign information." onEdit={() => onGoToStep(1)} />}

      <ReviewSubSection title="Campaign Title">
        <ReviewField label="Campaign Title" value={campaignTitle || undefined} error={!campaignTitle} />
        <p className="text-[12px] text-[rgba(0,0,0,0.6)]">60 max characters</p>
      </ReviewSubSection>

      <ReviewSubSection title="Project Details & Impact">
        <ReviewField label="About how many people will benefit from this garden this year?" value={peopleCount || undefined} error={!peopleCount} />
        <ReviewField label="Approximate garden size or scope" value={gardenSize || undefined} error={!gardenSize} />
        <div className="flex flex-col gap-1">
          <p className={`text-[14px] leading-[1.5] ${!gardenType ? "text-[#d32f2f]" : "text-[rgba(0,0,0,0.87)]"}`}>Is this a new or existing garden?</p>
          {["New garden", "Existing garden"].map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input type="radio" readOnly checked={gardenType === opt} onChange={() => {}} className="accent-[#2d7a45] size-4" />
              <span className={`text-[16px] leading-[1.5] ${gardenType === opt ? "text-[rgba(0,0,0,0.87)]" : !gardenType ? "text-[#d32f2f]" : "text-[rgba(0,0,0,0.38)]"}`}>{opt}</span>
            </label>
          ))}
        </div>
      </ReviewSubSection>

      <ReviewSubSection title="Fundraising Goal">
        <ReviewField label="Fundraising Goal (USD)" value={fundraisingGoal ? `$${Number(fundraisingGoal).toLocaleString()}` : undefined} error={!fundraisingGoal} />
      </ReviewSubSection>

      {/* ── Garden Information ── */}
      <ReviewSectionTitle title="Garden Information" />
      {gardenInfoError && <ReviewErrorBanner message="Please complete garden information." onEdit={() => onGoToStep(2)} />}

      <ReviewSubSection title="Garden Location">
        <ReviewField label="City*" value={gardenCity || undefined} error={!gardenCity} />
        <ReviewField label="State / Province*" value={gardenState ? lookupName(statesMap[gardenCountry] ?? [], gardenState) : undefined} error={!gardenState} />
        <ReviewField label="Country" value={gardenCountry ? lookupName(countries, gardenCountry) : undefined} />
      </ReviewSubSection>

      <ReviewSubSection title="Primary Project Category">
        {projectCategory ? (
          <div className="flex items-center gap-2">
            <input type="radio" readOnly checked onChange={() => {}} className="accent-[#2d7a45] size-4" />
            <span className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">
              {projectCategory === "Other (please specify)" && projectCategoryOther ? projectCategoryOther : projectCategory}
            </span>
          </div>
        ) : (
          <p className="text-[14px] text-[#d32f2f]">No category selected</p>
        )}
      </ReviewSubSection>

      <ReviewSubSection title="Beneficiary Populations Served">
        {beneficiaryPops.length > 0 ? (
          <div className="flex flex-col gap-1">
            {beneficiaryPops.map((pop) => (
              <div key={pop} className="flex items-center gap-2">
                <input type="checkbox" readOnly checked onChange={() => {}} className="size-[18px] accent-[#2d7a45]" />
                <span className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">
                  {pop === "Other (please specify)" && beneficiaryOther ? beneficiaryOther : pop}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-[#d32f2f]">No populations selected</p>
        )}
      </ReviewSubSection>

      {/* ── Garden Story ── */}
      <ReviewSectionTitle title="Garden Story" />
      {gardenStoryError && <ReviewErrorBanner message="Please complete garden story and add a main photo." onEdit={() => onGoToStep(3)} />}

      <ReviewSubSection title="Garden Story">
        <ReviewField label="Where is your garden, and who does it serve?" value={gardenStory1 || undefined} error={!gardenStory1} />
        <ReviewField label="What challenge does your garden help address, and why does it matter locally?" value={gardenStory2 || undefined} error={!gardenStory2} />
        <ReviewField label="What happens in the garden during the growing season?" value={gardenStory3 || undefined} error={!gardenStory3} />
        <ReviewField label="What will this year's SeedMoney campaign make possible?" value={gardenStory4 || undefined} error={!gardenStory4} />
      </ReviewSubSection>

      <ReviewSubSection title="Main Photo">
        {mainPhoto ? (
          <PhotoPreviewCard file={mainPhoto} />
        ) : (
          <p className="text-[14px] text-[#d32f2f]">No photo uploaded</p>
        )}
      </ReviewSubSection>

      <ReviewSubSection title="Supporting Photos">
        {supportingPhotos.length > 0 ? (
          supportingPhotos.map((f, i) => (
            <PhotoPreviewCard key={i} file={f} />
          ))
        ) : (
          <p className="text-[14px] text-[rgba(0,0,0,0.38)]">No supporting photos uploaded</p>
        )}
      </ReviewSubSection>

      {/* ── Contact Information ── */}
      <ReviewSectionTitle title="Contact Information" />
      {contactError && <ReviewErrorBanner message="Please complete contact information." onEdit={() => onGoToStep(4)} />}

      <ReviewSubSection title="Organization Information">
        <ReviewField label="Legal Name of Beneficiary Organization*" value={orgName || undefined} error={!orgName} />
        <ReviewField label="EIN or Public-Sector Identifier" value={orgEIN || undefined} />
      </ReviewSubSection>

      <ReviewSubSection title="Beneficiary Organization Mailing Address">
        <ReviewField label="Street 1" value={street1 || undefined} error={!street1} />
        <ReviewField label="Street 2" value={street2 || undefined} />
        <ReviewField label="City*" value={mailCity || undefined} error={!mailCity} />
        <ReviewField label="State / Province*" value={mailState ? lookupName(statesMap[mailCountry] ?? [], mailState) : undefined} error={!mailState} />
        <ReviewField label="ZIP / Postal Code*" value={mailZip || undefined} error={!mailZip} />
        <ReviewField label="Country" value={mailCountry ? lookupName(countries, mailCountry) : undefined} />
      </ReviewSubSection>

      <ReviewSubSection title="Primary Contact Information">
        <ReviewField label="First Name*" value={firstName || undefined} error={!firstName} />
        <ReviewField label="Last Name*" value={lastName || undefined} error={!lastName} />
        <ReviewField label="Email*" value={contactEmail || undefined} error={!contactEmail} />
        <ReviewField label="Role or Title" value={contactRole || undefined} />
      </ReviewSubSection>
    </div>
  );
}

// ── dashboard footer ──────────────────────────────────────────────────────────
function DashboardFooter() {
  return (
    <div className="border-t border-[#b5b5b5] pt-6 font-[family-name:var(--font-opensans)] text-[14px] text-[#666]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-start md:items-center order-1 md:order-2">
          <a href="https://donate.seedmoney.org/" className="hover:underline">SeedMoney</a>
          <a href="https://donate.seedmoney.org/contact" className="hover:underline">Contact</a>
          <a href="https://donate.seedmoney.org/faq" className="hover:underline">FAQ</a>
          <a href="https://donate.seedmoney.org/tos" className="hover:underline">Terms</a>
          <a href="https://donate.seedmoney.org/privacy" className="hover:underline">Privacy Policy</a>
        </div>
        <span className="order-2 md:order-1">© 2026 SeedMoney All Rights Reserved.</span>
      </div>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────
type ValidationState = "ok" | "error" | "unvisited";


// Tiny component — the ONLY part that calls useSearchParams, wrapped in Suspense
function FromActiveReader({ onRead }: { onRead: (v: boolean) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onRead(searchParams.get("from") === "active");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default function ApplicationPage() {
  const router = useRouter();
  const [isFromActive, setIsFromActive] = useState(false);
  const draftKey = isFromActive ? DRAFT_KEY_NEW : DRAFT_KEY;
  const dashboardUrl = isFromActive ? "/dashboard?state=active" : "/dashboard";
  const [step, setStep] = useState<Step>(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [pendingCampaigns, setPendingCampaigns] = useState<{ title: string }[]>([]);
  const [checked, setChecked] = useState<boolean[]>(
    Array(GRANTEE_ITEMS.length).fill(false)
  );
  const [validations, setValidations] = useState<ValidationState[]>(
    Array(6).fill("unvisited")
  );
  // Step 2
  const [campaignTitle, setCampaignTitle] = useState("");
  const [peopleCount, setPeopleCount] = useState("");
  const [gardenSize, setGardenSize] = useState("");
  const [gardenType, setGardenType] = useState("");
  const [fundraisingGoal, setFundraisingGoal] = useState("");
  // Step 3
  const [gardenCity, setGardenCity] = useState("");
  const [gardenState, setGardenState] = useState("");
  const [gardenCountry, setGardenCountry] = useState("US");
  const [projectCategory, setProjectCategory] = useState("");
  const [projectCategoryOther, setProjectCategoryOther] = useState("");
  const [beneficiaryPops, setBeneficiaryPops] = useState<string[]>([]);
  const [beneficiaryOther, setBeneficiaryOther] = useState("");
  // Step 4
  const [gardenStory1, setGardenStory1] = useState("");
  const [gardenStory2, setGardenStory2] = useState("");
  const [gardenStory3, setGardenStory3] = useState("");
  const [gardenStory4, setGardenStory4] = useState("");
  const [mainPhoto, setMainPhoto] = useState<File | null>(null);
  const [supportingPhotos, setSupportingPhotos] = useState<File[]>([]);
  // Step 5
  const [orgName, setOrgName] = useState("");
  const [orgEIN, setOrgEIN] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [mailCity, setMailCity] = useState("");
  const [mailState, setMailState] = useState("");
  const [mailZip, setMailZip] = useState("");
  const [mailCountry, setMailCountry] = useState("US");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactRole, setContactRole] = useState("");
  // Geo
  const [statesMap, setStatesMap] = useState<Record<string, GeoOption[]>>({
    NG: [
      { code: "NG-AB", name: "Abia State" },
      { code: "NG-AD", name: "Adamawa State" },
      { code: "NG-AK", name: "Akwa Ibom State" },
      { code: "NG-AN", name: "Anambra State" },
      { code: "NG-BA", name: "Bauchi State" },
      { code: "NG-BY", name: "Bayelsa State" },
      { code: "NG-BE", name: "Benue State" },
      { code: "NG-BO", name: "Borno State" },
      { code: "NG-CR", name: "Cross River State" },
      { code: "NG-DE", name: "Delta State" },
      { code: "NG-EB", name: "Ebonyi State" },
      { code: "NG-ED", name: "Edo State" },
      { code: "NG-EK", name: "Ekiti State" },
      { code: "NG-EN", name: "Enugu State" },
      { code: "NG-FC", name: "Federal Capital Territory" },
      { code: "NG-GO", name: "Gombe State" },
      { code: "NG-IM", name: "Imo State" },
      { code: "NG-JI", name: "Jigawa State" },
      { code: "NG-KD", name: "Kaduna State" },
      { code: "NG-KN", name: "Kano State" },
      { code: "NG-KT", name: "Katsina State" },
      { code: "NG-KE", name: "Kebbi State" },
      { code: "NG-KO", name: "Kogi State" },
      { code: "NG-KW", name: "Kwara State" },
      { code: "NG-LA", name: "Lagos State" },
      { code: "NG-NA", name: "Nasarawa State" },
      { code: "NG-NI", name: "Niger State" },
      { code: "NG-OG", name: "Ogun State" },
      { code: "NG-ON", name: "Ondo State" },
      { code: "NG-OS", name: "Osun State" },
      { code: "NG-OY", name: "Oyo State" },
      { code: "NG-PL", name: "Plateau State" },
      { code: "NG-RI", name: "Rivers State" },
      { code: "NG-SO", name: "Sokoto State" },
      { code: "NG-TA", name: "Taraba State" },
      { code: "NG-YO", name: "Yobe State" },
      { code: "NG-ZA", name: "Zamfara State" },
    ],
  });
  const [countries, setCountries] = useState<GeoOption[]>(FALLBACK_COUNTRIES);

  // Auto-save
  const [savedAt, setSavedAt] = useState("");
  const draftRef = useRef<Record<string, unknown>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const submittedRef = useRef(false);

  // Keep ref current every render so the interval always has fresh values
  draftRef.current = {
    step, checked, campaignTitle, peopleCount, gardenSize, gardenType, fundraisingGoal,
    gardenCity, gardenState, gardenCountry, projectCategory, projectCategoryOther, beneficiaryPops, beneficiaryOther,
    gardenStory1, gardenStory2, gardenStory3, gardenStory4,
    orgName, orgEIN, street1, street2, mailCity, mailState, mailZip, mailCountry,
    firstName, lastName, contactEmail, contactRole,
  };

  // Read pending campaigns on mount
  useEffect(() => {
    const rawPending = sessionStorage.getItem("seedmoney_pending");
    if (rawPending) {
      try {
        const parsed = JSON.parse(rawPending);
        if (Array.isArray(parsed)) {
          setPendingCampaigns(parsed);
        } else if (parsed && typeof parsed.title === "string") {
          const migrated = [{ title: parsed.title }];
          setPendingCampaigns(migrated);
          sessionStorage.setItem("seedmoney_pending", JSON.stringify(migrated));
        }
      } catch {}
    }
  }, []);

  // Restore draft on mount
  useEffect(() => {
    const raw = sessionStorage.getItem(draftKey);
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      if (d.step !== undefined) setStep(d.step as Step);
      if (Array.isArray(d.checked)) setChecked(d.checked);
      setCampaignTitle(d.campaignTitle ?? "");
      setPeopleCount(d.peopleCount ?? "");
      setGardenSize(d.gardenSize ?? "");
      setGardenType(d.gardenType ?? "");
      setFundraisingGoal(d.fundraisingGoal ?? "");
      setGardenCity(d.gardenCity ?? "");
      setGardenState(d.gardenState ?? "");
      setGardenCountry(d.gardenCountry ?? "US");
      setProjectCategory(d.projectCategory ?? "");
      setProjectCategoryOther(d.projectCategoryOther ?? "");
      setBeneficiaryPops(d.beneficiaryPops ?? []);
      setBeneficiaryOther(d.beneficiaryOther ?? "");
      setGardenStory1(d.gardenStory1 ?? "");
      setGardenStory2(d.gardenStory2 ?? "");
      setGardenStory3(d.gardenStory3 ?? "");
      setGardenStory4(d.gardenStory4 ?? "");
      setOrgName(d.orgName ?? "");
      setOrgEIN(d.orgEIN ?? "");
      setStreet1(d.street1 ?? "");
      setStreet2(d.street2 ?? "");
      setMailCity(d.mailCity ?? "");
      setMailState(d.mailState ?? "");
      setMailZip(d.mailZip ?? "");
      setMailCountry(d.mailCountry ?? "US");
      setFirstName(d.firstName ?? "");
      setLastName(d.lastName ?? "");
      setContactEmail(d.contactEmail ?? "");
      setContactRole(d.contactRole ?? "");
      if (d.savedAt) setSavedAt(d.savedAt);

      // Recompute validation state for every step before the restored step
      const restoredStep: number = typeof d.step === "number" ? d.step : 0;
      const dChecked: boolean[] = Array.isArray(d.checked) ? d.checked : Array(GRANTEE_ITEMS.length).fill(false);
      const computed: ValidationState[] = Array(6).fill("unvisited") as ValidationState[];
      for (let i = 0; i < restoredStep && i < 6; i++) {
        let valid: boolean;
        switch (i) {
          case 0: valid = GRANTEE_ITEMS.every((item, idx) => !item.endsWith("*") || dChecked[idx]); break;
          case 1: valid = !!String(d.campaignTitle ?? "").trim() && !!String(d.peopleCount ?? "").trim() && !!String(d.gardenSize ?? "").trim() && !!d.gardenType && !!String(d.fundraisingGoal ?? "").trim(); break;
          case 2: valid = !!String(d.gardenCity ?? "").trim(); break;
          case 3: valid = !!String(d.gardenStory1 ?? "").trim() && !!String(d.gardenStory2 ?? "").trim() && !!String(d.gardenStory3 ?? "").trim() && !!String(d.gardenStory4 ?? "").trim(); break;
          case 4: valid = !!String(d.orgName ?? "").trim() && !!String(d.street1 ?? "").trim() && !!String(d.mailCity ?? "").trim() && !!String(d.mailState ?? "").trim() && !!String(d.mailZip ?? "").trim() && !!String(d.firstName ?? "").trim() && !!String(d.lastName ?? "").trim() && !!String(d.contactEmail ?? "").trim(); break;
          default: valid = true;
        }
        computed[i] = valid ? "ok" : "unvisited";
      }
      setValidations(computed);
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save 1 second after any field change
  useEffect(() => {
    if (submittedRef.current) return;
    const timer = setTimeout(() => {
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      sessionStorage.setItem(draftKey, JSON.stringify({ ...draftRef.current, savedAt: time }));
      setSavedAt(time);
    }, 1000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, checked, campaignTitle, peopleCount, gardenSize, gardenType, fundraisingGoal,
      gardenCity, gardenState, gardenCountry, projectCategory, projectCategoryOther, beneficiaryPops, beneficiaryOther,
      gardenStory1, gardenStory2, gardenStory3, gardenStory4,
      orgName, orgEIN, street1, street2, mailCity, mailState, mailZip, mailCountry,
      firstName, lastName, contactEmail, contactRole]);

  useEffect(() => {
    // Fetch countries from REST Countries API
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
      .then((r) => r.json())
      .then((data: { name: { common: string }; cca2: string }[]) => {
        const sorted = data
          .map((c) => ({ code: c.cca2, name: c.name.common }))
          .sort((a, b) => a.name.localeCompare(b.name));
        const us = sorted.find((c) => c.code === "US");
        setCountries(us ? [us, ...sorted.filter((c) => c.code !== "US")] : sorted);
      })
      .catch(() => {});

    // Fetch states for supported countries
    const COUNTRY_FETCHES: { code: string; name: string }[] = [
      { code: "US", name: "United States" },
      { code: "KE", name: "Kenya" },
      { code: "UG", name: "Uganda" },
    ];
    for (const { code, name } of COUNTRY_FETCHES) {
      fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: name }),
      })
        .then((r) => r.json())
        .then((data: { data: { states: { name: string; state_code: string }[] } }) => {
          const raw = (data.data?.states ?? []).map((s) => ({ code: s.state_code || s.name, name: s.name }));
          if (code === "KE" && !raw.some((s) => s.name === "Butere")) {
            raw.push({ code: "Butere", name: "Butere" });
          }
          const states = raw.sort((a, b) => a.name.localeCompare(b.name));
          setStatesMap((prev) => ({ ...prev, [code]: states }));
        })
        .catch(() => {});
    }
  }, []);

  function saveDraft() {
    sessionStorage.setItem(draftKey, JSON.stringify({ ...draftRef.current }));
  }

  function validateCurrentStep(): boolean {
    switch (step) {
      case 0: return GRANTEE_ITEMS.every((item, i) => !item.endsWith("*") || checked[i]);
      case 1: return campaignTitle.trim() !== "" && peopleCount.trim() !== "" && gardenSize.trim() !== "" && gardenType !== "" && fundraisingGoal.trim() !== "";
      case 2: return gardenCity.trim() !== "";
      case 3: return gardenStory1.trim() !== "" && gardenStory2.trim() !== "" && gardenStory3.trim() !== "" && gardenStory4.trim() !== "";
      case 4: return orgName.trim() !== "" && street1.trim() !== "" && mailCity.trim() !== "" && mailState.trim() !== "" && mailZip.trim() !== "" && firstName.trim() !== "" && lastName.trim() !== "" && contactEmail.trim() !== "";
      case 5: return true;
      default: return true;
    }
  }

  function handleNext() {
    const valid = validateCurrentStep();
    const newValidations = [...validations] as ValidationState[];
    newValidations[step] = valid ? "ok" : "error";
    setValidations(newValidations);

    // Step 0 blocks on invalid; all other steps allow proceeding
    if (step === 0 && !valid) return;

    if (step < 5) { setStep((step + 1) as Step); scrollRef.current?.scrollTo({ top: 0 }); }
    else {
      const parsed = JSON.parse(sessionStorage.getItem("seedmoney_pending") ?? "[]");
      const existing: { title: string }[] = Array.isArray(parsed) ? parsed : [];
      existing.push({ title: campaignTitle });
      sessionStorage.setItem("seedmoney_pending", JSON.stringify(existing));
      submittedRef.current = true;
      sessionStorage.removeItem(draftKey);
      sessionStorage.setItem("seedmoney_from_submit", "1");
      router.push(dashboardUrl);
    }
  }

  function handlePrev() {
    if (step === 0) { saveDraft(); sessionStorage.setItem("seedmoney_from_submit", "1"); router.push(dashboardUrl); }
    else { setStep((step - 1) as Step); scrollRef.current?.scrollTo({ top: 0 }); }
  }

  function handleStepNavigation(nextStep: Step) {
    if (nextStep > 0 && !GRANTEE_ITEMS.every((item, i) => !item.endsWith("*") || checked[i])) {
      setValidations((prev) => {
        const next = [...prev];
        next[0] = "error";
        return next;
      });
      setStep(0);
      scrollRef.current?.scrollTo({ top: 0 });
      return;
    }

    setStep(nextStep);
    scrollRef.current?.scrollTo({ top: 0 });
  }

  function toggleCheck(i: number) {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  }

  const hasAcceptedAgreement = GRANTEE_ITEMS.every((item, i) => !item.endsWith("*") || checked[i]);
  const hasRequiredErrors =
    !campaignTitle || !peopleCount || !gardenSize || !gardenType || !fundraisingGoal ||
    !gardenCity || !gardenState || !projectCategory || beneficiaryPops.length === 0 ||
    !gardenStory1 || !gardenStory2 || !gardenStory3 || !gardenStory4 || !mainPhoto ||
    !orgName || !street1 || !mailCity || !mailState || !mailZip || !firstName || !lastName || !contactEmail;

  const canNext =
    step === 0 ? hasAcceptedAgreement :
    step === 5 ? hasAcceptedAgreement && !hasRequiredErrors :
    true;

  return (
    <ThemeProvider theme={muiTheme}>
    <div className="flex h-screen bg-[#f6faf9] overflow-hidden">
      {/* Left nav sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        pendingCampaigns={pendingCampaigns}
        draftTitle={campaignTitle || ""}
        selectedNav={{ type: "draft" }}
        onSelectPending={() => { saveDraft(); sessionStorage.setItem("seedmoney_from_submit", "1"); router.push(dashboardUrl); }}
        onSelectDraft={() => {}}
        onSelectActive={(_idx) => { saveDraft(); sessionStorage.setItem("seedmoney_from_submit", "1"); router.push(dashboardUrl); }}
        onNewCampaign={() => {}}
        onSettings={() => {}}
        onLogout={() => router.push("/")}
        activeCampaigns={isFromActive ? ["Full Belly Community Garden"] : []}
        disableNewCampaign
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      {/* Main content */}
      <div ref={scrollRef} className="flex flex-col flex-1 min-w-0 h-full overflow-y-auto px-5 md:px-10 pt-[60px] pb-5">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between gap-4">
            <p className="font-bold text-[24px] md:text-[32px] leading-[1.235] text-[#096b2e]">
              Application
            </p>
            <p className="p2 whitespace-nowrap" style={{ color: "var(--color-error)" }}>* Indicates required question</p>
          </div>

          {/* Mobile: horizontal progress stepper */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="flex items-center justify-between">
              {STEPS.map((s, i) => {
                const isError = i < step && validations[i] === "error";
                const isDone = i < step && !isError;
                const isCurrent = i === step;
                return (
                  <div key={i} className="flex flex-col items-center flex-1 relative">
                    {/* connector line */}
                    {i < STEPS.length - 1 && (
                      <div className={`absolute top-[5px] left-[calc(50%+8px)] w-[calc(100%-16px)] h-0.5 ${isDone ? "bg-[#56bd60]" : "bg-[rgba(0,0,0,0.1)]"}`} />
                    )}
                    <button
                      onClick={() => handleStepNavigation(i as Step)}
                      className="flex flex-col items-center gap-1 relative z-10"
                    >
                      <StepDot state={getDotState(i, step, validations)} size={12} />
                      <p className={`text-[10px] leading-tight text-center max-w-[48px] ${
                        isCurrent ? "font-bold text-black" : isError ? "text-[#d32f2f]" : isDone ? "text-[rgba(0,0,0,0.87)]" : "text-[rgba(0,0,0,0.5)]"
                      }`}>{s.replace("Information", "Info")}</p>
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => { saveDraft(); sessionStorage.setItem("seedmoney_from_submit", "1"); router.push(dashboardUrl); }}
                className="flex items-center gap-[6px] py-1 rounded-[8px] hover:bg-black/5 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <path d="M10 12L6 8L10 4" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[12px] leading-[1.33] text-[#666]">Exit</span>
              </button>
              <div className="flex items-center gap-2">
                <IconCloudUpload size={16} color={savedAt ? "#1a4a28" : "#666"} className="shrink-0" />
                <p className={`text-[12px] leading-[1.33] ${savedAt ? "text-[#1a4a28]" : "text-[#666]"}`}>
                  {savedAt ? `Auto saved at ${savedAt}` : "Not yet saved"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-10 items-start">
            {/* Progress timeline — desktop only */}
            <div className="hidden md:flex flex-col gap-6 shrink-0 w-[240px] sticky top-0">
              <div className="flex flex-col p-2">
                {STEPS.map((s, i) => {
                  const isError = i < step && validations[i] === "error";
                  const textClass = i === step
                    ? "text-black font-bold"
                    : isError
                    ? "text-[#d32f2f]"
                    : i < step
                    ? "text-[rgba(0,0,0,0.87)]"
                    : "text-[rgba(0,0,0,0.6)]";
                  return (
                    <div key={i} className="flex flex-col items-start">
                      <button
                        onClick={() => handleStepNavigation(i as Step)}
                        className="flex gap-4 items-center w-full text-left hover:opacity-70 transition-opacity"
                      >
                        <div className="my-[11.5px]">
                          <StepDot state={getDotState(i, step, validations)} size={12} />
                        </div>
                        <p className={`text-[14px] leading-[1.33] ${textClass}`}>
                          {s}
                        </p>
                      </button>
                      {i < STEPS.length - 1 && (
                        <div className={`ml-[5px] w-0.5 h-[35px] ${step > i ? "bg-[#56bd60]" : "bg-[rgba(0,0,0,0.1)]"}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 px-2">
                  <IconCloudUpload size={20} color={savedAt ? "#1a4a28" : "#666"} className="shrink-0" />
                  <p className={`text-[14px] leading-[1.33] ${savedAt ? "text-[#1a4a28]" : "text-[#666]"}`}>
                    {savedAt ? `Auto saved at ${savedAt}` : "Not yet saved"}
                  </p>
                </div>
                <button
                  onClick={() => { saveDraft(); sessionStorage.setItem("seedmoney_from_submit", "1"); router.push(dashboardUrl); }}
                  className="flex items-center gap-[6px] px-2 py-[10px] rounded-[8px] hover:bg-black/5 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                    <path d="M10 12L6 8L10 4" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[14px] leading-[1.33] text-[#666]">Exit</span>
                </button>
              </div>
            </div>

            {/* Form + navigation */}
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              {step === 0 && <Step1 checked={checked} onChange={toggleCheck} />}
              {step === 1 && <Step2
                campaignTitle={campaignTitle} setCampaignTitle={setCampaignTitle}
                peopleCount={peopleCount} setPeopleCount={setPeopleCount}
                gardenSize={gardenSize} setGardenSize={setGardenSize}
                gardenType={gardenType} setGardenType={setGardenType}
                fundraisingGoal={fundraisingGoal} setFundraisingGoal={setFundraisingGoal}
              />}
              {step === 2 && <Step3
                gardenCity={gardenCity} setGardenCity={setGardenCity}
                gardenState={gardenState} setGardenState={setGardenState}
                gardenCountry={gardenCountry} setGardenCountry={setGardenCountry}
                projectCategory={projectCategory} setProjectCategory={setProjectCategory}
                projectCategoryOther={projectCategoryOther} setProjectCategoryOther={setProjectCategoryOther}
                beneficiaryPops={beneficiaryPops} setBeneficiaryPops={setBeneficiaryPops}
                beneficiaryOther={beneficiaryOther} setBeneficiaryOther={setBeneficiaryOther}
                statesMap={statesMap} countries={countries}
              />}
              {step === 3 && <Step4
                gardenStory1={gardenStory1} setGardenStory1={setGardenStory1}
                gardenStory2={gardenStory2} setGardenStory2={setGardenStory2}
                gardenStory3={gardenStory3} setGardenStory3={setGardenStory3}
                gardenStory4={gardenStory4} setGardenStory4={setGardenStory4}
                mainPhoto={mainPhoto} setMainPhoto={setMainPhoto}
                supportingPhotos={supportingPhotos} setSupportingPhotos={setSupportingPhotos}
              />}
              {step === 4 && <Step5
                orgName={orgName} setOrgName={setOrgName}
                orgEIN={orgEIN} setOrgEIN={setOrgEIN}
                street1={street1} setStreet1={setStreet1}
                street2={street2} setStreet2={setStreet2}
                mailCity={mailCity} setMailCity={setMailCity}
                mailState={mailState} setMailState={setMailState}
                mailCountry={mailCountry} setMailCountry={setMailCountry}
                mailZip={mailZip} setMailZip={setMailZip}
                firstName={firstName} setFirstName={setFirstName}
                lastName={lastName} setLastName={setLastName}
                contactEmail={contactEmail} setContactEmail={setContactEmail}
                contactRole={contactRole} setContactRole={setContactRole}
                statesMap={statesMap} countries={countries}
              />}
              {step === 5 && <Step6
                campaignTitle={campaignTitle} peopleCount={peopleCount}
                gardenSize={gardenSize} gardenType={gardenType} fundraisingGoal={fundraisingGoal}
                gardenCity={gardenCity} gardenState={gardenState} gardenCountry={gardenCountry}
                projectCategory={projectCategory} projectCategoryOther={projectCategoryOther}
                beneficiaryPops={beneficiaryPops} beneficiaryOther={beneficiaryOther}
                gardenStory1={gardenStory1} gardenStory2={gardenStory2}
                gardenStory3={gardenStory3} gardenStory4={gardenStory4}
                mainPhoto={mainPhoto} supportingPhotos={supportingPhotos}
                orgName={orgName} orgEIN={orgEIN}
                street1={street1} street2={street2} mailCity={mailCity}
                mailState={mailState} mailZip={mailZip} mailCountry={mailCountry}
                firstName={firstName} lastName={lastName}
                contactEmail={contactEmail} contactRole={contactRole}
                statesMap={statesMap} countries={countries}
                onGoToStep={handleStepNavigation}
              />}

              <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
                <button
                  onClick={handlePrev}
                  className="bg-white border border-[#2d7a45] text-[#2d7a45] font-bold text-[16px] leading-[26px] px-5 py-[10px] rounded-[8px] uppercase hover:bg-[#def2df] transition-colors w-full md:w-auto text-center"
                >
                  {step === 0 ? "Cancel" : "Previous Step"}
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canNext}
                  className={`font-bold text-[16px] leading-[26px] px-5 py-[10px] rounded-[8px] uppercase transition-colors w-full md:w-auto text-center ${
                    canNext
                      ? "bg-[#2d7a45] text-white hover:bg-[#245f37]"
                      : "bg-[#e0e0e0] text-[#a6a6a6] cursor-not-allowed"
                  }`}
                >
                  {step === 5 ? "Submit Application" : "Next Step"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-5">
            <DashboardFooter />
          </div>
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
    </div>
    <Suspense fallback={null}>
      <FromActiveReader onRead={setIsFromActive} />
    </Suspense>
    </ThemeProvider>
  );
}
