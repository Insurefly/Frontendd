import React, { useState, useEffect } from 'react';

interface StoredFlight {
  flightNumber: string;
  airline: {
    name: string;
    code: string;
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
}

export default function InsuredFlights() {
  const [insuredFlights, setInsuredFlights] = useState<StoredFlight[]>([]);

  useEffect(() => {
    // Load flights from localStorage
    const loadFlights = () => {
      const storedFlights = localStorage.getItem('insuredFlights');
      if (storedFlights) {
        setInsuredFlights(JSON.parse(storedFlights));
      }
    };

    // Initial load
    loadFlights();

    // Set up event listener for storage changes
    window.addEventListener('storage', loadFlights);

    return () => {
      window.removeEventListener('storage', loadFlights);
    };
  }, []);

  if (insuredFlights.length === 0) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <p className="text-center text-gray-500">No insured flights yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Insured Flights</h2>
      <div className="grid gap-4">
        {insuredFlights.map((flight, index) => (
          <div
            key={`${flight.flightNumber}-${flight.timestamp}`}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
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
            
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Insurance Amount: <span className="font-semibold">{flight.insuranceAmount} AVAX</span>
              </p>
              <p className="text-xs text-gray-500">
                Added on {new Date(flight.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}