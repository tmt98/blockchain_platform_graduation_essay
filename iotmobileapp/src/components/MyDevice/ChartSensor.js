import React, {useState, useEffect} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {Button, Subheading, Card, Title, Paragraph} from 'react-native-paper';
import {LineChart} from 'react-native-chart-kit';
import {Text, Rect, Circle} from 'react-native-svg';

const ChartSensor = ({sensor, index, timestamp_daxyly, data_daxuly}) => {
  let [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
    time: 0,
  });
  console.log(data_daxuly);
  if (data_daxuly[0] === undefined) return <View></View>;
  return (
    <View key={index}>
      <Button mode="contained" style={{borderRadius: 0, marginVertical: 3}}>
        {sensor.field_display}
      </Button>

      <Card style={{marginHorizontal: 3}}>
        <View style={styles.container2c}>
          <View style={styles.itemW50}>
            <Card.Content>
              <Button icon="calendar">Thời gian</Button>
              <Button>{timestamp_daxyly[timestamp_daxyly.length - 1]}</Button>
            </Card.Content>
          </View>
          <View style={styles.itemW30}>
            <Card.Content>
              <Title style={{fontSize: 30}}>{`${
                data_daxuly[data_daxuly.length - 1]
              } ${sensor.field_unit}`}</Title>
              {/* <Paragraph></Paragraph> */}
            </Card.Content>
          </View>
        </View>
      </Card>
      <LineChart
        data={{
          labels: timestamp_daxyly,
          datasets: [
            {
              data: data_daxuly,
              labels: timestamp_daxyly,
            },
          ],
        }}
        onDataPointClick={(data) => {
          console.log(data);
          let isSamePoint = tooltipPos.x === data.x && tooltipPos.y === data.y;
          isSamePoint
            ? setTooltipPos((previousState) => {
                return {
                  ...previousState,
                  value: data.value,
                  time: data.dataset.labels[data.index],
                  visible: !previousState.visible,
                };
              })
            : setTooltipPos({
                x: data.x,
                value: data.value,
                time: data.dataset.labels[data.index],
                y: data.y,
                visible: true,
              });
        }}
        decorator={() => {
          return tooltipPos.visible ? (
            <View>
              <Rect
                x={tooltipPos.x - 45}
                y={tooltipPos.y + 10}
                width="100"
                height="44"
                fill="white"
                strokeWidth="1"
                stroke="blue"
              />
              <Text
                x={tooltipPos.x + -40}
                y={tooltipPos.y + 30}
                fill="black"
                fontSize="13"
                // fontWeight="bold"
                textAnchor="start">
                {'Time: ' + tooltipPos.time}
              </Text>
              <Text
                x={tooltipPos.x - 40}
                y={tooltipPos.y + 45}
                fill="black"
                fontSize="13"
                // fontWeight="bold"
                textAnchor="start">
                {sensor.field_display + ': ' + tooltipPos.value}
              </Text>
            </View>
          ) : null;
        }}
        width={Dimensions.get('window').width} // from react-native
        height={300}
        yAxisLabel=""
        yAxisSuffix={sensor.field_unit}
        yAxisInterval={10000} // optional, defaults to 1
        verticalLabelRotation={50}
        fromZero={true}
        yLabelsOffset={1}
        segments={5}
        chartConfig={{
          backgroundColor: 'white',
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '2',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        style={{
          margin: 5,
          borderRadius: 5,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container2c: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  itemW50: {
    width: '50%',
  },
  itemW30: {
    width: '30%',
  },
  itempM3: {
    margin: 3,
  },
});

export default ChartSensor;
