import styled from 'styled-components';

export const DeviceStatusContainer = styled.div`
  height: 100px;
  padding: 25px;
  display: flex;
  margin-right: 20px;
  padding: 0px 0px 0px 0px;
  margin-left: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

// I think styled components is better for several reasons.
// 1. you can write javascript that actually dynamically modifies the styles
// 2. you can create base styles and then overwrite them as necessary when you need to make minor changes.
// 3. We need to install styled-compoents/babel (or something like that) and the compoenents get named according to the variable names we give them which is very nice for debugging.
// 4. I used to use SASS but switched to styled components.
// 5. I am good with either, but this is just faster to get up and running with for now.
// 6. It is just like a javascript variable. They don't need to be unique.
// 7. react automaitcally adds a unique identifier onto the end so they don't overwrite eactother.variable

// I'll be back in like 20 or 30 minutes. If you are done by then jus tpush up the code and I will keep playign with it. Cool Oh fun!

// K, I'll push up rn actuall, might be playing with Yolo in a bit
// Btw, I'm not a huge fan. I used to do react with standard CSS files and that. Is this just better?
// Fair enough
// Isn't that SASS though? mayben not

// Ah k

export const DeviceStatusIP = styled.p`
  color: #8a84a3;
  font-size: 15px;
  background-color: #282436;
  border-radius: 10px;
  padding: 5px 5px 5px 5px;
`;
