// Simple demo page to show valve tokenization functionality
import React, { useState } from "react";

interface DemoProps {}

const ValveTokenizationDemo: React.FC<DemoProps> = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    serialNumber: "",
    type: "",
    manufacturer: "Emerson Process Management",
    model: "",
    diameter: "",
    pressure: "",
    temperature: "",
    material: "",
    connectionType: "",
    manufactureDate: "",
    warrantyMonths: "12"
  });

  const handleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setMessage("✅ Authenticated as Emerson Process Management");
      setIsLoading(false);
    }, 1000);
  };

  const handleTokenize = () => {
    if (!formData.serialNumber || !formData.type || !formData.model) {
      setMessage("❌ Please fill in required fields");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      const tokenId = "VLV" + Date.now();
      const valveId = "EMR-" + tokenId;
      setMessage(`🎉 Valve Tokenized Successfully!\n🪙 Token ID: ${tokenId}\n🔧 Valve ID: ${valveId}`);
      setIsLoading(false);
      
      // Reset form
      setFormData({
        ...formData,
        serialNumber: "",
        type: "",
        model: "",
        diameter: "",
        pressure: "",
        temperature: "",
        material: "",
        connectionType: "",
        manufactureDate: "",
        warrantyMonths: "12"
      });
    }, 2000);
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      backgroundColor: '#7C3AED',
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center' as const
    },
    section: {
      backgroundColor: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold'
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #D1D5DB',
      borderRadius: '4px',
      fontSize: '14px'
    },
    select: {
      width: '100%',
      padding: '8px',
      border: '1px solid #D1D5DB',
      borderRadius: '4px',
      fontSize: '14px'
    },
    button: {
      backgroundColor: '#7C3AED',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      marginRight: '10px'
    },
    buttonDisabled: {
      backgroundColor: '#9CA3AF',
      cursor: 'not-allowed'
    },
    message: {
      padding: '15px',
      borderRadius: '4px',
      marginBottom: '20px',
      whiteSpace: 'pre-line' as const,
      backgroundColor: message.includes('❌') ? '#FEE2E2' : '#D1FAE5',
      color: message.includes('❌') ? '#DC2626' : '#059669',
      border: `1px solid ${message.includes('❌') ? '#FECACA' : '#A7F3D0'}`
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '15px'
    },
    badge: {
      display: 'inline-block',
      backgroundColor: '#10B981',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      marginRight: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>🔧 ValveChain - Manufacturer Tokenization Portal</h1>
        <p>Tokenize new valves on the blockchain</p>
      </div>

      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}

      {!isAuthenticated ? (
        <div style={styles.section}>
          <h2>🔐 Manufacturer Authentication</h2>
          <p>Connect your wallet and authenticate as a verified manufacturer to begin tokenizing valves.</p>
          <button 
            style={{...styles.button, ...(isLoading ? styles.buttonDisabled : {})}} 
            onClick={handleAuth}
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "🔗 Connect Wallet & Authenticate"}
          </button>
        </div>
      ) : (
        <div style={styles.section}>
          <div style={{ marginBottom: '20px' }}>
            <h2>🏭 Valve Tokenization</h2>
            <span style={styles.badge}>✅ Authenticated: Emerson Process Management</span>
            <span style={styles.badge}>🆔 ID: mfg001</span>
          </div>

          <h3>📋 Basic Information</h3>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Serial Number *</label>
              <input
                style={styles.input}
                value={formData.serialNumber}
                onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                placeholder="Enter unique serial number"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Valve Type *</label>
              <select
                style={styles.select}
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="">Select valve type</option>
                <option value="gate">Gate Valve</option>
                <option value="ball">Ball Valve</option>
                <option value="globe">Globe Valve</option>
                <option value="butterfly">Butterfly Valve</option>
                <option value="check">Check Valve</option>
                <option value="needle">Needle Valve</option>
                <option value="plug">Plug Valve</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Manufacturer</label>
              <input
                style={{...styles.input, backgroundColor: '#F9FAFB'}}
                value={formData.manufacturer}
                readOnly
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Model *</label>
              <input
                style={styles.input}
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                placeholder="Enter model number"
              />
            </div>
          </div>

          <h3>⚙️ Technical Specifications</h3>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Diameter (inches)</label>
              <input
                style={styles.input}
                type="number"
                step="0.1"
                value={formData.diameter}
                onChange={(e) => setFormData({...formData, diameter: e.target.value})}
                placeholder="0.0"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Pressure Rating (PSI)</label>
              <input
                style={styles.input}
                type="number"
                value={formData.pressure}
                onChange={(e) => setFormData({...formData, pressure: e.target.value})}
                placeholder="0"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Temperature Rating (°C)</label>
              <input
                style={styles.input}
                type="number"
                value={formData.temperature}
                onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                placeholder="0"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Material</label>
              <input
                style={styles.input}
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
                placeholder="e.g., Stainless Steel 316"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Connection Type</label>
              <input
                style={styles.input}
                value={formData.connectionType}
                onChange={(e) => setFormData({...formData, connectionType: e.target.value})}
                placeholder="e.g., Flanged, Threaded"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Manufacture Date</label>
              <input
                style={styles.input}
                type="date"
                value={formData.manufactureDate}
                onChange={(e) => setFormData({...formData, manufactureDate: e.target.value})}
              />
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <button 
              style={{...styles.button, ...(isLoading ? styles.buttonDisabled : {})}} 
              onClick={handleTokenize}
              disabled={isLoading}
            >
              {isLoading ? "🔄 Tokenizing Valve..." : "🪙 Tokenize Valve"}
            </button>
            <button 
              style={{...styles.button, backgroundColor: '#6B7280'}} 
              onClick={() => {
                setFormData({
                  ...formData,
                  serialNumber: "",
                  type: "",
                  model: "",
                  diameter: "",
                  pressure: "",
                  temperature: "",
                  material: "",
                  connectionType: "",
                  manufactureDate: ""
                });
                setMessage("");
              }}
            >
              🔄 Reset Form
            </button>
          </div>
        </div>
      )}

      <div style={styles.section}>
        <h3>📝 Implementation Features</h3>
        <ul style={{ lineHeight: '1.6' }}>
          <li>✅ <strong>Frontend</strong>: Comprehensive valve tokenization form with validation</li>
          <li>✅ <strong>Backend API</strong>: Mock service layer with manufacturer authentication</li>
          <li>✅ <strong>Authentication</strong>: Wallet-based manufacturer verification</li>
          <li>✅ <strong>Validation</strong>: Client-side and server-side data validation</li>
          <li>✅ <strong>Testing</strong>: 19 comprehensive unit and integration tests</li>
          <li>✅ <strong>Error Handling</strong>: Robust error handling with user feedback</li>
          <li>✅ <strong>TypeScript</strong>: Full type safety with interfaces and validation</li>
          <li>✅ <strong>Security</strong>: Manufacturer permission checking and duplicate prevention</li>
        </ul>
      </div>
    </div>
  );
};

export default ValveTokenizationDemo;