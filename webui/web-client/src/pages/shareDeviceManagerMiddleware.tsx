import * as React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useStyletron } from 'baseui'
import { toaster } from 'baseui/toast'
import { db, useAuth } from '../hooks/use-auth'
import { ShareDeviceManager } from '../components/devices/sharemanager'
import dotenv from 'dotenv'
dotenv.config()
const ManagerMidleWare = () => {
  const [css, theme] = useStyletron()
  const { id }: any = useParams()
  const { state }: any = useAuth()
  const router = useHistory()

  React.useEffect(() => {
    const getdata = async () => {
      let docs = db.collection('devices').doc(id)
      docs
        .get()
        .then((doc: any) => {
          if (doc.exists && doc.data().auth === state.user.uid) {
            console.log('yes!')
          } else {
            toaster.warning('Không có quyền truy cập!!!', {
              autoHideDuration: 5000,
            })
            router.replace(`/`)
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
  }, [id, router, state.user.uid])

  return (
    <div
      className={css({
        maxWidth: '999px',
        padding: theme.sizing.scale400,
        margin: `${theme.sizing.scale600} auto`,
      })}
    >
      <ShareDeviceManager></ShareDeviceManager>
      {/* <StreamDevices info={infoDevice}></StreamDevices> */}
    </div>
  )
}

export default ManagerMidleWare
