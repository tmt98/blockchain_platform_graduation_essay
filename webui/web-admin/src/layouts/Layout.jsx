import React from 'react'
// import { useStyletron } from 'baseui'
// import { StyledSpinnerNext } from 'baseui/spinner'

import { useAuth } from '../hook/use-auth'

// import { TopBar } from './TopBar'
import  {Login} from './Login'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useHistory,Redirect ,Route} from 'react-router-dom'
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    // '& > * + *': {
    //   marginLeft: theme.spacing(2),
    // },
  },
}));

export const Layout = ({ title, children }) => {
  // const [css] = useStyletron()
  const classes = useStyles();
  const { state }= useAuth()
  const history = useHistory()
  console.log(state)
  if (state.initializing)
    return (
      <div className={classes.root}>
      <CircularProgress  color="secondary" />
    </div>
    )
  if (!state.user) return <Login />
    // if (!state.user) return (<Route render={({location})=>{return (<Redirect push to="/login"/>)}} />)
 
  return (
    state.customClaims.claims.admin ?  
    <>
      {children}
    </> : <Login/>
  )
}
