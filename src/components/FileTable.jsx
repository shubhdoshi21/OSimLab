import React from "react";

const FileTable = ({ fileData }) => {
  return (
    <div className="w-full flex-col flex items-center justify-center h-[400px]">
      <div className="border border-black w-11/12 h-[375px] m-2 overflow-scroll">
        <div className="flex flex-row w-full sticky top-0 bg-black text-white z-10">
          <div
            className={`items-center justify-center text-sm flex h-1/9 w-1/3 border border-black border-r-white`}
          >
            File Name
          </div>
          <div
            className={`items-center justify-center text-sm flex h-1/9 w-1/3 border border-black border-l-white border-r-white`}
          >
            File Size
          </div>
          <div
            className={`items-center justify-center text-sm flex h-1/9 w-1/3 border border-black border-l-white truncate`}
          >
            Stored At
          </div>
        </div>
        {fileData.map((entry, index) => (
          <div
            key={index}
            className="flex flex-row w-full"
            style={{ background: entry.color }}
          >
            <div
              className={`items-center justify-center text-sm flex h-1/9 w-1/3 border`}
            >
              {entry.id}
            </div>
            <div
              className={`items-center justify-center text-sm flex h-1/9 w-1/3 border`}
            >
              {entry.size}
            </div>
            <div
              className={`items-center justify-center text-sm flex h-1/9 w-1/3 border`}
            >
              {entry.allocation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileTable;
