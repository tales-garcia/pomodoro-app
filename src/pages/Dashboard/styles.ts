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

        > h1 > svg {
            cursor: pointer;
            :hover {
                opacity: 0.8;
            }
        }

        > ul {
            display: grid;
            gap: 32px;
            grid-auto-rows: 300px;
            grid-auto-columns: 250px;
            grid-template-columns: repeat(auto-fill, 250px);

            > li {
                
            }
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

export const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);

    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Modal = styled.main`
    background: ${({ theme }) => theme.darkBlue};
    border-radius: 8px;
    border: 2px solid ${({ theme }) => theme.red};

    padding: 32px;

    width: 40%;

    display: flex;
    flex-direction: column;
    align-items: center;

    > * + * {
        margin-top: 24px;
    }

    > h2 {
        font: 600 1.4rem Montserrat, sans-serif;
    }

    > input {
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
    }

    > div {
        min-width: 50%;
        display: grid;
        gap: 8px;
        grid-template-columns: 1fr 1fr;

        > button {
            padding: 12px 16px;
            border-radius: 4px;
            border: 0;
            font: 500 0.8rem Montserrat, sans-serif;
            color: ${({ theme }) => theme.text};
            cursor: pointer;
            transition: filter .2s;

            :hover {
                filter: brightness(0.85);
            }

            :active {
                filter: brightness(0.75);
            }
        }

        > button:first-child {
            background: ${({ theme }) => theme.blue};
        }

        > button:last-child {
            background: ${({ theme }) => theme.red};
            font-weight: 600;
        }
    }
`;