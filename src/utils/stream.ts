interface HasLength {
  length: number;
}

export class ProgressTransformer<T extends HasLength> {
  readable: ReadableStream<T>;
  writable: WritableStream<T>;

  constructor(onProgress: (completedBytes: number) => void) {
    let onChunkProcessed: (chunk: T) => void;
    let onClose: () => void;
    let currentProgress = 0;

    this.readable = new ReadableStream({
      start(controller) {
        onChunkProcessed = chunk => controller.enqueue(chunk);
        onClose = () => controller.close();
      }
    });

    this.writable = new WritableStream({
      write(bytes: T) {
        onChunkProcessed(bytes);
        currentProgress += bytes.length || 0;
        onProgress(currentProgress);
      },
      close() {
        onClose();
      }
    });
  }
}
