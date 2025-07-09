import React, { useState, useEffect } from "react";
import PCB from "./PCB";

const ContigAlloc = (props) => {
  const [selectedStrategy, setSelectedStrategy] = useState("ff");
  const [partitionType, setPartitionType] = useState("static");
  const [partitionSize, setPartitionSize] = useState(10);
  const [totalAllocatedSize, setTotalAllocatedSize] = useState(0);
  const [compactionHandler, setCompactionHandler] = useState(0);
  const [pidCounter, setPidCounter] = useState(1);
  const [partitions, setPartitions] = useState([]);
  const [memoryBlocksData, setMemoryBlocksData] = useState([]);
  const [pdtData, setPdtData] = useState([]);
  const [allocationData, setAllocationData] = useState([]);
  const [removedPIDs, setRemovedPIDs] = useState([]);
  const [okClicked, setOkClicked] = useState(false);
  const [compactionEnabled, setCompactionEnabled] = useState(false);
  const [allPartitionsAllocated, setAllPartitionsAllocated] = useState(false);
  const [nextFitIndex, setNextFitIndex] = useState(0);

  useEffect(() => {
    if (
      props.memorySize > 0 &&
      pdtData.length === 0 &&
      !isNaN(props.memorySize)
    ) {
      const initialBlocks = Array(props.memorySize).fill("transparent");
      setMemoryBlocksData(initialBlocks);
    }
  }, [props.memorySize]);
  useEffect(() => {
    if (compactionEnabled) {
      let base0 = 0;
      const updatedPdtData = allocationData.map((process) => {
        const pdtEntry = pdtData.find((entry) => entry.partNo === process.id);
        const updatedEntry = {
          ...pdtEntry,
          base: base0,
        };
        base0 += pdtEntry.size;
        return updatedEntry;
      });
      const updatedMemoryBlocksData = Array(props.memorySize).fill(
        "transparent"
      );
      let base = 0;
      allocationData.forEach((process) => {
        const color = process.color;
        for (let i = base; i < base + process.size; i++) {
          updatedMemoryBlocksData[i] = color;
        }
        base += process.size;
      });
      setPdtData(updatedPdtData);
      setMemoryBlocksData(updatedMemoryBlocksData);
      setCompactionHandler(0);
    }
  }, [compactionHandler]);

  const handleClear = () => {
    setSelectedStrategy("ff");
    setPartitionSize(10);
    setPartitions([]);
    props.setMemorySize(0);
    setCompactionEnabled(false);
    setOkClicked(false);
    setPdtData([]);
    setAllocationData([]);
    setPidCounter(1);
    setTotalAllocatedSize(0);
    setRemovedPIDs([]);
    if (props.memorySize > 0 && !isNaN(props.memorySize)) {
      const initialBlocks = Array(props.memorySize).fill("transparent");
      setMemoryBlocksData(initialBlocks);
      setAllPartitionsAllocated(false);
    }
  };

  const handleOkClicked = () => {
    if (partitionType === "static") {
      const totalPartitionSize = partitions.reduce(
        (acc, partition) => acc + partition.size,
        0
      );
      const remainingMemory = props.memorySize - totalPartitionSize;
      if (remainingMemory >= 10) {
        const newPartition = {
          size: remainingMemory,
        };
        setPartitions([...partitions, newPartition]);
        alert(
          "Total size of partitions != Total memory size -> considering new last partition of size " +
            remainingMemory
        );
      }
      let base1 = 0;
      const copiedPdtData = partitions.map((partition, index) => {
        const newBase = base1 + (index > 0 ? partitions[index - 1].size : 0);
        base1 = newBase;
        return {
          partNo: index + 1,
          base: newBase,
          size: partition.size,
          allocated: false,
        };
      });
      if (remainingMemory >= 10) {
        copiedPdtData.push({
          partNo: partitions.length + 1,
          base:
            base1 +
            (partitions.length > 0
              ? partitions[partitions.length - 1].size
              : 0),
          size: remainingMemory,
          allocated: false,
        });
      }
      setPdtData(copiedPdtData);
    }
    setOkClicked(true);
  };

  const handleRadioChange = (event) => {
    setSelectedStrategy(event.target.value);
  };

  const handlePartitionSizeChange = (event) => {
    const newPartitionSize = parseInt(event.target.value, 10);
    const totalPartitionSize = partitions.reduce(
      (acc, partition) => acc + partition.size,
      0
    );
    const remainingMemory = props.memorySize - totalPartitionSize;
    if (newPartitionSize < 10 || newPartitionSize > remainingMemory) {
      alert("Partition size must be >= 10 and <= " + remainingMemory);
    }
    setPartitionSize(newPartitionSize);
  };

  const handleAddPartition = () => {
    if (partitionSize >= 10 && partitionSize <= props.memorySize) {
      const newPartition = {
        size: partitionSize,
      };
      const totalPartitionSize = partitions.reduce(
        (acc, partition) => acc + partition.size,
        0
      );
      if (totalPartitionSize + partitionSize <= props.memorySize) {
        setPartitions([...partitions, newPartition]);
        // if (totalPartitionSize + partitionSize === props.memorySize) {
        //   setOkClicked(true);
        // }
      } else {
        alert(
          "Adding this partition would exceed the available memory size. Reduce partition size or remove existing partitions."
        );
      }
    }
  };

  const handleRemovePartition = () => {
    const input = prompt("Enter the partition number to remove:");
    if (input === null) return;
    const partitionIndexToRemove = parseInt(input, 10);
    if (
      !isNaN(partitionIndexToRemove) &&
      partitionIndexToRemove >= 1 &&
      partitionIndexToRemove <= partitions.length
    ) {
      const updatedPartitions = partitions.filter(
        (_, index) => index !== partitionIndexToRemove - 1
      );
      setPartitions(updatedPartitions);
      document.getElementById("addButton").disabled = false;
    } else {
      alert("Please enter a valid partition number to remove.");
    }
  };

  const findPartitionForAllocation = (processSize) => {
    if (selectedStrategy === "ff") {
      // First Fit algorithm
      for (let i = 0; i < pdtData.length; i++) {
        if (!pdtData[i].allocated && pdtData[i].size >= processSize) {
          pdtData[i].allocated = true;
          return pdtData[i].partNo;
        }
      }
    } else if (selectedStrategy === "bf") {
      // Best Fit algorithm
      let bestFitPartition = null;
      let bestFitIndex = -1;
      for (let i = 0; i < pdtData.length; i++) {
        if (!pdtData[i].allocated && pdtData[i].size >= processSize) {
          if (
            bestFitPartition === null ||
            pdtData[i].size < bestFitPartition.size
          ) {
            bestFitPartition = pdtData[i];
            bestFitIndex = i;
          }
        }
      }
      if (bestFitIndex !== -1) {
        pdtData[bestFitIndex].allocated = true;
        return pdtData[bestFitIndex].partNo;
      }
    } else if (selectedStrategy === "wf") {
      // Worst Fit algorithm
      let worstFitPartition = null;
      let worstFitIndex = -1;
      for (let i = 0; i < pdtData.length; i++) {
        if (!pdtData[i].allocated && pdtData[i].size >= processSize) {
          if (
            worstFitPartition === null ||
            pdtData[i].size > worstFitPartition.size
          ) {
            worstFitPartition = pdtData[i];
            worstFitIndex = i;
          }
        }
      }
      if (worstFitIndex !== -1) {
        pdtData[worstFitIndex].allocated = true;
        return pdtData[worstFitIndex].partNo;
      }
    } else if (selectedStrategy === "next") {
      // Next Fit algorithm
      for (let i = nextFitIndex; i < pdtData.length; i++) {
        if (!pdtData[i].allocated && pdtData[i].size >= processSize) {
          pdtData[i].allocated = true;
          setNextFitIndex((i + 1) % pdtData.length); // Update nextFitIndex
          return pdtData[i].partNo;
        }
      }
      for (let i = 0; i < nextFitIndex; i++) {
        if (!pdtData[i].allocated && pdtData[i].size >= processSize) {
          pdtData[i].allocated = true;
          setNextFitIndex((i + 1) % pdtData.length); // Wrap around and update nextFitIndex
          return pdtData[i].partNo;
        }
      }
    }
    return -1;
  };

  const handleAddProcess = () => {
    const input = prompt("Enter the size of the process:");
    if (input === null) return;
    const newSize = parseInt(input, 10);

    if (partitionType === "dynamic" && !isNaN(newSize) && newSize > 0) {
      if (totalAllocatedSize + newSize <= props.memorySize) {
        let strategyMemoryBlocks = [...memoryBlocksData];
        let base = -1;
        let compactionNeeded = true;
        if (selectedStrategy === "ff") {
          base = findFirstFitBaseForProcess(newSize);
          if (base !== -1) compactionNeeded = false;
        } else if (selectedStrategy === "bf") {
          base = findBestFitBaseForProcess(newSize);
          if (base !== -1) compactionNeeded = false;
        } else if (selectedStrategy === "wf") {
          base = findWorstFitBaseForProcess(newSize);
          if (base !== -1) compactionNeeded = false;
        } else if (selectedStrategy === "next") {
          base = findNextFitBaseForProcess(newSize);
          if (base !== -1) compactionNeeded = false;
        }

        const color = getRandomColor();
        const newAllocation = {
          id: pidCounter,
          size: newSize,
          allocation: pidCounter,
          color: color,
        };
        setAllocationData([...allocationData, newAllocation]);

        const newPdtEntry = {
          partNo: pidCounter,
          base,
          size: newSize,
          allocated: true,
        };

        setPdtData([...pdtData, newPdtEntry]);
        setTotalAllocatedSize(totalAllocatedSize + newSize);

        for (let i = base; i < base + newSize; i++) {
          strategyMemoryBlocks[i] = color;
        }

        setMemoryBlocksData(strategyMemoryBlocks);
        setPidCounter(pidCounter + 1);

        if (compactionNeeded && compactionEnabled) {
          setCompactionHandler(1);
          alert("Used concept of Compaction!");
        }
      } else {
        alert("Entered process size exceeds available memory space.");
      }
    } else {
      if (!isNaN(newSize) && newSize > 0) {
        const allocatedPartitionNo = findPartitionForAllocation(newSize);
        if (allocatedPartitionNo !== -1) {
          const newProcess = {
            id: pidCounter,
            size: newSize,
            color: getRandomColor(),
            allocation: allocatedPartitionNo,
          };

          setAllocationData([...allocationData, newProcess]);
          setPdtData((prevPdtData) =>
            prevPdtData.map((entry) => {
              if (entry.partNo === allocatedPartitionNo) {
                entry.allocated = true;
                entry.id = pidCounter;
              }
              return entry;
            })
          );

          setPidCounter(pidCounter + 1);
          const allPartitionsAllocated = pdtData.every(
            (partition) => partition.allocated
          );
          setAllPartitionsAllocated(allPartitionsAllocated);
        } else {
          alert("Memory allocation failed for the process. Not enough space.");
        }
      } else {
        alert(
          "Memory allocation failed for the process. Memory can't be negative."
        );
      }
    }
  };

  const findFirstFitBaseForProcess = (size) => {
    for (let i = 0; i < memoryBlocksData.length; i++) {
      if (memoryBlocksData[i] === "transparent") {
        let count = 0;
        let base = i;
        while (
          i < memoryBlocksData.length &&
          memoryBlocksData[i] === "transparent" &&
          count < size
        ) {
          count++;
          i++;
        }
        if (count === size) {
          return base;
        }
      }
    }
    return -1;
  };

  const findBestFitBaseForProcess = (size) => {
    let bestFitBase = -1;
    let bestFitSize = Infinity;
    let count = 0;
    let base = -1;
    for (let i = 0; i < memoryBlocksData.length; i++) {
      if (memoryBlocksData[i] === "transparent") {
        if (count === 0) {
          base = i;
        }
        count++;
      } else {
        if (count >= size && count < bestFitSize) {
          bestFitBase = base;
          bestFitSize = count;
        }
        count = 0;
      }
    }
    if (count >= size && count < bestFitSize) {
      bestFitBase = base;
    }
    return bestFitBase;
  };

  const findWorstFitBaseForProcess = (size) => {
    let worstFitBase = -1;
    let worstFitSize = -1;
    let count = 0;
    let base = -1;
    for (let i = 0; i < memoryBlocksData.length; i++) {
      if (memoryBlocksData[i] === "transparent") {
        if (count === 0) {
          base = i;
        }
        count++;
      } else {
        if (count >= size && count > worstFitSize) {
          worstFitBase = base;
          worstFitSize = count;
        }
        count = 0;
      }
    }
    if (count >= size && count > worstFitSize) {
      worstFitBase = base;
    }
    return worstFitBase;
  };

  let nextFitLastIndex = 0;
  const findNextFitBaseForProcess = (size) => {
    let startIndex = nextFitLastIndex;
    let count = 0;
    let base = -1;

    for (let i = startIndex; i < memoryBlocksData.length; i++) {
      if (memoryBlocksData[i] === "transparent") {
        if (count === 0) {
          base = i;
        }
        count++;
      } else {
        if (count >= size) {
          nextFitLastIndex = i;
          return base;
        }
        count = 0;
      }
    }
    if (startIndex > 0) {
      for (let i = 0; i < startIndex; i++) {
        if (memoryBlocksData[i] === "transparent") {
          if (count === 0) {
            base = i;
          }
          count++;
        } else {
          if (count >= size) {
            nextFitLastIndex = i;
            return base;
          }
          count = 0;
        }
      }
    }
    nextFitLastIndex = 0;
    return -1;
  };

  const handleRemoveProcess = () => {
    if (allocationData.length === 0) {
      alert("No processes to remove.");
      return;
    }
    const input = prompt("Enter the ID of the process to remove:");
    if (input === null) return;
    const pidToRemove = parseInt(input, 10);

    if (
      !isNaN(pidToRemove) &&
      partitionType === "static" &&
      pidToRemove < pidCounter
    ) {
      if (removedPIDs.includes(pidToRemove)) {
        alert("This process has already been removed.");
        return;
      }
      const updatedAllocationData = allocationData.filter(
        (process) => process.id !== pidToRemove
      );
      const updatedPdtData = pdtData.map((entry) => {
        if (entry.id === pidToRemove) {
          entry.allocated = false;
          entry.id = null;
        }
        return entry;
      });
      setAllocationData(updatedAllocationData);
      setPdtData(updatedPdtData);
      setRemovedPIDs([...removedPIDs, pidToRemove]);
      const allPartitionsAllocated = pdtData.every(
        (partition) => partition.allocated
      );
      setAllPartitionsAllocated(allPartitionsAllocated);
    } else if (
      !isNaN(pidToRemove) &&
      partitionType === "dynamic" &&
      pidToRemove < pidCounter
    ) {
      if (removedPIDs.includes(pidToRemove)) {
        alert("This process has already been removed.");
        return;
      }
      const processToRemove = allocationData.find(
        (process) => process.id === pidToRemove
      );
      if (processToRemove) {
        const updatedPdtData = pdtData.filter(
          (entry) => entry.partNo !== pidToRemove
        );
        const updatedAllocationData = allocationData.filter(
          (process) => process.id !== pidToRemove
        );
        setPdtData(updatedPdtData);
        setAllocationData(updatedAllocationData);
        setTotalAllocatedSize(totalAllocatedSize - processToRemove.size);
        setRemovedPIDs([...removedPIDs, pidToRemove]);
        freeMemoryBlocks(processToRemove.color);
      }
    } else {
      alert("Please enter a valid PID to remove a process.");
    }
  };

  const freeMemoryBlocks = (color) => {
    const newMemoryBlocks = memoryBlocksData.map((blockColor) =>
      blockColor === color ? "transparent" : blockColor
    );
    setMemoryBlocksData(newMemoryBlocks);
  };

  const getRandomColor = () => {
    let r, g, b;
    r = Math.floor(Math.random() * 100) + 100;
    g = Math.floor(Math.random() * 100) + 100;
    b = Math.floor(Math.random() * 100) + 100;
    const color = `rgb(${r},${g},${b})`;
    return color;
  };

  return (
    <>
      <div className="w-full p-5 flex-row flex sm:flex-col">
        <div className="border-r-black border sm:border-b-black sm:border-r-0 w-1/2 flex flex-col h-[525px] sm:w-full bg-[#C5FAD5]">
          <div className="w-full flex-col flex items-center justify-center h-[350px]">
            <div className="p-2 items-center justify-center xs:text-sm xs:p-1 flex flex-wrap">
              <label htmlFor="partitionType" className="flex">
                Select Partition Type :
              </label>
              <select
                id="partitionType"
                name="partitionType"
                className="mx-2 border-2 rounded-md bg-transparent border-black"
                onChange={(event) => {
                  setPartitionType(event.target.value);
                  handleClear();
                }}
                value={partitionType}
              >
                <option value="static">Static</option>
                <option value="dynamic">Dynamic</option>
              </select>
            </div>
            {partitionType === "static" && (
              <>
                <div className="flex flex-wrap p-2 xs:text-sm xs:p-1 items-center justify-center">
                  <label htmlFor="partitionSize" className="flex">
                    Partition Size :
                  </label>
                  <input
                    type="number"
                    name="partitionSize"
                    id="partitionSize"
                    className="border-2 border-black mx-5 rounded-md px-[4px] py-[1px] flex bg-transparent"
                    onChange={handlePartitionSizeChange}
                    value={partitionSize.toString()}
                    disabled={props.memorySize === 0}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-center">
                  <input
                    type="button"
                    value="ADD"
                    className="button"
                    onClick={handleAddPartition}
                    id="addButton"
                    disabled={
                      props.memorySize === 0 ||
                      okClicked ||
                      isNaN(props.memorySize)
                    }
                  />
                  <input
                    type="button"
                    value="REMOVE"
                    className="button"
                    onClick={handleRemovePartition}
                    disabled={partitions.length === 0 || okClicked}
                  />
                </div>
                <div className="border border-black w-5/6 h-32 m-5 overflow-scroll">
                  <div className="flex flex-row sticky top-0 bg-[#AA96DA] text-white z-10">
                    <div className="w-1/2 border border-transparent border-r-white h-1/5 items-center justify-center text-sm flex">
                      Partition No.
                    </div>
                    <div className="w-1/2 border border-transparent border-l-white h-1/5 items-center justify-center text-sm flex">
                      Size
                    </div>
                  </div>
                  {partitions.map((partition, index) => (
                    <div key={index} className="flex flex-row">
                      <div className="w-1/2 border h-1/5 items-center justify-center text-sm flex">
                        {index + 1}
                      </div>
                      <div className="w-1/2 border h-1/5 items-center justify-center text-sm flex">
                        {partition.size}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap">
                  <label className="items-center justify-center flex w-1/2">
                    <input
                      type="radio"
                      id="selectedStrategy"
                      name="selectedStrategy"
                      value="ff"
                      className="mr-1"
                      onChange={handleRadioChange}
                      checked={selectedStrategy === "ff"}
                    />
                    First Fit
                  </label>
                  <label className="items-center justify-center flex w-1/2">
                    <input
                      type="radio"
                      name="selectedStrategy"
                      value="bf"
                      className="mr-1"
                      onChange={handleRadioChange}
                      checked={selectedStrategy === "bf"}
                    />
                    Best Fit
                  </label>
                  <label className="items-center justify-center flex w-1/2">
                    <input
                      type="radio"
                      name="selectedStrategy"
                      value="wf"
                      className="mr-1"
                      onChange={handleRadioChange}
                      checked={selectedStrategy === "wf"}
                    />
                    Worst Fit
                  </label>
                  <label className="items-center justify-center flex w-1/2">
                    <input
                      type="radio"
                      name="selectedStrategy"
                      value="next"
                      className="mr-1"
                      onChange={handleRadioChange}
                      checked={selectedStrategy === "next"}
                    />
                    Next Fit
                  </label>
                </div>
              </>
            )}
            {partitionType === "dynamic" && (
              <>
                <label htmlFor="compaction" className="m-5">
                  <input
                    type="checkbox"
                    name="compaction"
                    value="compaction"
                    checked={compactionEnabled}
                    onChange={() => setCompactionEnabled(!compactionEnabled)}
                    className="mr-1"
                  />
                  Allow Compaction
                </label>
                <p className="m-1">Select Strategy :</p>
                <label htmlFor="ff" className="m-1">
                  <input
                    type="radio"
                    name="selectedStrategy"
                    id="ff"
                    value="ff"
                    className="mr-1"
                    onChange={() => setSelectedStrategy("ff")}
                    checked={selectedStrategy === "ff"}
                    // disabled={compactionEnabled}
                  />
                  First Fit
                </label>
                <label htmlFor="bf" className="m-1">
                  <input
                    type="radio"
                    name="selectedStrategy"
                    id="bf"
                    value="bf"
                    className="mr-1"
                    onChange={() => setSelectedStrategy("bf")}
                    checked={selectedStrategy === "bf"}
                    // disabled={compactionEnabled}
                  />
                  Best Fit
                </label>
                <label htmlFor="wf" className="m-1">
                  <input
                    type="radio"
                    name="selectedStrategy"
                    id="wf"
                    value="wf"
                    className="mr-1"
                    onChange={() => setSelectedStrategy("wf")}
                    checked={selectedStrategy === "wf"}
                    // disabled={compactionEnabled}
                  />
                  Worst Fit
                </label>
                <label htmlFor="next" className="m-1">
                  <input
                    type="radio"
                    name="selectedStrategy"
                    id="next"
                    value="next"
                    className="mr-1"
                    onChange={() => setSelectedStrategy("next")}
                    checked={selectedStrategy === "next"}
                    // disabled={compactionEnabled}
                  />
                  Next Fit
                </label>
              </>
            )}
          </div>
          <PCB allocationData={allocationData} source="MM" />
        </div>
        <div className="border-l-black border sm:border-t-black sm:border-l-0 w-1/2 flex flex-col sm:w-full bg-[#C5FAD5]">
          {okClicked && (
            <>
              <div className="w-full flex-col flex items-center justify-center h-full">
                <label className="mt-2">PDT(Page Directory Table)</label>
                <div className="border border-black w-11/12 h-[100px] m-1 overflow-scroll">
                  <div className="flex flex-row w-full sticky top-0 bg-[#AA96DA] text-white z-10">
                    <div className="items-center justify-center text-sm flex h-1/5 w-1/4 border border-transparent border-r-white">
                      Part.No.
                    </div>
                    <div className="items-center justify-center text-sm flex h-1/5 w-1/4 border border-transparent border-r-white border-l-white">
                      Base
                    </div>
                    <div className="items-center justify-center text-sm flex h-1/5 w-1/4 border border-transparent border-r-white border-l-white">
                      Size
                    </div>
                    <div className="items-center justify-center text-sm flex h-1/5 w-1/4 border border-transparent border-l-white">
                      Allocated
                    </div>
                  </div>
                  {pdtData.map((entry, index) => (
                    <div key={index} className="flex flex-row w-full">
                      <div className="items-center justify-center text-sm flex h-1/5 w-1/4 border">
                        {entry.partNo}
                      </div>
                      <div className="items-center justify-center text-sm flex h-1/5 w-1/4 border">
                        {entry.base}
                      </div>
                      <div className="items-center justify-center text-sm flex h-1/5 w-1/4 border">
                        {entry.size}
                      </div>
                      <div className="items-center justify-center text-sm flex h-1/5 w-1/4 border">
                        {entry.allocated ? "True" : "False"}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-11/12 h-[350px] m-2 border-black border bg-[#C5FAD5]">
                  {partitionType === "static" &&
                    pdtData.map((entry, index) => (
                      <div
                        key={index}
                        style={{
                          zIndex: "1",
                          background: "white",
                          border: "1px solid black",
                          width: "100%",
                          height: `${(entry.size / props.memorySize) * 350}px`,
                          position: "relative",
                        }}
                      >
                        {allocationData.map((process) => {
                          if (process.allocation === entry.partNo) {
                            return (
                              <div key={process.id}>
                                <div
                                  className="text-center text-sm"
                                  style={{
                                    zIndex: "2",
                                    background: process.color,
                                    width: "100%",
                                    height: `${
                                      (process.size / entry.size) * 100
                                    }%`,
                                    position: "absolute",
                                  }}
                                >
                                  Allocated
                                </div>
                                <div
                                  className="darken"
                                  style={{
                                    background: process.color,
                                    zIndex: "1",
                                    width: "100%",
                                    height: `${
                                      100 - (process.size / entry.size) * 100
                                    }%`,
                                    position: "absolute",
                                    top: `${
                                      (process.size / entry.size) * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    ))}
                  {partitionType === "dynamic" && (
                    <div className="w-full h-full border border-black">
                      <>
                        {memoryBlocksData.map((blockColor, index) => (
                          <div
                            key={index}
                            style={{
                              position: "relative",
                              backgroundColor: blockColor,
                              height: `${100 / props.memorySize}%`,
                              width: "100%",
                              border: "none",
                            }}
                          ></div>
                        ))}
                      </>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="w-full flex flex-wrap p-2">
        <div className="w-1/2 flex justify-evenly flex-wrap">
          <input
            type="button"
            value="OK"
            className="button"
            onClick={() => {
              handleOkClicked();
            }}
            disabled={props.memorySize <= 0 || isNaN(props.memorySize)}
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
            disabled={
              !okClicked ||
              allPartitionsAllocated ||
              totalAllocatedSize === props.memorySize
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
    </>
  );
};

export default ContigAlloc;
