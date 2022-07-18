import React, { Component } from "react";
import { client } from "@tilework/opus";
import { GET_PRODUCT_BY_ID } from "../queries/config";

import ProductAttributes from "./attributes/ProductAttributes";

const parse = require("html-react-parser");

class PDP extends Component {
  state = {
    products: undefined,
    image: "",
    attributes: [],
    message: "",
    success: "",
  };

  componentDidMount() {
    client.post(GET_PRODUCT_BY_ID(this.props.productId)).then((response) => {
      let { product } = response;
      if (!product) return;
      else {
        this.setState({ products: product });
        this.setState({ attributes: product.attributes });
      }
    });
  }

  onImageChange = (image) => {
    this.setState({ image });
  };

  getPrice = (prices) => {
    let result = prices.find((price) =>
      price.currency.symbol === this.props.symbol ? price : null
    );
    return result.amount;
  };

  render() {
    const { products, image, message, success } = this.state;

    const OnAttributeChange = ({ target }) => {
      const nextState = this.state.attributes.map((attr) => {
        if (attr.name !== target.name) return attr;

        return {
          ...attr,
          items: attr.items.map((item) => {
            const checked = item.value === target.value;

            return {
              ...item,
              selected: checked,
            };
          }),
        };
      });

      this.setState({
        attributes: nextState,
        message: "",
      });
    };

    const conditionalAddToCart = (product) => {
      const { products, attributes } = this.state;
      const picked = attributes.map((attr) =>
        attr.items.find((index) => index.selected === true)
      );

      if (picked.every((item) => item !== undefined)) {
        const newId = `${product.id} ${picked.map((i) => i.id).join(" ")}`;
        const updatedProduct = {
          ...product,
          attributes: attributes,
          quantity: 1,
          id: newId,
        };

        this.props.handleCart(updatedProduct);
        this.setState({
          message: `${products.brand} ${products.name} has been added to your bag!`,
        });
        this.setState({ success: "green" });
      } else {
        const attrName = attributes.map((attr) => attr.name).join(", ");
        this.setState({
          message: `please select an attribute from ${attrName}`,
        });
        this.setState({ success: "" });
      }
    };

    return products === undefined ? (
      <h1>Loading...</h1>
    ) : (
      <div className="single-product">
        <div className="image-section">
          <div className="small-images">
            {products.gallery.map((item, index) => (
              <div className="new-img-container" key={index}>
                <img
                  className="small-img"
                  onClick={() => this.onImageChange(item)}
                  src={item}
                  alt={products.name}
                />
              </div>
            ))}
          </div>
          <img
            src={image ? image : products.gallery[0]}
            alt={products.name}
            className="main-img"
          />
        </div>
        {!products.inStock && <p className="out-of-stock">out of stock</p>}
        <div className="single-product-details">
          <h2 className="single-product-brand">{products.brand}</h2>
          <br />
          <p className="single-product-name">{products.name}</p>
          <br />

          <div className="single-product-attributes">
            <ProductAttributes
              attributes={products.attributes}
              id={products.id}
              OnAttributeChange={OnAttributeChange}
            />
          </div>
          <>
            <span className="product-label">PRICE:</span>
            <br />
            <span className="single-product-price">
              {this.props.symbol}
              {this.getPrice(products.prices)}
            </span>
          </>
          {products.inStock ? (
            <>
              <button
                className="add-to-cart"
                onClick={() => {
                  conditionalAddToCart(products);
                }}
              >
                add to cart
              </button>
              {success === "green" ? (
                <p className="alert success">{message}</p>
              ) : (
                <p className="alert danger">{message}</p>
              )}
            </>
          ) : (
            <button disabled className="add-to-cart">
              add to cart
            </button>
          )}
          <div className="description">{parse(products.description)}</div>
        </div>
      </div>
    );
  }
}

export default PDP;
