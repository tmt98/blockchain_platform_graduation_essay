import React, {useState, useEffect, useCallback} from 'react';
import {View, ScrollView, RefreshControl, Alert} from 'react-native';
import {Button, RadioButton, Searchbar, Text, Title} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

// SVG Component
import IOTSvg from '../../svg/icons/navigation/iotdevice1.svg';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {List} from 'react-native-paper';

import NODATA from '../../image/nodata.svg';

// Environment
import env from '../../environment/environment';
const url9997 = env.PORT_9997;
const local_ip = env.IPLOCAL;
const url = env.BASE_URL;

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const MyDevice = () => {
  const [data, setData] = useState([]);
  const [searchType, setSearchType] = React.useState('deviceID');
  const [searchStatus, setSearchStatus] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [tempKey, setTempKey] = useState('');

  // // const tokenList = useSelector((state) => state);
  // const dispatch = useDispatch();
  // const addToken = useCallback((token) => dispatch(addToken(token)), [
  //   dispatch,
  // ]);
  // // console.log(tokenList);

  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    console.log(`\nRender Mydevice\n`);
    setRefreshing(true);

    wait(2000).then(() => {
      setSearchStatus(false);
      setSearchKey('');
      setRefreshing(false);
    });
  });

  useEffect(() => {
    const {uid} = auth().currentUser;
    const subscriber = firestore()
      .collection('devices')
      .where('auth', '==', uid)
      .onSnapshot(async (snapShot) => {
        let data_firestore = [];
        snapShot.forEach((doc) => {
          const doc_data = doc.data();
          doc_data.deviceID = doc.id;
          data_firestore.push(doc_data);
        });
        await setData(data_firestore);
      });
    return () => subscriber();
  }, []);

  const SearchListDevice = data.map((device, index) => {
    if (searchType == 'deviceID' && searchStatus == true) {
      if (device.actived == true && device.deviceID.includes(searchKey))
        return (
          <List.Item
            style={{
              margin: 7,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: 'white',
              borderRadius: 10,
              height: 'auto',
            }}
            key={index}
            title={device.device_name}
            titleStyle={{fontWeight: 'bold'}}
            description={`ID: ${device.deviceID} - Mô tả: ${device.device_desc} - Ngày tạo máy: ${device.date}`}
            left={() => (
              <List.Icon
                style={{justifyContent: 'center', alignItems: 'center'}}
                icon={() => <IOTSvg width={50} height={50} />}
              />
            )}
            onPress={async () => {
              const {uid} = auth().currentUser;
              const firebaseToken = await auth().currentUser.getIdToken();
              console.log(firebaseToken);

              await firestore()
                .collection('bcAccounts')
                .where('auth', '==', uid)
                .where('deviceID', '==', device.deviceID)
                .get()
                .then((res) => {
                  res.forEach(async (doc) => {
                    console.log(device.deviceID);
                    let bcAccount = doc.data();
                    const result = await axios({
                      method: 'POST',
                      url: `http://${local_ip}:4002/api/user/gettoken`,
                      headers: {
                        authorization: `Bearer ${firebaseToken}`,
                      },
                      data: {
                        deviceID: bcAccount.deviceID,
                        bcIdentity: bcAccount.bcIdentity,
                      },
                    }).then((tokenResponse) => {
                      RNSecureKeyStore.set(
                        bcAccount.deviceID,
                        tokenResponse.data.token,
                        {
                          accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
                        },
                      ).then(
                        (res) => {
                          console.log(`My Device: ${res}`);
                        },
                        (error) => {
                          console.log('RNSecureKeyStore ERROR:');
                          console.log(error);
                        },
                      );
                      navigation.push('MyDeviceDetail', {
                        idsensor: device.deviceID,
                        sensor: device.device_name,
                        device: device,
                        bcAccount: bcAccount,
                        firebaseToken: firebaseToken,
                        deviceTokenG: tokenResponse.data.token,
                      });
                    });
                  });
                });
            }}
          />
        );
      if (device.actived == false && device.deviceID.includes(searchKey)) {
        return (
          <List.Item
            style={{
              margin: 7,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: 'lightgrey',
              opacity: 0.6,
              borderRadius: 10,
              height: 'auto',
              color: 'red',
            }}
            key={index}
            disabled={true}
            title={device.device_name + ' [Chưa kích hoạt]'}
            titleStyle={{fontWeight: 'bold'}}
            description={`ID: ${device.deviceID} - Mô tả: ${device.device_desc} - Ngày tạo máy: ${device.date}`}
            left={() => (
              <List.Icon
                style={{justifyContent: 'center', alignItems: 'center'}}
                icon={() => <IOTSvg width={50} height={50} />}
              />
            )}
            onPress={() => {
              alert('Máy chưa được kích hoạt');
            }}
          />
        );
      }
    }
    if (searchType == 'device_name' && searchStatus == true) {
      if (device.actived == true && device.device_name.includes(searchKey))
        return (
          <List.Item
            style={{
              margin: 7,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: 'white',
              borderRadius: 10,
              height: 'auto',
            }}
            key={index}
            title={device.device_name}
            titleStyle={{fontWeight: 'bold'}}
            description={`ID: ${device.deviceID} - Mô tả: ${device.device_desc} - Ngày tạo máy: ${device.date}`}
            left={() => (
              <List.Icon
                style={{justifyContent: 'center', alignItems: 'center'}}
                icon={() => <IOTSvg width={50} height={50} />}
              />
            )}
            onPress={async () => {
              const {uid} = auth().currentUser;
              const firebaseToken = await auth().currentUser.getIdToken();
              console.log(firebaseToken);

              await firestore()
                .collection('bcAccounts')
                .where('auth', '==', uid)
                .where('deviceID', '==', device.deviceID)
                .get()
                .then((res) => {
                  res.forEach(async (doc) => {
                    console.log(device.deviceID);
                    let bcAccount = doc.data();
                    const result = await axios({
                      method: 'POST',
                      url: `http://${local_ip}:4002/api/user/gettoken`,
                      headers: {
                        authorization: `Bearer ${firebaseToken}`,
                      },
                      data: {
                        deviceID: bcAccount.deviceID,
                        bcIdentity: bcAccount.bcIdentity,
                      },
                    }).then((tokenResponse) => {
                      RNSecureKeyStore.set(
                        bcAccount.deviceID,
                        tokenResponse.data.token,
                        {
                          accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
                        },
                      ).then(
                        (res) => {
                          console.log(`My Device: ${res}`);
                        },
                        (error) => {
                          console.log('RNSecureKeyStore ERROR:');
                          console.log(error);
                        },
                      );
                      navigation.push('MyDeviceDetail', {
                        idsensor: device.deviceID,
                        sensor: device.device_name,
                        device: device,
                        bcAccount: bcAccount,
                        firebaseToken: firebaseToken,
                        deviceTokenG: tokenResponse.data.token,
                      });
                    });
                  });
                });
            }}
          />
        );
      if (device.actived == false && device.device_name.includes(searchKey)) {
        return (
          <List.Item
            style={{
              margin: 7,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: 'lightgrey',
              opacity: 0.6,
              borderRadius: 10,
              height: 'auto',
              color: 'red',
            }}
            disabled={true}
            key={index}
            title={device.device_name + ' [Chưa kích hoạt]'}
            titleStyle={{fontWeight: 'bold'}}
            description={`ID: ${device.deviceID} - Mô tả: ${device.device_desc} - Ngày tạo máy: ${device.date}`}
            left={() => (
              <List.Icon
                style={{justifyContent: 'center', alignItems: 'center'}}
                icon={() => <IOTSvg width={50} height={50} />}
              />
            )}
            onPress={() => {
              alert('Máy chưa được kích hoạt');
            }}
          />
        );
      }
    }
  });

  const ListDevice = data.map((device, index) => {
    if (device.actived == false)
      return (
        <List.Item
          style={{
            margin: 7,
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: 'lightgrey',
            opacity: 0.6,
            borderRadius: 10,
            height: 'auto',
          }}
          disabled={true}
          key={index}
          title={device.device_name + ' [Chưa kích hoạt]'}
          titleStyle={{fontWeight: 'bold'}}
          description={`ID: ${device.deviceID} - Mô tả: ${device.device_desc} - Ngày tạo máy: ${device.date}`}
          left={() => (
            <List.Icon
              style={{justifyContent: 'center', alignItems: 'center'}}
              icon={() => <IOTSvg width={50} height={50} />}
            />
          )}
          onPress={() => {
            alert('Máy chưa được kích hoạt');
          }}
        />
      );
    return (
      <List.Item
        style={{
          margin: 7,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: 'white',
          borderRadius: 10,
          height: 'auto',
        }}
        key={index}
        title={device.device_name}
        titleStyle={{fontWeight: 'bold'}}
        description={`ID: ${device.deviceID} - Mô tả: ${device.device_desc} - Ngày tạo máy: ${device.date}`}
        left={() => (
          <List.Icon
            style={{justifyContent: 'center', alignItems: 'center'}}
            icon={() => <IOTSvg width={50} height={50} />}
          />
        )}
        onPress={async () => {
          const {uid} = auth().currentUser;
          const firebaseToken = await auth().currentUser.getIdToken();
          console.log(firebaseToken);

          await firestore()
            .collection('bcAccounts')
            .where('auth', '==', uid)
            .where('deviceID', '==', device.deviceID)
            .get()
            .then((res) => {
              res.forEach(async (doc) => {
                console.log(device.deviceID);
                let bcAccount = doc.data();
                const result = await axios({
                  method: 'POST',
                  url: `http://${local_ip}:4002/api/user/gettoken`,
                  headers: {
                    authorization: `Bearer ${firebaseToken}`,
                  },
                  data: {
                    deviceID: bcAccount.deviceID,
                    bcIdentity: bcAccount.bcIdentity,
                  },
                }).then((tokenResponse) => {
                  RNSecureKeyStore.set(
                    bcAccount.deviceID,
                    tokenResponse.data.token,
                    {
                      accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
                    },
                  ).then(
                    (res) => {
                      console.log(`My Device: ${res}`);
                    },
                    (error) => {
                      console.log('RNSecureKeyStore ERROR:');
                      console.log(error);
                    },
                  );
                  navigation.push('MyDeviceDetail', {
                    idsensor: device.deviceID,
                    sensor: device.device_name,
                    device: device,
                    bcAccount: bcAccount,
                    firebaseToken: firebaseToken,
                    deviceTokenG: tokenResponse.data.token,
                  });
                });
              });
            });
        }}
      />
    );
  });

  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{width: '100%'}}>
          <List.Section>
            <List.Subheader>Thiết bị của tôi</List.Subheader>
            <View
              style={{
                marginHorizontal: 10,
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 10,
              }}>
              <Searchbar
                placeholder=""
                value={tempKey}
                onChangeText={(e) => setTempKey(e)}
                onIconPress={() => {
                  setSearchKey(tempKey);
                  setTempKey('');
                  setSearchStatus(true);
                }}
              />

              <RadioButton.Group
                onValueChange={(newValue) => {
                  setSearchKey('');
                  setSearchType(newValue);
                }}
                value={searchType}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                  }}>
                  <View>
                    <RadioButton value="deviceID" />
                  </View>
                  <View style={{width: '30%'}}>
                    <Title>Theo ID</Title>
                  </View>
                  <View>
                    <RadioButton value="device_name" />
                  </View>
                  <View style={{width: '40%'}}>
                    <Title>Theo tên máy</Title>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
            {SearchListDevice.length === 0 && searchStatus === true ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <NODATA
                  style={{padding: 30, margin: 30}}
                  width={100}
                  height={100}
                />
                <Button mode="contained" onPress={onRefresh}>
                  Press Or Swipe To Refresh
                </Button>
              </View>
            ) : (
              SearchListDevice
            )}
            {ListDevice.length === 0 && searchStatus === false ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <NODATA
                  style={{padding: 30, margin: 30}}
                  width={100}
                  height={100}
                />
                <Button mode="contained" onPress={onRefresh}>
                  Press Or Swipe To Refresh
                </Button>
              </View>
            ) : ListDevice.length > 0 && searchStatus === false ? (
              ListDevice
            ) : (
              <></>
            )}
          </List.Section>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyDevice;
