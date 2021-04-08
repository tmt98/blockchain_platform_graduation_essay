import React, {useState, useEffect} from 'react';
import {Button} from 'react-native';
import {Button as ButtonPaper, Avatar} from 'react-native-paper';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Main from './Main';

import Login from './Authentication/Login';
import SignUp from './Authentication/SignUp';

import MyDeviceDetail from './MyDevice/MyDeviceDetail';
import ManagerDevice from './MyDevice/ManagerDevice';
import ManagerDeviceForm from './MyDevice/ManagerDeviceForm';
import ManagerDeviceAddForm from './MyDevice/ManagerDeviceAddForm';
import MyDeviceStatistic from './MyDevice/MyDeviceStatistic';
import MyDeviceStatisticDetail from './MyDevice/MyDeviceStatisticDetail';

import SharedDeviceDetail from './SharedDevice/SharedDeviceDetail';
import SharedDeviceStatistic from './SharedDevice/SharedDeviceStatistic';
import SharedDeviceStatisticDetail from './SharedDevice/SharedDeviceStatisticDetail';

import auth from '@react-native-firebase/auth';

const authScreens = {
  Login: Login,
  SignUp: SignUp,
};
const userScreens = {
  Main: Main,
  MyDeviceDetail: MyDeviceDetail,
  ManagerDevice: ManagerDevice,
  ManagerDeviceForm: ManagerDeviceForm,
  ManagerDeviceAddForm: ManagerDeviceAddForm,
  SharedDeviceDetail: SharedDeviceDetail,
  MyDeviceStatistic: MyDeviceStatistic,
  MyDeviceStatisticDetail: MyDeviceStatisticDetail,
  SharedDeviceStatistic: SharedDeviceStatistic,
  SharedDeviceStatisticDetail: SharedDeviceStatisticDetail,
};
const Stack = createStackNavigator();
const Navigation = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const onAutoStateChanged = (user) => {
    console.log(
      `\n-------------------------------- CURRENT USER: --------------------------------\n${JSON.stringify(
        user,
        null,
        2,
      )}\n-------------------------------------------------------------------------------`,
    );
    setUser(user);
    if (initializing) setInitializing(false);
  };
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAutoStateChanged);
    return subscriber;
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {Object.entries({
          ...(user ? userScreens : authScreens),
        }).map(([name, component]) =>
          user ? (
            <Stack.Screen
              key={name}
              name={name}
              component={component}
              options={{
                headerRight: () => (
                  <Avatar.Image
                    size={45}
                    source={{uri: user.photoURL}}
                    style={{margin: 3}}
                  />
                ),
              }}
            />
          ) : (
            <Stack.Screen key={name} name={name} component={component} />
          ),
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
