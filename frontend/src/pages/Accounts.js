import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAccounts, addAccount, deleteAccount } from '../services/api';
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

  // Column definitions for accounts table
  const columns = [
    { key: 'email', label: 'accounts.email' },
    { key: 'status', label: 'accounts.status', 
      render: (account) => (
        <span className={`badge bg-${account.active ? 'success' : 'danger'}`}>
          {account.active ? t('accounts.status.active') : t('accounts.status.inactive')}
        </span>
      )
    },
    { key: 'actions', label: 'accounts.actions',
      render: (account) => (
        <Button
          variant="danger"
          size="sm"
          icon="trash"
          onClick={() => handleDelete(account.email)}
        />
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
    </div>
  );
};

export default Accounts;