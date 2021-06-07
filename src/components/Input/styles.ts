import styled, { css } from 'styled-components';
import { Field } from 'formik';

interface ContainerProps {
    hasError: number;
}

export const Container = styled(Field)<ContainerProps>`
    width: 100%;
    background: ${({ theme }) => theme.blue};
    border-radius: 8px;
    border: 2px solid ${({ theme }) => theme.blue};
    outline: 0;
    padding: 15px;

    font: 500 1rem Montserrat, sans-serif;
    color: ${({ theme }) => theme.text};

    &::placeholder {
        color: ${({ theme }) => theme.text}70;
        font: 400 1rem Montserrat, sans-serif;
    }

    &:focus {
        border: 2px solid ${({ theme }) => theme.red};
    }

    ${({ hasError }) => hasError && css`
        border: 2px solid #ff0033;
    `}
`;

export const Error = styled.p`
    line-height: 100%;
    margin: 0;
    margin-top: 8px;

    width: 100%;
    text-align: left;

    font: 400 0.8rem Montserrat, sans-serif;
    color: #ff003370;
`;