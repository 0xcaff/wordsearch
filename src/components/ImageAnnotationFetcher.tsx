import React, { Component } from "react";
import { Symbol } from "../utils/google-cloud-vision-type";
import { Base64EncodeTransformer, collect, fileAsStream } from "../utils/files";
import { ProgressTransformer } from "../utils/stream";
import { getImageAnnotations } from "../utils/google-cloud-vision";

interface Props {
  file: File;
  children: (annotations: Symbol[]) => React.ReactNode;
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
  | { type: LoadingStateType.DONE; result: Symbol[] };

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
        return "Loading...";

      case LoadingStateType.ENCODING_FILE:
        return `Encoding File ${loading.progress}`;

      case LoadingStateType.API_REQUEST:
        return "Asking The Robots for Help...";

      case LoadingStateType.DONE:
        return this.props.children(loading.result);
    }
  }
}

export default ImageAnnotationFetcher;
