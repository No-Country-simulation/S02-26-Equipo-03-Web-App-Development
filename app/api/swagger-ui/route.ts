import { openApiSpec } from "@/shared/openapi/v1";

export const dynamic = "force-dynamic";

const DEFAULT_LOCAL_SERVER = "http://localhost:3000";

function getServerOrigin(request: Request) {
  const url = new URL(request.url);
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");

  if (forwardedHost) {
    const protocol = forwardedProto ?? url.protocol.replace(":", "");
    return `${protocol}://${forwardedHost}`;
  }

  return url.origin;
}

export async function GET(request: Request) {
  const currentOrigin = getServerOrigin(request);
  const currentApiServer = `${currentOrigin}/api`;
  const defaultApiServer = `${DEFAULT_LOCAL_SERVER}/api`;

  return Response.json({
    ...openApiSpec,
    servers: [
      {
        url: currentApiServer,
        description: "Servidor actual",
      },
      ...(currentOrigin === DEFAULT_LOCAL_SERVER
        ? []
        : [
            {
              url: defaultApiServer,
              description: "Servidor local",
            },
          ]),
    ],
  });
}
