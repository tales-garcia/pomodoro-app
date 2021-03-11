import styled from 'styled-components';

export const Container = styled.div`
  width: calc((80vh + 80vw) / 2);
  height: calc((80vh + 80vw) / 2);
  border-radius: 50%;
  background: ${({ theme }) => theme.darkBlue};
  margin: auto;
  padding: 15px;
  background: linear-gradient(132.99deg, #151423 18.31%, #31314E 84.07%);
  box-shadow: 31px 31px 54px 11px #151424, -31px -31px 54px 11px #31314E;

  font: 700 6rem 'Open Sans', sans-serif;

  p {
    margin-top: 2rem;
    font: 700 1.5rem 'Montserrat', sans-serif;
    letter-spacing: 0.3rem;
    cursor: pointer;
  }

  > div {
    border: 7px solid ${({ theme }) => theme.darkBlue};
    background: ${({ theme }) => theme.darkBlue};
    border-radius: 50%;
  }
`;
