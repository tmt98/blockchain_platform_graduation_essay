import React from 'react'
import { fbase } from '../../hooks/use-auth'
import { toaster } from 'baseui/toast'

import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavbarNav,
  MDBNavItem,
  MDBContainer,
  MDBMask,
  MDBView,
  MDBTabContent,
  MDBAnimation,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBIcon,
  MDBCardTitle,
  MDBBtn,
  MDBNavLink,
} from 'mdbreact'
import { Typography } from '@material-ui/core'
import { Link } from 'react-scroll'

export const LoginForm: React.FC<{}> = () => {
  // let [isWideEnough, setIsWideEnough] = React.useState(false)
  let [collapse, setCollapse] = React.useState(false)
  let onClick1 = () => {
    setCollapse(!collapse)
  }
  return (
    // <MDBBtn
    //   onClick={() => {
    //     fbase
    //       .auth()
    //       .setPersistence(fbase.auth.Auth.Persistence.SESSION)
    //       .then(async function () {
    //         // const v = await fbase
    //         //   .auth()
    //         //   .signInWithEmailAndPassword(email, password)

    //         // toaster.positive(`Auth with ${v.user!.email}`, {
    //         //   autoHideDuration: 5000,
    //         // })
    //         //return v;
    //         let provider = new fbase.auth.GoogleAuthProvider()
    //         fbase.auth().useDeviceLanguage()
    //         const v = await fbase.auth().signInWithPopup(provider)
    //         // console.log("credental : ", v);
    //         toaster.positive(`Auth with Google`, {
    //           autoHideDuration: 5000,
    //         })
    //         return v
    //       })
    //       .catch(function (error) {
    //         toaster.warning(error.message, {
    //           autoHideDuration: 5000,
    //         })
    //       })
    //   }}
    // >
    //   <MDBIcon fab icon="google-plus-g" className="pr-1"></MDBIcon>
    //   GOOGLE
    // </MDBBtn>

    <div>
      <header>
        <MDBTabContent>
          <MDBNavbar
            color="bg-primary"
            fixed="top"
            dark
            expand="md"
            // scrolling
            transparent
          >
            <MDBNavbarBrand href="#">
              <img height="40" alt="logo" src="/2152488.ico" />
            </MDBNavbarBrand>
            {true && <MDBNavbarToggler onClick={onClick1} />}
            <MDBCollapse isOpen={collapse} navbar>
              <MDBNavbarNav right>
                <MDBNavItem active>
                  <Link
                    activeClass="active"
                    to="top1"
                    spy={true}
                    smooth={true}
                    offset={0}
                    duration={500}
                  >
                    <MDBNavLink to="#">Home</MDBNavLink>
                  </Link>
                </MDBNavItem>
                <MDBNavItem>
                  <Link
                    activeClass="active"
                    to="top2"
                    spy={true}
                    smooth={true}
                    offset={0}
                    duration={500}
                  >
                    <MDBNavLink to="#">About Us</MDBNavLink>
                  </Link>
                </MDBNavItem>
                <Link
                  activeClass="active"
                  to="top3"
                  spy={true}
                  smooth={true}
                  offset={0}
                  duration={500}
                >
                  <MDBNavItem>
                    {/* Our Services */}
                    <MDBNavLink to="#">Our Services</MDBNavLink>
                  </MDBNavItem>
                </Link>
                <Link
                  activeClass="active"
                  to="top4"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                >
                  <MDBNavItem>
                    {/* Bắt đầu sử dụng */}
                    <MDBNavLink to="#">Bắt đầu sử dụng</MDBNavLink>
                  </MDBNavItem>
                </Link>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBNavbar>
          <MDBAnimation type="flipInX" duration={1000}>
            <MDBView id="top1" src={process.env.PUBLIC_URL + '/images/1.png'}>
              <MDBMask
                overlay="black-light"
                duration="true"
                className="flex-center flex-column text-white text-center"
              >
                <Typography
                  variant="h2"
                  component="h2"
                  // style={{ fontSize: "64px" }}
                >
                  {
                    'NỀN TẢNG QUAN TRẮC MÔI TRƯỜNG NƯỚC DỰA TRÊN CÔNG NGHỆ BLOCKCHAIN'
                  }
                </Typography>
                <Typography
                  variant="h5"
                  component="h5"
                  // style={{ fontSize: "64px" }}
                >
                  Internet Of Thing
                </Typography>
              </MDBMask>
            </MDBView>
          </MDBAnimation>
          <MDBAnimation reveal type="zoomIn" duration={1000}>
            <MDBView src={process.env.PUBLIC_URL + '/images/23.jpg'}>
              <MDBMask
                id="top2"
                overlay="white-light"
                className="flex-center flex-column text-black "
              >
                <MDBContainer>
                  <MDBRow>
                    <MDBCol size="6">
                      <Typography variant="h4" component="h4">
                        Về nền tảng của chúng tôi
                      </Typography>
                      <Typography variant="subtitle1">
                        Nền tảng cho phép bạn tổng hợp, trực quan hóa các luồng
                        dữ liệu từ các thiết bị quan trắc trên Blockchain. Bạn
                        có thể gửi dữ liệu thới hệ thống từ thiết bị của bạn,
                        xem dữ liệu trực tiếp, và nhận cảnh báo về các thiết bị.
                      </Typography>
                    </MDBCol>
                    <MDBCol size="6">
                      <img
                        src={process.env.PUBLIC_URL + '/images/services.png'}
                        alt="#"
                      />
                    </MDBCol>
                  </MDBRow>
                </MDBContainer>
              </MDBMask>
            </MDBView>
          </MDBAnimation>
          <MDBAnimation reveal type="flipInX" duration={1000}>
            <MDBView src={process.env.PUBLIC_URL + '/images/21.jpg'}>
              <MDBMask
                id="top3"
                overlay="purple-light"
                className="flex-center flex-column text-white text-center"
              >
                <MDBContainer fluid>
                  <MDBRow>
                    <MDBCol size="4" style={{ margin: '0', padding: '0' }}>
                      <MDBCard
                        className="card-image"
                        style={{
                          backgroundImage: `url('${process.env.PUBLIC_URL}/images/3/3.jpg')`,
                        }}
                      >
                        <div
                          className="text-white text-center d-flex align-items-center rgba-grey-strong py-5 px-4"
                          style={{ height: '100vh' }}
                        >
                          <div>
                            <h3 className="white-text">
                              <MDBIcon icon="hdd" /> Lưu trữ dữ liệu
                            </h3>

                            <div className="text-left">
                              <MDBCardTitle tag="h5" className="pt-2">
                                <strong>
                                  Tại sao bạn nên lưu trữ dữ liệu trên hệ thống?
                                </strong>
                              </MDBCardTitle>
                              <p className="text-left">
                                Nền tảng hổ trợ lưu trữ dữ liệu cảm biến từ các
                                thiết bị của người dùng vào một mạng Blockchain
                                riêng tư, đảm bảo tính bất biến và bảo mật.
                              </p>
                              <MDBCardTitle tag="h5" className="pt-2">
                                <strong>
                                  Gửi dữ liệu từ thiết bị lên hệ thống
                                </strong>
                              </MDBCardTitle>
                              <p className="text-left">
                                Người dùng cấu hình các thiết bị theo yêu cầu
                                sau đó gửi dữ liệu từ các cảm biến lên hệ thống
                                đễ lưu trữ và truy vấn.
                              </p>
                              <MDBCardTitle tag="h3" className="pt-2">
                                <strong>...</strong>
                              </MDBCardTitle>
                            </div>
                          </div>
                        </div>
                      </MDBCard>
                    </MDBCol>
                    <MDBCol size="4" style={{ margin: '0', padding: '0' }}>
                      <MDBCard
                        className="card-image"
                        style={{
                          backgroundImage: `url('${process.env.PUBLIC_URL}/images/3/22.jpg')`,
                        }}
                      >
                        <div
                          className="text-white text-center d-flex align-items-center rgba-grey-strong py-5 px-4"
                          style={{ height: '100vh' }}
                        >
                          <div>
                            <h3 className="white-text">
                              <MDBIcon icon="chart-line" /> Trực quan hóa và
                              chia sẽ
                            </h3>

                            <div className="text-left">
                              <MDBCardTitle tag="h5" className="pt-2">
                                <strong>
                                  Hỗ trợ truy xuất dữ liệu dể dàng
                                </strong>
                              </MDBCardTitle>
                              <span className="text-left">
                                <ul className="m-0">
                                  <li className="text-left p-0 m-0">
                                    Xem trực tiếp sự thay đổi của dữ liệu từ các
                                    cảm biến liên tục theo thời gian thực.
                                  </li>
                                  <li className="text-left p-0 m-0">
                                    Tổng hợp dữ liệu theo yêu cầu
                                  </li>
                                  <li className="text-left p-0 m-0">
                                    Phân tích dữ liệu dựa theo ngày/tháng.
                                  </li>
                                </ul>
                              </span>

                              <MDBCardTitle tag="h5" className="pt-2">
                                <strong>Chia sẽ thiết bị</strong>
                              </MDBCardTitle>
                              <p className="text-left">
                                Người dùng có thể chia sẽ quyền xem dữ liệu các
                                cảm biến từ thiết bị đang sở hũu.
                              </p>
                              <MDBCardTitle tag="h3" className="pt-2">
                                <strong>...</strong>
                              </MDBCardTitle>
                            </div>
                          </div>
                        </div>
                      </MDBCard>
                    </MDBCol>
                    <MDBCol size="4" style={{ margin: '0', padding: '0' }}>
                      <MDBCard
                        className="card-image"
                        style={{
                          backgroundImage: `url('${process.env.PUBLIC_URL}/images/3/1.jpg')`,
                        }}
                      >
                        <div
                          className="text-white text-center d-flex align-items-center rgba-grey-strong py-5 px-4"
                          style={{ height: '100vh' }}
                        >
                          <div>
                            <h3 className="white-text">
                              <MDBIcon icon="sms" /> Cảnh báo
                            </h3>

                            <div className="text-left">
                              <MDBCardTitle tag="h5" className="pt-2">
                                <strong>
                                  Nhận cảnh về các cảm biến một cách nhanh chống
                                </strong>
                              </MDBCardTitle>
                              <span className="text-left">
                                Người dùng có thể cấu hình cho phép nhận cảnh
                                báo về tin nhắn điện thoại khi các thông số cảm
                                biến vướt mức quy định. Từ dó nhanh chông đưa ra
                                hướng giải quyết
                              </span>

                              <MDBCardTitle tag="h3" className="pt-2">
                                <strong>...</strong>
                              </MDBCardTitle>
                            </div>
                          </div>
                        </div>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                </MDBContainer>
              </MDBMask>
            </MDBView>
          </MDBAnimation>
        </MDBTabContent>
        <MDBAnimation reveal type="zoomIn" duration={1000}>
          <MDBView src={process.env.PUBLIC_URL + '/images/23.jpg'}>
            <MDBMask
              id="top4"
              overlay="white-light"
              className="flex-center flex-column text-black "
            >
              <MDBContainer>
                <MDBRow>
                  <MDBCol size="6">
                    <img
                      style={{ height: '60vh' }}
                      src={process.env.PUBLIC_URL + '/images/3/login-right.svg'}
                      alt="#"
                    />
                  </MDBCol>
                  <MDBCol size="6">
                    <Typography variant="h4" component="h4">
                      Tham gia cùng chúng tôi
                    </Typography>
                    <Typography variant="subtitle1">
                      <br />
                      <MDBBtn
                        onClick={() => {
                          fbase
                            .auth()
                            .setPersistence(fbase.auth.Auth.Persistence.SESSION)
                            .then(async function () {
                              // const v = await fbase
                              //   .auth()
                              //   .signInWithEmailAndPassword(email, password)

                              // toaster.positive(`Auth with ${v.user!.email}`, {
                              //   autoHideDuration: 5000,
                              // })
                              //return v;
                              let provider = new fbase.auth.GoogleAuthProvider()
                              fbase.auth().useDeviceLanguage()
                              const v = await fbase
                                .auth()
                                .signInWithPopup(provider)
                              // console.log("credental : ", v);
                              toaster.positive(`Auth with Google`, {
                                autoHideDuration: 5000,
                              })
                              return v
                            })
                            .catch(function (error) {
                              toaster.warning(error.message, {
                                autoHideDuration: 5000,
                              })
                            })
                        }}
                      >
                        <MDBIcon
                          fab
                          icon="google-plus-g"
                          className="pr-1"
                        ></MDBIcon>
                        GOOGLE
                      </MDBBtn>
                    </Typography>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </MDBMask>
          </MDBView>
        </MDBAnimation>
      </header>
    </div>
  )
}
