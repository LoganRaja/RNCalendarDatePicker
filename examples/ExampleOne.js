import React, { useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text
} from 'react-native';
import CalendarDatePicker from './src/CalendarDatePicker';


const ExampleOne = () => {
  const calendarDatePicker = useRef();

  const getSelectedDates = (selectedDates) => {
    console.log('hello', selectedDates)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View
        style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}>
        <Text onPress={() => {
          calendarDatePicker.current.handleShow()
        }}>{'Show Picker'}</Text>

        <CalendarDatePicker
          ref={calendarDatePicker}
          getSelectedDates={getSelectedDates}
          multiSelect={true}
          maxNumOfDateSel={6}
          checkbefToday={true}
        />



      </View>

    </SafeAreaView>
  );
};



export default ExampleOne;
