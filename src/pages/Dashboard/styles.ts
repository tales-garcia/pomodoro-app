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
        align-items: center;
    }

    aside {
        display: flex;
        align-items: stretch;
        flex-direction: column;
        justify-content: space-between;
        background: ${({ theme }) => theme.darkBlue};
        padding: 36px;
        height: 100vh;

        > * + * {
            margin-top: 64px;
        }

        > ul {
            flex: 1;
            height: 100%;
            overflow-y: scroll;

            ::-webkit-scrollbar {
                display: none;
            }

            > li > svg {
                cursor: pointer;

                :hover {
                    opacity: 0.8;
                }
            }
        }

        > footer {
            display: grid;
            width: 100%;
            grid-template-rows: 1fr;
            grid-auto-columns: 20px;
            grid-auto-rows: 20px;
            grid-auto-flow: column;
            gap: 8px;

            > svg {
                cursor: pointer;

                :hover {
                    opacity: 0.8;
                }
            }
        }
    }

    > main {
        padding: 24px;
        height: 100vh;
        overflow-y: auto;

        > * + * {
            margin-top: 54px;
        }

        > h1 > button {
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${({ theme }) => theme.darkBlue};
            border: 1px solid ${({ theme }) => theme.red};
            border-radius: 8px;
            padding: 12px 18px;
            cursor: pointer;

            color: ${({ theme }) => theme.text};
            font: 400 1rem Montserrat, sans-serif;

            svg {
                margin-right: 6px;
            }
        }

        > ul {
            display: grid;
            gap: 32px;
            grid-auto-rows: 300px;
            grid-auto-columns: 250px;
            grid-template-columns: repeat(auto-fill, 250px);
        }
    }
`;

export const WorkspaceItem = styled.li<WorkspaceItemProps>`
    width: 100%;
    opacity: 0.6;
    padding: 12px 18px;
    cursor: pointer;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${({ isActive, theme }) => isActive && css`
        opacity: 1;
        background: ${theme.blue};
    `}
`;
