import React from 'react'

const Header = ({
  login,
  logout,
  stateMe
}) => {
  return (
    <header className="moya__header">
      <h1>
        <img src="images/obousan.gif" className="moya__h1_image moya__h1_image_first" alt="obousan"/>
        MOYAMOYA GUGUTASU
        <img src="images/samurai.gif" className="moya__h1_image moya__h1_image_last" alt="samurai"/>
      </h1>
      <button onClick={login} className={stateMe ? 'hidden' : undefined}>Login</button>
      <button onClick={logout} className={!stateMe ? 'hidden' : undefined}>Logout</button>
    </header>
  )
}

export default Header
