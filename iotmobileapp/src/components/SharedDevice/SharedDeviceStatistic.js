import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Platform} from 'react-native';
import {Button, Menu, Divider, Provider} from 'react-native-paper';
// import DatePicker from 'react-native-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';

// SVG Component
import CalendarSVG from '../../svg/icons/navigation/calendar.svg';

const MyDeviceStatistic = ({route}) => {
  const setDateStart = (date) => {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
  };
  const setDateEnd = (date) => {
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    return date;
  };

  const {deviceTokenG, device} = route.params;
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({title: device.deviceID});
  });

  console.log(deviceTokenG + ':MyDeviceStatic');

  const [date, setDate] = useState(setDateStart(new Date()));
  const [dateEnd, setEndDate] = useState(setDateEnd(new Date()));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const [visible, setVisible] = useState(false);
  const [longTime, setLongTime] = useState('1 days');
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  // DateTimePicker community
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    console.log(currentDate);
  };
  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || dateEnd;
    setShowEnd(Platform.OS === 'ios');
    setEndDate(currentDate);
    console.log(currentDate);
  };
  console.log('START DATE:');
  console.log(Math.ceil(date.getTime() / 1000));
  console.log('END DATE:');
  console.log(Math.ceil(dateEnd.getTime() / 1000));

  //
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const showEndMode = (currentMode) => {
    setShowEnd(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode('date');
  };
  const showEndDatepicker = () => {
    showEndMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  //

  return (
    <View style={styles.container}>
      <View>
        <View>
          <Button>Thống kê bắt đầu từ ngày:</Button>
          <Button
            style={{borderRadius: 0}}
            onPress={showDatepicker}
            mode="contained"
            icon={() => <CalendarSVG width={25} height={25} />}>
            {date.toLocaleDateString()}
          </Button>
          <Button>Đến ngày:</Button>
          <Button
            style={{borderRadius: 0}}
            onPress={showEndDatepicker}
            mode="contained"
            icon={() => <CalendarSVG width={25} height={25} />}>
            {dateEnd.toLocaleDateString()}
          </Button>
          {/* <Button>Trong khoảng thời gian:</Button>
          <View style={{}}>
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Button
                  style={{borderRadius: 0}}
                  mode="contained"
                  onPress={openMenu}>
                  {longTime}
                </Button>
              }>
              <Menu.Item
                style={{width: 300}}
                onPress={() => {
                  setLongTime('1 days');
                  closeMenu();
                }}
                title="1 days"
              />
              <Divider />
              <Menu.Item
                onPress={() => {
                  onChange;
                  setLongTime('3 days');
                  closeMenu();
                }}
                title="3 days"
              />
              <Divider />
              <Menu.Item
                onPress={() => {
                  setLongTime('7 days');
                  closeMenu();
                }}
                title="7 days"
              />
              <Divider />
              <Menu.Item
                onPress={() => {
                  onChange;
                  setLongTime('30 days');
                  closeMenu();
                }}
                title="30 days"
              />
            </Menu>
          </View> */}
          <View>
            <Button>Thống kê:</Button>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Button
                style={{width: '50%'}}
                mode="contained"
                onPress={async () => {
                  console.log(deviceTokenG + 'navigationShareDeviceStatics');
                  let startTime = Math.ceil(date.getTime() / 1000);
                  let endTime = Math.ceil(dateEnd.getTime() / 1000);
                  navigation.navigate('SharedDeviceStatisticDetail', {
                    startTime: startTime,
                    endTime: endTime,
                    deviceTokenG: deviceTokenG,
                    device: device,
                  });
                }}>
                Select
              </Button>
            </View>
            {show && (
              <DateTimePicker
                maximumDate={dateEnd}
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
            {showEnd && (
              <DateTimePicker
                minimumDate={date}
                maximumDate={new Date()}
                testID="dateTimePicker"
                value={dateEnd}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChangeEnd}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default MyDeviceStatistic;
