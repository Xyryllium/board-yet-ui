import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("organization-dashboard", "routes/organization-dashboard.tsx"),
  route("boards", "routes/board-dashboard.tsx"),
  route("board/:id", "routes/board-view.tsx"),
  route("organization-overview", "routes/organization-overview.tsx"),
  route("invitations/accept/:token", "routes/email-invitation.tsx"),
] satisfies RouteConfig;
