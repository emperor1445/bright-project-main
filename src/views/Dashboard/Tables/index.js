// src/views/Tables/index.js
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import TransactionsTable from "./components/TransactionsTable"; // existing
import BudgetsOverview from "./components/BudgetsOverview"; // new component
import { db } from "firebase"; // adjust if your firebase file is elsewhere
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

function Tables() {
  const userId = window.APP_USER_ID || "demoUser";

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]); // raw budget docs
  const [categories, setCategories] = useState({}); // map id -> {id, name, ...}
  const [rows, setRows] = useState([]); // computed rows for BudgetsOverview

  // subscribe transactions (realtime)
  useEffect(() => {
    if (!userId) return;
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
      },
      (err) => {
        console.error("transactions snapshot error", err);
      }
    );
    return () => unsub();
  }, [userId]);

  // subscribe budgets realtime
  useEffect(() => {
    if (!userId) return;
    const unsub = onSnapshot(collection(db, "users", userId, "budgets"), (snap) => {
      const arr = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setBudgets(arr);
    }, (err) => {
      console.error("budgets snapshot error", err);
    });
    return () => unsub();
  }, [userId]);

  // load categories (you can also subscribe if you want realtime)
  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    (async () => {
      try {
        const snap = await getDocs(collection(db, "users", userId, "categories"));
        const map = {};
        snap.forEach((d) => (map[d.id] = { id: d.id, ...d.data() }));
        if (mounted) setCategories(map);
      } catch (err) {
        console.error("load categories error", err);
      }
    })();
    return () => { mounted = false; };
  }, [userId]);

  // compute rows for BudgetsOverview whenever budgets / transactions / categories change
  useEffect(() => {
    // spent per category
    const spentByCategory = {};
    transactions.forEach((t) => {
      const cat = t.categoryId || "uncategorized";
      spentByCategory[cat] = (spentByCategory[cat] || 0) + Number(t.amount || 0);
    });

    const computed = budgets.map((b) => {
      const limit = Number(b.limit || 0);
      const spent = spentByCategory[b.categoryId] || 0;
      const remaining = Math.max(limit - spent, 0);
      const progress = limit > 0 ? Math.round((spent / limit) * 100) : 0;
      return {
        id: b.id,
        categoryId: b.categoryId,
        categoryName: (categories[b.categoryId] && categories[b.categoryId].name) || b.categoryId || "Uncategorized",
        limit,
        spent,
        remaining,
        progress: Math.max(0, Math.min(progress, 100)),
      };
    });

    setRows(computed);
  }, [budgets, transactions, categories]);

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <TransactionsTable />
      <BudgetsOverview title="Budgets Overview" rows={rows} />
    </Flex>
  );
}

export default Tables;
