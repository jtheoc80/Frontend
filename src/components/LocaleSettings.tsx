import React, { useState } from 'react';
import { useLocale } from '../contexts/LocaleContext';

export const LocaleSettings: React.FC = () => {
  const { config, updateLocale, isLoading } = useLocale();
  const [tempConfig, setTempConfig] = useState(config);
  const [showSettings, setShowSettings] = useState(false);

  const handleSave = () => {
    updateLocale(tempConfig);
    setShowSettings(false);
  };

  const handleCancel = () => {
    setTempConfig(config);
    setShowSettings(false);
  };

  const timezones = [
    'America/New_York',
    'America/Chicago', 
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Moscow',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
    'UTC'
  ];

  const locales = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'fr-FR', name: 'Français (France)' },
    { code: 'de-DE', name: 'Deutsch (Deutschland)' },
    { code: 'es-ES', name: 'Español (España)' },
    { code: 'it-IT', name: 'Italiano (Italia)' },
    { code: 'ru-RU', name: 'Русский (Россия)' },
    { code: 'ja-JP', name: '日本語 (日本)' },
    { code: 'zh-CN', name: '中文 (中国)' }
  ];

  const currencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'RUB', 'CAD', 'AUD'
  ];

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '8px',
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#3182ce',
    color: 'white',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    border: '1px solid #e2e8f0',
    color: '#4a5568',
  };

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '90%',
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: '16px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '4px',
    fontWeight: 'bold',
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowSettings(true)}
        style={secondaryButtonStyle}
        title="Locale Settings"
      >
        🌐 {config.locale}
      </button>

      {showSettings && (
        <div style={modalStyle} onClick={(e) => e.target === e.currentTarget && handleCancel()}>
          <div style={modalContentStyle}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Locale Settings</h3>
            
            <div style={fieldStyle}>
              <label style={labelStyle}>Language/Region</label>
              <select
                value={tempConfig.locale}
                onChange={(e) => setTempConfig({ ...tempConfig, locale: e.target.value })}
                style={selectStyle}
              >
                {locales.map(locale => (
                  <option key={locale.code} value={locale.code}>
                    {locale.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Timezone</label>
              <select
                value={tempConfig.timezone}
                onChange={(e) => setTempConfig({ ...tempConfig, timezone: e.target.value })}
                style={selectStyle}
              >
                {timezones.map(tz => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Default Currency</label>
              <select
                value={tempConfig.currency}
                onChange={(e) => setTempConfig({ ...tempConfig, currency: e.target.value })}
                style={selectStyle}
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button onClick={handleCancel} style={secondaryButtonStyle}>
                Cancel
              </button>
              <button onClick={handleSave} style={primaryButtonStyle}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};