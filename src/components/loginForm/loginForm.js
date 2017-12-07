import React from 'react';
import browserHistory from '../../helpers/history.js';
import * as Api from '../../helpers/api.js';
import * as Auth from '../../helpers/auth.js';
import './loginForm.css';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  login() {
    let email = this.state.email;
    let password = this.state.password;
    let user = Api.login({email, password})

    user.then(response => {
      response.json().then(response => {
        // @todo: handle 404 Error

        // Store user token for API calls
        Auth.setUserToken(response.jwt);

        // Route user to Today list
        browserHistory.push('/today','');
      })
    })
  }

  onSubmit() {
    console.log('validate form, then submit')
    this.login()
  }

  handleInputChange(e) {
    let name = e.target.name;
    let value = e.target.value;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div className="form-wrapper">
        <form className="form">
            <div className="form-header">Welcome back</div>
            <label className="form-label">Email</label>
            <input className="form-input" name="email" type="text" value={this.state.email} onChange={this.handleInputChange.bind(this)}/>
            <label className="form-label">Password</label>
            <input className="form-input" name="password" type="password" value={this.state.password} onChange={this.handleInputChange.bind(this)}/>
            <div onClick={(e) => {this.onSubmit()}}>Sign in</div>
        </form>
      </div>
    )
  }
}
