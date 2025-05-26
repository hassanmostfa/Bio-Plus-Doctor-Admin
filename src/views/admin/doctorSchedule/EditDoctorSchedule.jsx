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
  useToast,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useUpdateDoctorScheduleMutation, useGetDoctorScheduleByIdQuery } from "api/doctorScheduleSlice";
import { useGetDoctorsQuery } from "api/doctorSlice";
import { useGetClinicsQuery } from "api/clinicSlice";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditDoctorSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    doctorId: "",
    isOnline: false,
    clinicId: null,
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    isActive: true,
  });

  const { data: schedule, isLoading } = useGetDoctorScheduleByIdQuery(id);
  const { data: doctors } = useGetDoctorsQuery();
  const { data: clinics } = useGetClinicsQuery();
  const [updateSchedule] = useUpdateDoctorScheduleMutation();

  const convertTo24Hour = (time12h) => {
    if (!time12h) return "";
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    if (hours === 12) {
      hours = modifier === "PM" ? 12 : 0;
    } else {
      hours = modifier === "PM" ? hours + 12 : hours;
    }
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    if (schedule?.data) {
      setFormData({
        // doctorId: schedule.data.doctorId,
        isOnline: schedule.data.isOnline,
        clinicId: schedule.data.clinicId || null,
        dayOfWeek: schedule.data.dayOfWeek.toString(),
        startTime: convertTo24Hour(schedule.data.startTime),
        endTime: convertTo24Hour(schedule.data.endTime),
        isActive: schedule.data.isActive,
      });
    }
  }, [schedule]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare the data for submission
    const submitData = {
      ...formData,
      dayOfWeek: parseInt(formData.dayOfWeek),
      clinicId: formData.clinicId,
      startTime: formatTime(formData.startTime),
      endTime: formatTime(formData.endTime),
    };

    try {
      await updateSchedule({
        id,
        schedule: submitData,
      }).unwrap();
      Swal.fire({
        title: "Success!",
        text: "Doctor schedule updated successfully",
        icon: "success",
      }).then(() => {
        navigate("/admin/doctor-schedules");
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.data?.message || "Failed to update schedule",
        icon: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={12}>
          <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Edit Doctor Schedule
            </Text>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                {/* <FormControl isRequired>
                  <FormLabel>Doctor</FormLabel>
                  <Select
                    name="doctorId"
                    // value={formData.doctorId}
                    // onChange={handleInputChange}
                  >
                    <option value="">Select Doctor</option>
                    {doctors?.data?.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.fullName}
                      </option>
                    ))}
                  </Select>
                </FormControl> */}

                <FormControl>
                  <FormLabel>Online Consultation</FormLabel>
                  <Switch
                    name="isOnline"
                    isChecked={formData.isOnline}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Clinic</FormLabel>
                  <Select
                    name="clinicId"
                    value={formData.clinicId || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Clinic</option>
                    {clinics?.data?.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Day of Week</FormLabel>
                  <Select
                    name="dayOfWeek"
                    value={formData.dayOfWeek}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Day</option>
                    <option value="0">Sunday</option>
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Start Time</FormLabel>
                  <Input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>End Time</FormLabel>
                  <Input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Active</FormLabel>
                  <Switch
                    name="isActive"
                    isChecked={formData.isActive}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue" width="full">
                  Update Schedule
                </Button>
              </VStack>
            </form>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default EditDoctorSchedule; 