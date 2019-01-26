import React from 'react'
import {auth, provider} from '../js/firebase';

class Header extends React.Component {
  login = (e) => {
    auth.signInWithPopup(provider);
  }

  logout = (e) => {
    auth.signOut();
  }

  render() {
    return (
      <header className="moya__header">
        <h1>
          <img src="images/obousan.gif" className="moya__h1_image moya__h1_image_first" alt="obousan"/>
          MOYAMOYA GUGUTASU
          <img src="images/samurai.gif" className="moya__h1_image moya__h1_image_last" alt="samurai"/>
        </h1>
        <button onClick={this.login} className={this.props.stateMe ? 'hidden' : undefined}>Login</button>
        <button onClick={this.logout} className={!this.props.stateMe ? 'hidden' : undefined}>Logout</button>
      </header>
    )
  }
}

export default Header
