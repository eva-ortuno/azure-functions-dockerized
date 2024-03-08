import type { HttpResponseInit, InvocationContext } from "@azure/functions";
import { app } from "@azure/functions";
import { HttpRequest } from "@azure/functions/types/http";
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { getConfig } from "../lib/getConfig";

export async function httpDownload(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const accountName = getConfig("ACCOUNT_NAME");
  const accountKey = getConfig("ACCOUNT_KEY");
  const containerName = getConfig("CONTAINER_NAME");
  const blobName = request.query.get("file");

  if (!blobName) throw new Error("No file name found");

  const storageCredential = new StorageSharedKeyCredential(accountName, accountKey);
  const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, storageCredential);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlockBlobClient(blobName);

  const downloadResponse = await blobClient.download();

  if (!downloadResponse.readableStreamBody) {
    return {
      status: 404,
      body: "File not found.",
    };
  }

  return {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream", // Adjust content type as per your file type
      "Content-Disposition": `attachment; filename="${blobName}"`, // Force download by setting Content-Disposition header
    },
    jsonBody: downloadResponse.readableStreamBody,
  };
}

app.http("getDownload", {
  route: "download",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: httpDownload,
});
