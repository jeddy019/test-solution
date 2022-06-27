import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import Currency from "./Currency";
import CartOverlay from "./CartOverlay";
import { ReactComponent as Logo } from "../svg/logo.svg";
import { ReactComponent as CurrencyArrow } from "../svg/currency-arrow.svg";
import { ReactComponent as NavCart } from "../svg/nav-cart.svg";

class Navigation extends Component {
  state = {
    backdrop: false,
    currencyToggle: false,
    cartOverlay: false,
  };

  onBackdropClick() {
    this.setState({
      backdrop: false,
      currencyToggle: false,
      cartOverlay: false,
    });
  }

  render() {
    const { backdrop, currencyToggle, cartOverlay } = this.state;
    const { cartItems, category, symbol } = this.props;

    const onCurrencyToggle = () => {
      if (!backdrop || (backdrop && currencyToggle))
        this.setState({
          backdrop: !backdrop,
          currencyToggle: !currencyToggle,
        });
      if (backdrop && cartOverlay)
        this.setState({
          backdrop: true,
          currencyToggle: true,
          cartOverlay: false,
        });
    };

    const onCartToggle = () => {
      if (!backdrop || (backdrop && cartOverlay))
        this.setState({ backdrop: !backdrop, cartOverlay: !cartOverlay });
      if (backdrop && currencyToggle)
        this.setState({
          backdrop: true,
          currencyToggle: false,
          cartOverlay: true,
        });
    };

    const quantityReducer = (accumulator, value) => {
      accumulator = accumulator + value.quantity;
      return accumulator;
    };

    let totalQuantity = cartItems.reduce(quantityReducer, 0);

    return (
      <nav className="navbar">
        <div className="nav-center">
          <ul className="categories">
            <li>
              {category.map((categoryName, index) => {
                return (
                  <NavLink
                    to={categoryName === "all" ? "/" : `/${categoryName}`}
                    key={index}
                  >
                    {categoryName}
                  </NavLink>
                );
              })}
            </li>
          </ul>
          <Logo />
          <div className="right">
            <div className="categories dropdown">
              <span>{symbol}</span>
              <div className="currency" onClick={onCurrencyToggle}>
                <button
                  className={`currency-arrow${currencyToggle ? " rotate" : ""}`}
                >
                  <CurrencyArrow />
                </button>
                {currencyToggle && (
                  <Currency
                    currency={this.props.currency}
                    onSymbolChange={this.props.onSymbolChange}
                  />
                )}
              </div>
            </div>
            <div className="categories dropdown">
              <button onClick={onCartToggle} className="nav-cart">
                {cartItems.length === 0 ? (
                  ""
                ) : (
                  <span className="cart-quantity">{totalQuantity}</span>
                )}
                <NavCart style={{ marginTop: "14.5px" }} />
              </button>
              <div
                className="categories dropdown"
                style={{ position: "fixed", zIndex: 3 }}
              >
                {cartOverlay && (
                  <CartOverlay
                    cartItems={cartItems}
                    symbol={symbol}
                    incrementQuantity={this.props.incrementQuantity}
                    decrementQuantity={this.props.decrementQuantity}
                    clearCart={this.props.clearCart}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {backdrop && (
          <div
            className={`backdrop${cartOverlay ? " frame" : ""}`}
            onClick={() => this.onBackdropClick()}
          />
        )}
      </nav>
    );
  }
}

export default Navigation;
