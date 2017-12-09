import React from 'react';
import AppContainer from '../../containers/appContainer/appContainer.js';
import AuthContainer from '../../containers/authContainer/authContainer.js';

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
          <AuthContainer/>
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
