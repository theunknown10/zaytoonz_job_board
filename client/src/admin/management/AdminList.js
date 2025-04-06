import React, { useState, useEffect } from 'react';
import { FiLoader, FiAlertCircle, FiUser } from 'react-icons/fi';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import AdminModal from './AdminModal';
import './AdminList.css';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view', 'edit', or 'delete'
  
  useEffect(() => {
    fetchAdmins();
  }, []);
  
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch admin users');
      }
      
      setAdmins(data.data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const openModal = (mode, admin) => {
    setSelectedAdmin(admin);
    setModalMode(mode);
  };
  
  const closeModal = () => {
    setSelectedAdmin(null);
    setModalMode(null);
  };
  
  const handleEditSuccess = (updatedAdmin) => {
    setAdmins(admins.map(admin => 
      admin.id === updatedAdmin.id ? updatedAdmin : admin
    ));
    closeModal();
  };
  
  const handleDeleteSuccess = (deletedId) => {
    setAdmins(admins.filter(admin => admin.id !== deletedId));
    closeModal();
  };
  
  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="admin-list-loading">
        <FiLoader className="loading-icon" />
        <p>Loading admin users...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="admin-list-error">
        <FiAlertCircle className="error-icon" />
        <p>Error: {error}</p>
        <button onClick={fetchAdmins} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="admin-list-container">
      <h2>Admin Users</h2>
      <p className="list-description">Manage existing admin users and their access levels.</p>
      
      {admins.length === 0 ? (
        <div className="no-admins">
          <FiUser className="no-data-icon" />
          <p>No admin users found</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id}>
                  <td className="admin-name">
                    {admin.first_name} {admin.last_name}
                  </td>
                  <td>{admin.email}</td>
                  <td>{admin.username}</td>
                  <td>
                    <span className={`role-badge ${admin.role}`}>
                      {admin.role}
                    </span>
                  </td>
                  <td>{formatDate(admin.created_at)}</td>
                  <td className="action-buttons">
                    <button 
                      className="action-button view" 
                      onClick={() => openModal('view', admin)}
                      title="View details"
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="action-button edit" 
                      onClick={() => openModal('edit', admin)}
                      title="Edit user"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="action-button delete" 
                      onClick={() => openModal('delete', admin)}
                      title="Delete user"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedAdmin && modalMode && (
        <AdminModal
          mode={modalMode}
          admin={selectedAdmin}
          onClose={closeModal}
          onEditSuccess={handleEditSuccess}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default AdminList; 