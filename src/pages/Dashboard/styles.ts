import styled, { css } from 'styled-components';

interface WorkspaceItemProps {
    isActive?: number;
}

export const Container = styled.main`
    display: grid;
    width: 100vw;
    height: 100vh;
    grid-template-columns: 0.3fr 1fr;
    margin-top: -36px;

    li {
        list-style: none;
    }

    h1 {
        border-bottom: 1px solid ${({ theme }) => theme.red};
        width: 100%;
        color: ${({ theme }) => theme.text};
        padding-bottom: 8px;
        display: flex;
        justify-content: space-between;
    }

    aside {
        display: flex;
        align-items: stretch;
        flex-direction: column;
        justify-content: space-between;
        background: ${({ theme }) => theme.darkBlue};
        padding: 36px;

        > * + * {
            margin-top: 64px;
        }

        > ul {
            flex: 1;
        }
    }
`;

export const WorkspaceItem = styled.li<WorkspaceItemProps>`
    width: 100%;
    opacity: 0.6;
    padding: 12px 18px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${({ isActive, theme }) => isActive && css`
        opacity: 1;
        background: ${theme.blue};
    `}
`;