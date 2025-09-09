// src/components/AddBudget.jsx
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { db } from "firebase"; // adjust path if needed
import { collection, addDoc, setDoc, doc, getDocs, Timestamp } from "firebase/firestore";

export default function AddBudget({ userId = window.APP_USER_ID || "demoUser", onSaved }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const toast = useToast();

  useEffect(() => {
    async function loadCats() {
      try {
        const snap = await getDocs(collection(db, "users", userId, "categories"));
        const arr = [];
        snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
        setCategories(arr);
        if (arr.length) setCategory(arr[0].id);
      } catch (err) {
        console.error("load categories", err);
      }
    }
    loadCats();
  }, [userId]);

  async function handleSave() {
    if (!category) {
      toast({ title: "Pick a category", status: "warning", duration: 2000 });
      return;
    }
    const num = Number(limit);
    if (!num || num <= 0) {
      toast({ title: "Enter a valid limit", status: "warning", duration: 2000 });
      return;
    }
    try {
      // Upsert: create a new budget doc; you can modify to use setDoc(doc(..., budgetId), ...) to enforce custom id.
      await addDoc(collection(db, "users", userId, "budgets"), {
        categoryId: category,
        limit: num,
        createdAt: Timestamp.now(),
      });
      toast({ title: "Budget saved", status: "success", duration: 2000 });
      setLimit("");
      onClose();
      if (onSaved) onSaved();
    } catch (err) {
      console.error("save budget", err);
      toast({ title: "Save failed", status: "error", description: err.message });
    }
  }

  return (
    <>
      <Button size="sm" colorScheme="teal" onClick={onOpen}>
        Set Budget
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader>Set a Budget</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Category</FormLabel>
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.length === 0 ? <option value="">No categories</option> :
                  categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Limit (₦)</FormLabel>
              <Input value={limit} onChange={(e) => setLimit(e.target.value.replace(/[^\d]/g,''))} placeholder="e.g. 250000" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="teal" onClick={handleSave}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
