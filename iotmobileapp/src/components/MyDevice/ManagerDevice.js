import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Card, Avatar, List, Button, Subheading} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Environment
import env from '../../environment/environment';
const url9997 = env.PORT_9997;
const local_ip = env.IPLOCAL;

import DeviceSVG from '../../svg/icons/navigation/ph-sensor.svg';

const ManagerDevice = ({route}) => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const {idsensor, sensor, device} = route.params;

  useEffect(() => {
    navigation.setOptions({title: `Quản lý quyền thiết bị`});

    firestore()
      .collection('devices')
      .doc(device.deviceID)
      .onSnapshot(async (snapShot) => {
        const firebaseToken = await auth().currentUser.getIdToken();
        console.log(firebaseToken);
        console.log(snapShot.data().refUser);
        const result = await axios({
          method: 'POST',
          url: `http://${local_ip}:4002/api/user/getrefuserinfo`,
          headers: {
            authorization: `Bearer ${firebaseToken}`,
          },
          data: {
            refUsers: snapShot.data().refUser,
            deviceID: device.deviceID,
          },
        });
        console.log('RESULT DATA');
        console.log(result.data.users);
        if (result != undefined) setData(result.data.users);
      });
  }, []);

  // console.log(useUserShared.length);
  console.log(data);
  const ListUserShared = data.map((user, index) => {
    return (
      <View style={{margin: 3, borderRadius: 10, backgroundColor: 'white'}}>
        <List.Item
          key={index}
          title={user.displayName}
          description={`Email: ${user.email}`}
          left={() => (
            <Avatar.Image
              style={{marginVertical: 10}}
              size={33}
              source={{uri: user.photoURL}}
            />
          )}
          right={() => <List.Icon icon="account-edit" />}
          onPress={async () => {
            const {uid} = auth().currentUser;
            const firebaseToken = await auth().currentUser.getIdToken();
            await axios({
              method: 'POST',
              url: `http://${local_ip}:4002/api/user/getuserfield`,
              headers: {
                authorization: `Bearer ${firebaseToken}`,
              },
              data: {
                auth: user.uid,
                provider: uid,
                deviceID: device.deviceID,
              },
            }).then((res) => {
              console.log(res.data);
              navigation.push('ManagerDeviceForm', {
                idsensor: idsensor,
                sensor: sensor,
                device: device,
                user: user,
                refField: res.data.data,
              });
            });
          }}
        />
      </View>
    );
  });

  return (
    <View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginBottom: 66,
          backgroundColor: 'white',
          borderRadius: 10,
        }}>
        <View style={{width: '100%'}}>
          <Card.Title
            title={device.deviceID}
            subtitle={`Chủ thiết bị: ${device.email}`}
            left={() => (
              <Avatar.Icon
                size={40}
                icon={() => <DeviceSVG width={25} height={25} />}
              />
            )}
          />
        </View>
      </View>
      {/* <Button>List Shared</Button> */}
      <View style={{margin: 3}}>
        <Button
          mode="contained"
          icon="account-plus"
          onPress={() => {
            navigation.navigate('ManagerDeviceAddForm', {
              idsensor: idsensor,
              sensor: sensor,
              device: device,
            });
          }}>
          Chia sẽ máy
        </Button>
      </View>
      <Subheading style={{marginLeft: 20, marginTop: 20}}>
        Danh sách được chia sẽ:
      </Subheading>
      <View style={{marginBottom: 20}}>{ListUserShared}</View>
    </View>
  );
};

export default ManagerDevice;
