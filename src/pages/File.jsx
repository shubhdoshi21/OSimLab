import React, { useState } from "react";
import FileTable from "../components/FileTable";

const File = () => {
  const [allocationType, setAllocationType] = useState("contiguous");
  const [numType, setNumType] = useState("chaining");
  const [discSize, setDiscSize] = useState(0);
  const [fileData, setFileData] = useState([]);
  const [okClicked, setOkClicked] = useState(false);
  const [allocatedFrameCount, setAllocatedFrameCount] = useState(0);
  const [frameData, setFrameData] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  const [fileName, setFileName] = useState("");
  const handleClear = () => {
    setAllocationType("contiguous");
    setNumType("chaining");
    setDiscSize(0);
    setFileData([]);
    setOkClicked(false);
    setAllocatedFrameCount(0);
    setFrameData([]);
    setFileSize(0);
    setFileName("");
  };
  const handleRadioChange = (event) => {
    setAllocationType(event.target.value);
  };
  const handleNumChange = (event) => {
    setNumType(event.target.value);
  };
  const handleDiscSizeChange = (event) => {
    const newMemorySize = parseInt(event.target.value);
    if (newMemorySize < 0) {
      alert("Memory size cannot be negative");
    } else {
      setDiscSize(newMemorySize);
    }
  };
  const handleFileSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    if (newSize <= 0 || newSize >= discSize) {
      alert("Frame size must be greater than 0 & less than " + discSize + ".");
    } else {
      setFileSize(newSize);
    }
  };
  const handleAddFile = () => {
    if ((Math.floor(discSize / 16) - allocatedFrameCount) * 16 >= fileSize) {
      allocateFrames();
      setFileName("");
      setFileSize(0);
    } else {
      alert("Insufficient memory to allocate this process.");
    }
  };
  const handleRemoveFile = () => {
    const removeFileName = prompt(
      "Enter the name of the file you want to remove:"
    );
    if (removeFileName === null) {
      return;
    }

    let updatedFrameData = [...frameData];
    let updatedAllocatedFrameCount = allocatedFrameCount;

    const removedFile = fileData.find((file) => file.id === removeFileName);

    if (removedFile) {
      removedFile.allocation.split(", ").forEach((frameIndex) => {
        const index = parseInt(frameIndex, 10) - 1;
        updatedFrameData[index] = { color: "white" };
        updatedAllocatedFrameCount--;
      });

      const updatedFileData = fileData.filter(
        (file) => file.id !== removeFileName
      );
      setFileData(updatedFileData);
      setAllocatedFrameCount(updatedAllocatedFrameCount);
      alert(`File "${removeFileName}" has been removed.`);
    } else {
      alert(`File "${removeFileName}" not found.`);
    }

    setFrameData(updatedFrameData);
  };
  const allocateFrames = () => {
    const numFramesNeeded = Math.ceil(fileSize / 16);
    const color = getRandomColor();
    const allocatedFrameIds = [];
    let numFrameAllocated = null;
    if (allocationType === "noncontiguous") {
      numFrameAllocated = numFramesNeeded;
      for (let i = 0; i < discSize / 16; i++) {
        if (frameData[i].color === "white" && numFrameAllocated > 0) {
          frameData[i] = { color };
          allocatedFrameIds.push(i + 1);
          setAllocatedFrameCount((prevCount) => prevCount + 1);
          numFrameAllocated--;
        }
      }
    } else if (allocationType === "contiguous") {
      numFrameAllocated = 0;
      let startFrame = -1;
      let consecutiveFrames = 0;

      for (let i = 0; i < discSize / 16; i++) {
        if (frameData[i].color === "white") {
          if (startFrame === -1) {
            startFrame = i;
          }
          consecutiveFrames++;

          if (consecutiveFrames === numFramesNeeded) {
            for (let j = startFrame; j < startFrame + numFramesNeeded; j++) {
              frameData[j] = { color };
              allocatedFrameIds.push(j + 1);
              setAllocatedFrameCount((prevCount) => prevCount + 1);
            }
            numFrameAllocated = numFramesNeeded;
            break;
          }
        } else {
          startFrame = -1;
          consecutiveFrames = 0;
        }
      }
    }
    if (
      (numFrameAllocated === 0 && allocationType === "noncontiguous") ||
      (allocationType === "contiguous" && numFrameAllocated === numFramesNeeded)
    ) {
      const originalFileName = fileName;
      let newFileName = fileName;
      let count = 1;
      while (fileData.some((file) => file.id === newFileName)) {
        newFileName = `${originalFileName}(${count++})`;
      }
      if (newFileName !== originalFileName) {
        alert(
          `A file with the name "${originalFileName}" already exists. Saving as "${newFileName}".`
        );
      }
      const newAllocation = {
        id: newFileName,
        size: fileSize,
        allocation: allocatedFrameIds.join(", "),
        color: color,
      };
      setFileData([...fileData, newAllocation]);
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

  const frameCount = Math.floor(discSize / 16);
  const numColumns =
    parseInt(Math.sqrt(frameCount)) > 10 ? 10 : parseInt(Math.sqrt(frameCount));
  const numRowsPerColumn =
    Math.floor(frameCount / numColumns) > 10
      ? 10
      : Math.floor(frameCount / numColumns) + 1;
  return (
    <div className="">
      <div className="flex flex-wrap items-center justify-evenly p-2 xs:text-xs">
        <div className="flex-wrap flex items-center justify-center p-2">
          <label htmlFor="size">Disc Size (Bytes) :</label>
          <input
            type="number"
            name="size"
            id="size"
            className="border-2 mx-5 rounded-md px-[4px] py-[1px] flex"
            onChange={handleDiscSizeChange}
            value={discSize.toString()}
            disabled={okClicked}
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
        <div className="ml-5">
          {!okClicked && (
            <input
              type="button"
              value="OK"
              className="button"
              onClick={() => {
                setOkClicked(true);
                const newFrameData = Array(Math.floor(discSize / 16)).fill({
                  color: "white",
                });
                setFrameData(newFrameData);
              }}
              disabled={discSize <= 0 || isNaN(discSize)}
            />
          )}
          {okClicked && (
            <input
              type="button"
              value="CLEAR"
              className="button"
              onClick={handleClear}
            />
          )}
        </div>
      </div>
      <div className=" flex flex-wrap w-full">
        <div className="border-2 flex flex-col w-1/3 h-[700px] text-sm md:w-1/2 sm:w-full sm:h-auto xs:text-xs">
          <div className="flex h-[300px] w-full flex-col justify-center">
            <div className="flex flex-wrap p-2 items-center justify-center">
              {allocationType === "noncontiguous" && (
                <div className="flex w-full items-center justify-evenly flex-wrap my-5">
                  <label>
                    <input
                      type="radio"
                      name="numType"
                      value="chaining"
                      className="mr-1"
                      onChange={handleNumChange}
                      checked={numType === "chaining"}
                    />
                    Chaining
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="numType"
                      value="indexing"
                      className="mr-1 ml-5"
                      onChange={handleNumChange}
                      checked={numType === "indexing"}
                    />
                    Indexing
                  </label>
                </div>
              )}
              <label className="flex items-center">
                File Size :
                <input
                  type="number"
                  name="fileSize"
                  className="border-2 my-2 mx-5 rounded-md px-[4px] py-[1px] flex"
                  value={fileSize.toString()}
                  onChange={handleFileSizeChange}
                  disabled={
                    discSize === 0 ||
                    isNaN(discSize) ||
                    !okClicked ||
                    allocatedFrameCount === frameCount
                  }
                />
              </label>
              <label className="flex items-center">
                File Name :
                <input
                  type="text"
                  name="fileName"
                  className="border-2 my-2 mx-5 rounded-md px-[4px] py-[1px] flex"
                  onChange={(e) => setFileName(e.target.value)}
                  value={fileName}
                  disabled={fileSize === 0 || isNaN(fileSize)}
                />
              </label>
            </div>
            <div className="flex flex-wrap items-center justify-evenly">
              <input
                type="button"
                value="ADD"
                className="button"
                onClick={handleAddFile}
                id="addButton"
                disabled={
                  fileSize === 0 ||
                  !okClicked ||
                  isNaN(fileSize) ||
                  fileName === "" ||
                  allocatedFrameCount === frameCount
                }
              />
              <input
                type="button"
                value="REMOVE"
                className="button"
                onClick={handleRemoveFile}
                disabled={!okClicked || allocatedFrameCount === 0}
              />
            </div>
          </div>
          <FileTable fileData={fileData} />
        </div>
        <div className="border-2 flex flex-col w-1/3 h-[700px] items-center justify-evenly md:w-1/2 sm:w-full sm:h-auto">
          {okClicked && (
            <div className="border border-black w-11/12 h-[625px] m-2 flex flex-wrap bg-black overflow-scroll">
              {frameData.map((frame, index) => (
                <div
                  key={index}
                  id="main"
                  className="text-center text-sm p-0"
                  style={{
                    zIndex: "1",
                    border: "1px solid black",
                    width: `${100 / numColumns}%`,
                    height: `${100 / numRowsPerColumn}%`,
                    backgroundColor: frame.color,
                  }}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          )}
          <div className="w-full text-center text-sm">
            (* 1 block {okClicked ? "is" : "will be"} considered as of 16 Bytes)
          </div>
        </div>
        <div className="border-2 border-red-700 flex flex-wrap w-1/3 h-[700px] items-center justify-evenly md:w-full md:h-auto">
          <div className="h-24 w-24 relative m-5">
            <div className="w-full h-full bg-transparent absolute">
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
            <div className="w-3/4 h-3/4 bg-transparent absolute top-[12.5%] left-[12.5%]">
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full rotate-45 border-t-blue-700"></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-red-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-orange-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full -rotate-45 border-t-green-700"></div>
            </div>
            <div className="w-1/2 h-1/2 bg-transparent absolute top-[25%] left-[25%]">
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
          </div>
          <div className="h-24 w-24 relative m-5">
            <div className="w-full h-full bg-transparent absolute">
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
            <div className="w-3/4 h-3/4 bg-transparent absolute top-[12.5%] left-[12.5%]">
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full rotate-45 border-t-blue-700"></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-red-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-orange-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full -rotate-45 border-t-green-700"></div>
            </div>
            <div className="w-1/2 h-1/2 bg-transparent absolute top-[25%] left-[25%]">
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
          </div>
          <div className="h-24 w-24 relative m-5">
            <div className="w-full h-full bg-transparent absolute">
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
            <div className="w-3/4 h-3/4 bg-transparent absolute top-[12.5%] left-[12.5%]">
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full rotate-45 border-t-blue-700"></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-red-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-orange-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full -rotate-45 border-t-green-700"></div>
            </div>
            <div className="w-1/2 h-1/2 bg-transparent absolute top-[25%] left-[25%]">
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
          </div>
          <div className="h-24 w-24 relative m-5">
            <div className="w-full h-full bg-transparent absolute">
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
            <div className="w-3/4 h-3/4 bg-transparent absolute top-[12.5%] left-[12.5%]">
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full rotate-45 border-t-blue-700"></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-red-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-orange-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full -rotate-45 border-t-green-700"></div>
            </div>
            <div className="w-1/2 h-1/2 bg-transparent absolute top-[25%] left-[25%]">
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
          </div>
          <div className="h-24 w-24 relative m-5">
            <div className="w-full h-full bg-transparent absolute">
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
            <div className="w-3/4 h-3/4 bg-transparent absolute top-[12.5%] left-[12.5%]">
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full rotate-45 border-t-blue-700"></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-red-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-orange-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full -rotate-45 border-t-green-700"></div>
            </div>
            <div className="w-1/2 h-1/2 bg-transparent absolute top-[25%] left-[25%]">
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
          </div>
          <div className="h-24 w-24 relative m-5">
            <div className="w-full h-full bg-transparent absolute">
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
            <div className="w-3/4 h-3/4 bg-transparent absolute top-[12.5%] left-[12.5%]">
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full rotate-45 border-t-blue-700"></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-red-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-orange-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full -rotate-45 border-t-green-700"></div>
            </div>
            <div className="w-1/2 h-1/2 bg-transparent absolute top-[25%] left-[25%]">
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
          </div>
          <div className="h-24 w-24 relative m-5">
            <div className="w-full h-full bg-transparent absolute">
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
            <div className="w-3/4 h-3/4 bg-transparent absolute top-[12.5%] left-[12.5%]">
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full rotate-45 border-t-blue-700"></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-red-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-orange-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full -rotate-45 border-t-green-700"></div>
            </div>
            <div className="w-1/2 h-1/2 bg-transparent absolute top-[25%] left-[25%]">
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
          </div>
          <div className="h-24 w-24 relative m-5">
            <div className="w-full h-full bg-transparent absolute">
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[48px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[48px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
            <div className="w-3/4 h-3/4 bg-transparent absolute top-[12.5%] left-[12.5%]">
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full rotate-45 border-t-blue-700"></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-red-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[36px] border-transparent rounded-full border-t-orange-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[36px] border-transparent rounded-full -rotate-45 border-t-green-700"></div>
            </div>
            <div className="w-1/2 h-1/2 bg-transparent absolute top-[25%] left-[25%]">
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full rotate-45 border-t-red-700"></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-blue-700"
                style={{ transform: "rotate(135deg)" }}
              ></div>
              <div
                className="absolute w-0 h-0 border-[24px] border-transparent rounded-full border-t-green-700"
                style={{ transform: "rotate(225deg)" }}
              ></div>
              <div className="absolute w-0 h-0 border-[24px] border-transparent rounded-full -rotate-45 border-t-orange-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default File;
