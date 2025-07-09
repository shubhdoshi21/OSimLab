import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import PCB from "./PCB";

const NonContigAlloc = (props) => {
  const [frameSize, setFrameSize] = useState("");
  const [okClicked, setOkClicked] = useState(false);
  const [processSize, setProcessSize] = useState(0);
  const [pidCounter, setPidCounter] = useState(1);
  const [allocatedFrameCount, setAllocatedFrameCount] = useState(0);
  const [frameData, setFrameData] = useState([]);
  const [pmtData, setPmtData] = useState([]);
  const [allocationData, setAllocationData] = useState([]);
  const [removedPIDs, setRemovedPIDs] = useState([]);
  const [selectedMapping, setSelectedMapping] = useState([]);
  const [selectedPID, setSelectedPID] = useState(null);

  const handleOpenMappingTable = (pid) => {
    setSelectedPID(pid);
    const mapping = pmtData.find((entry) => entry.PID === pid);
    if (mapping) {
      const frameIDs = mapping.PageFrameID.split(", ");
      setSelectedMapping(frameIDs);
    } else {
      setSelectedMapping([]);
    }
  };

  const handleCloseMappingTable = () => {
    setSelectedPID(null);
    setSelectedMapping([]);
  };

  const handleClear = () => {
    setOkClicked(false);
    props.setMemorySize(0);
    setFrameData(Array(props.memorySize / frameSize).fill({ color: "white" }));
    setProcessSize(0);
    setFrameSize("");
    setPmtData([]);
    setAllocatedFrameCount(0);
    setAllocationData([]);
    setPidCounter(1);
    setRemovedPIDs([]);
  };

  const handleOkClick = () => {
    setOkClicked(true);
  };

  const handleFrameSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setFrameSize(newSize);
    if (newSize <= 0 || newSize >= props.memorySize) {
      alert(
        "Frame size must be greater than 0 & less than " +
          props.memorySize +
          "."
      );
    } else if (props.memorySize % newSize !== 0) {
      alert("Frame size must be a divisor of memory size.");
    } else {
      setFrameData(Array(props.memorySize / newSize).fill({ color: "white" }));
    }
  };

  const handleAddProcess = () => {
    const inputSize = prompt("Enter process size:");
    if (inputSize !== null) {
      const newSize = parseInt(inputSize, 10);
      if (newSize <= 0) {
        alert("Process size must be greater than 0.");
      } else if (allocatedFrameCount * frameSize > props.memorySize - newSize) {
        alert("Insufficient remaining memory frames to allocate this process.");
      } else {
        setProcessSize(newSize);
      }
    }
  };

  const handleRemoveProcess = () => {
    const inputPid = prompt("Enter the PID to remove:");
    const pidToRemove = parseInt(inputPid, 10);
    if (inputPid !== null && pidToRemove < pidCounter) {
      if (!removedPIDs.includes(pidToRemove)) {
        const updatedFrameData = frameData.map((frame, index) => {
          if (frame.pid === pidToRemove) {
            return { color: "white" };
          }
          return frame;
        });
        setFrameData(updatedFrameData);

        const updatedPmtData = pmtData.filter(
          (entry) => entry.PID !== pidToRemove
        );
        setPmtData(updatedPmtData);

        setAllocationData(
          allocationData.filter((allocation) => allocation.id !== pidToRemove)
        );
        const removedAllocations = allocationData.filter(
          (allocation) => allocation.id === pidToRemove
        );
        const framesReleased = removedAllocations.reduce(
          (total, allocation) => total + Math.ceil(allocation.size / frameSize),
          0
        );
        setAllocatedFrameCount((prevCount) => prevCount - framesReleased);
        setRemovedPIDs([...removedPIDs, pidToRemove]);
      } else {
        alert("Process with PID " + pidToRemove + " has already been removed.");
      }
    } else {
      alert("Please enter a valid PID.");
    }
  };

  const allocateFrames = () => {
    const numFramesNeeded = Math.ceil(processSize / frameSize);
    let numFrameAllocated = numFramesNeeded;
    const color = getRandomColor();
    const allocatedFrameIds = [];
    for (let i = 0; i < props.memorySize / frameSize; i++) {
      if (frameData[i].color === "white" && numFrameAllocated > 0) {
        frameData[i] = { color, pid: pidCounter };
        allocatedFrameIds.push(i + 1);
        setAllocatedFrameCount((prevCount) => prevCount + 1);
        numFrameAllocated--;
      }
    }

    if (numFrameAllocated === 0) {
      setPidCounter((prevPid) => prevPid + 1);
      setPmtData((prevData) => [
        ...prevData,
        {
          PID: pidCounter,
          PageFrameID: allocatedFrameIds.join(", "),
        },
      ]);

      const newAllocation = {
        id: pidCounter,
        size: processSize,
        allocation: allocatedFrameIds[0],
        color: color,
      };

      setAllocationData([...allocationData, newAllocation]);
    } else {
      alert("Insufficient memory frames to allocate this process.");
    }
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
    }
  }, [processSize]);

  const frameCount = props.memorySize / frameSize;
  const numColumns =
    parseInt(Math.sqrt(frameCount)) > 10 ? 10 : parseInt(Math.sqrt(frameCount));
  const numRowsPerColumn =
    Math.ceil(frameCount / numColumns) > 10
      ? 10
      : Math.ceil(frameCount / numColumns);
  return (
    <>
      <div className="w-full p-5 flex-row flex sm:flex-col">
        <div className="border-r-black border sm:border-b-black sm:border-r-0 w-1/2 flex flex-col h-[525px] sm:w-full sm:h-auto bg-[#C5FAD5]">
          <div className="w-full flex-wrap flex items-start justify-center px-2 py-10 h-[350px] sm:h-auto">
            <label htmlFor="pageFrameSize">Enter Page Frame Size :</label>
            <input
              id="pageFrameSize"
              type="number"
              className="border-2 border-black mx-5 rounded-md px-[4px] py-[1px] flex bg-transparent"
              value={frameSize}
              onChange={handleFrameSizeChange}
              disabled={props.memorySize === 0 || isNaN(props.memorySize)}
            />
          </div>
          <PCB allocationData={allocationData} source="MM" />
        </div>
        <div className="border-l-black border sm:border-t-black sm:border-l-0 w-1/2 flex flex-col sm:w-full bg-[#C5FAD5]">
          {okClicked && (
            <div className="w-full flex-col flex items-center justify-center h-full ">
              <div className="h-5 flex flex-row items-center justify-center mt-2">
                PMT(Page Mapping Table)
                {selectedPID !== null && (
                  <AiOutlineCloseCircle
                    size={15}
                    className="mx-1"
                    onClick={handleCloseMappingTable}
                  />
                )}
              </div>
              <div
                className={`border border-black w-11/12 h-[100px] m-1 relative ${
                  selectedPID !== null ? "overflow-clip" : "overflow-scroll"
                }`}
              >
                <div className="flex flex-row w-full sticky top-0 bg-[#AA96DA] text-white z-10 ">
                  <div className="items-center justify-center text-sm flex h-1/5 w-1/2 border border-r-white border-transparent">
                    PID
                  </div>
                  {selectedPID === null && (
                    <div className="items-center justify-center text-sm flex h-1/5 w-1/2 border border-l-white border-transparent">
                      Page Frame ID
                    </div>
                  )}
                </div>
                {pmtData.map((entry, index) => (
                  <div key={index} className={`flex flex-row w-full`}>
                    {selectedPID === entry.PID && (
                      <div
                        className={`items-center justify-center text-sm flex h-1/5 border ${entry.cssClass} w-1/2`}
                      >
                        {entry.PID}
                      </div>
                    )}
                    {selectedPID === null && (
                      <div
                        className={`items-center justify-center text-sm flex h-1/5 border w-1/2`}
                      >
                        {entry.PID}
                      </div>
                    )}
                    {selectedPID === null && (
                      <div
                        className="items-center justify-center text-center text-sm flex h-1/5 w-1/2 border"
                        onClick={() => handleOpenMappingTable(entry.PID)}
                      >
                        {entry.PageFrameID}
                      </div>
                    )}
                  </div>
                ))}
                {selectedPID !== null && (
                  <div className="w-1/2 h-[100px] right-0 overflow-scroll absolute text-sm text-center top-0">
                    <div className="flex flex-row w-full sticky top-0 bg-transparent text-white z-10">
                      <div className="items-center justify-center text-sm flex h-1/5 w-1/2 border border-x-white border-transparent truncate">
                        Page No.
                      </div>
                      <div className="items-center justify-center text-sm flex h-1/5 w-1/2 border border-l-white border-transparent truncate">
                        Page Frame ID
                      </div>
                    </div>
                    {selectedMapping.map((frameID, index) => (
                      <div key={index} className="flex flex-row w-full">
                        <div className="items-center justify-center text-sm flex h-1/5 w-1/2 border">
                          {index}
                        </div>
                        <div className="items-center justify-center text-sm flex h-1/5 w-1/2 border">
                          {frameID}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border border-black w-11/12 h-[350px] m-2 flex flex-wrap bg-[#C5FAD5] overflow-scroll">
                {frameData.map((frame, index) => (
                  <div
                    key={index}
                    id="main"
                    className="text-center text-sm p-0"
                    style={{
                      zIndex: "1",
                      border: "1px solid black",
                      width: `${100 / numColumns}%`,
                      height: `${350 / numRowsPerColumn}px`,
                      backgroundColor: frame.color,
                    }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex flex-wrap p-2">
        <div className="w-1/2 flex justify-evenly flex-wrap">
          <input
            type="button"
            value="OK"
            className="button"
            onClick={handleOkClick}
            disabled={
              frameSize <= 0 ||
              frameSize >= props.memorySize ||
              props.memorySize % frameSize !== 0 ||
              isNaN(props.memorySize)
            }
          />
          <input
            type="button"
            value="CLEAR"
            className="button"
            onClick={handleClear}
            disabled={props.memorySize === 0 || isNaN(props.memorySize)}
          />
        </div>
        <div className="w-1/2 flex justify-evenly flex-wrap">
          <input
            type="button"
            value="Add Process"
            className="button"
            onClick={handleAddProcess}
            disabled={!okClicked || allocatedFrameCount === frameCount}
          />
          <input
            type="button"
            value="Remove Process"
            className="button"
            onClick={handleRemoveProcess}
            disabled={!okClicked || allocatedFrameCount === 0}
          />
        </div>
      </div>
    </>
  );
};

export default NonContigAlloc;
