import React, { useState, useEffect } from "react";
import PCB from "../components/PCB";
import PMT from "../components/PMT";
import FMT from "../components/FMT";
import SMT from "../components/SMT";

const VirtualMemory = () => {
  const [pagingType, setPagingType] = useState("paging");
  const [okClicked, setOkClicked] = useState(false);
  const [memorySize, setMemorySize] = useState(0);
  const [frameSize, setFrameSize] = useState(0);
  const [segmentSize, setSegmentSize] = useState(0);
  const [executingProcess, setExecutingProcess] = useState(0);
  const [allocationData, setAllocationData] = useState([]);
  const [fmtFrameData, setFmtFrameData] = useState([]);
  const [smtFrameData, setSmtFrameData] = useState([]);
  const [pmtFrameData, setPmtFrameData] = useState([]);
  const [fmtData, setFmtData] = useState([]);
  const [pmtData, setPmtData] = useState([]);
  const [smtData, setSmtData] = useState([]);
  const [processSize, setProcessSize] = useState(0);
  const [pidCounter, setPidCounter] = useState(0);
  const [pmtAllocatedFrames, setPmtAllocatedFrames] = useState(0);
  const [smtAllocatedFrames, setSmtAllocatedFrames] = useState(0);
  const [availablePids, setAvailablePids] = useState([]);
  const [removedPids, setRemovedPids] = useState([]);

  const handleRadioChange = (event) => {
    setPagingType(event.target.value);
    handleClear();
  };

  const handleMemorySizeChange = (event) => {
    const newMemorySize = parseInt(event.target.value);
    if (newMemorySize < 0) {
      alert("Memory size cannot be negative");
    } else if (newMemorySize > 0) {
      setMemorySize(newMemorySize);
    }
  };

  const handleFrameSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setFrameSize(newSize);
    if (newSize <= 0 || newSize >= memorySize) {
      alert("Frame size must be greater than 0 and less than the memory size.");
    } else if (memorySize % newSize !== 0) {
      alert("Frame size must be a divisor of memory size.");
    } else {
      const newFrameData = Array((memorySize / newSize) * 4).fill({
        color: "white",
      });
      setFmtFrameData(newFrameData);
      if (pagingType === "paging") {
        const newPmtFrameData = Array(memorySize / newSize).fill({
          color: "white",
        });
        setPmtFrameData(newPmtFrameData);
      } else {
        const newSmtFrameData = Array(memorySize / newSize).fill({
          color: "white",
        });
        setSmtFrameData(newSmtFrameData);
      }
    }
  };

  const handleSegmentSizeChange = (event) => {
    const newSegmentSize = parseInt(event.target.value);
    setSegmentSize(newSegmentSize);
    if (newSegmentSize <= 0) {
      alert("Segment size must be a positive number");
    } else if (newSegmentSize <= frameSize || newSegmentSize >= memorySize) {
      alert(
        "Segment size must be greater than Frame size and must be less than Memory size"
      );
    }
  };

  const handleExecuteProcessChange = (event) => {
    const newExecutingProcess = event.target.value;
    setExecutingProcess(newExecutingProcess);
    alert(
      "In virtual memory concepts, changing the executing process typically involves context switching, where the CPU switches from executing one process to another. When you change the executing process, several important steps need to be taken: \n\n1. Save the State of the Current Process: The CPU needs to save the state of the currently executing process, including the values of CPU registers, program counter, and other relevant information. This step is crucial to resume the process later in the same state.\n\n2. Load the State of the New Process: The CPU needs to load the state of the new process that is about to be executed. This involves setting the program counter to the starting address of the new process and restoring the values of CPU registers to what they were when the new process was last running. \n\n3. Memory Management: The memory management unit (MMU) may need to be updated to reflect the memory space of the new process. This often includes updating the page table or segment table to map the process's logical addresses to physical memory addresses correctly. \n\n4. Cache Management: Depending on the architecture, CPU caches may need to be flushed or updated to ensure that the new process operates with accurate data. \n\n5. I/O State: If the processes use I/O devices, the state of these devices may need to be saved and restored as well. \n\n6. Control Transfer: Finally, control is transferred to the new process, and it continues its execution from where it left off. \n\nContext switching is a complex operation, and it's usually managed by the operating system's kernel. The operating system ensures that processes are scheduled fairly and efficiently."
    );
  };

  const handleOkClicked = () => {
    setOkClicked(true);
  };

  const handleClear = () => {
    setMemorySize(0);
    setFrameSize(0);
    setSegmentSize(0);
    setExecutingProcess(1);
    setOkClicked(false);
    setProcessSize(0);
    setFmtFrameData([]);
    setSmtFrameData([]);
    setPmtFrameData([]);
    setFmtData([]);
    setPmtData([]);
    setSmtData([]);
    setAllocationData([]);
    setPidCounter(0);
    setPmtAllocatedFrames(0);
    setRemovedPids([]);
    setAvailablePids([]);
  };

  const handleAddProcess = () => {
    const inputSize = prompt("Enter process size:");
    if (inputSize !== null) {
      const newSize = parseInt(inputSize, 10);
      if (newSize <= 0 || newSize > memorySize) {
        alert("Invalid process size.");
      } else if (pagingType === "paging") {
        const numFreeFrames = fmtFrameData.filter(
          (frame) => frame.color === "white"
        ).length;

        if (numFreeFrames * frameSize >= newSize) {
          setProcessSize(newSize);
          setPidCounter((prevCounter) => prevCounter + 1);
        } else {
          alert("Insufficient Memory.");
        }
      } else {
        const numFreeFrames = smtFrameData.filter(
          (frame) => frame.color === "white"
        ).length;
        const numFramesPerSegment = Math.ceil(segmentSize / frameSize);
        let smtNumSegmentsNeeded = Math.ceil(newSize / (segmentSize * 2));
        let smtNumFramesNeeded = Math.ceil(
          numFramesPerSegment * smtNumSegmentsNeeded
        );
        if (numFreeFrames >= smtNumFramesNeeded) {
          setProcessSize(newSize);
          setPidCounter((prevCounter) => prevCounter + 1);
        } else {
          alert("Insufficient Memory.");
        }
      }
    }
  };

  const handleRemoveProcess = () => {
    const inputPid = prompt("Enter the PID to remove:");
    const pidToRemove = parseInt(inputPid, 10);

    if (
      inputPid !== null &&
      pidToRemove >= 1 &&
      pidToRemove <= pidCounter &&
      !removedPids.includes(pidToRemove)
    ) {
      setRemovedPids((prevRemovedPids) => [...prevRemovedPids, pidToRemove]);

      setFmtData((prevData) =>
        prevData.filter((entry) => entry.PID !== pidToRemove)
      );
      setFmtFrameData((prevData) =>
        prevData.map((frame) =>
          frame.pid === pidToRemove ? { color: "white" } : frame
        )
      );
      if (pagingType === "paging") {
        let framesAllocatedToRemovedProcess = 0;
        pmtData.forEach((entry) => {
          if (entry.PID === pidToRemove) {
            framesAllocatedToRemovedProcess +=
              entry.PageFrameID.split(",").length;
          }
        });
        setPmtData((prevPmtData) =>
          prevPmtData.filter((entry) => entry.PID !== pidToRemove)
        );
        setPmtFrameData((prevData) =>
          prevData.map((frame) =>
            frame.pid === pidToRemove ? { color: "white" } : frame
          )
        );
        setPmtAllocatedFrames(
          (prevCount) => prevCount - framesAllocatedToRemovedProcess
        );
      } else {
        let framesAllocatedToRemovedProcess = 0;
        smtData.forEach((entry) => {
          if (entry.PID === pidToRemove) {
            framesAllocatedToRemovedProcess +=
              entry.PageFrameID.split(",").length;
          }
        });
        setSmtData((prevSmtData) =>
          prevSmtData.filter((entry) => entry.PID !== pidToRemove)
        );
        setSmtFrameData((prevData) =>
          prevData.map((frame) =>
            frame.pid === pidToRemove ? { color: "white" } : frame
          )
        );
        setSmtAllocatedFrames(
          (prevCount) => prevCount - framesAllocatedToRemovedProcess
        );
      }
      setAllocationData((prevData) =>
        prevData.filter((allocation) => allocation.id !== pidToRemove)
      );
      const updatedAvailablePids = availablePids.filter(
        (pid) => pid !== pidToRemove
      );
      setAvailablePids(updatedAvailablePids);
    } else if (removedPids.includes(pidToRemove)) {
      alert("This PID is already removed.");
    } else {
      alert("Please enter a valid PID.");
    }
  };

  const allocateFrames = () => {
    const color = getRandomColor();
    let fmtNumFramesNeeded = Math.ceil(processSize / frameSize);
    let fmtAllocatedFrameIds = [];
    let pmtAllocatedFrameIds = [];
    let smtAllocatedFrameIds = [];
    for (let i = 0; i < fmtFrameData.length; i++) {
      if (fmtFrameData[i].color === "white" && fmtNumFramesNeeded > 0) {
        fmtFrameData[i] = { color, pid: pidCounter };
        fmtAllocatedFrameIds.push(i + 1);
        fmtNumFramesNeeded--;
      }
    }
    setFmtData((prevData) => [
      ...prevData,
      {
        PID: pidCounter,
        PageFrameID: fmtAllocatedFrameIds.join(", "),
      },
    ]);
    if (pagingType === "paging") {
      let pmtNumFramesNeeded = Math.ceil(processSize / (frameSize * 4));
      for (let i = 0; i < pmtFrameData.length; i++) {
        if (pmtFrameData[i].color === "white" && pmtNumFramesNeeded > 0) {
          pmtFrameData[i] = { color, pid: pidCounter };
          pmtAllocatedFrameIds.push(i + 1);
          pmtNumFramesNeeded--;
          setPmtAllocatedFrames((prevCount) => prevCount + 1);
        }
      }
      setPmtData((prevData) => [
        ...prevData,
        {
          PID: pidCounter,
          PageFrameID: pmtAllocatedFrameIds.join(", "),
        },
      ]);
    } else {
      const numFramesPerSegment = Math.ceil(segmentSize / frameSize);
      let smtNumSegmentsNeeded = Math.ceil(processSize / (segmentSize * 2));
      let smtNumFramesNeeded = Math.ceil(
        numFramesPerSegment * smtNumSegmentsNeeded
      );
      for (let i = 0; i < smtFrameData.length; i++) {
        if (smtFrameData[i].color === "white" && smtNumFramesNeeded > 0) {
          smtFrameData[i] = { color, pid: pidCounter };
          smtAllocatedFrameIds.push(i + 1);
          smtNumFramesNeeded--;
          setSmtAllocatedFrames((prevCount) => prevCount + 1);
        }
      }
      setSmtData((prevData) => [
        ...prevData,
        {
          PID: pidCounter,
          PageFrameID: smtAllocatedFrameIds.join(", "),
        },
      ]);
    }
    setAllocationData((prevData) => [
      ...prevData,
      {
        id: pidCounter,
        size: processSize,
        vmReference: fmtAllocatedFrameIds[0],
        allocation:
          pagingType === "paging"
            ? pmtAllocatedFrameIds[0]
            : smtAllocatedFrameIds[0],
        color: color,
      },
    ]);
    setAvailablePids((prevAvailablePids) => [...prevAvailablePids, pidCounter]);
  };

  const getRandomColor = () => {
    let r, g, b;
    r = Math.floor(Math.random() * 100) + 100;
    g = Math.floor(Math.random() * 100) + 100;
    b = Math.floor(Math.random() * 100) + 100;
    const color = `rgb(${r},${g},${b})`;
    return color;
  };

  useEffect(() => {
    if (processSize > 0) {
      allocateFrames();
      setProcessSize(0);
    }
  }, [processSize]);

  const frameCount = memorySize / frameSize;
  const numColumns =
    parseInt(Math.sqrt(frameCount)) > 10 ? 10 : parseInt(Math.sqrt(frameCount));
  const numRowsPerColumn =
    Math.ceil(frameCount / numColumns) > 10
      ? 10
      : Math.ceil(frameCount / numColumns);
  const fmtFrameCount = frameCount * 4;
  const fmtNumColumns =
    parseInt(Math.sqrt(fmtFrameCount)) > 10
      ? 10
      : parseInt(Math.sqrt(fmtFrameCount));
  const fmtNumRowsPerColumn =
    Math.ceil(fmtFrameCount / fmtNumColumns) > 10
      ? 10
      : Math.ceil(fmtFrameCount / fmtNumColumns);

  return (
    <div className="bg-[#FFFFD2] h-screen overflow-scroll">
      <div className="flex flex-wrap items-center justify-evenly p-2">
        <div className="flex-wrap flex items-center justify-center p-2">
          <label>Memory Size :</label>
          <input
            type="number"
            name="size"
            className="border-2 border-black mx-5 rounded-md px-[4px] py-[1px] flex bg-transparent"
            onChange={handleMemorySizeChange}
            value={memorySize.toString()}
          />
        </div>
        <label>
          <input
            type="radio"
            name="pagingType"
            value="paging"
            className="mr-1"
            onChange={handleRadioChange}
            checked={pagingType === "paging"}
          />
          Paging
        </label>
        <label>
          <input
            type="radio"
            name="pagingType"
            value="segmentedPaging"
            className="ml-5 mr-1"
            onChange={handleRadioChange}
            checked={pagingType === "segmentedPaging"}
          />
          Segmented Paging
        </label>
      </div>
      <div className="w-full p-5 flex-row flex md:flex-col">
        <div className="border-r-black border md:border-b-black md:border-r-0 w-1/3 flex flex-col h-[525px] md:w-full bg-[#C5FAD5]">
          <div className="w-full flex-col flex items-center justify-center h-[350px]">
            <div className="flex flex-wrap p-2 items-center justify-center">
              <label className="flex">Page Frame Size :</label>
              <input
                type="number"
                name="pageFrameSize"
                className="border-2 border-black mx-5 rounded-md px-[4px] py-[1px] flex bg-transparent"
                onChange={handleFrameSizeChange}
                value={frameSize.toString()}
                disabled={memorySize === 0 || isNaN(memorySize)}
              />
            </div>
            {pagingType === "segmentedPaging" && (
              <div className="flex flex-wrap p-2 items-center justify-center">
                <label className="flex">Segment Size :</label>
                <input
                  type="number"
                  name="segmentSize"
                  className="border-2 border-black mx-5 rounded-md px-[4px] py-[1px] flex bg-transparent"
                  onChange={handleSegmentSizeChange}
                  value={segmentSize.toString()}
                  disabled={memorySize === 0 || isNaN(memorySize)}
                />
              </div>
            )}
            <div className="p-2 items-center justify-center flex">
              <label>Execute Process :</label>
              <select
                id="executingProcess"
                name="executingProcess"
                className="mx-2 border-2 border-black rounded-md bg-transparent"
                onChange={handleExecuteProcessChange}
                value={executingProcess}
              >
                {availablePids.map((pid) => (
                  <option key={pid} value={pid}>
                    {pid}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <PCB allocationData={allocationData} source="VM" />
        </div>
        <div className="border-x-black border md:border-y-black md:border-x-0 w-1/3 flex flex-col md:w-full bg-[#C5FAD5]">
          {pagingType === "paging" && okClicked && (
            <PMT
              pmtData={pmtData}
              fmtData={fmtData}
              pmtFrameData={pmtFrameData}
              numColumns={numColumns}
              numRowsPerColumn={numRowsPerColumn}
            />
          )}
          {pagingType === "segmentedPaging" && okClicked && (
            <SMT
              smtData={smtData}
              fmtData={fmtData}
              smtFrameData={smtFrameData}
              numColumns={numColumns}
              numRowsPerColumn={numRowsPerColumn}
              numFramesPerSegment={Math.ceil(segmentSize / frameSize)}
            />
          )}
        </div>
        <div className="border-l-black border md:border-t-black md:border-l-0 w-1/3 flex flex-col md:w-full bg-[#C5FAD5]">
          {okClicked && (
            <FMT
              fmtData={fmtData}
              fmtFrameData={fmtFrameData}
              numColumns={fmtNumColumns}
              numRowsPerColumn={fmtNumRowsPerColumn}
            />
          )}
        </div>
      </div>
      <div className="w-full flex flex-wrap p-2">
        <div className="w-1/2 flex justify-evenly flex-wrap">
          <input
            type="button"
            value="OK"
            className="button"
            onClick={handleOkClicked}
            disabled={memorySize <= 0 || isNaN(memorySize) || memorySize % frameSize !== 0}
          />
          <input
            type="button"
            value="CLEAR"
            className="button"
            onClick={handleClear}
            disabled={memorySize === 0 || isNaN(memorySize)}
          />
        </div>
        <div className="w-1/2 flex justify-evenly flex-wrap">
          <input
            type="button"
            value="Add Process"
            className="button"
            onClick={handleAddProcess}
            disabled={
              !okClicked ||
              (pagingType === "paging"
                ? pmtAllocatedFrames === pmtFrameData.length
                : smtAllocatedFrames === smtFrameData.length)
            }
          />

          <input
            type="button"
            value="Remove Process"
            className="button"
            onClick={handleRemoveProcess}
            disabled={allocationData.length === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default VirtualMemory;
