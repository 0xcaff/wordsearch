import React, { Component } from 'react';
import KeyHandler, { KEYPRESS } from 'react-key-handler';
import Konva from 'konva';
import { Link } from 'react-router-dom';

import List from '../components/List';
import Loading from '../components/Loading';
import Button from '../components/Button';
import ToggleButton from '../components/ToggleButton';
import Annotations from '../components/Annotations';
import TouchEnabled from '../components/TouchEnabled';

import { buildRTree, findGrid, sortWordSelected, getPuzzleFromGrid } from '../processing/utils';
import { detectText } from '../processing/gcv';

import { centered as centeredClass, clickable as clickableClass } from '../components/shared.css';
import {
  error as errorClass, header as headerClass, content as contentClass,
  buttonContainer as buttonContainerClass,
} from './ImageInput.css';

import { dict as imagesDict } from './images';

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
    puzzleRows: null,

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
    const {
      location: { state },
      history,
      match: { params: { example } },
    } = this.props;

    const normalizedState = normalizeState(state, example);
    if (!normalizedState) {
      history.push('/');
      return;
    }

    this.handleState(normalizedState);
  }

  async handleState(state) {
    try {
      this.setState({ error: false, loading: true });

      const { encoded, image } = await extractFromState(state);

      const annotations = await detectText(encoded, KEY);
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
    const rows = output.map(row => row.join(''));

    this.setState({ selected: new Set(), shapes, puzzleRows: rows });
  }

  render() {
    const { history } = this.props;
    const {
      annotations, image, loading, error, tree, puzzleRows, words, selected,
      shapes, invertSelection,
    } = this.state;

    return (
      <div>
        { loading && <div className={centeredClass}>
            <Loading />
          </div>
        }

        { error &&
          <div className={errorClass}>
            <span>
              Something Went Wrong :( <Link className={clickableClass} to='/'>Go Back</Link>
            </span>
          </div>
        }

        { annotations && !loading && !error &&
          <main>
            <h1 className={headerClass}>
              { puzzleRows ? 'Select Words' : 'Select Puzzle Region' }
            </h1>

            <div className={contentClass}>
              <Annotations
                tree={tree}
                annotations={annotations}
                image={image}
                selected={selected}
                overlayShapes={shapes}
                invertSelection={invertSelection}
                onSelectedChanged={ selected => this.setState({ selected }) } />

              { puzzleRows &&
                <div className={headerClass}>
                  <h2>Words</h2>

                  <List
                    items={words}
                    onChange={ newValue => this.setState({ words: newValue }) } />
                </div>
              }
            </div>

            <div className={buttonContainerClass}>
              { !puzzleRows &&
                <Button onClick={() => this.onSelectPuzzle()}>
                  Select Puzzle
                </Button>
              }

              { !puzzleRows &&
                <ActionKeyHandler onAction={() => this.onSelectPuzzle()} />
              }

              { puzzleRows &&
                <Button onClick={() => this.onSelectWord()}>
                  Add Word
                </Button>
              }

              { puzzleRows &&
                <ActionKeyHandler onAction={() => this.onSelectWord()} />
              }

              { puzzleRows &&
                <Button onClick={() =>
                  history.push('/input/text', { rows: puzzleRows, words })
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

function imageFromSrc(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);

    image.src = src;
  });
}

function drawOnCanvas(image) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  Object.assign(canvas, {
    width: image.naturalWidth || image.width,
    height: image.naturalHeight || image.height,
  });

  ctx.drawImage(image, 0, 0);

  return canvas;
}

const toBlob = (canvas) =>
  new Promise(resolve =>
    canvas.toBlob(blob => resolve(blob)));

const extractFromState = async ({ file, image: imageUrl }) => {
  if (file) {
    const encoded = btoa(await read(file));
    const image = await imageFromSrc(URL.createObjectURL(file));

    return { encoded, image };
  } else if (imageUrl) {
    const image = await imageFromSrc(imageUrl);
    const canvas = drawOnCanvas(image);
    const blob = await toBlob(canvas);
    const encoded = btoa(await read(blob));

    return { encoded, image };
  } else {
    throw new TypeError('Invalid State Object');
  }
};

const normalizeState = (state, exampleName) => {
  if (state) {
    return state;
  } else if (exampleName && imagesDict[exampleName]) {
    return imagesDict[exampleName];
  }
}
