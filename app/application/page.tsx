"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Sidebar } from "@/app/components/Sidebar";
import Image from "next/image";
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

// ── icon assets ──────────────────────────────────────────────────────────────
const imgAvatar =
  "https://www.figma.com/api/mcp/asset/d187743d-15a6-4e9e-a751-3f14ed9902fd";
const imgIconPlus =
  "https://www.figma.com/api/mcp/asset/2b7e1dab-f4c4-4e76-9fb9-799f0561d991";
const imgIconSettings =
  "https://www.figma.com/api/mcp/asset/82479ffb-191c-462d-afb6-adf43d036cc3";
const imgIconLogout =
  "https://www.figma.com/api/mcp/asset/e404e162-f3a5-48eb-bac8-3a9e76c3d9f0";
// collapse/expand arrows — left = collapse (<), right = expand (>)
const imgIconCollapseLeft =
  "https://www.figma.com/api/mcp/asset/8371b03c-eae1-4053-8d41-f4587501d654";
const imgIconExpandRight =
  "https://www.figma.com/api/mcp/asset/16b1db03-fce3-4e6d-97a2-4b2a6c94c29b";
// timeline dots — 4 states
const imgDotNotYet =
  "https://www.figma.com/api/mcp/asset/0f07f994-cced-4438-ad74-095e940550ab"; // gray hollow
const imgDotCurrent =
  "https://www.figma.com/api/mcp/asset/c0290704-c9f9-47cb-84d2-949ff57aa9f9"; // green hollow
const imgDotError =
  "https://www.figma.com/api/mcp/asset/a62c9ed4-1b89-40b1-aa72-3a8c791f3bb2"; // red hollow
const imgDotCompleted =
  "https://www.figma.com/api/mcp/asset/8d04fe67-21a9-49b5-9a17-c54b246bc606"; // green filled
const imgIconUpload =
  "https://www.figma.com/api/mcp/asset/d3d6b516-8a49-4740-9ac6-af32a4edf345";
const imgIconErrorOutline =
  "https://www.figma.com/api/mcp/asset/ea34e8e8-a3d0-4c68-b6af-afd84dfc1938";
const imgIconEditPencil =
  "https://www.figma.com/api/mcp/asset/7b13527f-41a6-4f93-8f34-8ab6388f1eea";

// ── draft persistence ─────────────────────────────────────────────────────────
const DRAFT_KEY = "seedmoney_draft";

// ── geo types ─────────────────────────────────────────────────────────────────
type GeoOption = { code: string; name: string };

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
  value,
  onChange,
  maxLength,
}: {
  label: string;
  type?: string;
  helperText?: string;
  value?: string;
  onChange?: (v: string) => void;
  maxLength?: number;
}) {
  const controlled = value !== undefined && onChange !== undefined;
  return (
    <TextField
      variant="standard"
      label={label}
      type={type}
      helperText={helperText}
      fullWidth
      sx={fieldSx}
      slotProps={maxLength ? { htmlInput: { maxLength } } : undefined}
      {...(controlled ? { value, onChange: (e) => onChange(e.target.value) } : {})}
    />
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
    <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-[25px] flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="font-bold text-[20px] leading-[1.6] text-[rgba(0,0,0,0.87)]">
            {title}
          </p>
          {required && <p className="text-[#ff8c29] font-bold text-[20px]">*</p>}
        </div>
        {description && (
          <p className="text-[14px] leading-[1.33] text-black">{description}</p>
        )}
      </div>
      {children}
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
  "PLACEHOLDER FOR THE AI POLICY",
];

function Step1({ checked, onChange }: { checked: boolean[]; onChange: (i: number) => void }) {
  return (
    <SectionCard
      title="Grantee Agreement"
      required
      description="By checking all boxes below and continuing, you are agreeing to the SeedMoney Challenge Grantee Agreement"
    >
      <div className="flex flex-col gap-1">
        <p className="text-[16px] leading-[1.5] text-black tracking-[0.15px]">
          I confirm that:
        </p>
        {GRANTEE_ITEMS.map((item, i) => (
          <label
            key={i}
            className="flex items-start gap-0 cursor-pointer py-1"
          >
            <div className="flex items-center p-[9px] shrink-0">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => onChange(i)}
                className="size-[18px] accent-[#2d7a45] cursor-pointer"
              />
            </div>
            <p className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)] tracking-[0.15px] pt-[9px]">
              {item}
            </p>
          </label>
        ))}
      </div>
    </SectionCard>
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
  beneficiaryPops, setBeneficiaryPops,
  usStates, countries,
}: {
  gardenCity: string; setGardenCity: (v: string) => void;
  gardenState: string; setGardenState: (v: string) => void;
  gardenCountry: string; setGardenCountry: (v: string) => void;
  projectCategory: string; setProjectCategory: (v: string) => void;
  beneficiaryPops: string[]; setBeneficiaryPops: (v: string[]) => void;
  usStates: GeoOption[];
  countries: GeoOption[];
}) {
  function togglePop(pop: string) {
    setBeneficiaryPops(
      beneficiaryPops.includes(pop)
        ? beneficiaryPops.filter((p) => p !== pop)
        : [...beneficiaryPops, pop]
    );
  }
  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionCard title="Garden Location" required>
        <div className="flex flex-col gap-4 w-full">
          <StdField label="City" value={gardenCity} onChange={setGardenCity} />
          <TextField
            select
            variant="standard"
            label="State / Province"
            value={gardenState}
            onChange={(e) => setGardenState(e.target.value)}
            fullWidth
            sx={fieldSx}
          >
            <MenuItem value=""><em>{usStates.length === 0 ? "Loading…" : "None"}</em></MenuItem>
            {usStates.map(({ code, name }) => (
              <MenuItem key={code} value={code}>{name}</MenuItem>
            ))}
          </TextField>
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
        </div>
      </SectionCard>

      <SectionCard title="Primary Project Category" required>
        <div className="flex flex-col gap-0">
          <p className="text-[14px] text-[rgba(0,0,0,0.6)] mb-3">Select one:</p>
          {PROJECT_CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="radio"
                name="category"
                checked={projectCategory === cat}
                onChange={() => setProjectCategory(cat)}
                className="accent-[#2d7a45] size-4"
              />
              <span className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">{cat}</span>
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Beneficiary Populations Served" required>
        <div className="flex flex-col gap-0">
          <p className="text-[14px] text-[rgba(0,0,0,0.6)] mb-3">
            Select all that apply:
          </p>
          {BENEFICIARY_POPULATIONS.map((pop) => (
            <label key={pop} className="flex items-center gap-0 cursor-pointer py-1">
              <div className="flex items-center p-[9px] shrink-0">
                <input
                  type="checkbox"
                  checked={beneficiaryPops.includes(pop)}
                  onChange={() => togglePop(pop)}
                  className="size-[18px] accent-[#2d7a45] cursor-pointer"
                />
              </div>
              <span className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">{pop}</span>
            </label>
          ))}
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

async function getCroppedImg(file: File, croppedAreaPixels: Area): Promise<File> {
  const url = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new window.Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = url;
  });
  URL.revokeObjectURL(url);

  const canvas = document.createElement("canvas");
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
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
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const objectUrl = URL.createObjectURL(file);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  useEffect(() => {
    return () => URL.revokeObjectURL(objectUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleApply() {
    if (!croppedAreaPixels) return;
    const cropped = await getCroppedImg(file, croppedAreaPixels);
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
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom slider */}
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
        <div className="relative size-5 shrink-0">
          <Image src={imgIconUpload} alt="" fill className="object-contain" unoptimized />
        </div>
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
        <div className="relative size-10 shrink-0">
          <Image src={imgIconUpload} alt="" fill className="object-contain" unoptimized />
        </div>
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
  usStates, countries,
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
  usStates: GeoOption[];
  countries: GeoOption[];
}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionCard title="Organization Information" required>
        <div className="flex flex-col gap-4 w-full">
          <StdField label="Legal Name of Beneficiary Organization" value={orgName} onChange={setOrgName} />
          <StdField label="EIN or Public-Sector Identifier" value={orgEIN} onChange={setOrgEIN} />
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
            <MenuItem value=""><em>{usStates.length === 0 ? "Loading…" : "None"}</em></MenuItem>
            {usStates.map(({ code, name }) => (
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
function ReviewField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col w-full border-b border-[rgba(0,0,0,0.1)] pb-3">
      <p className="text-[12px] leading-[1.33] text-[rgba(0,0,0,0.6)]">{label}</p>
      <p className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)] mt-0.5">
        {value ?? <span className="text-[rgba(0,0,0,0.38)]">—</span>}
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
    <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-[25px] flex flex-col gap-4 w-full">
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgIconErrorOutline} alt="" width={22} height={22} />
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgIconEditPencil} alt="" width={18} height={18} />
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
        <div className="relative size-5 shrink-0">
          <Image src={imgIconUpload} alt="" fill className="object-contain" unoptimized />
        </div>
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
  projectCategory: string; beneficiaryPops: string[];
  gardenStory1: string; gardenStory2: string; gardenStory3: string; gardenStory4: string;
  mainPhoto: File | null; supportingPhotos: File[];
  orgName: string; orgEIN: string;
  street1: string; street2: string; mailCity: string; mailState: string;
  mailZip: string; mailCountry: string;
  firstName: string; lastName: string; contactEmail: string; contactRole: string;
  usStates: GeoOption[]; countries: GeoOption[];
  onGoToStep: (step: Step) => void;
};

function Step6(props: Step6Props) {
  const {
    campaignTitle, peopleCount, gardenSize, gardenType, fundraisingGoal,
    gardenCity, gardenState, gardenCountry, projectCategory, beneficiaryPops,
    gardenStory1, gardenStory2, gardenStory3, gardenStory4,
    mainPhoto, supportingPhotos,
    orgName, orgEIN, street1, street2, mailCity, mailState, mailZip, mailCountry,
    firstName, lastName, contactEmail, contactRole,
    usStates, countries, onGoToStep,
  } = props;

  function lookupName(list: GeoOption[], code: string) {
    return list.find((o) => o.code === code)?.name ?? code;
  }

  const campaignError = !campaignTitle || !peopleCount || !gardenSize || !gardenType || !fundraisingGoal;
  const gardenInfoError = !gardenCity || !gardenState || !projectCategory || beneficiaryPops.length === 0;
  const gardenStoryError = !gardenStory1 || !mainPhoto;
  const contactError = !orgName || !firstName || !contactEmail;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ── Campaign Information ── */}
      <ReviewSectionTitle title="Campaign Information" />
      {campaignError && <ReviewErrorBanner message="Please complete campaign information." onEdit={() => onGoToStep(1)} />}

      <ReviewSubSection title="Campaign Title">
        <ReviewField label="Campaign Title" value={campaignTitle || undefined} />
        <p className="text-[12px] text-[rgba(0,0,0,0.6)]">60 max characters</p>
      </ReviewSubSection>

      <ReviewSubSection title="Project Details & Impact">
        <ReviewField label="About how many people will benefit from this garden this year?" value={peopleCount || undefined} />
        <ReviewField label="Approximate garden size or scope" value={gardenSize || undefined} />
        <div className="flex flex-col gap-1">
          <p className="text-[14px] leading-[1.5] text-[rgba(0,0,0,0.87)]">Is this a new or existing garden?</p>
          {["New garden", "Existing garden"].map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input type="radio" readOnly checked={gardenType === opt} onChange={() => {}} className="accent-[#2d7a45] size-4" />
              <span className={`text-[16px] leading-[1.5] ${gardenType === opt ? "text-[rgba(0,0,0,0.87)]" : "text-[rgba(0,0,0,0.38)]"}`}>{opt}</span>
            </label>
          ))}
        </div>
      </ReviewSubSection>

      <ReviewSubSection title="Fundraising Goal">
        <ReviewField label="Fundraising Goal (USD)" value={fundraisingGoal ? `$${Number(fundraisingGoal).toLocaleString()}` : undefined} />
      </ReviewSubSection>

      {/* ── Garden Information ── */}
      <ReviewSectionTitle title="Garden Information" />
      {gardenInfoError && <ReviewErrorBanner message="Please complete garden information." onEdit={() => onGoToStep(2)} />}

      <ReviewSubSection title="Garden Location">
        <ReviewField label="City*" value={gardenCity || undefined} />
        <ReviewField label="State / Province*" value={gardenState ? lookupName(usStates, gardenState) : undefined} />
        <ReviewField label="Country" value={gardenCountry ? lookupName(countries, gardenCountry) : undefined} />
      </ReviewSubSection>

      <ReviewSubSection title="Primary Project Category">
        {projectCategory ? (
          <div className="flex items-center gap-2">
            <input type="radio" readOnly checked onChange={() => {}} className="accent-[#2d7a45] size-4" />
            <span className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">{projectCategory}</span>
          </div>
        ) : (
          <p className="text-[14px] text-[rgba(0,0,0,0.38)]">No category selected</p>
        )}
      </ReviewSubSection>

      <ReviewSubSection title="Beneficiary Populations Served">
        {beneficiaryPops.length > 0 ? (
          <div className="flex flex-col gap-1">
            {beneficiaryPops.map((pop) => (
              <div key={pop} className="flex items-center gap-2">
                <input type="checkbox" readOnly checked onChange={() => {}} className="size-[18px] accent-[#2d7a45]" />
                <span className="text-[16px] leading-[1.5] text-[rgba(0,0,0,0.87)]">{pop}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-[rgba(0,0,0,0.38)]">No populations selected</p>
        )}
      </ReviewSubSection>

      {/* ── Garden Story ── */}
      <ReviewSectionTitle title="Garden Story" />
      {gardenStoryError && <ReviewErrorBanner message="Please complete garden story and add a main photo." onEdit={() => onGoToStep(3)} />}

      <ReviewSubSection title="Garden Story">
        <ReviewField label="Where is your garden, and who does it serve?" value={gardenStory1 || undefined} />
        <ReviewField label="What challenge does your garden help address, and why does it matter locally?" value={gardenStory2 || undefined} />
        <ReviewField label="What happens in the garden during the growing season?" value={gardenStory3 || undefined} />
        <ReviewField label="What will this year's SeedMoney campaign make possible?" value={gardenStory4 || undefined} />
      </ReviewSubSection>

      <ReviewSubSection title="Main Photo">
        {mainPhoto ? (
          <PhotoPreviewCard file={mainPhoto} />
        ) : (
          <p className="text-[14px] text-[rgba(0,0,0,0.38)]">No photo uploaded</p>
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
        <ReviewField label="Legal Name of Beneficiary Organization*" value={orgName || undefined} />
        <ReviewField label="EIN or Public-Sector Identifier*" value={orgEIN || undefined} />
      </ReviewSubSection>

      <ReviewSubSection title="Beneficiary Organization Mailing Address">
        <ReviewField label="Street 1" value={street1 || undefined} />
        <ReviewField label="Street 2" value={street2 || undefined} />
        <ReviewField label="City*" value={mailCity || undefined} />
        <ReviewField label="State / Province*" value={mailState ? lookupName(usStates, mailState) : undefined} />
        <ReviewField label="ZIP / Postal Code*" value={mailZip || undefined} />
        <ReviewField label="Country" value={mailCountry ? lookupName(countries, mailCountry) : undefined} />
      </ReviewSubSection>

      <ReviewSubSection title="Primary Contact Information">
        <ReviewField label="First Name*" value={firstName || undefined} />
        <ReviewField label="Last Name*" value={lastName || undefined} />
        <ReviewField label="Email*" value={contactEmail || undefined} />
        <ReviewField label="Role or Title" value={contactRole || undefined} />
      </ReviewSubSection>
    </div>
  );
}

// ── dashboard footer ──────────────────────────────────────────────────────────
function DashboardFooter() {
  return (
    <div className="border-t border-[#b5b5b5] flex items-center justify-between pt-6 font-[family-name:var(--font-opensans)] text-[14px] text-[#666]">
      <span>© 2026 SeedMoney All Rights Reserved.</span>
      <div className="flex gap-6 items-center">
        <a href="https://donate.seedmoney.org/" className="hover:underline">SeedMoney</a>
        <a href="https://donate.seedmoney.org/contact" className="hover:underline">Contact</a>
        <a href="https://donate.seedmoney.org/faq" className="hover:underline">FAQ</a>
        <a href="https://donate.seedmoney.org/tos" className="hover:underline">Terms</a>
        <a href="https://donate.seedmoney.org/privacy" className="hover:underline">Privacy Policy</a>
      </div>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────
type ValidationState = "ok" | "error" | "unvisited";

function getDotImage(i: number, step: number, validations: ValidationState[]) {
  if (i === step) return imgDotCurrent;
  if (i > step) return imgDotNotYet;
  return validations[i] === "ok" ? imgDotCompleted : imgDotError;
}

export default function ApplicationPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
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
  const [beneficiaryPops, setBeneficiaryPops] = useState<string[]>([]);
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
  const [usStates, setUsStates] = useState<GeoOption[]>([]);
  const [countries, setCountries] = useState<GeoOption[]>([]);

  // Auto-save
  const [savedAt, setSavedAt] = useState("");
  const draftRef = useRef<Record<string, unknown>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep ref current every render so the interval always has fresh values
  draftRef.current = {
    step, campaignTitle, peopleCount, gardenSize, gardenType, fundraisingGoal,
    gardenCity, gardenState, gardenCountry, projectCategory, beneficiaryPops,
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
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      if (d.step !== undefined) setStep(d.step as Step);
      setCampaignTitle(d.campaignTitle ?? "");
      setPeopleCount(d.peopleCount ?? "");
      setGardenSize(d.gardenSize ?? "");
      setGardenType(d.gardenType ?? "");
      setFundraisingGoal(d.fundraisingGoal ?? "");
      setGardenCity(d.gardenCity ?? "");
      setGardenState(d.gardenState ?? "");
      setGardenCountry(d.gardenCountry ?? "US");
      setProjectCategory(d.projectCategory ?? "");
      setBeneficiaryPops(d.beneficiaryPops ?? []);
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
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save every 60 seconds
  useEffect(() => {
    function save() {
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draftRef.current, savedAt: time }));
      setSavedAt(time);
    }
    const id = setInterval(save, 60_000);
    return () => clearInterval(id);
  }, []);

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

    // Fetch US states from CountriesNow API
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: "United States" }),
    })
      .then((r) => r.json())
      .then((data: { data: { states: { name: string; state_code: string }[] } }) => {
        const states = (data.data?.states ?? [])
          .map((s) => ({ code: s.state_code, name: s.name }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setUsStates(states);
      })
      .catch(() => {});
  }, []);

  function validateCurrentStep(): boolean {
    switch (step) {
      case 0: return checked.every(Boolean);
      case 1: return campaignTitle.trim() !== "" && peopleCount.trim() !== "" && gardenSize.trim() !== "" && gardenType !== "" && fundraisingGoal.trim() !== "";
      case 2: return gardenCity.trim() !== "";
      case 3: return gardenStory1.trim() !== "";
      case 4: return orgName.trim() !== "";
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
      sessionStorage.removeItem(DRAFT_KEY);
      router.push("/dashboard?state=review");
    }
  }

  function handlePrev() {
    if (step === 0) router.push("/dashboard");
    else { setStep((step - 1) as Step); scrollRef.current?.scrollTo({ top: 0 }); }
  }

  function toggleCheck(i: number) {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  }

  const hasRequiredErrors =
    !campaignTitle || !peopleCount || !gardenSize || !gardenType || !fundraisingGoal ||
    !gardenCity || !gardenState || !projectCategory || beneficiaryPops.length === 0 ||
    !gardenStory1 || !mainPhoto ||
    !orgName || !firstName || !contactEmail;

  const canNext =
    step === 0 ? checked.every(Boolean) :
    step === 5 ? !hasRequiredErrors :
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
        onSelectPending={() => router.push("/dashboard")}
        onSelectDraft={() => {}}
        onNewCampaign={() => {}}
        onLogout={() => router.push("/")}
        disableNewCampaign
      />

      {/* Main content */}
      <div ref={scrollRef} className="flex flex-col flex-1 min-w-0 h-full overflow-y-auto px-10 pt-[60px] pb-5">
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-bold text-[32px] leading-[1.235] text-[#096b2e]">
            Application
          </p>

          <div className="flex gap-10 items-start">
            {/* Progress timeline */}
            <div className="flex flex-col gap-6 shrink-0 w-[240px] sticky top-0">
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
                        onClick={() => { setStep(i as Step); scrollRef.current?.scrollTo({ top: 0 }); }}
                        className="flex gap-4 items-center w-full text-left hover:opacity-70 transition-opacity"
                      >
                        <div className="relative size-3 shrink-0 my-[11.5px]">
                          <Image
                            src={getDotImage(i, step, validations)}
                            alt=""
                            fill
                            className="object-contain"
                            unoptimized
                          />
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

              <div className="flex items-center gap-2 px-2">
                <div className="relative size-5 shrink-0">
                  <Image src={imgIconUpload} alt="" fill className="object-contain" unoptimized />
                </div>
                <p className="text-[14px] leading-[1.33] text-[#666]">
                  {savedAt ? `Auto saved at ${savedAt}` : "Not yet saved"}
                </p>
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
                beneficiaryPops={beneficiaryPops} setBeneficiaryPops={setBeneficiaryPops}
                usStates={usStates} countries={countries}
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
                usStates={usStates} countries={countries}
              />}
              {step === 5 && <Step6
                campaignTitle={campaignTitle} peopleCount={peopleCount}
                gardenSize={gardenSize} gardenType={gardenType} fundraisingGoal={fundraisingGoal}
                gardenCity={gardenCity} gardenState={gardenState} gardenCountry={gardenCountry}
                projectCategory={projectCategory} beneficiaryPops={beneficiaryPops}
                gardenStory1={gardenStory1} gardenStory2={gardenStory2}
                gardenStory3={gardenStory3} gardenStory4={gardenStory4}
                mainPhoto={mainPhoto} supportingPhotos={supportingPhotos}
                orgName={orgName} orgEIN={orgEIN}
                street1={street1} street2={street2} mailCity={mailCity}
                mailState={mailState} mailZip={mailZip} mailCountry={mailCountry}
                firstName={firstName} lastName={lastName}
                contactEmail={contactEmail} contactRole={contactRole}
                usStates={usStates} countries={countries}
                onGoToStep={(s) => setStep(s)}
              />}

              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrev}
                  className="bg-white border border-[#2d7a45] text-[#2d7a45] font-bold text-[16px] leading-[26px] px-5 py-[10px] rounded-[8px] uppercase hover:bg-[#def2df] transition-colors"
                >
                  {step === 0 ? "Cancel" : "Previous Step"}
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canNext}
                  className={`font-bold text-[16px] leading-[26px] px-5 py-[10px] rounded-[8px] uppercase transition-colors ${
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
      </div>
    </div>
    </ThemeProvider>
  );
}
