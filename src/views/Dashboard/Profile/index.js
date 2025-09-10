// src/views/Profile/index.js
import React from "react";
import {
  Flex,
  Grid,
  useColorModeValue,
  Box,
  HStack,
  Button,
  Center,
  Container,
} from "@chakra-ui/react";
import avatar15 from "assets/img/avatars/avatar15.jpeg";
import ProfileBgImage from "assets/img/ProfileBackground.png";
import { FaChartPie, FaCreditCard } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import Conversations from "./components/Conversations";
import Header from "./components/Header";
import PlatformSettings from "./components/PlatformSettings";
import ProfileInformation from "./components/ProfileInformation";
import Projects from "./components/Projects";

import { useHistory, useLocation } from "react-router-dom";

function Profile() {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );

  const history = useHistory();
  const location = useLocation();

  // helper to check active tab
  const isActive = (path) => {
    // exact match for profile, prefix for dashboard & reports
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <Flex direction="column">
      <Header
        backgroundHeader={ProfileBgImage}
        backgroundProfile={bgProfile}
        avatarImage={avatar15}
        name={"Collins Bright"}
        email={"collinsbright567@gmail.com"}

      />

      {/* Nav tabs under header — navigates to pages */}
      <Center mt={4}>
        <HStack spacing={3}>
          <Button
            leftIcon={<FaChartPie />}
            variant={isActive("/admin/profile") ? "solid" : "ghost"}
            colorScheme={isActive("/admin/profile") ? "teal" : "gray"}
            onClick={() => history.push("/admin/profile")}
          >
            PROFILE
          </Button>

          <Button
            leftIcon={<FaCreditCard />}
            variant={isActive("/admin/dashboard") ? "solid" : "ghost"}
            colorScheme={isActive("/admin/dashboard") ? "teal" : "gray"}
            onClick={() => history.push("/admin/dashboard")}
          >
            DASHBOARD
          </Button>

          <Button
            leftIcon={<IoDocumentText />}
            variant={isActive("/admin/reports") ? "solid" : "ghost"}
            colorScheme={isActive("/admin/reports") ? "teal" : "gray"}
            onClick={() => history.push("/admin/reports")}
          >
            REPORT
          </Button>
        </HStack>
      </Center>

      {/* Main content: make ProfileInformation full-width and centered */}
      <Container maxW="container.xl" px={{ base: 4, md: 6 }} mt={6}>
        <Grid templateColumns={{ sm: "1fr" }} gap="22px">
          <Box w="100%">
            <ProfileInformation
              title={"User Information"}
              description={
                "Hi, I’m Collins Bright — and this is my demo financial management dashboard, built by Opia Prosper from Kings Tech Studio. Here you can monitor transactions, manage personal and business budgets, and view financial reports all in one place."
              }
              name={"Collins Bright"}
              mobile={"+234 902 318 1607"}
              email={"collinsbright567@gmail.com"}
              location={"Nigeria"}
            />
          </Box>
        </Grid>
      </Container>
    </Flex>
  );
}

export default Profile;
// src/views/Profile/index.