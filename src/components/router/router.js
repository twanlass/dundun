import React from 'react';
import AppContainer from '../../containers/appContainer/appContainer.js';

export default class Router extends React.Component {
  route() {
    const {location} = this.props;
    console.log(location)

    switch (location.pathname) {
      case '/today':
        return (
          <AppContainer/>
        )

      case '/login':
        return (
          <h1>Login page</h1>
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
