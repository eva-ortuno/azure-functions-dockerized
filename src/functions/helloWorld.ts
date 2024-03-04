import {app, HttpResponseInit} from "@azure/functions";
import {helloWorld} from "../lib/lib";

export async function httpWorld(): Promise<HttpResponseInit> {
    try {
        helloWorld()
        return {
            status: 200,
            jsonBody: {message: "Hello world"}
        }
    } catch(error) {
        return {
            status: 500,
            jsonBody: error
        }
    }

}

app.http("helloWorld", {
    route: "helloWorld",
    methods: ["GET"],
    authLevel: "anonymous",
    handler: httpWorld,
});