import React from 'react'
import { useStyletron } from 'baseui'
import { StyledSpinnerNext } from 'baseui/spinner'

import { useAuth } from '../../hooks/use-auth'

import { Nav } from './nav'
import { LoginForm } from './login'

export const Layout: React.FC<{ title?: string }> = ({ title, children }) => {
  const [css] = useStyletron()
  const { state }: any = useAuth()
  console.log(state)
  if (state.initializing)
    return (
      <div
        className={css({
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        })}
      >
        <StyledSpinnerNext />
      </div>
    )
  if (!state.user) return <LoginForm />

  return (
    <>
      <Nav />
      {children}
    </>
  )
}
