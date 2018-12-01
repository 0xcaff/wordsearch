import React, { Component } from "react";
import { Base64EncodeTransformer, collect, fileAsStream } from "../utils/files";
import { ProgressTransformer } from "../utils/stream";
import { getImageAnnotations } from "../utils/google-cloud-vision";

interface Props {
  file: File;
}

interface State {
  progress: number;
}

class ImageInput extends Component<Props, State> {
  state = {
    progress: 0
  };

  async componentDidMount(): Promise<void> {
    const encoded = await collect(
      fileAsStream(this.props.file)
        .pipeThrough(
          new ProgressTransformer(progress => this.setState({ progress }))
        )
        .pipeThrough(new Base64EncodeTransformer())
    );

    const symbols = await getImageAnnotations(encoded);
    console.log(symbols);
  }

  render() {
    const progress = Math.round(
      (this.state.progress / this.props.file.size) * 100
    );

    return <div>{progress}</div>;
  }
}

export default ImageInput;
