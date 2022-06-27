import React, { PureComponent } from "react";

export default class Prices extends PureComponent {
  render() {
    return (
      <div className="item-price">
        <p>{this.props.symbol}</p>
        <p>amount</p>
      </div>
    );
  }
}
