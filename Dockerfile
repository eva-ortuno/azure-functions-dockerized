# syntax=docker/dockerfile:1.2
FROM node:18 AS build
WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

# Create Azure function app based on build stage
FROM mcr.microsoft.com/azure-functions/node:4-node18-slim
WORKDIR /home/site/wwwroot

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    FUNCTIONS_WORKER_RUNTIME=node \
    AzureWebJobsFeatureFlags=EnableWorkerIndexing

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/host.json ./host.json

CMD ["sh", "-c", "/azure-functions-host/Microsoft.Azure.WebJobs.Script.WebHost"]
