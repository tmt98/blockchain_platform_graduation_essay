import * as React from 'react'
import { useStyletron } from 'baseui'
import { Button } from 'baseui/button'
import axios from 'axios'
import { useParams, useHistory } from 'react-router-dom'
import { db, useAuth } from '../../hooks/use-auth'
import DisplayStatistical from './displayStatistical'
import { vi } from 'date-fns/locale'
import { format } from 'date-fns'
import { FormControl } from 'baseui/form-control'
import { ArrowRight } from 'baseui/icon'
import { Datepicker, formatDate } from 'baseui/datepicker'
import { TimePicker } from 'baseui/timepicker'

import createAuthRefreshInterceptor from 'axios-auth-refresh'
const START_DATE = new Date()
const END_DATE = new Date()
function formatDateAtIndex(dates: Date | Array<Date>, index: number) {
  if (!dates || !Array.isArray(dates)) return ''
  const date = dates[index]
  if (!date) return ''
  return formatDate(date, 'yyyy-MM-dd') as string
  // return format(date, 'd.M.yyyy') as string
}
export const Statistical = ({ bcidentity }: any) => {
  const [css, theme] = useStyletron()
  // const router = useHistory()
  const { id }: any = useParams()
  const { state }: any = useAuth()

  const [history, sethistory] = React.useState(Array)
  const [fields, setfields] = React.useState(Array)
  const [dates, setDates] = React.useState([START_DATE, END_DATE])

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

  const getdata = async (startDate: any, endDate: any) => {
    axios({
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem(state.user.uid + id),
      },
      url:
        process.env.REACT_APP_API_EXPRESS + '/api/device/datastatisticaldevice',
      data: {
        startDate: startDate,
        endDate: endDate,
      },
    })
      .then((res: any) => {
        console.log(res.data)
        const data = res.data.map((item: any) => {
          return {
            ...item.data,
            time: new Date(item.data.timestamp * 1000).toLocaleString(),
          }
        })
        console.log(data)

        sethistory(data.reverse())
      })
      .catch((Err) => {
        console.log(Err)
      })
  }

  const downloaddata = async (startDate: any, endDate: any) => {
    axios({
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem(state.user.uid + id),
      },
      url:
        process.env.REACT_APP_API_EXPRESS +
        '/api/device/downloadstatisticaldevice',
      responseType: 'blob',
      data: {
        startDate: startDate,
        endDate: endDate,
      },
    })
      .then((res: any) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'data.csv') //or any other extension
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
      .catch((Err) => {
        console.log(Err)
      })
  }
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
                const data = res.data.map((item: any) => {
                  return {
                    ...item.data,
                    time: new Date(item.data.timestamp * 1000).toLocaleString(),
                  }
                })
                console.log(data)

                sethistory(data.reverse())
              })
              .catch((Err) => {
                console.log(Err)
              })
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

  // React.useEffect(() => {
  //   function getds() {
  //     axios({
  //       method: 'post',
  //       headers: {
  //         Authorization:
  //           'Bearer ' + sessionStorage.getItem(state.user.uid + id),
  //       },
  //       url: process.env.REACT_APP_API_EXPRESS + '/api/device/datadevice',
  //     })
  //       .then((res: any) => {
  //         console.log(res.data)
  //         const data = res.data.map((item: any) => {
  //           return {
  //             ...item.data,
  //             time: new Date(item.data.timestamp * 1000).toLocaleTimeString(),
  //           }
  //         })
  //         console.log(data)

  //         sethistory(data.reverse())
  //       })
  //       .catch((Err) => {
  //         console.log(Err)
  //       })
  //   }
  //   getds()
  // }, [])

  console.log(bcidentity)
  return (
    <div className={css({})}>
      <div className={css({ display: 'flex', alignItems: 'center' })}>
        <div
          className={css({
            width: '120px',
            marginRight: theme.sizing.scale300,
          })}
        >
          <FormControl label="Start Date" caption="YYYY/MM/DD">
            <Datepicker
              // locale={vi}
              value={dates}
              // formatString={'d/MM/YYYY'}
              onChange={({ date }) => setDates(date as Array<Date>)}
              formatDisplayValue={(date) => formatDateAtIndex(date, 0)}
              // formatString="dd.MM.yyyy"
              timeSelectStart
              range
              mask="9999/99/99"
            />
          </FormControl>
        </div>
        <div
          className={css({
            width: '120px',
            marginRight: theme.sizing.scale300,
          })}
        >
          <FormControl label="Start Time" caption="HH:MM">
            <TimePicker
              value={dates[0]}
              onChange={(time) => setDates([time, dates[1]])}
            />
          </FormControl>
        </div>
        <div
          className={css({
            marginRight: theme.sizing.scale300,
          })}
        >
          <ArrowRight size={24} />
        </div>
        <div
          className={css({
            width: '120px',
            marginRight: theme.sizing.scale300,
          })}
        >
          <FormControl label="End Date" caption="yyyy/MM/DD">
            <Datepicker
              // locale={vi}
              disabled={true}
              value={dates}
              onChange={({ date }) => setDates(date as Array<Date>)}
              // formatString={'d/MM/YYYY'}
              formatDisplayValue={(date) => formatDateAtIndex(date, 1)}
              // formatString="dd.MM.yyyy"
              overrides={{
                TimeSelectFormControl: {
                  props: { label: 'End time' },
                },
              }}
              timeSelectEnd
              range
              mask="9999/99/99"
            />
          </FormControl>
        </div>
        <div
          className={css({
            width: '120px',
          })}
        >
          <FormControl label="End Time" caption="HH:MM">
            <TimePicker
              value={dates[1]}
              onChange={(time) => setDates([dates[0], time])}
            />
          </FormControl>
        </div>
        <div
          className={css({
            marginTop: '-15px',
            marginLeft: theme.sizing.scale300,
          })}
        >
          <Button
            onClick={(e) => {
              e.preventDefault()
              console.log(Math.ceil(dates[0].getTime() / 1000))
              console.log(Math.ceil(dates[1].getTime() / 1000))
              const startDate: any = Math.ceil(dates[0].getTime() / 1000)
              const endDate: any = Math.ceil(dates[1].getTime() / 1000)
              getdata(startDate, endDate)
            }}
            kind="secondary"
            overrides={{
              BaseButton: {
                style: {
                  backgroundColor: theme.colors.contentInverseSecondary,
                  borderTopLeftRadius: theme.sizing.scale400,
                  borderBottomRightRadius: theme.sizing.scale400,
                },
              },
            }}
          >
            Xem
          </Button>
        </div>
        <div
          className={css({
            marginTop: '-15px',
            marginLeft: theme.sizing.scale300,
          })}
        >
          <Button
            onClick={(e) => {
              e.preventDefault()
              console.log(Math.ceil(dates[0].getTime() / 1000))
              console.log(Math.ceil(dates[1].getTime() / 1000))
              const startDate: any = Math.ceil(dates[0].getTime() / 1000)
              const endDate: any = Math.ceil(dates[1].getTime() / 1000)
              downloaddata(startDate, endDate)
            }}
            kind="secondary"
            overrides={{
              BaseButton: {
                style: {
                  backgroundColor: theme.colors.contentInverseSecondary,
                  borderTopLeftRadius: theme.sizing.scale400,
                  borderBottomRightRadius: theme.sizing.scale400,
                },
              },
            }}
          >
            Download CSV
          </Button>
        </div>
      </div>

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
            <DisplayStatistical
              key={Math.random() * 10 + i}
              field={ite}
              history={history}
            ></DisplayStatistical>
          )
        })}
      </div>
    </div>
  )
}
