import { customer } from "../../src/repositories/customer";
import bycrypt from "bcryptjs";
import { testGuest, testUser } from "../constants";
import { prisma } from "../../src/prisma";
import { initializeTestData } from "../helpers";
import customers from "../../src/prisma/seeds/json/customers.json";

beforeAll(async () => {
  await initializeTestData();
});

afterAll(() => prisma.$disconnect());

describe("Customer Creation", () => {
  test("Initialze function throws error if object isn't provided", async () => {
    await expect(customer.initialize("hello")).rejects.toThrow();
  });

  test("Initialize function validates email address correctly", async () => {
    const validCustomer = await customer.initialize({ ...testUser });
    await expect(
      customer.initialize({
        ...testUser,
        email: "invalidEmail",
      })
    ).rejects.toThrow();

    expect(validCustomer).toBeDefined();
  });

  test("Initialize function hashes user password and deletes guest password field", async () => {
    const user = await customer.initialize({ ...testUser });
    const guest = await customer.initialize({ ...testGuest });

    expect(guest.password).toBeUndefined();
    expect(user.password).toHaveLength(60);
    expect(
      await bycrypt.compare(testUser.password, user.password!)
    ).toBeTruthy();
  });

  test("Initialize returns a valid customer", async () => {
    const user = await customer.initialize({ ...testUser });
    const guest = await customer.initialize({ ...testGuest });

    expect(Object.keys(user).length).toBe(Object.keys(testUser).length);
    expect(Object.keys(guest).length).toBe(Object.keys(testGuest).length - 1);

    const match = await bycrypt.compare(testUser.password, user.password!);
    expect(match).toBe(true);
  });

  test("create token function returns a valid token", async () => {
    const token = customer.createToken(testUser.email);

    const decodedToken = customer.decodeToken(token);

    expect(decodedToken.email).toBe(testUser.email);
    expect(typeof token).toBe("string");
  });
});

describe("Customer login", () => {
  test("Login function returns customer response object for valid user", async () => {
    const newCustomer = await prisma.customer.create({
      data: await customer.initialize({ ...testUser }),
      include: { appointments: true },
    });
    const { email, password } = testUser;
    const customerResponse = await customer.login({ email, password });

    expect(typeof customerResponse.token).toBe("string");
    expect(newCustomer).toMatchObject(customerResponse.customer);

    await prisma.customer.delete({ where: { id: newCustomer.id } });
  });

  test("Login function returns throw error on invalid input", async () => {
    const email = "invalid";
    const password = "invalid";

    await expect(customer.login({ email, password })).rejects.toThrow();
  });

  test("Login function throws when given valid guest input", async () => {
    const newGuest = await prisma.customer.create({
      data: await customer.initialize({ ...testGuest }),
    });

    const { email } = testGuest;

    await expect(customer.login({ email, password: "" })).rejects.toThrow();

    await prisma.customer.delete({ where: { id: newGuest.id } });
  });
});

describe("miscellaneous", () => {
  test("findUnique returns correct fields", async () => {
    const _customer = await customer.findUnique({
      where: { email: customers[0].email },
    });
    const customerPassword = await customer.findUnique({
      where: { email: customers[0].email },
      select: { password: true },
    });
    if (!_customer || !customerPassword) throw new Error("Customer not found");

    expect(_customer.email).toBe(customers[0].email);
    expect(_customer.password).toBeUndefined();
    expect(customerPassword.password).toHaveLength(60);
  });
});
