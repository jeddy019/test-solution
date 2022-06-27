import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as CartIcon } from "../svg/cart-logo.svg";

class All extends Component {
  getPrice = (prices) => {
    let result = prices.find((price) =>
      price.currency.symbol === this.props.symbol ? price : null
    );
    return result.amount;
  };

  onCartAdd = (product) => {
    let updatedProduct = {};
    if (product.attributes.length === 0) {
      updatedProduct = {
        ...product,
        quantity: 1,
      };
      this.props.handleCart(updatedProduct);
    } else {
      const updatedAttributes = product.attributes.map((attr) => {
        return {
          ...attr,
          items: attr.items.map((item, index) => {
            return index === 0
              ? { ...item, selected: true }
              : { ...item, selected: false };
          }),
        };
      });
      updatedProduct = {
        ...product,
        attributes: updatedAttributes,
        quantity: 1,
      };
      this.props.handleCart(updatedProduct);
    }
  };

  render() {
    return (
      <div className="section-center">
        <h2 className="category-name">{this.props.products[0].name}</h2>
        <div className="product-items">
          {this.props.products[0].products.map((product) => {
            const { id, name, inStock, brand, gallery, prices } = product;
            return (
              <div
                key={id}
                className="product-grid"
                style={{
                  boxShadow: !inStock && "none",
                  transform: !inStock && "none",
                }}
              >
                <div
                  className="product-container"
                  style={{
                    opacity: !inStock && 0.45,
                    cursor: !inStock && "default",
                  }}
                >
                  <Link to={`/${id}`}>
                    <div className="image-container">
                      <img
                        className="photo"
                        alt={name}
                        src={gallery[0]}
                        style={{
                          aspectRatio: "1 / 1",
                          cursor: !inStock && "default",
                        }}
                      />
                      {!inStock && <h1 className="stock">out of stock</h1>}
                    </div>
                  </Link>
                  <CartIcon
                    onClick={() => this.onCartAdd(product)}
                    className="cart-icon"
                    style={{
                      display: !inStock && "none",
                    }}
                  />
                  <Link to={`/${id}`}>
                    <div
                      className="product-details"
                      style={{
                        cursor: !inStock && "default",
                      }}
                    >
                      <p className="product-name">{`${brand} ${name}`}</p>
                      <div className="price">
                        <b>{`${this.props.symbol}${this.getPrice(prices)}`}</b>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default All;
