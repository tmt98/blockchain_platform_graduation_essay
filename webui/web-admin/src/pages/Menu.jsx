import React from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";
import PeopleIcon from "@material-ui/icons/People";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 250,
    backgroundColor: theme.palette.background.paper,
  },
  noneTextDecoration: {
    textDecoration: "none",
  },
}));

export default function Menu() {
  const classes = useStyles();
  let pathname = window.location.pathname;
  let key;
  if (pathname.localeCompare("/admin/dashboard") === 0) {
    key = 0;
  } else if (pathname.localeCompare("/admin/devicemanager") === 0) {
    key = 1;
  } else if (pathname.localeCompare("/admin/usermanager") === 0) {
    key = 2;
  }
  const [selectedIndex, setSelectedIndex] = React.useState(key);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        {/* <Link className={classes.noneTextDecoration} to="/admin/dashboard">
          <ListItem
            button
            selected={selectedIndex === 0}
            onClick={(event) => handleListItemClick(event, 0)}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </Link> */}
        <Link className={classes.noneTextDecoration} to="/admin/devicemanager">
          <ListItem
            button
            selected={selectedIndex === 1}
            onClick={(event) => handleListItemClick(event, 1)}
          >
            <ListItemIcon>
              <DeviceHubIcon />
            </ListItemIcon>
            <ListItemText primary="Device Manager" />
          </ListItem>
        </Link>
        {/* <Link className={classes.noneTextDecoration} to="/admin/usermanager">
          <ListItem
            button
            selected={selectedIndex === 2}
            onClick={(event) => handleListItemClick(event, 2)}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="User Manager" />
          </ListItem>
        </Link> */}
      </List>
    </div>
  );
}
