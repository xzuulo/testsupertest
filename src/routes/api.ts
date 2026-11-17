import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../auth.js";
import { me } from "../services/user.js";
import postsRouter from "./posts.js";

export const router = Router();

router.get("/me", me);

router.use("/posts", postsRouter);

router.all("/auth/{*any}", toNodeHandler(auth));
