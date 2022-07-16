import React, { Component } from "react";
import { client } from "@tilework/opus";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GET_CATEGORIES, GET_CURRENCIES, GET_ID } from "./queries/config";

import Navigation from "./components/Navigation";
import PLP from "./components/PLP";
import PDP from "./components/PDP";
import Cart from "./components/Cart";
import ErrorBoundary from "./components/ErrorBoundary";
import ErrorPage from "./components/ErrorPage";

class App extends Component {
  state = {
    category: [],
    currency: [],
    symbol: "$",
    cartItems: [],
    productRoutes: {},
  };

  componentDidMount() {
    client.post(GET_CATEGORIES).then(({ categories }) => {
      this.setState({ category: categories.map((category) => category.name) });
    });

    client.post(GET_CURRENCIES).then(({ currencies }) => {
      this.setState({ currency: currencies });
    });

    client
      .post(GET_ID(window.location.pathname.split("/").slice(-1)[0]))
      .then((response) => {
        let { product } = response;
        if (!product) return;
        else {
          this.setState({
            productRoutes: product,
          });
        }
      });

    if (localStorage.cart) {
      this.setState({ cartItems: JSON.parse(localStorage.cart) || [] });
    }

    if (localStorage.symbol) {
      this.setState({ symbol: JSON.parse(localStorage.symbol) || "$" });
    }

    window.addEventListener("beforeunload", this.handleLocalStorage);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.handleLocalStorage);
  }

  handleLocalStorage = () => {
    localStorage.setItem("cart", JSON.stringify(this.state.cartItems));
    localStorage.setItem("symbol", JSON.stringify(this.state.symbol));
  };

  render() {
    const { category, currency, symbol, cartItems, productRoutes } = this.state;

    const onSymbolChange = (symbol) => {
      let result = currency.map((c) =>
        c.symbol === symbol ? this.setState({ symbol }) : null
      );
      return result;
    };

    const clearCart = () => {
      console.log(this.state.cartItems);
      this.setState({ cartItems: [] });
    };

    const handleCart = (product) => {
      let sameItem = cartItems.findIndex((p) => p.id === product.id) !== -1;

      sameItem
        ? incrementQuantity(product.id)
        : this.setState((prevState) => ({
            cartItems: prevState.cartItems.concat({
              ...product,
              quantity: 1,
            }),
          }));
    };

    const incrementQuantity = (id) => {
      this.setState((prevState) => {
        let updatedCartItems = prevState.cartItems.map((product) => {
          if (product.id === id) {
            return {
              ...product,
              quantity: product.quantity + 1,
            };
          }
          return product;
        });
        return { cartItems: updatedCartItems };
      });
    };

    const decrementQuantity = (id) => {
      this.setState((prevState) => {
        let updatedCartItems = prevState.cartItems
          .map((product) => {
            if (product.id === id) {
              return {
                ...product,
                quantity: product.quantity - 1,
              };
            }
            return product;
          })
          .filter((product) => product.quantity !== 0);
        return { cartItems: updatedCartItems };
      });
    };

    return !category.length ? (
      <h1>Loading...</h1>
    ) : !currency.length ? (
      <h1>Loading...</h1>
    ) : (
      <>
        <Router>
          <Navigation
            category={category}
            currency={currency}
            symbol={symbol}
            onSymbolChange={onSymbolChange}
            cartItems={cartItems}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
            clearCart={clearCart}
          />
          <ErrorBoundary>
            <Routes>
              {category.map((categoryName) => {
                const route = categoryName === "all" ? "/" : categoryName;
                return (
                  <Route
                    path={`/${route}`}
                    key={categoryName}
                    element={
                      <PLP
                        categoryName={categoryName}
                        symbol={symbol}
                        handleCart={handleCart}
                      />
                    }
                  />
                );
              })}
              <Route
                path={`/${productRoutes.category}/${productRoutes.id}`}
                element={
                  <PDP
                    productId={productRoutes.id}
                    symbol={symbol}
                    handleCart={handleCart}
                  />
                }
              />
              <Route
                path="/cart"
                element={
                  <Cart
                    cartItems={cartItems}
                    symbol={symbol}
                    incrementQuantity={incrementQuantity}
                    decrementQuantity={decrementQuantity}
                    clearCart={clearCart}
                  />
                }
              />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </ErrorBoundary>
        </Router>
      </>
    );
  }
}

export default App;
