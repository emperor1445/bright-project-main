// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
// import signInImage from "assets/img/BgSignUp.png";

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { loginUser } from "api";


function SignIn() {
  // Chakra color mode
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.400", "white");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();


  const handleLogin = async (e) => {
  e.preventDefault();
  if (!email || !password) {
    alert("Please fill all fields.");
    return;
  }
  try {
    const res = await loginUser({ email, password });
    localStorage.setItem("token", res.data.token);
    alert("Login successful!");
    history.push("/admin/dashboard");
  } catch (err) {
    alert(err.response?.data?.message || "Invalid credentials.");
  }
};

return (
  <Flex
    position='relative'
    minH='100vh'
    alignItems='center'
    justifyContent='center'
    px='4' // padding for smaller screens
  >
    <Flex
      direction='column'
      w={{ base: '100%', sm: '80%', md: '50%', lg: '40%' }} // responsive width
      background='transparent'
      p='48px'
      borderRadius='lg'
      boxShadow='lg'
    >
      <Heading color={titleColor} fontSize='22px' mb='10px' textAlign='center' marginTop={"50px"}>
        Welcome Back
      </Heading>
      <Text
        mb='36px'
        ms='4px'
        color={textColor}
        fontWeight='bold'
        fontSize='14px'
        textAlign='center'
      >
        Enter your email and password to sign in
      </Text>

      <FormControl>
        <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
          Email
        </FormLabel>
        <Input
          borderRadius='15px'
          mb='24px'
          fontSize='sm'
          type='text'
          placeholder='Your email address'
          size='lg'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
          Password
        </FormLabel>
        <Input
          borderRadius='15px'
          mb='36px'
          fontSize='sm'
          type='password'
          placeholder='Your password'
          size='lg'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <FormControl display='flex' alignItems='center' mb='20px'>
          <Switch id='remember-login' colorScheme='teal' me='10px' />
          <FormLabel
            htmlFor='remember-login'
            mb='0'
            ms='1'
            fontWeight='normal'>
            Remember me
          </FormLabel>
        </FormControl>

        <Button
          onClick={handleLogin}
          fontSize='sm'
          bg='teal.300'
          w='100%'
          h='45'
          color='white'
          _hover={{ bg: 'teal.200' }}
          _active={{ bg: 'teal.400' }}
        >
          SIGN IN
        </Button>
      </FormControl>
    </Flex>
  </Flex>
);


  
}

export default SignIn;
