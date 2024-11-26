import React, { useState } from "react";
import { Table } from 'react-bootstrap';

const Tabell = ({
    data, 
    currentSort, 
    onSort, 
    isAdmin = false, 
    isProducer = false,
    currentUserId = null, 
    onEdit,
    onDelete,
    onRowClick
}) => {
    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
        { key: 'description', label: 'Description' },
        { key: 'calories', label: 'Calories (kcal)' },
        { key: 'protein', label: 'Protein (g)' },
        { key: 'fat', label: 'Fat (g)' },
        { key: 'carbohydrates', label: 'Carbohydrates (g)' }
    ];

    const handleSort = (key) => {
        const direction = 
            currentSort.key === key && currentSort.direction === 'asc' 
                ? 'desc' 
                : 'asc';
        onSort(key, direction);
    };

    const renderSortIcon = (key) => {
        if (currentSort.key !== key) return null;
        return <span>{currentSort.direction === 'asc' ? '▲' : '▼'}</span>;
    };

    return (
        <Table className="table table-responsive table-hover">
            <thead>
                <tr>
                    {columns.map(column => (
                        <th key={column.key} onClick={() => handleSort(column.key)}>
                            <div className="sort-header">
                                {column.label}
                                {renderSortIcon(column.key)}
                            </div>
                        </th>
                    ))}
                    {(isAdmin || isProducer) && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {data.map(item => (
                    <tr 
                        key={item.id} 
                        onClick={() => onRowClick(item.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <td>{item.name}</td>
                        <td>{Array.isArray(item.categoryList) 
                            ? item.categoryList.join(', ') 
                            : 'No Categories'}
                        </td>
                        <td>{item.description}</td>
                        <td>{item.calories}</td>
                        <td>{item.protein}</td>
                        <td>{item.fat}</td>
                        <td>{item.carbohydrates}</td>
                        {(isAdmin || (isProducer && item.producerId === currentUserId)) && (
                            <td onClick={e => e.stopPropagation()}>
                                <button 
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => onEdit(item.id)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => onDelete(item.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default Tabell;

  