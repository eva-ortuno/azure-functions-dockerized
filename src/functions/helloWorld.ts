import {app, HttpResponseInit} from "@azure/functions";

export async function httpTrigger(): Promise<HttpResponseInit> {
    console.log("Hello world");
    return {
        status: 200,
        jsonBody: {message: "Hello world"}
    }
}

app.http("helloWorld", {
    route: "helloWorld",
    methods: ["GET"],
    authLevel: "anonymous",
    handler: httpTrigger,
});