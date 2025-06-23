// Chakra imports
import { Box, Flex, Select, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";
// Custom components
import BarChart from "components/charts/BarChart";
import React from "react";
import {
  barChartDataUserActivity,
  barChartOptionsUserActivity,
} from "variables/charts";
import { useTranslation } from 'react-i18next';

export default function UserActivity(props) {
  const { ...rest } = props;
  const { t } = useTranslation();

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  return (
    <Card align='center' direction='column' w='100%' {...rest}>
      <Flex align='center' w='100%' px='15px' py='10px'>
        <Text
          me='auto'
          color={textColor}
          fontSize='xl'
          fontWeight='700'
          lineHeight='100%'>
          {t('userActivity')}
        </Text>
        <Select
          id='user_type'
          w='unset'
          variant='transparent'
          display='flex'
          alignItems='center'
          defaultValue='Weekly'>
          <option value='Weekly'>{t('weekly')}</option>
          <option value='Daily'>{t('daily')}</option>
          <option value='Monthly'>{t('monthly')}</option>
        </Select>
      </Flex>

      <Box h='240px' mt='auto'>
        <BarChart
          chartData={barChartDataUserActivity}
          chartOptions={barChartOptionsUserActivity}
        />
      </Box>
    </Card>
  );
}
