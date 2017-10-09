import React, { Component } from 'react';
import KeyHandler, { KEYPRESS } from 'react-key-handler';
import Konva from 'konva';
import { Link } from 'react-router-dom';

import List from './List';
import Loading from './Loading';
import Button from './Button';
import ToggleButton from './ToggleButton';
import Annotations from './Annotations';
import TouchEnabled from './TouchEnabled';

import { buildRTree, findGrid, sortWordSelected, getPuzzleFromGrid } from './utils';
import { detectText } from './gcv';

import './ImageInput.css';

// Google Cloud Vision API Key.
const KEY = `AIzaSyCTrUlRdIIURdW3LMl6yOcCyqooK9qbJR0`;

const puzzleLineStyle = {
  stroke: 'black',
  opacity: 0.1,
};

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

    // The puzzle text.
    puzzle: '',

    // The list of selected words.
    words: [],

    // The set of nodes which are selected on the annotation element.
    selected: undefined,

    // A list of shapes to display over the image.
    shapes: [],

    // Whether or not the selection is in an inverted mode.
    invertSelection: false,
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
    try {
      this.setState({ error: false, loading: true });

      const encoded = btoa(await read(file));

      const annotations = await detectText(encoded, KEY);
      const image = await imageFromFile(file);

      const tree = buildRTree(annotations);
      this.setState({ annotations, loading: false, image, tree });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.setState({ loading: false, error: true });
    }
  }

  onSelectWord() {
    const { selected } = this.state;

    // get the selected nodes
    const selectedArr = Array.from(selected);
    const sorted = sortWordSelected(selectedArr);
    const word = sorted.map(node => node.text).join('');

    this.setState(({ words }) => ({
      selected: new Set(),
      words: words.concat(word),
    }));
  }

  onSelectPuzzle() {
    const { annotations: data, tree, selected } = this.state;
    const selectedNodes = data.filter(node => selected.has(node));

    const { avgHeight, avgWidth, xGridLines, yGridLines } = findGrid(selectedNodes);

    const xMin = xGridLines[0];
    const xMax = xGridLines[xGridLines.length - 1];

    const yMin = yGridLines[0];
    const yMax = yGridLines[yGridLines.length - 1];

    const shapes = [].concat(
      xGridLines.map(x =>
        new Konva.Line({
          points: [x, yMin, x, yMax],
          ...puzzleLineStyle,
        })
      ),
      yGridLines.map(y =>
        new Konva.Line({
          points: [xMin, y, xMax, y],
          ...puzzleLineStyle,
        })
      ),
    );

    const output = getPuzzleFromGrid(xGridLines, yGridLines, avgWidth, avgHeight, tree);
    const text = output.map(row => row.join('')).join('\n');

    this.setState({ selected: new Set(), shapes, puzzle: text });
  }

  render() {
    const { history } = this.props;
    const {
      annotations, image, loading, error, tree, puzzle, words, selected, shapes,
      invertSelection,
    } = this.state;

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
            <h1>{ puzzle ? 'Select Words' : 'Select Puzzle Region' }</h1>

            <div className='Content'>
              <Annotations
                tree={tree}
                annotations={annotations}
                image={image}
                selected={selected}
                overlayShapes={shapes}
                invertSelection={invertSelection}
                onSelectedChanged={ selected => this.setState({ selected }) } />

              { puzzle &&
                <div className='Words'>
                  <h2>Words</h2>

                  <List
                    items={words}
                    onChange={ newValue => this.setState({ words: newValue }) } />
                </div>
              }
            </div>

            <div className='Buttons'>
              { !puzzle &&
                <Button onClick={() => this.onSelectPuzzle()}>
                  Select Puzzle
                </Button>
              }

              { !puzzle &&
                <ActionKeyHandler onAction={() => this.onSelectPuzzle()} />
              }

              { puzzle &&
                <Button onClick={() => this.onSelectWord()}>
                  Add Word
                </Button>
              }

              { puzzle &&
                <ActionKeyHandler onAction={() => this.onSelectWord()} />
              }

              { puzzle &&
                <Button onClick={() =>
                  history.push('/input/text', { text: puzzle, words })
                }>

                  Continue
                </Button>
              }

              <TouchEnabled>
                <ToggleButton
                  onChange={invertSelection => this.setState({ invertSelection })}
                  active={invertSelection}>

                  Invert Selection
                </ToggleButton>
              </TouchEnabled>
            </div>
          </main>
        }

      </div>
    );
  }
}

const actionKeys = [ 'Enter', ' ' ];

const ActionKeyHandler = ({ onAction }) =>
  actionKeys.map(key =>
    <KeyHandler
      key={key}
      keyEventName={KEYPRESS}
      keyValue={key}
      onKeyHandle={onAction} />
  );

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
