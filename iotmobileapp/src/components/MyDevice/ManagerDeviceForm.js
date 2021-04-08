import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {Switch, TextInput, Text, Button, Card, Title} from 'react-native-paper';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

// Environment
import env from '../../environment/environment';
const url9997 = env.PORT_9997;
const local_ip = env.IPLOCAL;

const ManagerDeviceForm = ({route}) => {
  const checkEmpty = (array) => {
    for (let a of array) {
      if (a.share == true) return true;
    }
    return false;
  };
  // ==>
  console.log('ROUTE PARAMS');
  console.log(JSON.stringify(route.params.refField, null, 2));

  const [iduser, setIdUser] = useState('');
  const [data_fields, setDataField] = useState(route.params.refField);
  const {device, user} = route.params;
  const [ispHSwitchOn, setIspHSwitchOn] = useState(true);
  const navigation = useNavigation();

  const onpHToggleSwitch = (sensorName) => {
    console.log(sensorName);
    let tempDataFields = data_fields;
    tempDataFields.find(
      (x) => x.field_name == sensorName,
    ).share = !tempDataFields.find((x) => x.field_name == sensorName).share;
    setDataField(tempDataFields);
    setIspHSwitchOn(!ispHSwitchOn);
  };

  const updateField = async () => {
    console.log(data_fields);
    let check = checkEmpty(data_fields);
    console.log(check);
    if (check == true) {
      const firebaseToken = await auth().currentUser.getIdToken();
      await axios({
        method: 'POST',
        url: `http://${local_ip}:4002/api/user/updatefieldshare`,
        headers: {
          authorization: `Bearer ${firebaseToken}`,
        },
        data: {
          deviceID: device.deviceID,
          email: user.email,
          sensors: data_fields,
        },
      })
        .then((res) => {
          alert('Cập nhật thành công');
          navigation.goBack();
        })
        .catch((error) => {
          alert('Cập nhật thất bại');
        });
    } else {
      alert('Vui lòng chọn ít nhất 1 cảm biến được chia sẽ');
    }
  };

  useEffect(() => {
    if (route.params.user != undefined) {
      console.log(route.params.user.email);
      setIdUser(route.params.user.email);
    }
  }, []);
  const SensorField = data_fields.map((sensor, index) => {
    return (
      <View key={index}>
        <Card style={{marginVertical: 3}}>
          <Card.Content>
            <View
              style={{
                justifyContent: 'center',
                alignContent: 'flex-start',
                alignItems: 'flex-start',
              }}>
              <Title>{`${sensor.field_display}: `}</Title>
              <Switch
                value={data_fields[index].share}
                onValueChange={() => onpHToggleSwitch(sensor.field_name)}
              />
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  });

  return (
    <View style={{paddingVertical: 60}}>
      <Card>
        <Card.Content>
          <Button icon="account">Cập nhật quyền xem</Button>
          <TextInput
            label="Email: "
            value={iduser}
            mode="outlined"
            editable={false}
            onChangeText={(value) => {
              setIdUser(value);
            }}
          />
          <Text></Text>
          <View>{SensorField}</View>
          <Text></Text>
          <Button mode="contained" onPress={updateField}>
            Cập nhật
          </Button>
          <Button
            mode="contained"
            color="red"
            style={{marginVertical: 10}}
            onPress={async () => {
              console.log(device);
              const firebaseToken = await auth().currentUser.getIdToken();
              await axios({
                method: 'POST',
                url: `http://${local_ip}:4002/api/user/revokeuser`,
                headers: {
                  authorization: `Bearer ${firebaseToken}`,
                },
                data: {
                  deviceID: device.deviceID,
                  auth: user.uid,
                  provider: device.auth,
                },
              })
                .then((res) => {
                  alert('Thu hồi thành công');
                  navigation.goBack();
                })
                .catch((error) => {
                  alert('Đã có lỗi xảy ra');
                });
            }}>
            Thu hồi quyền xem
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default ManagerDeviceForm;
