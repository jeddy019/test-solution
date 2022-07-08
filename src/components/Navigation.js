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
    isTop: true,
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const isTop = window.scrollY < 100;
    if (isTop !== this.state.isTop) {
      this.setState({ isTop });
    }
  };

  onBackdropClick = () => {
    document.body.style.overflow = "scroll";
    this.setState({
      backdrop: false,
      currencyToggle: false,
      cartOverlay: false,
    });
  };

  render() {
    const { backdrop, currencyToggle, cartOverlay, isTop } = this.state;
    const { cartItems, category, symbol } = this.props;

    const onCurrencyToggle = () => {
      if (!backdrop || (backdrop && currencyToggle)) {
        this.setState({
          backdrop: !backdrop,
          currencyToggle: !currencyToggle,
        });
      }
      if (backdrop && cartOverlay) {
        document.body.style.overflow = "scroll";
        this.setState({
          backdrop: true,
          currencyToggle: true,
          cartOverlay: false,
        });
      }
    };

    const onCartToggle = () => {
      if (!backdrop || (backdrop && cartOverlay)) {
        if (document.body.style.overflow !== "hidden") {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "scroll";
        }
        this.setState({ backdrop: !backdrop, cartOverlay: !cartOverlay });
      }
      if (backdrop && currencyToggle) {
        document.body.style.overflow = "hidden";
        this.setState({
          backdrop: true,
          currencyToggle: false,
          cartOverlay: true,
        });
      }
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
            <li onClick={() => this.onBackdropClick()}>
              {category.map((categoryName, index) => {
                return (
                  <NavLink
                    to={
                      categoryName === this.props.category[0]
                        ? "/"
                        : `/${categoryName}`
                    }
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
            <div className="currency-container">
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
            <div className="dropdown">
              <button onClick={onCartToggle} className="nav-cart">
                {cartItems.length === 0 ? (
                  ""
                ) : (
                  <span className="cart-quantity">{totalQuantity}</span>
                )}
                <NavCart className="nav-cart-icon" />
              </button>
              <div className="cart-dropdown">
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
            className={`${
              cartOverlay ? `${isTop ? "backdrop" : "newBackdrop"} frame` : ""
            }`}
            onClick={() => this.onBackdropClick()}
          />
        )}
      </nav>
    );
  }
}

export default Navigation;
