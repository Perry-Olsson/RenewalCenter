import { atom } from "jotai";
import { OrganizedAppointments } from "../../../types";
import { Months, Today } from "../types";
import { computeDates } from "../utils";

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const dates = computeDates(today);

export const nowAtom = atom<Today>({
  now,
  today,
  monthListCursor: today,
});

export const monthsAtom = atom<Months>(dates);

export const allAppointmentsAtom = atom<OrganizedAppointments>({});

export const dayAtom = atom<Date | null>(null);