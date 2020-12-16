import styled from 'styled-components';

export const TopRightContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  height: 20px;
  display: flex;
  background-color: transparent;
  padding: 0px 0px 0px 0px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const InvisibleButton = styled.button`
  -webkit-app-region: none;
  background-color: transparent;
  border: none;
  margin-right: 5px;
  margin-left: 5px;
  color: #4a4461;

  &:hover {
    color: #bdb9c9;
  }
`;
