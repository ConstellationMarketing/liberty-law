import serverless from "serverless-http";

import { createPublicServer } from "../../../../server/netlify";

export const handler = serverless(createPublicServer());
