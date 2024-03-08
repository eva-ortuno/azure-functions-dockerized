import type { HttpResponseInit, InvocationContext } from "@azure/functions";
import { app } from "@azure/functions";
import { HttpRequest } from "@azure/functions/types/http";
import { BlobServiceClient } from "@azure/storage-blob";
import { getConfig } from "../lib/getConfig";

export async function httpDownload(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const containerName = getConfig("CONTAINER_NAME");
  const blobServiceClient = BlobServiceClient.fromConnectionString(getConfig("BLOB_CONNECTION_STRING"));
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobName = request.query.get("file");

  if (!blobName) throw new Error("No file name found");

  const blobClient = containerClient.getBlockBlobClient(blobName);

  const downloadResponse = await blobClient.download();

  if (!downloadResponse.readableStreamBody) {
    return {
      status: 404,
      body: "File not found.",
    };
  }

  downloadResponse.readableStreamBody.setEncoding('utf8');
  let content = '';
  for await (const chunk of downloadResponse.readableStreamBody) {
    content += chunk;
  }

  return {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream", // Adjust content type as per your file type
      "Content-Disposition": `attachment; filename="${blobName}"`, // Force download by setting Content-Disposition header
    },
    jsonBody: content,
  };
}

app.http("getDownload", {
  route: "download",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: httpDownload,
});
