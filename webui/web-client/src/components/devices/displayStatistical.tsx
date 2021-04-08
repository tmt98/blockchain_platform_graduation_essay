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
import { time } from 'console'
import { th } from 'date-fns/locale'

const CustomizedAxisTick = ({ x, y, stroke, payload }: any) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dx={20}
        dy={30}
        textAnchor="middle"
        fill="#000000"
        fontWeight="bold"
        fontSize={9}
        transform="rotate(-20)"
      >
        {payload.value}
      </text>
    </g>
  )
}

const DisplayStatistical = ({ field, history }: any) => {
  const [css, theme] = useStyletron()
  const [collect, setCollect]: any = React.useState({
    min: { value: 0, time: '' },
    max: { value: 0, time: '' },
  })
  React.useEffect(() => {
    let minnum: any = 0
    let maxnum: any = 0
    if (history.length > 0) {
      minnum = history.reduce((p: any, v: any) => {
        return p[field.field_name] < v[field.field_name] ? p : v
      })
      console.log('min', field.field_name, minnum[field.field_name])

      maxnum = history.reduce((p: any, v: any) => {
        return p[field.field_name] > v[field.field_name] ? p : v
      })
      console.log('max', field.field_name, maxnum[field.field_name])

      setCollect({
        min: { value: minnum[field.field_name], time: minnum['timestamp'] },
        max: { value: maxnum[field.field_name], time: minnum['timestamp'] },
      })
    }
  }, [])
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
          </div>
        </div>
        <div
          className={css({
            ...theme.typography.font200,
            fontWeight: 'normal',
            paddingTop: theme.sizing.scale800,
            paddingLeft: theme.sizing.scale800,
            paddingBottom: theme.sizing.scale500,
          })}
        >
          <div
            className={css({
              fontSize: '25px',
            })}
          >
            Min : {`${collect.min.value} ${field.field_unit}`}
          </div>
          <div
            className={css({
              marginTop: theme.sizing.scale300,
              color: theme.colors.contentInverseTertiary,
            })}
          >
            {new Date(collect.min.time * 1000).toLocaleString()}
          </div>
        </div>
        <div
          className={css({
            ...theme.typography.font200,
            fontWeight: 'normal',
            paddingLeft: theme.sizing.scale800,
          })}
        >
          <div
            className={css({
              fontSize: '25px',
            })}
          >
            Max : {`${collect.max.value} ${field.field_unit}`}
          </div>
          <div
            className={css({
              marginTop: theme.sizing.scale300,
              color: theme.colors.contentInverseTertiary,
            })}
          >
            {new Date(collect.max.time * 1000).toLocaleString()}
          </div>
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
                tickFormatter={(value) => value}
                tick={<CustomizedAxisTick />}
              />
              <YAxis axisLine={false} tickFormatter={(value) => value} />

              <Tooltip />
              <Line
                unit={field.field_unit}
                isAnimationActive={false}
                // animationEasing="linear"
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

export default DisplayStatistical
