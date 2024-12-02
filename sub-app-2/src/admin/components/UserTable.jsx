import React from 'react';
import { Table, Button } from 'react-bootstrap';

const Tabell = ({ data, onEdit, onDelete, sortKey, sortDirection, onSort }) => {
  
  return (
    <Table className="table table-striped table-bordered table-hover table-auto" responsive="sm">
      <thead>
        <tr>
          <th onClick={() => onSort('id')} style={{ cursor: 'pointer' }}>
            # {sortKey === 'id' && (sortDirection === 'asc' ? '▲' : '▼')}
          </th>
          <th onClick={() => onSort('name')} style={{ cursor: 'pointer' }}>
            Name {sortKey === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
          </th>
          <th className="d-none d-sm-table-cell">Username</th>
          <th className='d-none d-sm-table-cell' onClick={() => onSort('role')} style={{ cursor: 'pointer' }}>
            Role {sortKey === 'id' && (sortDirection === 'asc' ? '▲' : '▼')}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td className="d-none d-sm-table-cell">{user.username}</td>
            <td className="d-none d-sm-table-cell">{user.role}</td>
            <td>
              <Button
                variant="primary"
                size="sm"
                className="me-2"
                onClick={(handleDelete) => onEdit(user.id)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(user.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Tabell;
