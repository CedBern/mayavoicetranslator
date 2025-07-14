import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Loader = styled.div`
  border: 4px solid #E0E0E0;
  border-top: 4px solid #009688;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: ${spin} 1s linear infinite;
  margin: 1em auto;
  display: block;
`;

// Usage: <Loader aria-label="Chargement" />
