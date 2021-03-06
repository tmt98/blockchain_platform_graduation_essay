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
                    {/* B???t ?????u s??? d???ng */}
                    <MDBNavLink to="#">B???t ?????u s??? d???ng</MDBNavLink>
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
                    'N???N T???NG QUAN TR???C M??I TR?????NG N?????C D???A TR??N C??NG NGH??? BLOCKCHAIN'
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
                        V??? n???n t???ng c???a ch??ng t??i
                      </Typography>
                      <Typography variant="subtitle1">
                        N???n t???ng cho ph??p b???n t???ng h???p, tr???c quan h??a c??c lu???ng
                        d??? li???u t??? c??c thi???t b??? quan tr???c tr??n Blockchain. B???n
                        c?? th??? g???i d??? li???u th???i h??? th???ng t??? thi???t b??? c???a b???n,
                        xem d??? li???u tr???c ti???p, v?? nh???n c???nh b??o v??? c??c thi???t b???.
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
                              <MDBIcon icon="hdd" /> L??u tr??? d??? li???u
                            </h3>

                            <div className="text-left">
                              <MDBCardTitle tag="h5" className="pt-2">
                                <strong>
                                  T???i sao b???n n??n l??u tr??? d??? li???u tr??n h??? th???ng?
                                </strong>
                              </MDBCardTitle>
                              <p className="text-left">
                                N???n t???ng h??? tr??? l??u tr??? d??? li???u c???m bi???n t??? c??c
                                thi???t b??? c???a ng?????i d??ng v??o m???t m???ng Blockchain
                                ri??ng t??, ?????m b???o t??nh b???t bi???n v?? b???o m???t.
                              </p>
                              <MDBCardTitle tag="h5" className="pt-2">
                                <strong>
                                  G???i d??? li???u t??? thi???t b??? l??n h??? th???ng
                                </strong>
                              </MDBCardTitle>
                              <p className="text-left">
                                Ng?????i d??ng c???u h??nh c??c thi???t b??? theo y??u c???u
                                sau ???? g???i d??? li???u t??? c??c c???m bi???n l??n h??? th???ng
                                ????? l??u tr??? v?? truy v???n.
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
                              <MDBIcon icon="chart-line" /> Tr???c quan h??a v??
                              chia s???
                            </h3>

                            <div className="text-left">
                              <MDBCardTitle tag="h5" className="pt-2">
                                <strong>
                                  H??? tr??? truy xu???t d??? li???u d??? d??ng
                                </strong>
                              </MDBCardTitle>
                              <span className="text-left">
                                <ul className="m-0">
                                  <li className="text-left p-0 m-0">
                                    Xem tr???c ti???p s??? thay ?????i c???a d??? li???u t??? c??c
                                    c???m bi???n li??n t???c theo th???i gian th???c.
                                  </li>
                                  <li className="text-left p-0 m-0">
                                    T???ng h???p d??? li???u theo y??u c???u
                                  </li>
                                  <li className="text-left p-0 m-0">
                                    Ph??n t??ch d??? li???u d???a theo ng??y/th??ng.
                                  </li>
                                </ul>
                              </span>

                              <MDBCardTitle tag="h5" className="pt-2">
                                <strong>Chia s??? thi???t b???</strong>
                              </MDBCardTitle>
                              <p className="text-left">
                                Ng?????i d??ng c?? th??? chia s??? quy???n xem d??? li???u c??c
                                c???m bi???n t??? thi???t b??? ??ang s??? h??u.
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
                              <MDBIcon icon="sms" /> C???nh b??o
                            </h3>

                            <div className="text-left">
                              <MDBCardTitle tag="h5" className="pt-2">
                                <strong>
                                  Nh???n c???nh v??? c??c c???m bi???n m???t c??ch nhanh ch???ng
                                </strong>
                              </MDBCardTitle>
                              <span className="text-left">
                                Ng?????i d??ng c?? th??? c???u h??nh cho ph??p nh???n c???nh
                                b??o v??? tin nh???n ??i???n tho???i khi c??c th??ng s??? c???m
                                bi???n v?????t m???c quy ?????nh. T??? d?? nhanh ch??ng ????a ra
                                h?????ng gi???i quy???t
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
                      Tham gia c??ng ch??ng t??i
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
