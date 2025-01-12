import React, { useState, useEffect, createRef } from "react";
import { X } from "lucide-react";
import { ethers } from "ethers";
import contractAbi from "./abi.json";
import flightsData from "./flights.json";

declare global {
  interface Window {
    ethereum: any;
  }
}
export {};

type Flight = {
  flight: {
    flightNumber: string;
    airline: {
      code: string;
      name: string;
    };
    departure: {
      airport: {
        code: string;
        name: string;
        city: string;
        country: string;
      };
      time: string;
    };
    arrival: {
      airport: {
        code: string;
        name: string;
        city: string;
        country: string;
      };
      time: string;
    };
    status: string;
    delay: string;
  };
};

interface StoredFlight {
  flight: Flight;
  insuranceAmount: string;
  timestamp: number;
  insuranceId: string;
}

interface AddFlightProps {
  onClose: () => void;
  onFlightAdded?: (flight: StoredFlight) => void;
  onInsuranceIdReceived?: (insuranceId: string) => void;
}

const contractAddress = "0xDC57a3c6c72AD565a2A97F467c42b7a5EbEf042D";

export default function AddFlight({ onClose, onFlightAdded, onInsuranceIdReceived }: AddFlightProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const insuranceAmountRef = createRef<HTMLInputElement>();

  useEffect(() => {
    const uniqueCities = Array.from(
      new Set(
        flightsData.map((flight) => flight.flight?.departure?.airport?.city)
      )
    ).filter((city) => city);
    setCities(uniqueCities);
    setFlights(flightsData);
  }, [flightsData]);

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
    const selected = JSON.parse(event.target.value) as Flight;
    setSelectedFlight(selected);
  };

  async function addFlight(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFlight || isProcessing) return;
  
    setIsProcessing(true);
    console.log("Starting flight addition process...");
  
    try {
      const insuranceAmount = insuranceAmountRef.current?.value || "0";
      const parsedAmount = ethers.utils.parseEther(insuranceAmount);
  
      const flightDetails = selectedFlight;
  
      console.log("Sending transaction with details:", {
        insuranceAmount,
        flight: flightDetails,
      });
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
  
      const userAddress = await signer.getAddress(); // _user
      const flightNumber = selectedFlight.flight.flightNumber; // _flightNumber
      const airlineCode = selectedFlight.flight.airline.code; // _airlineCode
      const airlineName = selectedFlight.flight.airline.name; // _airlineName
      const departureAirportCode = selectedFlight.flight.departure.airport.code; // _departureAirportCode
      const departureAirportName = selectedFlight.flight.departure.airport.name; // _departureAirportName
      const departureDateAndTime = selectedFlight.flight.departure.time; // _departureDateAndTime
      const arrivalAirportCode = selectedFlight.flight.arrival.airport.code; // _arrivalAirportCode
      const arrivalAirportName = selectedFlight.flight.arrival.airport.name; // _arrivalAirportName
      const arrivalDateAndTime = selectedFlight.flight.arrival.time; // _arrivalDateAndTime
  
      // Manually set a gas limit
      const gasLimit = 1000000; // Adjust this value based on your contract's requirements
  
      // Call the createInsurance function with the gathered parameters and gas limit
      const tx = await contract.createInsurance(
        userAddress,
        parsedAmount,
        flightNumber,
        airlineCode,
        airlineName,
        departureAirportCode,
        departureAirportName,
        departureDateAndTime,
        arrivalAirportCode,
        arrivalAirportName,
        arrivalDateAndTime,
        { gasLimit }
      );
  
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);
  
      // Extract insuranceId from the event logs
      const insuranceId = receipt.events?.find(
        (event: any) => event.event === "InsuranceCreated"
      )?.args?.insuranceId;
  
      if (!insuranceId) {
        throw new Error("Insurance ID not found in the transaction receipt.");
      }
  
      // Convert insuranceId to string and store it in localStorage
      const insuranceIdString = insuranceId.toString();
  
      // Call the callback function to send insuranceId to parent component
      if (onInsuranceIdReceived && insuranceIdString) {
        onInsuranceIdReceived(insuranceIdString);
      }
  
      // Create stored flight object
      const storedFlight: StoredFlight = {
        flight: flightDetails,
        insuranceAmount,
        timestamp: Date.now(),
        insuranceId: insuranceIdString,
      };
  
      // Update localStorage
      const existingFlights = JSON.parse(localStorage.getItem("insuredFlights") || "[]");
      const updatedFlights = [...existingFlights, storedFlight];
      localStorage.setItem("insuredFlights", JSON.stringify(updatedFlights));
      console.log("Updated flights in localStorage:", updatedFlights);
  
      // Callback to notify the parent component
      if (onFlightAdded) {
        onFlightAdded(storedFlight);
      }
  
      alert("Flight insurance added successfully!");
      onClose();
    } catch (error: any) {
      console.error("Error adding flight insurance:", error);
      alert(
        error.code === "INSUFFICIENT_FUNDS"
          ? "Insufficient funds for the transaction."
          : "Failed to add flight insurance. Check console for details."
      );
    } finally {
      setIsProcessing(false);
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
          disabled={isProcessing}
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={addFlight} className="flex flex-col gap-y-8 px-8 pb-8">
        <div className="flex flex-col">
          <h2 className="font-semibold mb-2">Choose Departure City</h2>
          <select
            onChange={handleCitySelection}
            required
            value={selectedCity}
            className="w-full rounded-lg border border-solid border-gray-300 px-4 py-2"
            disabled={isProcessing}
          >
            <option value="">Select a city</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {filteredFlights.length > 0 && (
          <div className="flex flex-col">
            <h2 className="font-semibold mb-2">Choose Flight</h2>
            <select
              onChange={handleFlightSelection}
              required
              className="w-full rounded-lg border border-solid border-gray-300 px-4 py-2"
              disabled={isProcessing}
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

        <div className="flex flex-col">
          <h2 className="font-semibold mb-2">Insurance Amount (ETH)</h2>
          <input
            ref={insuranceAmountRef}
            required
            step="0.01"
            min="0.01"
            type="number"
            placeholder="Enter insurance amount in ETH"
            className="w-full rounded-lg border border-solid border-gray-300 px-4 py-2"
            disabled={isProcessing}
          />
        </div>

        <button
          type="submit"
          className="btn w-max self-center rounded-md bg-blue-600 px-4 py-2 text-white shadow duration-300 hover:brightness-110 disabled:opacity-50"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
}