import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from "../utils/server";
import mongoose from "mongoose";
import { createPost } from "../service/post.service";
import { sign } from "../utils/jwt.utils";

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

export const postPayload = {
  user: userId,
  title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
  body:
    "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
 
};

export const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  name: "Jane Doe",
};

describe("post",  () => {
  beforeAll( async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("get post route", () => {
    describe("given the post does not exist", () => {
      it("should return a 404", async () => {
        const postId = "post-123";

        await supertest(app).get(`/api/posts/${postId}`).expect(404);
      });
    });

    describe("given the post does exist", () => {
      it("should return a 200 status and the post", async () => {
        // @ts-ignore
        const post = await createPost(postPayload);

        const { body, statusCode } = await supertest(app).get(
          `/api/posts/${post.postId}`
        );

        expect(statusCode).toBe(200);

        expect(body.postId).toBe(post.postId);
      });
    });
  });

  describe("create post route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 403", async () => {
        const { statusCode } = await supertest(app).post("/api/posts");

        expect(statusCode).toBe(403);
      });
    });

    describe("given the user is logged in", () => {
      it("should return a 200 and create the post", async () => {
        const jwt = sign(userPayload);

        const { statusCode, body } = await supertest(app)
          .post("/api/posts")
          .set("Authorization", `Bearer ${jwt}`)
          .send(postPayload);

        expect(statusCode).toBe(200);

        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          body:
            "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
         
          postId: expect.any(String),
          title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
          updatedAt: expect.any(String),
          user: expect.any(String),
        });
      });
    });
  });
});
