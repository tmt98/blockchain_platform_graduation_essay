import React, {useState, useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import axios from 'axios';
import {DeepstreamClient} from '@deepstream/client';

import {
  Button,
  Card,
  Avatar,
  Title,
  Subheading,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';

// COMPONENT ?
import ChartSensor from '../MyDevice/ChartSensor';

// SVG Component
import AnalyticsSVG from '../../svg/icons/navigation/analytics.svg';
import DeviceSVG from '../../svg/icons/navigation/ph-sensor.svg';
import BatterySVG from '../../svg/icons/navigation/battery2.svg';
import ServerDownSVG from '../../svg/icons/serverdown1.svg';

// Get Environment
import env from '../../environment/environment';
const url9997 = env.PORT_9997;
const local_ip = env.IPLOCAL;

import {LineChart} from 'react-native-chart-kit';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import {useNavigation} from '@react-navigation/native';

const SharedDeviceDetail = ({route}) => {
  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  const {
    idsensor,
    sensor,
    device,
    data_fields,
    bcAccount,
    deviceTokenG,
  } = route.params;
  const navigation = useNavigation();
  const [data_fields1, setDataFields] = useState([]);
  console.log('DATA_FIELD');
  // console.log(data_fields);
  console.log('DATA_FIELD');

  const useSensor = data_fields1;
  RNSecureKeyStore.get(device.deviceID).then(
    (res) => {
      console.log(res);
    },
    (err) => {
      console.log(err);
    },
  );
  console.log(data);

  useEffect(() => {
    navigation.setOptions({title: device.deviceID});
    const getDataSensor = async () => {
      var deviceToken = '';
      RNSecureKeyStore.get(device.deviceID).then(
        (res) => {
          deviceToken = res;
          console.log(device.deviceID + ': ' + res);
        },
        (error) => {
          console.log(error);
        },
      );
      const firebaseToken = await auth().currentUser.getIdToken();
      // const {uid} = auth().currentUser;
      // let bcAccount;
      // const bcAccounts = await firestore()
      //   .collection('bcAccounts')
      //   .where('auth', '==', uid)
      //   .where('deviceID', '==', device.deviceID)
      //   .get();
      // bcAccounts.forEach((doc) => {
      //   bcAccount = doc.data();
      // });
      // console.log(bcAccount);
      // const refreshAuthLogic = (failedRequest) =>
      //   axios({
      //     method: 'POST',
      //     url: `http://${local_ip}:4002/api/user/gettoken`,
      //     headers: {
      //       authorization: 'Bearer ' + firebaseToken,
      //     },
      //     data: {
      //       uid: bcAccount.uid,
      //       deviceID: bcAccount.deviceID,
      //       bcIdentity: bcAccount.bcIdentity,
      //     },
      //   }).then((tokenResponse) => {
      //     RNSecureKeyStore.set(bcAccount.deviceID, tokenResponse.data.token, {
      //     }).then(
      //       (res) => {
      //         console.log(`OK - Device Token ${bcAccount.deviceID}`);
      //       },
      //       (error) => {
      //         console.log(error);
      //       },
      //     );
      //     console.log(tokenResponse.data.token);
      //     failedRequest.response.config.headers['Authorization'] =
      //       'Bearer ' + tokenResponse.data.token;
      //     return Promise.resolve();
      //   });     //       accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
      //     }).then(
      //       (res) => {
      //         console.log(`OK - Device Token ${bcAccount.deviceID}`);
      //       },
      //       (error) => {
      //         console.log(error);
      //       },
      //     );
      //     console.log(tokenResponse.data.token);
      //     failedRequest.response.config.headers['Authorization'] =
      //       'Bearer ' + tokenResponse.data.token;
      //     return Promise.resolve();
      //   });

      // createAuthRefreshInterceptor(axios, refreshAuthLogic);

      const result = await axios({
        method: 'POST',
        url: `http://${local_ip}:4002/api/device/datadevice`,
        headers: {
          authorization: 'Bearer ' + deviceToken,
        },
      }).catch((error) => {
        console.log(`ERROR-->: ${error.message}`);
        setError(true);
        setLoading(false);
      });
      if (result === undefined) {
        // setData({});"
        setData(undefined);
      } else {
        try {
          console.log('GOI LAI AXIOS DE LAY DATA');
          console.log(result.data.reverse());
          setData(result.data.reverse());
          setLoading(false);
        } catch (error) {
          setError(true);
          setLoading(false);
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
          const firebaseToken = await auth().currentUser.getIdToken();
          setDataFields(doc.data().data_fields);
          const tokenReponse = await axios({
            method: 'POST',
            url: `http://${local_ip}:4002/api/user/gettoken`,
            headers: {
              authorization: `Bearer ${firebaseToken}`,
            },
            data: {
              deviceID: bcAccount.deviceID,
              bcIdentity: bcAccount.bcIdentity,
            },
          });
          RNSecureKeyStore.set(bcAccount.deviceID, tokenReponse.data.token, {
            accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
          }).then(
            (res) => {
              console.log(`Share Device: ${res}`);
            },
            (error) => {
              console.log('RNSecureKeyStore ERROR: ');
              console.log(error);
            },
          );
          console.log(doc.data());
          getDataSensor();
        });
      });

    try {
      const client = new DeepstreamClient(`${local_ip}:6020`);
      client.login();
      const record = client.record.getRecord('news');
      record.subscribe(`news/${idsensor}`, function (value) {
        console.log(JSON.stringify(value));
        getDataSensor();
      });

      return () => {
        subscriber();
        client.close();
        console.log('Unmount Component: ShareDeviceDetail.js');
      };
    } catch (error) {
      console.log(`E: ${error}`);
    }
  }, []);

  console.log(data_fields1);
  const ListSensor = data_fields1.map((sensor, index) => {
    // --> AXIOS
    var data_daxuly = [];
    var timestamp_daxyly = [];
    // console.log(sensor);
    if (data === undefined) {
      return (
        <View style={{paddingTop: 40}}>
          <ActivityIndicator animating={true} color={Colors.red800} />
        </View>
      );
    }
    data.map((data, index) => {
      // console.log(sensor.field_name);
      // console.log(data.data);
      // console.log(data.data[sensor.field_name]);
      data_daxuly.push(data.data[sensor.field_name]);
      let date = new Date(data.data['timestamp'] * 1000).toLocaleTimeString();
      timestamp_daxyly.push(date);
    });
    console.log(data_daxuly); // setData(result.data);

    console.log(timestamp_daxyly);
    return (
      <ChartSensor
        key={index}
        sensor={sensor}
        index={index}
        data_daxuly={data_daxuly.reverse()}
        timestamp_daxyly={timestamp_daxyly.reverse()}
      />
    );
  });
  return (
    <View>
      <ScrollView>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: '#fcfdfd',
            marginHorizontal: 5,
            borderRadius: 5,
          }}>
          <View style={{flext: 0.5, width: '50%'}}>
            <Card.Title
              title={device.device_name}
              subtitle={device.deviceID}
              left={() => (
                <Avatar.Icon
                  size={40}
                  icon={() => <DeviceSVG width={25} height={25} />}
                />
              )}
            />
          </View>
          <View style={{width: '50%'}}>
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
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}>
            <Button icon="information">{`Mô tả: ${device.device_desc}`}</Button>
            <Button icon="calendar-clock">{`Ngày bắt đầu: ${device.date}`}</Button>
            <Button icon="access-point">{`Số sensor được chia sẽ: ${data_fields1.length}`}</Button>
            <Button icon="account-star-outline">{`Từ: ${device.email}`}</Button>
          </View>
        </View>
        <View>
          <Button
            icon={() => <AnalyticsSVG width={20} height={20} />}
            mode="contained"
            color="red"
            style={{margin: 3}}
            onPress={() => {
              console.log(deviceTokenG + ':navigationSharedDeviceStatic');
              navigation.navigate('SharedDeviceStatistic', {
                idsensor: idsensor,
                sensor: sensor,
                device: device,
                deviceTokenG: deviceTokenG,
              });
            }}>
            Thống kê
          </Button>
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
                alignItems: 'datecenter',
                justifyContent: 'center',
              }}>
              <ServerDownSVG width={200} height={200} />
              <Button color="red" icon="server-network-off">
                Đã xảy ra lỗi !!!
              </Button>
            </View>
          ) : useSensor.length == 0 ? (
            <View></View>
          ) : (
            ListSensor
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SharedDeviceDetail;
