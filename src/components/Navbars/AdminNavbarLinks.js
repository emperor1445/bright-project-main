// Chakra Icons
import { BellIcon, SearchIcon } from "@chakra-ui/icons";
// Chakra Imports
import {
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import avatar13 from "assets/img/avatars/avatar13.jpg";
import avatar11 from "assets/img/avatars/avatar11.jpg";
import avatar12 from "assets/img/avatars/avatar12.jpg";
// Custom Icons
import { ProfileIcon, SettingsIcon } from "components/Icons/Icons";
// Custom Components
import { ItemContent } from "components/Menu/ItemContent";
import SidebarResponsive from "components/Sidebar/SidebarResponsive";
import PropTypes from "prop-types";
import React from "react";
import { NavLink } from "react-router-dom";
import routes from "routes.js";

export default function HeaderLinks(props) {
  const { variant, children, fixed, secondary, onOpen, ...rest } = props;

  // Chakra Color Mode
  let mainTeal = useColorModeValue("teal.300", "teal.300");
  let inputBg = useColorModeValue("white", "gray.800");
  let mainText = useColorModeValue("gray.700", "gray.200");
  let navbarIcon = useColorModeValue("gray.500", "gray.200");
  let searchIcon = useColorModeValue("gray.700", "gray.200");

  if (secondary) {
    navbarIcon = "white";
    mainText = "white";
  }

  const settingsRef = React.useRef();

  return (
    <Flex
      pe={{ sm: "0px", md: "16px" }}
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
    >
      <InputGroup
        cursor="pointer"
        bg={inputBg}
        borderRadius="15px"
        w={{ sm: "128px", md: "200px" }}
        me={{ sm: "auto", md: "20px" }}
        _focus={{ borderColor: { mainTeal } }}
        _active={{ borderColor: { mainTeal } }}
      >
        <InputLeftElement
          children={
            <IconButton
              bg="inherit"
              borderRadius="inherit"
              _hover="none"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{ boxShadow: "none" }}
              icon={<SearchIcon color={searchIcon} w="15px" h="15px" />}
            />
          }
        />
        <Input
          fontSize="xs"
          py="11px"
          color={mainText}
          placeholder="Search transactions..."
          borderRadius="inherit"
        />
      </InputGroup>

      <NavLink to="">
        <Button
          ms="0px"
          px="0px"
          me={{ sm: "2px", md: "16px" }}
          color={navbarIcon}
          variant="transparent-with-icon"
          rightIcon={
            document.documentElement.dir
              ? ""
              : <ProfileIcon color={navbarIcon} w="22px" h="22px" me="0px" />
          }
          leftIcon={
            document.documentElement.dir
              ? <ProfileIcon color={navbarIcon} w="22px" h="22px" me="0px" />
              : ""
          }
        >
          <Text display={{ sm: "none", md: "flex" }}>Log in to Wallet</Text>
        </Button>
      </NavLink>

      <SidebarResponsive
        logoText={props.logoText}
        secondary={props.secondary}
        routes={routes}
        {...rest}
      />

      <SettingsIcon
        cursor="pointer"
        ms={{ base: "16px", xl: "0px" }}
        me="16px"
        ref={settingsRef}
        onClick={props.onOpen}
        color={navbarIcon}
        w="18px"
        h="18px"
      />

      <Menu>
        <MenuButton>
          <BellIcon color={navbarIcon} w="18px" h="18px" />
        </MenuButton>
        <MenuList p="16px 8px">
          <Flex flexDirection="column">
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="Just now"
                info="Incoming transfer"
                boldInfo="₦200,000 received"
                aName="Bank Transfer"
                aSrc={avatar13}
              />
            </MenuItem>
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="1 hour ago"
                info="Wallet balance updated"
                boldInfo="₦500,000 credited"
                aName="System"
                aSrc={avatar12}
              />
            </MenuItem>
            <MenuItem borderRadius="8px">
              <ItemContent
                time="Yesterday"
                info="Withdrawal to bank"
                boldInfo="₦50,000 sent"
                aName="GTBank"
                aSrc={avatar11}
              />
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
