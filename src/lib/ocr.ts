/**
 * Tesseract.js wrapper — frontend OCR for detecting text regions on a meme.
 *
 * Lazy-loads the worker to keep initial bundle small. The first call is slow
 * (downloads ~10MB chi_sim+eng model); callers must surface a loading state.
 */

export interface OcrRegion {
  id: string;
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  confidence: number;
}

let workerPromise: Promise<unknown> | null = null;

async function getWorker(): Promise<unknown> {
  if (workerPromise) return workerPromise;
  if (typeof window === "undefined") {
    throw new Error("OCR can only run in the browser");
  }
  const tesseract = await import("tesseract.js");
  const worker = await tesseract.createWorker(["chi_tra", "eng"], 1, {
    logger: () => {
      /* swallow logs — UI shows its own progress */
    },
  });
  workerPromise = Promise.resolve(worker);
  return worker;
}

export interface RecognizeResult {
  regions: OcrRegion[];
  fullText: string;
}

/**
 * Run OCR against an image URL. Returns detected text + approximate bounding boxes
 * scaled to the *displayed* image dimensions you pass in.
 */
export async function recognizeFromUrl(
  imageUrl: string,
  displayWidth: number,
  displayHeight: number,
): Promise<RecognizeResult> {
  if (typeof window === "undefined") {
    throw new Error("recognizeFromUrl requires a browser environment");
  }
  const worker = (await getWorker()) as {
    recognize: (
      src: string,
    ) => Promise<{ data: { text: string; words?: Array<{ text: string; confidence: number; bbox: { x0: number; y0: number; x1: number; y1: number } }> } }>;
  };
  const { data } = await worker.recognize(imageUrl);

  const naturalW = 600;
  const naturalH = 600;
  const scaleX = displayWidth / naturalW;
  const scaleY = displayHeight / naturalH;

  const words = data.words ?? [];
  const regions: OcrRegion[] = words
    .filter((w) => w.text.trim().length > 0 && w.confidence > 40)
    .map((w, idx) => ({
      id: `ocr_${idx}`,
      text: w.text,
      x: w.bbox.x0 * scaleX,
      y: w.bbox.y0 * scaleY,
      w: Math.max(20, (w.bbox.x1 - w.bbox.x0) * scaleX),
      h: Math.max(20, (w.bbox.y1 - w.bbox.y0) * scaleY),
      confidence: w.confidence,
    }));

  return { regions, fullText: data.text };
}

export async function terminateOcr(): Promise<void> {
  if (typeof window === "undefined") return;
  const tesseract = await import("tesseract.js");
  if (workerPromise) {
    const w = (await workerPromise) as { terminate?: () => Promise<void> };
    if (w?.terminate) await w.terminate();
    workerPromise = null;
  }
  void tesseract;
}
