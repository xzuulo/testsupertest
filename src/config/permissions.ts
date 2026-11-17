export const ROLES = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  "read:posts": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
  "create:posts": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
  "update:own:posts": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
  "update:any:posts": [ROLES.MODERATOR, ROLES.ADMIN],
  "delete:own:posts": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
  "delete:any:posts": [ROLES.MODERATOR, ROLES.ADMIN],
  "publish:posts": [ROLES.MODERATOR, ROLES.ADMIN],
  "read:users": [ROLES.MODERATOR, ROLES.ADMIN],
  "assign:roles": [ROLES.ADMIN],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: string, permission: Permission): boolean {
  const allowedRoles: readonly string[] = PERMISSIONS[permission];
  return allowedRoles.includes(role);
}
