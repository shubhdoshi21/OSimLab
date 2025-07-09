import React, { useState, useEffect } from 'react';

const statuses = {
    THINKING: 'Thinking',
    HUNGRY: 'Hungry',
    EATING: 'Eating',
    GRABBING_RIGHT: 'Grabbing right chopstick',
    GRABBING_LEFT: 'Grabbing left chopstick',
    DEADLOCK: 'Deadlock'
};
const DiningPhilosopher = () => {
    const [numPhilosophers, setNumPhilosophers] = useState('');
    const [philosophers, setPhilosophers] = useState([]);
    const [statusLog, setStatusLog] = useState([]);
    const [mode, setMode] = useState(null);
    const [hasDeadlockOccurred, setHasDeadlockOccurred] = useState(false);
    let interval;

    const isDeadlocked = (currentPhilosophers) => {
        return currentPhilosophers.every(status => status === statuses.GRABBING_RIGHT);
    };

    const updateWithoutDeadlock = () => {
        const newPhilosophers = [...philosophers];
        const actions = []; 
    
        philosophers.forEach((status, index) => {
            const left = (index - 1 + numPhilosophers) % numPhilosophers;
            const right = (index + 1) % numPhilosophers;
    
            const randomChance = Math.random();  
    
            switch (status) {
                case statuses.THINKING:
                    if (randomChance > 0.5) { 
                        actions[index] = statuses.HUNGRY;
                    } else {
                        actions[index] = statuses.THINKING;
                    }
                    break;
                case statuses.HUNGRY:
                    if (philosophers[left] !== statuses.EATING && philosophers[right] !== statuses.EATING) {
                        actions[index] = 'TRY_EATING'; // intermediate state
                    } else {
                        actions[index] = statuses.HUNGRY;
                    }
                    break;
                case statuses.EATING:
                    actions[index] = statuses.THINKING;
                    break;
                default:
                    actions[index] = status;
                    break;
            }
        });
    
        for (let i = 0; i < numPhilosophers; i++) {
            newPhilosophers[i] = actions[i];
            if (actions[i] === 'TRY_EATING') {
                const left = (i - 1 + numPhilosophers) % numPhilosophers;
                const right = (i + 1) % numPhilosophers;
                if (newPhilosophers[left] !== statuses.EATING && newPhilosophers[right] !== statuses.EATING) {
                    newPhilosophers[i] = statuses.EATING;
                } else {
                    newPhilosophers[i] = statuses.HUNGRY;
                }
            }
        }
    
        return newPhilosophers;
    };
    
    
    
    const updateWithDeadlock = () => {
        const newPhilosophers = [...philosophers];
    
        newPhilosophers.forEach((status, index) => {
            if (status === statuses.THINKING) {
                newPhilosophers[index] = statuses.GRABBING_LEFT;
            } else if (status === statuses.GRABBING_LEFT) {
                newPhilosophers[index] = statuses.GRABBING_RIGHT;
            }
        });
        
        return newPhilosophers;
    };
    const getStatusColor = (status) => {
        switch (status) {
            case statuses.THINKING: return 'bg-red-600';
            case statuses.EATING: return 'bg-blue-600';
            case statuses.HUNGRY: return 'bg-green-600';
            case statuses.GRABBING_RIGHT: case statuses.GRABBING_LEFT: return 'bg-yellow-600';
            default: return '';
        }
    };
    
    const getChopstickColor = (index) => {
        const left = index; // Philosopher to the left of chopstick
        const right = (index + 1) % numPhilosophers; // Philosopher to the right of chopstick
    
        if (philosophers[left] === statuses.EATING || philosophers[right] === statuses.EATING) {
            return 'bg-purple-500';
        } else if (philosophers[right] === statuses.THINKING && philosophers[left] === statuses.THINKING) {
            return 'bg-gray-500';
        } else {
            return 'bg-teal-500';
        }
    };
    
    
    useEffect(() => {
        if (mode && !hasDeadlockOccurred) {
            interval = setInterval(() => {
                let newPhilosophers;
                if (mode === 'DEADLOCK') {
                    newPhilosophers = updateWithDeadlock();
                    if (newPhilosophers.every(status => status === statuses.GRABBING_RIGHT)) {
                        setStatusLog(prevLog => [...prevLog, ...newPhilosophers.map((s, idx) => `Philosopher ${idx}: ${s}`), '--------DEADLOCK----']);
                        clearInterval(interval);
                        return;  // Exit the interval callback
                    }
                } else {
                    newPhilosophers = updateWithoutDeadlock();
                }
                setPhilosophers(newPhilosophers);
                setStatusLog(prevLog => [...prevLog, ...newPhilosophers.map((s, idx) => `Philosopher ${idx}: ${s}`)]);
            }, 2000);
    
            return () => clearInterval(interval);
        }
    }, [philosophers, numPhilosophers, mode, hasDeadlockOccurred]);
    

    const handleModeSelection = (selectedMode) => {
        setMode(selectedMode);
        const initialPhilosophers = Array(parseInt(numPhilosophers)).fill(statuses.THINKING);
        setPhilosophers(initialPhilosophers);
        if (selectedMode === 'NO_DEADLOCK') {
            setStatusLog(prevLog => [...prevLog, ...initialPhilosophers.map((s, idx) => `Philosopher ${idx}: ${s}`)]);
        }
    };
    
    const handleStop = () => {
        clearInterval(interval);
        setMode(null);
        setStatusLog([]);
    };
    const tableSize = numPhilosophers > 4 ? `w-${(12/5)*numPhilosophers}/12 h-${(12/5)*numPhilosophers}/12` : 'w-3/5 h-3/5';
    const philosopherSize = numPhilosophers > 4 ? 'w-8 h-8' : 'w-12 h-12';
    const chopstickSize = numPhilosophers > 4 ? 'w-4 h-4' : 'w-6 h-6';
    const tableRadius = numPhilosophers > 4 ? 200 : 150
    return (
        <div className='flex flex-row h-screen'>
            <div className='w-2/12 bg-pink-400 h-full p-4 py-10 flex flex-col'>
                <p>Enter No of philosophers</p>
                <input 
                    type="number"
                    value={numPhilosophers}
                    onChange={e => setNumPhilosophers(e.target.value)}
                    placeholder="Enter number"
                    className='border p-2 rounded mb-4'
                    min="2"
                />
                <p>Select mode:</p>
                <div className="flex items-center mb-2 py-10">
                    <button onClick={() => handleModeSelection('DEADLOCK')} className="border w-8 h-8 rounded-full mr-2"></button>
                    <p>With deadlock</p>
                </div>
                <div className="flex items-center">
                    <button onClick={() => handleModeSelection('NO_DEADLOCK')} className="border w-8 h-8 rounded-full mr-2"></button>
                    <p>Without deadlock</p>
                </div>
                <button onClick={handleStop} className="border p-2 rounded mt-4">Stop</button>
            </div>
            <div className='bg-slate-300 w-7/12 h-full flex flex-col items-center justify-center relative'>
        <div style={{ width: `${tableRadius * 2}px`, height: `${tableRadius * 2}px` }} className="bg-white rounded-full flex items-center justify-center relative">
        {philosophers.map((status, index) => {
    const angle = (2 * Math.PI / numPhilosophers) * index;
    const nextAngle = (2 * Math.PI / numPhilosophers) * (index + 1);
    const chopstickAngle = (angle + (2 * Math.PI / numPhilosophers) * (index + 1)) / 2;
    
    const philosopherDistance = tableRadius * 0.8;
    const chopstickDistance = tableRadius * 0.9;
    
    const x = tableRadius + philosopherDistance * Math.cos(angle) - 15;  // Adjusted for philosopher's width/2 
    const y = tableRadius + philosopherDistance * Math.sin(angle) - 15;  // Adjusted for philosopher's height/2
    
    const chopstickX = tableRadius + chopstickDistance * Math.cos(chopstickAngle) - 7; // Adjusted for chopstick's width/2
    const chopstickY = tableRadius + chopstickDistance * Math.sin(chopstickAngle) - 7; // Adjusted for chopstick's height/2

    const left = (index - 1 + numPhilosophers) % numPhilosophers;

    return (
        <React.Fragment key={index}>
            <div
                style={{ top: `${y}px`, left: `${x}px` }}
                className={`absolute w-8 h-8 rounded-full ${getStatusColor(status)} flex items-center justify-center`}
            >
                {`P${index}`}
            </div>
            <div
    style={{ top: `${chopstickY}px`, left: `${chopstickX}px` }}
    className={`absolute w-4 h-4 ${getChopstickColor(index)} flex items-center justify-center`}
>
    {`C${index}`}
</div>
        </React.Fragment>
    );
})}

        </div>
    </div>
            <div className='w-3/12 h-full'>
                <div className='h-3/5 flex-grow relative bg-slate-50 overflow-y-auto'>
                    <p className='text-center'>STATUS DISPLAY</p>
                    <div className='border'>
                        {statusLog.map((status, idx) => (
                            <p key={idx}>{status}</p>
                        ))}
                    </div>
                </div>
                <div className='h-2/5 bg-slate-200 text-sm'>
                    <div className='px-5 py-5'>
                    <div className="flex items-center mb-1"><div className="w-4 h-4 rounded-full bg-red-600 mr-2"></div><p>PHILOSOPHER THINKING</p></div>
                        <div className="flex items-center mb-1"><div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div><p>PHILOSOPHER EATING</p></div>
                        <div className="flex items-center mb-1"><div className="w-4 h-4 rounded-full bg-yellow-600 mr-2"></div><p>PHILOSOPHER WAITING</p></div>
                        <div className="flex items-center mb-1"><div className="w-4 h-4 rounded-full bg-green-600 mr-2"></div><p>PHILOSOPHER HUNGRY</p></div>
                        <div className="flex items-center mb-1"><div className="w-4 h-4  bg-purple-600 mr-2"></div><p>CHOPSTICK ACQUIRED FOR EATING</p></div>
                        <div className="flex items-center mb-1"><div className="w-4 h-4  bg-teal-600 mr-2"></div><p>ONE CHOPSTICK ACQUIRED</p></div>
                        <div className="flex items-center"><div className="w-4 h-4  bg-gray-600 mr-2"></div><p>CHOPSTICK NOT ACQUIRED</p></div>
                        <div className="flex items-center"><p> P- PHILOSOPHER </p></div>
                        <div className="flex items-center"><p> C- CHOPSTICK </p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DiningPhilosopher