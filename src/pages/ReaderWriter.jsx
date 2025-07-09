import React, { useState } from "react";

const ReaderWriter = () => {
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("black");

  const [text1, setText1] = useState("");
  const [textColor1, setTextColor1] = useState("black");

  const [codeColor, setCodeColor] = useState("black");
  const [codeColor1, setCodeColor1] = useState("black");
  const [codeColor2, setCodeColor2] = useState("black");
  const [codeColor3, setCodeColor3] = useState("black");
  const [codeColor4, setCodeColor4] = useState("black");
  const [codeColor5, setCodeColor5] = useState("black");
 
 

  const [criticalColor, setCriticalColor] = useState("white");
  const [writerOtherColor, setWriterOtherColor] = useState("white");
  const [writerColor, setWriterColor] = useState("white");
  const [readerOtherColor, setReaderOtherColor] = useState("white");
  const [readerColor, setReaderColor] = useState("white");
  const [waitingColor, setWaitingColor] = useState("white");
  const [writerInputsDisabled, setWriterInputsDisabled] = useState(true);
  const [readerInputsDisabled, setReaderInputsDisabled] = useState(true);
  const [writerCriticalTime, setWriterCriticalTime] = useState(1500);
  const [writerOtherTime, setWriterOtherTime] = useState(1000);
  const [writerRequiredCriticalSections, setWriterRequiredCriticalSections] =
    useState(2);
  const [readerCriticalTime, setReaderCriticalTime] = useState(1500);
  const [readerOtherTime, setReaderOtherTime] = useState(1000);
  const [readerRequiredCriticalSections, setReaderRequiredCriticalSections] =
    useState(2);

  const startColorChange = async () => {
    const writerOther = parseInt(writerOtherTime) - writerCriticalTime;
    const readerOther = parseInt(readerOtherTime) - readerCriticalTime;
    let countReader = readerRequiredCriticalSections;
    let countWriter = writerRequiredCriticalSections;
    const timeForCycle = parseInt(
      (writerOtherTime > writerCriticalTime
        ? writerOtherTime * writerRequiredCriticalSections
        : writerCriticalTime * writerRequiredCriticalSections) +
        (readerOtherTime > readerCriticalTime
          ? readerOtherTime * readerRequiredCriticalSections
          : readerCriticalTime * readerRequiredCriticalSections)
    );

    const allocateReaderWriterColors = async () => {
      let programRunning = true;

      while (programRunning) {
        setReaderColor("orange");
        setWriterColor("skyblue");

        // Add a condition to check if the program should continue running
        if (countReader > 0 || countWriter > 0) {
          programRunning = true;
        } else {
          programRunning = false;
        }

        // Don't resolve the promise here; let it run until the program is complete
        await new Promise((resolve) => setTimeout(resolve, 100)); // Adjust the delay as needed
      }

      // Set the colors to white when the program is complete
      setReaderColor("white");
      setWriterColor("white");
    };

    const allocateCriticalColor = async (color, duration, message) => {
      setCriticalColor(color);
      setText(message);
      setTextColor(color === "white" ? "white" : "black");
      setText(color === "orange" ? "READER" : "WRITER");
      if (color === "orange") {
        setCodeColor4("yellow");
      } else if(color === "skyblue"){
        setCodeColor5("yellow"); 
      } else
      {
        setCodeColor4("black");
        setCodeColor5("black");
      }
      await new Promise((resolve) => setTimeout(resolve, duration));
      setCriticalColor("white");
      setText("");
      setCodeColor4("black");
      setCodeColor5("black");
    };

    const allocateWriterOtherColor = async (color, duration) => {
      setWriterOtherColor(color);
      setCodeColor3("yellow");
      await new Promise((resolve) => setTimeout(resolve, duration));
      setWriterOtherColor("white");
      setCodeColor3("black");
    };
    const allocateReaderOtherColor = async (color, duration) => {
      setReaderOtherColor(color);
      setCodeColor2("yellow");
      await new Promise((resolve) => setTimeout(resolve, duration));
      setReaderOtherColor("white");
      setCodeColor2("black");
    };
    const allocateWaitingColor = async (color, duration, message1) => {
      setWaitingColor(color);

      if (color === "orange") {
        setText1("READER IS WAITING!");
        setCodeColor("yellow"); // Set code color to yellow when reader is waiting
        setCodeColor1("black");
      } else if (color === "skyblue") {
        setText1("WRITER IS WAITING!");
        setCodeColor1("yellow");
        setCodeColor("black"); // Set code color back to black when waiting is skyblue
      } else {
        setText1("");
        setCodeColor("black"); // Set code color back to black for other cases
        setCodeColor1("black");
      }

      setTextColor1(color === "white" ? "white" : "black");

      await new Promise((resolve) => setTimeout(resolve, duration));

      if (color === "white") {
        setWaitingColor("white");
        setText1("");
      }
    };

    allocateReaderWriterColors();
    while (countReader > 0 || countWriter > 0) {
      if (countReader > 0) {
        allocateWaitingColor("skyblue", readerCriticalTime);
        await allocateCriticalColor("orange", readerCriticalTime);
        await allocateReaderOtherColor("orange", readerOtherTime);
        allocateWaitingColor("orange", writerCriticalTime);
        countReader--;
      }
      if (countWriter > 0) {
        await allocateCriticalColor("skyblue", writerCriticalTime);
        await allocateWriterOtherColor("skyblue", writerOtherTime);
        allocateWaitingColor("skyblue", readerCriticalTime);
        if (countWriter === 1)
          allocateWaitingColor("white", readerCriticalTime);

        if (writerOther > 0) {
          await allocateCriticalColor("white", writerOther);
        }
        countWriter--;
      }
    }
  };

  const getFlagWValue = () => {
    return criticalColor === "skyblue" || waitingColor === "skyblue"
      ? "true"
      : "false";
  };
  const getFlagWValue1 = () => {
    return criticalColor === "orange" || waitingColor === "orange"
      ? "true"
      : "false";
  };

  const enableWriterInputs = () => {
    setWriterInputsDisabled(false);
  };

  const disableWriterInputs = () => {
    setWriterInputsDisabled(true);
  };

  const enableReaderInputs = () => {
    setReaderInputsDisabled(false);
  };

  const disableReaderInputs = () => {
    setReaderInputsDisabled(true);
  };

  return (
    <div className="bg-slate-200 w-screen h-screen">
      <p className="flex justify-center text-blue-900 font-bold text-lg">
        PETERSON'S SOLUTION FOR READER-WRITER PROBLEM
      </p>
      <div className="flex flex-wrap items-center justify-evenly mt-3 font-semibold">
        <p>RUNNING</p>
      </div>
      <div className="flex w-screen h-[60vh] justify-evenly">
        <div className="flex">
          <div className="flex-col">
            <div
              className={`w-[15vw] h-[20vh] mx-[4vw] mt-14 p-4`}
              style={{ backgroundColor: writerColor }}
            >
              <p className="text-center font-semibold">WRITER</p>
              <p className="text-center mt-3">flag[w]={getFlagWValue()}</p>
            </div>
            <div className="bg-lime-500 w-[15vw] h-[38vh] mx-[4vw] mt-3 text-[15px] p-2">
              <p className=""> flag[w]=true</p>
              <p>turn=reader</p>
              <br />
              <p style={{ color: codeColor1 }}> while(flag[r]&&turn==reader)</p>
              <p style={{ color: codeColor1 }}>{"{ // Busy Wait }"}</p>
              <br />
              <p style={{ color: codeColor5 }}>{" // Critical Section "}</p>
              <br />
              <p className=""> flag[w]=false</p>
              <p style={{ color: codeColor3 }}>{" // Other Processing "}</p>
            </div>
            <div className="bg-lime-500 w-[17vw] h-[21vh] mx-[2vw]  mt-5 p-3 space-y-2">
              <div className="flex flex-row gap-5">
                <p className="text-[12px] font-semibold">
                  CRITICAL SECTION TIME:
                </p>

                <input
                  type="text"
                  placeholder="15000"
                  value={writerCriticalTime}
                  onChange={(e) =>
                    setWriterCriticalTime(Number(e.target.value))
                  }
                  className={`w-[30%] bg-green-400 ${
                    writerInputsDisabled ? "bg-lime-200" : ""
                  }`}
                  disabled={writerInputsDisabled}
                />
              </div>
              <div className="flex flex-row gap-5">
                <p className="text-[12px] font-semibold mt-2">
                  OTHER WORK TIME:
                </p>
                <input
                  type="text"
                  placeholder="10000"
                  value={writerOtherTime}
                  onChange={(e) => setWriterOtherTime(Number(e.target.value))}
                  className={`w-[30%] bg-green-400 ${
                    writerInputsDisabled ? "bg-lime-200" : ""
                  }`}
                  disabled={writerInputsDisabled}
                />
              </div>
              <div className="flex flex-row gap-5">
                <p className="text-[12px] font-semibold mt-2">
                  NO. OF REQUIRED CS:
                </p>
                <input
                  type="text"
                  placeholder="2"
                  value={writerRequiredCriticalSections}
                  onChange={(e) =>
                    setWriterRequiredCriticalSections(Number(e.target.value))
                  }
                  className={`w-[30%] bg-green-400 ${
                    writerInputsDisabled ? "bg-lime-200" : ""
                  }`}
                  disabled={writerInputsDisabled}
                />
              </div>
              <div className="flex flex-wrap gap-5 justify-center mt-5  ">
                <button
                  className="border rounded-md border-black hover:bg-lime-700 w-1/3 p-1"
                  onClick={enableWriterInputs}
                >
                  CHANGE
                </button>
                <button
                  className="border rounded-md border-black hover:bg-lime-700 w-1/3 p-1"
                  onClick={disableWriterInputs}
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-yellow-200 gap-5 w-[30vw] h-[50vh] justify-center p-8">
            <div
              id="one"
              className="w-[26vw] h-[30vh] bg-white"
              style={{ backgroundColor: criticalColor }}
            >
              <p className="flex justify-center m-2 font-semibold">
                CRITICAL SECTION
              </p>
              <div className="text-center text-black font-semibold">{text}</div>
            </div>
            <div className=" flex flex-row gap-5">
              <div
                id="two"
                className="bg-white h-[20vh] w-1/2"
                style={{ backgroundColor: writerOtherColor }}
              >
                <p className="font-semibold text-[13px] text-center">
                  OTHER PROCESS WRITER
                </p>
              </div>
              <div
                className="bg-white h-[20vh] w-1/2"
                style={{ backgroundColor: readerOtherColor }}
              >
                <p className="font-semibold text-[13px] text-center">
                  OTHER PROCESS READER
                </p>
              </div>
            </div>
          </div>

          <div className="flex-col">
            <div
              className="w-[15vw] h-[20vh] mx-[4vw] mt-14 p-4"
              style={{ backgroundColor: readerColor }}
            >
              <p className="text-center font-semibold">READER</p>
              <p className="text-center mt-3">flag[r]={getFlagWValue1()}</p>
            </div>
            <div className="bg-lime-500 w-[15vw] h-[38vh] mx-[4vw] mt-3 text-[15px] p-2">
              <p className=""> flag[r]=true</p>
              <p>turn=writer</p>
              <br />
              <p style={{ color: codeColor }}>while(flag[w]&&turn==writer)</p>
              <p style={{ color: codeColor }}>{"{ // Busy Wait }"}</p>

              <br />
              <p style={{ color: codeColor4 }}>{" // Critical Section "}</p>
              <br />
              <p className=""> flag[r]=false</p>
              <p style={{ color: codeColor2 }}>{" // Other Processing "}</p>
            </div>
            <div className="bg-lime-500 w-[17vw] h-[21vh] mx-[4vw] mt-5 p-3 space-y-2">
              <div className="flex flex-row gap-5">
                <p className="text-[12px] font-semibold">
                  CRITICAL SECTION TIME:
                </p>
                <input
                  type="text"
                  placeholder="15000"
                  value={readerCriticalTime}
                  onChange={(e) =>
                    setReaderCriticalTime(Number(e.target.value))
                  }
                  className={`w-[30%] bg-green-400 ${
                    readerInputsDisabled ? "bg-lime-200" : ""
                  }`}
                  disabled={readerInputsDisabled}
                />
              </div>
              <div className="flex flex-row gap-5">
                <p className="text-[12px] font-semibold mt-2">
                  OTHER WORK TIME:
                </p>
                <input
                  type="text"
                  placeholder="10000"
                  value={readerOtherTime}
                  onChange={(e) => setReaderOtherTime(Number(e.target.value))}
                  className={`w-[30%] bg-green-400 ${
                    readerInputsDisabled ? "bg-lime-200" : ""
                  }`}
                  disabled={readerInputsDisabled}
                />
              </div>
              <div className="flex flex-row gap-5">
                <p className="text-[12px] font-semibold mt-2">
                  NO. OF REQUIRED CS:
                </p>
                <input
                  type="text"
                  placeholder="2"
                  value={readerRequiredCriticalSections}
                  onChange={(e) =>
                    setReaderRequiredCriticalSections(Number(e.target.value))
                  }
                  className={`w-[30%] bg-green-400 ${
                    readerInputsDisabled ? "bg-lime-200" : ""
                  }`}
                  disabled={readerInputsDisabled}
                />
              </div>
              <div className="flex flex-wrap gap-5 justify-center mt-5  ">
                <button
                  className="border rounded-md border-black hover:bg-lime-700 w-1/3 p-1"
                  onClick={enableReaderInputs}
                >
                  CHANGE
                </button>
                <button
                  className="border rounded-md border-black hover:bg-lime-700 w-1/3 p-1"
                  onClick={disableReaderInputs}
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-evenly mt-3 font-semibold">
        <p>WAITING</p>
      </div>

      <div
        className="bg-white w-[30vw] h-[20vh] mx-[34vw] text-black text-center font-semibold p-5"
        style={{ backgroundColor: waitingColor }}
      >
        {text1}
      </div>
      <div className="w-screen flex justify-center">
        <button
          className="border-black bg-yellow-200 hover:bg-yellow-400 rounded-md mt-5 px-5 font-semibold"
          onClick={startColorChange}
        >
          START
        </button>
      </div>
    </div>
  );
};

export default ReaderWriter;


