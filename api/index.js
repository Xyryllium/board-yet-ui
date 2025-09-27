import { createRequestHandler } from "@react-router/node";
import * as build from "../build/server/index.js";

const handler = createRequestHandler(build, process.env.NODE_ENV);

export default handler;
