import React from "react";
import styled from "styled-components";
import { useGetUser } from "../../../context";
import { BurgerButton, BurgerTab } from "../Tab";
import { Logout } from "./Logout";

export const BurgerView: React.FC<BurgerViewProps> = ({}) => {
  const user = useGetUser();

  if (user && user !== "loading")
    return (
      <>
        <BurgerTab href="/dashboard">Dashboard</BurgerTab>
        <Logout
          Component={({ handleClick }) => (
            <BurgerButton handleClick={handleClick}>Logout</BurgerButton>
          )}
        />
        <LoggedUser>logged in as {user.firstName}</LoggedUser>
      </>
    );

  return (
    <>
      <BurgerTab href="/login">Login</BurgerTab>
      <BurgerTab href="/register">Register</BurgerTab>
    </>
  );
};

const LoggedUser = styled.div`
  position: absolute;
  bottom: 0;
  margin: 5px;
`;

interface BurgerViewProps {}
