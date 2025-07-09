import React from "react";

const PCB = ({ allocationData, source }) => {
  const isVMSource = source === "VM";

  return (
    <div className="w-full flex-col flex items-center justify-center h-[175px]">
      <label>PCB(Process Control Block)</label>
      <div className="border border-black w-11/12 h-32 m-2 overflow-scroll">
        <div className="flex flex-row w-full sticky top-0 bg-[#AA96DA] text-white z-10">
          <div
            className={`items-center justify-center text-sm flex h-1/5 ${
              isVMSource ? "w-1/4" : "w-1/3"
            } border border-transparent border-r-white`}
          >
            PID
          </div>
          <div
            className={`items-center justify-center text-sm flex h-1/5 ${
              isVMSource ? "w-1/4" : "w-1/3"
            } border border-transparent border-x-white`}
          >
            Size
          </div>
          {isVMSource && (
            <div className="items-center justify-center text-sm flex h-1/5 w-1/4 border border-transparent border-x-white truncate">
              VM Reference
            </div>
          )}
          <div
            className={`items-center justify-center text-sm flex h-1/5 ${
              isVMSource ? "w-1/4" : "w-1/3"
            } border border-transparent border-l-white truncate`}
          >
            MM Reference
          </div>
        </div>
        {allocationData.map((entry, index) => (
          <div
            key={index}
            className="flex flex-row w-full"
            style={{ background: entry.color }}
          >
            <div
              className={`items-center justify-center text-sm flex h-1/5 ${
                isVMSource ? "w-1/4" : "w-1/3"
              } border`}
            >
              {entry.id}
            </div>
            <div
              className={`items-center justify-center text-sm flex h-1/5 ${
                isVMSource ? "w-1/4" : "w-1/3"
              } border`}
            >
              {entry.size}
            </div>
            {isVMSource && (
              <div className="items-center justify-center text-sm flex h-1/5 w-1/4 border">
                {entry.vmReference}
              </div>
            )}
            <div
              className={`items-center justify-center text-sm flex h-1/5 ${
                isVMSource ? "w-1/4" : "w-1/3"
              } border`}
            >
              {entry.allocation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PCB;
