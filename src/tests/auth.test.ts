import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "../index";

const testUser = {
  name: "Valya",
  email: `valya${Date.now()}@mail.ru`,
  password: "dshaglkjsdhgksdj",
};

let authToken = "";

describe("GET /api/auth/ok", () => {
  test("API отвечает", async () => {
    const response = await request(app).get("/api/auth/ok");
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });
});

describe("POST /api/auth/sign-up/email", () => {
  test("Регистрация аккаунта с валидными данными", async () => {
    const response = await request(app)
      .post("/api/auth/sign-up/email")
      .send(testUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    authToken = response.body.token;
  });

  test("Регистрация аккаунта с коротким паролем", async () => {
    const response = await request(app)
      .post("/api/auth/sign-up/email")
      .send({
        name: "Valya",
        email: `valya${Date.now()}@mail.ru`,
        password: "1",
      });

    expect(response.status).toBe(400);
  });
});

describe("POST /api/auth/sign-in/email", () => {
  test("Вход в существующий аккаунт", async () => {
    const response = await request(app).post("/api/auth/sign-in/email").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    authToken = response.body.token;
  });

  test("Вход в несуществующий аккаунт", async () => {
    const response = await request(app)
      .post("/api/auth/sign-in/email")
      .send({
        email: `valya${Date.now()}@mail.ru`,
        password: "dshaglkjsdhgksdj",
      });

    expect(response.status).toBe(401);
  });

  test("Вход в существующий аккаунт с неправильным паролем", async () => {
    const response = await request(app).post("/api/auth/sign-in/email").send({
      email: testUser.email,
      password: "sdgdgsrhsfsfhs",
    });

    expect(response.status).toBe(401);
  });
});

describe("POST /api/auth/sign-out", () => {
  test("Выход из аккаунта", async () => {
    const response = await request(app)
      .post("/api/auth/sign-out")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("Выход из аккаунта, когда пользователь неавторизован", async () => {
    const response = await request(app).post("/api/auth/sign-out");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
