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
export async function httpUpload(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const accountName = getConfig("ACCOUNT_NAME");
    const accountKey = getConfig("ACCOUNT_KEY");
    const containerName = getConfig("CONTAINER_NAME");

    const storageCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        storageCredential
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const form = await request.formData();

    if (!form || !form.get("file") || !form.get("version")) {
        return {
            status: 400,
            body: "Version and file parameters are required in the request body."
        };
    }

    const version = form.get("version");
    const file = form.get("file") as string;

    const fileName = `${new Date()}_${version}`;

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const uploadBlobResponse = await blockBlobClient.uploadData(new Buffer(file));

    return {
        status: 200,
        jsonBody: {
            message: `File ${fileName} uploaded successfully.`,
            url: blockBlobClient.url
        }
    };
}

app.http("post-upload", {
    route: "/upload",
    methods: ["POST"],
    authLevel: "anonymous",
    handler: httpUpload,
});
