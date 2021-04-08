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
import { CheckCircleIcon, Autorenew } from "@material-ui/icons";
import axios from "axios";
import { useAuth } from "../hook/use-auth";

// function Alertt(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

export default function DeviceRefreshTokenDialog({
  deviceID,
  actived,
  owner,
  email,
  name,
}) {
  const [open, setOpen] = React.useState(false);
  const [deviceToken, setDeviceToken] = React.useState("");
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
        url: "http://localhost:4002/api/admin/refreshdevicetoken",
        headers: {
          Authorization: "Bearer " + state.customClaims.token,
        },
        data: {
          deviceID: deviceID,
          auth: owner,
          oldtoken: deviceToken,
          deviceName: name,
          email: email,
        },
      });
      const data = result.data;
      if (data.success === true) {
        setOpen(false);
        snackbar.showMessage(data.message);
      } else {
        setOpen(false);
        snackbar.showMessage("Refeshtoken Failed");
      }
    } catch (err) {
      setOpen(false);
      snackbar.showMessage("Acctive Failed : ", err.message);
    }
  };

  useEffect(() => {});

  if (actived === false) {
    return (
      <div>
        <IconButton disabled>
          <Autorenew disabled />
        </IconButton>
      </div>
    );
  }
  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <Autorenew style={{ color: "blue" }} />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <b>ID Thiết bị:</b> {deviceID}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vui lòng nhập <b>Token cũ</b> để xác nhận tạo lại mã token.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="token"
            label=""
            type="text"
            fullWidth
            onInput={(e) => setDeviceToken(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Hủy bỏ
          </Button>
          <Button
            disabled={deviceToken === "" ? true : false}
            onClick={handleActiveBT}
            variant="contained"
            color="primary"
          >
            Đồng Ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
