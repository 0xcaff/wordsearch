// Wrapper for the Google Cloud Vision API.

import { getSymbols } from './utils';

// Returns a list of symbols and their bounding boxes. All document structure
// infered by GCV is removed.
//
// image is a base64 string representation of the image.
export const detectText = async (image, KEY) => {
  const request = {
    image: { content: image },
    features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
  };

  const resp = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${KEY}`, {
      method: 'POST',
      body: JSON.stringify({ requests: [request] }),
    });

  const { responses: [ response ] } = await resp.json();
  const { error, fullTextAnnotation } = response;

  if (error) {
    throw new GCVAPIError(error);
  }

  const symbols = getSymbols(fullTextAnnotation);
  return symbols;
};

// Google Cloud Vision API Errors:
// https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#Status
export class GCVAPIError extends Error {
  constructor(apiError) {
    super(apiError.message);

    this.apiError = apiError;
  }
}
