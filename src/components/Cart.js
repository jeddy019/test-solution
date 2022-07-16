import React, { Component } from "react";
import ImageSlider from "./ImageSlider";
import CartAttributes from "./attributes/CartAttributes";

class Cart extends Component {
  getPrice = (prices) => {
    let result = prices.find((price) =>
      price.currency.symbol === this.props.symbol ? price : null
    );
    return result.amount;
  };

  render() {
    const { cartItems, symbol } = this.props;

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

    const getTax = () => {
      const tax = (totalAmount / 100) * 21;
      return tax.toFixed(2);
    };

    return !cartItems ? (
      <h1>Loading...</h1>
    ) : (
      <div className="cart">
        <h1 className="cart-tag">cart</h1>
        {cartItems.length === 0 ? (
          <h2>Cart Is Empty</h2>
        ) : (
          <div>
            <section className="cart-details">
              {cartItems.map((item, index) => {
                return (
                  <div key={item.id}>
                    <div className="cart-item">
                      <section>
                        <h2 className="item-brand">{item.brand}</h2>
                        <p className="item-name">{item.name}</p>
                        <span className="item-price">
                          {`${this.props.symbol}${this.getPrice(item.prices)}`}
                        </span>
                        <div className="cart-attributes">
                          <CartAttributes
                            attributes={item.attributes}
                            index={index}
                          />
                        </div>
                      </section>
                      <div className="item-images">
                        <div className="activity">
                          <span
                            onClick={() =>
                              this.props.incrementQuantity(item.id)
                            }
                            className="activity-btn"
                          >
                            +
                          </span>
                          <span className="quantity">{item.quantity}</span>
                          <span
                            className="activity-btn"
                            onClick={() =>
                              this.props.decrementQuantity(item.id)
                            }
                          >
                            -
                          </span>
                        </div>
                        <section>
                          <ImageSlider
                            gallery={item.gallery}
                            name={item.name}
                          />
                        </section>
                      </div>
                    </div>
                    <hr width="auto" color="#E5E5E5" size="1" />
                  </div>
                );
              })}
            </section>
            <div className="cart-result">
              <>
                <div className="cart-tax">Tax 21%: </div>
                <p>{symbol + getTax()}</p>
                <div className="result-quantity">Quantity: </div>
                <p>{totalQuantity}</p>
                <div className="cart-total">Total: </div>
                <p>{symbol + totalAmount}</p>
              </>
              <button
                className="order-btn"
                onClick={() => this.props.clearCart()}
              >
                Order
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Cart;
