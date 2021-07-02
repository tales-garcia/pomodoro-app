import styled, { css } from 'styled-components';

interface IContainerProps {
    confirmButton: number;
}

export const Container = styled.button<IContainerProps>`
    padding: 12px 16px;
    border-radius: 4px;
    border: 0;
    font: 500 0.8rem Montserrat, sans-serif;
    color: ${({ theme }) => theme.text};
    cursor: pointer;
    transition: filter .2s;
    background: ${({ theme }) => theme.blue};

    :hover {
        filter: brightness(0.85);
    }

    :active {
        filter: brightness(0.75);
    }

    ${({ confirmButton }) => confirmButton && css`
        background: ${({ theme }) => theme.red};
        font-weight: 600;
    `}
`;
