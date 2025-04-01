import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAccounts, addAccount, deleteAccount, updateAccountPassword } from '../services/api';
import { 
  AlertMessage, 
  Button,
  Card, 
  DataTable, 
  FormField, 
  LoadingSpinner 
} from '../components';

const Accounts = () => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // State for password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [passwordFormData, setPasswordFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordFormErrors, setPasswordFormErrors] = useState({});

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await getAccounts();
      setAccounts(data);
      setError(null);
    } catch (err) {
      console.error(t('api.errors.fetchAccounts'), err);
      setError('api.errors.fetchAccounts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear the error for this field while typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email.trim()) {
      errors.email = 'accounts.emailRequired';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'accounts.invalidEmail';
    }
    
    if (!formData.password) {
      errors.password = 'accounts.passwordRequired';
    } else if (formData.password.length < 8) {
      errors.password = 'accounts.passwordLength';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'accounts.passwordsNotMatch';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await addAccount(formData.email, formData.password);
      setSuccessMessage('accounts.accountCreated');
      setFormData({
        email: '',
        password: '',
        confirmPassword: ''
      });
      fetchAccounts(); // Refresh the accounts list
    } catch (err) {
      console.error(t('api.errors.addAccount'), err);
      setError('api.errors.addAccount');
    }
  };

  const handleDelete = async (email) => {
    if (window.confirm(t('accounts.confirmDelete', { email }))) {
      try {
        await deleteAccount(email);
        setSuccessMessage('accounts.accountDeleted');
        fetchAccounts(); // Refresh the accounts list
      } catch (err) {
        console.error(t('api.errors.deleteAccount'), err);
        setError('api.errors.deleteAccount');
      }
    }
  };
  
  // Open password change modal for an account
  const handleChangePassword = (account) => {
    setSelectedAccount(account);
    setPasswordFormData({
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordFormErrors({});
    setShowPasswordModal(true);
  };
  
  // Close password change modal
  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setSelectedAccount(null);
  };
  
  // Handle input changes for password change form
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData({
      ...passwordFormData,
      [name]: value
    });
    
    // Clear the error for this field while typing
    if (passwordFormErrors[name]) {
      setPasswordFormErrors({
        ...passwordFormErrors,
        [name]: null
      });
    }
  };
  
  // Validate password change form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordFormData.newPassword) {
      errors.newPassword = 'accounts.passwordRequired';
    } else if (passwordFormData.newPassword.length < 8) {
      errors.newPassword = 'accounts.passwordLength';
    }
    
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      errors.confirmPassword = 'accounts.passwordsNotMatch';
    }
    
    setPasswordFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Submit password change
  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      await updateAccountPassword(selectedAccount.email, passwordFormData.newPassword);
      setSuccessMessage('accounts.passwordUpdated');
      handleClosePasswordModal(); // Close the modal
    } catch (err) {
      console.error(t('api.errors.updatePassword'), err);
      setError('api.errors.updatePassword');
    }
  };

  // Column definitions for accounts table
  const columns = [
    { key: 'email', label: 'accounts.email' },
    { key: 'storage', label: 'accounts.storage',
      render: (account) => account.storage ? (
        <div>
          <div>{account.storage.used} / {account.storage.total}</div>
          <div className="progress mt-1" style={{ height: '5px' }}>
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: account.storage.percent }} 
              aria-valuenow={parseInt(account.storage.percent)} 
              aria-valuemin="0" 
              aria-valuemax="100">
            </div>
          </div>
        </div>
      ) : 'N/A'
    },
    { key: 'actions', label: 'accounts.actions',
      render: (account) => (
        <div className="d-flex">
          <Button
            variant="primary"
            size="sm"
            icon="key"
            title={t('accounts.changePassword')}
            onClick={() => handleChangePassword(account)}
            className="me-2"
          />
          <Button
            variant="danger"
            size="sm"
            icon="trash"
            title={t('accounts.confirmDelete', { email: account.email })}
            onClick={() => handleDelete(account.email)}
          />
        </div>
      )
    }
  ];

  return (
    <div>
      <h2 className="mb-4">{t('accounts.title')}</h2>
      
      <AlertMessage type="danger" message={error} />
      <AlertMessage type="success" message={successMessage} />
      
      <div className="row">
        <div className="col-md-6">
          <Card title="accounts.newAccount" className="mb-4">
            <form onSubmit={handleSubmit} className="form-wrapper">
              <FormField
                type="email"
                id="email"
                name="email"
                label="accounts.email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="user@domain.com"
                error={formErrors.email}
                required
              />
              
              <FormField
                type="password"
                id="password"
                name="password"
                label="accounts.password"
                value={formData.password}
                onChange={handleInputChange}
                error={formErrors.password}
                required
              />
              
              <FormField
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                label="accounts.confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={formErrors.confirmPassword}
                required
              />
              
              <Button
                type="submit"
                variant="primary"
                text="accounts.addAccount"
              />
            </form>
          </Card>
        </div>
        
        <div className="col-md-6">
          <Card title="accounts.existingAccounts">
            <DataTable
              columns={columns}
              data={accounts}
              keyExtractor={(account) => account.email}
              loading={loading}
              emptyMessage="accounts.noAccounts"
            />
          </Card>
        </div>
      </div>
      
      {/* Password Change Modal */}
      {showPasswordModal && selectedAccount && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {t('accounts.changePassword')} - {selectedAccount.email}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleClosePasswordModal} 
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitPasswordChange}>
                  <FormField
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    label="accounts.newPassword"
                    value={passwordFormData.newPassword}
                    onChange={handlePasswordInputChange}
                    error={passwordFormErrors.newPassword}
                    required
                  />
                  
                  <FormField
                    type="password"
                    id="confirmPasswordModal"
                    name="confirmPassword"
                    label="accounts.confirmPassword"
                    value={passwordFormData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    error={passwordFormErrors.confirmPassword}
                    required
                  />
                </form>
                  
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={handleClosePasswordModal}
                    >
                      {t('common.cancel')}
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      {t('accounts.updatePassword')}
                    </button>
                  </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </div>
      )}
    </div>
  );
};

export default Accounts;