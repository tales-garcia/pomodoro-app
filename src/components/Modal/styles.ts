import styled from 'styled-components';


export const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 4000;

    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Container = styled.main`
    background: ${({ theme }) => theme.darkBlue};
    border-radius: 8px;
    z-index: 5000;
    border: 2px solid ${({ theme }) => theme.red};

    padding: 32px;

    width: 40%;

    @media(max-width: 900px) {
        width: 60%;
    }

    @media(max-width: 600px) {
        width: 80%;
    }

    > * {
        display: flex;
        flex-direction: column;
        align-items: center;

        width: 100%;

        > * + * {
            margin-top: 24px;
        }

        > h2 {
            font: 600 1.4rem Montserrat, sans-serif;
        }
    }
`;