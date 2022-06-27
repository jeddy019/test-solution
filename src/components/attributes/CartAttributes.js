import React, { PureComponent } from "react";

export default class CartAttributes extends PureComponent {
  render() {
    const { attributes, index } = this.props;

    return (
      <>
        {attributes.map((attribute) => (
          <section key={attribute.name}>
            <p className="cart-attributes-name">{`${attribute.name}:`}</p>
            <div className="cart-attributes-list">
              {attribute.items.map((item) => (
                <div key={item.id}>
                  <input
                    type="radio"
                    id={`${attribute.id} ${item.id}`}
                    name={`${attribute.name}${index}`}
                    value={item.value}
                  />
                  <label htmlFor={item.id}>
                    <div
                      className={
                        attribute.type === "swatch"
                          ? `cart-attributes-color_${item.selected}`
                          : `cart-attributes-text_${item.selected}`
                      }
                      style={
                        attribute.type === "swatch"
                          ? {
                              background: item.value,
                              border:
                                item.id === "White"
                                  ? "1px solid #1D1F22"
                                  : "none",
                            }
                          : null
                      }
                    >
                      {attribute.type === "swatch" ? "" : item.value}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </section>
        ))}
      </>
    );
  }
}
