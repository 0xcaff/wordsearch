import React from "react";
import ImageAnnotationFetcher from "../components/ImageAnnotationFetcher";
import { FastLayer, Image, Rect } from "react-konva";
import ImageFile from "../components/ImageFile";
import ResponsiveStage from "../components/ResponsiveStage";
import styles from "./ImageInput.module.css";
import MutableList from "../components/MutableList";
import { boundingPolyToBox } from "../utils/google-cloud-vision";

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
              {dims => {
                const widthByHeight =
                  (image.width / image.height) * dims.height;

                const heightByWidth = (image.height / image.width) * dims.width;

                const width = Math.min(widthByHeight, dims.width);
                const height = Math.min(heightByWidth, dims.height);

                const left = (dims.width - width) / 2;
                const top = (dims.height - height) / 2;

                return (
                  <FastLayer
                    x={left}
                    y={top}
                    scaleX={width / image.width}
                    scaleY={height / image.height}
                  >
                    <Image image={image} />

                    {annotations.map(annotation => {
                      const bounds = boundingPolyToBox(annotation.boundingBox);

                      return (
                        <Rect
                          x={bounds.minX}
                          y={bounds.minY}
                          width={bounds.maxX - bounds.minX}
                          height={bounds.maxY - bounds.minY}
                          fill={"red"}
                        />
                      );
                    })}
                  </FastLayer>
                );
              }}
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
