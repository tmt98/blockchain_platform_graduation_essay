import * as React from 'react'
import {
  BrowserRouter,
  Route,
  Switch,
  useParams,
  useHistory,
} from 'react-router-dom'
import StreamDevices from '../components/devices/stream'
import { StyledSpinnerNext } from 'baseui/spinner'
import { Statistical } from '../components/devices/statistical'
import { Datepickper } from '../components/devices/datepicker'
import { useStyletron } from 'baseui'
import { toaster } from 'baseui/toast'
import { useAuth } from '../hooks/use-auth'
import { db } from '../hooks/use-auth'
import dotenv from 'dotenv'
import axios from 'axios'
import { DevicesTable } from './table'
dotenv.config()
const DevicesPage = () => {
  const [css, theme] = useStyletron()
  const { id }: any = useParams()
  const { state }: any = useAuth()
  console.log('state ne :', state)
  const [isTrue, setTrue] = React.useState(false)
  const [infoDevice, setInfo] = React.useState({})
  const [bcIdenity, setbcIdentity] = React.useState('')

  const router = useHistory()
  React.useEffect(() => {
    const getdata = async () => {
      await db
        .collection('devices')
        .doc(id)
        .get()
        .then((doc: any) => {
          if (
            doc.exists &&
            doc.data().auth === state.user.uid &&
            doc.data().actived === true
          ) {
            console.log('yes!')
            let docs = db
              .collection('bcAccounts')
              .where('auth', '==', state.user.uid)
              .where('deviceID', '==', id)
            docs
              .get()
              .then(async (doc: any) => {
                let info: any = {}

                console.log(doc.size)
                if (doc.size > 0) {
                  doc.forEach((dev: any) => {
                    const devdata = dev.data()
                    info = {
                      bcIdentity: devdata.bcIdentity,
                    }
                    setInfo(info)
                    setbcIdentity(devdata.bcIdentity)
                  })
                  console.log('co infoi roi ne ', info)
                  // if (sessionStorage.getItem(state.user.uid + id) === null) {
                  console.log('khong co token')
                  console.log('co infoi roi ne ', info.bcIdentity)
                  try {
                    const result = await axios({
                      method: 'post',
                      headers: {
                        Authorization: 'Bearer ' + state.customClaims.token,
                      },
                      url:
                        process.env.REACT_APP_API_EXPRESS +
                        '/api/user/gettoken',
                      data: {
                        bcIdentity: info.bcIdentity,
                        deviceID: id,
                      },
                    })
                    console.log(result.data.token)
                    if (result.data.success) {
                      sessionStorage.setItem(
                        state.user.uid + id,
                        result.data.token,
                      )
                      setTrue(true)
                    }
                  } catch (error) {
                    console.log('ra loi r ne ', error)
                    toaster.negative(
                      'Thiết bị chưa được kích hoạt hoặc không có kết nối. Vui lòng thử lại sau',
                      {
                        autoHideDuration: 5000,
                      },
                    )
                    router.replace('/')
                  }
                  // }

                  console.log('yes!')
                } else {
                  toaster.warning('Thiết bị không tồn tại!', {
                    autoHideDuration: 5000,
                  })
                  router.replace(`/`)
                }
              })
              .catch((err) => {
                console.log('Error getting document', err)
                // setcheck(false)
                toaster.warning(`Đã xãy ra lỗi : ${err}`, {
                  autoHideDuration: 5000,
                })
                router.replace(`/`)
              })
          } else {
            toaster.warning('Chuyển hướng!!!', {
              autoHideDuration: 2000,
            })
            router.replace(`/devices/refer/${id}`)
          }
        })
        .catch((err) => {
          console.log('Error getting document', err)

          toaster.warning(`Đã xãy ra lỗi : ${err}`, {
            autoHideDuration: 5000,
          })
          router.replace(`/`)
        })
    }
    getdata()
  }, [])

  // console.log(state.customClaims.token)

  return (
    <Switch>
      <Route exact path="/devices/owner/:id?">
        <div
          className={css({
            maxWidth: '999px',
            padding: theme.sizing.scale400,
            margin: `${theme.sizing.scale600} auto`,
          })}
        >
          {bcIdenity !== '' && isTrue === true ? (
            <StreamDevices bcidentity={bcIdenity}></StreamDevices>
          ) : (
            <>
              <div
                className={css({
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '30vh',
                })}
              >
                <StyledSpinnerNext />
              </div>
            </>
          )}
          {/* {check == true ? <StreamDevices info={infoDevice}></StreamDevices> : React.Fragment} */}
        </div>
      </Route>
      <Route exact path="/devices/owner/:id?/statistical">
        <div
          className={css({
            maxWidth: '999px',
            padding: theme.sizing.scale400,
            margin: `${theme.sizing.scale600} auto`,
          })}
        >
          {bcIdenity !== '' && isTrue === true ? (
            // <Statistical bcidentity={bcIdenity}></Statistical>
            <Statistical bcidentity={bcIdenity}></Statistical>
          ) : (
            <>
              <div
                className={css({
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '30vh',
                })}
              >
                <StyledSpinnerNext />
              </div>
            </>
          )}
          {/* {check == true ? <StreamDevices info={infoDevice}></StreamDevices> : React.Fragment} */}
        </div>
      </Route>
    </Switch>
  )
}

export default DevicesPage
