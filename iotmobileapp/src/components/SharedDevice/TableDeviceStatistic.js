import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, Dimensions, Text} from 'react-native';
import {
  Button,
  DataTable,
  ActivityIndicator,
  Colors,
  Title,
} from 'react-native-paper';
import {TabView, SceneMap} from 'react-native-tab-view';
import Timeline from 'react-native-timeline-flatlist';
import ChartComponent from './Chart';

const TableDeviceStatistic = ({data_fields, data}) => {
  const [index, setIndex] = useState(0);
  console.log('TABLEDEVICESTATISTIC');
  console.log(data_fields);
  console.log(data);
  let routeState = [];
  let renderSceneState = {};

  data_fields.map((unit, index) => {
    routeState.push({key: unit.field_name, title: unit.field_display});
    let data_daxuly = [];
    let timestamp_daxyly = [];
    let time_daxuly = [];
    var TempRoute = () => {
      if (data === undefined)
        return (
          <View style={{paddingTop: 40}}>
            <ActivityIndicator animating={true} color={Colors.red800} />
          </View>
        );
      if (data.length === 0)
        return (
          <View
            style={{
              paddingTop: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Title>Không có dữ liệu</Title>
          </View>
        );

      data.map((data, index) => {
        data_daxuly.push(data.data[unit.field_name]);
        let date = new Date(data.data['timestamp'] * 1000).toLocaleDateString();
        let time = new Date(data.data['timestamp'] * 1000);
        timestamp_daxyly.push(date);
        time_daxuly.push(time);
      });
      console.log(data_daxuly);
      const maxVal = data_daxuly.reduce(
        (max, val) =>
          val > max._max
            ? {_max: val, _idx: max._curr, _curr: max._curr + 1}
            : {_max: max._max, _idx: max._idx, _curr: max._curr + 1},
        {_max: data_daxuly[0], _idx: 0, _curr: 0},
      );
      const minVal = data_daxuly.reduce(
        (min, val) =>
          val < min._min
            ? {_min: val, _idx: min._curr, _curr: min._curr + 1}
            : {_min: min._min, _idx: min._idx, _curr: min._curr + 1},
        {_min: data_daxuly[0], _idx: 0, _curr: 0},
      );
      const averageVal =
        data_daxuly.reduce((a, b) => a + b, 0) / data_daxuly.length;
      console.log(maxVal);
      return (
        <View>
          <View
            style={{
              // borderBottomLeftRadius: 15,
              // borderBottomRightRadius: 15,
              backgroundColor: 'white',
              margin: 0,
            }}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>{unit.field_display}</DataTable.Title>
                <DataTable.Title>Unit</DataTable.Title>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Time</DataTable.Title>
              </DataTable.Header>
              <DataTable.Row>
                <DataTable.Cell>Maximum</DataTable.Cell>
                <DataTable.Cell>{maxVal._max}</DataTable.Cell>
                <DataTable.Cell>
                  {/* {timestampToDate(fake_data.data[unit.field_name].max.date)} */}
                  {timestamp_daxyly[maxVal._idx]}
                </DataTable.Cell>
                <DataTable.Cell>
                  {/* {timestampToHour(fake_data.data[unit.field_name].max.date)} */}
                  {`${time_daxuly[maxVal._idx].getHours()}:${time_daxuly[
                    maxVal._idx
                  ].getMinutes()}:${time_daxuly[maxVal._idx].getSeconds()}`}
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Minimum</DataTable.Cell>
                <DataTable.Cell>{minVal._min}</DataTable.Cell>
                <DataTable.Cell>{timestamp_daxyly[minVal._idx]}</DataTable.Cell>
                <DataTable.Cell>
                  {`${time_daxuly[minVal._idx].getHours()}:${time_daxuly[
                    minVal._idx
                  ].getMinutes()}:${time_daxuly[minVal._idx].getSeconds()}`}
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Average</DataTable.Cell>
                <DataTable.Cell>{averageVal}</DataTable.Cell>
                <DataTable.Cell></DataTable.Cell>
                <DataTable.Cell></DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </View>
          <View>
            <Button>Biểu đồ sự thay đổi</Button>
            <ChartComponent
              key={index}
              unit={unit}
              timestamp_daxyly={timestamp_daxyly.reverse()}
              data_daxuly={data_daxuly.reverse()}
            />
            <Button>History</Button>
            <SafeAreaView>
              <Timeline
                style={{backgroundColor: 'white'}}
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
              />
            </SafeAreaView>
          </View>
        </View>
      );
    };

    renderSceneState[unit.field_name] = TempRoute;
    console.log(renderSceneState);
  });
  const [routes] = useState(routeState);
  const renderScene = SceneMap(renderSceneState);
  const initialLayout = {width: Dimensions.get('window').width};

  return (
    <View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
    </View>
  );
};

export default TableDeviceStatistic;
