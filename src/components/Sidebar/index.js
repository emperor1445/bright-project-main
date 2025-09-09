import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import SidebarContent from "./SidebarContent";

function Sidebar(props) {
  const mainPanel = React.useRef();
  let variantChange = "0.2s linear";

  const { logoText, routes, sidebarVariant } = props;

  // ✅ Always call hooks at the top (not inside if)
  const opaqueBg = useColorModeValue("white", "gray.700");
  const defaultBg = "none";

  // Default values
  let sidebarBg = defaultBg;
  let sidebarRadius = "0px";
  let sidebarMargins = "0px";

  // Apply styles conditionally without moving hook inside
  if (sidebarVariant === "opaque") {
    sidebarBg = opaqueBg;
    sidebarRadius = "16px";
    sidebarMargins = "16px 0px 16px 16px";
  }

  return (
    <Box ref={mainPanel}>
      <Box display={{ sm: "none", xl: "block" }} position="fixed">
        <Box
          bg={sidebarBg}
          transition={variantChange}
          w="260px"
          maxW="260px"
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          h="calc(100vh - 32px)"
          ps="20px"
          pe="20px"
          m={sidebarMargins}
          borderRadius={sidebarRadius}
        >
          <SidebarContent
            routes={routes}
            logoText={logoText || "Dashboard"}
            display="none"
            sidebarVariant={sidebarVariant}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
