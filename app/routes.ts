import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("organization-dashboard", "routes/organization-dashboard.tsx"),
] satisfies RouteConfig;
