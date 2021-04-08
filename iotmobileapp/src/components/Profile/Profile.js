import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import {Avatar, Divider, Text, Subheading, Button} from 'react-native-paper';
import {GoogleSignin} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import Timeline from 'react-native-timeline-flatlist';
// import ACCOUNT from '../../image/account.svg';
import TimelineSVG from '../../svg/icons/navigation/timeline3.svg';
import LogoutSVG from '../../svg/icons/navigation/logout1.svg';

const Profile = () => {
  const current_user = auth().currentUser;
  auth()
    .currentUser.getIdToken()
    .then((a) => {
      console.log(a);
    });
  const timeline_data = [
    {time: '09:00', title: 'Event 1', description: 'Event 1 Description'},
    {time: '10:45', title: 'Event 2', description: 'Event 2 Description'},
    {time: '12:00', title: 'Event 3', description: 'Event 3 Description'},
    {time: '14:00', title: 'Event 4', description: 'Event 4 Description'},
    {time: '16:30', title: 'Event 5', description: 'Event 5 Description'},
  ];

  return (
    <View>
      <ScrollView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 10,
            margin: 10,
          }}>
          <Button>{current_user ? current_user.displayName : 'NULL'}</Button>
          <Divider />
          <Avatar.Image
            size={70}
            source={{uri: current_user.photoURL}}
            style={{margin: 10}}
          />
          <Text>{current_user ? current_user.email : 'NULL'}</Text>
          <View>
            <Button
              icon={() => <LogoutSVG width={20} height={20} />}
              mode="contained"
              color="red"
              onPress={async () => {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
                auth()
                  .signOut()
                  .then(() => console.log('Log Out'));
              }}
              style={{margin: 10}}>
              Đăng xuất
            </Button>
          </View>
        </View>
        <View>
          {/* <Button
            icon={() => (
              <TimelineSVG width={25} height={25} style={{margin: 10}} />
            )}
            mode="contained"
            style={{
              marginLeft: 5,
              marginRight: 5,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
            }}>
            Timeline
          </Button> */}
          {/* <Timeline
            style={{
              backgroundColor: 'white',
              marginHorizontal: 5,
              padding: 5,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
            data={[
              {
                time: '09:00',
                title: 'Độ pH vượt mức cảnh báo',
                description: 'pH: 11',
              },
              {
                time: '10:45',
                title: 'Độ pH vượt mức cảnh báo',
                description: 'pH: 11',
              },
              {
                time: '12:00',
                title: 'Độ pH vượt mức cảnh báo',
                description: 'pH: 11',
              },
              {
                time: '14:00',
                title: 'Độ pH vượt mức cảnh báo',
                description: 'pH: 11',
              },
              {
                time: '16:30',
                title: 'Độ pH vượt mức cảnh báo',
                description: 'pH: 11',
              },
            ]}
          /> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
