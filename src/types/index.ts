export interface TextRegionSpec {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  defaultText: string;
}

export interface Meme {
  id: string;
  name: string;
  imageUrl: string;
  type: "with_text" | "without_text";
  defaultText?: string;
  textRegions: TextRegionSpec[];
  tags: string[];
}

export type EditorMode = "replace" | "add";
