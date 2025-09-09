// src/views/Tables/components/BudgetsOverview.jsx
import React from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Progress,
  Flex,
  Badge,
  Divider,
} from "@chakra-ui/react";

export default function BudgetsOverview({ title = "Budgets Overview", rows = [] }) {
  return (
    <Box mt={8} p={6} bg="rgba(255,255,255,0.02)" borderRadius="12px">
      <Heading size="md" mb={4}>{title}</Heading>

      {rows.length === 0 ? (
        <Text color="gray.300">No budgets yet. Use "Set Budget" on the dashboard to create one.</Text>
      ) : (
        <Stack spacing={6}>
          {rows.map((r) => (
            <Box key={r.id}>
              <Flex align="center" justify="space-between" mb={2}>
                <Flex align="center" gap={3}>
                  <Box>
                    <Text fontWeight="700" color="gray.200">{r.categoryName}</Text>
                    <Text fontSize="sm" color="gray.400">Limit: ₦{Number(r.limit).toLocaleString()}</Text>
                  </Box>
                </Flex>

                <Box textAlign="right">
                  <Text fontWeight="700">₦{Number(r.remaining).toLocaleString()}</Text>
                  <Text fontSize="sm" color="gray.400">Remaining</Text>
                </Box>
              </Flex>

              <Flex align="center" gap={4}>
                <Progress value={r.progress} size="sm" flex="1" borderRadius="8px" bg="rgba(255,255,255,0.03)" />
                <Badge colorScheme={r.progress >= 100 ? "red" : r.progress > 70 ? "orange" : "green"}>
                  {r.progress}% 
                </Badge>
              </Flex>

              <Divider mt={4} />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
