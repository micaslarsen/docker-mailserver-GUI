import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).then(() => {
      setCurrentLang(lng);
    });
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-sm btn-outline-light dropdown-toggle"
        type="button"
        id="languageDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ height: '32px' }}
      >
        <i className="bi bi-translate me-1"></i>
        {currentLang === 'pl' ? 'PL' : 'EN'}
      </button>
      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
        <li>
          <button
            className={`dropdown-item ${currentLang === 'en' ? 'active' : ''}`}
            type="button"
            onClick={() => changeLanguage('en')}
          >
            {t('language.en')}
          </button>
        </li>
        <li>
          <button
            className={`dropdown-item ${currentLang === 'pl' ? 'active' : ''}`}
            type="button"
            onClick={() => changeLanguage('pl')}
          >
            {t('language.pl')}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSwitcher;