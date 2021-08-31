import ReactTooltip from 'react-tooltip';
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
        min-width: 0;

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

            > li {
                cursor: pointer;

                > span {
                    white-space: nowrap;
                    overflow: hidden;
                    width: 88%;
                    text-overflow: ellipsis;
                }

                :hover {
                    svg {
                        opacity: 1;
                    }
                }

                > svg {
                    transition: opacity 0.4s ease-in-out;
                    cursor: pointer;
                    opacity: 0;

                    :hover {
                        opacity: 0.8;
                    }
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

        > h1 {
            > span {
                padding: 2px 6px;
                border-radius: 8px;
                border: 4px solid transparent;
                outline: 0;

                :hover {
                    border: 4px solid ${({ theme }) => theme.blue};
                }
                :focus {
                    border: 4px solid ${({ theme }) => theme.blue};
                }
            }

            > button {
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

export const NoSelectedWorkspace = styled.main`
    display: flex;

    width: 100%;
    height: 100%;

    align-items: center;
    justify-content: flex-start;
    flex-direction: column;

    padding-top: 6rem;

    > img {
        margin-bottom: 1.8rem;
        width: 256px;
        height: 256px;
    }

    > p {
        font: 500 1.2rem Montserrat, sans-serif;
        opacity: 0.8;
        text-align: center;
        margin-bottom: 4rem;
    }

    > div {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 0 6rem;
        grid-gap: 1rem;

        @media(max-width: 900px) {
            padding: 0 2rem;
        }
    }
`;

export const Commands = styled.ul`
    li {
        list-style: none;
        opacity: 0.6;
        font: 500 0.96rem Montserrat, sans-serif;
        white-space: nowrap;

        & + li {
            margin-top: 1.2rem;
        }

        > span:last-of-type {
            margin-right: 0.6rem;
        }
    }

`;

export const Recent = styled.ul`
    opacity: 0.8;
    font: 500 1rem Montserrat, sans-serif;

    > p {
        margin-bottom: 1.4rem;
    }

    li {
        list-style: none;
        opacity: 0.8;
        font: 500 0.96rem Montserrat, sans-serif;
        color: ${({ theme }) => theme.text};

        > span {
            color: ${({ theme }) => theme.red};
            cursor: pointer;
        }

        & + li {
            margin-top: 0.4rem;
        }
    }

`;

export const WorkspaceTooltip = styled(ReactTooltip)`
    background: #000 !important;
    border-radius: 8px !important;
`;