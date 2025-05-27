import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { useCreateDoctorScheduleExceptionMutation } from "api/doctorScheduleExceptionSlice";
import { useGetDoctorsQuery } from "api/doctorSlice";
import { useGetDoctorSchedulesQuery } from "api/doctorScheduleSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddDoctorScheduleException = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    doctorId: JSON.parse(localStorage.getItem("doctor"))?.id,
    scheduleId: "",
    exceptionDate: "",
    isCancelled: true,
  });

  const { data: doctors } = useGetDoctorsQuery();
  const { data: schedules } = useGetDoctorSchedulesQuery({ limit: 1000, doctorId: JSON.parse(localStorage.getItem("doctor"))?.id });
  const [createException] = useCreateDoctorScheduleExceptionMutation();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a new object without scheduleId if it's empty
    const submitData = { ...formData };
    if (!submitData.scheduleId) {
      delete submitData.scheduleId;
    }
    
    try {
      await createException(submitData).unwrap();
      Swal.fire({
        title: "Success!",
        text: "Schedule exception created successfully",
        icon: "success",
      }).then(() => {
        navigate("/admin/doctor-schedule-exceptions");
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.data?.message || "Failed to create exception",
        icon: "error",
      });
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={12}>
          <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Add New Schedule Exception
            </Text>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                {/* <FormControl isRequired>
                  <FormLabel>Doctor</FormLabel>
                  <Select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleInputChange}
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
                  <FormLabel>Schedule (Optional)</FormLabel>
                  <Select
                    name="scheduleId"
                    value={formData.scheduleId}
                    onChange={handleInputChange}
                  >
                    <option value="">All Schedules</option>
                    {schedules?.data?.map((schedule) => (
                      <option key={schedule.id} value={schedule.id}>
                        {`${schedule.dayName} (${schedule.startTime} - ${schedule.endTime})`}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Exception Date</FormLabel>
                  <Input
                    type="date"
                    name="exceptionDate"
                    value={formData.exceptionDate}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Cancelled</FormLabel>
                  <Switch
                    name="isCancelled"
                    isChecked={formData.isCancelled}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue" width="full">
                  Create Exception
                </Button>
              </VStack>
            </form>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default AddDoctorScheduleException; 