import styled from 'styled-components';

export const Container = styled.span`
    border-radius: 4px;
    padding: 4px 8px;
    background-color: ${({ theme }) => theme.darkBlue};
    font: 500 0.8rem Montserrat, sans-serif !important;
`;
