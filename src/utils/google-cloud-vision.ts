import {
  Symbol,
  getSymbols,
  GoogleCloudVisionResponse,
  BoundingPoly
} from "./google-cloud-vision-type";

const KEY = "AIzaSyD2a1P2TcfWCT_FqCA5qxITFn9Ry_uUDFg";

export async function getImageAnnotations(
  encodedImage: string
): Promise<Symbol[]> {
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
  return getSymbols(page);
}

interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const boundingPolyToBox = (poly: BoundingPoly): BoundingBox =>
  poly.vertices.reduce(
    (previous, current) => ({
      minX: Math.min(current.x, previous.minX),
      minY: Math.min(current.y, previous.minY),
      maxX: Math.max(current.x, previous.maxX),
      maxY: Math.max(current.y, previous.maxY)
    }),
    {
      minX: Number.MAX_VALUE,
      minY: Number.MAX_VALUE,
      maxY: Number.MIN_VALUE,
      maxX: Number.MIN_VALUE
    }
  );
