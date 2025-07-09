import React, { useState } from 'react'
import { AiOutlineCloseCircle } from "react-icons/ai";

const FMT = ({ fmtData, fmtFrameData, numColumns, numRowsPerColumn }) => {
  const [selectedPID, setSelectedPID] = useState(null);
    const [selectedMapping, setSelectedMapping] = useState([]);
    const handleOpenMappingTable = (pid) => {
        setSelectedPID(pid);
        const mapping = fmtData.find((entry) => entry.PID === pid);
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
  return (
    <div className="w-full flex-col flex items-center justify-center h-full ">
      <div className="h-5 flex flex-row items-center justify-center mt-2">
        FMT(Frame Mapping Table)
        {selectedPID !== null && (
          <AiOutlineCloseCircle
            size={15}
            className="mx-1"
            onClick={handleCloseMappingTable}
          />
        )}
      </div>
      <div
        className={`border border-black w-11/12 h-[100px] m-1  relative ${
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
        {fmtData.map((entry, index) => (
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
          <div className="w-1/2 h-[100px] right-0 overflow-scroll z-10 absolute text-sm text-center top-0">
            <div className="flex flex-row w-full sticky top-0 bg-[#AA96DA] text-white z-20">
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
        {fmtFrameData.map((frame, index) => (
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
  )
}

export default FMT