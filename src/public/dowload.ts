import type { HttpResponseInit, InvocationContext } from "@azure/functions";
import { app } from "@azure/functions";
import { HttpRequest } from "@azure/functions/types/http";
import { streamToText } from "../lib/streamToText";
import { getBlobClient } from "../lib/getBlobClient";

export async function httpDownload(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const blobName = request.query.get("file");

  if (!blobName) throw new Error("No file name found");

  const blobClient = getBlobClient(blobName);

  const downloadResponse = await blobClient.download();

  if (!downloadResponse.readableStreamBody) {
    return {
      status: 404,
      body: "File not found.",
    };
  }
  const content = await streamToText(downloadResponse.readableStreamBody);

  return {
    status: 200,
    jsonBody: content,
  };
}

app.http("getDownload", {
  route: "download",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: httpDownload,
});
