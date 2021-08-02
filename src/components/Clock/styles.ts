import styled from 'styled-components';

export const Container = styled.div`
  width: calc((80vh + 80vw) / 2);
  height: calc((80vh + 80vw) / 2);
  border-radius: 50%;
  background: ${({ theme }) => theme.darkBlue};
  margin: auto;
  padding: 15px;
  background: linear-gradient(132.99deg, ${({ theme }) => theme.darkBlue} 18.31%, ${({ theme }) => theme.blue} 84.07%);
  box-shadow: 31px 31px 54px 11px ${({ theme }) => theme.darkBlue}, -31px -31px 54px 11px ${({ theme }) => theme.blue};

  font: 700 clamp(8px, calc((15vh + 15vw) / 2), 6rem) 'Open Sans', sans-serif;


  > div {
    border: 7px solid ${({ theme }) => theme.darkBlue};
    background: ${({ theme }) => theme.darkBlue};
    border-radius: 50%;

    span { outline: 0; }

    p {
      margin-top: clamp(2px, calc((10vh + 10vw) / 2), 2rem);
      font: 700 clamp(8px, calc((5vh + 5vw) / 2), 2rem) 'Montserrat', sans-serif;
      letter-spacing: 0.3rem;
      cursor: pointer;
    }
  }

  > p {
    color: ${({ theme }) => theme.red};
    margin-top: clamp(2px, calc((15vh + 15vw) / 2), 3rem);
    font: 700 clamp(8px, calc((5vh + 5vw) / 2), 2rem) 'Montserrat', sans-serif;
    letter-spacing: 0.3rem;
    cursor: pointer;
    width: 100%;
    text-align: center;
  }
`;
