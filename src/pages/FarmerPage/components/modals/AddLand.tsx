import React, { useState, useEffect, createRef } from "react";
import { ethers } from "ethers";
import { X } from "lucide-react";
// import abi from "./abi.json";
import flightsData from "./flights.json";

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

interface AddFlightProps {
  onClose: () => void;
}

export default function AddFlight({ onClose }: AddFlightProps) {
  const [flights, setFlights] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [filteredFlights, setFilteredFlights] = useState<any[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const insuranceAmountRef = createRef<HTMLInputElement>();

  const contractAddress = "YOUR_CONTRACT_ADDRESS";

  useEffect(() => {
    const uniqueCities = Array.from(
      new Set(flightsData.map((item) => item.flight.departure.airport.city))
    );
    setCities(uniqueCities);
    setFlights(flightsData);
  }, []);

  const handleCitySelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value;
    setSelectedCity(city);
    const filtered = flights.filter(
      (flight) => flight.flight.departure.airport.city === city
    );
    setFilteredFlights(filtered);
    setSelectedFlight(null);
  };

  const handleFlightSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = JSON.parse(event.target.value);
    setSelectedFlight(selected);
  };

  const storeFlightDetails = (flightDetails: any, insuranceAmount: string) => {
    const storedFlight: StoredFlight = {
      flightNumber: flightDetails.flight.flightNumber,
      airline: {
        name: flightDetails.flight.airline.name,
        code: flightDetails.flight.airline.code,
      },
      departure: {
        airport: {
          name: flightDetails.flight.departure.airport.name,
          code: flightDetails.flight.departure.airport.code,
        },
        time: flightDetails.flight.departure.time,
      },
      arrival: {
        airport: {
          name: flightDetails.flight.arrival.airport.name,
          code: flightDetails.flight.arrival.airport.code,
        },
        time: flightDetails.flight.arrival.time,
      },
      insuranceAmount,
      timestamp: Date.now(),
    };

    const existingFlights = JSON.parse(localStorage.getItem('insuredFlights') || '[]');
    localStorage.setItem('insuredFlights', JSON.stringify([...existingFlights, storedFlight]));
  };

  async function addFlight(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFlight) {
      alert("Please select a flight.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const insuranceAmount = insuranceAmountRef.current?.value || "0";
      const parsedAmount = ethers.utils.parseEther(insuranceAmount);
      
      const estimatedGas = await contract.estimateGas.addFlight(
        selectedFlight.flight.flightNumber,
        new Date(selectedFlight.flight.departure.time).getTime(),
        new Date(selectedFlight.flight.arrival.time).getTime(),
        parsedAmount
      );

      const tx = await contract.addFlight(
        selectedFlight.flight.flightNumber,
        new Date(selectedFlight.flight.departure.time).getTime(),
        new Date(selectedFlight.flight.arrival.time).getTime(),
        parsedAmount,
        { gasLimit: estimatedGas.mul(11).div(10) }
      );

      await tx.wait(1);
      
      // Store flight details in localStorage after successful transaction
      storeFlightDetails(selectedFlight, insuranceAmount);
      
      alert("Flight insurance added successfully!");
      
      // Reset form
      setSelectedCity("");
      setSelectedFlight(null);
      setFilteredFlights([]);
      if (insuranceAmountRef.current) {
        insuranceAmountRef.current.value = "";
      }
    } catch (error) {
      console.error("Error adding flight:", error);
      alert("Failed to add flight insurance. Please try again.");
    }
  }

  return (
    <div className="relative flex min-w-[50%] flex-col overflow-hidden rounded-2xl bg-gray-100">
      <div className="relative mb-10 bg-blue-600 py-6">
        <h2 className="text-center font-semibold text-3xl text-white">
          Add Flight Insurance
        </h2>
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-white hover:bg-blue-500 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
      </div>
      
      <form onSubmit={addFlight} className="flex flex-col gap-y-8 px-8 pb-8">
        {/* City Selection */}
        <div className="flex flex-col">
          <h2 className="font-semibold mb-2">Choose Departure City</h2>
          <select
            onChange={handleCitySelection}
            required
            value={selectedCity}
            className="w-full rounded-lg border border-solid border-gray-300 px-4 py-2"
          >
            <option value="">Select a city</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Flight Selection */}
        {filteredFlights.length > 0 && (
          <div className="flex flex-col">
            <h2 className="font-semibold mb-2">Choose Flight</h2>
            <select
              onChange={handleFlightSelection}
              required
              className="w-full rounded-lg border border-solid border-gray-300 px-4 py-2"
            >
              <option value="">Select a flight</option>
              {filteredFlights.map((flight, index) => (
                <option key={index} value={JSON.stringify(flight)}>
                  {`${flight.flight.flightNumber} - ${flight.flight.airline.name} (${flight.flight.departure.airport.code} → ${flight.flight.arrival.airport.code})`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Flight Details */}
        {selectedFlight && (
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-bold text-xl mb-2">{selectedFlight.flight.flightNumber}</h3>
            <p>
              <strong>Airline:</strong> {selectedFlight.flight.airline.name} ({selectedFlight.flight.airline.code})
            </p>
            <p>
              <strong>Departure:</strong> {selectedFlight.flight.departure.airport.name} (
              {selectedFlight.flight.departure.airport.code}),{" "}
              {new Date(selectedFlight.flight.departure.time).toLocaleString()}
            </p>
            <p>
              <strong>Arrival:</strong> {selectedFlight.flight.arrival.airport.name} (
              {selectedFlight.flight.arrival.airport.code}),{" "}
              {new Date(selectedFlight.flight.arrival.time).toLocaleString()}
            </p>
          </div>
        )}

        {/* Insurance Amount */}
        <div className="flex flex-col">
          <h2 className="font-semibold mb-2">Insurance Amount (AVAX)</h2>
          <input
            ref={insuranceAmountRef}
            required
            step="0.01"
            min="0.01"
            type="number"
            placeholder="Enter insurance amount in AVAX"
            className="w-full rounded-lg border border-solid border-gray-300 px-4 py-2"
          />
        </div>
        <button className="btn w-max self-center rounded-md bg-blue-600 px-4 py-2 text-white shadow duration-300 hover:brightness-110">
          Submit
        </button>
      </form>
    </div>
  );
}