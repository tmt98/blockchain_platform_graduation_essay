import React from "react";
import firebase from "../config/firebase";
import { db } from "../hook/use-auth";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import DeviceDialog from "./DeviceDialog";
import DeviceRefreshTokenDialog from "./DeviceRefreshTokenDialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

import InputBase from "@material-ui/core/InputBase";

import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import CachedIcon from "@material-ui/icons/Cached";
import { colors } from "@material-ui/core";

const columns = [
  { id: "date", label: "Thời gian", minWidth: 60 },
  { id: "deviceID", label: "ID thiết bị", minWidth: 60 },
  { id: "device_name", label: "Tên thiết bị", minWidth: 60 },
  {
    id: "email",
    label: "Chủ sở hữu",
    minWidth: 60,
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "device_desc",
    label: "Thông tin thiết bị",
    minWidth: 60,
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "actived",
    label: "Trạng thái",
    minWidth: 70,
    format: (value) => value.toFixed(2),
  },
  {
    id: "refreshtoken",
    label: "Làm mới token",
    minWidth: 70,
    format: (value) => value.toFixed(2),
  },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: 440,
  },
  divider: {
    height: 28,
    margin: 4,
  },
});

export default function StickyHeadTable() {
  const [data, setData] = React.useState([]);
  const [backupdata, setBackup] = React.useState([]);
  const [searchKey, setSearchKey] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const unsubscriber = db
      .collection("devices")
      .onSnapshot(async (snapShot) => {
        let devices = [];
        setLoading(false);
        snapShot.forEach(async (doc) => {
          // console.log(doc.data())
          let device = doc.data();
          device.deviceID = doc.id;
          devices.push(device);
        });
        console.log("snap shot");
        setData(devices);
        setBackup(devices);
        setLoading(true);
      });

    return () => unsubscriber();
  }, []);

  const searchDevice = () => {
    console.log("SEARCHDEVICE");
    setLoading(false);
    const result = [];
    const listdevice = backupdata;
    for (let i in listdevice) {
      // const deviceID: any = listdevice[i].deviceID
      // console.log(deviceID)
      if (listdevice[i].deviceID.includes(searchKey)) {
        console.log("co chua");
        result.push(listdevice[i]);
      }
    }

    setData(result);
    setLoading(true);
  };

  const searchActivedDevice = () => {
    console.log("SEARCHDEVICE");
    setLoading(false);
    const result = [];
    const listdevice = backupdata;
    for (let i in listdevice) {
      // const deviceID: any = listdevice[i].deviceID
      // console.log(deviceID)
      if (listdevice[i].actived === true) {
        console.log("co chua");
        result.push(listdevice[i]);
      }
    }

    setData(result);
    setLoading(true);
  };

  const searchWaitActiveDevice = () => {
    console.log("SEARCHDEVICE");
    setLoading(false);
    const result = [];
    const listdevice = backupdata;
    for (let i in listdevice) {
      // const deviceID: any = listdevice[i].deviceID
      // console.log(deviceID)
      if (listdevice[i].actived === false) {
        console.log("co chua");
        result.push(listdevice[i]);
      }
    }

    setData(result);
    setLoading(true);
  };

  const reset = () => {
    setLoading(true);
    db.collection("devices")
      .get()
      .then(async (snapShot) => {
        let devices = [];
        setLoading(false);
        snapShot.forEach(async (doc) => {
          // console.log(doc.data())
          let device = doc.data();
          device.deviceID = doc.id;
          devices.push(device);
        });
        setData(devices);
        setBackup(devices);
        setLoading(true);
      });
  };

  console.log(data);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeSearchKey = (event) => {
    console.log(event.target.value);
    setSearchKey(event.target.value);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root} style={{ borderRadius: 10 }}>
      <div
        style={{
          justifyContent: "flex-end",
          display: "flex",
          // backgroundColor: "#e0e0e0",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <InputBase
          className={classes.input}
          placeholder="Nhập từ khóa để tìm kiếm"
          inputProps={{ "aria-label": "search google maps" }}
          onChange={handleChangeSearchKey}
        />
        <IconButton
          type="submit"
          className={classes.iconButton}
          aria-label="search"
          onClick={searchDevice}
        >
          <SearchIcon />
        </IconButton>
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          color="primary"
          className={classes.iconButton}
          aria-label="directions"
          onClick={searchActivedDevice}
        >
          <CheckCircleIcon />
        </IconButton>
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          color="primary"
          className={classes.iconButton}
          aria-label="directions"
          onClick={searchWaitActiveDevice}
        >
          <CancelIcon style={{ color: "red" }} />
        </IconButton>
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          color="primary"
          className={classes.iconButton}
          aria-label="directions"
          onClick={reset}
        >
          <CachedIcon />
        </IconButton>
      </div>
      <TableContainer className={classes.container}>
        {loading === false ? (
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              marginTop: "15%",
            }}
          >
            <CircularProgress mx="auto" />
          </div>
        ) : (
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        if (column.id.localeCompare("actived") === 0) {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value === true ? (
                                <DeviceDialog
                                  deviceID={row["deviceID"]}
                                  actived={row["actived"]}
                                  name={row["device_name"]}
                                  owner={row["auth"]}
                                  info={row["device_desc"]}
                                />
                              ) : (
                                <DeviceDialog
                                  deviceID={row["deviceID"]}
                                  actived={row["actived"]}
                                  owner={row["auth"]}
                                  name={row["device_name"]}
                                  email={row["email"]}
                                />
                              )}
                            </TableCell>
                          );
                        } else if (
                          column.id.localeCompare("refreshtoken") === 0
                        ) {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <DeviceRefreshTokenDialog
                                deviceID={row["deviceID"]}
                                actived={row["actived"]}
                                owner={row["auth"]}
                                name={row["device_name"]}
                                email={row["email"]}
                              />
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
