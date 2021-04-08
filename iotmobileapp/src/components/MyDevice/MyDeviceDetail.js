import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, LogBox} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DeepstreamClient} from '@deepstream/client';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';

import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import {
  Button,
  Card,
  Avatar,
  Title,
  Subheading,
  ActivityIndicator,
  Colors,
  Text,
} from 'react-native-paper';

// Chart Component
import ChartSensor from './ChartSensor';

// SVG Component
import AnalyticsSVG from '../../svg/icons/navigation/analytics.svg';
import MangerUserSVG from '../../svg/icons/navigation/manager-user1.svg';
import DeviceSVG from '../../svg/icons/navigation/ph-sensor.svg';
import BatterySVG from '../../svg/icons/navigation/battery2.svg';
import ServerDownSVG from '../../svg/icons/serverdown1.svg';

// Environment
import env from '../../environment/environment';
const url9997 = env.PORT_9997;
const local_ip = env.IPLOCAL;

const MyDeviceDetail = ({route}) => {
  LogBox.ignoreAllLogs();
  let deviceToken = '';

  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();
  const {
    idsensor,
    sensor,
    device,
    bcAccount,
    firebaseToken,
    deviceTokenG,
  } = route.params;
  const navigation = useNavigation();

  RNSecureKeyStore.get(device.deviceID).then(
    (res) => {
      deviceToken = res;
      console.log(device.deviceID + ': ' + deviceToken);
    },
    (err) => {
      console.log(err.code + ': ' + err.message);
    },
  );

  console.log(JSON.stringify(device, null, 2));
  const useSensor = device.data_fields;
  let abcDeviceID = bcAccount.deviceID;
  let abcbCIdentity = bcAccount.bcIdentity;
  console.log('BEFORE');
  console.log(abcbCIdentity + ':' + abcDeviceID);

  //

  // Call useEffect
  useEffect(() => {
    console.log('call UseEffect');
    navigation.setOptions({title: device.deviceID});

    // let refreshAuthLogic = (failedRequest) =>
    //   axios({
    //     method: 'POST',
    //     url: `http://${local_ip}:4002/api/user/gettoken`,
    //     headers: {
    //       authorization: `Bearer ${firebaseToken}`,
    //     },
    //     data: {
    //       deviceID: abcDeviceID,
    //       bcIdentity: abcbCIdentity,
    //     },        getDataSensor();

    //   }).then((tokenResponse) => {
    //     console.log(abcbCIdentity + ':' + abcDeviceID);
    //     RNSecureKeyStore.set(bcAccount.deviceID, tokenResponse.data.token, {
    //       accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
    //     }).then(
    //       (res) => {
    //         console.log(`OK - Device Token ${bcAccount.deviceID}`);
    //       },
    //       (error) => {
    //         console.log('RNSecureKeyStore ERROR:');
    //         console.log(error);
    //       },
    //     );
    //     RNSecureKeyStore.get(device.deviceID).then(
    //       (res) => {
    //         console.log('get ngay sau khi set: ' + res);
    //       },
    //       (err) => {
    //         console.log(err.code + ': ' + err.message);
    //       },
    //     );
    //     console.log(tokenResponse.data.token);
    //     failedRequest.response.config.headers['Authorization'] =
    //       'Bearer ' + tokenResponse.data.token;
    //     return Promise.resolve();
    //   });
    // createAuthRefreshInterceptor(axios, refreshAuthLogic);
    console.log(abcbCIdentity + ':' + abcDeviceID);

    const getDataSensor = async () => {
      console.log('getDataSensor');
      // RNSecureKeyStore.get(`${device.deviceID}`).then(
      //   (res) => {
      //     deviceToken = res;
      //     console.log(device.deviceID + ': ' + deviceToken);
      //   },
      //   (err) => {
      //     console.log(err.code + ': ' + err.message);
      //   },
      // );
      // console.log(`Firebase Token: ${firebaseToken}`);

      // console.log(bcAccount);

      const result = await axios({
        method: 'POST',
        url: `http://${local_ip}:4002/api/device/datadevice`,
        headers: {
          authorization: 'Bearer ' + deviceTokenG,
        },
      }).catch((error) => {
        console.log(`ERROR-->: ${error.message}`);
        setError(true);
        setLoading(false);
      });
      if (result === undefined) {
        console.log('RESULT: UNDEFINED');
        setData(undefined);
      } else {
        try {
          console.log(result.data);
          setData(result.data.reverse());
          setLoading(false);
        } catch (error) {
          setError(true);
          setLoading(false);
        }
      }
    };
    getDataSensor();
    try {
      const client = new DeepstreamClient(`${local_ip}:6020`);
      client.login();
      const record = client.record.getRecord('news');
      record.subscribe(`news/${device.deviceID}`, function (value) {
        console.log('RECORD SUBSCRIBE');
        getDataSensor();
      });

      return () => {
        client.close();
        console.log(
          `Unmount Component: MyDeviceDetail.js\n----------------------------\n\n\n`,
        );
      };
    } catch (error) {
      console.log(`E: ${error}`);
    }
  }, []);

  const ListSensor = useSensor.map((sensor, index) => {
    var chartData;
    // --> AXIOS
    var data_daxuly = [];
    var timestamp_daxyly = [];
    // console.log(sensor);
    if (data != undefined) {
      data.map((data, index) => {
        data_daxuly.push(data.data[sensor.field_name]);
        let date = new Date(data.data['timestamp'] * 1000).toLocaleTimeString();
        timestamp_daxyly.push(date);
      });

      // console.log(data_daxuly); // setData(result.data);

      // console.log(timestamp_daxyly);
      return (
        // <View key={index}>
        //   <Title></Title>
        // </View>
        <ChartSensor
          key={index}
          sensor={sensor}
          index={index}
          data_daxuly={data_daxuly}
          timestamp_daxyly={timestamp_daxyly}
        />
      );
    } else {
      return <View key={index}></View>;
    }
  });

  return (
    <View>
      <ScrollView>
        <View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              backgroundColor: '#fcfdfd',
              marginHorizontal: 5,
              borderRadius: 5,
            }}>
            <View style={{flext: 0.5, width: '65%'}}>
              <Card.Title
                title={device.device_name}
                subtitle={`${device.deviceID}`}
                left={() => (
                  <Avatar.Icon
                    size={40}
                    icon={() => <DeviceSVG width={25} height={25} />}
                  />
                )}
              />
            </View>
            <View style={{width: '35%'}}>
              <Card.Title
                title={
                  data === undefined
                    ? 'NaN'
                    : Math.ceil(data[data.length - 1].data.bat) + '%'
                }
                left={() => (
                  <Avatar.Icon
                    size={40}
                    icon={() => <BatterySVG width={25} height={25} />}
                  />
                )}
              />
            </View>
          </View>
          <View
            style={{
              marginHorizontal: 5,
              marginBottom: 5,
              backgroundColor: '#fcfdfd',
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              paddingHorizontal: 10,
            }}>
            <Title>{`Thông tin thiết bị:`}</Title>
            <View style={styles.container2c}>
              <Button icon="information">{`Mô tả: ${device.device_desc}`}</Button>
              <Button icon="calendar-clock">{`Ngày bắt đầu: ${device.date}`}</Button>
              <Button icon="access-point">{`Số sensor: ${device.data_fields.length}`}</Button>
            </View>
          </View>
          <View style={styles.container2c}>
            <View style={styles.itemW50}>
              <Button
                icon={() => <MangerUserSVG width={20} height={20} />}
                color="#1877F2"
                mode="contained"
                disabled={error ? true : false}
                style={styles.itempM3}
                onPress={() => {
                  console.log(device);
                  navigation.navigate('ManagerDevice', {
                    idsensor: idsensor,
                    sensor: sensor,
                    device: device,
                  });
                }}>
                Quản lý
              </Button>
            </View>
            <View style={styles.itemW50}>
              <Button
                icon={() => <AnalyticsSVG width={20} height={20} />}
                mode="contained"
                color="red"
                disabled={error ? true : false}
                style={styles.itempM3}
                onPress={() => {
                  console.log(deviceTokenG + ':navigationMyDeviceStatic');
                  navigation.navigate('MyDeviceStatistic', {
                    idsensor: idsensor,
                    sensor: sensor,
                    device: device,
                    deviceTokenG: deviceTokenG,
                  });
                }}>
                Thống kê
              </Button>
            </View>
          </View>
          <View>
            {loading ? (
              <ActivityIndicator
                style={{
                  marginVertical: '20%',
                  flex: 1,
                  justifyContent: 'center',
                }}
                animating={true}
                color={Colors.red800}
              />
            ) : error ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ServerDownSVG width={200} height={200} />
                <Button color="red" icon="server-network-off">
                  Đã xảy ra lỗi !!!
                </Button>
              </View>
            ) : (
              ListSensor
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container2c: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  itemW40: {
    width: '40%',
  },
  itemW50: {
    width: '50%',
  },
  itemW60: {
    width: '60%',
  },
  itempM3: {
    margin: 3,
  },
});

export default MyDeviceDetail;
