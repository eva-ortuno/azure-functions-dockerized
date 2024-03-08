export async function streamToText(stream: NodeJS.ReadableStream): Promise<string> {
  stream.setEncoding("utf8");
  let content = "";
  for await (const chunk of stream) {
    content += chunk;
  }
  return content;
}
