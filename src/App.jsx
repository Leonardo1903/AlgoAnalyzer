import { useState } from "react";
import InputForm from "./components/InputForm";
import ComparisonChart from "./components/ComparisonChart";

function App() {
  const [comparisonData, setComparisonData] = useState([]);

  const handleSubmit = ({
    numProcesses,
    burstTimes,
    quantum,
    arrivalTimes,
  }) => {
    const rrData = calculateRR(numProcesses, burstTimes, quantum);
    const sjfData = calculateSJF(numProcesses, burstTimes);
    const fcfsData = calculateFCFS(numProcesses, burstTimes);
    const preemptiveSJFData = calculatePreemptiveSJF(
      numProcesses,
      burstTimes,
      arrivalTimes
    );

    setComparisonData([
      { algorithm: "Round Robin", ...rrData },
      { algorithm: "SJF", ...sjfData },
      { algorithm: "FCFS", ...fcfsData },
      { algorithm: "Preemptive SJF", ...preemptiveSJFData },
    ]);
  };

  const calculateResponseTime = (executionOrder, numProcesses) => {
    let responseTimes = Array(numProcesses).fill(-1);
    executionOrder.forEach(({ process, start }) => {
      if (responseTimes[process] === -1) {
        responseTimes[process] = start;
      }
    });
    return responseTimes.reduce((a, b) => a + b, 0) / numProcesses;
  };

  const calculateContextSwitches = (executionOrder) => {
    return executionOrder.length - 1;
  };

  const calculateFairness = (waitingTimes) => {
    const maxWait = Math.max(...waitingTimes);
    const minWait = Math.min(...waitingTimes);
    return maxWait - minWait;
  };

  const calculateRR = (numProcesses, burstTimes, quantum) => {
    let waitingTimes = Array(numProcesses).fill(0);
    let remainingBurstTimes = [...burstTimes];
    let t = 0;
    let executionOrder = [];

    while (true) {
      let done = true;

      for (let i = 0; i < numProcesses; i++) {
        if (remainingBurstTimes[i] > 0) {
          done = false;

          if (remainingBurstTimes[i] > quantum) {
            executionOrder.push({ process: i, start: t, end: t + quantum });
            t += quantum;
            remainingBurstTimes[i] -= quantum;
          } else {
            executionOrder.push({
              process: i,
              start: t,
              end: t + remainingBurstTimes[i],
            });
            t += remainingBurstTimes[i];
            waitingTimes[i] = t - burstTimes[i];
            remainingBurstTimes[i] = 0;
          }
        }
      }

      if (done) break;
    }

    let turnaroundTimes = burstTimes.map((bt, i) => bt + waitingTimes[i]);
    let avgWaitingTime = waitingTimes.reduce((a, b) => a + b, 0) / numProcesses;
    let avgTurnaroundTime =
      turnaroundTimes.reduce((a, b) => a + b, 0) / numProcesses;
    let responseTime = calculateResponseTime(executionOrder, numProcesses);
    let contextSwitches = calculateContextSwitches(executionOrder);
    let fairness = calculateFairness(waitingTimes);

    return {
      avgWaitingTime,
      avgTurnaroundTime,
      executionOrder,
      responseTime,
      contextSwitches,
      fairness,
    };
  };

  const calculateSJF = (numProcesses, burstTimes) => {
    let waitingTimes = Array(numProcesses).fill(0);
    let sortedIndices = [...Array(numProcesses).keys()].sort(
      (a, b) => burstTimes[a] - burstTimes[b]
    );
    let executionOrder = [];
    let t = 0;

    for (let i = 0; i < numProcesses; i++) {
      let process = sortedIndices[i];
      executionOrder.push({ process, start: t, end: t + burstTimes[process] });
      t += burstTimes[process];
      if (i > 0) {
        waitingTimes[process] = t - burstTimes[process];
      }
    }

    let turnaroundTimes = burstTimes.map((bt, i) => bt + waitingTimes[i]);
    let avgWaitingTime = waitingTimes.reduce((a, b) => a + b, 0) / numProcesses;
    let avgTurnaroundTime =
      turnaroundTimes.reduce((a, b) => a + b, 0) / numProcesses;
    let responseTime = calculateResponseTime(executionOrder, numProcesses);
    let contextSwitches = calculateContextSwitches(executionOrder);
    let fairness = calculateFairness(waitingTimes);

    return {
      avgWaitingTime,
      avgTurnaroundTime,
      executionOrder,
      responseTime,
      contextSwitches,
      fairness,
    };
  };

  const calculateFCFS = (numProcesses, burstTimes) => {
    let waitingTimes = Array(numProcesses).fill(0);
    let executionOrder = [];
    let t = 0;

    for (let i = 0; i < numProcesses; i++) {
      executionOrder.push({ process: i, start: t, end: t + burstTimes[i] });
      t += burstTimes[i];
      if (i > 0) {
        waitingTimes[i] = t - burstTimes[i];
      }
    }

    let turnaroundTimes = burstTimes.map((bt, i) => bt + waitingTimes[i]);
    let avgWaitingTime = waitingTimes.reduce((a, b) => a + b, 0) / numProcesses;
    let avgTurnaroundTime =
      turnaroundTimes.reduce((a, b) => a + b, 0) / numProcesses;

    let responseTime = calculateResponseTime(executionOrder, numProcesses);
    let contextSwitches = calculateContextSwitches(executionOrder);
    let fairness = calculateFairness(waitingTimes);

    return {
      avgWaitingTime,
      avgTurnaroundTime,
      executionOrder,
      responseTime,
      contextSwitches,
      fairness,
    };
  };

  const calculatePreemptiveSJF = (numProcesses, burstTimes, arrivalTimes) => {
    let waitingTimes = Array(numProcesses).fill(0);
    let remainingBurstTimes = [...burstTimes];
    let t = 0;
    let executionOrder = [];
    let completed = 0;
    let minm = Number.MAX_VALUE;
    let shortest = 0;
    let finishTime;
    let check = false;

    while (completed !== numProcesses) {
      for (let j = 0; j < numProcesses; j++) {
        if (
          arrivalTimes[j] <= t &&
          remainingBurstTimes[j] < minm &&
          remainingBurstTimes[j] > 0
        ) {
          minm = remainingBurstTimes[j];
          shortest = j;
          check = true;
        }
      }

      if (!check) {
        t++;
        continue;
      }

      // If the process is being executed for the first time, push the start time
      if (
        executionOrder.length === 0 ||
        executionOrder[executionOrder.length - 1].process !== shortest
      ) {
        executionOrder.push({ process: shortest, start: t });
      }

      remainingBurstTimes[shortest]--;
      minm = remainingBurstTimes[shortest];
      if (minm === 0) minm = Number.MAX_VALUE;

      if (remainingBurstTimes[shortest] === 0) {
        completed++;
        check = false;
        finishTime = t + 1;
        waitingTimes[shortest] =
          finishTime - burstTimes[shortest] - arrivalTimes[shortest];
        if (waitingTimes[shortest] < 0) waitingTimes[shortest] = 0;

        // Update the end time of the last execution order entry
        executionOrder[executionOrder.length - 1].end = finishTime;
      } else {
        // Update the end time of the last execution order entry
        executionOrder[executionOrder.length - 1].end = t + 1;
      }
      t++;
    }

    let turnaroundTimes = burstTimes.map((bt, i) => bt + waitingTimes[i]);
    let avgWaitingTime = waitingTimes.reduce((a, b) => a + b, 0) / numProcesses;
    let avgTurnaroundTime =
      turnaroundTimes.reduce((a, b) => a + b, 0) / numProcesses;
    let responseTime = calculateResponseTime(executionOrder, numProcesses);
    let contextSwitches = calculateContextSwitches(executionOrder);
    let fairness = calculateFairness(waitingTimes);

    return {
      avgWaitingTime,
      avgTurnaroundTime,
      executionOrder,
      responseTime,
      contextSwitches,
      fairness,
    };
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-8">
        CPU Scheduling Algorithm Comparison
      </h1>
      <InputForm onSubmit={handleSubmit} />
      {comparisonData.length > 0 && <ComparisonChart data={comparisonData} />}
    </div>
  );
}

export default App;
