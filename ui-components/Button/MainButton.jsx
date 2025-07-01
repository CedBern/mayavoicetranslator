import styled from 'styled-components';

export const MainButton = styled.button`
  background: #009688;
  color: #fff;
  font-family: 'Montserrat', 'Open Sans', Arial, sans-serif;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  padding: 0.75em 1.5em;
  box-shadow: 0 1px 4px rgba(34,40,49,0.06);
  transition: background 0.2s;
  cursor: pointer;
  letter-spacing: 0.03em;
  &:hover, &:focus {
    background: #00796B;
    outline: 2px solid #43A047;
  }
`;

// Accessible usage example:
// <MainButton aria-label="Traduire">Traduire</MainButton>
