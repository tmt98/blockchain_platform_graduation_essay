import * as React from 'react'
import { useStyletron } from 'baseui'
import { Zap, Activity } from 'react-feather'
// import moment from 'moment';

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts'

// moment().zone(7)

// const CustomizedLabel = ({ x, y, stroke, value }: any) => {

//   return <text x={x} y={y} dy={-10} fill="#ec157a" fontSize={12} textAnchor="middle">{value}</text>

// }

const CustomizedAxisTick = ({ x, y, stroke, payload }: any) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dx={20}
        dy={16}
        textAnchor="end"
        fill="#000000"
        fontWeight="bold"
        fontSize={10}
        transform="rotate(-20)"
      >
        {payload.value}
      </text>
    </g>
  )
}

const Display = ({ field, data, history }: any) => {
  const [css, theme] = useStyletron()
  const space = css({ marginBottom: theme.sizing.scale500 })

  return (
    <>
      <div
        className={css({
          backgroundColor: theme.colors.mono100,
          ...theme.borders.border200,
          borderTopLeftRadius: theme.sizing.scale400,
          borderBottomRightRadius: theme.sizing.scale400,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          marginRight: theme.sizing.scale600,
          marginBottom: theme.sizing.scale300,
        })}
      >
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            paddingTop: theme.sizing.scale600,
            paddingLeft: theme.sizing.scale800,
            paddingRight: theme.sizing.scale800,
          })}
        >
          <div className={css({ marginRight: theme.sizing.scale800 })}>
            <Zap color={theme.colors.accent200} size={24} />
          </div>
          <div>
            <div className={css({ ...theme.typography.font400 })}>
              {field.field_display}
            </div>
            <div
              className={css({
                color: theme.colors.mono800,
              })}
            >
              {/* {moment(new Date(data['timestamp'] * 1000).toLocaleString()).format("[Lúc] hh:mm:ss a [ngày ] DD [tháng ] MM [năm ] YYYY")} */}
              {new Date(data['timestamp'] * 1000).toLocaleString()}
            </div>
          </div>
        </div>
        <div
          className={css({
            ...theme.typography.font1050,
            fontWeight: 'normal',
            fontSize: '46px',
            paddingTop: theme.sizing.scale1000,
            paddingBottom: theme.sizing.scale800,
            paddingLeft: theme.sizing.scale800,
            paddingRight: theme.sizing.scale800,
            borderBottom: theme.colors.mono300,
            textAlign: 'center',
          })}
        >
          {`${data[field.field_name] || ''} ${field.field_unit || ''}`}
        </div>
      </div>
      <div
        className={css({
          backgroundColor: theme.colors.mono100,
          ...theme.borders.border200,
          borderTopLeftRadius: theme.sizing.scale400,
          borderBottomRightRadius: theme.sizing.scale400,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          marginBottom: theme.sizing.scale300,
        })}
      >
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            paddingTop: theme.sizing.scale600,
            paddingBottom: theme.sizing.scale600,
            paddingLeft: theme.sizing.scale800,
            paddingRight: theme.sizing.scale800,
          })}
        >
          <div className={css({ marginRight: theme.sizing.scale800 })}>
            <Activity color={theme.colors.accent200} size={24} />
          </div>
          <div>
            <div className={css({ ...theme.typography.font400 })}>
              {field.field_display}
            </div>
          </div>
        </div>
        <div
          className={css({
            width: '100%',
            height: '200px',
          })}
        >
          <ResponsiveContainer>
            <LineChart
              data={history}
              syncId="imp"
              margin={{
                top: 15,
                right: 30,
                left: 0,
                bottom: 30,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickFormatter={(value) => {
                  // console.log(value.split(', '))
                  // const temp = value.split(', ')
                  // console.log(`${temp[0]}\n${temp[1]}`)

                  // return `${temp[0]}\n${temp[1]}`
                  return value
                }}
                tick={<CustomizedAxisTick />}
              />
              <YAxis axisLine={false} tickFormatter={(value) => value} />

              <Tooltip />
              <Line
                isAnimationActive={false}
                // animationEasing="linear"
                animationDuration={2000}
                type="linear"
                dataKey={field.field_name}
                strokeWidth="2px"
                stroke="#757575"
                fill="#21A453"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

export default Display
