import { Router } from "express";
import { Post } from "../models/Post.js";
import { authenticate } from "../middleware/auth.js";
import {
  requirePermission,
  requirePostOwnership,
} from "../middleware/rbac.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const posts = await Post.find({ published: true });
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  authenticate,
  requirePermission("create:posts"),
  async (req, res, next) => {
    try {
      const user = res.locals.user as { id: string };
      const { title, content } = req.body;
      const post = await Post.create({
        title,
        content,
        authorId: user.id,
      });
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  "/:id",
  authenticate,
  requirePostOwnership(),
  async (req, res, next) => {
    try {
      const post = res.locals.post as { _id: unknown };
      const updates: {
        title?: string;
        content?: string;
      } = {};
      if (typeof req.body.title === "string") {
        updates.title = req.body.title;
      }
      if (typeof req.body.content === "string") {
        updates.content = req.body.content;
      }
      const updatedPost = await Post.findByIdAndUpdate(
        post._id,
        { $set: updates },
        { new: true, runValidators: true },
      );
      res.json(updatedPost);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:id",
  authenticate,
  requirePostOwnership(),
  async (_req, res, next) => {
    try {
      const post = res.locals.post as { _id: unknown };
      await Post.findByIdAndDelete(post._id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
