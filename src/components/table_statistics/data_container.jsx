import React from 'react';
import "../../styles/table_statistics/table.css"
import {Selector} from "./selector";
// class DataContainer extends React.Component {

//   render(){
    
//   }
// }

function DataContainer(){
  
  return(
    <div className='contenedor-datos'>
      
      <Selector></Selector>

      <div className='contenedores-hijos'>
        <h2>Personas Infectadas</h2>
        <input inputMode='numeric' id="entrada1" type="text" readOnly></input>
      </div>

      <div className='contenedores-hijos'>
        <h2>Personas Muertas</h2>
        <input inputMode='numeric' id="entrada2" type="text" readOnly></input>
      </div>
      <div className='contenedores-hijos'>
        <h2>Personas en UCI</h2>
        <input inputMode='numeric' id="entrada3" type="text" readOnly></input>
      </div>
    </div>
  );
}

export default DataContainer;