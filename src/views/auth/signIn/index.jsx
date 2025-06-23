import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/auth.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useLoginUserMutation } from "api/userSlice";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import Logo from "../../../assets/img/bio-logo.png";

function SignIn() {
  const { t, i18n } = useTranslation();
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loginUser, { isError, error: apiError }] = useLoginUserMutation();
  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData).unwrap();
      if (response) {
        localStorage.setItem("doctor_token", response.data.token);
        localStorage.setItem("doctor", JSON.stringify(response.data.doctor));
        navigate("/");
      }
    } catch (err) {
      setError(apiError?.data?.message || "Invalid credentials");
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error,
        confirmButtonText: "OK",
        onClose: () => {
          if (!isError) navigate("/");
        },
      });
    }
  };

  const handleClick = () => setShow(!show);

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "30px" }}
        px={{ base: "25px", md: "0px" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Flex mb="40px" justifyContent="center">
            <Image src={Logo} w="150px" />
          </Flex>
          <Flex gap={40} alignItems="center">
            <Heading color={textColor} fontSize="36px" mb="10px">
              {t('welcome')}
            </Heading>
            <Box>
              <select
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                  background: 'white',
                  color: '#222',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
                value={i18n.language}
                onChange={e => i18n.changeLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </Box>
          </Flex>
          <Text
            mb="50px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            {t('enterDetails')}
          </Text>
        </Box>
        <form onSubmit={handleSubmit}>
          <Flex
            zIndex="2"
            direction="column"
            w={{ base: "100%", md: "420px" }}
            maxW="100%"
            background="transparent"
            borderRadius="15px"
            mx={{ base: "auto", lg: "unset" }}
            me="auto"
            mb={{ base: "20px", md: "auto" }}
          >
            <FormControl>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
                mt={"30px"}
              >
                {t('email')}
                <Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                type="email"
                placeholder={t('emailPlaceholder')}
                mb="24px"
                fontWeight="500"
                size="lg"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                {t('password')}
                <Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md" mb="20px">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder={t('passwordPlaceholder')}
                  mb="24px"
                  size="lg"
                  type={show ? "text" : "password"}
                  variant="auth"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              <Flex justifyContent="space-between" align="center" mb="24px">
                <FormControl display="flex" alignItems="center">
                  <Checkbox
                    id="remember-login"
                    colorScheme="brandScheme"
                    me="10px"
                  />
                  <FormLabel
                    htmlFor="remember-login"
                    mb="0"
                    fontWeight="normal"
                    color={textColor}
                    fontSize="sm"
                  >
                    {t('rememberMe')}
                  </FormLabel>
                </FormControl>
              </Flex>
              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="30px"
                type="submit"
              >
                {t('signIn')}
              </Button>
            </FormControl>
          </Flex>
        </form>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;