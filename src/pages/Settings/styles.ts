import styled from 'styled-components';

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    padding: 0.4rem 2.2rem;

    > h1 {
        margin-bottom: 1.6rem;
    }

    > form > section {
        > h3 {
            font-size: 1.4rem;
            margin-bottom: 0.6rem;
        }

        > ul {
            background: ${({ theme }) => theme.darkBlue};
            list-style: none;
            border-radius: 8px;
            padding: 1rem 1rem;

            > li {
                display: flex;
                width: 100%;
                align-items: center;
                justify-content: space-between;

                & + li {
                    margin-top: 0.8rem;
                }

                > span {
                    display: block;
                    width: 16rem;
                }
            }
        }

        & + section {
            margin-top: 1.2rem;
        }
    }
`;
