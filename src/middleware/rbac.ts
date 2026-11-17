import type { Request, Response, NextFunction } from "express";
import {
  hasPermission,
  ROLES,
  type Permission,
  type Role,
} from "../config/permissions.js";
import mongoose from "mongoose";
import { Post } from "../models/Post.js";

type AuthenticatedUser = {
  id: string;
  role?: Role | null;
};

function requireAuthenticatedUser(
  res: Response,
): AuthenticatedUser | undefined {
  return res.locals.user as AuthenticatedUser | undefined;
}

function getRole(user: AuthenticatedUser) {
  return user.role ?? ROLES.USER;
}

export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = requireAuthenticatedUser(res);
    if (!user) {
      return res.status(401).json({ error: "Необходимо войти в аккаунт" });
    }
    if (!hasPermission(getRole(user), permission)) {
      return res.status(403).json({ error: "Недостаточно прав" });
    }
    next();
  };
}

export function canManagePost(
  user: AuthenticatedUser,
  authorId: string,
): boolean {
  const role = getRole(user);
  return (
    authorId === user.id || role === ROLES.MODERATOR || role === ROLES.ADMIN
  );
}

export function requirePostOwnership() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = requireAuthenticatedUser(res);
      if (!user) {
        return res
          .status(401)
          .json({ error: "Необходимо войти в аккаунт" });
      }
      const postId = req.params.id;
      if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ error: "Некорректный ID поста" });
      }
      const post = await Post.findById(postId).select("_id authorId");
      if (!post) {
        return res.status(404).json({ error: "Пост не найден" });
      }
      if (!canManagePost(user, post.authorId)) {
        return res
          .status(403)
          .json({ error: "Нет доступа к этому посту" });
      }
      res.locals.post = post;
      next();
    } catch (error) {
      next(error);
    }
  };
}
