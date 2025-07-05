// Chakra imports
import { Flex, Grid, useColorModeValue } from "@chakra-ui/react";
import avatar15 from "assets/img/avatars/avatar15.jpeg";
import ProfileBgImage from "assets/img/ProfileBackground.png";
import React from "react";
import { FaChartPie, FaCreditCard } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import Conversations from "./components/Conversations";
import Header from "./components/Header";
import PlatformSettings from "./components/PlatformSettings";
import ProfileInformation from "./components/ProfileInformation";
import Projects from "./components/Projects";

function Profile() {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );

  return (
    <Flex direction="column">
      <Header
        backgroundHeader={ProfileBgImage}
        backgroundProfile={bgProfile}
        avatarImage={avatar15}
        name={"Collins Bright"}
        email={"collinsbright567@gmail.com"}
        tabs={[
          {
            name: "DASHBOARD",
            icon: <FaChartPie w="100%" h="100%" />,
          },
          {
            name: "TRANSACTIONS",
            icon: <FaCreditCard w="100%" h="100%" />,
          },
          {
            name: "REPORTS",
            icon: <IoDocumentText w="100%" h="100%" />,
          },
        ]}
      />

      <Grid templateColumns={{ sm: "1fr", xl: "repeat(3, 1fr)" }} gap="22px">
        <PlatformSettings
          title={"Account Settings"}
          subtitle1={"PROFILE"}
          subtitle2={"NOTIFICATIONS"}
        />
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
        <Conversations title={"Recent Notifications"} />
      </Grid>

      <Projects
        title={"Active Budgets"}
        description={"Ongoing financial plans and allocations"}
      />
    </Flex>
  );
}

export default Profile;
