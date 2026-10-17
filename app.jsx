import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Home, User, ClipboardList, Utensils, Dumbbell, Pill, Bookmark,
  History as HistoryIcon, Settings as SettingsIcon, Search, LogOut,
  ChevronRight, Check, X, AlertTriangle, Loader2, Droplet, Moon,
  Activity, Plus, ArrowLeft, Menu, Sparkles, ShieldCheck, Heart,
  TrendingUp, CircleCheck, RotateCcw, Eye, EyeOff, Mail, Lock,
  ChevronDown, Info, CalendarCheck, Flame, GlassWater
} from "lucide-react";

/* =========================================================================
   FONTS
   ========================================================================= */
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
    .font-display { font-family: 'Manrope', system-ui, sans-serif; }
    .font-body { font-family: 'Inter', system-ui, sans-serif; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .animate-slideUp { animation: slideUp 0.3s ease-out; }
  `}</style>
);

/* =========================================================================
   STATIC DATA
   ========================================================================= */
const GOAL_OPTIONS = [
  { id: "weight_management", label: "Weight management" },
  { id: "muscle_gain", label: "Build strength & muscle" },
  { id: "better_sleep", label: "Improve sleep" },
  { id: "more_energy", label: "Increase daily energy" },
  { id: "stress_reduction", label: "Reduce stress" },
  { id: "general_wellness", label: "General wellness" },
];

const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary (little to no exercise)" },
  { id: "light", label: "Lightly active (1-2 days/week)" },
  { id: "moderate", label: "Moderately active (3-4 days/week)" },
  { id: "active", label: "Very active (5+ days/week)" },
];

const SLEEP_HABITS = [
  { id: "poor", label: "Poor - under 5 hrs, often disrupted" },
  { id: "average", label: "Average - 5-7 hrs" },
  { id: "good", label: "Good - 7-9 hrs, consistent" },
];

const EATING_HABITS = [
  { id: "balanced", label: "Balanced / varied" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "high_protein", label: "High protein" },
  { id: "low_carb", label: "Low carb" },
  { id: "irregular", label: "Irregular / on the go" },
];

const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
const WATER_OPTIONS = ["Less than 4 cups", "4-6 cups", "6-8 cups", "8-10 cups", "10+ cups"];

const RECOMMENDATIONS = [
  // DIET
  { id: "d1", category: "diet", title: "Building a Balanced Plate", short: "A simple visual method for balancing vegetables, protein, and whole grains at each meal.",
    long: "The 'balanced plate' approach suggests filling about half your plate with non-starchy vegetables or fruit, a quarter with lean protein, and a quarter with whole grains or starchy vegetables. This is an educational framework, not a strict rule — it can help you build meals that support steady energy without needing to count every ingredient.",
    tags: ["general_wellness", "weight_management", "balanced", "irregular"] },
  { id: "d2", category: "diet", title: "Hydration Habits for Active Days", short: "Practical ways to stay ahead of thirst when you're moving more or sweating.",
    long: "Water needs vary by body size, climate, and activity, but a common educational guideline is to drink water regularly throughout the day rather than waiting until you feel thirsty. Keeping a reusable bottle visible, pairing sips with routine tasks, and adding water-rich foods like cucumber or fruit can help you build the habit gradually.",
    tags: ["active", "moderate", "more_energy"] },
  { id: "d3", category: "diet", title: "Protein Basics for Muscle Support", short: "How protein fits into a routine focused on building or maintaining muscle.",
    long: "Protein provides the building blocks your body uses to repair and build muscle tissue, which is especially relevant if your goal involves strength training. Spreading protein sources — like legumes, eggs, dairy, tofu, fish, or poultry — across meals rather than eating it all at once is a commonly cited educational strategy.",
    tags: ["muscle_gain", "high_protein", "active", "moderate"] },
  { id: "d4", category: "diet", title: "Mindful Eating for Weight Management", short: "Slowing down and tuning into hunger cues as one tool among many.",
    long: "Mindful eating involves paying attention to hunger and fullness signals, minimizing distractions like screens during meals, and eating slowly enough to notice satisfaction. Research associates this practice with more comfortable portion sizes for some people, though it works best alongside — not instead of — a balanced overall eating pattern.",
    tags: ["weight_management", "irregular", "stress_reduction"] },
  { id: "d5", category: "diet", title: "Fiber-Rich Foods for Digestive Comfort", short: "Why fiber matters and easy ways to add more of it to meals you already eat.",
    long: "Fiber, found in vegetables, fruit, legumes, and whole grains, supports digestive regularity and can contribute to feeling fuller after meals. Gradually increasing fiber intake alongside adequate water intake is generally recommended over making sudden large changes.",
    tags: ["general_wellness", "balanced", "vegetarian", "vegan"] },
  { id: "d6", category: "diet", title: "Meal Timing and Steady Energy", short: "How spacing meals can help smooth out energy dips through the day.",
    long: "Some people find that eating at fairly consistent times, and including a mix of protein, fiber, and healthy fat at each meal, helps reduce the sharp energy dips that can follow large gaps between meals or very high-sugar snacks. This is a general pattern, not a fixed schedule everyone needs to follow.",
    tags: ["more_energy", "irregular", "sedentary"] },
  { id: "d7", category: "diet", title: "Plant-Based Protein Sources", short: "A rundown of protein-rich options for vegetarian and vegan eating patterns.",
    long: "Legumes, lentils, tofu, tempeh, edamame, quinoa, nuts, and seeds all contribute meaningful protein to a vegetarian or vegan diet. Combining a variety of these sources across the day is a commonly cited educational approach to covering the full range of amino acids.",
    tags: ["vegetarian", "vegan", "muscle_gain"] },
  { id: "d8", category: "diet", title: "Reducing Added Sugar Gradually", short: "Small, sustainable swaps rather than an all-or-nothing approach.",
    long: "Gradually swapping sugar-sweetened beverages for water or unsweetened options, and choosing whole fruit over sugary snacks, are commonly suggested starting points. Gradual changes are generally easier to sustain than eliminating sugar all at once.",
    tags: ["weight_management", "general_wellness"] },

  // EXERCISE
  { id: "e1", category: "exercise", title: "Getting Started with Walking", short: "A low-barrier way to build activity into a sedentary routine.",
    long: "Walking is a low-impact activity that most people can start without special equipment. Building up gradually — for example, adding five minutes every few days — is a common educational approach to increasing activity without overdoing it early on.",
    tags: ["sedentary", "light", "general_wellness", "more_energy"] },
  { id: "e2", category: "exercise", title: "Strength Training Basics for Beginners", short: "An introduction to resistance training for building muscle and bone strength.",
    long: "Strength training involves working muscles against resistance, whether from body weight, bands, or weights. Starting with two sessions a week covering major muscle groups, and focusing on form before adding load, are widely cited beginner-friendly principles.",
    tags: ["muscle_gain", "sedentary", "light", "moderate"] },
  { id: "e3", category: "exercise", title: "Improving Flexibility with Stretching", short: "Simple stretching routines that support mobility and recovery.",
    long: "Gentle stretching, held for 20-30 seconds per muscle group, is commonly recommended after activity when muscles are warm. Regular stretching may support range of motion and comfort during daily movement over time.",
    tags: ["general_wellness", "better_sleep", "stress_reduction"] },
  { id: "e4", category: "exercise", title: "Staying Active on a Busy Schedule", short: "Fitting movement into a day that doesn't have room for a full workout.",
    long: "Short bursts of activity — a brisk 10-minute walk, a few minutes of stretching, or taking the stairs — can add up across a day. This 'activity snacking' approach is often suggested for people who find long workout blocks hard to schedule.",
    tags: ["irregular", "sedentary", "more_energy"] },
  { id: "e5", category: "exercise", title: "Low-Impact Cardio Options", short: "Cardio choices that are gentler on joints while still raising your heart rate.",
    long: "Swimming, cycling, and using an elliptical machine are often recommended as lower-impact ways to build cardiovascular fitness compared to running. These can be especially relevant if you're returning to activity after time off or want to vary your routine.",
    tags: ["moderate", "active", "weight_management"] },
  { id: "e6", category: "exercise", title: "The Role of Rest and Recovery", short: "Why rest days are part of an effective routine, not a step backward.",
    long: "Muscles adapt and rebuild during rest, which is why most routines include at least one or two rest or active-recovery days per week. Consistent sleep and light movement — like walking — on rest days can support recovery.",
    tags: ["active", "moderate", "better_sleep"] },
  { id: "e7", category: "exercise", title: "Understanding Progressive Overload", short: "The general principle behind getting stronger over time.",
    long: "Progressive overload means gradually increasing the demand on your muscles — through more weight, more reps, or more sets — over weeks and months. This is a foundational, educational concept in strength training rather than a specific program to follow immediately.",
    tags: ["muscle_gain", "moderate", "active"] },
  { id: "e8", category: "exercise", title: "Movement Breaks for Desk Days", short: "Quick ways to counter long periods of sitting.",
    long: "Standing up, stretching, or walking for a couple of minutes every hour is a commonly suggested way to break up long sitting periods. Some people also find a standing desk or short walking meetings help build in movement naturally.",
    tags: ["sedentary", "irregular", "stress_reduction"] },

  // MEDICATION (general info only, never dosing/diagnosis)
  { id: "m1", category: "medication", title: "Understanding Medication Labels", short: "What the key sections of a prescription label typically mean.",
    long: "Prescription labels generally include the medication name, strength, instructions for use, quantity, and prescriber information. Reading the full label and any attached information sheet, and asking your pharmacist about anything unclear, is a good general habit.",
    tags: ["general_wellness"] },
  { id: "m2", category: "medication", title: "Tips for Remembering Doses", short: "General strategies people use to stay consistent with a medication routine.",
    long: "Pairing medication times with an existing daily habit (like brushing your teeth), using a pill organizer, or setting phone reminders are commonly suggested strategies for staying consistent. If you regularly miss doses, it's worth mentioning to your prescriber or pharmacist.",
    tags: ["general_wellness"] },
  { id: "m3", category: "medication", title: "Talking to Your Pharmacist", short: "Why pharmacists are a useful, accessible resource for medication questions.",
    long: "Pharmacists are trained to answer questions about how medications work, potential interactions, and proper storage, and are often easier to reach than a prescriber for quick questions. They can also review your full medication list to check for potential interactions.",
    tags: ["general_wellness"] },
  { id: "m4", category: "medication", title: "Food and Medication Interactions", short: "General awareness of how some foods can interact with medications.",
    long: "Certain foods and beverages — such as grapefruit or foods high in vitamin K — are known to interact with some medication types. This is general awareness information only; ask your pharmacist or prescriber whether any of your specific medications have food interactions to watch for.",
    tags: ["general_wellness"] },
  { id: "m5", category: "medication", title: "Safely Storing Medication at Home", short: "General best practices for storage and disposal.",
    long: "Most medications should be stored in a cool, dry place away from direct sunlight, and kept out of reach of children and pets. Unused or expired medication can often be dropped off at pharmacy take-back programs rather than thrown in household trash.",
    tags: ["general_wellness"] },
  { id: "m6", category: "medication", title: "Questions to Ask at Your Next Appointment", short: "A general checklist to make the most of time with your prescriber.",
    long: "Common questions people bring to appointments include: what is this medication for, how long will I take it, what side effects should I watch for, and does it interact with anything else I take. Writing questions down beforehand can help you remember them during a short visit.",
    tags: ["general_wellness"] },
  { id: "m7", category: "medication", title: "Generic vs. Brand-Name Medication", short: "General background on how generic medications compare to brand-name versions.",
    long: "Generic medications contain the same active ingredient, strength, and dosage form as their brand-name counterparts and are held to the same regulatory standards in most countries, though inactive ingredients can differ slightly. Your pharmacist can explain differences relevant to a specific medication.",
    tags: ["general_wellness"] },
  { id: "m8", category: "medication", title: "Recognizing When to Seek Medical Advice", short: "General guidance on when a symptom warrants professional attention.",
    long: "New, worsening, or unusual symptoms after starting a medication are generally worth discussing with a healthcare professional rather than waiting them out. Severe reactions — such as difficulty breathing, swelling of the face or throat, or chest pain — warrant emergency care right away.",
    tags: ["general_wellness"] },
];

const CATEGORY_META = {
  diet: { label: "Diet & Nutrition", icon: Utensils, color: "emerald" },
  exercise: { label: "Exercise & Activity", icon: Dumbbell, color: "amber" },
  medication: { label: "Medication Information", icon: Pill, color: "sky" },
};

// color -> tailwind class maps (avoids arbitrary values)
const COLOR = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", solid: "bg-emerald-600", solidHover: "hover:bg-emerald-700", ring: "ring-emerald-200", chip: "bg-emerald-100 text-emerald-700" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   solid: "bg-amber-500",   solidHover: "hover:bg-amber-600",   ring: "ring-amber-200",   chip: "bg-amber-100 text-amber-700" },
  sky:     { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200",     solid: "bg-sky-600",     solidHover: "hover:bg-sky-700",     ring: "ring-sky-200",     chip: "bg-sky-100 text-sky-700" },
  slate:   { bg: "bg-slate-50",   text: "text-slate-700",   border: "border-slate-200",   solid: "bg-slate-700",   solidHover: "hover:bg-slate-800",   ring: "ring-slate-200",   chip: "bg-slate-100 text-slate-700" },
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "profile-form", label: "My Health Profile", icon: ClipboardList },
  { id: "checkin", label: "Daily Check-In", icon: CalendarCheck },
  { id: "diet", label: "Diet", icon: Utensils },
  { id: "exercise", label: "Exercise", icon: Dumbbell },
  { id: "medication", label: "Medication Information", icon: Pill },
  { id: "saved", label: "Saved Resources", icon: Bookmark },
  { id: "history", label: "History", icon: HistoryIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

const PROFILE_FIELDS_REQUIRED = ["ageRange", "goals", "activityLevel", "sleepHabits", "eatingHabits", "waterIntake"];
const GUEST_EMAIL = "guest@demo.local";

function sampleProfile() {
  return {
    ageRange: "25-34", goals: ["more_energy", "better_sleep", "general_wellness"], activityLevel: "light",
    sleepHabits: "average", eatingHabits: "irregular", waterIntake: "4-6 cups",
    allergies: "", conditions: "", medications: "Vitamin D, Lisinopril",
  };
}

function sampleCheckins() {
  // Seeds the last 6 days, deliberately leaving "today" empty so guests can try the check-in flow themselves.
  const out = [];
  for (let i = 6; i >= 1; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({
      date: d.toISOString().slice(0, 10), ts: d.toISOString(),
      mood: [3, 4, 3, 5, 4, 3][6 - i], sleepHours: [6, 7, 6.5, 7.5, 7, 6][6 - i],
      waterGlasses: [4, 5, 6, 5, 7, 4][6 - i], activeToday: [false, true, false, true, true, false][6 - i],
    });
  }
  return out;
}

function sampleSaved() {
  const pick = (id) => RECOMMENDATIONS.find((r) => r.id === id);
  return [pick("d1"), pick("e4"), pick("m3")].filter(Boolean).map((r) => ({ ...r, savedAt: new Date().toISOString() }));
}

function emptyProfile() {
  return {
    ageRange: "", goals: [], activityLevel: "", sleepHabits: "", eatingHabits: "",
    waterIntake: "", allergies: "", conditions: "", medications: "",
  };
}

function profileCompletion(profile) {
  if (!profile) return 0;
  const done = PROFILE_FIELDS_REQUIRED.filter((f) => {
    const v = profile[f];
    return Array.isArray(v) ? v.length > 0 : !!v;
  }).length;
  return Math.round((done / PROFILE_FIELDS_REQUIRED.length) * 100);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function initials(name) {
  if (!name) return "U";
  return name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

/* =========================================================================
   STORAGE HELPERS (window.storage; personal, per-key namespaced by email)
   ========================================================================= */
async function storageGet(key, fallback) {
  try {
    const res = await window.storage.get(key, false);
    if (!res || res.value === undefined || res.value === null) return fallback;
    return JSON.parse(res.value);
  } catch (e) {
    return fallback;
  }
}
async function storageSet(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value), false);
    return true;
  } catch (e) {
    return false;
  }
}

/* =========================================================================
   SMALL UI PRIMITIVES
   ========================================================================= */
function Toast({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-72 max-w-[90vw]">
      {toasts.map((t) => (
        <div key={t.id}
          className={`animate-slideUp flex items-start gap-2 rounded-xl border px-4 py-3 shadow-sm text-sm font-body ${
            t.type === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-white border-emerald-200 text-slate-700"
          }`}>
          {t.type === "error" ? <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" /> : <CircleCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700 font-body">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 font-body">{hint}</p>}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-2 rounded-full text-sm font-body border transition-colors ${
        active ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
      }`}>
      {children}
    </button>
  );
}

function SafetyBanner({ compact }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 ${compact ? "p-3" : "p-4"}`}>
      <ShieldCheck className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
      <p className="text-sm text-sky-900 font-body leading-relaxed">
        This platform provides general educational health and wellness information only. It is not a substitute for
        professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional with
        questions about a medical condition or medication.
      </p>
    </div>
  );
}

function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-14 px-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="font-display font-semibold text-slate-700">{title}</h3>
      <p className="text-sm text-slate-500 font-body max-w-sm">{body}</p>
      {action}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 p-5 animate-pulse">
      <div className="h-3 w-20 bg-slate-100 rounded-full mb-4" />
      <div className="h-4 w-3/4 bg-slate-100 rounded-full mb-3" />
      <div className="h-3 w-full bg-slate-100 rounded-full mb-2" />
      <div className="h-3 w-5/6 bg-slate-100 rounded-full mb-5" />
      <div className="flex gap-2">
        <div className="h-8 w-24 bg-slate-100 rounded-full" />
        <div className="h-8 w-28 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
}

function Modal({ onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-4 animate-fadeIn">
      <div className={`bg-white rounded-t-3xl sm:rounded-3xl w-full ${wide ? "sm:max-w-xl" : "sm:max-w-md"} max-h-[90vh] overflow-y-auto p-6 relative animate-slideUp`}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100">
          <X className="w-4.5 h-4.5 text-slate-400" />
        </button>
        {children}
      </div>
    </div>
  );
}

/* =========================================================================
   RECOMMENDATION CARD
   ========================================================================= */
function RecCard({ rec, isSaved, onSave, onLearnMore }) {
  const meta = CATEGORY_META[rec.category];
  const c = COLOR[meta.color];
  return (
    <div className="rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 bg-white hover:border-slate-300 transition-colors">
      <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full font-body ${c.chip}`}>{meta.label}</span>
      <h3 className="font-display font-semibold text-slate-800 leading-snug">{rec.title}</h3>
      <p className="text-sm text-slate-500 font-body leading-relaxed">{rec.short}</p>
      <div className="flex gap-2 mt-1">
        <button onClick={() => onLearnMore(rec)}
          className="text-sm font-medium font-body px-3.5 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1">
          Learn more <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onSave(rec)} disabled={isSaved}
          className={`text-sm font-medium font-body px-3.5 py-2 rounded-full flex items-center gap-1.5 ${
            isSaved ? "bg-slate-100 text-slate-400" : `${c.solid} ${c.solidHover} text-white`
          }`}>
          {isSaved ? <><Check className="w-3.5 h-3.5" /> Saved</> : <><Bookmark className="w-3.5 h-3.5" /> Save to Profile</>}
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   AUTH PAGE
   ========================================================================= */
function AuthPage({ onAuth, notify, onGuest }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (mode === "signup" && name.trim().length < 2) e.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
    if (password.length < 6) e.password = "Password must be at least 6 characters.";
    if (mode === "signup" && password !== confirm) e.confirm = "Passwords don't match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const users = await storageGet("users_db", []);
    await new Promise((r) => setTimeout(r, 500));
    if (mode === "signup") {
      if (users.find((u) => u.email === email)) {
        setErrors({ email: "An account with this email already exists." });
        setLoading(false);
        return;
      }
      const newUser = { name: name.trim(), email, password, createdAt: new Date().toISOString() };
      await storageSet("users_db", [...users, newUser]);
      await storageSet("session_email", email);
      setLoading(false);
      notify(`Welcome, ${newUser.name.split(" ")[0]}! Your account is ready.`);
      onAuth(newUser);
    } else {
      const found = users.find((u) => u.email === email && u.password === password);
      setLoading(false);
      if (!found) {
        setErrors({ form: "Email or password is incorrect." });
        return;
      }
      await storageSet("session_email", email);
      notify(`Welcome back, ${found.name.split(" ")[0]}!`);
      onAuth(found);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 font-body">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-slate-800">Vitality</span>
        </div>

        <div className="flex rounded-full bg-slate-100 p-1 mb-6">
          <button onClick={() => { setMode("login"); setErrors({}); }}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${mode === "login" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"}`}>
            Log in
          </button>
          <button onClick={() => { setMode("signup"); setErrors({}); }}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${mode === "signup" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"}`}>
            Sign up
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <Field label="Full name">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </Field>
          )}
          <Field label="Email">
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" />
            </div>
            {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
          </Field>
          <Field label="Password">
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
          </Field>
          {mode === "signup" && (
            <Field label="Confirm password">
              <input type={showPw ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" />
              {errors.confirm && <p className="text-xs text-red-600">{errors.confirm}</p>}
            </Field>
          )}
          {errors.form && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {errors.form}
            </div>
          )}
          <button type="submit" disabled={loading}
            className="mt-1 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>
        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-slate-100 flex-1" />
          <span className="text-xs text-slate-300 font-body">or</span>
          <div className="h-px bg-slate-100 flex-1" />
        </div>
        <button onClick={onGuest}
          className="w-full rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 font-medium py-2.5 text-sm">
          Continue as guest
        </button>

        <p className="text-xs text-slate-400 text-center mt-6 leading-relaxed">
          This is a demo account system for a wellness prototype. Do not enter real passwords you use elsewhere.
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   LANDING PAGE
   ========================================================================= */
function LandingPage({ onGetStarted, onGuest }) {
  return (
    <div className="min-h-screen bg-white font-body">
      <header className="flex items-center justify-between px-6 sm:px-10 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Heart className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-display font-bold text-slate-800">Vitality</span>
        </div>
        <button onClick={onGetStarted} className="text-sm font-medium font-body px-4 py-2 rounded-full border border-slate-200 hover:border-slate-400">
          Log in
        </button>
      </header>

      <section className="max-w-4xl mx-auto px-6 sm:px-10 pt-16 pb-20 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Personalized, educational, always yours
        </span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-800 leading-tight mb-5">
          A calmer way to understand your everyday health
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Tell Vitality a bit about your habits and goals. Get educational suggestions on nutrition, movement, and
          medication basics — organized in one place you control.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={onGetStarted}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-7 py-3.5 rounded-full inline-flex items-center gap-2">
            Get started <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={onGuest}
            className="text-slate-500 hover:text-slate-800 font-medium px-7 py-3.5 rounded-full inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300">
            Continue as guest
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-4">No sign-up needed — guest data stays on this device only.</p>
      </section>

      <section className="max-w-5xl mx-auto px-6 sm:px-10 grid sm:grid-cols-3 gap-4 pb-20">
        {[
          { icon: Utensils, color: "emerald", title: "Diet & nutrition", body: "Educational guidance shaped by your eating habits and goals." },
          { icon: Dumbbell, color: "amber", title: "Exercise & activity", body: "Movement ideas that match your current activity level." },
          { icon: Pill, color: "sky", title: "Medication information", body: "General, safety-first information — never a diagnosis or prescription." },
        ].map((f) => {
          const c = COLOR[f.color];
          return (
            <div key={f.title} className={`rounded-2xl border ${c.border} ${c.bg} p-6`}>
              <div className={`w-10 h-10 rounded-xl ${c.solid} flex items-center justify-center mb-4`}>
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display font-semibold text-slate-800 mb-1.5">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.body}</p>
            </div>
          );
        })}
      </section>

      <section className="max-w-3xl mx-auto px-6 sm:px-10 pb-20">
        <SafetyBanner />
      </section>

      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Vitality Wellness — for educational demonstration purposes.
      </footer>
    </div>
  );
}

/* =========================================================================
   SIDEBAR / SHELL
   ========================================================================= */
function Sidebar({ page, setPage, user, onLogout, mobileOpen, setMobileOpen }) {
  const go = (id) => { setPage(id); setMobileOpen(false); };
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-slate-900/30 z-30 md:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed md:sticky top-0 h-screen z-40 w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 transition-transform duration-200
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Heart className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-display font-bold text-slate-800">Vitality</span>
        </div>
        <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => go(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium font-body transition-colors ${
                  active ? "bg-emerald-50 text-emerald-800" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}>
                <item.icon className={`w-4.5 h-4.5 ${active ? "text-emerald-600" : "text-slate-400"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <button onClick={() => go("user-profile")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-slate-700 text-white text-xs font-semibold flex items-center justify-center shrink-0">
              {initials(user?.name)}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-sm font-medium text-slate-700 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3.5 py-2.5 mt-1 rounded-xl text-sm text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ title, onMenu, onSearch, searchQuery }) {
  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-100 px-4 sm:px-8 py-4 flex items-center gap-3">
      <button onClick={onMenu} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-50">
        <Menu className="w-5 h-5 text-slate-600" />
      </button>
      <h1 className="font-display font-bold text-lg text-slate-800 flex-1 truncate">{title}</h1>
      {onSearch && (
        <div className="relative hidden sm:block w-64">
          <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={searchQuery} onChange={(e) => onSearch(e.target.value)} placeholder="Search recommendations..."
            className="w-full rounded-full border border-slate-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" />
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   DASHBOARD
   ========================================================================= */
function MiniBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div className="w-full rounded-t-md bg-emerald-100 relative overflow-hidden" style={{ height: "100%" }}>
            <div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-md transition-all" style={{ height: `${(d.value / max) * 100}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 font-body">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function Dashboard({ user, profile, checkins, saved, history, setPage, notify, openRecModal }) {
  const completion = profileCompletion(profile);
  const doneToday = checkins.some((c) => c.date === todayKey());
  const last7 = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const entry = checkins.find((c) => c.date === key);
      days.push({ label: d.toLocaleDateString(undefined, { weekday: "narrow" }), value: entry ? entry.waterGlasses : 0 });
    }
    return days;
  }, [checkins]);

  const activity = useMemo(() => {
    const items = [
      ...checkins.map((c) => ({ ts: c.ts, text: `Daily check-in logged — mood ${c.mood}/5`, icon: CalendarCheck })),
      ...saved.map((s) => ({ ts: s.savedAt, text: `Saved "${s.title}"`, icon: Bookmark })),
      ...history.filter((h) => h.type === "concern").map((h) => ({ ts: h.ts, text: `Reported a medication concern`, icon: AlertTriangle })),
      ...history.filter((h) => h.type === "profile").map((h) => ({ ts: h.ts, text: `Updated health profile`, icon: ClipboardList })),
    ];
    return items.sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 5);
  }, [checkins, saved, history]);

  return (
    <div className="p-5 sm:p-8 max-w-6xl mx-auto flex flex-col gap-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-slate-800">Hi {user.name.split(" ")[0]}, welcome back 👋</h2>
        <p className="text-slate-500 font-body text-sm mt-1">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 p-5 sm:col-span-2 flex items-center justify-between gap-4 bg-gradient-to-br from-emerald-50 to-white">
          <div>
            <p className="text-sm font-semibold text-emerald-800 font-body mb-1">Daily check-in</p>
            <p className="text-slate-500 text-sm font-body">
              {doneToday ? "You've already checked in today. Nice consistency." : "Log today's mood, sleep, and water intake — it only takes a minute."}
            </p>
          </div>
          {!doneToday ? (
            <button onClick={() => setPage("checkin")} className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-full">
              Check in
            </button>
          ) : (
            <div className="shrink-0 flex items-center gap-1.5 text-emerald-700 text-sm font-semibold bg-emerald-100 px-3.5 py-2 rounded-full">
              <CircleCheck className="w-4 h-4" /> Done
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
          <p className="text-sm font-semibold text-slate-700 font-body mb-2">Profile completion</p>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full grid place-items-center relative"
              style={{ background: `conic-gradient(#059669 ${completion * 3.6}deg, #f1f5f9 0deg)` }}>
              <div className="w-10 h-10 rounded-full bg-white grid place-items-center text-xs font-bold text-slate-700">{completion}%</div>
            </div>
            <button onClick={() => setPage("profile-form")} className="text-sm font-medium text-emerald-700 font-body hover:underline">
              {completion < 100 ? "Complete profile" : "View profile"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const c = COLOR[meta.color];
          return (
            <button key={key} onClick={() => setPage(key)}
              className={`rounded-2xl border ${c.border} ${c.bg} p-5 text-left hover:shadow-sm transition-shadow`}>
              <div className={`w-9 h-9 rounded-xl ${c.solid} flex items-center justify-center mb-3`}>
                <meta.icon className="w-4.5 h-4.5 text-white" />
              </div>
              <p className="font-display font-semibold text-slate-800 text-sm">{meta.label}</p>
              <p className="text-xs text-slate-500 font-body mt-1 flex items-center gap-1">
                View recommendations <ChevronRight className="w-3 h-3" />
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-700 font-body mb-4 flex items-center gap-2"><Droplet className="w-4 h-4 text-sky-500" /> Water intake — last 7 days</p>
          {checkins.length ? <MiniBarChart data={last7} /> : (
            <p className="text-sm text-slate-400 font-body py-6 text-center">No check-ins yet. Your trend will appear here.</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-700 font-body mb-4">Recent activity</p>
          {activity.length ? (
            <ul className="flex flex-col gap-3">
              {activity.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 font-body">
                  <a.icon className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                  <div>
                    <p>{a.text}</p>
                    <p className="text-xs text-slate-400">{fmtDate(a.ts)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 font-body py-6 text-center">Nothing yet — your activity will show up here.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-700 font-body">Saved resources</p>
          <button onClick={() => setPage("saved")} className="text-xs font-medium text-emerald-700 hover:underline">View all</button>
        </div>
        {saved.length ? (
          <div className="grid sm:grid-cols-3 gap-3">
            {saved.slice(0, 3).map((s) => {
              const c = COLOR[CATEGORY_META[s.category].color];
              return (
                <button key={s.id} onClick={() => openRecModal(s)} className="text-left rounded-xl border border-slate-200 p-3.5 hover:border-slate-300">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.chip}`}>{CATEGORY_META[s.category].label}</span>
                  <p className="text-sm font-medium text-slate-700 mt-2 line-clamp-2">{s.title}</p>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-400 font-body">Nothing saved yet — recommendations you save will appear here.</p>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   DAILY CHECK-IN
   ========================================================================= */
function CheckInPage({ checkins, onSubmit, notify }) {
  const already = checkins.find((c) => c.date === todayKey());
  const [mood, setMood] = useState(already?.mood || 3);
  const [sleepHours, setSleepHours] = useState(already?.sleepHours ?? 7);
  const [waterGlasses, setWaterGlasses] = useState(already?.waterGlasses ?? 4);
  const [activeToday, setActiveToday] = useState(already?.activeToday ?? false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 450));
    onSubmit({ date: todayKey(), ts: new Date().toISOString(), mood, sleepHours, waterGlasses, activeToday });
    setSaving(false);
    setDone(true);
    notify("Check-in saved. Thanks for keeping up with it!");
  };

  return (
    <div className="p-5 sm:p-8 max-w-2xl mx-auto">
      <h2 className="font-display font-bold text-2xl text-slate-800 mb-1">Daily check-in</h2>
      <p className="text-slate-500 font-body text-sm mb-6">A quick daily snapshot helps tailor your recommendations over time.</p>

      {done ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center flex flex-col items-center gap-3">
          <CircleCheck className="w-10 h-10 text-emerald-600" />
          <p className="font-display font-semibold text-slate-800">Check-in complete for today</p>
          <p className="text-sm text-slate-500 font-body">Come back tomorrow to keep your trend going.</p>
          <button onClick={() => setDone(false)} className="text-sm font-medium text-emerald-700 hover:underline mt-1">Edit today's entry</button>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 p-6 flex flex-col gap-6">
          <Field label="How's your mood today?">
            <div className="flex gap-2">
              {["😞", "😕", "😐", "🙂", "😄"].map((emoji, i) => (
                <button key={i} onClick={() => setMood(i + 1)}
                  className={`flex-1 py-2.5 rounded-xl text-xl border ${mood === i + 1 ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}`}>
                  {emoji}
                </button>
              ))}
            </div>
          </Field>
          <Field label={`Sleep last night: ${sleepHours} hrs`}>
            <input type="range" min="0" max="12" step="0.5" value={sleepHours} onChange={(e) => setSleepHours(Number(e.target.value))} className="w-full accent-emerald-600" />
          </Field>
          <Field label={`Water intake today: ${waterGlasses} glasses`}>
            <input type="range" min="0" max="12" step="1" value={waterGlasses} onChange={(e) => setWaterGlasses(Number(e.target.value))} className="w-full accent-sky-600" />
          </Field>
          <Field label="Were you physically active today?">
            <div className="flex gap-2">
              <Chip active={activeToday === true} onClick={() => setActiveToday(true)}>Yes</Chip>
              <Chip active={activeToday === false} onClick={() => setActiveToday(false)}>Not yet</Chip>
            </div>
          </Field>
          <button onClick={submit} disabled={saving}
            className="mt-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save check-in
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   HEALTH PROFILE FORM
   ========================================================================= */
function ProfileForm({ profile, onSave, notify }) {
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => setForm(profile), [profile]);

  const toggleGoal = (id) => {
    setForm((f) => ({ ...f, goals: f.goals.includes(id) ? f.goals.filter((g) => g !== id) : [...f.goals, id] }));
  };

  const validate = () => {
    const e = {};
    if (!form.ageRange) e.ageRange = "Please select an age range.";
    if (!form.goals.length) e.goals = "Select at least one goal.";
    if (!form.activityLevel) e.activityLevel = "Please select your activity level.";
    if (!form.sleepHabits) e.sleepHabits = "Please select your typical sleep pattern.";
    if (!form.eatingHabits) e.eatingHabits = "Please select your eating pattern.";
    if (!form.waterIntake) e.waterIntake = "Please select your typical water intake.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveError(false);
    await new Promise((r) => setTimeout(r, 500));
    const ok = await onSave(form);
    setSaving(false);
    if (ok) notify("Health profile saved securely.");
    else setSaveError(true);
  };

  return (
    <div className="p-5 sm:p-8 max-w-2xl mx-auto pb-16">
      <h2 className="font-display font-bold text-2xl text-slate-800 mb-1">My health profile</h2>
      <p className="text-slate-500 font-body text-sm mb-6">
        This information shapes your educational recommendations. Fields marked optional are never required.
      </p>

      <div className="rounded-2xl border border-slate-200 p-6 flex flex-col gap-6">
        <Field label="Age range" hint={errors.ageRange}>
          <div className="flex flex-wrap gap-2">
            {AGE_RANGES.map((a) => <Chip key={a} active={form.ageRange === a} onClick={() => setForm({ ...form, ageRange: a })}>{a}</Chip>)}
          </div>
        </Field>

        <Field label="Health goals (select all that apply)" hint={errors.goals}>
          <div className="flex flex-wrap gap-2">
            {GOAL_OPTIONS.map((g) => <Chip key={g.id} active={form.goals.includes(g.id)} onClick={() => toggleGoal(g.id)}>{g.label}</Chip>)}
          </div>
        </Field>

        <Field label="Activity level" hint={errors.activityLevel}>
          <div className="flex flex-col gap-2">
            {ACTIVITY_LEVELS.map((a) => (
              <label key={a.id} className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm cursor-pointer ${form.activityLevel === a.id ? "border-emerald-400 bg-emerald-50" : "border-slate-200"}`}>
                <input type="radio" checked={form.activityLevel === a.id} onChange={() => setForm({ ...form, activityLevel: a.id })} className="accent-emerald-600" />
                {a.label}
              </label>
            ))}
          </div>
        </Field>

        <Field label="Sleep habits" hint={errors.sleepHabits}>
          <div className="flex flex-col gap-2">
            {SLEEP_HABITS.map((s) => (
              <label key={s.id} className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm cursor-pointer ${form.sleepHabits === s.id ? "border-emerald-400 bg-emerald-50" : "border-slate-200"}`}>
                <input type="radio" checked={form.sleepHabits === s.id} onChange={() => setForm({ ...form, sleepHabits: s.id })} className="accent-emerald-600" />
                {s.label}
              </label>
            ))}
          </div>
        </Field>

        <Field label="Eating habits" hint={errors.eatingHabits}>
          <div className="flex flex-wrap gap-2">
            {EATING_HABITS.map((e) => <Chip key={e.id} active={form.eatingHabits === e.id} onClick={() => setForm({ ...form, eatingHabits: e.id })}>{e.label}</Chip>)}
          </div>
        </Field>

        <Field label="Typical daily water intake" hint={errors.waterIntake}>
          <div className="flex flex-wrap gap-2">
            {WATER_OPTIONS.map((w) => <Chip key={w} active={form.waterIntake === w} onClick={() => setForm({ ...form, waterIntake: w })}>{w}</Chip>)}
          </div>
        </Field>

        <div className="h-px bg-slate-100" />
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide font-body -mb-2">Optional</p>

        <Field label="Allergies">
          <textarea value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} rows={2} placeholder="e.g. peanuts, penicillin (optional)"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" />
        </Field>
        <Field label="Existing health conditions">
          <textarea value={form.conditions} onChange={(e) => setForm({ ...form, conditions: e.target.value })} rows={2} placeholder="e.g. asthma, hypertension (optional)"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" />
        </Field>
        <Field label="Current medications">
          <textarea value={form.medications} onChange={(e) => setForm({ ...form, medications: e.target.value })} rows={2} placeholder="e.g. metformin, vitamin D (optional)"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" />
        </Field>

        <SafetyBanner compact />

        {saveError && (
          <div className="flex items-center justify-between gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
            <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 shrink-0" /> Something went wrong saving your profile.</span>
            <button onClick={submit} className="font-semibold underline shrink-0">Retry</button>
          </div>
        )}

        <button onClick={submit} disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save profile
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   RECOMMENDATIONS ENGINE + CATEGORY PAGE
   ========================================================================= */
function generateRecs(category, profile) {
  const pool = RECOMMENDATIONS.filter((r) => r.category === category);
  if (!profile) return pool.slice(0, 4);
  const profileTags = new Set([profile.activityLevel, profile.sleepHabits, profile.eatingHabits, ...(profile.goals || [])].filter(Boolean));
  const scored = pool.map((r) => ({ r, score: r.tags.filter((t) => profileTags.has(t)).length }));
  scored.sort((a, b) => b.score - a.score);
  const matched = scored.filter((s) => s.score > 0).map((s) => s.r);
  const rest = scored.filter((s) => s.score === 0).map((s) => s.r);
  return [...matched, ...rest];
}

function CategoryPage({ category, profile, saved, onSave, onLearnMore, onGoToProfile, onReportConcern, refreshSignal }) {
  const meta = CATEGORY_META[category];
  const c = COLOR[meta.color];
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);
  const [refineOpen, setRefineOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({ goals: profile?.goals || [] });

  const runGeneration = useCallback(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const effectiveProfile = profile ? { ...profile, goals: localFilters.goals } : null;
      setRecs(generateRecs(category, effectiveProfile));
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, [category, profile, localFilters]);

  useEffect(() => { const cancel = runGeneration(); return cancel; }, [category, refreshSignal]); // eslint-disable-line

  const savedIds = new Set(saved.map((s) => s.id));
  const isComplete = profile && profileCompletion(profile) === 100;

  return (
    <div className="p-5 sm:p-8 max-w-5xl mx-auto pb-16">
      <div className="flex items-start justify-between gap-4 mb-1">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${c.solid} flex items-center justify-center`}>
            <meta.icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-800">{meta.label}</h2>
        </div>
      </div>
      <p className="text-slate-500 font-body text-sm mb-5 max-w-2xl">
        {category === "medication"
          ? "General, educational information about medications and safe habits. This is never a diagnosis, prescription, or medical instruction."
          : `Educational suggestions related to ${meta.label.toLowerCase()}, shaped by your saved health profile.`}
      </p>

      {category === "medication" && <div className="mb-5"><SafetyBanner compact /></div>}

      {!profile || !isComplete ? (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 font-body">
          <span className="flex items-center gap-2"><Info className="w-4 h-4 shrink-0" /> Complete your health profile for more personalized suggestions.</span>
          <button onClick={onGoToProfile} className="font-semibold underline shrink-0">Update profile</button>
        </div>
      ) : null}

      <div className="mb-5">
        <button onClick={() => setRefineOpen(!refineOpen)} className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-800">
          <RotateCcw className="w-3.5 h-3.5" /> Refine search <ChevronDown className={`w-3.5 h-3.5 transition-transform ${refineOpen ? "rotate-180" : ""}`} />
        </button>
        {refineOpen && (
          <div className="mt-3 rounded-2xl border border-slate-200 p-4 flex flex-col gap-3 animate-fadeIn">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Prioritize goals</p>
            <div className="flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((g) => (
                <Chip key={g.id} active={localFilters.goals.includes(g.id)}
                  onClick={() => setLocalFilters((f) => ({ goals: f.goals.includes(g.id) ? f.goals.filter((x) => x !== g.id) : [...f.goals, g.id] }))}>
                  {g.label}
                </Chip>
              ))}
            </div>
            <button onClick={runGeneration} className={`self-start mt-1 text-sm font-semibold text-white px-4 py-2 rounded-full ${c.solid} ${c.solidHover}`}>
              Regenerate recommendations
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : recs.length ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {recs.map((r) => <RecCard key={r.id} rec={r} isSaved={savedIds.has(r.id)} onSave={onSave} onLearnMore={onLearnMore} />)}
        </div>
      ) : (
        <EmptyState icon={meta.icon} title="No recommendations found" body="Try adjusting your refine filters or completing your health profile."
          action={<button onClick={runGeneration} className="text-sm font-medium text-emerald-700 hover:underline">Try again</button>} />
      )}

      {!loading && recs.length > 0 && (
        <div className="flex items-center justify-center mt-6">
          <button onClick={runGeneration} className="text-sm font-medium font-body px-4 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Not quite right? Try again
          </button>
        </div>
      )}

      {category === "medication" && (
        <div className="mt-10 rounded-2xl border border-red-100 bg-red-50/50 p-6">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-display font-semibold text-slate-800">Experiencing a side effect or medication concern?</p>
              <p className="text-sm text-slate-500 font-body mt-1">We can share general safety information, but only a healthcare professional can evaluate your symptoms.</p>
            </div>
          </div>
          <button onClick={onReportConcern} className="ml-8 text-sm font-semibold text-red-600 hover:underline">Report a concern</button>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   MEDICATION CONCERN MODAL
   ========================================================================= */
function ConcernModal({ onClose, onLog, profile }) {
  const [step, setStep] = useState("form");
  const [medication, setMedication] = useState("");
  const [symptom, setSymptom] = useState("");

  const submit = () => {
    setStep("result");
    onLog();
  };

  return (
    <Modal onClose={onClose} wide>
      {step === "form" ? (
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-bold text-lg text-slate-800">Report a medication concern</h3>
          <p className="text-sm text-slate-500 font-body">
            This tool shares general safety information only. It cannot evaluate your symptoms, diagnose a reaction, or tell you to start, stop, or change any medication.
          </p>
          <Field label="Which medication is this about?">
            <input value={medication} onChange={(e) => setMedication(e.target.value)} placeholder={profile?.medications ? `e.g. ${profile.medications.split(",")[0]}` : "Medication name"}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400" />
          </Field>
          <Field label="What are you noticing?">
            <textarea value={symptom} onChange={(e) => setSymptom(e.target.value)} rows={3} placeholder="Describe what you're experiencing"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400" />
          </Field>
          <button onClick={submit} disabled={!medication || !symptom}
            className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl py-3 text-sm font-semibold">
            Continue
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldCheck className="w-5.5 h-5.5 text-red-600" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-800">General safety information</h3>
          <p className="text-sm text-slate-600 font-body leading-relaxed">
            We're not able to tell you whether what you're experiencing is related to {medication || "your medication"}, and we can't advise you to start, stop,
            or change any dose. New or worsening symptoms after taking a medication are worth discussing with a pharmacist or your prescriber promptly.
          </p>
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 font-body flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            If you're experiencing a severe reaction — such as difficulty breathing, swelling of the face or throat, chest pain, or fainting — seek emergency
            care immediately (call 911 or your local emergency number).
          </div>
          <p className="text-sm text-slate-500 font-body">This has been noted in your history. Consider contacting your pharmacist or prescriber to follow up.</p>
          <button onClick={onClose} className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl py-3 text-sm font-semibold">Close</button>
        </div>
      )}
    </Modal>
  );
}

/* =========================================================================
   LEARN MORE MODAL
   ========================================================================= */
function LearnMoreModal({ rec, onClose, isSaved, onSave }) {
  const meta = CATEGORY_META[rec.category];
  const c = COLOR[meta.color];
  return (
    <Modal onClose={onClose} wide>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.chip}`}>{meta.label}</span>
      <h3 className="font-display font-bold text-xl text-slate-800 mt-3 mb-3">{rec.title}</h3>
      <p className="text-sm text-slate-600 font-body leading-relaxed">{rec.long}</p>
      <div className="mt-5 flex gap-2">
        <button onClick={() => onSave(rec)} disabled={isSaved}
          className={`text-sm font-medium font-body px-4 py-2.5 rounded-full flex items-center gap-1.5 ${isSaved ? "bg-slate-100 text-slate-400" : `${c.solid} ${c.solidHover} text-white`}`}>
          {isSaved ? <><Check className="w-4 h-4" /> Saved to profile</> : <><Bookmark className="w-4 h-4" /> Save to profile</>}
        </button>
        <button onClick={onClose} className="text-sm font-medium font-body px-4 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50">Close</button>
      </div>
      {rec.category !== "diet" && (
        <p className="text-xs text-slate-400 font-body mt-4">This is general educational information, not medical advice specific to you.</p>
      )}
    </Modal>
  );
}

/* =========================================================================
   SAVED RESOURCES
   ========================================================================= */
function SavedResourcesPage({ saved, onRemove, onLearnMore, setPage }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? saved : saved.filter((s) => s.category === filter);

  return (
    <div className="p-5 sm:p-8 max-w-5xl mx-auto">
      <h2 className="font-display font-bold text-2xl text-slate-800 mb-1">Saved resources</h2>
      <p className="text-slate-500 font-body text-sm mb-5">Everything you've saved from your recommendations, in one place.</p>

      <div className="flex gap-2 mb-6">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>All</Chip>
        {Object.entries(CATEGORY_META).map(([k, m]) => <Chip key={k} active={filter === k} onClick={() => setFilter(k)}>{m.label}</Chip>)}
      </div>

      {filtered.length ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((rec) => {
            const meta = CATEGORY_META[rec.category];
            const c = COLOR[meta.color];
            return (
              <div key={rec.id} className="rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 bg-white">
                <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full ${c.chip}`}>{meta.label}</span>
                <h3 className="font-display font-semibold text-slate-800">{rec.title}</h3>
                <p className="text-sm text-slate-500 font-body">{rec.short}</p>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => onLearnMore(rec)} className="text-sm font-medium px-3.5 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50">Learn more</button>
                  <button onClick={() => onRemove(rec)} className="text-sm font-medium px-3.5 py-2 rounded-full text-red-500 hover:bg-red-50">Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={Bookmark} title="No saved resources yet" body="When you save a recommendation, it will show up here so you can find it again later."
          action={<button onClick={() => setPage("diet")} className="text-sm font-medium text-emerald-700 hover:underline">Browse recommendations</button>} />
      )}
    </div>
  );
}

/* =========================================================================
   HISTORY PAGE
   ========================================================================= */
function HistoryPage({ checkins, saved, history }) {
  const items = useMemo(() => {
    const all = [
      ...checkins.map((c) => ({ ts: c.ts, type: "Check-in", detail: `Mood ${c.mood}/5 · ${c.sleepHours}h sleep · ${c.waterGlasses} glasses of water`, icon: CalendarCheck, color: "emerald" })),
      ...saved.map((s) => ({ ts: s.savedAt, type: "Saved resource", detail: s.title, icon: Bookmark, color: "sky" })),
      ...history.filter((h) => h.type === "concern").map((h) => ({ ts: h.ts, type: "Medication concern reported", detail: "General safety information shown", icon: AlertTriangle, color: "amber" })),
      ...history.filter((h) => h.type === "profile").map((h) => ({ ts: h.ts, type: "Profile updated", detail: "Health profile information changed", icon: ClipboardList, color: "slate" })),
    ];
    return all.sort((a, b) => new Date(b.ts) - new Date(a.ts));
  }, [checkins, saved, history]);

  return (
    <div className="p-5 sm:p-8 max-w-3xl mx-auto">
      <h2 className="font-display font-bold text-2xl text-slate-800 mb-1">History</h2>
      <p className="text-slate-500 font-body text-sm mb-6">A timeline of your check-ins, saved resources, and profile updates.</p>
      {items.length ? (
        <ol className="flex flex-col gap-3">
          {items.map((it, i) => {
            const c = COLOR[it.color];
            return (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
                  <it.icon className={`w-4 h-4 ${c.text}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 font-body">{it.type}</p>
                  <p className="text-sm text-slate-500 font-body">{it.detail}</p>
                  <p className="text-xs text-slate-400 font-body mt-0.5">{fmtDate(it.ts)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <EmptyState icon={HistoryIcon} title="No history yet" body="Your check-ins and saved resources will be logged here over time." />
      )}
    </div>
  );
}

/* =========================================================================
   USER PROFILE PAGE
   ========================================================================= */
function UserProfilePage({ user, profile, onUpdateName, setPage }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);

  const summaryRows = [
    { label: "Age range", value: profile.ageRange || "Not set" },
    { label: "Goals", value: profile.goals.length ? profile.goals.map((g) => GOAL_OPTIONS.find((o) => o.id === g)?.label).join(", ") : "Not set" },
    { label: "Activity level", value: ACTIVITY_LEVELS.find((a) => a.id === profile.activityLevel)?.label || "Not set" },
    { label: "Sleep habits", value: SLEEP_HABITS.find((s) => s.id === profile.sleepHabits)?.label || "Not set" },
    { label: "Eating habits", value: EATING_HABITS.find((e) => e.id === profile.eatingHabits)?.label || "Not set" },
    { label: "Water intake", value: profile.waterIntake || "Not set" },
    { label: "Allergies", value: profile.allergies || "None listed" },
    { label: "Conditions", value: profile.conditions || "None listed" },
    { label: "Medications", value: profile.medications || "None listed" },
  ];

  return (
    <div className="p-5 sm:p-8 max-w-2xl mx-auto pb-16">
      <h2 className="font-display font-bold text-2xl text-slate-800 mb-6">My profile</h2>

      <div className="rounded-2xl border border-slate-200 p-6 flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-slate-700 text-white font-display font-bold text-lg flex items-center justify-center shrink-0">
          {initials(user.name)}
        </div>
        <div className="flex-1">
          {editing ? (
            <div className="flex gap-2">
              <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm flex-1" />
              <button onClick={() => { onUpdateName(name); setEditing(false); }} className="text-sm font-semibold text-emerald-700">Save</button>
            </div>
          ) : (
            <p className="font-display font-semibold text-slate-800 flex items-center gap-2">{user.name}
              <button onClick={() => setEditing(true)} className="text-xs font-medium text-slate-400 hover:text-emerald-700">Edit</button>
            </p>
          )}
          <p className="text-sm text-slate-500 font-body">{user.email}</p>
          <p className="text-xs text-slate-400 font-body mt-0.5">Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-display font-semibold text-slate-800">Health profile summary</p>
          <button onClick={() => setPage("profile-form")} className="text-sm font-medium text-emerald-700 hover:underline">Edit</button>
        </div>
        <dl className="flex flex-col divide-y divide-slate-100">
          {summaryRows.map((r) => (
            <div key={r.label} className="flex justify-between gap-4 py-2.5 text-sm">
              <dt className="text-slate-400 font-body shrink-0">{r.label}</dt>
              <dd className="text-slate-700 font-body text-right">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* =========================================================================
   SETTINGS PAGE
   ========================================================================= */
function SettingsPage({ onLogout, onClearData, notify }) {
  const [notifications, setNotifications] = useState(true);
  const [units, setUnits] = useState("imperial");
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="p-5 sm:p-8 max-w-2xl mx-auto pb-16 flex flex-col gap-5">
      <h2 className="font-display font-bold text-2xl text-slate-800">Settings</h2>

      <div className="rounded-2xl border border-slate-200 p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 font-body">Daily check-in reminders</p>
            <p className="text-xs text-slate-400 font-body">Get a gentle nudge if you haven't checked in yet.</p>
          </div>
          <button onClick={() => setNotifications(!notifications)} className={`w-11 h-6 rounded-full relative transition-colors ${notifications ? "bg-emerald-600" : "bg-slate-200"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notifications ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
        <div className="h-px bg-slate-100" />
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700 font-body">Units</p>
          <div className="flex rounded-full bg-slate-100 p-1">
            <button onClick={() => setUnits("imperial")} className={`px-3 py-1.5 rounded-full text-xs font-medium ${units === "imperial" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"}`}>Imperial</button>
            <button onClick={() => setUnits("metric")} className={`px-3 py-1.5 rounded-full text-xs font-medium ${units === "metric" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"}`}>Metric</button>
          </div>
        </div>
        <div className="h-px bg-slate-100" />
        <div className="flex items-center justify-between opacity-50">
          <div>
            <p className="text-sm font-medium text-slate-700 font-body">Dark mode</p>
            <p className="text-xs text-slate-400 font-body">Coming soon.</p>
          </div>
          <button disabled className="w-11 h-6 rounded-full bg-slate-200 relative"><span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white" /></button>
        </div>
        <button onClick={() => notify("Settings saved.")} className="self-start mt-1 text-sm font-semibold text-emerald-700 hover:underline">Save settings</button>
      </div>

      <div className="rounded-2xl border border-slate-200 p-6 flex flex-col gap-3">
        <p className="text-sm font-medium text-slate-700 font-body">Account</p>
        <button onClick={onLogout} className="self-start text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5"><LogOut className="w-4 h-4" /> Log out</button>
      </div>

      <div className="rounded-2xl border border-red-200 p-6 flex flex-col gap-3">
        <p className="text-sm font-medium text-red-700 font-body">Danger zone</p>
        {!confirmClear ? (
          <button onClick={() => setConfirmClear(true)} className="self-start text-sm font-medium text-red-600 hover:underline">Clear all my saved data</button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-500 font-body">This removes your health profile, check-ins, and saved resources. Are you sure?</p>
            <button onClick={() => { onClearData(); setConfirmClear(false); }} className="text-sm font-semibold text-red-600 shrink-0">Yes, clear</button>
            <button onClick={() => setConfirmClear(false)} className="text-sm text-slate-400 shrink-0">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   SEARCH OVERLAY
   ========================================================================= */
function SearchResults({ query, onClose, onLearnMore }) {
  const results = RECOMMENDATIONS.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase()) || r.short.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 flex items-start justify-center pt-24 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-lg overflow-hidden animate-slideUp" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-300" />
          <p className="text-sm text-slate-500 font-body">Results for "{query}"</p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {results.length ? results.map((r) => {
            const meta = CATEGORY_META[r.category];
            const c = COLOR[meta.color];
            return (
              <button key={r.id} onClick={() => { onLearnMore(r); onClose(); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start gap-3 border-b border-slate-50 last:border-0">
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 mt-0.5 ${c.chip}`}>{meta.label}</span>
                <div>
                  <p className="text-sm font-medium text-slate-700">{r.title}</p>
                  <p className="text-xs text-slate-400 line-clamp-1">{r.short}</p>
                </div>
              </button>
            );
          }) : (
            <div className="p-6 text-center text-sm text-slate-400 font-body">No recommendations match your search.</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   ROOT APP
   ========================================================================= */
export default function App() {
  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState(emptyProfile());
  const [checkins, setCheckins] = useState([]);
  const [saved, setSaved] = useState([]);
  const [history, setHistory] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [learnMoreRec, setLearnMoreRec] = useState(null);
  const [concernOpen, setConcernOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshSignal, setRefreshSignal] = useState(0);

  const notify = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  // boot: check session
  useEffect(() => {
    (async () => {
      const email = await storageGet("session_email", null);
      if (email === GUEST_EMAIL) {
        await handleGuest();
      } else if (email) {
        const users = await storageGet("users_db", []);
        const found = users.find((u) => u.email === email);
        if (found) await loadUser(found);
      }
      setBooting(false);
    })();
  }, []);

  const loadUser = async (u) => {
    setUser(u);
    const p = await storageGet(`profile:${u.email}`, emptyProfile());
    const ch = await storageGet(`checkins:${u.email}`, []);
    const sv = await storageGet(`saved:${u.email}`, []);
    const hs = await storageGet(`history:${u.email}`, []);
    setProfile(p);
    setCheckins(ch);
    setSaved(sv);
    setHistory(hs);
    setPage("dashboard");
  };

  const handleAuth = (u) => loadUser(u);

  const handleGuest = async () => {
    const guestUser = { name: "Guest User", email: GUEST_EMAIL, password: "", createdAt: new Date().toISOString() };
    setUser(guestUser);
    await storageSet("session_email", GUEST_EMAIL);
    // Seed sample data only the first time; reuse whatever's already there on repeat visits.
    const existingProfile = await storageGet(`profile:${GUEST_EMAIL}`, null);
    if (existingProfile) {
      setProfile(existingProfile);
      setCheckins(await storageGet(`checkins:${GUEST_EMAIL}`, []));
      setSaved(await storageGet(`saved:${GUEST_EMAIL}`, []));
      setHistory(await storageGet(`history:${GUEST_EMAIL}`, []));
    } else {
      const p = sampleProfile();
      const ch = sampleCheckins();
      const sv = sampleSaved();
      await storageSet(`profile:${GUEST_EMAIL}`, p);
      await storageSet(`checkins:${GUEST_EMAIL}`, ch);
      await storageSet(`saved:${GUEST_EMAIL}`, sv);
      await storageSet(`history:${GUEST_EMAIL}`, []);
      setProfile(p);
      setCheckins(ch);
      setSaved(sv);
      setHistory([]);
    }
    setPage("dashboard");
    notify("You're browsing as a guest — sample data is preloaded so you can explore.");
  };

  const handleLogout = async () => {
    await storageSet("session_email", null);
    setUser(null);
    setProfile(emptyProfile());
    setCheckins([]);
    setSaved([]);
    setHistory([]);
    setPage("dashboard");
  };

  const handleSaveProfile = async (form) => {
    const ok = await storageSet(`profile:${user.email}`, form);
    if (ok) {
      setProfile(form);
      const newHist = [...history, { type: "profile", ts: new Date().toISOString() }];
      setHistory(newHist);
      await storageSet(`history:${user.email}`, newHist);
      setRefreshSignal((s) => s + 1);
    }
    return ok;
  };

  const handleAddCheckin = async (entry) => {
    const next = [...checkins.filter((c) => c.date !== entry.date), entry];
    setCheckins(next);
    await storageSet(`checkins:${user.email}`, next);
  };

  const handleSaveRec = async (rec) => {
    if (saved.find((s) => s.id === rec.id)) return;
    const next = [...saved, { ...rec, savedAt: new Date().toISOString() }];
    setSaved(next);
    await storageSet(`saved:${user.email}`, next);
    notify(`Saved "${rec.title}" to your profile.`);
  };

  const handleRemoveSaved = async (rec) => {
    const next = saved.filter((s) => s.id !== rec.id);
    setSaved(next);
    await storageSet(`saved:${user.email}`, next);
    notify("Removed from saved resources.");
  };

  const handleUpdateName = async (name) => {
    const users = await storageGet("users_db", []);
    const next = users.map((u) => (u.email === user.email ? { ...u, name } : u));
    await storageSet("users_db", next);
    setUser({ ...user, name });
    notify("Name updated.");
  };

  const handleLogConcern = async () => {
    const next = [...history, { type: "concern", ts: new Date().toISOString() }];
    setHistory(next);
    await storageSet(`history:${user.email}`, next);
  };

  const handleClearData = async () => {
    await storageSet(`profile:${user.email}`, emptyProfile());
    await storageSet(`checkins:${user.email}`, []);
    await storageSet(`saved:${user.email}`, []);
    await storageSet(`history:${user.email}`, []);
    setProfile(emptyProfile());
    setCheckins([]);
    setSaved([]);
    setHistory([]);
    notify("All saved data cleared.");
  };

  if (booting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="font-body">
        <FontImport />
        <Toast toasts={toasts} />
        <AuthGate onAuth={handleAuth} notify={notify} onGuest={handleGuest} />
      </div>
    );
  }

  const titleMap = {
    dashboard: "Dashboard", "profile-form": "My Health Profile", checkin: "Daily Check-In",
    diet: "Diet & Nutrition", exercise: "Exercise & Activity", medication: "Medication Information",
    saved: "Saved Resources", history: "History", settings: "Settings", "user-profile": "My Profile",
  };

  return (
    <div className="font-body bg-white min-h-screen flex">
      <FontImport />
      <Toast toasts={toasts} />
      <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 min-w-0 flex flex-col">
        {user.email === GUEST_EMAIL && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs sm:text-sm text-amber-800 font-body flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" /> You're browsing as a guest. Data stays on this device and isn't tied to an account.
            </p>
            <button onClick={handleLogout} className="text-xs sm:text-sm font-semibold text-amber-800 underline shrink-0">Sign up to save permanently</button>
          </div>
        )}
        <TopBar title={titleMap[page]} onMenu={() => setMobileOpen(true)}
          onSearch={page === "dashboard" ? undefined : undefined} searchQuery={searchQuery} />
        {/* global search trigger lives on dashboard content itself for simplicity */}
        {page === "dashboard" && (
          <div className="px-5 sm:px-8 pt-4">
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search recommendations..."
                className="w-full rounded-full border border-slate-200 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" />
            </div>
          </div>
        )}
        {searchQuery && page === "dashboard" && (
          <SearchResults query={searchQuery} onClose={() => setSearchQuery("")} onLearnMore={setLearnMoreRec} />
        )}

        {page === "dashboard" && (
          <Dashboard user={user} profile={profile} checkins={checkins} saved={saved} history={history}
            setPage={setPage} notify={notify} openRecModal={setLearnMoreRec} />
        )}
        {page === "checkin" && <CheckInPage checkins={checkins} onSubmit={handleAddCheckin} notify={notify} />}
        {page === "profile-form" && <ProfileForm profile={profile} onSave={handleSaveProfile} notify={notify} />}
        {(page === "diet" || page === "exercise" || page === "medication") && (
          <CategoryPage category={page} profile={profileCompletion(profile) > 0 ? profile : null} saved={saved}
            onSave={handleSaveRec} onLearnMore={setLearnMoreRec} onGoToProfile={() => setPage("profile-form")}
            onReportConcern={() => setConcernOpen(true)} refreshSignal={refreshSignal} />
        )}
        {page === "saved" && <SavedResourcesPage saved={saved} onRemove={handleRemoveSaved} onLearnMore={setLearnMoreRec} setPage={setPage} />}
        {page === "history" && <HistoryPage checkins={checkins} saved={saved} history={history} />}
        {page === "user-profile" && <UserProfilePage user={user} profile={profile} onUpdateName={handleUpdateName} setPage={setPage} />}
        {page === "settings" && <SettingsPage onLogout={handleLogout} onClearData={handleClearData} notify={notify} />}
      </div>

      {learnMoreRec && (
        <LearnMoreModal rec={learnMoreRec} onClose={() => setLearnMoreRec(null)} isSaved={saved.some((s) => s.id === learnMoreRec.id)} onSave={handleSaveRec} />
      )}
      {concernOpen && <ConcernModal onClose={() => setConcernOpen(false)} onLog={handleLogConcern} profile={profile} />}
    </div>
  );
}

/* Auth gate handles landing -> auth transition for logged-out users */
function AuthGate({ onAuth, notify, onGuest }) {
  const [showAuth, setShowAuth] = useState(false);
  if (showAuth) return <AuthPage onAuth={onAuth} notify={notify} onGuest={onGuest} />;
  return <LandingPage onGetStarted={() => setShowAuth(true)} onGuest={onGuest} />;
}
