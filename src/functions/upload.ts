import type { HttpResponseInit, InvocationContext } from "@azure/functions";
import { app } from "@azure/functions";
import { HttpRequest } from "@azure/functions/types/http";
import { getBlobClient } from "../lib/getBlobClient";

interface UploadBody {
  version: string;
  filePath: string;
}

export async function httpUpload(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const { version, filePath } = (await request.json()) as UploadBody;

  if (!filePath || !version) {
    return {
      status: 400,
      body: "Version and file parameters are required in the request body.",
    };
  }

  const fileName = `${new Date().toDateString()}_${version}.pdf`;

  const blockBlobClient = getBlobClient(fileName);
  await blockBlobClient.uploadFile(filePath);

  return {
    status: 200,
    jsonBody: {
      message: `File ${fileName} uploaded successfully.`,
      url: blockBlobClient.url,
    },
  };
}

app.http("postUpload", {
  route: "upload",
  methods: ["POST"],
  authLevel: "anonymous",
  handler: httpUpload,
});
