import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import MaterialIcon from "../../../common/MaterialIcon";
import contractAbi from "../components/modals/abi.json";

// Contract Address
const CONTRACT_ADDRESS = "0x607B5b424EaDA87AB7D4Af72D1c0463C3d19305e";

export default function InsuredFlights() {
  const [insuredFlights, setInsuredFlights] = useState<StoredFlight[]>([]);
  const [claimedFlights, setClaimedFlights] = useState<string[]>([]);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // Initialize Contract and Load Flights
  useEffect(() => {
    async function initializeContractAndLoadFlights() {
      try {
        // Check for Web3 provider
        if (!(window as any).ethereum) {
          throw new Error("Web3 provider not found. Please install MetaMask.");
        }

        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);

        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS, 
          contractAbi.abi,
          signer
        );

        setContract(contractInstance);

        // Load Flights
        const storedFlights = localStorage.getItem('insuredFlights');
        const storedClaimedFlights = localStorage.getItem('claimedFlights');
        
        if (storedFlights) {
          setInsuredFlights(JSON.parse(storedFlights));
        }
        
        if (storedClaimedFlights) {
          setClaimedFlights(JSON.parse(storedClaimedFlights));
        }
      } catch (error) {
        console.error("Initialization Error:", error);
      }
    }

    initializeContractAndLoadFlights();
  }, []);
  

  // Initiate Claim Request
  const handleMakeClaim = async (flight: StoredFlight) => {
    if (!contract) {
      alert("Contract not initialized");
      return;
    }

    try {
      // Validate insurance ID
      if (!flight.insuranceId) {
        throw new Error("No insurance ID found for this flight");
      }

      // Convert insurance ID to BigNumber
      const insuranceId = ethers.BigNumber.from(flight.insuranceId);

      // Prepare transaction
      const tx = await contract.initiateClaimRequest(
        insuranceId,
        { gasLimit: ethers.utils.hexlify(500000) }
      );

      // Wait for confirmation
      const receipt = await tx.wait(1);

      if (receipt.status === 1) {
        // Update claimed flights
        const updatedClaimedFlights = [...claimedFlights, flight.flightNumber];
        setClaimedFlights(updatedClaimedFlights);
        
        // Persist claimed flights
        localStorage.setItem('claimedFlights', JSON.stringify(updatedClaimedFlights));

        alert("Claim initiated successfully!");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error: any) {
      console.error("Claim Initiation Error:", {
        message: error.message,
        code: error.code,
        stack: error.stack
      });

      // Specific error handling
      if (error.code === 4001) {
        alert("Transaction was rejected by user.");
      } else {
        alert(`Failed to initiate claim: ${error.message}`);
      }
    }
  };

  if (insuredFlights.length === 0) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <p className="text-center text-gray-500">No insured flights yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 align-center justify-self-center text-blue-500 mt-4">Your Insured Flights</h2>
      <div className="grid gap-4">
        {insuredFlights.map((flight, index) => {
          // Check if this flight has been claimed
          const isClaimed = claimedFlights.includes(flight.flightNumber);
          
          return (
            <div
              key={`${flight.flightNumber}-${flight.timestamp}`}
              className="bg-white rounded-lg shadow-sm p-4 border-2 border-gray-200 text-blue-600"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{flight.airline.name}</h3>
                <span className="text-sm text-gray-500">
                  Flight {flight.flightNumber}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Departure</p>
                  <p className="font-medium">{flight.departure.airport.name} ({flight.departure.airport.code})</p>
                  <p className="text-sm text-gray-600">
                    {new Date(flight.departure.time).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Arrival</p>
                  <p className="font-medium">{flight.arrival.airport.name} ({flight.arrival.airport.code})</p>
                  <p className="text-sm text-gray-600">
                    {new Date(flight.arrival.time).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    Insurance Amount: <span className="font-semibold">{flight.insuranceAmount} AVAX</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Added on {new Date(flight.timestamp).toLocaleDateString()}
                  </p>
                  {/* Debug: Show Insurance ID */}
                  <p className="text-xs text-gray-500">
                    Insurance ID: {flight.insuranceId || 'Not Available'}
                  </p>
                </div>
                
                <button
                  onClick={() => handleMakeClaim(flight)}
                  disabled={isClaimed || !flight.insuranceId}
                  className={`
                    px-4 py-2 rounded-md transition-colors
                    ${isClaimed 
                      ? 'bg-blue-500 text-white cursor-not-allowed' 
                      : (!flight.insuranceId 
                        ? 'bg-red-500 text-gray-100 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-800')
                    }
                  `}
                >
                  {isClaimed 
                    ? 'Claimed' 
                    : 'Make Claim'
                  }
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Type for stored flight
interface StoredFlight {
  flightNumber: string;
  airline: {
    name: string;
  };
  departure: {
    airport: {
      name: string;
      code: string;
    };
    time: string;
  };
  arrival: {
    airport: {
      name: string;
      code: string;
    };
    time: string;
  };
  insuranceAmount: string;
  timestamp: number;
  insuranceId: string; // Ensure this is present
}