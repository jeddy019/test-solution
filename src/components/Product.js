import React from "react";
import { useParams } from "react-router-dom";

import ProductAttributes from "./attributes/ProductAttributes";

export function withRouter(Children) {
  return (props) => {
    const match = { params: useParams() };
    return <Children {...props} match={match} />;
  };
}

class Product extends React.Component {
  state = {
    image: "",
    attributes: this.props.products[0].products.find(
      (item) => item.id === this.props.match.params.id
    ).attributes,
    message: "",
    success: "",
  };

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
    const { image, message, success } = this.state;

    const products = this.props.products[0].products.find(
      (item) => item.id === this.props.match.params.id
    );

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

    const attrName = products.attributes.map((attr) => attr.name).join(", ");

    const conditionalAddToCart = (product) => {
      const picked = this.state.attributes.map((attr) =>
        attr.items.find((index) => index.selected === true)
      );

      if (picked.every((item) => item !== undefined)) {
        const newId = `${product.id} ${picked.map((i) => i.id).join(" ")}`;
        const updatedProduct = {
          ...product,
          attributes: this.state.attributes,
          quantity: 1,
          id: newId,
        };

        this.props.handleCart(updatedProduct);
        this.setState({
          message: `${products.brand} ${products.name} has been added to your bag!`,
        });
        this.setState({ success: "green" });
      } else {
        this.setState({
          message: `please select an attribute from ${attrName}`,
        });
        this.setState({ success: "" });
      }
    };

    return (
      <div className="single-product">
        <div className="image-section">
          <div className="small-images">
            {products.gallery.map((item, index) => (
              <img
                key={index}
                className="small-img"
                onClick={() => this.onImageChange(item)}
                src={item}
                alt={products.name}
              />
            ))}
          </div>
          <img
            src={image ? image : products.gallery[0]}
            alt={products.name}
            className="main-img"
          />
        </div>
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
            <button className="out-of-stock">out of stock</button>
          )}
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: products.description }}
          ></div>
        </div>
      </div>
    );
  }
}

export default withRouter(Product);
