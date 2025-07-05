// Chakra imports
import {
  Avatar,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets

import avatar11 from "assets/img/avatars/avatar11.jpg";
import avatar12 from "assets/img/avatars/avatar12.jpg";
import avatar14 from "assets/img/avatars/avatar14.jpg";
import avatar13 from "assets/img/avatars/avatar13.jpg";


// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React from "react";

const Conversations = ({ title }) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");

  const transactions = [
    {
      avatar: avatar14,
      name: "UBA Bank",
      message: "₦50,000 credited to your savings account.",
    },
    {
      avatar: avatar14,
      name: "Paystack Payment",
      message: "₦12,500 payment received from client invoice #1223.",
    },
    {
      avatar: avatar12,
      name: "Wallet Topup",
      message: "₦30,000 added to your KingP Wallet.",
    },
    {
      avatar: avatar13,
      name: "Airtime Recharge",
      message: "₦2,000 deducted for MTN airtime purchase.",
    },
    {
      avatar: avatar11,
      name: "Tax Payment",
      message: "₦10,000 tax payment processed successfully.",
    },
  ];

  return (
    <Card p="16px">
      <CardHeader p="12px 5px" mb="12px">
        <Text fontSize="lg" color={textColor} fontWeight="bold">
          {title}
        </Text>
      </CardHeader>
      <CardBody px="5px">
        <Flex direction="column" w="100%">
          {transactions.map((item, index) => (
            <Flex justifyContent="space-between" mb="21px" key={index}>
              <Flex align="center">
                <Avatar
                  src={item.avatar}
                  w="50px"
                  h="50px"
                  borderRadius="15px"
                  me="10px"
                />
                <Flex direction="column">
                  <Text fontSize="sm" color={textColor} fontWeight="bold">
                    {item.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500" fontWeight="400">
                    {item.message}
                  </Text>
                </Flex>
              </Flex>
              <Button p="0px" bg="transparent" variant="no-hover">
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="teal.300"
                  alignSelf="center"
                >
                  VIEW
                </Text>
              </Button>
            </Flex>
          ))}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default Conversations;
