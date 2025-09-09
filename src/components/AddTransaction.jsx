// src/components/AddTransaction.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";

export default function AddTransaction({ userId = "demoUser", onAdded }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [categoryId, setCategoryId] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [categories, setCategories] = useState([]);
  const toast = useToast();

  useEffect(() => {
    async function loadCats() {
      try {
        const snap = await getDocs(collection(db, "users", userId, "categories"));
        const arr = [];
        snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
        setCategories(arr);
        if (arr.length && !categoryId) setCategoryId(arr[0].id);
      } catch (err) {
        console.error("load cats", err);
      }
    }
    loadCats();
  }, [userId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) {
      toast({ title: "Invalid amount", status: "warning", duration: 2500 });
      return;
    }
    try {
      const payload = {
        amount: Number(amount),
        type,
        categoryId: categoryId || null,
        note: note || "",
        date: Timestamp.fromDate(new Date(date)),
        createdAt: Timestamp.now(),
      };
      await addDoc(collection(db, "users", userId, "transactions"), payload);
      setAmount("");
      setNote("");
      setType("expense");
      toast({ title: "Transaction added", status: "success", duration: 2000 });
      if (onAdded) onAdded();
    } catch (err) {
      console.error("add tx", err);
      toast({ title: "Error adding transaction", status: "error", description: err.message || "", duration: 3000 });
    }
  }

  return (
    <Box
      borderRadius="10px"
      p={4}
      bg="rgba(255,255,255,0.03)"     // subtle light card on dark bg
      color="whiteAlpha.900"
    >
      <form onSubmit={handleSubmit}>
        <FormControl mb={3}>
          <FormLabel color="gray.200" fontSize="sm">Amount</FormLabel>
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            bg="rgba(255,255,255,0.02)"
            color="whiteAlpha.900"
            _placeholder={{ color: "whiteAlpha.600" }}
          />
        </FormControl>

        <FormControl mb={3}>
          <FormLabel color="gray.200" fontSize="sm">Type</FormLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            bg="rgba(255,255,255,0.02)"
            color="whiteAlpha.900"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
        </FormControl>

        <FormControl mb={3}>
          <FormLabel color="gray.200" fontSize="sm">Category</FormLabel>
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            bg="rgba(255,255,255,0.02)"
            color="whiteAlpha.900"
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl mb={3}>
          <FormLabel color="gray.200" fontSize="sm">Date</FormLabel>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            bg="rgba(255,255,255,0.02)"
            color="whiteAlpha.900"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel color="gray.200" fontSize="sm">Note</FormLabel>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note"
            bg="rgba(255,255,255,0.02)"
            color="whiteAlpha.900"
            _placeholder={{ color: "whiteAlpha.600" }}
          />
        </FormControl>

        <Button type="submit" colorScheme="teal" size="sm">
          Add Transaction
        </Button>
      </form>
    </Box>
  );
}
