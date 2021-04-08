import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';

import LOGINIMAGE from '../../image/login-background-1.svg';

GoogleSignin.configure({
  webClientId:
    '976679303624-ejpbb5ikor6b6tk3cm5r73i9vaeurhdk.apps.googleusercontent.com',
});

const Login = ({navigation}) => {
  useEffect(() => {
    navigation.setOptions({title: `Đăng nhập`});
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    // Get the users ID token
    console.log('sign in');
    const {idToken} = await GoogleSignin.signIn();
    console.log(
      `\n---------------------------------------- TOKEN ----------------------------------------\n${JSON.stringify(
        idToken,
        null,
        2,
      )}\n--------------------------------------------------------------------------------------`,
    );
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };

  const handdleLogin = () => {
    console.log('HANDLE LOGIN');
    if (email == '' || password == '') {
      alert('Please fill email & password');
    } else {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('Signed In!');
        })
        .catch((error) => {
          console.log(error);
          alert(error.message);
        });
    }
  };

  return (
    <View style={styles.container}>
      {/* <TextInput
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={(value) => {
          setEmail(value);
        }}
        value={email}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        onChangeText={(value) => {
          setPassword(value);
          device;
        }}
        value={password}
        style={styles.textInput}
      />
      <Text />
      <Button
        title="                    Login                   "
        style={styles.button}
        onPress={handdleLogin}
      />

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SignUp');
        }}>
        <Text>Sign Up</Text>
      </TouchableOpacity> */}
      <LOGINIMAGE style={{padding: 10, margin: 30}} width={300} height={300} />
      <GoogleSigninButton
        style={{width: 200, height: 60}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    width: '90%',
    // borderColor: 'blue',
    // borderWidth: 1,
    marginTop: 8,
    // borderRadius: 5,
  },
  button: {
    marginTop: 8,
    paddingTop: 8,
  },
  signUpButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Login;
