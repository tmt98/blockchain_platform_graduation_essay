import React, {useState} from 'react';
import {BottomNavigation, Text} from 'react-native-paper';

// import MyDeviceDetail from './MyDeviceDetail';
const MyDeviceDetail = () => <Text>ABC</Text>;
import ManagerDevice from './ManagerDevice';

const MyDeviceNavigation = () => {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {key: 'detaildevice', title: 'My Device', icon: 'access-point'},
    {
      key: 'managerdevice',
      title: 'Manager Device',
      icon: 'cloud',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    detaildevice: MyDeviceDetail,
    managerdevice: ManagerDevice,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default MyDeviceNavigation;
