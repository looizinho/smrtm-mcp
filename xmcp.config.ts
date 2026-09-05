import { type XmcpConfig } from "xmcp";

const config: XmcpConfig = {
  http: {
    port: 3002,
    host: "127.0.0.1",
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  },
  paths: {
    tools: "./src/tools",
    prompts: "./src/prompts",
    resources: "./src/resources",
  }
};

export default config;
