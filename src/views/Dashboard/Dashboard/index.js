// src/views/Dashboard/index.js
// Chakra imports
import React, { useEffect, useState, useCallback } from "react";
import {
  Flex,
  Grid,
  SimpleGrid,
  useColorModeValue,
  Box,
  Heading,
  Text,
  Spinner,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stack,
  Progress,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

// firebase (adjust this relative path if your firebase.js sits elsewhere)
import { db } from "firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  addDoc,
  setDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

import AddTransaction from "components/AddTransaction"; // ensure this exists
import AddBudget from "components/AddBudget"; // ensure you created this file

// icons (keep as original)
import {
  WalletIcon,
  CartIcon,
  DocumentIcon,
  GlobeIcon,
} from "components/Icons/Icons.js";

// chart
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

export default function Dashboard() {
  // chakra color mode
  const iconBoxInside = useColorModeValue("white", "white");

  // states
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState({});
  const [totals, setTotals] = useState({ income: 0, expense: 0 });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [error, setError] = useState(null);
  const [highlights, setHighlights] = useState([]);

  // budgets
  const [budgets, setBudgets] = useState([]); // array of { id, categoryId, limit, createdAt }
  const [budgetUtilPercent, setBudgetUtilPercent] = useState("N/A");
  const [budgetAlerts, setBudgetAlerts] = useState([]); // list of {categoryId, spent, limit}

  // local UI dismiss state for alerts (client-only)
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const userId = window.APP_USER_ID || "demoUser";

  // compute totals and chart from transactions
  const computeMetrics = useCallback(
    (txs) => {
      // totals
      const totalsCalc = txs.reduce(
        (acc, t) => {
          if (t.type === "income") acc.income += Number(t.amount) || 0;
          else acc.expense += Number(t.amount) || 0;
          return acc;
        },
        { income: 0, expense: 0 }
      );
      setTotals(totalsCalc);

      // monthly aggregation last 12 months
      const monthlyMap = new Map();
      txs.forEach((t) => {
        const d = new Date(t.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const entry = monthlyMap.get(key) || { income: 0, expense: 0, date: new Date(d.getFullYear(), d.getMonth(), 1) };
        if (t.type === "income") entry.income += Number(t.amount) || 0;
        else entry.expense += Number(t.amount) || 0;
        monthlyMap.set(key, entry);
      });

      // last 12 months labels
      const labels = [];
      const incomeData = [];
      const expenseData = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const m = monthlyMap.get(key) || { income: 0, expense: 0, date: new Date(d.getFullYear(), d.getMonth(), 1) };
        labels.push(m.date.toLocaleString(undefined, { month: "short", year: "numeric" }));
        incomeData.push(m.income);
        expenseData.push(m.expense);
      }

      setChartData({
        labels,
        datasets: [
          { label: "Income", data: incomeData, tension: 0.3, borderWidth: 2, backgroundColor: "rgba(52,211,153,0.1)", borderColor: "#34D399" },
          { label: "Expense", data: expenseData, tension: 0.3, borderWidth: 2, backgroundColor: "rgba(255,139,139,0.08)", borderColor: "#FF7B7B" },
        ],
      });
    },
    [setTotals, setChartData]
  );

  // realtime subscription to transactions (and load categories once)
  useEffect(() => {
    if (!userId) {
      setError("No userId found (set window.APP_USER_ID)");
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);

    // load categories once
    (async () => {
      try {
        const catSnap = await getDocs(collection(db, "users", userId, "categories"));
        const catMap = {};
        catSnap.forEach((d) => (catMap[d.id] = { id: d.id, ...d.data() }));
        setCategories(catMap);
      } catch (err) {
        console.error("Error loading categories", err);
      }
    })();

    const q = query(collection(db, "users", userId, "transactions"), orderBy("date", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = [];
        snap.forEach((d) => {
          const data = d.data();
          // normalize date
          let parsedDate = new Date();
          if (data.date && typeof data.date.toDate === "function") parsedDate = data.date.toDate();
          else if (data.date && data.date.seconds) parsedDate = new Date(data.date.seconds * 1000);
          else if (typeof data.date === "string") parsedDate = new Date(data.date);
          else if (typeof data.date === "number") parsedDate = new Date(data.date);
          else if (data.date instanceof Date) parsedDate = data.date;
          docs.push({ id: d.id, ...data, date: parsedDate });
        });

        setTransactions(docs);
        computeMetrics(docs);
        setLoading(false);
      },
      (err) => {
        console.error("onSnapshot error", err);
        setError(err.message || "Realtime subscription failed. Check Firestore rules.");
        setLoading(false);
      }
    );

    return () => unsub();
  }, [userId, computeMetrics]);

  // subscribe budgets realtime
  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, "users", userId, "budgets"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = [];
        snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
        setBudgets(arr);
      },
      (err) => {
        console.error("budgets snapshot error", err);
      }
    );
    return () => unsub();
  }, [userId]);

  // Compute utilization and alerts whenever transactions or budgets change
  useEffect(() => {
    if (!budgets || budgets.length === 0) {
      setBudgetUtilPercent("N/A");
      setBudgetAlerts([]);
      return;
    }

    // compute spent per category from current transactions
    const spentByCategory = {};
    transactions.forEach((t) => {
      const cat = t.categoryId || "uncategorized";
      spentByCategory[cat] = (spentByCategory[cat] || 0) + Number(t.amount || 0);
    });

    // compute percent used for each budget
    let totalLimit = 0;
    let totalUsed = 0;
    const alerts = [];
    budgets.forEach((b) => {
      const limit = Number(b.limit || 0);
      totalLimit += limit;
      const spent = spentByCategory[b.categoryId] || 0;
      totalUsed += Math.min(spent, limit); // cap used at limit for total used
      // mark alert if over budget
      if (spent > limit) alerts.push({ categoryId: b.categoryId, spent, limit });
    });

    const percent = totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : "N/A";
    setBudgetUtilPercent(percent === "N/A" ? "N/A" : `${percent}%`);
    setBudgetAlerts(alerts);
  }, [transactions, budgets]);

  // quick client-side seed (can be triggered by AdminNavbar)
  const seedDemoData = useCallback(
    async () => {
      try {
        // categories
        const cats = {
          cat_groceries: { name: "Groceries", type: "expense", color: "#F87171" },
          cat_salary: { name: "Salary", type: "income", color: "#34D399" },
          cat_transport: { name: "Transport", type: "expense", color: "#60A5FA" },
        };
        for (const [id, obj] of Object.entries(cats)) {
          await setDoc(doc(db, "users", userId, "categories", id), obj);
        }

        // sample txs
        const sample = [
          { amount: 150000, type: "income", categoryId: "cat_salary", note: "Demo salary", date: Timestamp.fromDate(new Date()), createdAt: Timestamp.now() },
          { amount: 5000, type: "expense", categoryId: "cat_groceries", note: "Market run", date: Timestamp.fromDate(new Date()), createdAt: Timestamp.now() },
          { amount: 1200, type: "expense", categoryId: "cat_transport", note: "Taxi", date: Timestamp.fromDate(new Date()), createdAt: Timestamp.now() },
        ];
        for (const tx of sample) {
          await addDoc(collection(db, "users", userId, "transactions"), tx);
        }

        // refresh categories local
        const catSnap = await getDocs(collection(db, "users", userId, "categories"));
        const catMap = {};
        catSnap.forEach((d) => (catMap[d.id] = { id: d.id, ...d.data() }));
        setCategories(catMap);

        // notify
        alert("Demo data seeded into Firestore for user: " + userId);
      } catch (err) {
        console.error("Seed error", err);
        alert("Seeding failed: " + (err.message || err));
      }
    },
    [userId]
  );

  // listen for global seed event (AdminNavbar will dispatch this)
  useEffect(() => {
    function onSeed() {
      seedDemoData();
    }
    window.addEventListener("seed-demo", onSeed);
    return () => window.removeEventListener("seed-demo", onSeed);
  }, [seedDemoData]);

  // Chart options (dark-friendly)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#cbd5e1" } } },
    scales: { x: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.03)" } }, y: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.03)" } } },
  };

  // formatted helpers
  const fmt = (v) => `₦${Number(v).toLocaleString()}`;

  // helper to dismiss an alert locally
  const dismissAlert = (categoryId) => {
    setDismissedAlerts((s) => [...s, categoryId]);
  };

  // visible alerts (filter dismissed)
  const visibleAlerts = budgetAlerts.filter(a => !dismissedAlerts.includes(a.categoryId));

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      {/* Top cards */}
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px" mb="18px">
        <Box p="18px" bg="rgba(255,255,255,0.02)" borderRadius="12px">
          <Stack spacing={1}>
            <Text fontSize="sm" color="gray.300">Account Balance</Text>
            <Heading size="md">{fmt(totals.income - totals.expense)}</Heading>
            <Text fontSize="sm" color="green.300"> {totals.income - totals.expense >= 0 ? "+": ""} </Text>
          </Stack>
        </Box>

        <Box p="18px" bg="rgba(255,255,255,0.02)" borderRadius="12px">
          <Stack spacing={1}>
            <Text fontSize="sm" color="gray.300">Total Expenses</Text>
            <Heading size="md">{fmt(totals.expense)}</Heading>
          </Stack>
        </Box>

        <Box p="18px" bg="rgba(255,255,255,0.02)" borderRadius="12px">
          <Stack spacing={1}>
            <Text fontSize="sm" color="gray.300">Total Income</Text>
            <Heading size="md">{fmt(totals.income)}</Heading>
          </Stack>
        </Box>

        {/* kept compact: no alerts inside this box */}
        <Box p="18px" bg="rgba(255,255,255,0.02)" borderRadius="12px">
          <Stack spacing={1} direction="row" align="center" justify="space-between">
            <Box>
              <Text fontSize="sm" color="gray.300">Budget Utilization</Text>
              <Heading size="md">{budgetUtilPercent}</Heading>
            </Box>

            <Box>
              <AddBudget userId={userId} onSaved={() => { /* subscription updates UI */ }} />
            </Box>
          </Stack>
        </Box>
      </SimpleGrid>

      {/* NEW: Alerts panel (separate so top cards don't stretch) */}
      {visibleAlerts.length > 0 && (
        <Box mb={6} p={4} borderRadius="10px" bg="rgba(255,0,0,0.04)">
          <HStack justify="space-between" align="center" mb={3}>
            <Heading size="sm" color="red.300">Budget alerts</Heading>
            <Button size="sm" variant="ghost" onClick={() => setDismissedAlerts(visibleAlerts.map(a => a.categoryId))}>Dismiss all</Button>
          </HStack>

          <Stack spacing={2}>
            {visibleAlerts.map(a => {
              const catName = (categories[a.categoryId] && categories[a.categoryId].name) || a.categoryId || "Uncategorized";
              return (
                <Box key={a.categoryId} p={3} bg="rgba(255,0,0,0.02)" borderRadius="8px" display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Text fontSize="sm" color="red.200" fontWeight="600">{catName}</Text>
                    <Text fontSize="sm" color="red.100">₦{Number(a.spent).toLocaleString()} of ₦{Number(a.limit).toLocaleString()}</Text>
                  </Box>

                  <HStack spacing={3}>
                    <Text fontSize="sm" color="red.200">{Math.round((a.spent / a.limit) * 100)}%</Text>
                    <IconButton
                      aria-label="Dismiss alert"
                      size="sm"
                      icon={<CloseIcon />}
                      onClick={() => dismissAlert(a.categoryId)}
                      variant="ghost"
                    />
                  </HStack>
                </Box>
              );
            })}
          </Stack>
        </Box>
      )}

      {/* Chart and categories */}
      <Grid templateColumns={{ md: "1fr", lg: "1.8fr 1.2fr" }} gap="24px" mb="24px">
        <Box p="18px" bg="rgba(255,255,255,0.02)" borderRadius="12px" minH="320px">
          <Heading size="md" mb={2}>Monthly Cash Flow Overview</Heading>
          {loading ? <Spinner /> : <Box style={{ height: 300 }}><Line data={chartData} options={chartOptions} /></Box>}
        </Box>

        <Box p="18px" bg="rgba(255,255,255,0.02)" borderRadius="12px">
          <Heading size="md" mb={2}>Transaction Categories</Heading>
          {/* Simple category list with totals */}
          <Stack spacing={3}>
            {Object.keys(categories).length === 0 ? (
              <Text color="gray.300">No categories yet — Load demo data.</Text>
            ) : (
              Object.values(categories).map((c) => {
                // compute category total
                const catTotal = transactions.filter((t) => t.categoryId === c.id).reduce((s, t) => s + Number(t.amount || 0), 0);
                return (
                  <Box key={c.id} display="flex" justifyContent="space-between">
                    <Text color="gray.200">{c.name}</Text>
                    <Text fontWeight="600">{fmt(catTotal)}</Text>
                  </Box>
                );
              })
            )}
          </Stack>
        </Box>
      </Grid>

      {/* Recent transactions (full width) */}
      <Grid templateColumns={{ sm: "1fr" }} gap="24px">
        <Box p="18px" bg="rgba(255,255,255,0.02)" borderRadius="12px" width="100%">
          <Heading size="md" mb={4} color="gray.100">Recent Transactions</Heading>

          {/* Add transaction form */}
          <Box mb={4}>
            <AddTransaction userId={userId} onAdded={() => {}} />
          </Box>

          {/* transactions table */}
          <TableContainer>
            <Table variant="simple" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Note</Th>
                  <Th>Category</Th>
                  <Th isNumeric>Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions.length === 0 ? (
                  <Tr><Td colSpan={4}>No transactions yet — try <Button size="sm" onClick={() => window.dispatchEvent(new CustomEvent("seed-demo"))}>Load demo data</Button></Td></Tr>
                ) : transactions.slice(0, 20).map((t) => (
                  <Tr key={t.id}>
                    <Td>{new Date(t.date).toLocaleDateString()}</Td>
                    <Td>{t.note || "-"}</Td>
                    <Td>{(categories[t.categoryId] && categories[t.categoryId].name) || t.categoryId || "Uncategorized"}</Td>
                    <Td isNumeric fontWeight="600" color={t.type === "income" ? "green.300" : "red.300"}>{`₦${Number(t.amount).toLocaleString()}`}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
    </Flex>
  );
}
