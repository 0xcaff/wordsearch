import React, { useState } from "react";
import { Image } from "react-konva";
import { Symbol } from "../utils/google-cloud-vision-type";
import ImageFile from "../components/ImageFile";
import ResponsiveStage from "../components/ResponsiveStage";
import ResponsiveLayer from "../components/ResponsiveLayer";
import MutableList from "../components/MutableList";
import SymbolRect from "../components/SymbolRect";
import ImageAnnotationFetcher from "../components/ImageAnnotationFetcher";

import styles from "./ImageInput.module.css";

interface Props {
  file: File;
}

const ImageInput = (props: Props) => (
  <ImageAnnotationFetcher file={props.file}>
    {symbols => (
      <ImageFile file={props.file}>
        {image => <Inner symbols={symbols} image={image} />}
      </ImageFile>
    )}
  </ImageAnnotationFetcher>
);

export default ImageInput;

interface InnerProps {
  symbols: Symbol[];
  image: HTMLImageElement;
}

const Inner = (props: InnerProps) => {
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);

  return (
    <div className={styles.root}>
      <ResponsiveStage className={styles.stage}>
        {dims => (
          <ResponsiveLayer dims={dims} aspectRatio={props.image}>
            <Image image={props.image} />

            {props.symbols.map((symbol, idx) => (
              <SymbolRect key={idx} symbol={symbol} />
            ))}
          </ResponsiveLayer>
        )}
      </ResponsiveStage>

      <div>
        <div>
          <h3 className={styles.header}>Grid Size</h3>

          <div className={styles.gridSize}>
            <label htmlFor="rows">Rows:</label>
            <input
              id="rows"
              type="number"
              min={0}
              value={rows}
              onChange={e => setRows(parseInt(e.target.value))}
            />

            <label htmlFor="columns">Columns:</label>
            <input
              id="columns"
              type="number"
              min={0}
              value={cols}
              onChange={e => setCols(parseInt(e.target.value))}
            />
          </div>
        </div>

        <div>
          <h3 className={styles.header}>Words</h3>

          <MutableList items={["a", "b", "C"]} onChange={console.log}>
            {item => item}
          </MutableList>
        </div>
      </div>
    </div>
  );
};
