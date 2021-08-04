import styled from 'styled-components';

interface ContainerProps {
    checked: number;
}

export const Container = styled.div<ContainerProps>`
    input {
        display: none;
    }

    label {
        display: flex;
        background-color: ${({ theme, checked }) => !!checked ? theme.red : theme.switchBackground};
        border-radius: 2rem;
        align-items: center;
        justify-content: center;
        padding: 4px;
        transition: background 0.2s ease-out;

        > span {
            width: 1rem;
            height: 1rem;
            border-radius: 100%;
            background: #f1f1f1;
            display: block;
            transition: margin 0.2s ease-out;
            margin-right: ${({ checked }) => !!checked ? '0' : '1.2rem'};
            margin-left: ${({ checked }) => !!checked ? '1.2rem' : '0'};
        }
    }
`;
