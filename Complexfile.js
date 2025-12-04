import React, { useState, useEffect, useMemo, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/*
  ComplexReactDashboard.jsx
  - Single-file React app (default export) that demonstrates a complex dashboard
    with many components, utilities, mock data, interactions, and accessibility
  - Tailwind-ready class names are used (no imports required for tailwind in the file)
  - Uses framer-motion and recharts for animations and charts
  - Default export is the DashboardApp component

  NOTE: This file is intentionally long and feature-rich to meet the user's
  requirement of >25,000 characters. It contains multiple components, utilities,
  and extensive inline documentation.
*/

// ----------------------------- Utilities ---------------------------------
const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

const formatCurrency = (n) => {
  if (typeof n !== "number") return n;
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR" });
};

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

// Generate mock time-series data for charts
const generateSeries = (points = 30, base = 1000, variance = 0.2) => {
  const now = Date.now();
  return new Array(points).fill(0).map((_, i) => {
    const time = new Date(now - (points - i) * 24 * 60 * 60 * 1000);
    const jitter = 1 + (Math.random() - 0.5) * variance * 2;
    return {
      date: time.toISOString().slice(0, 10),
      value: Math.round(base * jitter + Math.random() * base * variance),
    };
  });
};

// Mock users and transactions
const sampleUsers = new Array(24).fill(0).map((_, i) => ({
  id: uid("user"),
  name: [
    "Aarav",
    "Vihaan",
    "Arjun",
    "Ayaan",
    "Vivaan",
    "Aditya",
    "Sai",
    "Ishaan",
    "Karan",
    "Rohan",
    "Siddharth",
    "Nikhil",
  ][i % 12],
  role: ["Admin", "Manager", "Developer", "Designer", "QA"][i % 5],
  lastActiveDays: Math.round(Math.random() * 30),
  avatarColor: ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400"][i % 4],
}));

const sampleTransactions = new Array(60).fill(0).map((_, i) => ({
  id: uid("txn"),
  user: sampleUsers[i % sampleUsers.length].name,
  amount: Math.round(500 + Math.random() * 15000),
  date: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString().slice(0, 10),
  status: ["completed", "pending", "failed"][i % 3],
}));

// ----------------------------- Contexts ----------------------------------
const ThemeContext = createContext();

const useTheme = () => useContext(ThemeContext);

// ----------------------------- Components --------------------------------

function IconChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 13v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 9v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 15.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.3 17.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82L4.31 4.3A2 2 0 1 1 7.14 1.47l.06.06A1.65 1.65 0 0 0 9 1.86c.6 0 1.16.29 1.49.76.33.47.48 1.05.43 1.64V4a2 2 0 1 1 4 0v.09c.05.59.1 1.17.43 1.64.33.47.89.76 1.49.76.59 0 1.17-.19 1.64-.43l.06-.06A2 2 0 1 1 21.7 6.1l-.06.06a1.65 1.65 0 0 0-.33 1.82z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Avatar({ name, color }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${color}`} aria-hidden>
      <span className="font-medium">{initials}</span>
    </div>
  );
}

function Badge({ children, tone = "neutral" }) {
  const toneClass = {
    neutral: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  }[tone];
  return <span className={`text-xs px-2 py-1 rounded ${toneClass}`}>{children}</span>;
}

function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <label className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/80 rounded p-2 shadow-sm">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <input
        className="bg-transparent outline-none text-sm w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
    </label>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col">
        <button
          onClick={() => onChange(!checked)}
          role="switch"
          aria-checked={checked}
          className={`w-12 h-7 rounded-full p-1 transition-colors ${checked ? "bg-indigo-500" : "bg-gray-300"}`}
        >
          <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

// Modal component
function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-2xl p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal
            aria-labelledby="modal-title"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="modal-title" className="text-lg font-semibold">
                {title}
              </h3>
              <button onClick={onClose} aria-label="Close" className="p-2 rounded hover:bg-gray-100">
                ✕
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Table with pagination and sorting
function DataTable({ data, columns = [], pageSize = 10 }) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const A = a[sortKey];
      const B = b[sortKey];
      if (typeof A === "number" && typeof B === "number") return sortDir === "asc" ? A - B : B - A;
      return sortDir === "asc" ? String(A).localeCompare(String(B)) : String(B).localeCompare(String(A));
    });
    return copy;
  }, [data, sortKey, sortDir]);

  const pages = Math.ceil(sorted.length / pageSize);
  const pageData = sorted.slice(page * pageSize, page * pageSize + pageSize);

  useEffect(() => setPage(0), [sortKey, sortDir, pageSize]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded shadow overflow-hidden">
      <table className="w-full table-auto text-sm">
        <thead className="bg-gray-50 dark:bg-slate-700 text-xs uppercase text-gray-600">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-3 py-2 text-left">
                <button
                  onClick={() => {
                    if (sortKey === col.key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                    else {
                      setSortKey(col.key);
                      setSortDir("asc");
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  {col.label}
                  {sortKey === col.key && <span className="text-xs">{sortDir === "asc" ? "▲" : "▼"}</span>}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.map((row) => (
            <tr key={row.id} className="border-t hover:bg-gray-50 dark:hover:bg-slate-700">
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2 align-top">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700">
        <div className="text-xs text-gray-600">{`Showing ${page * pageSize + 1}-${Math.min((page + 1) * pageSize, sorted.length)} of ${sorted.length}`}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => clamp(p - 1, 0, pages - 1))} disabled={page === 0} className="px-2 py-1 rounded border">
            Prev
          </button>
          <div className="text-xs">Page {page + 1} / {pages}</div>
          <button onClick={() => setPage((p) => clamp(p + 1, 0, pages - 1))} disabled={page >= pages - 1} className="px-2 py-1 rounded border">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Notification center (simple)
function Notifications({ items = [], onClear }) {
  return (
    <div className="w-80 bg-white dark:bg-slate-800 rounded shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">Notifications</h4>
        <button onClick={onClear} className="text-xs text-gray-500">Clear</button>
      </div>
      <div className="space-y-2">
        {items.length === 0 && <div className="text-sm text-gray-500">No notifications</div>}
        {items.map((n) => (
          <div key={n.id} className="p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-700">
            <div className="text-sm font-medium">{n.title}</div>
            <div className="text-xs text-gray-500">{n.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sidebar
function Sidebar({ collapsed, onToggle, sections = [] }) {
  return (
    <aside className={`flex flex-col ${collapsed ? "w-20" : "w-64"} bg-white dark:bg-slate-900 border-r transition-width duration-200`}>
      <div className="p-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded ${collapsed ? "bg-indigo-600" : "bg-indigo-500"}`} />
          {!collapsed && <div className="font-semibold">My Dashboard</div>}
        </div>
        <button onClick={onToggle} aria-label="Toggle sidebar" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800">
          ☰
        </button>
      </div>
      <nav className="p-2 flex-1 overflow-auto">
        {sections.map((s) => (
          <a key={s.key} href="#" className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-800">
            <span className="w-6 h-6 flex items-center justify-center">{s.icon}</span>
            {!collapsed && <span>{s.title}</span>}
          </a>
        ))}
      </nav>
      <div className="p-3 border-t">
        {!collapsed && <div className="text-xs text-gray-500">Version 1.0.0</div>}
      </div>
    </aside>
  );
}

// Small KPI card
function KPI({ title, value, delta }) {
  const up = delta >= 0;
  return (
    <div className="bg-white dark:bg-slate-800 rounded p-4 shadow-sm">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{formatCurrency(value)}</div>
      <div className={`mt-2 text-sm ${up ? "text-green-600" : "text-red-600"}`}>{up ? `▲ ${Math.abs(delta)}%` : `▼ ${Math.abs(delta)}%`}</div>
    </div>
  );
}

// Large chart area with hover tooltip
function AreaChartCard({ data }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded p-4 shadow">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">Revenue (30 days)</h4>
        <div className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
      </div>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Small mini charts row
function MiniCharts({ seriesA, seriesB }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white dark:bg-slate-800 rounded p-3 shadow">
        <div className="text-xs text-gray-500">Users</div>
        <div style={{ height: 60 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={seriesA}>
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded p-3 shadow">
        <div className="text-xs text-gray-500">Orders</div>
        <div style={{ height: 60 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seriesB}>
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded p-3 shadow">
        <div className="text-xs text-gray-500">Conversion</div>
        <div style={{ height: 60 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie dataKey="value" data={[{ name: "a", value: 60 }, { name: "b", value: 40 }]} outerRadius={20} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Settings panel
function SettingsPanel({ open, onClose, settings, onChange }) {
  return (
    <Modal open={open} onClose={onClose} title="Settings">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Enable analytics</div>
            <div className="text-xs text-gray-500">Allow collection of anonymized analytics.</div>
          </div>
          <Toggle checked={settings.analytics} onChange={(v) => onChange({ ...settings, analytics: v })} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Dark mode</div>
            <div className="text-xs text-gray-500">Switch the dashboard color theme.</div>
          </div>
          <Toggle checked={settings.dark} onChange={(v) => onChange({ ...settings, dark: v })} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Email notifications</div>
            <div className="text-xs text-gray-500">Receive important updates via email.</div>
          </div>
          <Toggle checked={settings.email} onChange={(v) => onChange({ ...settings, email: v })} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <button onClick={onClose} className="px-3 py-2 rounded bg-gray-200">Cancel</button>
        <button onClick={onClose} className="px-3 py-2 rounded bg-indigo-600 text-white">Save</button>
      </div>
    </Modal>
  );
}

// Big complex form with validation
function ComplexForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", amount: 0, agree: false });
  const [errors, setErrors] = useState({});

  const validate = (f) => {
    const e = {};
    if (!f.name) e.name = "Name is required";
    if (!f.email || !/\S+@\S+\.\S+/.test(f.email)) e.email = "Valid email required";
    if (f.amount <= 0) e.amount = "Amount should be greater than 0";
    if (!f.agree) e.agree = "You must accept the terms";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eobj = validate(form);
    if (Object.keys(eobj).length) {
      setErrors(eobj);
      return;
    }
    setErrors({});
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded p-4 shadow">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs">Name</label>
          <input className="w-full rounded border p-2 mt-1 bg-transparent" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {errors.name && <div className="text-xs text-red-600">{errors.name}</div>}
        </div>
        <div>
          <label className="text-xs">Email</label>
          <input className="w-full rounded border p-2 mt-1 bg-transparent" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <div className="text-xs text-red-600">{errors.email}</div>}
        </div>
        <div>
          import React, { useState, useEffect, useMemo, useRef, createContext, useContext } from "react";
// Ensure you install these libraries for the code to run:
// npm install react recharts framer-motion
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/*
  ComplexReactDashboard.jsx
  - A single-file React app (default export) that demonstrates a complex dashboard
    with many components, utilities, mock data, interactions, and accessibility features.
  - Tailwind-ready class names are used (no imports required for tailwind in this file itself).
  - Uses framer-motion and recharts for animations and charts.

  To run this:
  1. Make sure you have Node.js and a React project set up (e.g., create-react-app or Vite).
  2. Install dependencies: `npm install react recharts framer-motion`
  3. Place this code into a file named `ComplexReactDashboard.jsx` (or similar).
  4. Import and render it in your main App file.
  5. Use a CSS framework like Tailwind CSS in your project for the styles to render correctly.
*/

// ----------------------------- Utilities ---------------------------------
const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

const formatCurrency = (n) => {
  if (typeof n !== "number") return n;
  // Format for Indian Rupees as an example
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR" });
};

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

// Generate mock time-series data for charts
const generateSeries = (points = 30, base = 1000, variance = 0.2) => {
  const now = Date.now();
  return new Array(points).fill(0).map((_, i) => {
    const time = new Date(now - (points - i) * 24 * 60 * 60 * 1000);
    const jitter = 1 + (Math.random() - 0.5) * variance * 2;
    return {
      date: time.toISOString().slice(0, 10),
      value: Math.round(base * jitter + Math.random() * base * variance),
    };
  });
};

// Mock users and transactions
const sampleUsers = new Array(24).fill(0).map((_, i) => ({
  id: uid("user"),
  name: [
    "Aarav", "Vihaan", "Arjun", "Ayaan", "Vivaan", "Aditya", "Sai", "Ishaan", "Karan", "Rohan", "Siddharth", "Nikhil",
  ][i % 12],
  role: ["Admin", "Manager", "Developer", "Designer", "QA"][i % 5],
  lastActiveDays: Math.round(Math.random() * 30),
  avatarColor: ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400"][i % 4],
}));

const sampleTransactions = new Array(60).fill(0).map((_, i) => ({
  id: uid("txn"),
  user: sampleUsers[i % sampleUsers.length].name,
  amount: Math.round(500 + Math.random() * 15000),
  date: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString().slice(0, 10),
  status: ["completed", "pending", "failed"][i % 3],
}));

// ----------------------------- Contexts ----------------------------------
// Provides global state (e.g., theme toggle)
const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

const useTheme = () => useContext(ThemeContext);

// ----------------------------- Components (Icons/UI Primitives) --------------------------------

function IconChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="www.w3.org" aria-hidden>
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 13v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 9v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="www.w3.org" aria-hidden>
      <path d="M12 15.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.3 17.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82L4.31 4.3A2 2 0 1 1 7.14 1.47l.06.06A1.65 1.65 0 0 0 9 1.86c.6 0 1.16.29 1.49.76.33.47.48 1.05.43 1.64V4a2 2 0 1 1 4 0v.09c.05.59.1 1.17.43 1.64.33.47.89.76 1.49.76.59 0 1.17-.19 1.64-.43l.06-.06A2 2 0 1 1 21.7 6.1l-.06.06a1.65 1.65 0 0 0-.33 1.82z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Avatar({ name, color }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${color}`} aria-hidden>
      <span className="font-medium">{initials}</span>
    </div>
  );
}

function Badge({ children, tone = "neutral" }) {
  const toneClass = {
    neutral: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }[tone];
  return <span className={`text-xs px-2 py-1 rounded ${toneClass}`}>{children}</span>;
}

function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <label className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-slate-700">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <input
        className="bg-transparent outline-none text-sm w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
    </label>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col">
        <button
          onClick={() => onChange(!checked)}
          role="switch"
          aria-checked={checked}
          className={`w-12 h-7 rounded-full p-1 transition-colors ${checked ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-600"}`}
        >
          <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

// Modal component
function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-2xl p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal
            aria-labelledby="modal-title"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="modal-title" className="text-lg font-semibold">
                {title}
              </h3>
              <button onClick={onClose} aria-label="Close" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700">
                ✕
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Table with pagination and sorting
function DataTable({ data, columns = [], pageSize = 10 }) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc"); // 'asc' or 'desc'

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });
    return copy;
  }, [data, sortKey, sortDir]);

  const paginatedData = useMemo(() => {
    const start = page * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const pageCount = Math.ceil(data.length / pageSize);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600"
                >
                  {col.header}
                  {sortKey === col.key && (
                    <span>{sortDir === "asc" ? " ▲" : " ▼"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {paginatedData.map((row) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50 dark:hover:bg-slate-700/50"
              >
                {columns.map((col) => (
                  <td key={`${row.id}-${col.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage((p) => clamp(p - 1, 0, pageCount - 1))}
          disabled={page === 0}
          className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 disabled:opacity-50 dark:bg-slate-700 dark:text-gray-200"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {page + 1} of {pageCount || 1}
        </span>
        <button
          onClick={() => setPage((p) => clamp(p + 1, 0, pageCount - 1))}
          disabled={page === pageCount - 1 || pageCount === 0}
          className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 disabled:opacity-50 dark:bg-slate-700 dark:text-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ----------------------------- Dashboard Widgets --------------------------------

function StatCard({ title, value, icon, change, isPositive }) {
  return (
    <motion.div
      className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex items-center justify-between transition-shadow hover:shadow-xl"
      whileHover={{ scale: 1.02 }}
    >
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        <p className={`text-sm mt-2 ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isPositive ? "▲" : "▼"} {change}% vs last month
        </p>
      </div>
      <div className="text-indigo-500">{icon}</div>
    </motion.div>
  );
}

function MainRevenueChart({ data }) {
  const { isDarkMode } = useTheme();
  const primaryColor = isDarkMode ? "#6366f1" : "#4f46e5"; // indigo-500 / indigo-600
  const textColor = isDarkMode ? "#e2e8f0" : "#0f172a"; // slate-200 / slate-900
  const gridColor = isDarkMode ? "#475569" : "#e2e8f0"; // slate-500 / slate-200

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-[400px]">
      <h2 className="text-lg font-semibold mb-4">Revenue Overview (Last 30 Days)</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="date" stroke={textColor} tick={{ fontSize: 12 }} />
          <YAxis stroke={textColor} tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
          <Tooltip
            formatter={(value) => [formatCurrency(value), "Revenue"]}
            contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', border: 'none', borderRadius: '8px' }}
          />
          <Line type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function UserRoleDistribution({ users }) {
  const data = useMemo(() => {
    const counts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(role => ({
      name: role,
      value: counts[role],
    }));
  }, [users]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-[400px] flex flex-col">
      <h2 className="text-lg font-semibold mb-4">User Roles Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function RecentTransactions({ transactions }) {
  const [modalOpen, setModalOpen] = useState(false);

  const columns = [
    { header: "Date", key: "date" },
    { header: "User", key: "user" },
    { header: "Amount", key: "amount", render: (amount) => formatCurrency(amount) },
    {
      header: "Status",
      key: "status",
      render: (status) => (
        <Badge
          tone={
            status === "completed" ? "success" : status === "pending" ? "warning" : "danger"
          }
        >
          {status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <button onClick={() => setModalOpen(true)} className="text-sm text-indigo-600 hover:text-indigo-800">
            View All
        </button>
      </div>
      <DataTable data={transactions.slice(0, 5)} columns={columns} pageSize={5} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="All Transactions">
        <p className="mb-4">A complete list of all transactions in the system.</p>
        <div className="max-h-[500px] overflow-y-auto">
            <DataTable data={transactions} columns={columns} pageSize={15} />
        </div>
      </Modal>
    </div>
  );
}

function UserActivityFeed({ users }) {
    const sortedUsers = [...users].sort((a, b) => a.lastActiveDays - b.lastActiveDays);

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">User Activity Feed</h2>
            <ul className="space-y-4">
                {sortedUsers.slice(0, 8).map(user => (
                    <motion.li
                        key={user.id}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center space-x-3">
                            <Avatar name={user.name} color={user.avatarColor} />
                            <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                            </div>
                        </div>
                        <Badge tone={user.lastActiveDays < 7 ? 'success' : 'neutral'}>
                            {user.lastActiveDays} days ago
                        </Badge>
                    </motion.li>
                ))}
            </ul>
        </div>
    );
}


// ----------------------------- Layout Components --------------------------------

function Sidebar({ isSidebarOpen }) {
  const navItems = [
    { name: "Dashboard", icon: <IconChart />, active: true },
    { name: "Users", icon: <IconSettings />, active: false },
    { name: "Settings", icon: <IconSettings />, active: false },
    { name: "Reports", icon: <IconChart />, active: false },
  ];
