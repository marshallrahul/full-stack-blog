import React from 'react';

import {Route, Switch, withRouter} from 'react-router-dom';

import Header from './components/header/header.component';
import HomePage from './pages/homepage/homepage.component';
import LogIn from './pages/login/log-in.component';
import SignUp from './pages/signup/sign-up.component';
import ViewPage from './pages/viewpage/viewpage.component';

import './App.css';

const App = props => {
  // SIGNUP
  const signupHandler = (event, authData) => {
    event.preventDefault ();

    const graphqlQuery = {
      query: `
        mutation {
          createUser(inputData: {email: "${authData.email}", password: "${authData.password}", name: "${authData.name}"}) {
            name
            email
          }
        }
      `,
    };
    fetch ('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify (graphqlQuery),
    })
      .then (res => {
        return res.json ();
      })
      .then (resData => {
        console.log (resData);
        if (resData.errors) {
          throw new Error ('Creating user falied');
        }
        props.history.push ('/');
      })
      .catch (err => {
        console.log (err);
      });
  };

  // LOGIN
  const loginHandler = (event, authData) => {
    event.preventDefault ();

    const graphqlQuery = {
      query: `
        {
          login(email: "${authData.email}", password: "${authData.password}") {
            userId
            token
          }
        }
      `,
    };
    fetch ('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify (graphqlQuery),
    })
      .then (res => {
        return res.json ();
      })
      .then (resData => {
        console.log (resData);
        if (resData.errors) {
          throw new Error ('Login user falied');
        }
        localStorage.setItem ('token', resData.data.login.token);
        localStorage.setItem ('userId', resData.data.login.userId);
        const remainingMiliSeconds = 60 * 60 * 100;
        const expiryDate = new Date (
          new Date ().getTime () + remainingMiliSeconds
        );
        localStorage.setItem ('expiryDate', expiryDate.toISOString ());
        autoLogout (remainingMiliSeconds);
        if (localStorage.getItem ('token') !== 'undefined') {
          props.history.push ('/');
        }
      })
      .catch (err => {
        console.log (err);
      });
  };

  // LOGOUT
  const logoutHandler = () => {
    localStorage.removeItem ('token');
    localStorage.removeItem ('userId');
    localStorage.removeItem ('expiryDate');
    props.history.push ('/login');
  };

  // AUTO LOGOUT
  const autoLogout = miliseconds => {
    setTimeout (() => {
      logoutHandler ();
    }, miliseconds);
  };

  return (
    <div>
      <Header
        isAuth={localStorage.getItem ('token')}
        onLogout={logoutHandler}
      />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route
          exact
          path="/login"
          render={props => <LogIn {...props} onLogin={loginHandler} />}
        />
        <Route
          exact
          path="/signup"
          render={props => <SignUp {...props} onSignup={signupHandler} />}
        />
        <Route path="/:postId" component={ViewPage} />
      </Switch>
    </div>
  );
};

export default withRouter (App);
