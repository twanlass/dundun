import React from 'react';
import browserHistory from './helpers/history.js';
import Router from './components/router/router.js';

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
