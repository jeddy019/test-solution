import React, { Component } from "react";

import OverlayAttributes from "./attributes/OverlayAttributes";

class CartOverlay extends Component {
  getPrice = (prices) => {
    let result = prices.find((price) =>
      price.currency.symbol === this.props.symbol ? price : null
    );
    return result.amount;
  };

  render() {
    const { cartItems, symbol } = this.props;

    const cartRoute = () => {
      window.location.replace("/cart");
    };

    const quantityReducer = (accumulator, value) => {
      accumulator = accumulator + value.quantity;
      return accumulator;
    };

    const amountReducer = (accumulator, value) => {
      let result = value.prices.find((price) =>
        price.currency.symbol === symbol ? price : null
      );
      accumulator = accumulator + result.amount * value.quantity;
      return Math.round(accumulator * 100) / 100;
    };

    let totalQuantity = cartItems.reduce(quantityReducer, 0);
    let totalAmount = cartItems.reduce(amountReducer, 0);

    return !cartItems ? (
      <h1>Loading...</h1>
    ) : (
      <div className="cart-overlay">
        {!totalQuantity ? (
          <h2 className="empty-cart">Your bag is currently empty!</h2>
        ) : (
          <>
            <b>My Bag,</b>{" "}
            {`${totalQuantity} item${totalQuantity > 1 ? "s" : ""}`}{" "}
          </>
        )}
        <div className="overlay-list">
          {!totalQuantity
            ? ""
            : cartItems.map((item, index) => {
                return (
                  <section key={item.id} className="overlay-grid">
                    <div className="overlay-details-container">
                      <div className="overlay-details">
                        {item.brand}
                        <br /> {item.name}
                      </div>
                      <b className="overlay-price">
                        {`${symbol}${this.getPrice(item.prices)}`}
                      </b>
                      <div className="overlay-attributes">
                        <OverlayAttributes
                          attributes={item.attributes}
                          index={index}
                        />
                      </div>
                    </div>
                    <div className="overlay-view-container">
                      <div className="overlay-btns">
                        <button
                          className="overlay-btn"
                          onClick={() => this.props.incrementQuantity(item.id)}
                        >
                          +
                        </button>
                        <div className="overlay-quantity">{item.quantity}</div>
                        <button
                          className="overlay-btn"
                          onClick={() => this.props.decrementQuantity(item.id)}
                        >
                          -
                        </button>
                      </div>
                      <div className="overlay-image-container">
                        <img
                          className="overlay-image"
                          src={item.gallery[0]}
                          alt={item.name}
                        />
                      </div>
                    </div>
                  </section>
                );
              })}
        </div>
        <div className="overlay-total">
          <b>total:</b>
          <b>{`${symbol}${totalAmount}`}</b>
        </div>
        <div className="total-btns">
          <span onClick={() => cartRoute()} className="total-btn view-bag">
            view bag{" "}
          </span>
          <button
            className="total-btn check-out"
            onClick={() => this.props.clearCart()}
          >
            check out
          </button>
        </div>
      </div>
    );
  }
}

export default CartOverlay;
