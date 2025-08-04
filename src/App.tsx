import React, { useState } from "react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import ManufacturerPanel from "./components/Roles/Manufacturer Panel.tsx";
import RepairPanel from "./components/Roles/Repair Panel.tsx";
import PlantPanel from "./components/Roles/Plant Panel.tsx";

function App() {
  const [currentTab, setCurrentTab] = useState('manufacturer');

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#F3F4F6'
    },
    header: {
      backgroundColor: '#7C3AED',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap' as const
    },
    nav: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap' as const
    },
    navButton: {
      backgroundColor: 'transparent',
      color: 'white',
      border: '1px solid rgba(255,255,255,0.3)',
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    activeNavButton: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      border: '1px solid white'
    }
  };

  return (
    <ChakraProvider value={defaultSystem}>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
            🔧 ValveChain Dashboard
          </h1>
          <nav style={styles.nav}>
            <button 
              style={{
                ...styles.navButton,
                ...(currentTab === 'inventory' ? styles.activeNavButton : {})
              }}
              onClick={() => setCurrentTab('inventory')}
            >
              📊 Valve Inventory
            </button>
            <button 
              style={{
                ...styles.navButton,
                ...(currentTab === 'manufacturer' ? styles.activeNavButton : {})
              }}
              onClick={() => setCurrentTab('manufacturer')}
            >
              🏭 Manufacturer
            </button>
            <button 
              style={{
                ...styles.navButton,
                ...(currentTab === 'repairs' ? styles.activeNavButton : {})
              }}
              onClick={() => setCurrentTab('repairs')}
            >
              🔧 Repairs
            </button>
            <button 
              style={{
                ...styles.navButton,
                ...(currentTab === 'history' ? styles.activeNavButton : {})
              }}
              onClick={() => setCurrentTab('history')}
            >
              📜 History
            </button>
            <button 
              style={{
                ...styles.navButton,
                ...(currentTab === 'repair' ? styles.activeNavButton : {})
              }}
              onClick={() => setCurrentTab('repair')}
            >
              🔧 Repair
            </button>
            <button 
              style={{
                ...styles.navButton,
                ...(currentTab === 'plant' ? styles.activeNavButton : {})
              }}
              onClick={() => setCurrentTab('plant')}
            >
              🏭 Plant
            </button>
          </nav>
        </header>

        {/* Main Content */}
        <main>
          {currentTab === 'manufacturer' && <ManufacturerPanel />}
          {currentTab === 'inventory' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>📊 Valve Inventory</h2>
              <p>This would show the valve inventory table (see existing ValveTable component)</p>
            </div>
          )}
          {currentTab === 'repairs' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>🔧 Repairs Panel</h2>
              <p>Coming Soon - Repair management functionality</p>
            </div>
          )}
          {currentTab === 'history' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>📜 Valve History</h2>
              <p>Coming Soon - Valve history tracking</p>
            </div>
          )}
          {currentTab === 'repair' && (
            <div style={{ padding: '2rem' }}>
              <RepairPanel />
            </div>
          )}
          {currentTab === 'plant' && (
            <div style={{ padding: '2rem' }}>
              <PlantPanel />
            </div>
          )}
        </main>
      </div>
    </ChakraProvider>
  );
}

export default App;