export async function streamToText(stream: NodeJS.ReadableStream): Promise<string> {
  stream.setEncoding("base64");
  let content = "";
  for await (const chunk of stream) {
    content += chunk;
  }
  return content;
}

export async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on("error", reject);
  });
}
