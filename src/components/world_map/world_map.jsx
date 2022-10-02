import { useD3 } from '../../hooks/use_d3';
import React from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import axios from 'axios';

// capturamos las secciones de nuestra pantalla que queremos que se mueva

function getUsers(datum){
    const getUsers = () => {
        axios.get('http://127.0.0.1:8000/api/country-data-covid/'+datum+'/')
        .then(response => {
            document.getElementById("entrada1").value = FormatDoubleValues(response.data.infected);
            document.getElementById("entrada2").value = FormatDoubleValues(response.data.dead);
            document.getElementById("entrada3").value = FormatDoubleValues(response.data.uci);
            document.getElementById("fechaDatos").innerText = "Fecha reporte de los datos: " + response.data.fecha;
            // console.log(`GET users`, dataCountry);
        })
        .catch(error => console.error(error));
    };
        
    return getUsers();
}

function FormatDoubleValues(value){
    return new Intl.NumberFormat('de-De', {minimumFractionDigits: 0}).format(value);
};

function refresh(svg, path, countryTooltip, countryById) {

    svg.selectAll(".country").attr("d", path)
    .on("mouseover", function (event, datum) {
        const[x, y] = d3.pointer(event, svg);
        countryTooltip.text(countryById[datum.id])
        .style("left", (x + 7) + "px")
        .style("top", (y - 15) + "px")
        .style("display", "block")
        .style("opacity", 1);
        
    })
    .on("mouseout", function (d) {
        countryTooltip.style("opacity", 0)
        .style("display", "none");
    })
    .on("mousemove", function (event, datum) {
        const[x, y] = d3.pointer(event, svg);
        countryTooltip.style("left", (x + 7) + "px")
            .style("top", (y - 15) + "px");
    })
    .on("click", function (event, datum) {

        getUsers(datum.id);
        const $select = document.getElementById('selector');
        const $options = $select.options;
        console.log("selectedIndex",$select.selectedIndex);
        for(var i in $options){
            if($options[i].value===datum.id){
                $select.selectedIndex = $options[i].index;
            }
            console.log($select.options[i].index);
        }
        
        console.log("selectedIndex",$select.selectedIndex);
        
    });
    svg.selectAll(".land").attr("d", path)
    svg.selectAll(".boundary").attr("d", path)
    
}

var m0, o0;
function mousedown(projection, event, svg) {
    const[x, y] = d3.pointer(event, svg);
    m0 = [x, y];
    o0 = projection.rotate();
    event.preventDefault();
}
function mousemove(svg, path, countryTooltip, countryById, projection, event) {
    if (m0) {
        const[x, y] = d3.pointer(event, svg);
        var m1 = [x, y]
            , o1 = [o0[0] + (m1[0] - m0[0]) /6, o0[1] + (m0[1] - m1[1]) / 6];
        console.log(o1);
        o1[1] = o1[1] > 30  ? 30  :
                o1[1] < -30 ? -30 :
                o1[1];
        projection.rotate(o1);

        refresh(svg, path, countryTooltip, countryById);
    }
}
function mouseup(svg, path, countryTooltip, countryById, projection, event) {
    if (m0) {
        mousemove(svg, path, countryTooltip, countryById, projection, event);
        m0 = null;
    }
}

function WorldMap() {
    useD3(() => {
            /* ajuste del mapa en el body */
            var width = 1000,
            height = 500;
            /* Configuración del mapa mundi*/
            var projection = d3.geoOrthographic() // función orthographic es para la medida precisa de la proyección
                .scale(200) //Tamaño del mapa
                .translate([width / 2, height / 2]) // posición del circulo
                .clipAngle(90) // Borde de la circunferencia revisar: https://bl.ocks.org/HarryStevens/a31dc1bb2c8ebb864cc4bbdfe829047b
                .precision(.1); //ajuste de las lineas del mapa mundi

            /* se crea la variable path  que crea un nuevo generador de ruta geografica */
            var path = d3.geoPath() // se utiliza para especificar un tipo de proyección que se usa para los mapas web
                .projection(projection);

            var graticule = d3.geoGraticule(); // función para el manejo de las lineas del mapamundi

            /**Se selecciona el body y se le agrega un svg con los tamaños del body*/
            var svg = d3.select(".mapamundi").append("svg")
                .attr("width", width)
                .attr("height", height)
                .on("mousedown", function(event, datum){
                    mousedown(projection, event, svg)   
                });

            /*  */
            svg.append("defs").append("path")
                .datum({ type: "Sphere" })
                .attr("id", "sphere")
                .attr("d", path);

            svg.append("use")
                .attr("class", "stroke")
                .attr("xlink:href", "#sphere");

            svg.append("use")
                .attr("class", "fill")
                .attr("xlink:href", "#sphere");

            svg.append("path")
                .datum(graticule)
                .attr("class", "graticule")
                .attr("d", path);

            /** Se inicializa el json donde está las úbicaciones de los paises se encuentra en la carpeta material*/
            var land;
            var countries;
            var world = d3.json("./data/world-110m.json")
            world.then(function(world) {
                console.log(`world: `,world);
                // if (error) throw error;
                land = topojson.feature(world, world.objects.land);
                svg.insert("path", ".graticule")
                    .datum(land)
                    .attr("class", "land")
                    .attr("d", path);
                
                countries = topojson.feature(world, world.objects.countries).features
                countries.forEach(function (d) {
                    svg.insert("path", ".graticule")
                    .datum(d)
                    .attr("class", "country")
                    .attr("d", path)
                });
                

                /*Se inserta en el path los datos de las posiciones de los paises */
                svg.insert("path", ".graticule")
                    .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
                    .attr("class", "boundary")
                    .attr("d", path)
            });
            // d3.select(self.frameElement).style("height", height + "px");

            // Ejecuta mousemove y mouse up cuando el usuario selecione la ventana
            d3.select(window)
            .on("mousemove", function(event, datum){
                mousemove(svg, path, countryTooltip, countryById, projection, event)
            })
            .on("mouseup", function(event, datum){
                mouseup(svg, path, countryTooltip, countryById, projection, event)
            });

            var countryById = {};

            var countryTooltip = d3.select(".mapamundi").append("div").attr("class", "countryTooltip");
            var countryData = d3.tsv("./data/world-country-names.tsv");
            console.log(`countryData: `,countryData);
            countryData.then(function(datum){
                datum.forEach(function(d){            
                    countryById[d.id] = d.name;
                });
            })

            const $selectorCountry = document.getElementById("selector");

            const selectedCountry = () => {
                var value = $selectorCountry.value;
                getUsers(value);
            }

            $selectorCountry.addEventListener("change",selectedCountry);


            console.log(`countryById: `,countryById)
        }
    );

  return (
        <div className='mapamundi'>
        </div>     
    );
}

export default WorldMap;