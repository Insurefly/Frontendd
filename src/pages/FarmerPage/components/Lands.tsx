import React, { useState, useEffect } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ethers } from "ethers";
import contractAbi from "../components/modals/abi.json";

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

type StoredFlight = {
  flight: Flight;
  insuranceAmount: string;
  timestamp: number;
  insuranceId: string;
};

const CONTRACT_ADDRESS = "0xDC57a3c6c72AD565a2A97F467c42b7a5EbEf042D";

const InsuredFlights = () => {
  const [flights, setFlights] = useState<StoredFlight[]>([]);
  const [claimedFlights, setClaimedFlights] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const loadStoredFlights = () => {
      try {
        const storedFlights = localStorage.getItem("insuredFlights");
        if (storedFlights) {
          const parsedFlights: StoredFlight[] = JSON.parse(storedFlights);
          const validatedFlights = parsedFlights.filter(
            (flight) => flight.insuranceId != null
          );
          setFlights(validatedFlights);
        }
      } catch (err) {
        console.error("Error loading flights:", err);
        setError("Failed to load flight data");
      }
    };

    loadStoredFlights();
  }, []);

  // Listen for the InsuranceCreated event to capture the insuranceId
  useEffect(() => {
    const listenToInsuranceCreatedEvent = async () => {
      if (!(window as any).ethereum) {
        console.error("No Web3 provider found");
        return;
      }

      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, provider);

      // Listener function to capture the emitted event
      const listener = (user: string, insuranceId: ethers.BigNumber) => {
        const insuranceIdString = insuranceId.toString(); // Convert BigNumber to string
        console.log("InsuranceCreated event captured:", insuranceIdString);

        // Retrieve stored flights from localStorage
        const storedFlights = JSON.parse(localStorage.getItem("insuredFlights") || "[]");

        // Add the new insurance data
        const newFlight = { user, insuranceId: insuranceIdString };
        storedFlights.push(newFlight);

        // Update localStorage and state
        localStorage.setItem("insuredFlights", JSON.stringify(storedFlights));
        setFlights(storedFlights);
      };

      // Add the event listener
      contract.on("InsuranceCreated", listener);

      // Cleanup the event listener when component unmounts
      return () => {
        contract.removeListener("InsuranceCreated", listener);
      };
    };

    listenToInsuranceCreatedEvent();
  }, []);

  // Handle claim request
  const handleClaim = async (storedFlight: StoredFlight) => {
    const { flight } = storedFlight;
    const insuranceId = 4;
    if (!insuranceId) {
      setError(`No insurance ID found for flight ${flight.flight.flightNumber}`);
      return;
    }

    setLoading((prev) => ({ ...prev, [flight.flight.flightNumber]: true }));
    setError(""); // Reset any previous error messages

    try {
      if (!(window as any).ethereum) {
        throw new Error("Web3 provider not found. Please install MetaMask.");
      }

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      await provider.send("eth_requestAccounts", []); // Request user accounts

      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractAbi.abi,
        signer
      );

      // Convert insuranceId from string to uint256 (BigNumber)
      console.log(insuranceId);
      // Check if the flight is already claimed
      if (claimedFlights.includes(flight.flight.flightNumber)) {
        setError(`Flight ${flight.flight.flightNumber} has already been claimed.`);
        return;
      }

      const tx = await contract.initiateClaimRequest(insuranceId, {
        gasLimit: 500000, // Adjust gas limit if needed
      });

      // Wait for the transaction to confirm (1 block)
      const receipt = await tx.wait(1);

      if (receipt.status === 1) {
        // Add to claimed flights dynamically
        setClaimedFlights((prev) => [...prev, flight.flight.flightNumber]);
        localStorage.setItem(
          "claimedFlights",
          JSON.stringify([...claimedFlights, flight.flight.flightNumber])
        );

        alert("Claim initiated successfully!");

        // Optionally update the UI to reflect the change dynamically
        setFlights((prevFlights) =>
          prevFlights.filter(
            (f) => f.flight.flight.flightNumber !== flight.flight.flightNumber
          )
        ); // Remove claimed flight from the list
      } else {
        throw new Error("Transaction failed.");
      }
    } catch (err: any) {
      console.error("Claim error:", err);

      const errorMessage =
        err.code === 4001
          ? "Transaction rejected by user"
          : "Failed to initiate claim. Please try again.";

      setError(errorMessage);
    } finally {
      setLoading((prev) => ({
        ...prev,
        [flight.flight.flightNumber]: false,
      }));
    }
  };

  if (flights.length === 0) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <p className="text-center text-gray-500 align-center justify-center">
          No insured flights found.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6 justify-center">
      <h2 className="text-2xl font-bold text-blue-600 align-center justify-center mt-4">
        Your Insured Flights
      </h2>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {flights.map((storedFlight) => {
          const { flight } = storedFlight;
          const isClaimed = claimedFlights.includes(flight.flight.flightNumber);
          const isProcessing = loading[flight.flight.flightNumber];
          const departureDate = new Date(flight.flight.departure.time);
          const arrivalDate = new Date(flight.flight.arrival.time);

          return (
            <div
              key={`${flight.flight.flightNumber}-${storedFlight.timestamp}`}
              className="bg-white rounded-xl shadow-sm border-2 border-gray-400 p-4 mx-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {flight.flight.airline.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Flight {flight.flight.flightNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">
                    Insurance ID: {storedFlight.insuranceId}
                  </p>
                  <p className="text-xs text-gray-500">
                    Amount: {storedFlight.insuranceAmount} ETH
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Departure
                  </p>
                  <p className="font-medium">
                    {flight.flight.departure.airport.name} (
                    {flight.flight.departure.airport.code})
                  </p>
                  <p className="text-sm text-gray-600">
                    {departureDate.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Arrival</p>
                  <p className="font-medium">
                    {flight.flight.arrival.airport.name} (
                    {flight.flight.arrival.airport.code})
                  </p>
                  <p className="text-sm text-gray-600">
                    {arrivalDate.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center my-4 text-gray-400">
                <span className="text-sm">
                  {flight.flight.departure.airport.code}
                </span>
                <ArrowRight className="mx-2" />
                <span className="text-sm">
                  {flight.flight.arrival.airport.code}
                </span>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleClaim(storedFlight)}
                  disabled={isClaimed || isProcessing}
                  className={`px-4 py-2 rounded-lg font-medium ${isClaimed
                      ? "bg-green-100 text-green-800 cursor-not-allowed"
                      : isProcessing
                        ? "bg-blue-100 text-blue-800 cursor-wait"
                        : "bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    }`}
                >
                  {isClaimed
                    ? "Claimed"
                    : isProcessing
                      ? "Processing..."
                      : "Make Claim"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsuredFlights;
