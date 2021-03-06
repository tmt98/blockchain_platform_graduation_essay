import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Alert from "@material-ui/lab/Alert";
import { useSnackbar } from "material-ui-snackbar-provider";
import Typography from "@material-ui/core/Typography";
// import MuiAlert from "@material-ui/lab/Alert"

import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import axios from "axios";
import { useAuth } from "../hook/use-auth";

// function Alertt(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

export default function DeviceDialog({
  deviceID,
  actived,
  name,
  owner,
  info,
  email,
}) {
  const [open, setOpen] = React.useState(false);
  const [deviceIdIP, setDeviceIdIP] = React.useState("");
  const { state } = useAuth();
  const snackbar = useSnackbar();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleActiveBT = async (event) => {
    event.preventDefault();

    try {
      const result = await axios({
        method: "post",
        url: "http://localhost:4002/api/admin/activedevice",
        headers: {
          Authorization: "Bearer " + state.customClaims.token,
        },
        data: {
          deviceID: deviceIdIP,
          deviceName: name,
          auth: owner,
          email: email,
        },
      });
      const data = result.data;
      if (data.success === true) {
        setOpen(false);
        snackbar.showMessage("success active device");
      } else {
        setOpen(false);
        snackbar.showMessage("Acctive Failed");
      }
    } catch (err) {
      setOpen(false);
      snackbar.showMessage("Acctive Failed : ", err.message);
    }
  };

  useEffect(() => {});

  if (actived === true) {
    return (
      <div>
        <IconButton onClick={handleClickOpen}>
          <CheckCircleIcon style={{ color: "blue" }} />
        </IconButton>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <b>ID thi???t b???:</b> {deviceID}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography variant="caption" display="block" gutterBottom>
                ID thi???t b???
              </Typography>

              <Typography
                variant="h6"
                display="block"
                style={{ color: "black" }}
                gutterBottom
              >
                {deviceID}
              </Typography>
            </DialogContentText>
            <DialogContentText>
              <Typography variant="caption" display="block" gutterBottom>
                T??n thi???t b???
              </Typography>
              <Typography
                variant="h6"
                display="block"
                style={{ color: "black" }}
                gutterBottom
              >
                {name}
              </Typography>
            </DialogContentText>
            <DialogContentText>
              <Typography variant="caption" display="block" gutterBottom>
                Ch??? s??? h???u
              </Typography>
              <Typography
                variant="h6"
                display="block"
                style={{ color: "black" }}
                gutterBottom
              >
                {owner}
              </Typography>
            </DialogContentText>
            <DialogContentText>
              <Typography variant="caption" display="block" gutterBottom>
                Th??ng tin v??? thi???t b???
              </Typography>
              <Typography
                variant="h6"
                display="block"
                style={{ color: "black" }}
                gutterBottom
              >
                {info}
              </Typography>
            </DialogContentText>
            <DialogContentText>
              <Typography variant="caption" display="block" gutterBottom>
                Tr???ng th??i
              </Typography>
              <Alert severity="success">??ang ho???t ?????ng</Alert>
              {/* <CheckCircleIcon
                style={{ marginLeft: 10, color: "green", padding: 0 }}
              >
                ??ang ho???t ?????ng
              </CheckCircleIcon> */}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="secondary">
              ????ng
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <CancelIcon style={{ color: "red" }} />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <b>ID Thi???t b???:</b> {deviceID}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vui l??ng nh???p <b>{deviceID}</b> ????? x??c nh???n t???o m??y.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label=""
            type="email"
            fullWidth
            onInput={(e) => setDeviceIdIP(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="secondary">
            H???y b???
          </Button>
          <Button
            disabled={deviceID === deviceIdIP ? false : true}
            onClick={handleActiveBT}
            variant="contained"
            color="primary"
          >
            ?????ng ??
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
