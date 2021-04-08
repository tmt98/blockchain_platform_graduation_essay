import * as React from 'react'
import { withStyle, useStyletron } from 'baseui'
import { StyledTable, StyledHeadCell, StyledBodyCell } from 'baseui/table-grid'
import { Tag } from 'baseui/tag'
import { Button } from 'baseui/button'
import { Sliders, Share2, UserMinus } from 'react-feather'
import { Paragraph2, Label2 } from 'baseui/typography'
import { useHistory, useParams } from 'react-router-dom'
import { FormControl } from 'baseui/form-control'
import { FieldArray, Form, Formik } from 'formik'
import { Block } from 'baseui/block'
import { Input } from 'baseui/input'
import { toaster } from 'baseui/toast'
import {
  Modal,
  ModalFooter,
  ModalButton,
  ModalHeader,
  ModalBody,
} from 'baseui/modal'
import axios from 'axios'
import { db, useAuth } from '../../hooks/use-auth'
import { StatefulCheckbox, Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox'
const CenteredBodyCell = withStyle(StyledBodyCell, ({ $theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  textAlign: 'center',
  paddingTop: $theme.sizing.scale500,
  paddingBottom: $theme.sizing.scale500,
}))

const CenteredBodyCellLeft = withStyle(StyledBodyCell, {
  display: 'flex',
  alignItems: 'center',
})

const HeadCellLeft = withStyle(StyledHeadCell, ({ $theme }) => ({
  boxShadow: 'none',
  backgroundColor: $theme.colors.positive,
  borderWidth: '0px',
  color: $theme.colors.mono100,
}))

const NewStyledTable = withStyle(StyledTable, ({ $theme }) => ({
  ...$theme.borders.border200,
  height: 'auto',
  overflowX: 'auto',
  backgroundColor: $theme.colors.mono100,
  borderTopLeftRadius: $theme.sizing.scale400,
  borderTopRightRadius: $theme.sizing.scale400,
  borderBottomLeftRadius: $theme.sizing.scale400,
  borderBottomRightRadius: $theme.sizing.scale400,
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
}))

const Row = ({ striped, row, dataf }: any) => {
  const [css, theme] = useStyletron()
  const space = css({ marginLeft: theme.sizing.scale300 })
  const { state }: any = useAuth()
  const [isOpen, setIsOpen] = React.useState(false)
  // const [datafieldchoosen , setdatafieldchoosen] = React.useState({data_fields :[{field_name:'',field_display :'',field_unit :'',share : false}],name :''})
  const [datafieldchoosen, setdatafieldchoosen] = React.useState([
    { field_name: '', field_display: '', field_unit: '', share: false },
  ])
  const [datafieldchoosen1, setdatafieldchoosen1] = React.useState([
    { field_name: '', field_display: '', field_unit: '', share: false },
  ])

  // const [datafieldchoosen1 , setdatafieldchoosen1] = React.useState({data_fields :[{field_name:'',field_display :'',field_unit :'',share : false}],name :''})
  // const [datafieldchoosen , setdatafieldchoosen] = React.useState('')

  const [datafields, setdatafields] = React.useState({
    data_fields: [{ field_name: '', field_display: '', field_unit: '' }],
    name: '',
  })
  const { id }: any = useParams()
  const router = useHistory()

  const checkemty = (s: any) => {
    for (const i of s) {
      if (i.share === true) {
        console.log('share', i)
        return true
      }
    }
    return false
  }
  React.useEffect(() => {
    const getattrs = async () => {
      try {
        const result = await axios({
          method: 'post',
          headers: {
            Authorization: 'Bearer ' + state.customClaims.token,
          },
          url: process.env.REACT_APP_API_EXPRESS + '/api/user/getuserfield',
          data: {
            deviceID: id,
            auth: row.uid,
          },
        })

        console.log(result.data)
        setdatafieldchoosen(result.data.data)
        // setdatafieldchoosen1(result.data.data)
      } catch (error) {
        toaster.warning(
          <div className={css({ ...theme.typography.font200 })}>
            Đã có lỗi xãy ra!!
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
        router.replace('/')
      }
    }
    getattrs()
  }, [])
  // console.log("data",dataf)
  return (
    <>
      <CenteredBodyCellLeft $striped={striped}>
        <div
          className={css({
            textAlign: 'left',
            ...theme.typography.font300,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          })}
        >
          {row.displayName}
        </div>
      </CenteredBodyCellLeft>
      <CenteredBodyCellLeft $striped={striped}>
        <div
          className={css({
            textAlign: 'left',
            ...theme.typography.font300,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          })}
        >
          {row.email}
        </div>
      </CenteredBodyCellLeft>
      <CenteredBodyCellLeft $striped={striped}>
        <div
          className={css({
            textAlign: 'left',
            ...theme.typography.font300,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          })}
        >
          {row.phoneNumber ? row.phoneNumber : 'Không có'}
        </div>
      </CenteredBodyCellLeft>
      <CenteredBodyCell $striped={striped}>
        <div
          className={css({
            display: 'flex',
            alignItems: 'right',
            textAlign: 'right',
            ...theme.typography.font300,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          })}
        >
          <Button
            // disabled
            size="compact"
            kind="secondary"
            startEnhancer={() => (
              <UserMinus color={theme.colors.mono700} size={15} />
            )}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  backgroundColor: theme.colors.backgroundTertiary,
                  borderBottomRightRadius: theme.sizing.scale200,
                  borderTopLeftRadius: theme.sizing.scale200,
                  // color : $theme.colors.mono100,
                }),
              },
            }}
            onClick={(e) => {
              // router.push(`/devices/display/${row.deviceID}`)
              e.preventDefault()
              const revoke = async () => {
                try {
                  const result = await axios({
                    method: 'post',
                    headers: {
                      Authorization: 'Bearer ' + state.customClaims.token,
                    },
                    url:
                      process.env.REACT_APP_API_EXPRESS +
                      '/api/user/revokeuser',
                    data: {
                      deviceID: id,
                      auth: row.uid,
                    },
                  })

                  console.log(result.data)
                  toaster.warning(
                    <div className={css({ ...theme.typography.font200 })}>
                      Xóa người dùng thành công!!
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
                } catch (error) {
                  toaster.warning(
                    <div className={css({ ...theme.typography.font200 })}>
                      Đã có lỗi xãy ra!!
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
                  router.replace('/')
                }
              }
              revoke()
            }}
          >
            Xóa
          </Button>
          <span className={space} />
          <Button
            // disabled={row.actived !== true ? true : false}
            size="compact"
            kind="tertiary"
            onClick={() => {
              console.log('id ne', id)
              // db.collection('fieldRef').where('auth','==',row.uid).where('deviceID','==',id).get()
              // .then((snapshot:any)=>{
              //   if(snapshot.size > 0)
              //   {
              //     snapshot.forEach((doc:any)=>{
              //     console.log(doc.data())
              //     // const fieldName = doc.data().data_fields.map((e:any)=>e.field_display)
              //     // console.log(JSON.stringify(fieldName))
              //     // const stringname = JSON.stringify(fieldName)
              //     // setdatafieldchoosen(doc.data())
              //     setdatafieldchoosen(doc.data())
              //     })
              //   }
              // })
              setIsOpen(true)
            }}
            startEnhancer={() => (
              <Sliders color={theme.colors.mono700} size={15} />
            )}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  backgroundColor: theme.colors.backgroundTertiary,
                  borderBottomRightRadius: theme.sizing.scale200,
                  borderTopLeftRadius: theme.sizing.scale200,
                  // color : $theme.colors.mono100,
                }),
              },
            }}
          >
            Chỉnh sửa
          </Button>
        </div>
      </CenteredBodyCell>
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
            email: row.email,
            data_fields: [
              // ...datafieldchoosen.data_fields
              ...datafieldchoosen,
              // {
              //   field_display :"nhiet do",
              //   field_name :"temperature",
              //   field_unit : "do c",
              //   share : true
              // },
              // {
              //   field_display :"pH",
              //   field_name :"ph",
              //   field_unit : "pH",
              //   share : false
              // }
              // ...dataf.data_fields
              // ...datafieldchoosen.data_fields
            ],
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
              console.log(data)
              for (const i in data.data_fields) {
                // console.log(data.data_fields[i])
                delete data.data_fields[i].max
                delete data.data_fields[i].min
              }
              console.log(data)

              const result = await axios({
                method: 'post',
                url:
                  process.env.REACT_APP_API_EXPRESS +
                  '/api/user/updatefieldshare',
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
              toaster.positive(
                <div className={css({ ...theme.typography.font200 })}>
                  Cập nhật thành công!
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
              // setWarning(false)
              actions.setSubmitting(false)
              setIsOpen(false)
            } catch (error) {
              console.log(error)
              actions.setSubmitting(false)
              toaster.negative(
                <div className={css({ ...theme.typography.font200 })}>
                  Xảy ra lỗi trong quá trình cập nhật. Vui lòng thử lại!
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
          {({ handleChange, values, isSubmitting }) => (
            <Form>
              <ModalHeader>CẬP NHẬT CHIA SẺ</ModalHeader>
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
                    disabled
                    required
                    name="email"
                    type="text"
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
                {/* <FormControl label="Trường đã chia sẽ">
                    <Input
                      disabled
                      required
                      name="data_fields_checked"
                      type="text"
                      onChange={handleChange}
                      value={values.data_fields_checked}
                      overrides={{
                        InputContainer: {
                          style: {
                            borderTopLeftRadius: theme.sizing.scale400,
                            borderBottomRightRadius: theme.sizing.scale400,
                          },
                        },
                      }}
                    />
                  </FormControl> */}
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
                        values.data_fields.map((data_field, i) => (
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
                              {/* <Block marginTop="scale500">
                                <Button
                                  disabled={
                                    values.data_fields.length === 1
                                      ? true
                                      : false
                                  }
                                  type="button"
                                  shape="round"
                                  kind="tertiary"
                                  onClick={() => arrayHelpers.remove(i)}
                                >
                                  <X size={18} color={theme.colors.mono700} />
                                </Button>
                                
                              </Block> */}
                              <Block marginTop="scale500">
                                <StatefulCheckbox
                                  initialState={{
                                    checked: data_field.share ? true : false,
                                  }}
                                  onChange={(e: any) => {
                                    console.log(e.target.checked)
                                    const checked = e.target.checked
                                    if (checked) {
                                      values.data_fields[i].share = true
                                      // data_field.share = true
                                    } else {
                                      values.data_fields[i].share = false
                                      // data_field.share = false
                                    }
                                    // console.log('choosen1', datafieldchoosen1)
                                    console.log('chooesen', datafieldchoosen)
                                    console.log('Data', values.data_fields)
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
                  onClick={async () => {
                    try {
                      const result = await axios({
                        method: 'post',
                        headers: {
                          Authorization: 'Bearer ' + state.customClaims.token,
                        },
                        url:
                          process.env.REACT_APP_API_EXPRESS +
                          '/api/user/getuserfield',
                        data: {
                          deviceID: id,
                          auth: row.uid,
                        },
                      })

                      console.log(result.data)
                      setdatafieldchoosen(result.data.data)
                      // setdatafieldchoosen1(result.data.data)
                    } catch (error) {
                      toaster.warning(
                        <div className={css({ ...theme.typography.font200 })}>
                          Đã có lỗi xãy ra!!
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
                      router.replace('/')
                    }
                    // datafieldchoosen1.map((dtf, i) => {
                    //   values.data_fields[i].share = dtf.share
                    // })
                    // values.data_fields_checked = datafieldchoosen.data_fields
                    // setdatafieldchoosen(datafieldchoosen)
                    // values.data_fields=datafieldchoosen.data_fields
                    setIsOpen(false)
                  }}
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
                  Đồng ý
                </ModalButton>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  )
}

export const UsersTable = ({ users, dataf }: any) => {
  const [css, theme] = useStyletron()
  return (
    <div
      className={css({
        marginTop: theme.sizing.scale400,
        marginBottom: theme.sizing.scale400,
      })}
    >
      <NewStyledTable $gridTemplateColumns="auto auto auto auto">
        <HeadCellLeft $sticky={false}>Tên người dùng</HeadCellLeft>
        <HeadCellLeft $sticky={false}>Email</HeadCellLeft>
        <HeadCellLeft $sticky={false}>Số điện thoại</HeadCellLeft>
        <HeadCellLeft $sticky={false}></HeadCellLeft>
        {users!.map((row: any, index: any) => {
          const striped = (index + 1) % 2 === 0
          return <Row key={index} row={row} dataf={dataf} striped={striped} />
        })}
      </NewStyledTable>
    </div>
  )
}
