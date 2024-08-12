import { useState } from "react";

const InputForm = ({ onSubmit }) => {
  const [numProcesses, setNumProcesses] = useState("");
  const [burstTimes, setBurstTimes] = useState([""]);
  const [arrivalTimes, setArrivalTimes] = useState([""]);
  const [quantum, setQuantum] = useState("");

  const handleNumProcessesChange = (e) => {
    const value = e.target.value;
    setNumProcesses(value);
    setBurstTimes(Array(parseInt(value)).fill(""));
    setArrivalTimes(Array(parseInt(value)).fill(""));
  };

  const handleBurstTimeChange = (index, value) => {
    const newBurstTimes = [...burstTimes];
    newBurstTimes[index] = value;
    setBurstTimes(newBurstTimes);
  };

  const handleArrivalTimeChange = (index, value) => {
    const newArrivalTimes = [...arrivalTimes];
    newArrivalTimes[index] = value;
    setArrivalTimes(newArrivalTimes);
  };

  const handleQuantumChange = (e) => setQuantum(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      numProcesses: parseInt(numProcesses),
      burstTimes: burstTimes.map(Number),
      arrivalTimes: arrivalTimes.map(Number),
      quantum: parseInt(quantum),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-4 rounded shadow mb-8"
    >
      <div className="mb-4">
        <label
          htmlFor="numProcesses"
          className="block text-sm font-medium text-gray-700"
        >
          Number of Processes :
        </label>
        <input
          type="number"
          id="numProcesses"
          value={numProcesses}
          onChange={handleNumProcessesChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="flex flex-wrap mb-4">
        {burstTimes.map((burstTime, index) => (
          <div className="mr-4 mb-4" key={index}>
            <label
              htmlFor={`burstTime-${index}`}
              className="block text-sm font-medium text-gray-700"
            >
              Burst Time {index + 1} :
            </label>
            <input
              type="number"
              id={`burstTime-${index}`}
              value={burstTime}
              onChange={(e) => handleBurstTimeChange(index, e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap mb-4">
        {arrivalTimes.map((arrivalTime, index) => (
          <div className="mr-4 mb-4" key={index}>
            <label
              htmlFor={`arrivalTime-${index}`}
              className="block text-sm font-medium text-gray-700"
            >
              Arrival Time {index + 1} :
            </label>
            <input
              type="number"
              id={`arrivalTime-${index}`}
              value={arrivalTime}
              onChange={(e) => handleArrivalTimeChange(index, e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label
          htmlFor="quantum"
          className="block text-sm font-medium text-gray-700"
        >
          Quantum for Round Robin :
        </label>
        <input
          type="number"
          id="quantum"
          value={quantum}
          onChange={handleQuantumChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
      >
        Compare Algorithms
      </button>
    </form>
  );
};

export default InputForm;
