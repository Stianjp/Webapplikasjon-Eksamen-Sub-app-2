import React, { useState } from "react";
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Makes a dynamic tabell that can be used on other pages, 
const Tabell = ({ 
    products, 
    apiUrl,
    isAdmin = false,
    isProducer = false,
    currentUserId = null
}) => {
    const navigate = useNavigate();
    const [currentSort, setCurrentSort] = useState({ key: null, direction: 'asc' });

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'categoryList', label: 'Category' },
        { key: 'description', label: 'Description' },
        { key: 'calories', label: 'Calories' },
        { key: 'protein', label: 'Protein' },
        { key: 'fat', label: 'Fat' },
        { key: 'carbohydrates', label: 'Carbohydrates' }
    ];

    //Metode for å sortere kan hende dette bør ligge i backend-, som det alt gjør i controlleren product
    const handleSort = (key) => {
        const direction = 
            currentSort.key === key && currentSort.direction === 'asc' 
                ? 'desc' 
                : 'asc';
        setCurrentSort({ key, direction });
    };

    const renderSortIcon = (key) => {
        if (currentSort.key !== key) return null;
        return <span>{currentSort.direction === 'asc' ? '▲' : '▼'}</span>;
    };

    const handleEdit = (e, productId) => {
        e.stopPropagation();
        navigate(`/edit-product/${productId}`);// Ved å legge til $ kan vi forsikre at den trykker basert på innlogget bruker
    };
    

    const handleDelete = (e, productId) => {
        e.stopPropagation();
        navigate(`/delete-product/${productId}`);// Ved å legge til $ kan vi forsikre at den trykker basert på innlogget bruker
    };


    const handleRowClick = (productId) => {
        navigate(`/product-details/${productId}`); // Ved å legge til $ kan vi forsikre at den trykker basert på innlogget bruker
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
                {products && products.map(item => (
                    <tr 
                        key={item.id} 
                        onClick={() => handleRowClick(item.id)}
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
                                    onClick={(e) => handleEdit(e, item.id)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={(e) => handleDelete(e, item.id)}
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