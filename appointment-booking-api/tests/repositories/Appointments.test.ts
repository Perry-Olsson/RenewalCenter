import { prisma } from "../../src/prisma";
import { Appointments } from "../../src/repositories/Appointments";
import {
  createTestAppointment,
  initializeTestData,
  parseRawAppointment,
} from "../helpers";

beforeAll(async () => {
  await initializeTestData();
});

afterAll(() => prisma.$disconnect());

describe("Appointments Repository", () => {
  test("Appointments repository retrieves data", async () => {
    const appointmentsFromDb = await prisma.appointment.findMany();
    const appointments = await Appointments.findMany();

    expect(appointments).toEqual(appointmentsFromDb);
  });

  describe("exposed", () => {
    test("exposed findMany does not return customerId", async () => {
      const appointments = await Appointments.exposed.findMany();

      expect(appointments[0].customerId).toBeUndefined();
    });

    test("exposed findManyRaw does not return private customer fields", async () => {
      const appointmentsFromDb = await prisma.appointment.findMany({
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          timestamp: true,
          end: true,
        },
      });
      const rawAppointments = await Appointments.exposed.findManyRaw({
        args: {},
      });
      const appointments = rawAppointments.map(parseRawAppointment);

      expect(appointments).toEqual(appointmentsFromDb);
      expect(appointments[0].customerId).toBeUndefined();
    });
  });

  describe("Appointment creation", () => {
    test("Initialize function returns returns NewAppointment object from request", async () => {
      const { data } = await createTestAppointment();
      const initializedAppointment = Appointments.initialize(
        JSON.parse(JSON.stringify(data))
      );

      expect(data).toMatchObject(initializedAppointment);
      expect(isNaN(data.timestamp.getDate())).toBe(false);
    });

    test("Initialize throws InvalidTime error", async () => {
      const {
        data: timestampWithInvalidMinutes,
      } = await createTestAppointment();
      const {
        data: timestampWithNonZeroSeconds,
      } = await createTestAppointment();
      timestampWithNonZeroSeconds.timestamp.setSeconds(5);

      const initialize = jest.fn(Appointments.initialize);

      expect(() => initialize(timestampWithInvalidMinutes)).toThrow();
      expect(() => initialize(timestampWithNonZeroSeconds)).toThrow();
    });

    test("throws Duplicate error if appointment already exists", async () => {
      const { data } = await createTestAppointment({ pushToDb: true });

      try {
        await Appointments.isDuplicate(data);
      } catch (e) {
        expect(e.message).toBe("timeslot has been taken");
      }
    });
  });

  describe("Query string is validated correctly", () => {
    test("validate field returns correct fields", () => {
      const validQuery = Appointments.validateQuery(query);
      expect(validQuery).toEqual({
        year: now.getFullYear(),
        month: now.getMonth(),
      });
    });
    const now = new Date();

    const query = {
      year: now.getFullYear(),
      month: now.getMonth().toString(),
      fake: "doesn't return obj with invalid field",
      hour: "doesn't return valid field with invalid value",
    };
  });

  test("Validates that a date string is in JSON format", () => {
    const validTimestamp = new Date().toJSON();
    const invalidTimestamp1 = "hello";
    const invalidTimestamp2 = "Tue, 23 Feb 2021 01:53:24 GMT";
    const invalidTimestamp3 = validTimestamp.slice(0, -1);

    expect(() => Appointments.validateTimestamp(validTimestamp)).not.toThrow();
    expect(() => Appointments.validateTimestamp(invalidTimestamp1)).toThrow();
    expect(() => Appointments.validateTimestamp(invalidTimestamp2)).toThrow();
    expect(() => Appointments.validateTimestamp(invalidTimestamp3)).toThrow();
  });
});
