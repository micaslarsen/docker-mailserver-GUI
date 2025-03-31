import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <div className="sidebar">
      <NavLink to="/" className={({ isActive }) => 
        `sidebar-link ${isActive ? 'active' : ''}`
      } end>
        <i className="bi bi-speedometer2"></i> {t('sidebar.dashboard')}
      </NavLink>
      <NavLink to="/accounts" className={({ isActive }) => 
        `sidebar-link ${isActive ? 'active' : ''}`
      }>
        <i className="bi bi-person-circle"></i> {t('sidebar.emailAccounts')}
      </NavLink>
      <NavLink to="/aliases" className={({ isActive }) => 
        `sidebar-link ${isActive ? 'active' : ''}`
      }>
        <i className="bi bi-arrow-left-right"></i> {t('sidebar.aliases')}
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => 
        `sidebar-link ${isActive ? 'active' : ''}`
      }>
        <i className="bi bi-gear-fill"></i> {t('sidebar.settings')}
      </NavLink>
    </div>
  );
};

export default Sidebar;