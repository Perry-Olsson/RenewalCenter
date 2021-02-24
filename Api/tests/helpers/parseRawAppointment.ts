import { Appointment } from "@prisma/client";

export const parseRawAppointment = (appointment: any): Appointment => {
  const returnApp: any = {};
  for (let field in appointment) {
    if (
      field === "createdAt" ||
      field === "updatedAt" ||
      field === "timestamp"
    ) {
      returnApp[field] = new Date(appointment[field]);
    } else {
      if (isValidAppointmentField(field)) returnApp[field] = appointment[field];
      else {
        console.log(appointment);
        throw new Error(`Invalid appointment field`);
      }
    }
  }
  if (Object.keys(returnApp).length !== 4)
    throw new Error("Missing fields in appointment");
  return returnApp as Appointment;
};

const isValidAppointmentField = (field: string): boolean => {
  if (field === "id") return true;
  else return false;
};