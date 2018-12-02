import {
  Symbol,
  getSymbols,
  GoogleCloudVisionResponse,
  BoundingPoly
} from "./googleCloudVisionTypes";
import { BoundingBox, boundingPoints } from "./geom";

export const boundingPolyToBox = (poly: BoundingPoly): BoundingBox =>
  boundingPoints(poly.vertices);

const KEY = "AIzaSyD2a1P2TcfWCT_FqCA5qxITFn9Ry_uUDFg";

export interface SymbolWithBoundingBox extends Symbol {
  bounds: BoundingBox;
}

export async function getImageAnnotations(
  encodedImage: string
): Promise<SymbolWithBoundingBox[]> {
  const requestBody = JSON.stringify({
    requests: [
      {
        image: { content: encodedImage },
        features: [{ type: "DOCUMENT_TEXT_DETECTION" }]
      }
    ]
  });

  const responseBody = (await (await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${KEY}`,
    { method: "POST", body: requestBody }
  )).json()) as GoogleCloudVisionResponse;

  if (responseBody.error) {
    throw responseBody.error;
  }

  const response = responseBody.responses[0];
  if (response.error) {
    throw response.error;
  }

  const page = response.fullTextAnnotation.pages[0];
  return getSymbols(page).map(symbol => ({
    ...symbol,
    bounds: boundingPolyToBox(symbol.boundingBox)
  }));
}
