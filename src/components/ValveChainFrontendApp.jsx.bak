import React, { useState } from 'react';
import { ethers } from 'ethers';

// Import the ABI of the deployed ValveChain contract.  You need to
// generate this JSON artifact (e.g., using Hardhat or Remix) and place it
// alongside this component.  The ABI is necessary for ethers.js to
// construct a contract interface.
import ValveChainArtifact from './ValveChain.json';

// TODO: replace with the actual deployed contract address on your test
// network or Hyperledger front‑end gateway.
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * A minimal React component demonstrating how to connect to MetaMask,
 * initialize the ValveChain contract interface, and invoke its methods.
 * This skeleton is intended as a starting point for building a richer UI.
 */
function ValveChainApp() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState('');

  // Form state for registering a valve
  const [serialNumber, setSerialNumber] = useState('');
  const [location, setLocation] = useState('');
  const [manufactureDate, setManufactureDate] = useState('');
  const [manufacturerAddress, setManufacturerAddress] = useState('');

  // Form state for recording maintenance
  const [maintenanceSerial, setMaintenanceSerial] = useState('');
  const [maintenanceTimestamp, setMaintenanceTimestamp] = useState('');
  const [maintenanceDescription, setMaintenanceDescription] = useState('');
  const [maintenancePerformedBy, setMaintenancePerformedBy] = useState('');

  /**
   * Connect to the user's Ethereum wallet (e.g., MetaMask) and set up the
   * contract interface.  On permissioned networks you may replace this
   * functionality with an appropriate gateway SDK.
   */
  async function connectWallet() {
    if (!window.ethereum) {
      alert('Please install a Web3 wallet like MetaMask to use this dApp.');
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      const valveChain = new ethers.Contract(
        CONTRACT_ADDRESS,
        ValveChainArtifact.abi,
        signer
      );
      setAccount(addr);
      setContract(valveChain);
      setStatus(`Connected as ${addr}`);
    } catch (err) {
      console.error(err);
      setStatus('Connection failed.');
    }
  }

  /**
   * Call the registerValve function on the smart contract.  Only callers
   * with the MANUFACTURER role will succeed; otherwise the transaction
   * reverts.  manufactureDate must be provided as a Unix timestamp.
   */
  async function handleRegisterValve(event) {
    event.preventDefault();
    if (!contract) {
      alert('Connect your wallet first.');
      return;
    }
    try {
      const tx = await contract.registerValve(
        serialNumber,
        location,
        Number(manufactureDate),
        manufacturerAddress
      );
      setStatus('Registering valve… waiting for confirmation.');
      await tx.wait();
      setStatus('Valve registered successfully.');
    } catch (err) {
      console.error(err);
      setStatus('Valve registration failed. See console for details.');
    }
  }

  /**
   * Call the recordMaintenance function on the smart contract.  Only
   * callers with the MAINTENANCE role can successfully record events.
   */
  async function handleRecordMaintenance(event) {
    event.preventDefault();
    if (!contract) {
      alert('Connect your wallet first.');
      return;
    }
    try {
      const tx = await contract.recordMaintenance(
        maintenanceSerial,
        Number(maintenanceTimestamp),
        maintenanceDescription,
        maintenancePerformedBy
      );
      setStatus('Recording maintenance… waiting for confirmation.');
      await tx.wait();
      setStatus('Maintenance recorded successfully.');
    } catch (err) {
      console.error(err);
      setStatus('Maintenance recording failed. See console for details.');
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>ValveChain dApp</h1>
      <button onClick={connectWallet} disabled={!!account}>
        {account ? `Connected: ${account}` : 'Connect Wallet'}
      </button>
      <p>{status}</p>

      <hr />
      <h2>Register Valve</h2>
      <form onSubmit={handleRegisterValve}>
        <div>
          <label>Serial Number: </label>
          <input value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} required />
        </div>
        <div>
          <label>Location: </label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <div>
          <label>Manufacture Date (timestamp): </label>
          <input
            type="number"
            value={manufactureDate}
            onChange={(e) => setManufactureDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Manufacturer Address: </label>
          <input
            value={manufacturerAddress}
            onChange={(e) => setManufacturerAddress(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register Valve</button>
      </form>

      <hr />
      <h2>Record Maintenance</h2>
      <form onSubmit={handleRecordMaintenance}>
        <div>
          <label>Valve Serial: </label>
          <input
            value={maintenanceSerial}
            onChange={(e) => setMaintenanceSerial(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Timestamp: </label>
          <input
            type="number"
            value={maintenanceTimestamp}
            onChange={(e) => setMaintenanceTimestamp(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description: </label>
          <input
            value={maintenanceDescription}
            onChange={(e) => setMaintenanceDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Performed By: </label>
          <input
            value={maintenancePerformedBy}
            onChange={(e) => setMaintenancePerformedBy(e.target.value)}
            required
          />
        </div>
        <button type="submit">Record Maintenance</button>
      </form>
    </div>
  );
}

export default ValveChainApp;