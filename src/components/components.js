import styled from "styled-components";

export const DaiInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 100%;

  > * {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
`;
