import React, { useState } from 'react';

const FIFO = ({ memoryReferences, memorySize }) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageNumber1, setPageNumber1] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);

  const [ButtonClicked, setButtonClicked] = useState(0);
  const [columnData, setColumnData] = useState(Array(memoryReferences.length).fill([]));
  const [showInRow, setShowInRow] = useState(false); // State variable to show the "IN" row
  const [printedElements, setPrintedElements] = useState([]); // Track printed elements
  const [removedElements, setRemovedElements] = useState(Array(memoryReferences.length).fill(null)); // Track removed elements for each column

  const [displayedIndex, setDisplayedIndex] = useState(0); // Track the displayed data index

  
  const handleNextPageClick = () => {
    if (pageNumber < memoryReferences.length) {
      setPrintedElements([...printedElements, memoryReferences[pageNumber].size]);
      const newColumnData = [...columnData]; // Copy the current column data
  
      newColumnData[currentColumn] = memoryReferences.map((reference, index) => {
        if (index <= displayedIndex) {
          if (pageNumber >= memorySize) {
            if (index<pageNumber1) {
              if ((memorySize+index)%memorySize <= index) {
                
                return memoryReferences[memorySize+index].size;
              }
              else
              return reference.size;
            }
            
            else
            return memoryReferences[index].size; // Update the current column data
          } else {
            return reference.size; // Handle the case when pageNumber is less than memorySize
          }
        } else {
          return ''; // Handle the case when index is greater than displayedIndex
        }
      });
  
      if (pageNumber+1 >= memorySize) {

  
        // Determine the number of elements to slice based on pageNumber1
        // const elementsToSlice = pageNumber1;
  
        // const removed = newColumnData[currentColumn].splice(0, elementsToSlice);
      const newRemovedElements = [...removedElements];
      // newRemovedElements[currentColumn] = removed[removed.length - 1]; // Store only the last removed element
      setRemovedElements(newRemovedElements);

      setPageNumber1(pageNumber1 + 1);
      }
  
      setColumnData(newColumnData); // Update the column data
  
      setPageNumber(pageNumber + 1);
      setDisplayedIndex(displayedIndex + 1);
      setCurrentColumn(currentColumn + 1); // Cycle through columns
      setButtonClicked(true); // Set the buttonClicked flag to true when the button is clicked
      setShowInRow(true);
    }
  };
  

  const buttonClassName =
    memoryReferences.length === 0 ||
    memoryReferences.length === null ||
    pageNumber === memoryReferences.length ||
    memorySize === 0 ||
    memorySize === null
      ? 'border-2 p-1 rounded-md bg-slate-300 cursor-not-allowed'
      : 'border-2 p-1 rounded-md';

  const isButtonDisabled =
    memoryReferences.length === 0 ||
    memoryReferences.length === null ||
    memorySize === 0 ||
    memorySize === null;

  return (
    <div className='text-black border-2 rounded-lg text-left w-[40vw] h-[86vh] overflow-scroll'>
      <div className='flex p-8 gap-10 justify-center items-center'>
        Next Page Request:
        {pageNumber === memoryReferences.length ? " Finish" : memoryReferences[pageNumber]?.size}
        <button onClick={handleNextPageClick} className={buttonClassName} disabled={isButtonDisabled}>
          Perform FIFO
        </button>
      </div>
      <div className="table-container" style={{ maxHeight: '570px', overflowY: 'auto' }}>
        <table className=' border-black w-fit mx-auto '>
          <thead>
            <tr>
              <th className=' text-center px-2'>Page Request</th>
              {memoryReferences.map((reference, index) => (
                <th key={index} className=' px-2'>
                  {reference?.size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
          {Array.from({ length: memorySize }, (_, rowIndex) => (
              <tr key={rowIndex}>
                <td className=' text-center px-4'>Page Request {rowIndex + 1}</td>
                {Array.from({ length: memoryReferences.length }, (_, cellIndex) => (
                  <td key={cellIndex} className=' text-center px-4 text-red-600' id={cellIndex.toString()}>
                    {cellIndex === currentColumn ? "" : columnData[cellIndex][rowIndex]}
                  </td>
                ))}
              </tr>
            ))}

            
              <tr>
                <td className='text-center '>IN</td>
                {printedElements.map((element, index) => (
                  <td key={index} className=' text-center px-4 text-blue-600'>
                    {element}
                  </td>
                 ) )}
              </tr>
            
      <tr>
  {/* <td className='text-center '>OUT</td> */}
  {removedElements.map((element, index) => (
    <td key={index} className=' text-center px-4 text-blue-600'>
      {element === null ? '' : element}
    </td>
  ))}
</tr>
<td className=' text-center px-4'>Queqe/stack information.....</td>
{Array.from({ length: memorySize }, (_, rowIndex) => (
  <tr >
<td className=' text-center px-4'></td>
                {Array.from({ length: memoryReferences.length }, (_, cellIndex) => (
                  <td key={cellIndex} className=' text-center px-4 text-pink-500' id={cellIndex.toString()}>
                    {cellIndex === currentColumn ? "" : columnData[cellIndex][rowIndex]}
                </td>
                ))}
              </tr>
            ))}


          </tbody>
        </table>
        {/* {pageNumber === memoryReferences.length && (
          <div className='ml-3 flex flex-wrap gap-4 mt-[6vh]'>
            <span className=''>Total No of Page Fault :  </span>   
           <span className='text-red-600'> {memoryReferences.length}</span>
          </div>
        )}

{pageNumber1 > 0 && pageNumber === memoryReferences.length && (
  <div className='ml-3 flex flex-wrap gap-4'>
    <span className=''>Total No of Page Replace: </span>   
    <span className='text-red-600'>{pageNumber1 -1}</span>
  </div>
)} */}
      </div>
    </div>
  );
};

export default FIFO;

