import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Switch, TextInput, Text, Button, Card, Title} from 'react-native-paper';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

// Environment
import env from '../../environment/environment';
const url9997 = env.PORT_9997;
const local_ip = env.IPLOCAL;

const ManagerDeviceAddForm = ({route}) => {
  const checkEmpty = (array) => {
    for (let a of array) {
      if (a.share == true) return true;
    }
    return false;
  };
  // ==>
  const {device} = route.params;
  const [iduser, setIdUser] = useState('');
  const [data_fields, setDataField] = useState([]);
  const navigation = useNavigation();

  const [ispHSwitchOn, setIspHSwitchOn] = useState(false);
  const onpHToggleSwitch = (sensorName) => {
    console.log(sensorName);
    let tempDataFields = data_fields;
    tempDataFields.find(
      (x) => x.field_name == sensorName,
    ).share = !tempDataFields.find((x) => x.field_name == sensorName).share;
    setDataField(tempDataFields);
    setIspHSwitchOn(!ispHSwitchOn);
  };

  const submitShareDevice = async () => {
    console.log(data_fields);
    let check = checkEmpty(data_fields);
    if (check == true) {
      const firebaseToken = await auth().currentUser.getIdToken();
      await axios({
        method: 'POST',
        url: `http://${local_ip}:4002/api/user/sharedevice`,
        headers: {
          authorization: `Bearer ${firebaseToken}`,
        },
        data: {
          deviceID: device.deviceID,
          email: iduser,
          sensors: data_fields,
        },
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.success === false) alert(res.data.message);
          else {
            alert('Thêm thành công');
            navigation.goBack();
          }
        })
        .catch((error) => {
          console.log(error);
          alert('Đã có lỗi xảy ra');
        });
    } else {
      alert('Vui lòng chọn ít nhất 1 cảm biến');
    }
  };
  useEffect(() => {
    navigation.setOptions({title: `Thêm quyền truy xuất`});

    const sub = firestore()
      .collection('devices')
      .doc(route.params.device.deviceID)
      .onSnapshot((snapShot) => {
        console.log(snapShot.data().data_fields);
        if (snapShot.data().data_fields) {
          let temp_DataField = snapShot.data().data_fields;
          temp_DataField.map((field, index) => {
            temp_DataField[index].share = false;
          });
          setDataField(temp_DataField);
        }
        // setDataField(snapShot.data().data_fields);
      });
    return () => sub();
  }, []);
  console.log(data_fields);
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
          <Button icon="account">{`Chia sẽ quyền xem`}</Button>
          <TextInput
            label="Email: "
            value={iduser}
            mode="outlined"
            style={{marginBottom: 10}}
            onChangeText={(value) => {
              setIdUser(value);
            }}
          />
          <View>{SensorField}</View>
          <Button
            style={{marginTop: 10}}
            mode="contained"
            onPress={submitShareDevice}>
            Thêm
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default ManagerDeviceAddForm;
