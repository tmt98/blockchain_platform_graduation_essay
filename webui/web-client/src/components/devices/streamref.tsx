import * as React from 'react'
import { DeepstreamClient } from '@deepstream/client'
import { useStyletron } from 'baseui'
import { Button } from 'baseui/button'
// import moment from 'moment'
import axios from 'axios'
import { useParams, useHistory } from 'react-router-dom'
import { db, useAuth } from '../../hooks/use-auth'
import Display from './display'
import { Settings, BarChart2, BatteryCharging } from 'react-feather'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { Tag } from 'baseui/tag'

import { Block } from 'baseui/block'
import { BlockProps } from 'baseui/block'

import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { resolve } from 'dns'
import { rejects } from 'assert'

// moment().zone(7)
const itemProps: BlockProps = {
  backgroundColor: 'mono300',
  height: 'scale1000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
const StreamDevicesRef = ({ bcidentity, deviceinfo }: any) => {
  const [css, theme] = useStyletron()
  const [data, setData]: any = React.useState(Object)
  const [data1, setData1]: any = React.useState({
    data: { timestamp: 0 },
    history: [],
  })
  const { id }: any = useParams()
  const [history, sethistory]: any = React.useState(Array)
  const [fields, setfields] = React.useState(Array)
  const router = useHistory()
  const [lastUpdate, setLastUpdate] = React.useState('')

  const [isOpen, setOpen] = React.useState(false)
  const { state }: any = useAuth()
  console.log('identity hihihhihi', bcidentity)
  console.log('info', deviceinfo)
  // axios.interceptors.request.use((request) => {
  //   request.headers['Authorization'] =
  //     `Bearer ` + sessionStorage.getItem(state.user.uid + id)
  //   return request
  // })
  const refreshAuthLogic = (failedRequest: any) =>
    axios({
      method: 'post',
      url: process.env.REACT_APP_API_EXPRESS + '/api/user/gettoken',
      headers: {
        Authorization: 'Bearer ' + state.customClaims.token,
      },
      data: {
        // bcIdentity: infodev.bcIdentity,
        bcIdentity: bcidentity,
        deviceID: id,
      },
    })
      .then((tokenRefreshResponse: any) => {
        console.log('token respone', tokenRefreshResponse.data.token)
        failedRequest.response.config.headers['Authorization'] =
          'Bearer ' + tokenRefreshResponse.data.token
        sessionStorage.setItem(
          state.user.uid + id,
          tokenRefreshResponse.data.token,
        )
        return Promise.resolve()
      })
      .catch((err) => {
        console.log(err.message)
      })

  createAuthRefreshInterceptor(axios, refreshAuthLogic)

  // Location.
  // const infodevice = info
  // React.useEffect(() => {
  //   axios({
  //     method: 'post',
  //     headers: {
  //       Authorization: 'Bearer ' + sessionStorage.getItem(state.user.uid + id),
  //     },
  //     url: process.env.REACT_APP_API_EXPRESS + '/api/device/sensorsinfo',
  //   })
  //     .then((result: any) => {
  //       if (result.data.success === true) {
  //         setfields(result.data.data.data_fields)
  //         setdevice(result.data.data.deviceInfo)
  //       } else {
  //         console.log('khong co token')
  //         // router.replace('/')
  //       }
  //     })
  //     .catch((err) => {
  //       // router.replace('/')
  //     })
  // }, [])

  React.useEffect(() => {
    console.log('set fields')

    const unsubscribe = db
      .collection('fieldRef')
      .where('auth', '==', state.user.uid)
      .where('deviceID', '==', id)
      .onSnapshot((doc) => {
        doc.forEach((elem: any) => {
          console.log(elem.id)
          setfields(elem.data().data_fields)
          axios({
            method: 'post',
            headers: {
              Authorization:
                'Bearer ' + sessionStorage.getItem(state.user.uid + id),
            },
            url: process.env.REACT_APP_API_EXPRESS + '/api/device/datadevice',
          })
            .then((res: any) => {
              console.log(res.data)
              const temp = res.data
              const data = temp.map((item: any) => {
                return {
                  ...item.data,
                  time: new Date(item.data.timestamp * 1000).toLocaleString(),
                }
              })
              console.log(data)
              // setData1({ data: value, history: data.reverse() })
              sethistory(data.reverse())
            })
            .catch((Err) => {
              console.log(Err)
            })
        })
      })
    return () => unsubscribe()
  }, [])

  React.useEffect(() => {
    const client = new DeepstreamClient('localhost:6020')
    client.login()
    const record = client.record.getRecord('news')

    function getds() {
      record.subscribe(`news/${id}`, async (value: any) => {
        await setData(value)
        console.log('valuene ', value)
        axios({
          method: 'post',
          headers: {
            Authorization:
              'Bearer ' + sessionStorage.getItem(state.user.uid + id),
          },
          url: process.env.REACT_APP_API_EXPRESS + '/api/device/datadevice',
        })
          .then((res: any) => {
            console.log(res.data)
            const temp = res.data
            const data = temp.map((item: any) => {
              return {
                ...item.data,
                time: new Date(item.data.timestamp * 1000).toLocaleString(),
              }
            })
            console.log(data)
            // setData1({ data: value, history: data.reverse() })
            setLastUpdate(data[0].time)
            sethistory(data.reverse())
          })
          .catch((Err) => {
            console.log(Err)
          })
      })
    }
    getds()

    return () => {
      record.unsubscribe(`news/${id}`, () => console.log('offline'))
    }
  }, [])

  return (
    <div className={css({})}>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        })}
      >
        <div className={css({ ...theme.typography.font550 })}>
          {`${deviceinfo.device_name || 'X iot'}`}
        </div>
        <Button
          onClick={() => router.push(`/devices/refer/${id}/statistical`)}
          kind="secondary"
          startEnhancer={() => (
            <BarChart2 color={theme.colors.mono700} size={18} />
          )}
          overrides={{
            BaseButton: {
              style: {
                borderTopLeftRadius: theme.sizing.scale400,
                borderBottomRightRadius: theme.sizing.scale400,
              },
            },
          }}
        >
          Thống kê
        </Button>
      </div>
      <FlexGrid
        flexGridColumnCount={3}
        flexGridColumnGap="scale800"
        flexGridRowGap="scale800"
        marginBottom="scale800"
        marginTop="scale800"
      >
        <FlexGridItem
          {...itemProps}
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                fontWeight: 'bold',
              }),
            },
          }}
        >
          {' '}
          {`ID thiết bị: ${id}`}
        </FlexGridItem>
        <FlexGridItem
          {...itemProps}
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                fontWeight: 'bold',
              }),
            },
          }}
        >{`Số lượng cảm biến: ${fields.length}`}</FlexGridItem>
        <FlexGridItem
          {...itemProps}
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                fontWeight: 'bold',
              }),
            },
          }}
        >
          {history.slice(-1).pop() ? (
            <>{`Năng lượng: ${history.slice(-1).pop().battery}% `}</>
          ) : (
            ''
          )}
        </FlexGridItem>

        <FlexGridItem
          {...itemProps}
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                fontWeight: 'bold',
              }),
            },
          }}
        >{`Thời gian đẫy dữ liệu: ${deviceinfo.push_time}phút/lần`}</FlexGridItem>

        <FlexGridItem display="none">
          This invisible one is needed so the margins line up
        </FlexGridItem>
        <FlexGridItem
          {...itemProps}
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                width: `calc((200% - ${$theme.sizing.scale800}) / 3)`,
                fontWeight: 'bold',
              }),
            },
          }}
        >
          <>
            <div> {`Lần cập nhật cuối cùng : ${lastUpdate}`}</div>
            {lastUpdate ? (
              new Date().getTime() - new Date(lastUpdate).getTime() > 900000 ? (
                <Tag closeable={false} variant="outlined" kind={'warning'}>
                  Warning
                </Tag>
              ) : (
                ''
              )
            ) : (
              ''
            )}
          </>
        </FlexGridItem>
      </FlexGrid>
      <div
        className={css({
          marginTop: theme.sizing.scale800,
          marginBottom: theme.sizing.scale800,
          display: 'grid',
          gridTemplateColumns: '0.35fr 1fr',
        })}
      >
        {fields!.map((ite: any, i) => {
          return (
            <Display
              key={Math.random() * 10 + i}
              field={ite}
              data={data}
              history={history}
            ></Display>
          )
        })}
      </div>
    </div>
  )
}

export default StreamDevicesRef
