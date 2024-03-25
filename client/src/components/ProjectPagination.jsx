import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import WidgetWrapper from './WidgetWrapper';

const CustomPagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (event, pageNumber) => {
        onPageChange(pageNumber);
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
            <Pagination.Item
                key={i}
                active={i === currentPage}
                onClick={(e) => handlePageChange(e, i)}
            >
                {i}
            </Pagination.Item>
        );
    }

    return (
        <WidgetWrapper style={{ padding: '0.5rem', borderRadius: '0px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <Stack spacing={2}>
            <Pagination>{pageNumbers}</Pagination>
        </Stack>
        </WidgetWrapper>
    );
};

export default CustomPagination;
