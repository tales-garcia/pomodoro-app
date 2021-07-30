import styled from 'styled-components';

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    margin-top: -36px;

    display: flex;
    align-items: center;
    justify-content: center;

    -webkit-app-region: drag;

    img {
        width: 250px;
        height: 250px;
    }
`;
