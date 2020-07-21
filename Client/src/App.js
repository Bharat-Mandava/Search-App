import React from "react";
import { Dropdown } from "./components/Dropdown";
import AutoCompleteText from "./components/AutoCompleteText";
import './App.css';

function App() {
  return (
    <div className='acontainer'>
      <div >
        <Dropdown />
        <AutoCompleteText />
      </div>
    </div>
  );
}

export default App;
