import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Avatar,
  Card,
  Button,
  DataTable,
  List,
  Text,
  Title,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {TabView, SceneMap} from 'react-native-tab-view';
import Timeline from 'react-native-timeline-flatlist';
import axios from 'axios';

// LogBox
import {LogBox} from 'react-native';
// SVG Component
import DeviceSVG from '../../svg/icons/navigation/ph-sensor.svg';
import BaterrySVG from '../../svg/icons/navigation/battery2.svg';
import CalendarSVG from '../../svg/icons/navigation/calendar2.svg';

// Environment
import env from '../../environment/environment';
const url9997 = env.PORT_9997;
const local_ip = env.IPLOCAL;

import ChartComponent from './Chart';
import TableDeviceStatistic from './TableDeviceStatistic';

// -- Convert Time --
const timestampToDate = (timestamp) => {
  let date = new Date(timestamp * 1000);
  let time =
    date.getDate() +
    '/' +
    (parseInt(date.getMonth()) + 1) +
    '/' +
    date.getFullYear();
  return time;
};
const timestampToHour = (timestamp) => {
  let date = new Date(timestamp * 1000);
  let time =
    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  return time;
};
// --

const MyDeviceStatisticDetail = ({route}) => {
  const navigation = useNavigation();

  LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

  const [index, setIndex] = useState(0);
  const {startTime, endTime, device, deviceTokenG} = route.params;

  const [data, setData] = useState();
  const [data_fields, setDataField] = useState([]);

  console.log(data_fields);

  console.log(`Start Time: ${startTime} - End Time: ${endTime}`);
  let timeStart = new Date();
  timeStart.setTime((startTime - 1) * 1000);
  let timeEnd = new Date();
  timeEnd.setTime((endTime - 1) * 1000);

  let routeState = [];
  let renderSceneState = {};

  console.log('DEVICE TOKEN: ' + deviceTokenG);

  useEffect(() => {
    console.log('Call Use Effect');
    navigation.setOptions({title: device.deviceID});

    const getdata = async () => {
      const result = await axios({
        method: 'POST',
        url: `http://${local_ip}:4002/api/device/datastatisticaldevice`,
        headers: {
          authorization: 'Bearer ' + deviceTokenG,
        },
        data: {
          startDate: startTime,
          endDate: endTime,
        },
      }).catch((error) => {
        console.log(`ERROR-->: ${error.message}`);
        // set
      });
      if (result === undefined) {
        console.log('RESULT: UNDEFINED');
      } else {
        try {
          console.log('Share DEVICE STATISTIC DETAIL ');
          console.log(JSON.stringify(result.data, null, 2));
          setData(result.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    const {uid} = auth().currentUser;
    const subscriber = firestore()
      .collection('fieldRef')
      .where('auth', '==', uid)
      .where('deviceID', '==', device.deviceID)
      .onSnapshot((snapShot) => {
        snapShot.forEach(async (doc) => {
          setDataField(doc.data().data_fields);
          getdata();
        });
      });

    return () => subscriber();
  }, []);

  data_fields.map((unit, index) => {
    routeState.push({key: unit.field_name, title: unit.field_display});

    console.log(data);
    console.log('in if');
    let data_daxuly = [];
    let timestamp_daxyly = [];
    let time_daxuly = [];
    var TempRoute = () => {
      if (data === undefined)
        return (
          <View style={{paddingTop: 40}}>
            <ActivityIndicator animating={true} color={Colors.red800} />
          </View>
        );
      if (data.length === 0) {
        console.log(data.length);
        return (
          <View
            style={{
              paddingTop: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Title>Không có dữ liệu</Title>
          </View>
        );
      }
      data.map((data, index) => {
        data_daxuly.push(data.data[unit.field_name]);
        let date = new Date(data.data['timestamp'] * 1000).toLocaleDateString();
        let time = new Date(data.data['timestamp'] * 1000);
        timestamp_daxyly.push(date);
        time_daxuly.push(time);
      });
      console.log(data_daxuly);
      const maxVal = data_daxuly.reduce(
        (max, val) =>
          val > max._max
            ? {_max: val, _idx: max._curr, _curr: max._curr + 1}
            : {_max: max._max, _idx: max._idx, _curr: max._curr + 1},
        {_max: data_daxuly[0], _idx: 0, _curr: 0},
      );
      const minVal = data_daxuly.reduce(
        (min, val) =>
          val < min._min
            ? {_min: val, _idx: min._curr, _curr: min._curr + 1}
            : {_min: min._min, _idx: min._idx, _curr: min._curr + 1},
        {_min: data_daxuly[0], _idx: 0, _curr: 0},
      );
      const averageVal =
        data_daxuly.reduce((a, b) => a + b, 0) / data_daxuly.length;
      console.log(maxVal);
      return (
        <View>
          <View
            style={{
              // borderBottomLeftRadius: 15,
              // borderBottomRightRadius: 15,
              backgroundColor: 'white',
              margin: 0,
            }}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>{unit.field_display}</DataTable.Title>
                <DataTable.Title>Unit</DataTable.Title>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Time</DataTable.Title>
              </DataTable.Header>
              <DataTable.Row>
                <DataTable.Cell>Maximum</DataTable.Cell>
                <DataTable.Cell>{maxVal._max}</DataTable.Cell>
                <DataTable.Cell>
                  {/* {timestampToDate(fake_data.data[unit.field_name].max.date)} */}
                  {timestamp_daxyly[maxVal._idx]}
                </DataTable.Cell>
                <DataTable.Cell>
                  {/* {timestampToHour(fake_data.data[unit.field_name].max.date)} */}
                  {`${time_daxuly[maxVal._idx].getHours()}:${time_daxuly[
                    maxVal._idx
                  ].getMinutes()}:${time_daxuly[maxVal._idx].getSeconds()}`}
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Minimum</DataTable.Cell>
                <DataTable.Cell>{minVal._min}</DataTable.Cell>
                <DataTable.Cell>{timestamp_daxyly[minVal._idx]}</DataTable.Cell>
                <DataTable.Cell>
                  {`${time_daxuly[minVal._idx].getHours()}:${time_daxuly[
                    minVal._idx
                  ].getMinutes()}:${time_daxuly[minVal._idx].getSeconds()}`}
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Average</DataTable.Cell>
                <DataTable.Cell>{averageVal}</DataTable.Cell>
                <DataTable.Cell></DataTable.Cell>
                <DataTable.Cell></DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </View>
          <View>
            <Button>Biểu đồ sự thay đổi</Button>
            <ChartComponent
              key={index}
              unit={unit}
              timestamp_daxyly={timestamp_daxyly.reverse()}
              data_daxuly={data_daxuly.reverse()}
            />
            <Button>History</Button>
            <SafeAreaView>
              <Timeline
                style={{backgroundColor: 'white'}}
                data={[
                  {
                    time: '09:00',
                    title: 'Độ pH vượt mức cảnh báo',
                    description: 'pH: 11',
                  },
                  {
                    time: '10:45',
                    title: 'Độ pH vượt mức cảnh báo',
                    description: 'pH: 11',
                  },
                  {
                    time: '12:00',
                    title: 'Độ pH vượt mức cảnh báo',
                    description: 'pH: 11',
                  },
                  {
                    time: '14:00',
                    title: 'Độ pH vượt mức cảnh báo',
                    description: 'pH: 11',
                  },
                  {
                    time: '16:30',
                    title: 'Độ pH vượt mức cảnh báo',
                    description: 'pH: 11',
                  },
                ]}
              />
            </SafeAreaView>
          </View>
        </View>
      );
    };

    renderSceneState[unit.field_name] = TempRoute;
  });

  const [routes] = React.useState(routeState);
  const renderScene = SceneMap(renderSceneState);
  const initialLayout = {width: Dimensions.get('window').width};

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              backgroundColor: 'white',
              margin: 5,
              borderTopLeftRadius: 15,
              borderBottomRightRadius: 15,
            }}>
            <View style={{flex: 1, width: '50%'}}>
              <Card.Title
                title={`ID : ${device.deviceID}`}
                subtitle={`Chủ thiết bị: ${device.email}`}
                left={() => (
                  <Avatar.Icon
                    size={40}
                    icon={() => <DeviceSVG width={25} height={25} />}
                  />
                )}
              />
            </View>
            {/* <View style={{flex: 0.5, width: '50%'}}>
              <Card.Title
                title={Math.ceil(Math.random() * 100) + '%'}
                left={() => (
                  <Avatar.Icon
                    size={40}
                    icon={() => <BaterrySVG width={25} height={25} />}
                  />
                )}
              />
            </View> */}
          </View>
          <Button
            mode="contained"
            style={{
              borderTopRightRadius: 5,
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}>
            Thống kê
          </Button>
          <List.Item
            style={{
              marginHorizontal: 0,

              backgroundColor: 'white',
            }}
            title="Trong khoảng thời gian"
            description={`${timeStart.toLocaleDateString()} đến ${timeEnd.toLocaleDateString()}`}
            left={(props) => (
              <List.Icon icon={() => <CalendarSVG width={25} height={25} />} />
            )}
          />
        </View>

        {/* <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
        /> */}
        {data_fields.length === 0 ? (
          <View>
            <Title>ABC</Title>
          </View>
        ) : (
          <TableDeviceStatistic data_fields={data_fields} data={data} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container2c: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  itemW50: {
    width: '50%',
  },
  itempM3: {
    margin: 3,
  },
  leafStyle: {
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: 'white',
    margin: 5,
  },
});
export default MyDeviceStatisticDetail;
