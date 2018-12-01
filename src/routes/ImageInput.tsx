import React from "react";
import ImageAnnotationFetcher from "../components/ImageAnnotationFetcher";

interface Props {
  file: File;
}

const ImageInput = (props: Props) => (
  <ImageAnnotationFetcher file={props.file}>
    {childProps => JSON.stringify(childProps.annotations)}
  </ImageAnnotationFetcher>
);

export default ImageInput;
