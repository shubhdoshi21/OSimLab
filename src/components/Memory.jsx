import React, { useState, useRef, useEffect } from "react";

const Memory = ({ isDoneClicked, onMemorySizeChange }) => {
  const [memorySize, setMemorySize] = useState("");
  const [memoryReferences, setMemoryReferences] = useState([]);
  const [memoryReferencesCreated, setMemoryReferencesCreated] = useState(false);
  const labelRef = useRef(null);
  const [error, setError] = useState("");

  const handleCreate = () => {
    const memorySizeAsNumber = parseInt(memorySize);
    if (!Number.isNaN(memorySizeAsNumber) && memorySizeAsNumber > 0) {
      const newReferences = Array.from(
        { length: memorySizeAsNumber },
        (_, index) => ({
          id: memoryReferences.length + index + 1,
          size: "", // Leave "Memory Size" empty for new entries
        })
      );
      setMemoryReferences([...memoryReferences, ...newReferences]);
      setMemorySize("");
      onMemorySizeChange(memorySizeAsNumber);
      setMemoryReferencesCreated(true); // Memory references are created
      setError(""); // Clear any previous error
      onMemorySizeChange(memorySizeAsNumber);
    } else {
      setError("Invalid total frame input");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCreate();
    }
  };

  useEffect(() => {
    // Focus on the label when the component initially mounts
    labelRef.current.focus();
  }, []);

  return (
    <div className="mt-[10vh]">
      <p>Memory (Frames)</p>
      <div className="border-2 mb-10 p-4 rounded-lg">
        <div className="flex-row flex items-center justify-center mt-3">
          <label
            className=""
            ref={labelRef}
            disabled={!isDoneClicked || memoryReferencesCreated}
          >
            Enter Total Frames:
          </label>
          <input
            type="text"
            name="memorySize"
            className="border-2 w-[4vw]  mx-2 rounded-md px-4 py-1 flex"
            value={memorySize}
            onChange={(e) => setMemorySize(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isDoneClicked || memoryReferencesCreated}
          />
          <button
            className="border-2 rounded-lg px-1 py-1 mx-2"
            onClick={handleCreate}
            disabled={!isDoneClicked || memoryReferencesCreated}
          >
            Create
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col h-[20vh] mt-[2vh] overflow-y-scroll">
          <table className="border-collapse border-black w-fit">
            <thead className="bg-black text-white">
              <tr>
                <th className="border-2 px-4 text-[11px] h-1/6 w-1/3">ID</th>
                <th className="border-2 px-4 text-[11px] h-1/6 w-1/3">
                  MemRef(FIFO)
                </th>
                <th className="border-2 px-4 text-[11px] h-1/6 w-1/3">
                  MemRef(LRU)
                </th>
              </tr>
            </thead>
            <tbody>
              {memoryReferences.map((reference) => (
                <tr key={reference.id}>
                  <td className="border-2 text-center px-4 ">{reference.id}</td>
                  <td className="border-2 text-center px-4 ">
                    {reference.size}
                  </td>
                  <td className="border-2 text-center px-4 ">
                    {reference.size}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Memory;
