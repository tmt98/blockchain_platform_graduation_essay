import React, {useState} from 'react';
import {BottomNavigation} from 'react-native-paper';

import MyDevice from './MyDevice/MyDevice';
import SharedDevice from './SharedDevice/SharedDevice';
import Profile from './Profile/Profile';
import MyDeviceSVG from '../svg/icons/navigation/mydevice.svg';

const BottomNavigationG = () => {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {
      key: 'mydevice',
      title: 'My Device',
      icon: 'access-point',
      color: '#3F51B5',
    },
    {
      key: 'shareddevice',
      title: 'Shared Device',
      icon: 'access-point-network',
      color: '#009688',
    },
    {
      key: 'profile',
      title: 'Profile',
      icon: 'account-circle-outline',
      color: '#607D8B',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    mydevice: MyDevice,
    shareddevice: SharedDevice,
    profile: Profile,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      // renderIcon={() => <MyDeviceSVG width={25} height={25} />}
    />
  );
};

export default BottomNavigationG;
