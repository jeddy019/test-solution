import React, { PureComponent } from "react";

export default class ProductAttributes extends PureComponent {
  render() {
    const { attributes, id, OnAttributeChange } = this.props;

    return (
      <>
        {attributes.map((attribute) => (
          <section key={`${id} ${attribute.id}`}>
            <p className="single-attribute-name">{`${attribute.name}:`}</p>
            <div className="single-attribute-list">
              {attribute.items.map((item) => (
                <div key={`${id} ${item.id}`}>
                  <input
                    type="radio"
                    id={`${attribute.id} ${item.id}`}
                    name={attribute.name}
                    value={item.value}
                    checked={item.selected}
                    onChange={OnAttributeChange}
                  />
                  <label htmlFor={`${attribute.id} ${item.id}`}>
                    <div
                      className={
                        attribute.type === "swatch"
                          ? "attribute-color"
                          : "attribute-text"
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
