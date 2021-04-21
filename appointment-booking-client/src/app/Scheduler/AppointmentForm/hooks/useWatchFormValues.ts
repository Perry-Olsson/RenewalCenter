import { useAtom } from "jotai";
import { useEffect } from "react";
import { UseFormWatch } from "react-hook-form";
import {
  providerAtom,
  procedureAtom,
  selectedAppointmentAtom,
} from "../../atoms";
import { useStaticState } from "../../context";
import { useDeselectTime } from "../../hooks";
import { FormValues } from "../types";

export const useWatchFormValues = (watch: UseFormWatch<FormValues>) => {
  const { providers, procedures } = useStaticState();
  const [, setSelectedProvider] = useAtom(providerAtom);
  const [selectedProcedure, setSelectedProcedure] = useAtom(procedureAtom);
  const [selectedAppointment, setSelectedAppointment] = useAtom(
    selectedAppointmentAtom
  );
  const deselectTime = useDeselectTime();

  const provider = watch("provider");
  const procedure = watch("procedure");
  const time = watch("time");

  useEffect(() => {
    deselectTime();
    setSelectedProvider(providers.find(p => p.email === provider));
  }, [provider]);

  useEffect(() => {
    deselectTime();
    setSelectedProcedure(procedures.find(p => p.name === procedure));
  }, [procedure]);

  useEffect(() => {
    if (selectedProcedure && time !== "") {
      const start = new Date(time);
      if (selectedAppointment?.start.valueOf() !== start.valueOf()) {
        const end = new Date(time);
        end.setMinutes(start.getMinutes() + selectedProcedure.duration);
        setSelectedAppointment({ start, end });
      }
    }
  }, [time]);
};
