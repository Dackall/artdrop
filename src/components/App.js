import React from 'react';
import Router from 'react-router';
import s from '../styles/main.scss';
export default React.createClass({
  render() {
    return (
      <div>
        <div className="nav-bar">
          Nav bar here
        </div>

        <h1>Hello, app HERE.</h1>
        <Router.RouteHandler/>
      </div>
    );
  }
})
