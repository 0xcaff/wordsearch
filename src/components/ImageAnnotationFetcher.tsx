import React, { Component } from "react";
import { Base64EncodeTransformer, collect, fileAsStream } from "../utils/files";
import { ProgressTransformer } from "../utils/stream";
import {
  getImageAnnotations,
  SymbolWithBoundingBox
} from "../utils/googleCloudVision";
import FullPageText from "./FullPageText";

interface Props {
  file: File;
  children: (annotations: SymbolWithBoundingBox[]) => React.ReactNode;
}

enum LoadingStateType {
  STARTING,
  ENCODING_FILE,
  API_REQUEST,
  DONE
}

type LoadingState =
  | { type: LoadingStateType.STARTING }
  | {
      type: LoadingStateType.ENCODING_FILE;

      /**
       * A number between 0 and 100 indicating how much of the encoding step is done.
       */
      progress: number;
    }
  | { type: LoadingStateType.API_REQUEST }
  | { type: LoadingStateType.DONE; result: SymbolWithBoundingBox[] };

interface State {
  loading: LoadingState;
}

/**
 * Fetches annotations for a file. Displays loading states. Doesn't re-fetch on prop change.
 */
class ImageAnnotationFetcher extends Component<Props, State> {
  state = {
    loading: { type: LoadingStateType.STARTING } as LoadingState
  };

  async componentDidMount(): Promise<void> {
    this.setState({
      loading: { type: LoadingStateType.ENCODING_FILE, progress: 0 }
    });

    const encoded = await collect(
      fileAsStream(this.props.file)
        .pipeThrough(
          new ProgressTransformer(progress =>
            this.setState({
              loading: {
                type: LoadingStateType.ENCODING_FILE,
                progress: Math.round((progress / this.props.file.size) * 100)
              }
            })
          )
        )
        .pipeThrough(new Base64EncodeTransformer())
    );

    this.setState({ loading: { type: LoadingStateType.API_REQUEST } });
    const symbols = await getImageAnnotations(encoded);
    this.setState({
      loading: { type: LoadingStateType.DONE, result: symbols }
    });
  }

  render(): React.ReactNode {
    const loading = this.state.loading;
    switch (loading.type) {
      case LoadingStateType.STARTING:
        return <FullPageText>Loading...</FullPageText>;

      case LoadingStateType.ENCODING_FILE:
        return <FullPageText>Encoding File {loading.progress}</FullPageText>;

      case LoadingStateType.API_REQUEST:
        return <FullPageText>Asking Robots for Help... 🤖</FullPageText>;

      case LoadingStateType.DONE:
        return this.props.children(loading.result);
    }
  }
}

export default ImageAnnotationFetcher;
