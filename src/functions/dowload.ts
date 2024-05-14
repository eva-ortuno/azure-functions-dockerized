import type { HttpResponseInit, InvocationContext } from "@azure/functions";
import { app } from "@azure/functions";
import { HttpRequest } from "@azure/functions/types/http";
import { getBlobClient } from "../lib/getBlobClient";

import { streamToBuffer } from "../lib/streamToText";

export async function httpDownload(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  console.log("download");
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

  const downloadedData = await streamToBuffer(downloadResponse.readableStreamBody);

  return {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${blobName}"`,
    },
    body: downloadedData,
  };
}

app.http("getDownload", {
  route: "download",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: httpDownload,
});
