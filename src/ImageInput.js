import React, { Component } from 'react';

import InputButton from './InputButton';

import Annotations from './Annotations';
import { getSymbols } from './utils';
import { detectText } from './gcv';

// Google Cloud Vision API Key.
const KEY = `AIzaSyCTrUlRdIIURdW3LMl6yOcCyqooK9qbJR0`;

// TODO: Potentially Expect a File in the Constructor
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

  async onImageChange(event) {
    if (
      !event || !event.target || !event.target.files ||
      !event.target.files.length) {

      return;
    }

    this.setState({ error: false, loading: true });

    const [ file ] = event.target.files;
    const encoded = btoa(await read(file));

    const symbols = await detectText(encoded, KEY);
    const image = await imageFromFile(file);

    this.setState({ annotations: symbols, loading: false, image });
  }

  render() {
    const { annotations, image, loading, error } = this.state;

    return (
      <div className='ImageInput'>
        <InputButton
          onChange={event => this.onImageChange(event)
            .catch(() => this.setState({ error: true, loading: false })
          )}
          disabled={loading}>
            Extract from Image
        </InputButton>

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
