import * as React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useStyletron } from 'baseui'
import { toaster } from 'baseui/toast'
import { db, fbase, useAuth } from '../../hooks/use-auth'
import { UsersTable } from './tableRefUser'
import { StyledSpinnerNext } from 'baseui/spinner'
import { Paragraph2, Label2 } from 'baseui/typography'
import { PlusCircle, Plus, X, RotateCcw, Search } from 'react-feather'
import { Button } from 'baseui/button'
import { FieldArray, Form, Formik } from 'formik'
import { Block } from 'baseui/block'
import { Input } from 'baseui/input'
import { FormControl } from 'baseui/form-control'
import { StatefulCheckbox, Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox'
import 'core-js/es6/promise'
import 'core-js/es6/set'
import 'core-js/es6/map'
// import * as Yup from 'yup'
import {
  Modal,
  ModalFooter,
  ModalButton,
  ModalHeader,
  ModalBody,
} from 'baseui/modal'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()
export const ShareDeviceManager = () => {
  const [css, theme] = useStyletron()
  const { id }: any = useParams()
  const { state }: any = useAuth()
  const router = useHistory()
  // const Location = useLocation()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [refUSer, setRefUser] = React.useState('loading')
  const [refUSerBackup, setRefUserBackup] = React.useState()
  const [isOpen, setIsOpen] = React.useState(false)
  const [device, setDevice] = React.useState({
    data_fields: [{ field_name: '', field_display: '', field_unit: '' }],
    device_name: '',
  })
  const checkemty = (s: any) => {
    for (const i of s) {
      if (i.share === true) {
        console.log('share', i)
        return true
      }
    }
    return false
  }
  const searchbutton = async (e: any, type: String) => {
    e.preventDefault()
    const result: any = []
    console.log(type)
    const datasearch: any = refUSerBackup
    if (inputRef.current?.value !== '') {
      const searchinput = inputRef.current?.value
      for (let i in datasearch) {
        // const deviceID: any = listdevice[i].deviceID
        // console.log(deviceID)
        if (datasearch[i].email.includes(searchinput)) {
          console.log('co chua')
          result.push(datasearch[i])
        }
      }
      setRefUser(result)
    } else {
      console.log('rong')
      return inputRef.current && inputRef.current.focus()
    }
  }
  const reloadbutton = async (e: any, type: String) => {
    e.preventDefault()
    const backupdata: any = refUSerBackup
    setRefUser(backupdata)
  }
  React.useEffect(() => {
    let unsubcrible: any
    try {
      unsubcrible = db
        .collection('devices')
        .doc(id)
        .onSnapshot(async (doc: any) => {
          console.log('snapshot ne', doc.data())
          if (
            doc.exists &&
            doc.data().auth === state.user.uid &&
            doc.data().actived === true
          ) {
            setDevice(doc.data())
            console.log('oke')
            const getuserRef = doc.data().refUser
            console.log(getuserRef)
            try {
              const result = await axios({
                method: 'post',
                url:
                  process.env.REACT_APP_API_EXPRESS +
                  '/api/user/getrefuserinfo',
                headers: {
                  Authorization: 'Bearer ' + state.customClaims.token,
                },
                data: {
                  refUsers: getuserRef,
                  deviceID: id,
                },
              })

              console.log(result.data)
              if (result.data.success === true) {
                console.log(result.data.users)
                setRefUser(result.data.users)
                setRefUserBackup(result.data.users)
              }
            } catch (err) {
              console.log(err)
              toaster.warning('Không có quyền truy cập!!!', {
                autoHideDuration: 5000,
              })
              router.replace(`/`)
            }
          } else {
            toaster.warning('Không có quyền truy cập!!!', {
              autoHideDuration: 5000,
            })
            router.replace(`/`)
          }
        })
    } catch (err) {
      console.log(err.message)
      router.replace('/')
    }
    return () => unsubcrible()
  }, [state.customClaims.token, state.user.uid, id, router])
  // console.log('ref', refUSer)
  // console.log("State" ,Location.state)
  return (
    <div
      className={css({
        maxWidth: '1300px',
        padding: theme.sizing.scale400,
        margin: `${theme.sizing.scale600} auto`,
      })}
    >
      <div
        className={css({
          ...theme.typography.font650,
          marginBottom: theme.sizing.scale800,
        })}
      >
        {`THIẾT BỊ ${device.device_name}(${id})`}
      </div>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.sizing.scale600,
        })}
      >
        <div
          className={css({
            ...theme.typography.font650,
            marginBottom: theme.sizing.scale800,
          })}
        >
          Danh sách người dùng đã chia sẽ
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          kind="secondary"
          startEnhancer={() => (
            <PlusCircle color={theme.colors.mono700} size={18} />
          )}
          overrides={{
            BaseButton: {
              style: {
                backgroundColor: theme.colors.contentInverseSecondary,
                borderBottomRightRadius: theme.sizing.scale600,
                borderTopLeftRadius: theme.sizing.scale400,
                // color : theme.colors.mono100,
              },
            },
          }}
        >
          Thêm chia sẽ
        </Button>
      </div>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'flex-left',
          alignItems: 'center',
          marginBottom: theme.sizing.scale600,
        })}
      >
        <Input
          inputRef={inputRef}
          placeholder="Nhập email để tìm kiếm người dùng"
          overrides={{
            Root: {
              style: {
                width: '30%',
                marginRight: theme.sizing.scale700,
              },
            },
          }}
        />

        <Button
          kind={'secondary'}
          overrides={{
            BaseButton: {
              style: {
                backgroundColor: theme.colors.contentInverseSecondary,
                // color : theme.colors.mono700,
                borderTopLeftRadius: theme.sizing.scale400,
                borderBottomRightRadius: theme.sizing.scale400,
                marginRight: theme.sizing.scale400,
                marginLeft: theme.sizing.scale700,
              },
            },
          }}
          startEnhancer={() => (
            <Search color={theme.colors.mono700} size={18} />
          )}
          onClick={(e) => searchbutton(e, 'searchOwn')}
        >
          Tim kiếm
        </Button>
        <Button
          kind={'secondary'}
          overrides={{
            BaseButton: {
              style: {
                borderTopLeftRadius: theme.sizing.scale400,
                borderBottomRightRadius: theme.sizing.scale400,
                backgroundColor: theme.colors.contentInverseSecondary,
                // color : theme.colors.mono100,
              },
            },
          }}
          startEnhancer={() => (
            <RotateCcw color={theme.colors.mono700} size={18} />
          )}
          onClick={(e) => reloadbutton(e, 'reloadOwn')}
        >
          Tải lại
        </Button>
      </div>
      {refUSer === 'loading' && (
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
      )}

      {refUSer !== 'loading' && refUSer.length === 0 && (
        <div
          className={css({
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: theme.sizing.scale1000,
          })}
        >
          <img width="300" src="/assets/no-devices.svg" alt="#" />
          <Paragraph2>Không có thiết bị linked</Paragraph2>
        </div>
      )}

      {refUSer !== 'loading' && refUSer.length > 0 && (
        <UsersTable users={refUSer} dataf={device} />
      )}

      <Modal
        unstable_ModalBackdropScroll={true}
        closeable={false}
        isOpen={isOpen}
        animate
        autoFocus
        size="auto"
        role="dialog"
        overrides={{
          Dialog: {
            style: {
              width: '800px',
              borderTopLeftRadius: theme.sizing.scale400,
              borderBottomRightRadius: theme.sizing.scale400,
            },
          },
        }}
      >
        <Formik
          initialValues={{
            deviceID: id,
            email: '',
            data_field_choosen: [] as any,
            data_fields: [...device.data_fields],
          }}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(true)
            // console.log(warning)
            // console.log("value",values)
            let data: any = values
            try {
              if (!checkemty(values.data_fields)) {
                actions.setSubmitting(false)
                toaster.negative(
                  <div className={css({ ...theme.typography.font200 })}>
                    Phải có ít nhất 1 sensor được chia sẽ họăc xóa người dùng
                    nếu bạn không muốn chia sẽ tiếp tục.
                  </div>,
                  {
                    autoHideDuration: 3000,
                    overrides: {
                      Body: {
                        style: {
                          borderTopLeftRadius: theme.sizing.scale400,
                          borderBottomRightRadius: theme.sizing.scale400,
                        },
                      },
                    },
                  },
                )
                return
              }

              for (const i in data.data_fields) {
                // console.log(data.data_fields[i])
                delete data.data_fields[i].max
                delete data.data_fields[i].min
              }
              console.log(data)

              const result = await axios({
                method: 'post',
                url:
                  process.env.REACT_APP_API_EXPRESS + '/api/user/sharedevice',
                headers: {
                  Authorization: 'Bearer ' + state.customClaims.token,
                },
                data: {
                  deviceID: data.deviceID,
                  email: data.email,
                  sensors: data.data_fields,
                },
              })
              console.log('ket qua them may: ', result.data)
              if (result.data.success === false) {
                toaster.negative(
                  <div className={css({ ...theme.typography.font200 })}>
                    {result.data.message}
                  </div>,
                  {
                    autoHideDuration: 3000,
                    overrides: {
                      Body: {
                        style: {
                          borderTopLeftRadius: theme.sizing.scale400,
                          borderBottomRightRadius: theme.sizing.scale400,
                        },
                      },
                    },
                  },
                )
              } else {
                toaster.positive(
                  <div className={css({ ...theme.typography.font200 })}>
                    Thêm thiết bị thành công!
                  </div>,
                  {
                    autoHideDuration: 3000,
                    overrides: {
                      Body: {
                        style: {
                          borderTopLeftRadius: theme.sizing.scale400,
                          borderBottomRightRadius: theme.sizing.scale400,
                        },
                      },
                    },
                  },
                )
              }
              // setWarning(false)
              actions.setSubmitting(false)
              setIsOpen(false)
            } catch (error) {
              console.log(error)
              actions.setSubmitting(false)
              toaster.negative(
                <div className={css({ ...theme.typography.font200 })}>
                  Xảy ra trong quá trình thêm dữ liệu. Vui lòng thử lại!
                </div>,
                {
                  autoHideDuration: 3000,
                  overrides: {
                    Body: {
                      style: {
                        borderTopLeftRadius: theme.sizing.scale400,
                        borderBottomRightRadius: theme.sizing.scale400,
                      },
                    },
                  },
                },
              )
            }
          }}
        >
          {({ handleChange, errors, values, isSubmitting }) => (
            <Form>
              <ModalHeader>CHIA SẼ THIẾT BỊ</ModalHeader>
              <ModalBody>
                <FormControl label="Thiết bị">
                  <Input
                    disabled
                    required
                    name="deviceID"
                    type="text"
                    onChange={handleChange}
                    placeholder="X Iot"
                    value={values.deviceID}
                    overrides={{
                      InputContainer: {
                        style: {
                          borderTopLeftRadius: theme.sizing.scale400,
                          borderBottomRightRadius: theme.sizing.scale400,
                        },
                      },
                    }}
                  />
                </FormControl>
                <FormControl label="Email">
                  <Input
                    required
                    name="email"
                    type="email"
                    onChange={handleChange}
                    value={values.email}
                    overrides={{
                      InputContainer: {
                        style: {
                          borderTopLeftRadius: theme.sizing.scale400,
                          borderBottomRightRadius: theme.sizing.scale400,
                        },
                      },
                    }}
                  />
                </FormControl>
                {errors.email ? (
                  <div className={css({ color: theme.colors.warning })}>
                    {errors.email}
                  </div>
                ) : null}
                <FieldArray
                  name="data_fields"
                  render={(arrayHelpers) => (
                    <>
                      <Block display="flex" alignItems="center">
                        <Label2 paddingRight="scale400">Data fields</Label2>
                      </Block>

                      <Block as="br" />

                      {values.data_fields &&
                        values.data_fields.length > 0 &&
                        values.data_fields.map((data_field: any, i) => (
                          <div key={i}>
                            <Block
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Block flex="2" marginRight="scale400">
                                <FormControl label="Trường hiển thị*">
                                  <Input
                                    disabled
                                    required
                                    name={`data_fields.${i}.field_display`}
                                    type="text"
                                    onChange={handleChange}
                                    placeholder="Nhiệt độ"
                                    value={data_field.field_display}
                                    overrides={{
                                      InputContainer: {
                                        style: {
                                          borderTopLeftRadius:
                                            theme.sizing.scale400,
                                          borderBottomRightRadius:
                                            theme.sizing.scale400,
                                        },
                                      },
                                    }}
                                  />
                                </FormControl>
                              </Block>
                              <Block flex="2" marginRight="scale400">
                                <FormControl label="key*">
                                  <Input
                                    disabled
                                    required
                                    name={`data_fields.${i}.field_name`}
                                    type="text"
                                    onChange={handleChange}
                                    placeholder="temperature"
                                    value={data_field.field_name}
                                    overrides={{
                                      InputContainer: {
                                        style: {
                                          borderTopLeftRadius:
                                            theme.sizing.scale400,
                                          borderBottomRightRadius:
                                            theme.sizing.scale400,
                                        },
                                      },
                                    }}
                                  />
                                </FormControl>
                              </Block>
                              <Block flex="1" marginRight="scale400">
                                <FormControl label="Đơn vị">
                                  <Input
                                    disabled
                                    required
                                    name={`data_fields.${i}.field_unit`}
                                    type="text"
                                    onChange={handleChange}
                                    placeholder="°C"
                                    value={data_field.field_unit || ''}
                                    overrides={{
                                      InputContainer: {
                                        style: {
                                          borderTopLeftRadius:
                                            theme.sizing.scale400,
                                          borderBottomRightRadius:
                                            theme.sizing.scale400,
                                        },
                                      },
                                    }}
                                  />
                                </FormControl>
                              </Block>

                              <Block marginTop="scale500">
                                <StatefulCheckbox
                                  initialState={{ checked: false }}
                                  onChange={(e: any) => {
                                    console.log(e.target.checked)
                                    const checked = e.target.checked
                                    if (checked) {
                                      data_field.share = true
                                    } else {
                                      data_field.share = false
                                    }
                                    console.log(values.data_fields)
                                  }}
                                />
                              </Block>
                            </Block>
                          </div>
                        ))}
                    </>
                  )}
                />
              </ModalBody>
              <ModalFooter>
                <ModalButton
                  type="button"
                  onClick={() => setIsOpen(false)}
                  kind="tertiary"
                  overrides={{
                    BaseButton: {
                      style: {
                        borderTopLeftRadius: theme.sizing.scale400,
                        borderBottomRightRadius: theme.sizing.scale400,
                      },
                    },
                  }}
                >
                  Hủy
                </ModalButton>
                <ModalButton
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  type="submit"
                  overrides={{
                    BaseButton: {
                      style: {
                        borderTopLeftRadius: theme.sizing.scale400,
                        borderBottomRightRadius: theme.sizing.scale400,
                        backgroundColor: theme.colors.positive500,
                        ':hover': {
                          backgroundColor: theme.colors.positive600,
                          boxShadow: theme.lighting.shadow500,
                        },
                        ':focus': {
                          backgroundColor: theme.colors.positive600,
                          boxShadow: theme.lighting.shadow500,
                        },
                        ':active': {
                          backgroundColor: theme.colors.positive700,
                          boxShadow: theme.lighting.shadow400,
                        },
                      },
                    },
                  }}
                >
                  Thêm
                </ModalButton>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  )
}
