import React from "react";
import ImageAnnotationFetcher from "../components/ImageAnnotationFetcher";
import { FastLayer, Image as KonvaImage, Rect } from "react-konva";
import ImageFile from "../components/ImageFile";
import ResponsiveStage from "../components/ResponsiveStage";
import styles from "./ImageInput.module.css";
import MutableList from "../components/MutableList";

interface Props {
  file: File;
}

const ImageInput = (props: Props) => (
  <ImageAnnotationFetcher file={props.file}>
    {() => (
      <ImageFile file={props.file}>
        {image => (
          <div className={styles.root}>
            <ResponsiveStage className={styles.stage}>
              <FastLayer>
                <Rect x={10} y={10} width={50} height={50} fill={"black"} />

                <KonvaImage image={image} />
              </FastLayer>
            </ResponsiveStage>

            <div>
              <h3 className={styles.wordsHeader}>Words</h3>

              <MutableList items={["a", "b", "C"]} onChange={console.log}>
                {item => item}
              </MutableList>
            </div>
          </div>
        )}
      </ImageFile>
    )}
  </ImageAnnotationFetcher>
);

export default ImageInput;
