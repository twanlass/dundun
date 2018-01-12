import React from 'react';
import AppContainer from '../../containers/appContainer/appContainer.js';
import LoginContainer from '../../containers/loginContainer/loginContainer.js';
import SignupContainer from '../../containers/signupContainer/signupContainer.js';

export default class Router extends React.Component {
  route() {
    const {location} = this.props;
    let route = location.pathname;

    switch (route) {
      case '/today':
        return (
          <AppContainer/>
        )

      case '/login':
        return (
          <LoginContainer/>
        )

      case '/signup':
        return (
          <SignupContainer/>
        )

      default:
        return (
          <AppContainer/>
        )
    }
  }

  render() {
    return (
      <div className="todos-app">
        {this.route()}
      </div>
    )
  }
}
