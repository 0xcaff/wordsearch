import React, { Component } from 'react';

import Annotations from './Annotations';
import { detectText } from './gcv';

// Google Cloud Vision API Key.
const KEY = `AIzaSyCTrUlRdIIURdW3LMl6yOcCyqooK9qbJR0`;

// TODO: Pretification.
class ImageInput extends Component {
  state = {
    // An array of symbols and their locations.
    annotations: null,

    // An Image object with the selected image.
    image: null,

    // Whether or not something the app is waiting for something.
    loading: false,
  };

  componentDidMount() {
    const { location: { state }, history } = this.props;

    if (!state) {
      history.push('/');
      return;
    }

    const { file } = state;

    this.handleFile(file);
  }

  async onImageChange(event) {
    if (
      !event || !event.target || !event.target.files ||
      !event.target.files.length) {

      return;
    }

    const [ file ] = event.target.files;
    await this.handleFile(file);
  }

  async handleFile(file) {
    this.setState({ error: false, loading: true });

    const encoded = btoa(await read(file));

    const symbols = await detectText(encoded, KEY);
    const image = await imageFromFile(file);

    this.setState({ annotations: symbols, loading: false, image });
  }

  render() {
    const { annotations, image, loading, error } = this.state;

    return (
      <div className='ImageInput'>
        { loading && <span>Loading...</span> }
        { error && <span>Something Went Wrong</span> }

        { annotations &&
          <Annotations
            annotations={annotations}
            image={image} />
        }
      </div>
    );
  }
}

export default ImageInput;

function read(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}

function imageFromFile(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);

    image.src = URL.createObjectURL(file);
  });
}
