import React, { useState } from "react";
import ContigAlloc from "../components/ContigAlloc";
import NonContigAlloc from "../components/NonContigAlloc";

const MemoryManagement = () => {
  const [allocationType, setAllocationType] = useState("contiguous");
  const [memorySize, setMemorySize] = useState(0);

  const handleRadioChange = (event) => {
    setAllocationType(event.target.value);
  };

  const handleMemorySizeChange = (event) => {
    const newMemorySize = parseInt(event.target.value);
    if (newMemorySize < 0) {
      alert("Memory size cannot be negative");
    } else {
      setMemorySize(newMemorySize);
    }
  };

  return (
    <div className="bg-[#FFFFD2] h-screen overflow-scroll">
      <div className="flex flex-wrap items-center justify-evenly p-2 ">
        <div className="flex-wrap flex items-center justify-center p-2">
          <label htmlFor="size">Memory Size :</label>
          <input
            type="number"
            name="size"
            id="size"
            className="border-2 border-black mx-5 rounded-md px-[4px] py-[1px] flex bg-transparent"
            onChange={handleMemorySizeChange}
            value={memorySize.toString()}
          />
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="allocationType"
              value="contiguous"
              className="mr-1"
              onChange={handleRadioChange}
              checked={allocationType === "contiguous"}
            />
            Contiguous Allocation
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="allocationType"
              value="noncontiguous"
              className="ml-5 mr-1"
              onChange={handleRadioChange}
              checked={allocationType === "noncontiguous"}
            />
            Non-Contiguous Allocation
          </label>
        </div>
      </div>
      {allocationType === "contiguous" && (
        <ContigAlloc
          key="contiguous"
          memorySize={memorySize}
          setMemorySize={setMemorySize}
        />
      )}
      {allocationType === "noncontiguous" && (
        <NonContigAlloc
          key="noncontiguous"
          memorySize={memorySize}
          setMemorySize={setMemorySize}
        />
      )}
    </div>
  );
};

export default MemoryManagement;
