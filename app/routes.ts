import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  route("health", "routes/health.tsx"),

  route("forgot-password", "routes/forgot-password.tsx"),
  route("reset-password", "routes/reset-password.tsx"),
  route("email/verify/:id/:hash", "routes/email-verify.tsx"),
  route("member", "routes/member.tsx"),
  route("invitation", "routes/invitation.tsx"),

  route("invitations/accept/:token", "routes/email-invitation.tsx"),

  route("tenant", "routes/tenant/layout.tsx", [
    index("routes/organization-dashboard.tsx"),
    route("boards", "routes/board-dashboard.tsx"),
    route("board/:id", "routes/board-view.tsx"),
    // route("organization-overview", "routes/organization-overview.tsx"), TODO: Implement later
    route("settings", "routes/tenant/settings.tsx"),
  ]),
] satisfies RouteConfig;
