import React, {useState} from 'react';
import {View, Dimensions} from 'react-native';
import {Rect, Text} from 'react-native-svg';
import {LineChart} from 'react-native-chart-kit';

const Chart = ({unit, labels, data, timestamp_daxyly, data_daxuly}) => {
  let [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
    time: 0,
  });

  return (
    <LineChart
      data={{
        labels: [],
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
              width="105"
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
              {unit.field_display + ': ' + tooltipPos.value}
            </Text>
          </View>
        ) : null;
      }}
      width={Dimensions.get('window').width} // from react-native
      height={220}
      yAxisLabel=""
      yAxisSuffix={unit.field_unit}
      yAxisInterval={1} // optional, defaults to 1
      verticalLabelRotation={50}
      fromZero={true}
      yLabelsOffset={1}
      chartConfig={{
        backgroundColor: '#F94C7A',
        backgroundGradientFrom: '#F94C7A',
        backgroundGradientTo: '#F94C7A',
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: '3',
          strokeWidth: '2',
          stroke: '#ffa726',
        },
      }}
      style={{
        marginVertical: 0,
        borderRadius: 0,
      }}
    />
  );
};

export default Chart;
