/*eslint-disable*/
import React from "react";
import { Flex, Link, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex
      flexDirection={{
        base: "column",
        xl: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent="space-between"
      px="30px"
      pb="20px"
    >
      <Text
        color="gray.400"
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", xl: "0px" }}
      >
        &copy; {new Date().getFullYear()}, Made with ❤️ by{" "}
        <Text as="span" color="teal.400">
          Opia Prosper
        </Text>{" "}
        form{" "}
        <Text as="span" color="teal.400">
          Kings Tech Studio
        </Text>
      </Text>

      <Flex>
        <Link
          color="gray.400"
          href="https://github.com/emperor1445"
          target="_blank"
          me="20px"
        >
          GitHub
        </Link>
        <Link
          color="gray.400"
          href="#"
          target="_blank"
        >
          Project Docs
        </Link>
      </Flex>
    </Flex>
  );
}
