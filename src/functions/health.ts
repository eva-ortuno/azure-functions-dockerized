import type { HttpResponseInit } from "@azure/functions";
import { app } from "@azure/functions";
import {helloWorld} from "../lib/lib";

/**
 * This endpoint is used for communication between our different APIs. As of now, proper KYC data are required to create wallets in Custody API and accounts in Settlement API.
 * This endpoint is responsible to provide to those APIs a validation whether the customer has provided the proper KYC data or not. If no customer is found then the wallet/account can not be created.
 *
 * As this is a purely internal use, this endpoint is not deployed to the APIM and therefore not available via the productive URL (api.tangany.com/customers). This endpoint is only reachable via the direct URL of the function. This is also why the authentication is done thanks to a token that has been saved in all APIs and has to match to proceed with the data collection.
 */
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

app.http("get-health", {
    route: "health",
    methods: ["GET"],
    authLevel: "anonymous",
    handler: httpHealthGet,
});
