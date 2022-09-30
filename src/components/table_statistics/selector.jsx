import React from 'react';
import "../../styles/selector/selectorStyle.css";
import {useState , useEffect} from 'react';
import axios from 'axios';
// countryData.map(element => (
//     <option value={element.id}>{element.name}</option>
// ))
export const Selector = () => {

  const [country , setCountryState] = useState([]);
  
  const getCountry = () => {
    // let urlCountry = ;
    axios.get("http://127.0.0.1:8000/api/country-data-covid/countrys/")
      .then((response) => {
          setCountryState(response.data);
      })
      .catch((error) => {
          console.log(error);
      });
  };

  useEffect(()=>{
    getCountry();
  }, [])

  

  return <div className='seleccion-pais'>
      <h2>Seleccione el país</h2>
      <select name="select" id="selector">
          {country.map((element) => {
            return (
              <option key={element.id} value={element.id}>
                {element.name}
              </option>
            );
          })}
      </select>
  </div>
};