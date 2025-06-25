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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
  const isRTL = i18n.language === 'ar';
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
      setError(apiError?.data?.message || t('invalidCredentials'));
      Swal.fire({
        icon: "error",
        title: t('loginFailed'),
        text: error,
        confirmButtonText: t('ok'),
        customClass: {
          popup: isRTL ? 'swal2-rtl' : ''
        },
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
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Box me="auto">
          <Flex mb="40px" justifyContent="center">
            <Image src={Logo} w="150px" />
          </Flex>
          <Flex gap={40} alignItems="center" direction={isRTL ? "rtl" : "ltr"}>
            <Heading color={textColor} fontSize="36px" mb="10px" textAlign={isRTL ? "right" : "left"}>
              {t('welcome')}
            </Heading>
            <Box>
              <Menu>
                <MenuButton 
                  as={Button}
                  variant="darkBrand"
                  fontWeight="500"
                  borderRadius="70px"
                  px="24px"
                  py="5px" 
                  color="white"
                  size="sm"
                  ml={isRTL ? 0 : 4}
                  mr={isRTL ? 4 : 0}
                  width={120}
                  leftIcon={<span>{i18n.language === 'ar' ? '🇸🇦' : '🇺🇸'}</span>}
                >
                  {i18n.language === 'ar' ? 'العربية' : 'English'}
                </MenuButton>
                <MenuList minW="120px" dir={isRTL ? "rtl" : "ltr"}>
                  <MenuItem 
                    icon={<span role="img" aria-label="English">🇺🇸</span>} 
                    onClick={() => i18n.changeLanguage('en')}
                    textAlign={isRTL ? "right" : "left"}
                  >
                    English
                  </MenuItem>
                  <MenuItem 
                    icon={<span role="img" aria-label="Arabic">🇸🇦</span>} 
                    onClick={() => i18n.changeLanguage('ar')}
                    textAlign={isRTL ? "right" : "left"}
                  >
                    العربية
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Flex>
          <Text
            mb="50px"
            ms={isRTL ? "0px" : "4px"}
            me={isRTL ? "4px" : "0px"}
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
            textAlign={isRTL ? "right" : "left"}
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
                ms={isRTL ? "0px" : "4px"}
                me={isRTL ? "4px" : "0px"}
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
                mt={"30px"}
                textAlign={isRTL ? "right" : "left"}
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
                dir={isRTL ? "rtl" : "ltr"}
              />
              <FormLabel
                ms={isRTL ? "0px" : "4px"}
                me={isRTL ? "4px" : "0px"}
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
                textAlign={isRTL ? "right" : "left"}
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
                  dir={isRTL ? "rtl" : "ltr"}
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
                <FormControl display="flex" alignItems="center" flexDirection={isRTL ? "row-reverse" : "row"}>
                  <Checkbox
                    id="remember-login"
                    colorScheme="brandScheme"
                    me={isRTL ? "0px" : "10px"}
                    ml={isRTL ? "10px" : "0px"}
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