import React from 'react';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from './LoadingSpinner';
import Button from './Button';

/**
 * Reusable data table component
 * @param {Object} props Component props
 * @param {Array} props.columns Array of column definitions with {key, label} objects
 * @param {Array} props.data Array of data objects to display
 * @param {function} props.keyExtractor Function to extract unique key from data item
 * @param {boolean} props.loading Whether data is loading
 * @param {string} props.emptyMessage Message to show when data is empty (translation key)
 * @param {function} props.renderRow Custom row rendering function (optional)
 */
const DataTable = ({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyMessage = 'common.noData',
  renderRow
}) => {
  const { t } = useTranslation();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="alert alert-info">
        {t(emptyMessage)}
      </div>
    );
  }
  
  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.key}>{t(column.label)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderRow 
            ? data.map((item, index) => renderRow(item, index))
            : data.map(item => (
                <tr key={keyExtractor(item)}>
                  {columns.map(column => (
                    <td key={`${keyExtractor(item)}-${column.key}`}>
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;