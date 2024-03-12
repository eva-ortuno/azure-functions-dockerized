import type { HttpResponseInit } from "@azure/functions";
import { app } from "@azure/functions";
import { helloWorld } from "../lib/lib";

export async function httpHealthGet(): Promise<HttpResponseInit> {
  try {
    helloWorld();
    return {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
      jsonBody: {
        statusCode: 200,
        message: "healthy",
      },
    };
  } catch (error: unknown) {
    return {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
      jsonBody: {
        statusCode: 500,
        message: "down",
      },
    };
  }
}

app.http("get-functions", {
  route: "functions",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: httpHealthGet,
});
