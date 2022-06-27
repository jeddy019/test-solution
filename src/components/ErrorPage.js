import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

export default class ErrorPage extends PureComponent {
  render() {
    return (
      <section className="error-page section">
        <div className="error-container">
          <h1>oops! it's a dead end</h1>
          <Link to="/" className="error-btn btn-primary">
            back home
          </Link>
        </div>
      </section>
    );
  }
}
