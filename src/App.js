import React from 'react';
import browserHistory from './helpers/history.js';
import Router from './components/router/router.js';

import './css/variables.css';
import './css/app.css';
import './css/typography.css';
import './css/form.css';
import './css/button.css';
import './css/todo-icon-font.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // Set the initial location
    this.state = {
      location: browserHistory.location
    };
  }

  componentDidMount() {
    this.unsubscribe = browserHistory.listen(location => {
      this.setState({location});
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return <Router location={this.state.location}/>
  }
}
