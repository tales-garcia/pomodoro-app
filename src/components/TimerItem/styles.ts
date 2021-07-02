import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.li`
    background: ${({ theme }) => theme.darkBlue};
    border-radius: 10px;
    position: relative;

    padding: 24px;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: box-shadow .4s ease-out;

    &:hover {
        box-shadow: 12px 12px 34px 0px #00000047;
    }

    span {
        color: ${({ theme }) => theme.red};
    }

    > h2 {
        font-size: 52px;
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
        gap: 8px;

        > svg {
            transition: opacity .4s ease-in-out;
            cursor: pointer;

            :hover {
                opacity: 0.8;
            }
        }
    }
`;

export const ButtonsContainer = styled(motion.div)`
    position: absolute;
    bottom: 0.8rem;
    right: 0.8rem;
    left: 0.8rem;

    display: grid;

    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;

    * + * {
        margin-left: 0.4rem;
    }

    > button {
        width: 100%;
    }
`;