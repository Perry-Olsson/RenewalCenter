import { FC } from "react";
import styled from "styled-components";
import { Flex } from "./Flex";
import ReactLoading, { LoadingProps } from "react-loading";

export const LoadingIcon: FC<LoadingProps> = ({
  className,
  type = "bars",
  color = "#2222222",
  height = "50px",
  width = "50px",
  ...props
}) => {
  return (
    <LoadingContainer className={className}>
      <ReactLoading
        type={type}
        color={color}
        height={height}
        width={width}
        {...props}
      />
    </LoadingContainer>
  );
};

const LoadingContainer = styled(Flex)`
  height: 100%;
`;
