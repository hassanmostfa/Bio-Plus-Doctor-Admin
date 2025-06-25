import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  VStack,
  Text,
  Grid,
  GridItem,
  HStack,
} from "@chakra-ui/react";
import { useUpdateDoctorScheduleExceptionMutation, useGetDoctorScheduleExceptionByIdQuery } from "api/doctorScheduleExceptionSlice";
import { useGetDoctorsQuery } from "api/doctorSlice";
import { useGetDoctorSchedulesQuery } from "api/doctorScheduleSlice";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import { ChevronLeftIcon } from "@chakra-ui/icons";

const EditDoctorScheduleException = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [formData, setFormData] = useState({
    doctorId: JSON.parse(localStorage.getItem("doctor"))?.id,
    scheduleId: "",
    exceptionDate: "",
    isCancelled: true,
  });

  const { data: exception, isLoading } = useGetDoctorScheduleExceptionByIdQuery(id);
  const { data: doctors } = useGetDoctorsQuery();
  const { data: schedules } = useGetDoctorSchedulesQuery({ 
    limit: 1000, 
    doctorId: JSON.parse(localStorage.getItem("doctor"))?.id 
  });
  const [updateException] = useUpdateDoctorScheduleExceptionMutation();

  useEffect(() => {
    if (exception?.data) {
      setFormData({
        doctorId: exception.data.doctorId,
        scheduleId: exception.data.scheduleId || "",
        exceptionDate: exception.data.exceptionDate.split('T')[0],
        isCancelled: exception.data.isCancelled,
      });
    }
  }, [exception]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = { ...formData };
    if (!submitData.scheduleId) {
      delete submitData.scheduleId;
    }
    
    try {
      await updateException({ id, data: submitData }).unwrap();
      Swal.fire({
        title: t('success'),
        text: t('exceptionUpdated'),
        icon: "success",
        customClass: {
          popup: isRTL ? 'swal2-rtl' : ''
        }
      }).then(() => {
        navigate("/admin/doctor-schedule-exceptions");
      });
    } catch (error) {
      Swal.fire({
        title: t('error'),
        text: error.data?.message || t('failedUpdateException'),
        icon: "error",
        customClass: {
          popup: isRTL ? 'swal2-rtl' : ''
        }
      });
    }
  };

  if (isLoading) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }} dir={isRTL ? "rtl" : "ltr"}>
        <Text textAlign={isRTL ? "right" : "left"}>{t('loading')}</Text>
      </Box>
    );
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} dir={isRTL ? "rtl" : "ltr"}>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={12}>
          <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
            <HStack justify="space-between" mb={4}>
              <Button 
                leftIcon={<ChevronLeftIcon />} 
                variant="outline" 
                onClick={() => navigate('/admin/doctor-schedule-exceptions')}
                mr={isRTL ? 0 : 2}
                ml={isRTL ? 2 : 0}
              >
                {t('back')}
              </Button>
              <Text fontSize="xl" fontWeight="bold" textAlign={isRTL ? "right" : "left"}>
                {t('editScheduleException')}
              </Text>
              <Box width="100px" /> {/* Spacer to balance the layout */}
            </HStack>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel textAlign={isRTL ? "right" : "left"}>{t('scheduleOptional')}</FormLabel>
                  <Select
                    name="scheduleId"
                    value={formData.scheduleId}
                    onChange={handleInputChange}
                  >
                    <option value="">{t('allSchedules')}</option>
                    {schedules?.data?.map((schedule) => (
                      <option key={schedule.id} value={schedule.id}>
                        {`${schedule.dayName} (${schedule.startTime} - ${schedule.endTime})`}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel textAlign={isRTL ? "right" : "left"}>{t('exceptionDate')}</FormLabel>
                  <Input
                    type="date"
                    name="exceptionDate"
                    value={formData.exceptionDate}
                    onChange={handleInputChange}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel textAlign={isRTL ? "right" : "left"}>{t('cancelled')}</FormLabel>
                  <Switch
                    dir="ltr"
                    name="isCancelled"
                    isChecked={formData.isCancelled}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Button 
                  type="submit" 
                  colorScheme="blue" 
                  width="full"
                  mt={4}
                >
                  {t('updateException')}
                </Button>
              </VStack>
            </form>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default EditDoctorScheduleException;