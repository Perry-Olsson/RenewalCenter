import { useState } from "react";
import styled from "styled-components";
import { device } from "../../../../components/device";
import { useHandleUrlParam } from "../../Day/hooks";
import { useIsCard } from "../context/IsMonthCard";

interface PressableAreaProps {
  day: Date;
  dayHasPassed: boolean;
  today: boolean;
}

export const PressableArea: React.FC<PressableAreaProps> = props => {
  const isMonthCard = useIsCard();
  const route = useHandleUrlParam();
  const [background, setBackground] = useState("white"); //fixes sticky hover effect

  return (
    <Container
      route={route}
      background={background}
      onTouchStart={() => setBackground("gray")}
      onTouchEnd={() => setBackground("white")}
      isMonthCard={isMonthCard}
      {...props}
    >
      <DateValue isMonthCard={isMonthCard}>{props.day.getDate()}</DateValue>
    </Container>
  );
};

interface ContainerProps extends PressableAreaProps {
  route: Date;
  background: string;
  isMonthCard: boolean;
}

const Container = styled.a<ContainerProps>`
  background-color: ${({ theme, background, isMonthCard, day, route }) =>
    isMonthCard && day.valueOf() === route.valueOf()
      ? theme.colors.primaryFaded
      : background};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: ${({ dayHasPassed }) => (dayHasPassed ? "rgba(0, 0, 0, 0.3)" : null)};
  @media (min-width: ${({ isMonthCard }) =>
      isMonthCard ? "100000px" : device.tablet.pixels}) {
    height: 100%;
    width: 100%;
    justify-content: flex-end;
    align-items: flex-start;
    padding: 0.1rem;
  }
  @media (hover: hover) {
    :hover {
      background-color: ${({ theme, dayHasPassed }) =>
        dayHasPassed ? null : theme.colors.primaryFaded};
    }
  }
  @media (max-width: ${({ isMonthCard }) =>
      isMonthCard ? "100000px" : device.tablet.pixels}) {
    height: 59%;
    width: 60%;
    border: ${({ today }) => (today ? "solid 1px" : null)};
    border-radius: 50%;
    border-color: gray;
    transition: 0.15s;
  }
  cursor: ${({ dayHasPassed }) => (dayHasPassed ? null : "pointer")};
`;

const DateValue = styled.b<{ isMonthCard: boolean }>`
  font-size: ${({ theme, isMonthCard }) =>
    isMonthCard ? theme.font.sm : theme.font.sm_med};
`;
