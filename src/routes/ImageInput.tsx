import React from "react";
import { Image } from "react-konva";
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
    {annotations => (
      <ImageFile file={props.file}>
        {image => (
          <div className={styles.root}>
            <ResponsiveStage className={styles.stage}>
              {dims => (
                <ResponsiveLayer dims={dims} aspectRatio={image}>
                  <Image image={image} />

                  {annotations.map((symbol, idx) => (
                    <SymbolRect key={idx} symbol={symbol} />
                  ))}
                </ResponsiveLayer>
              )}
            </ResponsiveStage>

            <div>
              <div>
                <h3 className={styles.header}>Grid Size</h3>
              </div>

              <div>
                <h3 className={styles.header}>Words</h3>

                <MutableList items={["a", "b", "C"]} onChange={console.log}>
                  {item => item}
                </MutableList>
              </div>
            </div>
          </div>
        )}
      </ImageFile>
    )}
  </ImageAnnotationFetcher>
);

export default ImageInput;
