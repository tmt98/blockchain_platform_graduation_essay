import React, {useState, useEffect} from 'react';
import {Buffer} from 'buffer';
global.Buffer = Buffer; // very important
import 'react-native-gesture-handler';

import auth from '@react-native-firebase/auth';

import NetInfo from '@react-native-community/netinfo';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import store from './src/redux/store';

import Navigation from './src/components/Navigation';
import {View, Text} from 'react-native';

import NoInternet from './src/components/NoInternet';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return (
    <StoreProvider store={store}>
      <PaperProvider>
        {isConnected ? (
          <Navigation />
        ) : (
          <View>
            <NoInternet />
          </View>
        )}
      </PaperProvider>
    </StoreProvider>
  );
};
export default App;
// const App = () => {
//   // Set an initializing state whilst Firebase connects
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState();

//   // Handle user state changes
//   function onAuthStateChanged(user) {
//     setUser(user);
//     if (initializing) setInitializing(false);
//   }

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     return subscriber; // unsubscribe on unmount
//   }, []);

//   if (initializing) return null;

//   if (!user) {
//     return (
//       <View>
//         <Main />
//         <Login />
//       </View>
//     );
//   }

//   return (
//     <View>
//       <Text>Welcome {user.email}</Text>
//     </View>
//   );
// };
