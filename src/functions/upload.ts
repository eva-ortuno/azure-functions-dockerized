import type {HttpResponseInit, InvocationContext} from "@azure/functions";
import { app } from "@azure/functions";
import {HttpRequest} from "@azure/functions/types/http";
import {BlobServiceClient} from "@azure/storage-blob";
import {getConfig} from "../lib/getConfig";

interface UploadBody {
    version: string,
    file: string,
}

export async function httpUpload(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const containerName = getConfig("CONTAINER_NAME");
    const blobServiceClient = BlobServiceClient.fromConnectionString(getConfig("BLOB_CONNECTION_STRING"));
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const jsonBody = await request.json() as UploadBody;
    console.log("<<<<<<<<<<<<<<< jsonBody : ", jsonBody);
    const version = jsonBody.version;
    const file = jsonBody.file;

    if (!file || !version) {
        return {
            status: 400,
            body: "Version and file parameters are required in the request body."
        };
    }

    const fileName = `${new Date()}_${version}.txt`;

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const uploadBlobResponse = await blockBlobClient.uploadData(Buffer.from(file, "utf-8"));
    console.log(uploadBlobResponse)
    return {
        status: 200,
        jsonBody: {
            message: `File ${fileName} uploaded successfully.`,
            url: blockBlobClient.url
        }
    };
}

app.http("postUpload", {
    route: "upload",
    methods: ["POST"],
    authLevel: "anonymous",
    handler: httpUpload,
});
