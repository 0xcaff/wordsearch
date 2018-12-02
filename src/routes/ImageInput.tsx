import React, { useState } from "react";
import { Image, Rect } from "react-konva";
import ImageFile from "../components/ImageFile";
import ResponsiveStage from "../components/ResponsiveStage";
import ResponsiveLayer from "../components/ResponsiveLayer";
import MutableList from "../components/MutableList";
import SymbolRect from "../components/SymbolRect";
import ImageAnnotationFetcher from "../components/ImageAnnotationFetcher";

import styles from "./ImageInput.module.css";
import GridRect from "../components/GridRect";
import { Vector2d } from "konva";
import { getRows, getWord } from "../utils/imageExtraction";
import { SymbolWithBoundingBox } from "../utils/googleCloudVision";

interface Props {
  file: File;
  onInputComplete: (rows: string[], words: string[]) => void;
}

const ImageInput = (props: Props) => (
  <ImageAnnotationFetcher file={props.file}>
    {symbols => (
      <ImageFile file={props.file}>
        {image => (
          <Inner
            symbols={symbols}
            image={image}
            onInputComplete={props.onInputComplete}
          />
        )}
      </ImageFile>
    )}
  </ImageAnnotationFetcher>
);

export default ImageInput;

interface InnerProps {
  symbols: SymbolWithBoundingBox[];
  image: HTMLImageElement;
  onInputComplete: (rows: string[], words: string[]) => void;
}

type StepState =
  | { type: "STARTING" }
  | { type: "SELECTED_GRID"; rows: string[] };

function state<T>(
  state: StepState,
  starting: () => T,
  selectedGrid: (rows: string[]) => T
): T {
  switch (state.type) {
    case "STARTING":
      return starting();

    case "SELECTED_GRID":
      return selectedGrid(state.rows);
  }
}

const Inner = (props: InnerProps) => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [words, setWords] = useState<string[]>([]);
  const [startPosition, setStartPosition] = useState<Vector2d | null>(null);
  const [endPosition, setEndPosition] = useState<Vector2d | null>(null);
  const [step, setStep] = useState<StepState>({ type: "STARTING" });

  return (
    <div className={styles.root}>
      <ResponsiveStage className={styles.stage}>
        {dims => (
          <ResponsiveLayer
            dims={dims}
            aspectRatio={props.image}
            onMouseDown={position => {
              setEndPosition(null);
              setStartPosition(position);
            }}
            onMouseMove={(active, position) =>
              active && setEndPosition(position)
            }
            onMouseUp={setEndPosition}
          >
            <Image image={props.image} />

            {props.symbols.map((symbol, idx) => (
              <SymbolRect key={idx} symbol={symbol} />
            ))}

            {step.type === "STARTING" && startPosition && endPosition && (
              <GridRect
                rows={rows}
                cols={cols}
                x={startPosition.x}
                y={startPosition.y}
                width={endPosition.x - startPosition.x}
                height={endPosition.y - startPosition.y}
              />
            )}

            {step.type === "SELECTED_GRID" && startPosition && endPosition && (
              <Rect
                stroke="black"
                x={startPosition.x}
                y={startPosition.y}
                width={endPosition.x - startPosition.x}
                height={endPosition.y - startPosition.y}
              />
            )}
          </ResponsiveLayer>
        )}
      </ResponsiveStage>

      <div>
        {state(
          step,
          () => (
            <div>
              <h3 className={styles.header}>Grid Size</h3>

              <div className={styles.gridSize}>
                <label htmlFor="rows">Rows:</label>
                <input
                  id="rows"
                  type="number"
                  min={2}
                  value={rows}
                  onChange={e => setRows(parseInt(e.target.value))}
                />

                <label htmlFor="columns">Columns:</label>
                <input
                  id="columns"
                  type="number"
                  min={2}
                  value={cols}
                  onChange={e => setCols(parseInt(e.target.value))}
                />

                <button
                  className={styles.importButton}
                  disabled={!(startPosition && endPosition)}
                  onClick={() => {
                    setStartPosition(null);
                    setEndPosition(null);
                    setStep({
                      type: "SELECTED_GRID",
                      rows: getRows(
                        startPosition as Vector2d,
                        endPosition as Vector2d,
                        rows,
                        cols,
                        props.symbols
                      )
                    });
                  }}
                >
                  Import From Grid
                </button>
              </div>
            </div>
          ),
          rows => (
            <div>
              <h3 className={styles.header}>Words</h3>

              <MutableList items={words} onChange={setWords}>
                {item => item}
              </MutableList>

              <button
                disabled={!(startPosition && endPosition)}
                onClick={() => {
                  setStartPosition(null);
                  setEndPosition(null);

                  setWords([
                    ...words,
                    getWord(
                      startPosition as Vector2d,
                      endPosition as Vector2d,
                      props.symbols
                    )
                  ]);
                }}
              >
                Select Word
              </button>

              <button onClick={() => props.onInputComplete(rows, words)}>
                Done
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
