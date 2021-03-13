import { useAtom } from "jotai";
import { useEffect } from "react";
import { ONE_YEAR } from "../../../constants";
import { monthsAtom, nowAtom } from "../atoms";
import { Months } from "../types";
import { computeDates } from "../utils";

export const useGetCalenderMonths = () => {
  const [{ today }] = useAtom(nowAtom);
  const [months, setMonths] = useAtom(monthsAtom);

  const renderNextTenMonths = () => {
    if (isNearingBottomOfPage() && monthListIsNotMaxed(months, today)) {
      setMonths(concatMonths(months));
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", renderNextTenMonths);
    return () => document.removeEventListener("scroll", renderNextTenMonths);
  }, [months]);

  return months.edges;
};

const isNearingBottomOfPage = (): boolean => {
  const {
    body: { scrollHeight },
  } = document;
  const { innerHeight, scrollY } = window;

  if ((scrollHeight - innerHeight) * 0.65 < scrollY) return true;
  return false;
};

const monthListIsNotMaxed = ({ cursor }: Months, today: Date): boolean => {
  if (cursor.valueOf() < today.valueOf() + ONE_YEAR) return true;
  return false;
};

const concatMonths = (months: Months) => {
  const { edges: newEdges, cursor } = computeDates(months.cursor, 10);
  const edges = months.edges;

  newEdges.forEach(month => edges.push(month));

  return { edges, cursor };
};
