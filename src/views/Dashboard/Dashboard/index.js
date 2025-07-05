// Chakra imports
import {
  Flex,
  Grid,
  Image,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// assets
import peopleImage from "assets/img/people-image.png";
import BarChart from "components/Charts/BarChart";
import LineChart from "components/Charts/LineChart";
// Custom icons
import {
  WalletIcon,
  CartIcon,
  DocumentIcon,
  GlobeIcon,
} from "components/Icons/Icons.js";
import React from "react";
import { dashboardTableData, timelineData } from "variables/general";
import ActiveUsers from "./components/ActiveUsers";
import MiniStatistics from "./components/MiniStatistics";
import OrdersOverview from "./components/OrdersOverview";
import Projects from "./components/Projects";
import SalesOverview from "./components/SalesOverview";

export default function Dashboard() {
  const iconBoxInside = useColorModeValue("white", "white");

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px">
        <MiniStatistics
          title={"Account Balance"}
          amount={"₦450,000"}
          percentage={12}
          icon={<WalletIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={"Total Expenses"}
          amount={"₦280,000"}
          percentage={-8}
          icon={<CartIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={"Total Income"}
          amount={"₦730,000"}
          percentage={18}
          icon={<DocumentIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={"Budget Utilization"}
          amount={"65% Used"}
          percentage={5}
          icon={<GlobeIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
      </SimpleGrid>

      <Grid
        templateColumns={{ md: "1fr", lg: "1.8fr 1.2fr" }}
        templateRows={{ md: "1fr auto", lg: "1fr" }}
        my="26px"
        gap="24px"
      >
        <SalesOverview
          title={"Monthly Cash Flow Overview"}
          percentage={6}
          chart={<LineChart />}
        />
        <ActiveUsers
          title={"Transaction Categories"}
          percentage={10}
          chart={<BarChart />}
        />
      </Grid>

      <Grid
        templateColumns={{ sm: "1fr", md: "1fr 1fr", lg: "2fr 1fr" }}
        templateRows={{ sm: "1fr auto", md: "1fr", lg: "1fr" }}
        gap="24px"
      >
        <Projects
          title={"Recent Transactions"}
          amount={15}
          captions={["Category", "", "Amount", "Progress"]}
          data={dashboardTableData}
        />
        <OrdersOverview
          title={"Financial Highlights"}
          amount={4}
          data={timelineData}
        />
      </Grid>
    </Flex>
  );
}
