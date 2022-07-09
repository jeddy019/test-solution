import React, { Component } from "react";
import { client } from "@tilework/opus";
import { GET_PRODUCT_BY_CATEGORY, GET_PRODUCT_BY_ID } from "../queries/config";
import { ReactComponent as CartIcon } from "../svg/cart-logo.svg";

class PLP extends Component {
  state = { products: [] };

  fetchData() {
    client
      .post(GET_PRODUCT_BY_CATEGORY(this.props.categoryName))
      .then((result) => {
        this.setState({ products: result.category.products });
      });
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.categoryName !== this.props.categoryName) {
      return this.fetchData();
    }
  }

  getPrice = (prices) => {
    let result = prices.find((price) =>
      price.currency.symbol === this.props.symbol ? price : null
    );
    return result.amount;
  };

  onCartAdd = (id) => {
    client.post(GET_PRODUCT_BY_ID(id)).then((response) => {
      let { product } = response;
      if (!product) return;
      else {
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
      }
    });
  };

  render() {
    const { products } = this.state;

    const productRoute = (route) => {
      window.location.replace(route);
    };

    return !products.length ? (
      <h1>Loading...</h1>
    ) : (
      <div className="section-center">
        <h2 className="category-name">{this.props.categoryName}</h2>
        <div className="product-items">
          {products.map((product) => {
            const { id, name, inStock, category, brand, gallery, prices } =
              product;
            return (
              <section
                key={id}
                className={inStock ? "product-grid" : "product-grid-stock"}
              >
                <div
                  className={
                    inStock ? "product-container" : "product-container-stock"
                  }
                >
                  <section
                    className="product-section"
                    onClick={() => productRoute(`/${category}/${id}`)}
                  >
                    <div className="image-container">
                      <img
                        className={inStock ? "photo" : "photo-stock"}
                        alt={`${brand} ${name}`}
                        src={gallery[0]}
                      />
                      {!inStock && <h1 className="stock">out of stock</h1>}
                    </div>
                  </section>
                  <CartIcon
                    onClick={() => this.onCartAdd(id)}
                    className={inStock ? "cart-icon" : "cart-icon-stock"}
                  />
                  <section
                    className="product-section"
                    onClick={() => productRoute(`/${category}/${id}`)}
                  >
                    <div className="product-details">
                      <p className="product-name">{`${brand} ${name}`}</p>
                      <div className="price">
                        <b>{`${this.props.symbol}${this.getPrice(prices)}`}</b>
                      </div>
                    </div>
                  </section>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    );
  }
}

export default PLP;
