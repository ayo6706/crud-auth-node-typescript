import { Express, Request, Response } from "express";
import {
  createPostHandler,
  updatePostHandler,
  getPostHandler,
  deletePostHandler,
} from "./controller/post.controller";
import { createUserHandler } from "./controller/user.controller";
import {
  createUserSessionHandler,
  invalidateUserSessionHandler,
  getUserSessionsHandler,
} from "./controller/session.controller";
import { validateRequest, requiresUser } from "./middleware";
import {
  createUserSchema,
  createUserSessionSchema,
} from "./schema/user.schema";
import {
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
} from "./schema/post.schema";




export default function (app: Express) {

  /**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */

    app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));
  
    // Register user

    /**
   * @openapi
   * '/api/users':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
    app.post("/api/users", validateRequest(createUserSchema), createUserHandler);
  
    // Login
    /**
     * '/api/sessions':
    *  post:
    *     tags:
    *     - User
    *     summary: Login a user
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *           schema:
    *              $ref: '#/components/schemas/LoginUserInput'
    *     responses:
    *      200:
    *        description: Success
    *        content:
    *          application/json:
    *            schema:
    *              $ref: '#/components/schemas/LoginUserResponse'
    *      409:
    *        description: Conflict
    *      400:
    *        description: Bad request
    */
    app.post(
      "/api/sessions",
      validateRequest(createUserSessionSchema),
      createUserSessionHandler
    );
  
    // Get the user's sessions
    app.get("/api/sessions", requiresUser, getUserSessionsHandler);
  
    // Logout
    app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);
  
    // Create a post

    /**
   * @openapi
   * '/api/posts':
   *  post:
   *     tags:
   *     - Post
   *     summary: Create a post
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserPostInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserPostResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
    
    app.post(
      "/api/posts",
      [requiresUser, validateRequest(createPostSchema)],
      createPostHandler
    );
  
    // Update a post


    /**
   * @openapi
   * '/api/posts/{postId}':
   *  get:
   *     tags:
   *     - Posts
   *     summary: Get a single post by the postId
   *     parameters:
   *      - name: postId
   *        in: path
   *        description: The id of the post
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Post'
   *       404:
   *         description: Post not found
   */
    app.put(
      "/api/posts/:postId",
      [requiresUser, validateRequest(updatePostSchema)],
      updatePostHandler
    );
  
    // Get a post
    app.get("/api/posts/:postId", getPostHandler);
  
    // Delete a post


    /**
   * @openapi
   * '/api/posts/{postId}':
   *  delete:
   *     tags:
   *     - Posts
   *     summary: Get a single post by the postId
   *     parameters:
   *      - name: postId
   *        in: path
   *        description: The id of the post
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Post'
   *       404:
   *         description: Post not found
   */
    app.delete(
      "/api/posts/:postId",
      [requiresUser, validateRequest(deletePostSchema)],
      deletePostHandler
    );
  }