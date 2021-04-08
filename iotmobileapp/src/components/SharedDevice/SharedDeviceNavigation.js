import React, {useState, useEffect} from 'react';
import {View, Dimensions, ScrollView} from 'react-native';
import {Button, Text, Card, Avatar} from 'react-native-paper';
import {LineChart} from 'react-native-chart-kit';
import {useNavigation} from '@react-navigation/native';

const SharedDeviceNavigation = ({route}) => {
  const {idsensor, sensor} = route.params;
  const navigation = useNavigation();
  navigation.setOptions({title: device.deviceID});
  console.log(route);
  return (
    <View>
      <ScrollView>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flext: 0.5, width: '50%'}}>
            <Card.Title
              title={'ID : ' + route.params.sensor}
              subtitle="Owner: user1"
              left={() => <Avatar.Icon size={40} icon="access-point" />}
            />
          </View>
          <View style={{width: '50%'}}>
            <Card.Title
              title="100%"
              left={() => <Avatar.Icon size={40} icon="battery" />}
            />
          </View>
        </View>
        <View>
          <Button
            icon="account-tie"
            mode="contained"
            onPress={() => {
              navigation.navigate('ManagerDevice');
            }}>
            Manager
          </Button>
        </View>
        <View>
          <Button icon="temperature-celsius">Temperature</Button>
          <LineChart
            data={{
              labels: ['11:10', '11:25', '11:40', '11:55', '12:10', '12:25'],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
              ],
            }}
            width={Dimensions.get('window').width} // from react-native
            height={200}
            yAxisLabel=""
            yAxisSuffix="*C"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#e21a00',
              backgroundGradientFrom: '#000',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <Button icon="ruler">Ph</Button>
          <LineChart
            data={{
              labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',import React from 'react';
                import {View} from 'react-native';
                
                const SharedDeviceNavigation = () => {
                  return <View></View>;
                };
                
                export default SharedDeviceNavigation;
                
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
              ],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
              ],
            }}
            width={Dimensions.get('window').width} // from react-native
            height={200}
            yAxisLabel="$"
            yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <Button icon="cloud">humidity</Button>
          <LineChart
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June'],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
              ],
            }}
            width={Dimensions.get('window').width} // from react-native
            height={200}
            yAxisLabel="$"
            yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
        {/* <MyDeviceNavigation /> */}
      </ScrollView>
    </View>
  );
};

export default SharedDeviceNavigation;
