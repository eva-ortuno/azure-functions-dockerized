import type {HttpResponseInit, InvocationContext} from "@azure/functions";
import { app } from "@azure/functions";
import {HttpRequest} from "@azure/functions/types/http";
import {BlobServiceClient, StorageSharedKeyCredential} from "@azure/storage-blob";
import {getConfig} from "../lib/getConfig";

/**
 * This endpoint is used for communication between our different APIs. As of now, proper KYC data are required to create wallets in Custody API and accounts in Settlement API.
 * This endpoint is responsible to provide to those APIs a validation whether the customer has provided the proper KYC data or not. If no customer is found then the wallet/account can not be created.
 *
 * As this is a purely internal use, this endpoint is not deployed to the APIM and therefore not available via the productive URL (api.tangany.com/customers). This endpoint is only reachable via the direct URL of the function. This is also why the authentication is done thanks to a token that has been saved in all APIs and has to match to proceed with the data collection.
 */
export async function httpDownload(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const accountName = getConfig("ACCOUNT_NAME");
    const accountKey = getConfig("ACCOUNT_KEY");
    const containerName = getConfig("CONTAINER_NAME");
    const blobName = request.query.get("file");

    if (!blobName) throw new Error("No file name found");

    const storageCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        storageCredential
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(blobName);

    const downloadResponse = await blobClient.download();

    if (!downloadResponse.readableStreamBody) {
        return {
            status: 404,
            body: "File not found."
        };

    }

    return {
        status: 200,
        headers: {
            "Content-Type": "application/octet-stream", // Adjust content type as per your file type
            "Content-Disposition": `attachment; filename="${blobName}"` // Force download by setting Content-Disposition header
        },
        jsonBody: downloadResponse.readableStreamBody
    };
}

app.http("post-download", {
    route: "/download",
    methods: ["GET"],
    authLevel: "anonymous",
    handler: httpDownload,
});
