// Chakra imports
import { Flex } from "@chakra-ui/react";
import React from "react";
import Authors from "./components/Authors";
import Projects from "./components/Projects";
import { tablesTableData, dashboardTableData } from "variables/general";

function Tables() {
  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      <Authors
        title={"Transactions Table"}
        captions={["Date", "Description", "Type", "Date", "Status"]}
        data={tablesTableData}
      />
      <Projects
        title={"Budgets Overview"}
        captions={["Category", "Limit", "", "Remaining", ""]}
        data={dashboardTableData}
      />
    </Flex>
  );
}

export default Tables;
