import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Loading from './Loading';
import Button from './Button';
import Annotations from './Annotations';
import { buildRTree, findGrid, sortWordSelected, getPuzzleFromGrid } from './utils';
import { detectText } from './gcv';

import './ImageInput.css';

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

    // Whether or not an error message should be rendered.
    error: false,

    // A rbush rtree used for knn.
    tree: null,
  };

  // The set of nodes which are selected on the annotation element.
  selected = null;

  // The list of selected words.
  words = [];

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
    try {
      this.setState({ error: false, loading: true });

      const encoded = btoa(await read(file));

      const annotations = await detectText(encoded, KEY);
      const image = await imageFromFile(file);

      const tree = buildRTree(annotations);
      this.setState({ annotations, loading: false, image, tree });
    } catch (e) {
      console.error(e);
      this.setState({ loading: false, error: true });
    }
  }

  selectWord() {
    // get the selected nodes
    const selected = Array.from(this.selected.values());

    // TODO: fixme
    const sorted = sortWordSelected(selected.slice());

    const word = sorted.map(node => node.text).join('');
    // TODO: this
    // this.selected.clear();

    // update all nodes
    // this.updateAllNodes();

    // TODO: Test this

    return word;
  }

  selectPuzzle() {
    const { annotations: data, tree } = this.state;
    const { selected } = this;
    const selectedNodes = data.filter(node => selected.has(node));

    const { avgHeight, avgWidth, xGridLines, yGridLines } = findGrid(selectedNodes);

    // TODO:
    // const xMin = xGridLines[0];
    // const xMax = xGridLines[xGridLines.length - 1];

    // const yMin = yGridLines[0];
    // const yMax = yGridLines[yGridLines.length - 1];

    // draw estimated grid
    // const layer = this.gridOverlayLayer;
    // layer.removeChildren();

    // xGridLines.forEach(x =>
    //   layer.add(new Konva.Line({
    //     points: [x, yMin, x, yMax],
    //     stroke: 'black',
    //   })
    // ));

    // yGridLines.forEach(y =>
    //   layer.add(new Konva.Line({
    //     points: [xMin, y, xMax, y],
    //     stroke: 'black',
    //   })
    // ));

    // layer.batchDraw();

    const output = getPuzzleFromGrid(xGridLines, yGridLines, avgWidth, avgHeight, tree);
    const text = output.map(row => row.join('')).join('\n');

    return text;
  }

  render() {
    const { history } = this.props;
    const { annotations, image, loading, error, tree } = this.state;

    return (
      <div className='ImageInput'>
        { loading && <Loading /> }

        { error &&
          <div className='Error'>
            <span>
              Something Went Wrong :( <Link className='clickable' to='/'>Go Back</Link>
            </span>
          </div>
        }

        { annotations && !loading && !error &&
          <main>
            <h1>Select Puzzle Region</h1>
            <Button onClick={() => this.puzzle = this.selectPuzzle()}>
              Select Puzzle
            </Button>

            <Button onClick={() => this.words.push(this.selectWord())}>
              Add Word
            </Button>

            <Button onClick={() => history.push('/input/text',
              { text: this.puzzle, words: this.words })
            }>
              Continue
            </Button>

            <Annotations
              tree={tree}
              annotations={annotations}
              image={image}
              onSelectedChanged={selected => this.selected = selected} />
          </main>
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
