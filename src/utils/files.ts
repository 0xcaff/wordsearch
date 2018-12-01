export function fileAsStream(
  file: File,
  chunkSize: number = 10000
): ReadableStream<string> {
  const reader = new FileReader();
  let offset = 0;

  return new ReadableStream({
    start(controller: ReadableStreamDefaultController<string>) {
      reader.onabort = () => controller.close();
    },
    async pull(
      controller: ReadableStreamDefaultController<string>
    ): Promise<void> {
      if (offset >= file.size) {
        controller.close();
        return;
      }

      const end = offset + chunkSize;
      const slice = file.slice(offset, end);
      const read = await readBlob(reader, slice);
      controller.enqueue(read);
      offset = end;
    }
  });
}

const readBlob = (reader: FileReader, blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);

    reader.readAsBinaryString(blob);
  });

export class Base64EncodeTransformer {
  writable: WritableStream<string>;
  readable: ReadableStream<string>;

  constructor() {
    let onChunkProcessed: (chunk: string) => void;
    let onClose: () => void;

    this.readable = new ReadableStream({
      start(controller: ReadableStreamDefaultController<string>) {
        onChunkProcessed = (chunk: string) => controller.enqueue(chunk);
        onClose = () => controller.close();
      }
    });

    let lastChunk = "";
    this.writable = new WritableStream({
      write(chunk: string) {
        const possiblyEncoding = lastChunk + chunk;
        const outputCharsCount = Math.floor(possiblyEncoding.length / 3) * 3;
        const toEncode = possiblyEncoding.slice(0, outputCharsCount);
        lastChunk = possiblyEncoding.slice(outputCharsCount);
        onChunkProcessed(btoa(toEncode));
      },
      close() {
        onChunkProcessed(btoa(lastChunk));
        onClose();
      }
    });
  }
}

export const collect = async (
  stream: ReadableStream<string>
): Promise<string> => {
  const reader = stream.getReader();
  let next = await reader.read();
  let values = [];

  while (!next.done) {
    values.push(next.value);
    next = await reader.read();
  }

  return values.join("");
};
