import React from 'react';

export const StatCard = ({ title, value, icon: Icon, colorScheme = 'primary', subtitle }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${colorScheme}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
