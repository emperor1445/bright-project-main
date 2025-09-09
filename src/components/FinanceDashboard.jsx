// src/components/FinanceDashboard.jsx
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  addDoc,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

import AddTransaction from "./AddTransaction";

export default function FinanceDashboard({ userId = "demoUser" }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seedLoading, setSeedLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setError("Missing userId");
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    let unsub;

    async function fetchCategories() {
      try {
        const catSnap = await getDocs(collection(db, "users", userId, "categories"));
        const catMap = {};
        catSnap.forEach((docu) => {
          catMap[docu.id] = { id: docu.id, ...docu.data() };
        });
        setCategories(catMap);
      } catch (err) {
        console.error("fetchCategories", err);
        setError(err.message || "Failed to load categories");
      }
    }
    fetchCategories();

    try {
      const q = query(collection(db, "users", userId, "transactions"), orderBy("date", "desc"));
      unsub = onSnapshot(
        q,
        (snapshot) => {
          const docs = [];
          snapshot.forEach((d) => {
            const data = d.data();
            let parsedDate = new Date();
            if (data.date && typeof data.date.toDate === "function") parsedDate = data.date.toDate();
            else if (data.date && data.date.seconds) parsedDate = new Date(data.date.seconds * 1000);
            else if (typeof data.date === "string") parsedDate = new Date(data.date);
            else if (typeof data.date === "number") parsedDate = new Date(data.date);
            else if (data.date instanceof Date) parsedDate = data.date;
            data.date = parsedDate;
            docs.push({ id: d.id, ...data });
          });
          setTransactions(docs);
          setLoading(false);
        },
        (err) => {
          console.error("onSnapshot error", err);
          setError(err.message || "Realtime subscription failed (permission?)");
          setLoading(false);
        }
      );
    } catch (err) {
      console.error("subscribe error", err);
      setError(err.message || "Subscription error");
      setLoading(false);
    }

    return () => {
      if (unsub) unsub();
    };
  }, [userId]);

  // totals
  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === "income") acc.income += Number(t.amount) || 0;
      else acc.expense += Number(t.amount) || 0;
      return acc;
    },
    { income: 0, expense: 0 }
  );
  const balance = totals.income - totals.expense;

  // monthly aggregation
  const monthlyMap = new Map();
  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const entry = monthlyMap.get(key) || { income: 0, expense: 0, key, date: new Date(d.getFullYear(), d.getMonth(), 1) };
    if (t.type === "income") entry.income += Number(t.amount) || 0;
    else entry.expense += Number(t.amount) || 0;
    monthlyMap.set(key, entry);
  });

  const labels = [];
  const incomeData = [];
  const expenseData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const m = monthlyMap.get(key) || { income: 0, expense: 0, date: new Date(d.getFullYear(), d.getMonth(), 1) };
    labels.push(m.date.toLocaleString(undefined, { month: "short", year: "numeric" }));
    incomeData.push(m.income);
    expenseData.push(m.expense);
  }

  const chartData = {
    labels,
    datasets: [
      { label: "Income", data: incomeData, tension: 0.3, fill: false, borderWidth: 2 },
      { label: "Expense", data: expenseData, tension: 0.3, fill: false, borderWidth: 2 },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#e6eef5" } },
    },
    scales: {
      x: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.04)" } },
      y: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.04)" } },
    },
  };

  // quick client-side demo seed
  async function seedDemoData() {
    setSeedLoading(true);
    setError(null);
    try {
      const cats = {
        cat_groceries: { name: "Groceries", type: "expense", color: "#F87171" },
        cat_salary: { name: "Salary", type: "income", color: "#34D399" },
      };
      for (const [id, obj] of Object.entries(cats)) {
        await setDoc(doc(db, "users", userId, "categories", id), obj);
      }
      await addDoc(collection(db, "users", userId, "transactions"), {
        amount: 5000,
        type: "expense",
        categoryId: "cat_groceries",
        note: "Demo seed tx",
        date: Timestamp.fromDate(new Date()),
        createdAt: Timestamp.now(),
      });

      const catSnap = await getDocs(collection(db, "users", userId, "categories"));
      const catMap = {};
      catSnap.forEach((d) => (catMap[d.id] = { id: d.id, ...d.data() }));
      setCategories(catMap);

      setSeedLoading(false);
      alert("Demo data seeded (categories + 1 transaction).");
    } catch (err) {
      console.error("seed error", err);
      setError(err.message || "Failed to seed demo data (permission?)");
      setSeedLoading(false);
    }
  }

  function handleAdded() {
    setTimeout(() => setLoading(false), 600);
  }

  // styles tuned to dark Purity UI theme (avoid big white blocks)
  const cardStyle = {
    padding: 14,
    borderRadius: 10,
    background: "rgba(255,255,255,0.03)", // subtle light overlay for dark theme
    color: "#F5E6E8FF",
    boxShadow: "none",
  };
  const panelStyle = {
    background: "transparent",
    position: "relative",
    zIndex: 1,
    color: "#e6eef5",
  };

  return (
    <div style={{ padding: 14, ...panelStyle }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0, color: "#e6eef5" }}>Finance</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => alert("Open console (Ctrl+Shift+J) if something appears blank.")}
            style={{ padding: "8px 10px", background: "transparent", color: "#e6eef5", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 6 }}
          >
            Debug tips
          </button>
          <button onClick={seedDemoData} disabled={seedLoading} style={{ padding: "8px 10px", borderRadius: 6 }}>
            {seedLoading ? "Seeding..." : "Load demo data"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "#3b0b0b", color: "#ffd6d2", padding: 10, borderRadius: 6, marginBottom: 12 }}>
          <strong>Error:</strong> {String(error)}
          <br />
          <small>If permission denied, publish the demo Firestore rule for <code>users/demoUser</code>.</small>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 12 }}>
        <div style={cardStyle}>
          <div style={{ color: "#a3b3c7", fontSize: 12 }}>Total Income</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>₦{totals.income.toLocaleString()}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: "#a3b3c7", fontSize: 12 }}>Total Expense</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>₦{totals.expense.toLocaleString()}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: "#a3b3c7", fontSize: 12 }}>Balance</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>₦{balance.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ ...cardStyle }}>
          <AddTransaction userId={userId} onAdded={handleAdded} />
        </div>
      </div>

      <div style={{ padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.02)", height: 320, marginBottom: 12 }}>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div style={{ padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>Recent Transactions</h3>
          <div style={{ color: "#a3b3c7", fontSize: 12 }}>{transactions.length} transactions</div>
        </div>

        {loading ? (
          <div style={{ color: "#e6eef5" }}>Loading transactions…</div>
        ) : transactions.length === 0 ? (
          <div style={{ color: "#e6eef5" }}>No transactions yet. Click <strong>Load demo data</strong> or use Add Transaction.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#e6eef5" }}>
            <thead>
              <tr style={{ color: "#a3b3c7" }}>
                <th style={{ padding: 8, textAlign: "left" }}>Date</th>
                <th style={{ padding: 8, textAlign: "left" }}>Note</th>
                <th style={{ padding: 8, textAlign: "left" }}>Category</th>
                <th style={{ padding: 8, textAlign: "left" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 20).map((tx) => (
                <tr key={tx.id} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: 8 }}>{new Date(tx.date).toLocaleDateString()}</td>
                  <td style={{ padding: 8 }}>{tx.note || "-"}</td>
                  <td style={{ padding: 8 }}>{(categories[tx.categoryId] && categories[tx.categoryId].name) || tx.categoryId || "Uncategorized"}</td>
                  <td style={{ padding: 8, fontWeight: 600, color: tx.type === "income" ? "#34D399" : "#ff7b7b" }}>
                    ₦{Number(tx.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

