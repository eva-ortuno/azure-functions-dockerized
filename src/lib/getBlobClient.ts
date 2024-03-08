import { getConfig } from "./getConfig";
import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";

export function getBlobClient(file: string): BlockBlobClient {
  const containerName = getConfig("CONTAINER_NAME");
  const blobServiceClient = BlobServiceClient.fromConnectionString(getConfig("BLOB_CONNECTION_STRING"));
  const containerClient = blobServiceClient.getContainerClient(containerName);
  return containerClient.getBlockBlobClient(file);
}
