import React from 'react';
import browserHistory from '../../helpers/history.js';
import * as Api from '../../helpers/api.js';
import * as Auth from '../../helpers/auth.js';
import Footer from '../footer/footer.js';
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
      if (response) {
        // Store user token for API calls
        Auth.setUserToken(response.jwt);

        // Route user to Today list
        browserHistory.push('/today','');
      }
    })
  }

  validate() {
    let email = this.state.email
    let password = this.state.password

    return email && password ? true : false;
  }

  onSubmit(e) {
    e.preventDefault()
    if (this.validate()) {
      this.login()
    }
  }

  onSignup() {
    browserHistory.push('/signup','');
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
      <div className="form-wrapper login-form">
        <form className="form" onSubmit={this.onSubmit.bind(this)} spellCheck="false">
            <img className="login-form-logo" src="/favicon.png" alt="dundun logo" />
            <div className="form-header">Welcome back,<br/>friend.</div>
            <label className="form-label">Email</label>
            <input className="form-input" name="email" type="email" autoFocus={true} value={this.state.email} onChange={this.handleInputChange.bind(this)}/>
            <label className="form-label">Password</label>
            <input className="form-input" name="password" type="password" value={this.state.password} onChange={this.handleInputChange.bind(this)}/>
            <input className="btn" type="submit" value="Sign in &rarr;" />
            <div className="form-link" onClick={this.onSignup.bind(this)}>Or create an account</div>
        </form>
        <Footer />
      </div>
    )
  }
}
