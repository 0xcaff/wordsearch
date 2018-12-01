export interface GoogleCloudVisionResponse {
  responses: AnnotateImageResponse[];
  error: Object;
}

export interface AnnotateImageResponse {
  fullTextAnnotation: TextAnnotation;
  error: Object;
}

export interface TextAnnotation {
  pages: Page[];
  text: string;
}

export interface Page extends Entity {
  blocks: Block[];
}

export interface Block extends BoundingBoxEntity {
  paragraphs: Paragraph[];
}

export interface Paragraph extends BoundingBoxEntity {
  words: Word[];
}

export interface Word extends BoundingBoxEntity {
  symbols: Symbol[];
}

export interface Symbol extends BoundingBoxEntity {
  text: string;
}

export interface BoundingBoxEntity extends Entity {
  boundingBox: BoundingPoly;
}

export interface Entity {
  property: TextProperty;
  confidence: number;
}

export interface Vertex {
  x: number;
  y: number;
}

export interface BoundingPoly {
  vertices: Vertex;
}

export type BreakType =
  | "UNKNOWN"
  | "SPACE"
  | "SURE_SPACE"
  | "EOL_SURE_SPACE"
  | "HYPHEN"
  | "LINE_BREAK";

export interface DetectedBreak {
  type: BreakType;
  isPrefix: boolean;
}

export interface TextProperty {
  detectedLanguages: DetectedLanguage[];
  detectedBreak: DetectedBreak;
}

export interface DetectedLanguage {
  languageCode: string;
  confidence: number;
}

export const getSymbols = (page: Page): Symbol[] =>
  page.blocks.map(getSymbolsForBlock).flat();

const getSymbolsForBlock = (block: Block): Symbol[] =>
  block.paragraphs.map(getSymbolsForParagraph).flat();

const getSymbolsForParagraph = (paragraph: Paragraph): Symbol[] =>
  paragraph.words.map(getSymbolsForWord).flat();

const getSymbolsForWord = (word: Word): Symbol[] => word.symbols;
