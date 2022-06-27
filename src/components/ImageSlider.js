import React, { PureComponent } from "react";
import { ReactComponent as Slider } from "../svg/slider.svg";

export default class ImageSlider extends PureComponent {
  state = {
    count: 0,
  };

  next = () => {
    const { count } = this.state;
    const newCount = count === this.props.gallery.length - 1 ? 0 : count + 1;
    this.setState({ count: newCount });
  };

  previous = () => {
    const { count } = this.state;
    const newCount = count === 0 ? this.props.gallery.length - 1 : count - 1;
    this.setState({ count: newCount });
  };

  render() {
    return (
      <div className="slider">
        {this.props.gallery.length > 1 ? (
          <section className="slider-arrows">
            <span className="arrow-box" onClick={this.previous}>
              <Slider />
            </span>
            <span className="arrow-box right-arrow" onClick={this.next}>
              <Slider />
            </span>
          </section>
        ) : null}
        {this.props.gallery.map((image, index) => {
          return (
            <div key={index}>
              {index === this.state.count && (
                <img className="slide-img" src={image} alt={this.props.name} />
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
