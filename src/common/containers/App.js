import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
// import request from 'axios';
import { connect } from 'react-redux';
// import { Link } from 'react-router';
// import classNames from 'classnames';
import * as LayoutActions from '../actions/layout';
import * as UserActions from '../actions/user';
// import Helmet from 'react-helmet';
import Home from '../components/Home';
import Login from '../components/Login';
import Header from '../components/layout/Header';
import Paper from 'material-ui/lib/paper';
import cookie from 'react-cookie';

class App extends Component {

  constructor(props) {
    super(props);
    this.eventToggleSidebar = this.eventToggleSidebar.bind(this);
    this.eventUndo = this.eventUndo.bind(this);
    this.eventRedo = this.eventRedo.bind(this);
  }

  componentWillReceiveProps(nextState) {
    if (nextState.user.token && !cookie.load('token')) {
      console.log('Setting up token in cookie');
      cookie.save('token', nextState.user.token);
    }
    if (nextState.user.token && !nextState.user.info) {
      this.props.getUserInfo(nextState.user);
    }

    if (nextState.user.clearCookie && cookie.load('token')) {
      cookie.remove('token');
      this.props.toogleClearCookie();
    }
  }

  eventToggleSidebar(event) {
    event.preventDefault();
    this.props.toggleSidebar(!this.props.layout.sidebarOpen);
  }

  eventUndo(event) {
    event.preventDefault();
    this.props.undo();
  }

  eventRedo(event) {
    event.preventDefault();
    this.props.redo();
  }

  render() {
    const { user } = this.props;
    if (user.isLogin) {
      return (
        <div>
          <Header/>
          <div style={{paddingLeft: 256, paddingTop: 0, margin: '48px 72px'}}>
            <h2 style={{fontWeight: 100}}>Title</h2>
            <Paper style={{padding: 20}}>
              {!this.props.children && <Home />}
              {this.props.children}
            </Paper>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Login />
      </div>
    );
  }

}

App.propTypes = {
  getUserInfo: PropTypes.func,
  toogleClearCookie: PropTypes.func,
  toggleSidebar: PropTypes.func,
  layout: PropTypes.object,
  undo: PropTypes.func,
  redo: PropTypes.func,
  user: PropTypes.object,
  version: PropTypes.string,
  children: PropTypes.object
};

function mapStateToProps(state) {
  return {
    version: state.version,
    user: state.user,
    layout: state.layout.present
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, LayoutActions, UserActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
