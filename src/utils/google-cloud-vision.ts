import {
  Symbol,
  getSymbols,
  GoogleCloudVisionResponse
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
