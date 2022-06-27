import React, { Component } from "react";

export default class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  componentDidCatch(error, info) {
    console.log({ error, info });
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <h1>oooops, that is not good</h1>;
    }
    return this.props.children;
  }
}
