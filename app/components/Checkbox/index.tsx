import * as React from 'react';
import styled from 'styled-components';

const Checkbox: React.FC<{
  className?: string;
  checked: boolean;
  onChange: (e: any) => void;
}> = ({ className, checked, ...props }) => (
  <CheckboxContainer className={className}>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <HiddenCheckbox checked={checked} {...props} />
    <StyledCheckbox checked={checked}>
      <Icon viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </Icon>
    </StyledCheckbox>
  </CheckboxContainer>
);

export default Checkbox;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  // Hide checkbox visually but remain accessible to screen readers.
  // Source: https://polished.js.org/docs/#hidevisually
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;
const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 3px;
`;

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  padding: 2px;
  background: ${props =>
    (props as any).checked ? 'hsl(0deg 0% 0%)' : '#8a84a3'};
  border-radius: 3px;
  transition: all 150ms;
  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px #8a84a3;
  }
  ${Icon} {
    visibility: ${props => ((props as any).checked ? 'visible' : 'hidden')};
  }
` as any;
