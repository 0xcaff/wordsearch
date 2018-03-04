import { Component } from "react";

let isTouchEnabled = false;
window.addEventListener("touchstart", () => {
  isTouchEnabled = true;
});

// A component which renders its children when it decides the device is user
// touch enabled.
export default class TouchEnabled extends Component {
  state = { isTouchEnabled };

  constructor(props) {
    super(props);

    this.onTouchStart = this.onTouchStart.bind(this);
  }

  componentDidMount() {
    window.addEventListener("touchstart", this.onTouchStart);
  }

  componentWillUnmount() {
    window.removeEventListener("touchstart", this.onTouchStart);
  }

  onTouchStart() {
    this.setState({ isTouchEnabled: true });
  }

  render() {
    const { children } = this.props;
    const { isTouchEnabled } = this.state;

    if (!isTouchEnabled) {
      return null;
    }

    return children;
  }
}
