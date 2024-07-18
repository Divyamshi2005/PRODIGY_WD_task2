// App.js
import React from 'react';
import './App.css'; // Import global CSS for the entire application
import Stopwatch from './component/Stopwatch';

const App = () => {
    return (
        <div className="App">
            <h1>Stopwatch </h1>
            <Stopwatch />
        </div>
    );
};

export default App;
