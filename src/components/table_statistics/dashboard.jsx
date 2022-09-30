import React from 'react';

import DataContainer from "./data_container";
import "../../styles/table_statistics/dashboardStyle.css"

class Dashboard extends React.Component {

    render(){
        return(
            
            <div className='contenedor-informacion'>
                <div className='clsButton'>
                   <button class='btAnimacion' > <a href="#" target="_blank"></a>Activar Animación </button> 
                </div>
                
                <div className='header-informacion'>
                    <h1>Información Covid-19</h1>
                </div>

                <div className='seccion-datos'>
                    <DataContainer></DataContainer>
                </div>

                <div className='contenedor-infProyecto'>
                    <h3 id='fechaDatos'></h3>
                    <h3>
                    Fuente de los datos:  <a className='PathData' href="https://github.com/CSSEGISandData/COVID-19">COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University</a>
                    </h3>
                </div>
                
            </div>
        );
    }

}

export default Dashboard