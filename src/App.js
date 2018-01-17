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

      // Reinitialize Headway on route change
      this.init_headway();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  init_headway() {
    const hw_config = {
      selector: ".js-headway",
      trigger: ".sidebar-logo",
      account:  "7LY9XJ"
    };
    window.Headway.init(hw_config);
  }

  render() {
    return <Router location={this.state.location}/>
  }
}
