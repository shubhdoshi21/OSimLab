import React, { useEffect, useState } from "react";

const ProcessScheduling = () => {
  const [withPriority, setWithPriority] = useState(false);
  const [processID, setProcessID] = useState(1);
  const [arrivalTime, setArrivalTime] = useState("");
  const [completionTime, setCompletionTime] = useState("");
  const [priority, setPriority] = useState("");
  const [processList, setProcessList] = useState([]);
  const [fcfsActive, setFcfsActive] = useState(false);
  const [fcfsGanttChart, setFcfsGanttChart] = useState([]);
  const [sjfActive, setSjfActive] = useState(false);
  const [sjfGanttChart, setSjfGanttChart] = useState([]);
  const [srtfActive, setSrtfActive] = useState(false);
  const [srtfGanttChart, setSrtfGanttChart] = useState([]);
  const [rrGanttChart, setRrGanttChart] = useState([]);
  const [rrActive, setRrActive] = useState(false);
  const [priorityGanttChart, setPriorityGanttChart] = useState([]);
  const [priorityActive, setPriorityActive] = useState(false);

  // FCFS simulation logic
  const simulateFCFS = () => {
    // Sort the processList by arrival time (FCFS order)
    const sortedProcesses = [...processList].sort(
      (a, b) => parseInt(a.ArrivalTime) - parseInt(b.ArrivalTime)
    );

    let currentTime = 0;
    const newGanttChart = [];

    sortedProcesses.forEach((process) => {
      //DOES NOT WORK ACCORDING TO GANTT CHART SO GIVES INCORRECT ANSWERS
      // const completionTime = parseInt(process.CompletionTime);
      // const turnaroundTime =
      //   currentTime + completionTime - parseInt(process.ArrivalTime);
      // const waitingTime = turnaroundTime - completionTime;

      // Skip idle time between processes
      if (currentTime < parseInt(process.ArrivalTime)) {
        newGanttChart.push({
          PID: "Idle",
          start: currentTime,
          end: parseInt(process.ArrivalTime),
        });
        currentTime = parseInt(process.ArrivalTime);
      }

      newGanttChart.push({
        PID: process.PID,
        start: currentTime,
        end: currentTime + parseInt(process.CompletionTime),
        // turnaroundTime,
        // waitingTime,
        finishTime: currentTime + parseInt(process.CompletionTime),
      });

      currentTime += parseInt(process.CompletionTime);;
    });

    setFcfsGanttChart(newGanttChart);
  };

  // JSX code for FCFS Gantt chart
  const renderFCFSGanttChart = () => {
    const ganttElements = [];

    fcfsGanttChart.forEach((entry, index) => {
      if (entry.PID !== "Idle") {
        // Process entry
        ganttElements.push(
          <div
            key={index}
            className="text-center"
            style={{
              border: "2px solid black",
              width: `${(entry.end - entry.start) * 60}px`, // Adjust the width
              height: "30px",
              flex: "0 0 auto",
              backgroundColor: assignColor(entry.PID),
            }}
          >
            {entry.PID}
          </div>
        );
      } else {
        // Empty space for idle time
        ganttElements.push(
          <div
            key={index}
            style={{
              width: `${(entry.end - entry.start) * 60}px`, // Adjust the width
              flex: "0 0 auto",
            }}
          ></div>
        );
      }
    });
    return ganttElements; // Make sure to return ganttElements
  };

  const calculateTotalTatFcfs = (ganttChart, processList) => {
    let totalTAT = 0;
    processList.forEach((process) => {
      const ganttEntry = ganttChart.find((entry) => entry.PID === process.PID);
      if (ganttEntry) {
        totalTAT += ganttEntry.end - parseInt(process.ArrivalTime);
      }
    });
    return totalTAT;
  };

  const calculateAverageTatFcfs = (ganttChart, processList) => {
    let totalTAT = 0;
    processList.forEach((process) => {
      const ganttEntry = ganttChart.find((entry) => entry.PID === process.PID);
      if (ganttEntry) {
        totalTAT += ganttEntry.end - parseInt(process.ArrivalTime);
      }
    });
    const averageTAT = totalTAT / processList.length;
    return averageTAT;
  };

  // Calculate total Waiting Time for FCFS
  const calculateTotalWaitingTimeFCFS = (ganttChart, processList) => {
    let totalWaitingTime = 0;
    processList.forEach((process) => {
      const ganttEntry = ganttChart.find((entry) => entry.PID === process.PID);
      if (ganttEntry) {
        totalWaitingTime += ganttEntry.start - parseInt(process.ArrivalTime);
      }
    });
    return totalWaitingTime;
  };

  // Calculate average Waiting Time for FCFS
  const calculateAverageWaitingTimeFCFS = (ganttChart, processList) => {
    const totalWaitingTime = calculateTotalWaitingTimeFCFS(
      ganttChart,
      processList
    );
    const averageWaitingTime = totalWaitingTime / processList.length;
    return averageWaitingTime;
  };

  // SJF simulation logic
  const runSJFSimulation = () => {
    const activeProcesses = [...processList]; // Copy the original process list

    const ganttData = [];
    let currentTime = 0;

    while (activeProcesses.length > 0) {
      const eligibleProcesses = activeProcesses.filter(
        (process) => parseInt(process.ArrivalTime) <= currentTime
      );

      if (eligibleProcesses.length === 0) {
        // No eligible processes, move time forward
        const nextArrivalTime = Math.min(
          ...activeProcesses.map((process) => parseInt(process.ArrivalTime))
        );
        ganttData.push({
          processId: "Idle",
          width: nextArrivalTime - currentTime,
          start: currentTime,
          end: nextArrivalTime,
        });
        currentTime = nextArrivalTime;
      } else {
        // Sort eligible processes by their burst time (Completion Time)
        eligibleProcesses.sort((a, b) => {
          return parseInt(a.CompletionTime) - parseInt(b.CompletionTime);
        });

        const nextProcess = eligibleProcesses[0];
        ganttData.push({
          processId: nextProcess.PID,
          width: parseInt(nextProcess.CompletionTime),
          start: currentTime,
          end: currentTime + parseInt(nextProcess.CompletionTime),
        });
        currentTime += parseInt(nextProcess.CompletionTime);

        // Remove the processed process from the activeProcesses
        const index = activeProcesses.findIndex(
          (process) => process.PID === nextProcess.PID
        );
        activeProcesses.splice(index, 1);
      }
    }

    setSjfGanttChart(ganttData);
  };

  const renderSJFGanttChart = (ganttData) => {
    const ganttElements = [];

    ganttData.forEach((entry, index) => {
      if (entry.processId !== "Idle") {
        // Active process entry
        ganttElements.push(
          <div
            key={index}
            className="text-center"
            style={{
              border: "2px solid black",
              width: `${entry.width * 60}px`, // Assuming 1 unit of time = 60px
              height: "30px",
              flex: "0 0 auto",
              backgroundColor: assignColor(entry.processId),
            }}
          >
            {entry.processId}
          </div>
        );
      } else {
        // Empty space for idle time
        ganttElements.push(
          <div
            key={index}
            style={{
              width: `${entry.width * 60}px`, // Adjust the width for idle time
              flex: "0 0 auto",
            }}
          ></div>
        );
      }
    });

    return ganttElements;
  };

  const calculateTotalTatSjf = (sjfGanttChart, processList) => {
    let totalTAT = 0;
    processList.forEach((process) => {
      const ganttEntry = sjfGanttChart.find(
        (entry) => entry.processId === process.PID
      );
      if (ganttEntry) {
        totalTAT += ganttEntry.end - parseInt(process.ArrivalTime);
      }
    });
    return totalTAT;
  };

  const calculateAverageTatSjf = (sjfGanttChart, processList) => {
    let totalTAT = 0;
    processList.forEach((process) => {
      const ganttEntry = sjfGanttChart.find(
        (entry) => entry.processId === process.PID
      );
      if (ganttEntry) {
        totalTAT += ganttEntry.end - parseInt(process.ArrivalTime);
      }
    });
    const averageTAT = totalTAT / processList.length;
    return averageTAT;
  };

  // Calculate total Waiting Time for FCFS
  const calculateTotalWaitingTimeSjf = (sjfGanttChart, processList) => {
    let totalWaitingTime = 0;
    processList.forEach((process) => {
      const ganttEntry = sjfGanttChart.find(
        (entry) => entry.processId === process.PID
      );
      if (ganttEntry) {
        totalWaitingTime += ganttEntry.start - parseInt(process.ArrivalTime);
      }
    });
    return totalWaitingTime;
  };

  // Calculate average Waiting Time for FCFS
  const calculateAverageWaitingTimeSjf = (sjfGanttChart, processList) => {
    const totalWaitingTime = calculateTotalWaitingTimeSjf(
      sjfGanttChart,
      processList
    );
    const averageWaitingTime = totalWaitingTime / processList.length;
    return averageWaitingTime;
  };

  //SRTF simulation logic
  const runSRTFSimulation = () => {
    if (processList.length === 0) return;

    const remainingTimes = [
      ...processList.map((process) => parseInt(process.CompletionTime)),
    ];
    const ganttData = [];
    let currentTime = 0;
    let completedProcesses = 0;

    while (completedProcesses < processList.length) {
      let minRemainingTime = Infinity;
      let selectedProcess = null;

      for (let i = 0; i < processList.length; i++) {
        if (
          remainingTimes[i] > 0 &&
          parseInt(processList[i].ArrivalTime) <= currentTime
        ) {
          if (remainingTimes[i] < minRemainingTime) {
            minRemainingTime = remainingTimes[i];
            selectedProcess = i;
          }
        }
      }

      if (selectedProcess === null) {
        // No eligible process, increment time
        currentTime++;
        ganttData.push({ processId: "Idle", width: 1 });
      } else {
        // Execute the selected process for 1 unit of time
        remainingTimes[selectedProcess]--;
        ganttData.push({
          processId: processList[selectedProcess].PID,
          width: 1,
          start: currentTime,
          end: currentTime + 1,
        });

        currentTime++;

        if (remainingTimes[selectedProcess] === 0) {
          completedProcesses++;
        }
      }
    }
    setSrtfGanttChart(ganttData);
  };

  const renderSRTFGanttChart = (ganttData) => {
    const ganttElements = [];
    let combinedProcessId = null;
    let combinedWidth = 0;

    ganttData.forEach((entry, index) => {
      if (entry.processId !== "Idle") {
        if (entry.processId === combinedProcessId) {
          combinedWidth += entry.width * 60; // Accumulate width
        } else {
          if (combinedProcessId !== null) {
            // Push the combined segment
            ganttElements.push(
              <div
                key={index}
                className="text-center"
                style={{
                  border: "2px solid black",
                  width: `${combinedWidth}px`,
                  height: "30px",
                  flex: "0 0 auto",
                  backgroundColor: assignColor(combinedProcessId),
                }}
              >
                {combinedProcessId}
              </div>
            );
          }

          combinedProcessId = entry.processId;
          combinedWidth = entry.width * 60;
        }
      } else {
        // Push any "Idle" segments
        ganttElements.push(
          <div
            key={index}
            style={{
              width: `${entry.width * 60}px`,
              flex: "0 0 auto",
            }}
          ></div>
        );
      }
    });

    // Push the last combined segment
    if (combinedProcessId !== null) {
      ganttElements.push(
        <div
          className="text-center"
          style={{
            border: "2px solid black",
            width: `${combinedWidth}px`,
            height: "30px",
            flex: "0 0 auto",
            backgroundColor: assignColor(combinedProcessId),
          }}
        >
          {combinedProcessId}
        </div>
      );
    }

    return ganttElements;
  };

  // Calculate total Turnaround Time for SRTF
  const calculateTotalTatSrtf = (srtfGanttChart, processList) => {
    let totalTAT = 0;

    processList.forEach((process) => {
      const processSegments = srtfGanttChart.filter(
        (entry) => entry.processId === process.PID
      );
      const lastSegment = processSegments[processSegments.length - 1];

      if (lastSegment) {
        totalTAT += lastSegment.end - parseInt(process.ArrivalTime);
      }
    });

    return totalTAT;
  };

  // Calculate average Turnaround Time for SRTF
  const calculateAverageTatSrtf = (srtfGanttChart, processList) => {
    let totalTAT = calculateTotalTatSrtf(srtfGanttChart, processList);
    const averageTAT = totalTAT / processList.length;
    return averageTAT;
  };

  // Calculate total Waiting Time for SRTF
  const calculateTotalWaitingTimeSrtf = (srtfGanttChart, processList) => {
    let totalWaitingTime = 0;

    processList.forEach((process) => {
      const processSegments = srtfGanttChart.filter(
        (entry) => entry.processId === process.PID
      );
      const lastSegment = processSegments[processSegments.length - 1];

      if (lastSegment) {
        totalWaitingTime +=
          lastSegment.end -
          parseInt(process.ArrivalTime) -
          process.CompletionTime;
      }
    });

    return totalWaitingTime;
  };

  // Calculate average Waiting Time for SRTF
  const calculateAverageWaitingTimeSrtf = (srtfGanttChart, processList) => {
    const totalWaitingTime = calculateTotalWaitingTimeSrtf(
      srtfGanttChart,
      processList
    );
    const averageWaitingTime = totalWaitingTime / processList.length;
    return averageWaitingTime;
  };

  //RR SIMULATION LOGIC
  const runRRSimulation = (quantum) => {
    const remainingProcesses = [...processList];
    const readyQueue = [];
    const ganttData = [];
    let currentTime = 0;

    while (remainingProcesses.length > 0 || readyQueue.length > 0) {
      while (
        remainingProcesses.length > 0 &&
        parseInt(remainingProcesses[0].ArrivalTime) <= currentTime
      ) {
        readyQueue.push(JSON.parse(JSON.stringify(remainingProcesses.shift())));
      }

      if (readyQueue.length > 0) {
        const currentProcess = readyQueue.shift();
        const timeRemaining = parseInt(currentProcess.CompletionTime);

        const timeAllocated = Math.min(quantum, timeRemaining);
        ganttData.push({
          processId: currentProcess.PID,
          width: timeAllocated,
          start: currentTime,
          end: currentTime + timeAllocated,
        });

        currentTime += timeAllocated;
        currentProcess.CompletionTime = (
          timeRemaining - timeAllocated
        ).toString();

        if (parseInt(currentProcess.CompletionTime) > 0 ) {
          while (
            remainingProcesses.length > 0 &&
            parseInt(remainingProcesses[0].ArrivalTime) <= currentTime
          ) {
            readyQueue.push(JSON.parse(JSON.stringify(remainingProcesses.shift())));
          }
          readyQueue.push(currentProcess);
        }
      } else {
        // No processes in the queue, increment time
        currentTime++;
        ganttData.push({ processId: "Idle", width: 1 });
      }
    }
    setRrGanttChart(ganttData);
  };

  // JSX code for RR Gantt chart
  const renderRRGanttChart = () => {
    const ganttElements = [];
    let combinedProcessId = null;
    let combinedWidth = 0;

    rrGanttChart.forEach((entry, index) => {
      if (entry.processId !== "Idle") {
        if (entry.processId === combinedProcessId) {
          combinedWidth += entry.width * 60; // Accumulate width
        } else {
          if (combinedProcessId !== null) {
            // Push the combined segment
            ganttElements.push(
              <div
                key={index}
                className="text-center"
                style={{
                  border: "2px solid black",
                  width: `${combinedWidth}px`,
                  height: "30px",
                  flex: "0 0 auto",
                  backgroundColor: assignColor(combinedProcessId),
                }}
              >
                {combinedProcessId}
              </div>
            );
          }

          combinedProcessId = entry.processId;
          combinedWidth = entry.width * 60;
        }
      } else {
        // Push any "Idle" segments
        if (entry.width > 0) {
          ganttElements.push(
            <div
              key={index}
              style={{
                width: `${entry.width * 60}px`,
                flex: "0 0 auto",
              }}
            ></div>
          );
        }
      }
    });

    // Push the last combined segment
    if (combinedProcessId !== null) {
      ganttElements.push(
        <div
          className="text-center"
          style={{
            border: "2px solid black",
            width: `${combinedWidth}px`,
            height: "30px",
            flex: "0 0 auto",
            backgroundColor: assignColor(combinedProcessId),
          }}
        >
          {combinedProcessId}
        </div>
      );
    }

    return ganttElements;
  };

  const calculateTotalTatRr = (rrGanttChart, processList) => {
    let totalTAT = 0;

    processList.forEach((process) => {
      const processSegments = rrGanttChart.filter(
        (entry) => entry.processId === process.PID
      );
      const lastSegment = processSegments[processSegments.length - 1];

      if (lastSegment) {
        totalTAT += lastSegment.end - parseInt(process.ArrivalTime);
      }
    });

    return totalTAT;
  };

  // Calculate average Turnaround Time for SRTF
  const calculateAverageTatRr = (rrGanttChart, processList) => {
    let totalTAT = calculateTotalTatSrtf(rrGanttChart, processList);
    const averageTAT = totalTAT / processList.length;
    return averageTAT;
  };

  // Calculate total Waiting Time for SRTF
  const calculateTotalWaitingTimeRr = (rrGanttChart, processList) => {
    let totalWaitingTime = 0;

    processList.forEach((process) => {
      const processSegments = rrGanttChart.filter(
        (entry) => entry.processId === process.PID
      );
      const lastSegment = processSegments[processSegments.length - 1];

      if (lastSegment) {
        totalWaitingTime +=
          lastSegment.end -
          parseInt(process.ArrivalTime) -
          process.CompletionTime;
      }
    });

    return totalWaitingTime;
  };

  // Calculate average Waiting Time for SRTF
  const calculateAverageWaitingTimeRr = (rrGanttChart, processList) => {
    const totalWaitingTime = calculateTotalWaitingTimeSrtf(
      rrGanttChart,
      processList
    );
    const averageWaitingTime = totalWaitingTime / processList.length;
    return averageWaitingTime;
  };

  //PBS(pre-emptive)
  const runPrioritySimulation = () => {
    if (processList.length === 0) return;

    const ganttData = [];
    let currentTime = 0;
    let completedProcesses = 0;
    const processListCopy = JSON.parse(JSON.stringify(processList));

    while (completedProcesses < processListCopy.length) {
      let highestPriority = -1;
      let selectedProcess = null;

      for (let i = 0; i < processListCopy.length; i++) {
        if (
          parseInt(processListCopy[i].ArrivalTime) <= currentTime &&
          parseInt(processListCopy[i].CompletionTime) > 0
        ) {
          if (parseInt(processListCopy[i].Priority) > highestPriority) {
            highestPriority = processListCopy[i].Priority;
            selectedProcess = i;
          }
        }
      }

      if (selectedProcess === null) {
        // No eligible process, increment time
        currentTime++;
        ganttData.push({ processId: "Idle", width: 1 });
      } else {
        // Execute the selected process for 1 unit of time
        ganttData.push({
          processId: processListCopy[selectedProcess].PID,
          width: 1,
          start: currentTime,
          end: currentTime + 1,
        });

        currentTime++;

        processListCopy[selectedProcess].CompletionTime--;

        if (processListCopy[selectedProcess].CompletionTime === 0) {
          completedProcesses++;
        }
      }
    }
    setPriorityGanttChart(ganttData);
  };

  const renderPriorityGanttChart = () => {
    const ganttElements = [];
    let combinedProcessId = null;
    let combinedWidth = 0;

    priorityGanttChart.forEach((entry, index) => {
      if (entry.processId !== "Idle") {
        if (entry.processId === combinedProcessId) {
          combinedWidth += entry.width * 60; // Accumulate width
        } else {
          if (combinedProcessId !== null) {
            // Push the combined segment
            ganttElements.push(
              <div
                key={index}
                className="text-center"
                style={{
                  border: "2px solid black",
                  width: `${combinedWidth}px`,
                  height: "30px",
                  flex: "0 0 auto",
                  backgroundColor: assignColor(combinedProcessId),
                }}
              >
                {combinedProcessId}
              </div>
            );
          }

          combinedProcessId = entry.processId;
          combinedWidth = entry.width * 60;
        }
      } else {
        // Push any "Idle" segments
        if (entry.width > 0) {
          ganttElements.push(
            <div
              key={index}
              style={{
                width: `${entry.width * 60}px`,
                flex: "0 0 auto",
              }}
            ></div>
          );
        }
      }
    });

    // Push the last combined segment
    if (combinedProcessId !== null) {
      ganttElements.push(
        <div
          className="text-center"
          style={{
            border: "2px solid black",
            width: `${combinedWidth}px`,
            height: "30px",
            flex: "0 0 auto",
            backgroundColor: assignColor(combinedProcessId),
          }}
        >
          {combinedProcessId}
        </div>
      );
    }

    return ganttElements;
  };

  //Calculatr total Turnaround time for PBS
  const calculateTotalTatPriority = (priorityGanttChart, processList) => {
    let totalTAT = 0;

    processList.forEach((process) => {
      const processSegments = priorityGanttChart.filter(
        (entry) => entry.processId === process.PID
      );
      const lastSegment = processSegments[processSegments.length - 1];

      if (lastSegment) {
        totalTAT += lastSegment.end - parseInt(process.ArrivalTime);
      }
    });

    return totalTAT;
  };

  // Calculate average Turnaround Time for PBS
  const calculateAverageTatPriority = (priorityGanttChart, processList) => {
    let totalTAT = calculateTotalTatSrtf(priorityGanttChart, processList);
    const averageTAT = totalTAT / processList.length;
    return averageTAT;
  };

  // Calculate total Waiting Time for PBS
  const calculateTotalWaitingTimePriority = (
    priorityGanttChart,
    processList
  ) => {
    let totalWaitingTime = 0;

    processList.forEach((process) => {
      const processSegments = priorityGanttChart.filter(
        (entry) => entry.processId === process.PID
      );
      const lastSegment = processSegments[processSegments.length - 1];

      if (lastSegment) {
        totalWaitingTime +=
          lastSegment.end -
          parseInt(process.ArrivalTime) -
          process.CompletionTime;
      }
    });

    return totalWaitingTime;
  };

  // Calculate average Waiting Time for PBS
  const calculateAverageWaitingTimePriority = (
    priorityGanttChart,
    processList
  ) => {
    const totalWaitingTime = calculateTotalWaitingTimePriority(
      priorityGanttChart,
      processList
    );
    const averageWaitingTime = totalWaitingTime / processList.length;
    return averageWaitingTime;
  };

  //Setting Priority ON/OFF
  const RadioChange = (event) => {
    if (event.target.value === "WithPriority") {
      setWithPriority(true);
    } else {
      setWithPriority(false);
    }
  };

  //Adding of process to processList
  const addProcess = () => {
    let byDefaultPriority = priority;
    if (!withPriority || priority === "") {
      byDefaultPriority = 1;
    }

    if (
      processList.some(
        (process) => parseInt(arrivalTime) < parseInt(process.ArrivalTime)
      )
    ) {
      alert("Enter an arrival time greater or equal to the previous ones!");
    } else {
      const newProcess = {
        PID: `P${processID}`,
        ArrivalTime: arrivalTime,
        CompletionTime: completionTime,
        Priority: byDefaultPriority,
      };

      setProcessList([...processList, newProcess]);
      setProcessID(processID + 1);
    }
    setArrivalTime("");
    setCompletionTime("");
    setPriority("");
  };

  //RESETING PROCESS LIST
  const resetProcesses = () => {
      setProcessList([]);
      setProcessID(1)
      setSjfGanttChart([])
      setFcfsGanttChart([])
      setPriorityGanttChart([])
      setRrGanttChart([])
      setSrtfGanttChart([])
  }

  //div calculating logic
  const calculateN = () => {
    if (processList.length === 0) {
      return 0;
    }

    const highestArrivalTime = Math.max(
      ...processList.map((process) => parseInt(process.ArrivalTime))
    );

    const completionTimes = processList.map((process) =>
      parseInt(process.CompletionTime)
    );
    const totalCompletionTime = completionTimes.reduce(
      (acc, time) => acc + time,
      0
    );

    return highestArrivalTime + totalCompletionTime + 1;
  };
  const [divCount, setDivCount] = useState(calculateN);

  useEffect(() => {
    setDivCount(calculateN());
  }, [processList]);

  //Color logic

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    // Function to check if a color is too dark (for black text)
    function isColorTooDark(hexColor) {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      // Adjust this threshold as needed
      return r * 0.299 + g * 0.587 + b * 0.114 < 128;
    }

    do {
      color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
    } while (isColorTooDark(color));

    return color;
  }

  const colorMap = {};

  const assignColor = (processId) => {
    if (!colorMap[processId]) {
      colorMap[processId] = getRandomColor();
    }
    return colorMap[processId];
  };

  return (
    <div className="h-screen w-screen">
      <div className="flex-row flex md:flex-col">
        {/* left box */}
        <div className="flex flex-col w-2/3 md:w-full">
          <div className="flex-row w-full flex sm:flex-col sm:justify-center sm:items-center">
            {/* top left  */}
            <div className="w-1/2 sm:w-full">
              {/* priority set */}
              <div className="mx-3 my-3 flex flex-row w-auto justify-center xs:flex-col xs:justify-center xs:items-center xs:w-full">
                <label className="w-[40%] sm:w-[30%] xs:w-auto xs:mt-2">
                  <input
                    type="radio"
                    name="PriorityType"
                    value="WithPriority"
                    className="mr-1 "
                    onChange={RadioChange}
                  />
                  With Priority
                </label>
                <label className="w-[50%] xs:w-auto xs:mt-2">
                  <input
                    type="radio"
                    name="PriorityType"
                    value="WithoutPriority"
                    className="mr-1"
                    onChange={RadioChange}
                    defaultChecked
                  />
                  Without Priority
                </label>
              </div>
              {/* entering of times */}
              <div className="flex flex-col justify-right items-right w-full my-3">
                <div className="flex flex-row py-1 w-full  h-[160px]">
                  <div className="w-1/3 flex flex-col  justify-center text-end items-end mt-2">
                    <label className=" h-8 ">Process ID </label>
                    <label className=" h-8 my-1">Arrival Time </label>
                    <label className=" h-8 truncate ">Completion Time </label>
                    {withPriority && (
                      <label className=" h-8 mt-1">Priority </label>
                    )}
                  </div>
                  <div className="w-2/3 flex flex-col justify-center">
                    <div>
                      <input
                        type="text"
                        name="Pid"
                        className="border-2 mx-3 rounded-md px-[4px] py-[1px] "
                        placeholder={`P${processID}`}
                        readOnly
                      />
                    </div>
                    <div className="my-1">
                      <input
                        type="text"
                        name="ArrivalTime"
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(e.target.value)}
                        className="border-2 mx-3 rounded-md px-[4px] py-[1px]"
                      />
                    </div>
                    <div className="">
                      <input
                        type="text"
                        name="CompletionTime"
                        value={completionTime}
                        onChange={(e) => setCompletionTime(e.target.value)}
                        className="border-2 mx-3 rounded-md px-[4px] py-[1px] flex "
                      />
                    </div>
                    {withPriority && (
                      <div className="mt-1">
                        <input
                          type="text"
                          name="Priority"
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                          className="border-2 mx-3 rounded-md px-[4px] py-[1px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="my-2 flex justify-center">
                  <input
                    title="You should only enter numbers in the Arrival Time & Completion Time for the ADD button to become active"
                    type="button"
                    value="ADD"
                    className="button flex self-center"
                    onClick={addProcess}
                    disabled={
                      isNaN(arrivalTime) ||
                      isNaN(completionTime) ||
                      arrivalTime === "" ||
                      completionTime === "" ||
                      arrivalTime < 0 ||
                      completionTime < 0
                    }
                  />
                  <input
                    type="button"
                    value="RESET"
                    className="button flex self-center"
                    onClick={resetProcesses}
                    disabled={
                      processList.length === 0
                    }
                  />
                </div>
              </div>
            </div>
            {/* databox  */}
            <div className="h-[245px] rounded w-1/2 border-black border-2 my-2 overflow-scroll sm:w-[90%]">
              <div className="w-full sticky h-[13%] top-0 flex flex-row text-center bg-green-500 text-white">
                <div className=" w-1/4 border-black border-r-2 border-b-2">
                  PID
                </div>
                <div className="w-1/4 border-black border-r-2 border-b-2 truncate">
                  Arrival Time
                </div>
                <div className=" w-1/4 border-black border-r-2 border-b-2 truncate">
                  Completion Time
                </div>
                <div className="w-1/4 border-black border-b-2 truncate">
                  Priority
                </div>
              </div>
              <div>
                {processList.map((process, index) => (
                  <div key={index} className="flex flex-row text-center">
                    <div className="px-1 h-1/6 w-1/4 border-r-2 border-b-2">
                      {process.PID}
                    </div>
                    <div className="px-1 h-1/6 w-1/4 border-r-2 border-b-2">
                      {process.ArrivalTime}
                    </div>
                    <div className="px-1 h-1/6 w-1/4 border-r-2 border-b-2 truncate">
                      {process.CompletionTime}
                    </div>
                    <div className="px-1 h-1/6 w-1/4 border-r-2 border-b-2 overflow-hidden">
                      {process.Priority}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full my-2.5 grid grid-cols-1 gap-y-1 justify-items-center h-auto">
            {/* middle page box  */}
            <div className=" bg-green-500 rounded w-[70%]  justify-center flex flex-row align-middle text-gray-50 sm:w-[90%]">
              <label className="ml-10 mr-3 my-2.5 text-center justify-center">
                <input
                  title="Enter the values of Arrival Time and Completion Time for the activation of the scheduling processes"
                  type="radio"
                  name="Scheduling"
                  value="FCFS"
                  className="mr-1 "
                  disabled={processList.length === 0}
                  onChange={() => {
                    setFcfsActive(true);
                    simulateFCFS();
                    setSjfActive(false);
                    setSrtfActive(false);
                    setRrActive(false);
                    setPriorityActive(false);
                  }}
                />
                FCFS
              </label>
              <label className="mx-3 my-2.5 text-center justify-center">
                <input
                  title="Enter the values of Arrival Time and Completion Time for the activation of the scheduling processes"
                  type="radio"
                  name="Scheduling"
                  value="SJF"
                  className="mr-1 "
                  disabled={processList.length === 0}
                  onChange={() => {
                    setSjfActive(true);
                    runSJFSimulation();
                    setFcfsActive(false);
                    setSrtfActive(false);
                    setRrActive(false);
                    setPriorityActive(false);
                  }}
                />
                SJF
              </label>
              <label className="mx-3 my-2.5 text-center justify-center">
                <input
                  title="Enter the values of Arrival Time and Completion Time for the activation of the scheduling processes"
                  type="radio"
                  name="Scheduling"
                  value="SRTF"
                  className="mr-1"
                  disabled={processList.length === 0}
                  onChange={() => {
                    setSrtfActive(true);
                    runSRTFSimulation();
                    setFcfsActive(false);
                    setSjfActive(false);
                    setRrActive(false);
                    setPriorityActive(false);
                  }}
                />
                SRTF
              </label>
              <label className="mx-3 my-2.5 text-center justify-center">
                <input
                  title="Enter the values of Arrival Time and Completion Time for the activation of the scheduling processes"
                  type="radio"
                  name="Scheduling"
                  value="RR"
                  className="mr-1 "
                  disabled={processList.length === 0}
                  onChange={() => {
                    setRrActive(true);
                    runRRSimulation(
                      parseInt(
                        prompt("Enter the Time Quantum for round robin: ")
                      )
                    );
                    setFcfsActive(false);
                    setSjfActive(false);
                    setSrtfActive(false);
                    setPriorityActive(false);
                  }}
                />
                RR
              </label>
              {withPriority && (
                <label className="mx-3 my-2.5 text-center justify-center">
                  <input
                    title="Enter the values of Arrival Time and Completion Time for the activation of the scheduling processes"
                    type="radio"
                    name="Scheduling"
                    value="PriorityBased"
                    className="mr-1 "
                    disabled={processList.length === 0}
                    onChange={() => {
                      setPriorityActive(true);
                      runPrioritySimulation();
                      setRrActive(false);
                      setFcfsActive(false);
                      setSjfActive(false);
                      setSrtfActive(false);
                    }}
                  />
                  PBS
                </label>
              )}
            </div>
            {/* middle page box data  */}
            <div className="rounded w-[70%] border-black border-2 h-[175px] overflow-auto sm:w-[90%]">
              <div className="flex flex-col ">
                <div className="h-1/6 w-full sticky top-0 flex bg-black text-white flex-row text-center">
                  <div className="px-1 w-1/6 border-white border-r-2 border-b-2">
                    PID
                  </div>
                  <div className="px-1 w-1/6 border-white border-r-2 border-b-2">
                    Arrival
                  </div>
                  <div className="px-1 border-white w-1/6 border-r-2 border-b-2 truncate">
                    Complete
                  </div>
                  <div className="px-1 border-white w-1/6 border-r-2 border-b-2 truncate">
                    TurnAround
                  </div>
                  <div className="px-1 border-white w-1/6 border-r-2 border-b-2">
                    Finish
                  </div>
                  <div className="px-1 border-white w-1/6 border-b-2">
                    Waiting
                  </div>
                </div>
                {fcfsActive &&
                  processList.map((process, index) => {
                    // Find the corresponding entry in fcfsGanttChart, if it exists
                    const ganttEntry = fcfsGanttChart.find(
                      (entry) => entry.PID === process.PID
                    );

                    return (
                      <div key={index} className="flex flex-row text-center">
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {process.PID}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {process.ArrivalTime}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {process.CompletionTime}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {ganttEntry
                            ? ganttEntry.end - parseInt(process.ArrivalTime)
                            : "-"}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {ganttEntry ? ganttEntry.end : "-"}
                        </div>
                        <div className="px-1 w-1/6 border-b-2">
                          {ganttEntry
                            ? ganttEntry.start - parseInt(process.ArrivalTime)
                            : "-"}
                        </div>
                      </div>
                    );
                  })}
                {sjfActive && (
                  <div>
                    {processList.map((process, index) => {
                      // Find the corresponding entry in sjfGanttChart, if it exists
                      const ganttEntry = sjfGanttChart.find(
                        (entry) => entry.processId === process.PID
                      );

                      return (
                        <div key={index} className="flex flex-row text-center">
                          <div className="px-1 w-1/6 border-r-2 border-b-2">
                            {process.PID}
                          </div>
                          <div className="px-1 w-1/6 border-r-2 border-b-2">
                            {process.ArrivalTime}
                          </div>
                          <div className="px-1 w-1/6 border-r-2 border-b-2">
                            {process.CompletionTime}
                          </div>
                          <div className="px-1 w-1/6 border-r-2 border-b-2">
                            {ganttEntry
                              ? ganttEntry.end - parseInt(process.ArrivalTime)
                              : "-"}
                          </div>
                          <div className="px-1 w-1/6 border-r-2 border-b-2">
                            {ganttEntry ? ganttEntry.end : "-"}
                          </div>
                          <div className="px-1 w-1/6 border-b-2">
                            {ganttEntry
                              ? ganttEntry.start - parseInt(process.ArrivalTime)
                              : "-"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {srtfActive &&
                  processList.map((process, index) => {
                    // Find all segments of the same process in srtfGanttChart
                    const processSegments = srtfGanttChart.filter(
                      (entry) => entry.processId === process.PID
                    );

                    // Get the last segment
                    const lastSegment =
                      processSegments[processSegments.length - 1];

                    return (
                      <div key={index} className="flex flex-row text-center">
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {process.PID}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {process.ArrivalTime}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {process.CompletionTime}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {lastSegment
                            ? lastSegment.end - parseInt(process.ArrivalTime)
                            : "-"}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {lastSegment ? lastSegment.end : "-"}
                        </div>
                        <div className="px-1 w-1/6 border-b-2">
                          {lastSegment
                            ? lastSegment.end -
                              parseInt(process.ArrivalTime) -
                              process.CompletionTime
                            : "-"}
                        </div>
                      </div>
                    );
                  })}
                {rrActive &&
                  processList.map((process, index) => {
                    // Find all segments of the same process in srtfGanttChart
                    const processSegments = rrGanttChart.filter(
                      (entry) => entry.processId === process.PID
                    );

                    // Get the last segment
                    const lastSegment =
                      processSegments[processSegments.length - 1];

                    return (
                      <div key={index} className="flex flex-row text-center">
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {process.PID}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {process.ArrivalTime}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {process.CompletionTime}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {lastSegment
                            ? lastSegment.end - parseInt(process.ArrivalTime)
                            : "-"}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {lastSegment ? lastSegment.end : "-"}
                        </div>
                        <div className="px-1 w-1/6 border-b-2">
                          {lastSegment
                            ? lastSegment.end -
                              parseInt(process.ArrivalTime) -
                              process.CompletionTime
                            : "-"}
                        </div>
                      </div>
                    );
                  })}
                {priorityActive &&
                  processList.map((process, index) => {
                    // Find all segments of the same process in srtfGanttChart
                    const processSegments = priorityGanttChart.filter(
                      (entry) => entry.processId === process.PID
                    );

                    // Get the last segment
                    const lastSegment =
                      processSegments[processSegments.length - 1];

                    return (
                      <div key={index} className="flex flex-row text-center">
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {process.PID}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {process.ArrivalTime}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {process.CompletionTime}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {lastSegment
                            ? lastSegment.end - parseInt(process.ArrivalTime)
                            : "-"}
                        </div>
                        <div className="px-1 w-1/6 border-r-2 border-b-2">
                          {lastSegment ? lastSegment.end : "-"}
                        </div>
                        <div className="px-1 w-1/6 border-b-2">
                          {lastSegment
                            ? lastSegment.end -
                              parseInt(process.ArrivalTime) -
                              process.CompletionTime
                            : "-"}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* gantt chart  */}
            <div className="ml-2 rounded w-[95%] border-black border-2 my-5 h-[250px] flex flex-row overflow-x-scroll">
              <div className="border-r-black sticky text-white border-r-2 text-center h-full w-[9%] flex flex-col xs:w-[15%]">
                <div className="border-y-2 bg-black border-black w-full h-[30px] truncate">
                  {`TIME-->`}
                </div>
                <div className="border-y-2 bg-black border-black w-full h-[30px] mt-5">
                  FCFS
                </div>
                <div className="w-full border-y-2 bg-black border-black my-2 h-[30px]">
                  SJF
                </div>
                <div className="border-y-2 bg-black border-black w-full h-[30px]">
                  SRTF
                </div>
                <div className="w-full border-y-2 bg-black border-black my-2 h-[30px]">
                  RR
                </div>
                {withPriority && <div className="border-y-2 bg-black border-black w-full h-[30px]">
                  PBS
                </div>}
              </div>
              <div className="w-[91%] flex flex-col overflow-x-scroll">
                <div className="w-full flex flex-row h-[30px]">
                  {Array.from({ length: divCount }, (_, index) => (
                    <div
                      key={index}
                      className="text-center"
                      style={{
                        borderRight: "2px solid black",
                        borderBottom: "2px solid black",
                        width: "60px",
                        height: "30px",
                        flex: "0 0 auto",
                      }}
                    >
                      {index}
                    </div>
                  ))}
                </div>
                <div className=" mt-5 h-[30px] flex flex-row text-center">
                  {fcfsActive ? renderFCFSGanttChart() : null}
                </div>
                <div className="my-2 h-[30px] flex flex-row text-center">
                  {sjfActive ? renderSJFGanttChart(sjfGanttChart) : null}
                </div>
                <div className="h-[30px] flex flex-row text-center">
                  {srtfActive ? renderSRTFGanttChart(srtfGanttChart) : null}
                </div>
                <div className="my-2 h-[30px] flex flex-row text-center">
                  {rrActive ? renderRRGanttChart() : null}
                </div>
                <div className="h-[30px] flex flex-row text-center">
                  {withPriority && priorityActive ? renderPriorityGanttChart() : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* right box */}
        <div className="w-1/3 border-2 border-black rounded h-full my-2 mx-3 md:w-[98%] xs:w-[95%]">
          <p className="text-center w-full font-bold">Performance Criteria</p>
          <div className="w-full flex flex-col">
            {/* div1 */}
            <div className="h-1/5 my-5 w-full">
              <p className="px-5 font-semibold">First Come First Serve (FCFS)</p>
              <p className="px-2">
                Turnaround Time :{" "}
                {fcfsActive
                  ? calculateTotalTatFcfs(fcfsGanttChart, processList)
                  : null}
              </p>
              <p className="px-2">
                Waiting Time :{" "}
                {fcfsActive
                  ? calculateTotalWaitingTimeFCFS(fcfsGanttChart, processList)
                  : null}
              </p>
              <p className="px-2">
                Avg. Turnaround Time :{" "}
                {fcfsActive
                  ? calculateAverageTatFcfs(
                      fcfsGanttChart,
                      processList
                    ).toFixed(2)
                  : null}
              </p>
              <p className="px-2">
                Avg. Waiting Time :{" "}
                {fcfsActive
                  ? calculateAverageWaitingTimeFCFS(
                      fcfsGanttChart,
                      processList
                    ).toFixed(2)
                  : null}
              </p>
            </div>
            <div className="h-1/5">
              <p className="px-5 font-semibold">Shortest Job First (SJF)</p>
              <p className="px-2">
                Turnaround Time :{" "}
                {sjfActive
                  ? calculateTotalTatSjf(sjfGanttChart, processList)
                  : null}
              </p>
              <p className="px-2">
                Waiting Time :{" "}
                {sjfActive
                  ? calculateTotalWaitingTimeSjf(sjfGanttChart, processList)
                  : null}
              </p>
              <p className="px-2">
                Avg. Turnaround Time :{" "}
                {sjfActive
                  ? calculateAverageTatSjf(sjfGanttChart, processList).toFixed(
                      2
                    )
                  : null}
              </p>
              <p className="px-2">
                Avg. Waiting Time :{" "}
                {sjfActive
                  ? calculateAverageWaitingTimeSjf(
                      sjfGanttChart,
                      processList
                    ).toFixed(2)
                  : null}
              </p>
            </div>
            <div className="h-1/5 my-5">
              <p className="px-5 font-semibold">Shortest Time Remaining First (SRTF)</p>
              <p className="px-2">
                Turnaround Time :{" "}
                {srtfActive
                  ? calculateTotalTatSrtf(srtfGanttChart, processList)
                  : null}
              </p>
              <p className="px-2">
                Waiting Time :{" "}
                {srtfActive
                  ? calculateTotalWaitingTimeSrtf(srtfGanttChart, processList)
                  : null}
              </p>
              <p className="px-2">
                Avg. Turnaround Time :{" "}
                {srtfActive
                  ? calculateAverageTatSrtf(
                      srtfGanttChart,
                      processList
                    ).toFixed(2)
                  : null}
              </p>
              <p className="px-2">
                Avg. Waiting Time :{" "}
                {srtfActive
                  ? calculateAverageWaitingTimeSrtf(
                      srtfGanttChart,
                      processList
                    ).toFixed(2)
                  : null}
              </p>
            </div>
            <div className="h-1/5">
              <p className="px-5 font-semibold">Round Robin (RR)</p>
              <p className="px-2">
                Turnaround Time :{" "}
                {rrActive
                  ? calculateTotalTatRr(rrGanttChart, processList)
                  : null}
              </p>
              <p className="px-2">
                Waiting Time :{" "}
                {rrActive
                  ? calculateTotalWaitingTimeRr(rrGanttChart, processList)
                  : null}
              </p>
              <p className="px-2">
                Avg. Turnaround Time :{" "}
                {rrActive
                  ? calculateAverageTatRr(rrGanttChart, processList).toFixed(2)
                  : null}
              </p>
              <p className="px-2">
                Avg. Waiting Time :{" "}
                {rrActive
                  ? calculateAverageWaitingTimeRr(
                      rrGanttChart,
                      processList
                    ).toFixed(2)
                  : null}
              </p>
            </div>
            <div className=" h-1/5 my-5">
              <p className="px-5 font-semibold">Priority Based Scheduling (PBS)</p>
              <p className="px-2">
                Turnaround Time :{" "}
                {priorityActive
                  ? calculateTotalTatPriority(priorityGanttChart, processList)
                  : null}
              </p>
              <p className="px-2">
                Waiting Time :{" "}
                {priorityActive
                  ? calculateTotalWaitingTimePriority(
                      priorityGanttChart,
                      processList
                    )
                  : null}
              </p>
              <p className="px-2">
                Avg. Turnaround Time :{" "}
                {priorityActive
                  ? calculateAverageTatPriority(
                      priorityGanttChart,
                      processList
                    ).toFixed(2)
                  : null}
              </p>
              <p className="px-2">
                Avg. Waiting Time :{" "}
                {priorityActive
                  ? calculateAverageWaitingTimePriority(
                      priorityGanttChart,
                      processList
                    ).toFixed(2)
                  : null}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProcessScheduling;
