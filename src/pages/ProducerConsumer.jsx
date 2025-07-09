import React, { useState } from 'react';

const ITEM_HEIGHT_PERCENT = 10;
const MAX_ITEMS = 10;
const INITIAL_VALUES = {
  full: 0,
  mutex: 1,
  empty: 10,
};

const ProducerConsumer = () => {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [producerSleep, setProducerSleep] = useState(false);
  const [consumerSleep, setConsumerSleep] = useState(false);
  
  const [deadlock, setDeadlock] = useState(false);
  const [filled, setFilled] = useState(false);
 
  const handleProduce = () => {
    if (values.empty > 0 && values.full < MAX_ITEMS && !deadlock) {
      const randomNumber = Math.floor(Math.random() * 10); // Generate a random number from 0 to 9
      setItems((prevItems) => [...prevItems, randomNumber]);
      setValues((prevValues) => ({
        ...prevValues,
        full: prevValues.full + 1,
        empty: prevValues.empty - 1,
      }));
      setMessage('Producer perform down operation on empty.\nProducer perform down operation on mutex.\nItem Produced.\nProducer perform up operation on mutex.\nProducer perform up operation on full.');
      setProducerSleep(false);
      
    } else if (deadlock) {
      setMessage(
        'Consumer begin to consume item.\nConsumer reads buffer is empty.\nProcess switching occurs. (Producer gets its turn.)\nProducer produces item.\nItem Produced.\nProcess switching occurs. (Consumer gets its turn.)\nConsumer resumes its execution.\nConsumer has already read buffer is empty'
      );

      setProducerSleep(true);
    } else {
      setProducerSleep(true);
      setMessage('Producer goes to sleep without completing the operation.');
    
    }
    if (filled) {
      setItems(new Array(MAX_ITEMS).fill(null));
    }
  };
  

  const handleConsume = () => {
    if (values.full > 0 && !deadlock) {
      const newItems = [...items];
      newItems.pop();
      setItems(newItems);
      setValues((prevValues) => ({
        ...prevValues,
        full: prevValues.full - 1,
        empty: prevValues.empty + 1,
      }));
      setMessage('Consumer begin to consume item.\nProducer perform down operation on mutex.\nItem Consumed.\nProducer perform up operation on mutex.\nProducer perform up operation on empty.');
      setConsumerSleep(false);
     
    } else if (deadlock) {
      setMessage(
        'Consumer begin to consume item.\nConsumer reads buffer is empty.\nProcess switching occurs. (Producer gets its turn.)\nProducer produces item.\nItem Produced.\nProcess switching occurs. (Consumer gets its turn.)\nConsumer resumes its execution.\nConsumer has already read buffer is empty'
      );
    
      setConsumerSleep(true);
    } else {
      setConsumerSleep(true)
      
      setMessage('Consumer goes to sleep without completing the operation.');
    }
    if (filled) {
     
      setItems(new Array(MAX_ITEMS).fill({}));
    }
  };

  const handleReset = () => {
    setItems([]);
    setValues(INITIAL_VALUES);
    setMessage('');
    setProducerSleep(false);
    setConsumerSleep(false);
  
    setDeadlock(false);
  };

  const handleDeadlockChange = (event) => {
    const isChecked = event.target.checked;
    setDeadlock(isChecked);
    if (isChecked) {
      const randomNumbers = new Array(MAX_ITEMS).fill(0).map(() => Math.floor(Math.random() * 10));
      setMessage(
        'Consumer begin to consume item.\nConsumer reads buffer is empty.\nProcess switching occurs. (Producer gets its turn.)\nProducer produces item.\nItem Produced.\nProcess switching occurs. (Consumer gets its turn.)\nConsumer resumes its execution.\nConsumer has already read buffer is empty'
      );
      setProducerSleep(true);
      setConsumerSleep(true);
      setItems(randomNumbers);
      setValues({
        full: MAX_ITEMS,
        mutex: 1,
        empty: 0,
      });
    } else {
      setMessage('');
      setProducerSleep(false);
      setConsumerSleep(false);
      setItems([]);
      setValues(INITIAL_VALUES);
    }
  };
  
  

  const deadlockButtonClass = deadlock ? 'red-button' : '';
 
  
  return (
    <div className=''>
      <div className='flex flex-col text-lg font-semibold border-2 h-screen w-full border-rose-900 '>
        <div className='flex flex-row justify-evenly items-center py-2 h-[30vh] border-2 '>
          <div className='flex flex-col items-center justify-center'>
            <div className='w-32 h-32 py-14 px-14 border-green-500 bg-gradient-to-t from-gray-300 to-gray-500'>{values.full}</div>
            <span>Full</span>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <div className='w-32 h-32 py-14 px-14 border-green-500 bg-gradient-to-t from-gray-300 to-gray-500'>{values.mutex}</div>
            <span>Mutex</span>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <div className='w-32 h-32 py-14 px-14 border-green-500 bg-gradient-to-t from-gray-300 to-gray-500'>{values.empty}</div>
            <span>Empty</span>
          </div>
        </div>
        <div className='flex flex-row justify-evenly items-center '>
          <div className=' h-[500px] w-full border-2 flex flex-col justify-evenly items-center '>
            <div
              className={`py-10 px-16 ${setProducerSleep ? 'bg-yellow-300' : 'bg-gradient-to-t from-gray-300 to-gray-500'}
              ${deadlockButtonClass ? 'bg-red-600' : 'bg-gradient-to-t from-gray-300 to-gray-500'} `}
              onClick={handleProduce}
              style={{ cursor: 'pointer', boxShadow: '4px 3px 6px #888888' }}
            >
              PRODUCE
            </div>
            <div
              className={`py-10 px-16 ${setConsumerSleep ? 'bg-yellow-300' : 'bg-gradient-to-t from-gray-300 to-gray-500'} ${deadlockButtonClass ? 'bg-red-600' : 'bg-gradient-to-t from-gray-300 to-gray-500'} `}
              onClick={handleConsume}
              style={{ cursor: 'pointer', boxShadow: '4px 3px 6px #888888' }}
            >
              CONSUME
            </div>
            <div
              className={`py-10 px-20 bg-gradient-to-t from-gray-300 to-gray-500`}
              onClick={handleReset}
              style={{ cursor: 'pointer', boxShadow: '4px 3px 6px #888888' }}
            >
              RESET
            </div>
          </div>
          <div className='h-[500px] border-2 w-full flex justify-center items-center'>
            <div className='h-full w-1/2  bg-gradient-to-t from-cyan-200 to-cyan-700'  style={{ position: 'relative' }}>
            <div className="items-container" style={{ overflow: 'hidden', width: '100%' }}>
  {items.map((item, index) => (
    <div
      key={index}
      className="item bg-black border-2 h-[10%] border-gray-400 absolute bottom-0"
      style={{
        width: '100%',
        height: `${ITEM_HEIGHT_PERCENT}%`,
        position: 'absolute',
        bottom: `${index * ITEM_HEIGHT_PERCENT}%`,
      }}
    >
      {item !== null ? <span className="text-white text-center">{item}</span> : null}
    </div>
  ))}
</div>

              <div className='border-2 border-gray-400  h-[20%]'></div>
              <div className='border-2 border-gray-400  h-[20%]'></div>
              <div className='border-2 border-gray-400  h-[30%]'></div>
              <div className='border-2 border-gray-400  h-[12%]'></div>
              <div className='border-2 border-gray-400  h-[25%]'></div>
            </div>
          </div>
          <div className='h-[500px] flex flex-col border-2 w-full '>
            <div className='bg-gradient-to-t from-gray-300 to-gray-500 h-1/2 mx-10 my-10'>{message}</div>
            <div className='flex flex-row justify-center'>
              <label htmlFor="seeDeadlock">
                <input
                  type="checkbox"
                  id="seeDeadlock"
                  onChange={handleDeadlockChange}
                />
                See Deadlock(w/o Semaphores)
              </label>
            </div>
            <div className='flex flex-row justify-center'>
              <div className={`w-6 h-6 bg-red-600`}></div>
              <label htmlFor="">- Sleep With Process</label>
            </div>
            <div className='flex flex-row justify-center'>
              <div className={`w-6 h-6 bg-yellow-300`}></div>
              <label htmlFor="">- Sleep Without Process</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerConsumer;