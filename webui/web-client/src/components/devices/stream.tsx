import * as React from 'react'
import { DeepstreamClient } from '@deepstream/client'
import { useStyletron } from 'baseui'
import { Button } from 'baseui/button'
// import moment from 'moment'
import { Tag } from 'baseui/tag'

import axios from 'axios'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import { db, useAuth } from '../../hooks/use-auth'
import Display from './display'
import { Settings, BarChart2, BatteryCharging } from 'react-feather'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  FocusOnce,
} from 'baseui/modal'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { BlockProps } from 'baseui/block'
// import { Input, SIZE } from 'baseui/input'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

const itemProps: BlockProps = {
  backgroundColor: 'mono300',
  height: 'scale1000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
// moment().zone(7)

const StreamDevices = ({ bcidentity }: any) => {
  const [css, theme] = useStyletron()
  const [data, setData]: any = React.useState({
    data: { timestamp: 0 },
    history: [],
  })
  const { id }: any = useParams()
  const [history, sethistory] = React.useState(Array)
  const [fields, setfields] = React.useState(Array)
  const router = useHistory()
  const [device, setdevice] = React.useState(Object)
  const [isOpen, setOpen] = React.useState(false)
  const { state }: any = useAuth()
  const [lastUpdate, setLastUpdate] = React.useState('')
  const space = css({ marginRight: theme.sizing.scale500 })

  console.log('aasfasfsaf', bcidentity)

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

  React.useEffect(() => {
    console.log('set fields')
    const getdata = async () => {
      let docs = db.collection('devices').doc(id)

      await docs
        .get()
        .then(async (doc: any) => {
          if (doc.exists && doc.data().auth === state.user.uid) {
            let field = doc.get('data_fields')
            setfields(field)
            // setdevice({ name: doc.get('name'), desc: doc.get('desc') })
            setdevice(doc.data())
          } else {
            console.log('No such document!')
          }
        })
        .catch((err) => {
          console.log('Error getting document', err)
        })
    }
    getdata()
  }, [])

  React.useEffect(() => {
    const client = new DeepstreamClient('localhost:6020')
    client.login()
    const record = client.record.getRecord('news')
    function getds() {
      record.subscribe(`news/${id}`, async (value: any) => {
        // await setData(value)
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
            setLastUpdate(data[0].time)
            setData({ data: value, history: data.reverse() })
            // sethistory(data.reverse())
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
  console.log(new Date().getTime() - new Date(lastUpdate).getTime())
  console.log('info ne', bcidentity)
  //console.log("fields", fields)
  console.log('name', device)
  console.log('history', history)
  return (
    <div className={css({})}>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        })}
      >
        <div
          className={css({
            ...theme.typography.font650,
          })}
        >
          {`${device.device_name || 'X iot'}`}
          {/* Batery :{' '}
          {data.history.slice(-1).pop() ? (
            <>
              {' '}
              <BatteryCharging color={theme.colors.black} size={33} />{' '}
              {`  ${data.history.slice(-1).pop().battery} %`}
            </>
          ) : (
            ''
          )} */}
        </div>

        <Button
          onClick={() => router.push(`/devices/owner/${id}/statistical`)}
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
          {data.history.slice(-1).pop() ? (
            <>{`Năng lượng: ${data.history.slice(-1).pop().battery}% `}</>
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
        >{`Thời gian đẫy dữ liệu: ${device.push_time}phút/lần`}</FlexGridItem>

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
              data={data.data}
              history={data.history}
            ></Display>
          )
        })}
      </div>
    </div>
  )
}

export default StreamDevices
