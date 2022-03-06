import { object, string } from "yup";

   // Create a post
/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserPostInput:
 *      type: object
 *      required:
 *        - title
 *        - description
 *      properties:
 *        title:
 *          type: string
 *          default: This is a Post Title
 *        description:
 *          type: string
 *          default: This is a Post description where you describe which posts
 *        
 *    CreateUserPostResponse:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *        description:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */


  // Update a post

/**
 * @openapi
 * components:
 *   schema:
 *     Post:
 *       type: object
 *       required:
 *        - title
 *        - body
 *        
 *       properties:
 *         title:
 *           type: string
 *         body:
 *           type: string
 *         
 */



const payload = {
  body: object({
    title: string().required("Title is required"),
    body: string()
      .required("Body is required")
      .min(120, "Body is too short - should be 120 chars minimum."),
  }),
};

const params = {
  params: object({
    postId: string().required("postId is required"),
  }),
};

export const createPostSchema = object({
  ...payload,
});

export const updatePostSchema = object({
  ...params,
  ...payload,
});

export const deletePostSchema = object({
  ...params,
});
