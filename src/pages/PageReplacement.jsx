import React, { useState, useRef, useEffect } from 'react';
import Memory from '../components/Memory';
import FIFO from '../components/FIFO';
import LRU from '../components/LRU';


const PageReplacement = () => {
  const [memoryReferences, setMemoryReferences] = useState([]);
  const [newMemory, setNewMemory] = useState('');
  const [isDoneClicked, setIsDoneClicked] = useState(false);
  const [memorySize, setMemorySize] = useState(null); // Initialize memorySize

  const inputRef = useRef(null); // Create a ref for the input field

  // Use useEffect to focus on the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAddMemory = () => {
    if (!isDoneClicked && newMemory !== '') {
      const newReference = { id: memoryReferences.length + 1, size: newMemory };
      setMemoryReferences([...memoryReferences, newReference]);
      setNewMemory('');
      inputRef.current.focus();
    }
  };

  const handleRemoveMemory = () => {
    if (!isDoneClicked) {
      const idToRemove = parseInt(window.prompt('Enter the ID to remove:'));
      if (!isNaN(idToRemove)) {
        const indexToRemove = memoryReferences.findIndex((ref) => ref.id === idToRemove);
        if (indexToRemove !== -1) {
          const updatedReferences = [...memoryReferences];
          updatedReferences.splice(indexToRemove, 1);
          setMemoryReferences(updatedReferences);
        } else {
          window.alert('ID not found');
        }
        inputRef.current.focus(); // Set focus back to the input field after removing
      }
    }
  };


  const handleDoneClick = () => {
    if (memoryReferences.length === 0) {
      window.alert('Enter at least 1 memory reference');
    } else {
      setIsDoneClicked(true);
    }
  };

  const handleKeyPress = (event) => {
    if (!isDoneClicked && event.key === 'Enter') {
      handleAddMemory();
    }
  };

  return (
    <div className="flex border-2 rounded-xl p-4 overflow-scroll border-black m-2">
      {/* Left Side */}
      <div className="flex-1/3 p-4 ">
        <div className="mb-4 border-2 rounded-md">
          <p>Prepare Memory Reference String</p>
          
          <div className="flex flex-col items-center justify-center mt-3">
            <label className="">Enter Memory Reference:</label>
            <input
              type="number"
              name="newMemory"
              className="border-2 w-[6vw] mx-2 rounded-md px-4 py-1 flex"
              onChange={(event) => setNewMemory(event.target.value)}
              onKeyPress={handleKeyPress}
              value={newMemory}
              disabled={isDoneClicked}
              ref={inputRef}
            />
          </div>
          <div className="mt-[2vh] w-full flex justify-center items-center flex-wrap gap-1">
            <button className="border-2 rounded-lg px-1 py-1 mx-2" onClick={handleAddMemory} disabled={isDoneClicked}>
              Add
            </button>
            <button className="border-2 rounded-lg px-1 py-1 mx-2" onClick={handleRemoveMemory} disabled={isDoneClicked}>
              Remove
            </button>
            <button className="border-2 rounded-lg px-1 py-1 mx-2" onClick={handleDoneClick}>
              Done
            </button>
          </div>
        </div>
        <div className="flex flex-col h-[20vh] mt-[2vh] border-2 overflow-y-scroll">
          <table className="border-collapse border-black w-fit">
            <thead className="bg-black text-white">
              <tr>
                <th className="border-2 px-4 text-[11px] h-1/6 w-1/3">ID</th>
                <th className="border-2 px-4 text-[11px] h-1/6 w-1/3">Memory Size</th>
              </tr>
            </thead>
            <tbody>
              {memoryReferences.map((reference, index) => (
                <tr key={reference.id}>
                  <td className="border-2 text-center px-4 ">{index + 1}</td>
                  <td className="border-2 text-center px-4 ">{reference.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          {/* Add your "Memory" component here */}
          <Memory isDoneClicked={isDoneClicked} onMemorySizeChange={setMemorySize} />

        </div>
      </div>

      {/* Right Side */}
      <div className="flex-2/3 ">
        <p>Result Information (FIFO)</p>
        {isDoneClicked ? (
    <FIFO memoryReferences={memoryReferences} memorySize={memorySize} />
  ) : (
    <p>Waiting for Total frames</p>
  )}
      </div>
      <div className="flex-2/3 ml-6 ">
        <p>Result Information (LRU)</p>
        {isDoneClicked ? (
    <LRU memoryReferences={memoryReferences} memorySize={memorySize} />
  ) : (
    <p>Waiting for Total frames</p>
  )}
      </div>
    </div>
  );
};

export default PageReplacement;
