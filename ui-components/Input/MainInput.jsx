import styled from 'styled-components';

export const MainInput = styled.input`
  background: #fff;
  color: #222831;
  font-family: 'Open Sans', Arial, sans-serif;
  font-size: 1rem;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  padding: 0.75em 1em;
  margin: 0.5em 0;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(34,40,49,0.03);
  &:focus {
    border: 1.5px solid #009688;
    box-shadow: 0 0 0 2px #00968833;
  }
  &::placeholder {
    color: #6D7587;
    opacity: 1;
  }
`;

// Usage: <MainInput placeholder="Entrer un texte" aria-label="Entrer un texte" />
