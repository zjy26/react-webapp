import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

const Home = ({
  match: {
    params: { lang }
  }
}) => <div>home ({lang})</div>;
const About = ({
  match: {
    params: { lang }
  }
}) => <div>about ({lang})</div>;
const Contact = ({
  match: {
    params: { lang }
  }
}) => <div>contact ({lang})</div>;

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/:lang/about" component={About} />
        <Route path="/:lang/contact" component={Contact} />
        <Route path="/:lang/" component={Home} />
        <Redirect to="/en" />
      </Switch>
    );
  }
}
