from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
import json

load_dotenv()

app = FastAPI(title="ValveChain Blockchain API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:8080", "http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ContractCall(BaseModel):
    method: str
    params: Optional[dict] = {}

class TransactionRequest(BaseModel):
    to: str
    data: str
    value: Optional[str] = "0"

class ValveData(BaseModel):
    valve_id: str
    status: str
    location: str
    last_maintenance: Optional[str] = None

# Configuration from environment variables
RPC_URL = os.getenv("RPC_URL", "http://localhost:8545")
PRIVATE_KEY = os.getenv("PRIVATE_KEY", "")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", "")

# Sample blockchain data for demo
sample_blockchain_valves = [
    {
        "valve_id": "V001",
        "contract_address": "0x1234567890123456789012345678901234567890",
        "status": "ACTIVE",
        "location": "Plant A - Section 1",
        "last_maintenance": "2024-01-15",
        "on_chain": True
    },
    {
        "valve_id": "V002", 
        "contract_address": "0x2345678901234567890123456789012345678901",
        "status": "MAINTENANCE",
        "location": "Plant B - Section 2",
        "last_maintenance": "2024-01-10",
        "on_chain": True
    }
]

@app.get("/")
async def root():
    return {"message": "ValveChain Blockchain API", "status": "running"}

@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "service": "FastAPI Blockchain Service",
        "rpc_configured": bool(RPC_URL),
        "contract_configured": bool(CONTRACT_ADDRESS)
    }

@app.get("/blockchain/valves")
async def get_blockchain_valves():
    """Get all valves stored on blockchain"""
    return {"valves": sample_blockchain_valves, "total": len(sample_blockchain_valves)}

@app.get("/blockchain/valve/{valve_id}")
async def get_valve_by_id(valve_id: str):
    """Get specific valve data from blockchain"""
    valve = next((v for v in sample_blockchain_valves if v["valve_id"] == valve_id), None)
    if not valve:
        raise HTTPException(status_code=404, detail="Valve not found")
    return valve

@app.post("/blockchain/valve")
async def create_valve_on_chain(valve_data: ValveData):
    """Create a new valve record on blockchain"""
    # In a real implementation, this would interact with the smart contract
    new_valve = {
        "valve_id": valve_data.valve_id,
        "contract_address": f"0x{hash(valve_data.valve_id) % (16**40):040x}",
        "status": valve_data.status,
        "location": valve_data.location,
        "last_maintenance": valve_data.last_maintenance,
        "on_chain": True
    }
    sample_blockchain_valves.append(new_valve)
    return {"success": True, "valve": new_valve, "transaction_hash": f"0x{hash(str(new_valve)) % (16**64):064x}"}

@app.put("/blockchain/valve/{valve_id}/status")
async def update_valve_status(valve_id: str, status: str):
    """Update valve status on blockchain"""
    valve = next((v for v in sample_blockchain_valves if v["valve_id"] == valve_id), None)
    if not valve:
        raise HTTPException(status_code=404, detail="Valve not found")
    
    valve["status"] = status
    return {
        "success": True,
        "valve_id": valve_id,
        "new_status": status,
        "transaction_hash": f"0x{hash(f'{valve_id}{status}') % (16**64):064x}"
    }

@app.get("/blockchain/contract/info")
async def get_contract_info():
    """Get smart contract information"""
    return {
        "contract_address": CONTRACT_ADDRESS,
        "network": "localhost" if "localhost" in RPC_URL else "mainnet",
        "rpc_url": RPC_URL,
        "connected": bool(CONTRACT_ADDRESS and RPC_URL)
    }

@app.post("/blockchain/contract/call")
async def call_contract_method(call_data: ContractCall):
    """Call a smart contract method"""
    # Simulate contract call response
    response_data = {
        "method": call_data.method,
        "params": call_data.params,
        "result": f"Mock result for {call_data.method}",
        "transaction_hash": f"0x{hash(str(call_data.dict())) % (16**64):064x}",
        "gas_used": 21000
    }
    return response_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("FASTAPI_PORT", 8000)))