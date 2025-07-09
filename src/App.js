import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "./pages/Loading";


const Home = lazy(() => import("./pages/Home"));
const MemoryManagement = lazy(() => import("./pages/MemoryManagement"));
const VirtualMemory = lazy(() => import("./pages/VirtualMemory"));
const ProcessScheduling = lazy(() => import("./pages/ProcessScheduling"));
const PageReplacement = lazy(() => import("./pages/PageReplacement"));
const File = lazy(() => import("./pages/File"));
const ReaderWriter = lazy(() => import("./pages/ReaderWriter"));
const DiningPhilosopher = lazy(() => import("./pages/DiningPhilosopher"));
const ProducerConsumer = lazy(() => import("./pages/ProducerConsumer"));

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Suspense fallback={<Loading />} ><Home /></Suspense>} />
        <Route path="/memoryManagement" element={<Suspense fallback={<Loading />} ><MemoryManagement /></Suspense>} />
        <Route path="/virtualMemory" element={<Suspense fallback={<Loading />} ><VirtualMemory /></Suspense>} />
        <Route path="/processScheduling" element={<Suspense fallback={<Loading />} ><ProcessScheduling /></Suspense>} />
        <Route path="/pageReplacement" element={<Suspense fallback={<Loading />} ><PageReplacement /></Suspense>} />
        <Route path="/file" element={<Suspense fallback={<Loading />} ><File /></Suspense>} />
        <Route path="/readerWriter" element={<Suspense fallback={<Loading />} ><ReaderWriter /></Suspense>} />
        <Route path="/diningPhilosophers" element={<Suspense fallback={<Loading />} ><DiningPhilosopher /></Suspense>} />
        <Route path="/producerconsumer" element={<Suspense fallback={<Loading />} ><ProducerConsumer /></Suspense>} />
      </Routes>
    </div>
  );
}

export default App;

// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import MemoryManagement from "./pages/MemoryManagement";
// import VirtualMemory from "./pages/VirtualMemory";
// import ProcessScheduling from "./pages/ProcessScheduling";
// import Home from "./pages/Home";
// import PageReplacement from "./pages/PageReplacement";
// import File from "./pages/File";
// import ReaderWriter from "./pages/ReaderWriter";
// import DiningPhilosopher from "./pages/DiningPhilosopher";
// import ProducerConsumer from "./pages/ProducerConsumer";
// import Loading from "./pages/Loading";

// function App() {
//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/memoryManagement" element={<MemoryManagement />} />
//         <Route path="/virtualMemory" element={<VirtualMemory />} />
//         <Route path="/processScheduling" element={<ProcessScheduling />} />
//         <Route path="/pageReplacement" element={<PageReplacement />} />
//         <Route path="/file" element={<File />} />
//         <Route path="/readerWriter" element={<ReaderWriter />} />
//         <Route path="/diningPhilosophers" element={<DiningPhilosopher />} />
//         <Route path="/producerconsumer" element={<ProducerConsumer />} />
//         <Route path="/loading" element={<Loading />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
