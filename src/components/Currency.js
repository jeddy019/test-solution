import React, { Component } from "react";

export default class Currency extends Component {
  render() {
    return (
      <div className="parent-dropdown">
        <ul>
          {this.props.currency.map((price, index) => {
            return (
              <li
                onClick={() => this.props.onSymbolChange(price.symbol)}
                key={index}
                className="currency-symbol"
              >
                {`${price.symbol} ${price.label}`}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
