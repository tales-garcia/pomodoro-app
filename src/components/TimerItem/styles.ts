import styled from 'styled-components';

export const Container = styled.li`
    background: ${({ theme }) => theme.darkBlue};
    border-radius: 10px;

    padding: 24px;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: box-shadow .4s ease-out;

    &:hover {
        box-shadow: 12px 12px 34px 0px #00000047;

        > footer {
            opacity: 1;
        }
    }

    span {
        color: ${({ theme }) => theme.red};
    }

    > h2 {
        font-size: 64px;
        font-weight: 700;
    }

    > h3 {
        font-size: 24px;
        margin-top: 38px;
        font-weight: 600;
    }

    > footer {
        display: grid;
        margin-top: 16px;
        grid-auto-flow: column;
        opacity: 0;
        transition: opacity .4s ease-in-out;
        gap: 8px;

        > svg {
            cursor: pointer;

            :hover {
                opacity: 0.8;
            }
        }
    }
`;