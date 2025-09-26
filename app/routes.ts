import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  route("invitations/accept/:token", "routes/email-invitation.tsx"),

  route("tenant", "routes/tenant/layout.tsx", [
    index("routes/organization-dashboard.tsx"),
    route("boards", "routes/board-dashboard.tsx"),
    route("board/:id", "routes/board-view.tsx"),
    // route("organization-overview", "routes/organization-overview.tsx"), TODO: Implement later
    route("settings", "routes/tenant/settings.tsx"),
  ]),
] satisfies RouteConfig;
