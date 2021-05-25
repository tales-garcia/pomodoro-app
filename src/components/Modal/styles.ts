import styled from 'styled-components';


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

export const Container = styled.main`
    background: ${({ theme }) => theme.darkBlue};
    border-radius: 8px;
    border: 2px solid ${({ theme }) => theme.red};

    padding: 32px;

    width: 40%;

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
    }
`;