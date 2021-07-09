import styled from 'styled-components';

export const Container = styled.span`
    border-radius: 4px;
    padding: 4px 8px;
    background-color: #1f1f33;
    font: 500 0.8rem Montserrat, sans-serif !important;
    border: 1px solid ${({ theme }) => theme.darkBlue};
    border-bottom-width: 3px;
`;
