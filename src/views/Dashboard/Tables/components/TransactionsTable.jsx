// src/views/Tables/components/TransactionsTable.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Text,
  Flex,
  Tag,
} from "@chakra-ui/react";

import { db } from "firebase";
import { collection, query, orderBy, onSnapshot, getDocs } from "firebase/firestore";

export default function TransactionsTable({ userIdProp }) {
  const userId = userIdProp || window.APP_USER_ID || "demoUser";
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // load categories once
  useEffect(() => {
    let mounted = true;
    async function loadCats() {
      try {
        const snap = await getDocs(collection(db, "users", userId, "categories"));
        if (!mounted) return;
        const map = {};
        snap.forEach((d) => (map[d.id] = { id: d.id, ...d.data() }));
        setCategories(map);
      } catch (err) {
        console.error("loadCats", err);
      }
    }
    loadCats();
    return () => { mounted = false; };
  }, [userId]);

  // realtime transactions
  useEffect(() => {
    setLoading(true);
    setError(null);
    const q = query(collection(db, "users", userId, "transactions"), orderBy("date", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = [];
        snap.forEach((d) => {
          const data = d.data();
          // normalize date to JS Date
          let parsedDate = new Date();
          if (data.date && typeof data.date.toDate === "function") parsedDate = data.date.toDate();
          else if (data.date && data.date.seconds) parsedDate = new Date(data.date.seconds * 1000);
          else if (typeof data.date === "string") parsedDate = new Date(data.date);
          else if (typeof data.date === "number") parsedDate = new Date(data.date);
          else if (data.date instanceof Date) parsedDate = data.date;
          docs.push({
            id: d.id,
            amount: Number(data.amount || 0),
            type: data.type || "expense",
            note: data.note || "",
            categoryId: data.categoryId || null,
            date: parsedDate,
            raw: data,
          });
        });
        setTransactions(docs);
        setLoading(false);
      },
      (err) => {
        console.error("onSnapshot transactions error", err);
        setError(err.message || "Failed to subscribe");
        setLoading(false);
      }
    );

    return () => unsub();
  }, [userId]);

  const fmtCurrency = (v) => `₦${Number(v || 0).toLocaleString()}`;

  if (loading) {
    return (
      <Flex align="center" justify="center" py={8}>
        <Spinner />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="red.900" borderRadius="8px">
        <Text color="white">Error loading transactions: {error}</Text>
      </Box>
    );
  }

  return (
    <Box bg="transparent" borderRadius="8px" overflowX="auto">
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Description</Th>
              <Th>Category</Th>
              <Th>Type</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.length === 0 ? (
              <Tr>
                <Td colSpan={5}>
                  <Text color="gray.300">No transactions yet. Click "Load demo data" to seed sample records.</Text>
                </Td>
              </Tr>
            ) : (
              transactions.map((t) => (
                <Tr key={t.id} _hover={{ bg: "rgba(255,255,255,0.02)" }}>
                  <Td whiteSpace="nowrap">{t.date.toLocaleDateString()}</Td>
                  <Td>{t.note || "-"}</Td>
                  <Td>{(categories[t.categoryId] && categories[t.categoryId].name) || t.categoryId || "Uncategorized"}</Td>
                  <Td>
                    <Tag size="sm" colorScheme={t.type === "income" ? "green" : "red"}>
                      {t.type}
                    </Tag>
                  </Td>
                  <Td isNumeric fontWeight="600">{fmtCurrency(t.amount)}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
