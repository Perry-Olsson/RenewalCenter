import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { Button, LinkButton } from "../../../components";
import { useGetUser } from "../../../context";
import { Tab } from "../Tab";
import { Logout } from "./Logout";

export const NavbarView: React.FC = ({}) => {
  const user = useGetUser();

  if (user && user !== "loading")
    return (
      <Container>
        <span style={{ margin: "10px" }}>logged in as {user.firstName}</span>
        <Link href="/dashboard">
          <LinkButton style={{ margin: "10px" }} text="Dashboard" negative />
        </Link>
        <Logout
          Component={({ handleClick }) => (
            <Button handleClick={handleClick} text="Logout" negative />
          )}
        />
      </Container>
    );

  return (
    <>
      <Tab href="/login">Log in</Tab>
      <Tab href="/register">Register</Tab>
    </>
  );
};

const Container = styled.div`
  margin: 0 1rem;
`;
