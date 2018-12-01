import React, { Component } from "react";

interface Props {
  file: File;
  children: (image: HTMLImageElement) => React.ReactNode;
}

type LoadingState =
  | { type: "LOADING" }
  | { type: "LOADED"; result: HTMLImageElement };

interface State {
  loading: LoadingState;
}

const imageFromSrc = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = err => reject(err);

    image.src = src;
  });
};

/**
 * Creates an image from a file. Doesn't observe prop changes.
 */
class ImageFile extends Component<Props, State> {
  state = {
    loading: { type: "LOADING" } as LoadingState
  };

  async componentDidMount(): Promise<void> {
    const url = URL.createObjectURL(this.props.file);
    const image = await imageFromSrc(url);
    this.setState({ loading: { type: "LOADED", result: image } });
  }

  render(): React.ReactNode {
    switch (this.state.loading.type) {
      case "LOADING":
        return "Rendering Image...";
      case "LOADED":
        return this.props.children(this.state.loading.result);
    }
  }
}

export default ImageFile;
