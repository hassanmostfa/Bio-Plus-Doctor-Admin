import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Textarea,
  Text,
  useColorModeValue,
  Icon,
  Switch,
  FormControl,
  FormLabel,
  Select,
  Image,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
  HStack,
  Avatar,
  IconButton,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react';
import { FaUpload, FaTrash, FaPlus } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import { IoMdArrowBack } from 'react-icons/io';
import { EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useGetDoctorProfileQuery, useUpdateDoctorProfileMutation } from 'api/doctorSlice';
import { useGetSpecializationsQuery } from 'api/doctorSpecializationSlice';
import Swal from 'sweetalert2';
import { useAddFileMutation } from 'api/filesSlice';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../components/auth/LanguageContext';

const Profile = () => {
  // State declarations first
  const [specializationSearch, setSpecializationSearch] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    imageKey: '',
    clinicFees: '',
    onlineFees: '',
    hasClinicConsult: true,
    hasOnlineConsult: true,
    aboutEn: '',
    aboutAr: '',
    languages: [],
    gender: 'MALE',
    title: 'CONSULTANT',
    specializationId: '',
    phones: [],
    certificates: [],
  });
  const [languages, setLanguages] = useState([{ language: '' }]);
  const [phones, setPhones] = useState([{ phoneNumber: '' }]);
  const [image, setImage] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Hook calls after state declarations
  const { data: doctorProfile, isLoading, error, refetch } = useGetDoctorProfileQuery();
  const [updateDoctorProfile, { isLoading: isUpdating }] = useUpdateDoctorProfileMutation();
  const { data: specializationsResponse } = useGetSpecializationsQuery({
    search: specializationSearch,
    limit: 50
  });
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const specializations = specializationsResponse?.data || [];
  const [addFile] = useAddFileMutation();

  // Color mode values
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const inputBorder = useColorModeValue('gray.300', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const dropZoneBg = useColorModeValue('gray.50', 'gray.800');
  const dropZoneBorder = useColorModeValue('gray.300', 'gray.600');
  const dropZoneActiveBorder = useColorModeValue('brand.500', 'brand.200');
  const dropZoneActiveBg = useColorModeValue('brand.50', 'brand.900');

  useEffect(() => {
    refetch();
  }, []);

  // Initialize form with existing data
  useEffect(() => {
    if (doctorProfile?.data) {
      const doctor = doctorProfile.data;
      setFormData({
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        imageKey: doctor.imageKey,
        clinicFees: doctor.clinicFees,
        onlineFees: doctor.onlineFees,
        hasClinicConsult: doctor.hasClinicConsult,
        hasOnlineConsult: doctor.hasOnlineConsult,
        aboutEn: doctor.aboutEn,
        aboutAr: doctor.aboutAr,
        languages: doctor.languages,
        gender: doctor.gender,
        title: doctor.title,
        specializationId: doctor.specializationId,
        phones: doctor.phones,
        certificates: doctor.certificates,
      });

      setPhones(doctor.phones.map((phone) => ({ phoneNumber: phone.phoneNumber })));
      setLanguages(doctor.languages.map((lang) => ({ language: lang })));
      setSelectedSpecialization(doctor.specialization);
      
      if (doctor.imageKey) {
        setImage(doctor.imageKey);
      }
      
      setCertificates(doctor.certificates?.map((cert) => ({
        imageKey: cert.imageKey,
        id: cert.id,
      })) || []);
    }
  }, [doctorProfile]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle number input key down to prevent minus sign
  const handleNumberInputKeyDown = (e) => {
    if (e.key === '-') {
      e.preventDefault();
    }
  };

  // Handle toggle switches
  const handleToggle = (field) => {
    setFormData({
      ...formData,
      [field]: !formData[field],
    });
  };

  // Image upload handlers
  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setImage(selectedFile);
      setFormData((prev) => ({
        ...prev,
        imageKey: selectedFile.name,
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleFileInputChange = (e) => {
    handleImageUpload(e.target.files);
  };

  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newCertificates = files.map((file) => ({
        imageKey: file,
      }));
      setCertificates([...certificates, ...newCertificates]);
    }
  };

  // Phone number handlers
  const handleAddPhone = () => {
    setPhones([...phones, { phoneNumber: '' }]);
  };

  const handlePhoneChange = (index, value) => {
    // Only allow digits and limit to 8 characters
    const numericValue = value.replace(/\D/g, '').slice(0, 8);
    const newPhones = [...phones];
    newPhones[index].phoneNumber = numericValue;
    setPhones(newPhones);
  };

  const handleDeletePhone = (index) => {
    const newPhones = phones.filter((_, i) => i !== index);
    setPhones(newPhones);
  };

  // Language handlers
  const handleAddLanguage = () => {
    setLanguages([...languages, { language: '' }]);
  };

  const handleLanguageChange = (index, field, value) => {
    const newLanguages = [...languages];
    newLanguages[index][field] = value;
    setLanguages(newLanguages);
  };

  const handleDeleteLanguage = (index) => {
    const newLanguages = languages.filter((_, i) => i !== index);
    setLanguages(newLanguages);
  };


  // Certificate handlers
  const handleDeleteCertificate = (index) => {
    const newCertificates = certificates.filter((_, i) => i !== index);
    setCertificates(newCertificates);
  };

  // Specialization search handlers
  const handleSpecializationSearch = (value) => {
    setSpecializationSearch(value);
  };

  const handleSpecializationSelect = (specialization) => {
    setSelectedSpecialization(specialization);
    setFormData({
      ...formData,
      specializationId: specialization.id,
    });
    setSpecializationSearch('');
  };

  // Removed edit/cancel handlers - form is always editable

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone numbers
    const invalidPhones = phones.filter(phone => phone.phoneNumber.length !== 8);
    if (invalidPhones.length > 0) {
      toast({
        title: t('doctors.error'),
        description: t('doctors.phoneNumberMustBe8Digits'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      let imageKey = formData.imageKey;
      let uploadedCertificates = [];

      // Upload doctor image if a new one is selected
      if (image && typeof image !== 'string') {
        const formDataFile = new FormData();
        formDataFile.append('file', image);

        const uploadResponse = await addFile(formDataFile).unwrap();

        if (uploadResponse.success && uploadResponse.data.uploadedFiles.length > 0) {
          imageKey = uploadResponse.data.uploadedFiles[0].url;
        }
      }

      // Upload new certificates if they exist
      const newCertificates = certificates.filter(
        (cert) => cert.imageKey && typeof cert.imageKey !== 'string'
      );
      if (newCertificates.length > 0) {
        const certUploadPromises = newCertificates.map(async (cert) => {
          const certFormData = new FormData();
          certFormData.append('file', cert.imageKey);

          const certResponse = await addFile(certFormData).unwrap();
          if (certResponse.success && certResponse.data.uploadedFiles.length > 0) {
            return {
              imageKey: certResponse.data.uploadedFiles[0].url,
              id: cert.id,
            };
          }
          return null;
        });

        uploadedCertificates = await Promise.all(certUploadPromises);
        uploadedCertificates = uploadedCertificates.filter((cert) => cert !== null);
      }

      // Combine existing and new certificates
      const allCertificates = [
        ...certificates.filter((cert) => cert.id && !cert.file),
        ...uploadedCertificates,
      ];

      // Prepare the data for API
      const doctorData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        imageKey: imageKey || formData.imageKey,
        clinicFees: parseFloat(formData.clinicFees),
        onlineFees: parseFloat(formData.onlineFees),
        hasClinicConsult: formData.hasClinicConsult,
        hasOnlineConsult: formData.hasOnlineConsult,
        aboutEn: formData.aboutEn,
        aboutAr: formData.aboutAr,
        languages: languages
          .map((lang) => lang.language)
          .filter((lang) => lang),
        gender: formData.gender,
        title: formData.title,
        specializationId: formData.specializationId,
        phones: phones
          .filter((phone) => phone.phoneNumber)
          .map((phone) => ({ phoneNumber: phone.phoneNumber })),
        certificates: allCertificates,
      };

      // Call the API
      await updateDoctorProfile(doctorData).unwrap();

      // Show success message
      toast({
        title: t('doctors.profileUpdated'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      refetch(); // Refresh the profile data
    } catch (err) {
      toast({
        title: t('doctors.failedUpdateProfile'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" />
          <Text color={textColor}>{t('doctors.loadingProfile')}</Text>
        </VStack>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" p="20px" mt="80px">
        <Alert status="error" borderRadius="lg" maxW="500px">
          <AlertIcon />
          <Box>
            <AlertTitle>{t('doctors.failedLoadProfile')}</AlertTitle>
            <AlertDescription>
              {error.data?.message || t('doctors.failedLoadProfile')}
            </AlertDescription>
          </Box>
        </Alert>
      </Flex>
    );
  }

  return (
    <Flex justify="center" p="20px" mt="80px" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Box w="100%" p="6" boxShadow="md" borderRadius="lg" bg={cardBg}>
        <Flex justify="space-between" align="center" mb="20px">
          <Text color={textColor} fontSize="22px" fontWeight="700">
            {t('doctors.profile')}
          </Text>
        </Flex>

        <form onSubmit={handleSubmit}>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {/* Basic Information */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
                {t('doctors.firstName')}<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              </Text>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                bg={inputBg}
                color={textColor}
                borderColor={inputBorder}
                required
                mt="8px"
              />
            </Box>

            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
                {t('doctors.lastName')}<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              </Text>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                bg={inputBg}
                color={textColor}
                borderColor={inputBorder}
                required
                mt="8px"
              />
            </Box>


            {/* Professional Information */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
                {t('doctors.gender')}<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              </Text>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                bg={inputBg}
                color={textColor}
                borderColor={inputBorder}
                required
                mt="8px"
                dir='ltr'
              >
                <option value="MALE">{t('doctors.male')}</option>
                <option value="FEMALE">{t('doctors.female')}</option>
              </Select>
            </Box>

            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
                {t('doctors.title')}<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              </Text>
              <Select
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                bg={inputBg}
                color={textColor}
                borderColor={inputBorder}
                required
                mt="8px"
                dir='ltr'
              >
                <option value="CONSULTANT">{t('doctors.consultant')}</option>
                <option value="SPECIALIST">{t('doctors.specialist')}</option>
                <option value="REGISTRAR">{t('doctors.registrar')}</option>
              </Select>
            </Box>

            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
                {t('doctors.specialization')}<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              </Text>
              <Menu closeOnSelect={true}>
                <MenuButton
                  as={Button}
                  rightIcon={<Icon as={FaSearch} />}
                  width="100%"
                  bg={inputBg}
                  color={textColor}
                  borderColor={inputBorder}
                  border="1px solid"
                  borderRadius="md"
                  _hover={{ bg: inputBg }}
                  _active={{ bg: inputBg }}
                  textAlign="left"
                  fontWeight="normal"
                  mt="8px"
                  justifyContent="space-between"
                >
                  {selectedSpecialization ? selectedSpecialization.name : t('doctors.selectSpecialization')}
                </MenuButton>
                <MenuList maxH="300px" overflowY="auto" bg={cardBg} borderColor={inputBorder}>
                  <Box p={2}>
                    <InputGroup size="sm">
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FaSearch} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder={t('doctors.searchSpecializations')}
                        value={specializationSearch}
                        onChange={(e) => handleSpecializationSearch(e.target.value)}
                        bg={inputBg}
                        color={textColor}
                        borderColor={inputBorder}
                        _focus={{ borderColor: 'brand.500' }}
                      />
                    </InputGroup>
                  </Box>
                  <MenuDivider />
                  {specializations.length > 0 ? (
                    specializations.map((spec) => (
                      <MenuItem
                        key={spec.id}
                        onClick={() => handleSpecializationSelect(spec)}
                        bg={cardBg}
                        color={textColor}
                        _hover={{ bg: 'brand.50', color: 'brand.700' }}
                        _focus={{ bg: 'brand.50', color: 'brand.700' }}
                      >
                        <HStack spacing={3}>
                          {spec.icon && (
                            <Image
                              src={spec.icon}
                              alt={spec.name}
                              boxSize="20px"
                              objectFit="contain"
                            />
                          )}
                          <Text>{spec.name}</Text>
                        </HStack>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem isDisabled>
                      <Text color="gray.500">
                        {specializationSearch ? t('doctors.noSpecializationsFound') : t('doctors.loadingSpecializations')}
                      </Text>
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            </Box>

            {/* Fees */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
                {t('doctors.clinicFees')}<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              </Text>
              <Input
                type="number"
                name="clinicFees"
                value={formData.clinicFees}
                onChange={handleInputChange}
                onKeyDown={handleNumberInputKeyDown}
                bg={inputBg}
                color={textColor}
                borderColor={inputBorder}
                required
                mt="8px"
                min={0}
              />
            </Box>

            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
                {t('doctors.onlineFees')}<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              </Text>
              <Input
                type="number"
                name="onlineFees"
                value={formData.onlineFees}
                onChange={handleInputChange}
                onKeyDown={handleNumberInputKeyDown}
                bg={inputBg}
                color={textColor}
                borderColor={inputBorder}
                required
                mt="8px"
                min={0}
              />
            </Box>

            {/* About Sections */}
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
                {t('doctors.aboutEn')}<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              </Text>
              <Textarea
                name="aboutEn"
                value={formData.aboutEn}
                onChange={handleInputChange}
                bg={inputBg}
                color={textColor}
                borderColor={inputBorder}
                required
                mt="8px"
                maxLength={500}
                rows={3}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                {formData.aboutEn.length}/500 {t('doctors.characters')}
              </Text>
            </Box>

            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
                {t('doctors.aboutAr')}
              </Text>
              <Textarea
                name="aboutAr"
                value={formData.aboutAr}
                onChange={handleInputChange}
                bg={inputBg}
                color={textColor}
                borderColor={inputBorder}
                mt="8px"
                maxLength={500}
                rows={3}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                {formData.aboutAr.length}/500 {t('doctors.characters')}
              </Text>
            </Box>

            {/* Toggles */}
            <Box gridColumn="1 / -1">
              <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={4}>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="hasClinicConsult" mb="0" color={textColor} fontSize="sm">
                    {t('doctors.clinicConsultation')}
                  </FormLabel>
                  <Switch
                    id="hasClinicConsult"
                    isChecked={formData.hasClinicConsult}
                    onChange={() => handleToggle('hasClinicConsult')}
                    colorScheme="brand"
                    dir='ltr'
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="hasOnlineConsult" mb="0" color={textColor} fontSize="sm">
                    {t('doctors.hasOnlineConsult')}
                  </FormLabel>
                  <Switch
                    id="hasOnlineConsult"
                    isChecked={formData.hasOnlineConsult}
                    onChange={() => handleToggle('hasOnlineConsult')}
                    colorScheme="brand"
                    dir='ltr'
                  />
                </FormControl>

              </Grid>
            </Box>

            {/* Phones */}
            <Box gridColumn="1 / -1" mt={2} mb={3}>
              <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
                {t('doctors.phoneNumbers')}<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              </Text>
              {phones.map((phone, index) => (
                <Flex key={index} align="center" mt="8px" mb={2}>
                  <Input
                    type="text"
                    placeholder={`${t('doctors.phone')} ${index + 1} (8 digits)`}
                    value={phone.phoneNumber}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    bg={inputBg}
                    color={textColor}
                    borderColor={inputBorder}
                    required={index === 0}
                    flex="1"
                    mr={2}
                    maxLength={8}
                  />
                  {phones.length > 1 && (
                    <Icon
                      as={FaTrash}
                      w="30px"
                      h="35px"
                      color="red.500"
                      cursor="pointer"
                      onClick={() => handleDeletePhone(index)}
                      border={`1px solid ${borderColor}`}
                      padding="5px"
                      borderRadius="5px"
                    />
                  )}
                </Flex>
              ))}
              <Button
                variant="outline"
                colorScheme="teal"
                size="sm"
                mt={2}
                leftIcon={<FaPlus />}
                onClick={handleAddPhone}
              >
                {t('doctors.addPhone')}
              </Button>
            </Box>

            {/* Languages */}
            <Box gridColumn="1 / -1" mb={3}>
              <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
                {t('doctors.languages')}<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              </Text>
              {languages.map((lang, index) => (
                <Flex key={index} align="center" mt="8px" mb={2}>
                  <Input
                    type="text"
                    placeholder={`${t('doctors.language')} ${index + 1}`}
                    value={lang.language}
                    onChange={(e) =>
                      handleLanguageChange(index, 'language', e.target.value)
                    }
                    bg={inputBg}
                    color={textColor}
                    borderColor={inputBorder}
                    required={index === 0}
                    flex="1"
                    mr={2}
                  />
                  {languages.length > 1 && (
                    <Icon
                      as={FaTrash}
                      w="30px"
                      h="35px"
                      color="red.500"
                      cursor="pointer"
                      onClick={() => handleDeleteLanguage(index)}
                      border={`1px solid ${borderColor}`}
                      padding="5px"
                      borderRadius="5px"
                      ml={2}
                    />
                  )}
                </Flex>
              ))}
              <Button
                variant="outline"
                colorScheme="teal"
                size="sm"
                mt={2}
                leftIcon={<FaPlus />}
                onClick={handleAddLanguage}
              >
                {t('doctors.addLanguage')}
              </Button>
            </Box>


            {/* Doctor Image */}
            <Box gridColumn="1 / -1" mb={3}>
              <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
                {t('doctors.doctorImage')}
              </Text>
              <Box
                border="1px dashed"
                borderColor={isDragging ? dropZoneActiveBorder : dropZoneBorder}
                borderRadius="md"
                p={4}
                textAlign="center"
                backgroundColor={isDragging ? dropZoneActiveBg : dropZoneBg}
                cursor="pointer"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                mt="8px"
              >
                {image ? (
                  <Flex direction="column" align="center">
                    <Image
                      src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                      alt={t('doctors.doctor')}
                      maxH="200px"
                      mb={2}
                      borderRadius="md"
                    />
                    <Button
                      variant="outline"
                      colorScheme="red"
                      size="sm"
                      onClick={() => {
                        setImage(null);
                        setFormData((prev) => ({ ...prev, imageKey: '' }));
                      }}
                    >
                      {t('doctors.removeImage')}
                    </Button>
                  </Flex>
                ) : (
                  <>
                    <Icon as={FaUpload} w={8} h={8} color="brand.500" mb={2} />
                    <Text color={textColor} mb={2}>
                      {t('doctors.dragDropImage')}
                    </Text>
                    <Text color={textColor} mb={2}>
                      {t('doctors.or')}
                    </Text>
                    <Button
                      variant="outline"
                      colorScheme="brand"
                      onClick={() => document.getElementById('doctorImage').click()}
                    >
                      {t('doctors.uploadImage')}
                      <input
                        type="file"
                        id="doctorImage"
                        hidden
                        accept="image/*"
                        onChange={handleFileInputChange}
                      />
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            {/* Certificates */}
            <Box gridColumn="1 / -1">
              <Text color={textColor} fontSize="sm" fontWeight="700" mb="1">
                {t('doctors.certificates')}
              </Text>
              <Box mt={2}>
                <Button
                  as="label"
                  variant="outline"
                  colorScheme="teal"
                  leftIcon={<FaPlus />}
                  cursor="pointer"
                >
                  {t('doctors.addCertificates')}
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleCertificateUpload}
                  />
                </Button>
              </Box>
              {certificates.length > 0 && (
                <Grid templateColumns="repeat(3, 1fr)" gap={4} mt={4}>
                  {certificates.map((cert, index) => (
                    <Box key={index} position="relative">
                      <Image
                        src={typeof cert.imageKey === 'string' ? cert.imageKey : URL.createObjectURL(cert.imageKey)}
                        alt={`${t('doctors.certificate')} ${index + 1}`}
                        borderRadius="md"
                        boxShadow="md"
                      />
                      <Icon
                        as={FaTrash}
                        position="absolute"
                        top={2}
                        right={2}
                        color="red.500"
                        cursor="pointer"
                        onClick={() => handleDeleteCertificate(index)}
                        bg={cardBg}
                        p={1}
                        borderRadius="full"
                        boxShadow="md"
                      />
                    </Box>
                  ))}
                </Grid>
              )}
            </Box>
          </Grid>

          {/* Action Buttons */}
          <Flex justify="center" mt={6}>
            <Button
              type="submit"
              colorScheme="brandScheme"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
              width="200px"
              isLoading={isUpdating}
              loadingText={t('doctors.updating')}
            >
              {t('doctors.updateProfile')}
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};

export default Profile;
