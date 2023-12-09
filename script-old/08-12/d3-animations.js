// Load our data
const usaGeojson = await d3.json("./data/usa.json")
const cities = await d3.json("./data/cities.json")

const datatest = await d3.dsv(",","./data/test_dataset.csv");
//const datatest2 = await d3.dsv(",","./data/test_dataset_2.csv");
const datatest2 = await d3.dsv(",","./data/test_dataset_prova2.csv");

let unit = window.innerHeight/4;

console.log(datatest)
console.log(datatest2)

let datatest_linea = [];
let datatest_linea2 = []; 
let p, l;

function calcolaY(piano,livello) {

    return (3-piano)*unit + (unit/5)*(5-livello);
}
let scaleX = d3.scaleLinear().range([100,4*unit]).domain(d3.extent(datatest, (d)=>d["tempo"]));
let scaleX_2 = d3.scaleLinear().range([100,4*unit]).domain(d3.extent(datatest2, (d)=>d["tempo"]));


for (const elem of datatest) {
    /* datatest_linea[riga].t = (d)=> (datatest, d["tempo"]);
    datatest_linea[riga].y = (d)=> (datatest, d["piano"]); */
    // datatest_linea.push({"tempo":elem.tempo, "y":calcolaY(elem.piano, elem.livello)});
   // datatest_linea.push(scaleX(elem.tempo), calcolaY(elem.piano, elem.livello)]);
   datatest_linea.push({"x":scaleX(elem.tempo), "y":calcolaY(elem.piano, elem.livello)});
}

for (const elem2 of datatest2) {
    datatest_linea2.push({"x": scaleX_2(elem2.tempo), "y": calcolaY(elem2.piano, elem2.livello)});
}

console.log(datatest_linea);
console.log(datatest_linea2);

// Set the width and height of the SVG container
const width = 600;
const height = 500;


// Create an SVG element
const sfondo = d3.select("#chart")
    .append("svg")
   // .attr("viewBox", "0 0 "+ 2*window.innerWidth +" "+ window.innerHeight)
    .attr("width", 12 * unit)
    .attr("height", window.innerHeight)
    .style("display", "block")
    .style("margin", "auto");


let svg = sfondo;

// Set the  height of the background


let gruppo = svg.append("g").attr("id","sfondo");


gruppo
   .append("image")
   .attr("id","livello0")
   .attr("x",0)
   .attr("y",unit*3)
   .attr("width",unit*6)
   .attr("height",unit)
   .attr("href","./assets/sfondo-test-01.svg");

   gruppo
   .append("image")
   .attr("id","livello1")
   .attr("x",0)
   .attr("y",unit*2)
   .attr("width",unit*6)
   .attr("height",unit)
   .attr("href","./assets/sfondo-test-02.svg");

   gruppo
   .append("image")
   .attr("id","livello2")
   .attr("x",0)
   .attr("y",unit*1)
   .attr("width",unit*6)
   .attr("height",unit)
   .attr("href","./assets/sfondo-test-03.svg");
   gruppo
   .append("image")
   .attr("id","livello3")
   .attr("x",0)
   .attr("y",0)
   .attr("width",unit*6)
   .attr("height",unit)
   .attr("href","./assets/sfondo-test-04.svg");

   gruppo
   .append("image")
   .attr("id","livello0")
   .attr("x",unit*6)
   .attr("y",unit*3)
   .attr("width",unit*6)
   .attr("height",unit)
   .attr("href","./assets/sfondo-test-01.svg");

   gruppo
   .append("image")
   .attr("id","livello1")
   .attr("x",unit*6)
   .attr("y",unit*2)
   .attr("width",unit*6)
   .attr("height",unit)
   .attr("href","./assets/sfondo-test-02.svg");

   gruppo
   .append("image")
   .attr("id","livello2")
   .attr("x",unit*6)
   .attr("y",unit*1)
   .attr("width",unit*6)
   .attr("height",unit)
   .attr("href","./assets/sfondo-test-03.svg");
   gruppo
   .append("image")
   .attr("id","livello3")
   .attr("x",unit*6)
   .attr("y",0)
   .attr("width",unit*6)
   .attr("height",unit)
   .attr("href","./assets/sfondo-test-04.svg");









// ############################################################################
// #########################    MAP GENERATION    #############################
// ############################################################################
/* 
// Create a projection for the map
const projection = d3.geoAlbersUsa()
    .fitSize([width, height], usaGeojson);

// Create a path generator
const geoPath = d3.geoPath()
    .projection(projection);

// Draw the map of USA states
const usa = svg.selectAll("path")
    .data(usaGeojson.features)
    .enter()
    .append("path")
    .attr("d", geoPath)
    .style("fill", "lightgray")
    .style("stroke", "white");

console.log(usaGeojson.features) */


// ############################################################################
// #########################    JOURNEY GENERATION    #########################
// ############################################################################

/* // Define the journey path with coordinates
const num_cities = 10
let journeyPath = []
for(let i=0; i< num_cities; i++){
    let selectedCity = cities[randomIntFromInterval(0, cities.length)]
    journeyPath.push([selectedCity.longitude, selectedCity.latitude])
}

journeyPath = journeyPath.map(d => projection(d))

// Construct the D3 path element by iterating over all the points and placing them to the map
let path = d3.path()
let first_elem = true
for(let point of journeyPath){
    if(first_elem === true){
        path.moveTo(point[0], point[1]) // starting point
    }else{
        path.lineTo(point[0], point[1]) // all the others
    }
    first_elem = false
} */


// ############################################################################
// #########################      CREAZIONE PATH      #########################
// ############################################################################

// let scaleX = d3.scaleLinear().range([100,24*unit]).domain(d3.extent(datatest_linea, (d)=>d[0]));

console.log("haha");
let lineFunction = d3.line().x((d) => scaleX(d[0])).y(datatest_linea, (d)=> d[1]);
console.log(datatest_linea, (d)=>d["y"]);  

let mascheraContainer = svg.append("clipPath").attr("id","myMask");
let maschera = mascheraContainer.append("rect").attr("width","300").attr("height",window.innerHeight).attr("fill","black").attr("style","position: sticky;");

// once we have created the path we need to add it to the svg
//const line = svg.append("path")

var Gen = d3.line() 
  .x((p) => p.x) 
  .y((p) => p.y); 

const linesGroup = svg.append("g").attr("clip-path","url(#myMask)");
const line = linesGroup.append("path")
            //    .datum(datatest)
                .attr("id","the_line")
               // .attr("d", lineFunction)
              // .attr("d", d3.line()(datatest_linea))
              .attr("d",Gen(datatest_linea))
                .attr("stroke", "white")
                .attr("fill", "none")
                .attr("stroke-width", 5);                

const totalLength = line.node().getTotalLength();

console.log("Tot = "+totalLength);
console.log(datatest_linea.length);


function  calcolaPercentuale() {
    const lunghezzaTotale = line.node().getTotalLength();

 // inizializza la lunghezza “accumulata” fino a quel punto 
 let lunghezzaAccumulata= 0;

 for (let i = 0; i < datatest_linea.length; i++) {
     // serve a calcolare la lunghezza della linea fino al punto corrente in teoria
     let subPath = linesGroup.append("path")
                    .attr("id","temp_path")
                    .attr("d",Gen(datatest_linea.slice(0, i+1)))
                    .attr("stroke","black")
                    .attr("fill", "none")
                    .attr("stroke-width", 5)
                    .attr("style","display:none");

 //   console.log(datatest_linea.slice(0, i+1));

     const lunghezzaTratto = i > 0 ? subPath.node().getTotalLength() : 0;

     // così si aggiorna la lunghezza accumulata
     // lunghezzaAccumulata += lunghezzaTratto;

     // calcola la percentuale
     const percentuale= (lunghezzaTratto / lunghezzaTotale) * 100;

    // console.log(`Punto ${i + 1}: Coordinate ${datatest_linea[i]}, Percentuale ${percentuale.toFixed(2)}%`);
    datatest_linea[i].progresso=percentuale;
    d3.select("#temp_path").remove();
 }
}

calcolaPercentuale(); 
console.log(datatest_linea);


//line
 //   .attr("stroke-dasharray", totalLength + " " + totalLength) // controlls the pattern of the dashed line
 //   .attr("stroke-dashoffset", totalLength) // shifts the dashed line so that it starts at the end of the line --> invisible


 var obj = document.getElementById('obj1');
 var path = document.getElementById("the_line");

 //funzione per ottenere la percentuale nella linea a partire dalla x
 export function moveObjFromXProgress(progresso, translation) {

    let numPunti = datatest_linea.length; // ottieni il numero di punti che definiscono la linea
    let ampiezza = datatest_linea[numPunti-1].x - datatest_linea[0].x; // ottieni l'ampiezza in x del progresso
    let pt = {}; // crea l'oggetto pt che definirà la posizione della faccia
    pt.x = datatest_linea[0].x + progresso * ampiezza; // x della faccia è proporzionale al progresso
    console.log("ptX: "+pt.x);
    let i = 0;
    // cerca i due punti tra cui è compresa la x
    while (i < numPunti && datatest_linea[i].x < pt.x) { // esce quando x è maggiore (o quando la linea è finita)
        i++; 
    } 



    let pt0 = datatest_linea[i-1]; //punto precedente
    let pt1 = datatest_linea[i]; //punto successivo

    // calcolo la percentuale di progresso (da 0 a 1) lungo il tratto e la differenza tra le Y
    let progressoTratto = (pt.x-pt0.x) / (pt1.x - pt0.x); 
    let diffY = progressoTratto * (pt1.y - pt0.y);

    // calcolo la y della faccia
    pt.y =  pt0.y + diffY;

    // traslo la faccia
    let translationX = pt.x - translation; 
    obj.style.webkitTransform = 'translate3d('+translationX+'px,'+pt.y+'px, 0)'; 

 }

//SECONDA LINEA
const line2 = linesGroup.append("path")
    .attr("id", "the_line_2")
    .attr("d", Gen(datatest_linea2))
    .attr("stroke", "red")
    .attr("fill", "none")
    .attr("stroke-width", 5);

const totalLength2 = line2.node().getTotalLength();
//hideSecondLine();

function calcolaPercentualeLinea2() {
    const lunghezzaTotale = line2.node().getTotalLength();

    let lunghezzaAccumulata = 0;

    for (let i = 0; i < datatest_linea2.length; i++) {
        let subPath = linesGroup.append("path")
             .attr("id","temp_path")
            .attr("d", Gen(datatest_linea2.slice(0, i + 1)))
            .attr("stroke", "black")
            .attr("fill", "none")
            .attr("stroke-width", 5)
            .attr("style","display:none");

        const lunghezzaTratto = i > 0 ? subPath.node().getTotalLength() : 0;

        const percentuale = (lunghezzaTratto / lunghezzaTotale) * 100;

        datatest_linea2[i].progresso = percentuale;
        d3.select("#temp_path").remove();
        
    }
}

calcolaPercentualeLinea2();
console.log(datatest_linea2);

function hideSecondLine() {
    line2
        .attr("stroke-dasharray", totalLength2 + " " + totalLength2)
        .attr("stroke-dashoffset", totalLength2);
}

function drawSecondLinePath(offset) {
    line2
        .transition()
        .duration(100)
        .attr("stroke-dashoffset", totalLength2 * (1 - offset));
}

var obj2 = document.getElementById('obj2');
var path2 = document.getElementById("the_line_2");

export function moveObjFromXProgress2(progresso, translation) {
    let numPunti2 = datatest_linea2.length;
    let ampiezza2 = datatest_linea2[numPunti2 - 1].x - datatest_linea2[0].x;
    let pt2 = {};
    pt2.x = datatest_linea2[0].x + progresso * ampiezza2;
    console.log("ptX: " + pt2.x);
    let i = 0;

    while (i < numPunti2 && datatest_linea2[i].x < pt2.x) {
        i++;
    }

    let pt0_2 = datatest_linea2[i - 1];
    let pt1_2 = datatest_linea2[i];

    let progressoTratto2 = (pt2.x - pt0_2.x) / (pt1_2.x - pt0_2.x);
    let diffY2 = progressoTratto2 * (pt1_2.y - pt0_2.y);

    pt2.y = pt0_2.y + diffY2;

    let translationX2 = pt2.x - translation;
    obj2.style.webkitTransform = 'translate3d(' + translationX2 + 'px,' + pt2.y + 'px, 0)';
}


 // VECCHIA FUNZIONE 
 export function moveObj(prcnt, translation)
 {
   prcnt = (prcnt*totalLength) / 100;
 
   // Get x and y values at a certain point in the line
  let pt = path.getPointAtLength(prcnt);
   pt.x = Math.round(pt.x);
   pt.y = Math.round(pt.y);
   
   let translationX = pt.x - translation; 
   obj.style.webkitTransform = 'translate3d('+translationX+'px,'+pt.y+'px, 0)'; }




// ############################################################################
// #########################    ALL CITIES GENERATION       ###################
// ############################################################################

/* // add bubble chart
let maxPopulation = d3.max(cities, d => +d.population)
let minPopulation = d3.min(cities, d => +d.population)
let scalingRadius = d3.scaleLinear().domain([minPopulation, maxPopulation]).range([3,30])
let scalingColor = d3.scaleLinear().domain([minPopulation, maxPopulation]).range(["#C8FCEA","#518071"])
console.log(maxPopulation, minPopulation)

const allCities = svg
                    .selectAll("dot")
                    .data(cities)
                        .join("circle")
                            .attr("class", "bubbles")
                            .attr("cx", d => projection([d.longitude, d.latitude])[0])
                            .attr("cy", d => projection([d.longitude, d.latitude])[1])
                            .attr("r", d => scalingRadius(d.population))
                            .style("fill", d => scalingColor(d.population))
                            .attr("stroke", "#00C896")
                            .attr("opacity", 0) */


// ############################################################################
// #########################    JOURNEY CITIES GENERATION       ###############
// ############################################################################

/* // add bubble chart
const journeyCities = svg
                    .selectAll("dot")
                    .data(journeyPath)
                        .join("circle")
                            .attr("class", "bubbles")
                            .attr("cx", d=>d[0])
                            .attr("cy", d=>d[1]-height)
                            .attr("r", 5)
                            .style("fill", "red")
                            .attr("stroke", "black")
                            .attr("opacity", 0)

// Create the axis to show the journey city
let min_x = d3.min(journeyPath, city => city[0])
let max_x = d3.max(journeyPath, city => city[0])

let min_y = d3.min(journeyPath, city => city[1])
let max_y = d3.max(journeyPath, city => city[1])

let x = d3.scaleLinear().domain([min_x, max_x]).range([0, width])
let y = d3.scaleLinear().domain([min_y, max_y]).range([height, 0])

svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class", "Xaxis axis")
        .attr("opacity", 0)        
        .call(d3.axisBottom(x));

svg.append("g")
        .attr("class", "Yaxis axis")
        .attr("opacity", 0)
        .call(d3.axisLeft(y));
 */


// ############################################################################
// #########################    FUNCTIONS                   ###################
// ############################################################################

export function mostraLivelli(x) {
    if (x == 1) {

    }
}


export function drawJourneyCities(){
    journeyCities
        .transition()
        .duration(1000)
        .ease(d3.easeBounceIn)
        .attr("opacity", 1)
        .attr("transform", "translate(0, "+ height+")")
        
    }

export function hideJourneyCities(){
    journeyCities
        .transition()
        .duration(1000)
        .ease(d3.easeBounceOut)
        .attr("opacity", 0)
        .attr("transform", "translate(0, -"+ height+")")
}



export function drawBubbles(){
    allCities
        .transition()
        .duration(1000)
        .attr("opacity", 1) // shift it back to the beginning --> making a transition 
}

export function hideBubbles(){
    allCities
        .transition()
        .duration(1000)
        .attr("opacity", 0)
}

export function mapOpacity(opacity){
    usa
        .transition()
        .duration(10)
        .attr("opacity", 1-opacity) // shift it back to the beginning --> making a transition 
}


export function drawLinePath(offset){
    line
      .transition()
      .duration(100)
      .attr("stroke-dashoffset", totalLength*(1-offset)) // shift it back to the beginning --> making a transition 
}

export function hideLinePath(){
    line
        .transition()
        .duration(1500)
        .attr("stroke-dashoffset", totalLength)
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function increaseJourney(progress){
    journeyCities
        .transition()
        .duration(10)
        .attr("r", 5+8*progress)
}

export function allCitiesOpacity(progress){
    allCities
        .transition()
        .duration(10)
        .attr("opacity", 1-progress)
}

export function setOpacityProgressive(element, progress){
    element
        .transition()
        .duration(10)
        .attr("opacity", progress) 
}

export function setOpacityUniqueTransition(element, progress){
    element
        .transition()
        .duration(1000)
        .attr("opacity", progress) 
}

export function setOpacityAxes(toggleX, toggleY, progress){

    if(toggleX)
        svg.selectAll(".Xaxis")
            .transition()
            .duration(10)
            .attr("opacity", progress)

    if(toggleY)
        svg.selectAll(".Yaxis")
            .transition()
            .duration(10)
            .attr("opacity", progress)
} 

export function selezionaSfondo(x) {
   let y;
   let height;
 //  let windowHeight = window.innerHeight;

    switch (x) {
    case 0: //solo poveri
        gruppo.select("#medio").attr("y",0).attr("height","100%");
        break;

    case 1: // poveri+ricchi
        gruppo.select("#medio").attr("y",0).attr("height","%");
        gruppo.select("#sopra").attr("y",window.innerHeight).attr("height","100%");
        gruppo.select("#sotto").attr("y",window.innerHeight).attr("height","100%");

        break;

    
    case 2: // poveri+ricchi+bunker
        gruppo.select("#medio").attr("y",window.innerHeight/3).attr("height","33%");
        gruppo.select("#sopra").attr("y",0).attr("height","33%");
        gruppo.select("#sotto").attr("y",2*window.innerHeight/3).attr("height","33%");

        break;

    default:
        break;
    
  
    
    }
   // gruppo.select("#back").attr("y",y).attr("height",height);

}

