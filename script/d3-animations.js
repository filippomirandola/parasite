import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
//import * as scrolling from "./scroll_code.js";

const altezzaPagina = window.innerHeight;
const percentualeAltezzaStanze = 0.23;
const unit = altezzaPagina*percentualeAltezzaStanze; //unità di altezza
const k = 3047/900; // lunghezza/altezza csv stanze
const ampiezzaStep = 50;
const zoomX = ampiezzaStep * 2;
export const zoomProgressoFinale = 0.2;
let dimensioneFacce = 20;
const tratt = 10;
const trattS = 5;




export var zoomScena = [
    [1,1],
    [1,4],
    [0,4]
 ];
 var modificatoriZoom = [3,1.5,1.5];

// Dataset piani  bunker / casaPoveri / strada / casaRicchi1 / casaRicchi2
const livelli = [6,5,4,9,5];
let coordinateLivelli = [];
//const personaggi = [4];
const personaggi = [
    {
        nome: "Figlia",
        famiglia: "Parks",
        dataset: "./data/data_figliaparks.csv",
        faccia: "./assets/facce/figliaParks.svg"
    },
    {
        nome: "Figlio",
        famiglia: "Parks",
        dataset: "./data/data_figlioparks.csv",
        faccia: "./assets/facce/bimboparks.png"
    },
    {
        nome: "Jessica",
        famiglia: "Kim",
        dataset: "./data/data_jessica.csv",
        faccia: "./assets/facce/jessica.svg"
    },
    {
        nome: "Kevin",
        famiglia: "Kim",
        dataset: "./data/data_kevin.csv",
        faccia: "./assets/facce/kevin.png"
    },
    {
        nome: "Min",
        famiglia: "Min",
        dataset: "./data/data_min.csv",
        faccia: "./assets/facce/min.png"
    },
    {
        nome: "Papa",
        famiglia: "Kim",
        dataset: "./data/data_papakim.csv",
        faccia: "./assets/facce/papaKim.svg"
    },
    {
        nome: "Mamma",
        famiglia: "Parks",
        dataset: "./data/data_mammaparks.csv",
        faccia: "./assets/facce/mammaParks.svg"
    },
    {
        nome: "Mamma",
        famiglia: "Kim",
        dataset: "./data/data_mammakim.csv",
        faccia: "./assets/facce/mammaKim.svg"
    },
    {
        nome: "BunkerSis",
        famiglia: "Bunker",
        dataset: "./data/data_bunkersis.csv",
        faccia: "./assets/facce/bunkersis.png"
    },

    {
        nome: "BunkerBro",
        famiglia: "Bunker",
        dataset: "./data/data_bunkerbro.csv",
        faccia: "./assets/facce/bunkerBro.png"
    },
    {
        nome: "Papa",
        famiglia: "Parks",
        dataset: "./data/data_papaparks.csv",
        faccia: "./assets/facce/papaParks.png"
    },
    {
        nome: "TEST",
        famiglia: "Parks",
        dataset: "./data/data_testLivelli.csv",
        faccia: "./assets/facce/boh.png"
    }
    

];


// Dataset personaggi: scena, tempo, livello, sottolivello
const dataP1 = await d3.dsv(",",personaggi[0].dataset);
const dataP2 = await d3.dsv(",",personaggi[1].dataset);
const dataP3 = await d3.dsv(",",personaggi[2].dataset);
const dataP4 = await d3.dsv(",",personaggi[3].dataset);
const dataP5 = await d3.dsv(",",personaggi[4].dataset);
const dataP6 = await d3.dsv(",",personaggi[5].dataset);
const dataP7 = await d3.dsv(",",personaggi[6].dataset);
const dataP8 = await d3.dsv(",",personaggi[7].dataset);
const dataP9 = await d3.dsv(",",personaggi[8].dataset);
const dataP10 = await d3.dsv(",",personaggi[9].dataset);
const dataP11 = await d3.dsv(",",personaggi[10].dataset);
const dataP12 = await d3.dsv(",",personaggi[11].dataset);


const spessoreLinee = 5;
const xMaschera = window.innerWidth/2;


// #################################################################################
// #########################     CREAZIONE DATA-PUNTI     ##########################
// #################################################################################


let puntiP1 = [];
let puntiP2 = []; 
let puntiP3 = [];
let puntiP4 = []; 
let puntiP5 = []; 
let puntiP6 = []; 
let puntiP7 = []; 
let puntiP8 = []; 
let puntiP9 = []; 
let puntiP10 = []; 
let puntiP11 = []; 
let puntiP12 = []; 




                // array che all'indice scena dà l'ampiezza della scena (il numero di sottostep di "tempo")
                //  [00,01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16..] 
const ampiezzaScene = [];
 ampiezzaScene[0]=20;
 ampiezzaScene[1]=20;
 ampiezzaScene[2]=20;
ampiezzaScene[3]=20;
 ampiezzaScene[4]=20;
 ampiezzaScene[5]=20;
 ampiezzaScene[6]=20;
 ampiezzaScene[7]=20;
 ampiezzaScene[8]=20;
 ampiezzaScene[9]=20; 


const numeroScene = ampiezzaScene.length;
console.log(numeroScene);

// calcola l'ampiezza della linea calcolando il multiplo dell'ampiezza del modulo dello sfondo più vicino (e maggiore) nell'ampiezza degli step * numero Step
export function stabilisciAmpiezzaLinea(scena) {
    let ampiezzaMin = ampiezzaStep*ampiezzaScene[parseInt(scena)];
    let ampiezzaModulo = k*unit;
    return ampiezzaModulo * (parseInt(ampiezzaMin/ampiezzaModulo)+1);

}

// Scala X sulla base dell'ampiezzaX della linea di una scena
function calcolaScalaX(scena) {
   // console.log("calcolaScene "+scena);
  //  console.log(ampiezzaScene[scena]);
    return d3.scaleLinear().range([xMaschera,xMaschera+stabilisciAmpiezzaLinea(scena)]).domain([0,ampiezzaScene[parseInt(scena)]-1]);
}


// CALCOLO ESTREMI LIVELLI E COORDINATE SOTTOLIVELLI

function calcolaMinYLivello(piano) {
    if (piano == 2 || piano == 3 || piano == 4 ) {
        return (4-piano)*unit;
    }
    else if (piano == 0 || piano == 1) {
        return altezzaPagina - ((piano+1) * (unit));
    }
}

function calcolaMaxYLivello(piano) {
    if (piano == 3 || piano == 4 ) {
        return (4-piano+1)*(unit);
    }
    else if (piano == 0 || piano == 1 || piano == 2) {
        return altezzaPagina - (piano * unit);
    }
}

function calcolaYLivelli() {
    for (let piano = 0; piano < 5; piano++) {
        let y = {};
        switch (piano) {
            case 0:
                y.descrizione = "Bunker";
                break;
            case 1:
                y.descrizione = "Casa Kim";
                break;
            case 2:
                y.descrizione = "Strada";
                break;
            case 3:
                y.descrizione = "Casa Park - Piano Terra";
                break;
            case 4:
                y.descrizione = "Casa Park - Piano Rialzato";
                break;
        }
        y.min = calcolaMinYLivello(piano);
        y.max = calcolaMaxYLivello(piano);
        y.delta = y.max-y.min;

        coordinateLivelli.push(y);
    }
}

calcolaYLivelli();
console.log("INNERHEIGHT: "+window.innerHeight);
console.log("UNIT: "+unit);
console.log(coordinateLivelli);
// Funzione per calcolare la Y dei vari punti (compresa la strada)
function calcolaY(piano,livello) {
   
    // piano 0: bunker
    // piano 1: casa poveri
    // piano 2: strada
    // piano 3: casa ricchi - 01
    // piano 4: casa ricchi - 02
    if (piano !== "daCalcolare") {
        console.log(coordinateLivelli[piano].max);
        return coordinateLivelli[piano].max - ((2*parseInt(livello)+1)*(coordinateLivelli[piano].delta / (2*livelli[piano])));
    }
    else {
     //   console.log("calcolaY in");
        return "daCalcolare";
    }

}
   
// CREAZIONE DATASET VERI E PROPRI

// verifica, ed eventualmente calcola, che tutti i database abbiano inizio e fine scena
function verificaDatabase(dataP) {
    for (let scena = 0; scena < numeroScene; scena++){
        var dataScena = dataP.filter(el => el.scena == scena);
     
        let numeroElementiScena = dataScena.length;

        let elemento;
        // AGGIUNGE PUNTI INIZIALI ASSENTI
        if (dataScena[0].tempo != 0) {
          //  console.log("verifica 1 in");

            elemento = 
                {
                    scena: String(scena),
                    tempo: "0",
                    livello: "daCalcolare",
                    sottolivello: "daCalcolare"
                };
           
            let indiceInizioScena = dataP.findIndex((el) => el.scena == scena);
            dataP.splice(indiceInizioScena, 0, elemento); //inserisce elemento all'interno del dataset
        }

        // CALCOLA PUNTI FINALI ASSENTI
         if (dataScena[dataScena.length-1].tempo != (ampiezzaScene[scena]-1)) {
         //   console.log("verifica 2 in");

            elemento = 
                {
                    scena: String(scena),
                    tempo: String(ampiezzaScene[scena]-1),
                    livello: "daCalcolare",
                    sottolivello: "daCalcolare"
                };
           
            if (scena != 15) {//INSERIRE VALORE CORRETTO SCENA FINALE
                let indiceFineScena = dataP.findIndex((el) => el.scena == scena+1);
                dataP.splice(indiceFineScena, 0, elemento);
            } 
        } 

        
    }
}

// calcola e pusha nell'array i punti della linea di ogni personaggio sulla base del suo csv

function creaDatabase(dataPersonaggio, puntiPersonaggio){
    for (const elem of dataPersonaggio) {
        puntiPersonaggio.push({"scena":elem.scena,"x":calcolaScalaX(elem.scena)(elem.tempo), "y":calcolaY(elem.livello, parseInt(elem.sottolivello)-1)});
     }

     // console.log(puntiPersonaggio);

     // CALCOLA QUELLI DA CALCOLARE
     for (let i = 0; i < puntiPersonaggio.length; i++) {
        let punto = puntiPersonaggio[i];
        if (punto.y === "daCalcolare") {
            if (dataPersonaggio[i].tempo!=="0") {
                // trova precedente
               // console.log("nuovo dentro i = "+i);
            let iPrecedente = i;

            while(puntiPersonaggio[iPrecedente].y == "daCalcolare"){
                iPrecedente--;
            }
            
            let puntoP = puntiPersonaggio[iPrecedente];
        
            
            // trova successivo
            let iSuccessivo = i;

            while(puntiPersonaggio[iSuccessivo].y == "daCalcolare"){
                iSuccessivo++;
            }
            
            let puntoS = puntiPersonaggio[iSuccessivo];
        

            // calcola
            let deltaX;
            deltaX = punto.x - puntoP.x + puntoS.x - xMaschera;
            punto.y = puntoP.y + ((punto.x - puntoP.x)/deltaX)*(puntoS.y-puntoP.y);

            //console.log("i = "+i+" y = "+punto.y);

            } else {
                //console.log("ahaha in");
                punto.y = puntiPersonaggio[i-1].y;
            }
        
        
        }
            
            
                
        }
     }

 verificaDatabase(dataP1);
verificaDatabase(dataP2);
verificaDatabase(dataP3);
verificaDatabase(dataP4);
verificaDatabase(dataP5);
verificaDatabase(dataP6);
verificaDatabase(dataP7);
verificaDatabase(dataP8);
verificaDatabase(dataP9);
verificaDatabase(dataP10);
verificaDatabase(dataP11);
verificaDatabase(dataP12);

console.log(dataP1);

//console.log(dataP5);

creaDatabase(dataP1, puntiP1);
creaDatabase(dataP2, puntiP2);
creaDatabase(dataP3, puntiP3);
creaDatabase(dataP4, puntiP4);
creaDatabase(dataP5, puntiP5);
creaDatabase(dataP6, puntiP6);
creaDatabase(dataP7, puntiP7);
creaDatabase(dataP8, puntiP8);
creaDatabase(dataP9, puntiP9);
creaDatabase(dataP10, puntiP10);
creaDatabase(dataP11, puntiP11);
creaDatabase(dataP12, puntiP12);


console.log("INIZIO PUNTI");
console.log(dataP4);

console.log(puntiP4);
console.log(dataP12);
console.log(puntiP12);


console.log("FINE PUNTI");


/* creaDatabase(dataP3, puntiP3);
creaDatabase(dataP4, puntiP4);
creaDatabase(dataP5, puntiP5); */
//console.log(puntiP5);




//...


// ############################################################################
// #########################    CREAZIONE SFONDO     ##########################
// ############################################################################

// Set the width and height of the SVG container
const width = 600;
const height = 500;


// Create an SVG element
const svg = d3.select("#chart")
    .append("svg")
    .attr("id", "container")
    .attr("width", 3 * k * unit) // sfondo grande 2*numero di moduli
    .attr("height", window.innerHeight)
    .style("display", "block")
    .style("margin", "auto")
    .attr("transform-origin", "0 0");


// Set the  height of the background
let gruppo = svg.append("g").attr("id","sfondo");

// GENERA SFONDI 

// genera un modulo di sfondi sulla base del numero (trasla orizzontalmente di tot larghezze)
function generaSfondoModulo(rip) {
    let x = rip*unit*k;
    gruppo
    .append("image")
    .attr("class","livello0")
    .attr("id","livello0-"+rip)
    .attr("x",x)
    .attr("y",(1-percentualeAltezzaStanze)*altezzaPagina)
    .attr("width",unit*k)
    .attr("height",unit)
    .attr("href","./assets/sfondi/bunker.svg");
 
    gruppo
    .append("image")
    .attr("class","livello1")
    .attr("id","livello1-"+rip)
    .attr("x",x)
    .attr("y",(1-2*percentualeAltezzaStanze)*altezzaPagina)
    .attr("width",unit*k)
    .attr("height",unit)
    .attr("href","./assets/sfondi/casa-kim.svg");

    gruppo
    .append("image")
    .attr("class","livello2")
    .attr("id","livello2-"+rip)
    .attr("x",x)
    .attr("y",2*(percentualeAltezzaStanze)*altezzaPagina)
    .attr("width",unit*k)
    .attr("height",altezzaPagina-4*unit)
    .attr("href","./assets/sfondi/strada.svg");

    gruppo
    .append("image")
    .attr("class","livello3")
    .attr("id","livello3-"+rip)
    .attr("x",x)
    .attr("y",(percentualeAltezzaStanze)*altezzaPagina)
    .attr("width",unit*k)
    .attr("height",unit)
    .attr("href","./assets/sfondi/casa-park-1.svg");
    gruppo
    .append("image")
    .attr("class","livello4")
    .attr("id","livello4-"+rip)
    .attr("x",x)
    .attr("y",0)
    .attr("width",unit*k)
    .attr("height",unit)
    .attr("href","./assets/sfondi/casa-park-2.svg");
 
}


// genera gli sfondi in modo che si raggiunga almeno il doppio dell'ampiezza delle linee della scena più ampia
function generaSfondi() {
    let n = 0;
    while (n*unit*k <= 2*stabilisciAmpiezzaLinea(d3.maxIndex(ampiezzaScene))) {
        //console.log("sfondo " +n);
        generaSfondoModulo(n);
        n++;
    }
        
}
   
generaSfondi();


// #####################################################################################
// #########################      CREAZIONE LINEE & FACCE      #########################
// #####################################################################################

// MASCHERA 

let mascheraContainer = svg.append("clipPath").attr("id","myMask");
let maschera = mascheraContainer.append("rect").attr("width",xMaschera).attr("height",window.innerHeight).attr("fill","black").attr("style","position: sticky;");


// LINEE

// metodo per ottenere x e y per attributo "d" dei path dai dataset con le coordinate
var Gen = d3.line() 
  .x((p) => p.x) 
  .y((p) => p.y); 


// crea gruppo dei gruppi delle linee
const gruppoLinee = svg.append("g").attr("id","linee").attr("clip-path","url(#myMask)");

//inizializzo l'array che raccoglie la lunghezza di tutte le linee. 
// l'indice dell'array è l'id della scena, e contiene al suo interno l'id del personaggio
let lunghezzaLinee = [];

// crea un dataset per una singola scena
function datasetPerScena(dataset, numScena){
    console.log(d3.groups(dataset, d=>d.scena)[numScena]);
    let x = d3.groups(dataset, d=>d.scena)[numScena][1]; //raggruppo il dataset per il numero di scena e prendo l'array corrispondente
    return x; // riduci il dataset in base alla scena
}

// crea le linee di una scena
function creaLineeScena(gruppo, scena) { 
     creaLineaScena(gruppo,"1", puntiP1, scena);
     creaLineaScena(gruppo,"2", puntiP2, scena);
     creaLineaScena(gruppo,"3", puntiP3, scena);
     creaLineaScena(gruppo,"4", puntiP4, scena);
     creaLineaScena(gruppo,"5", puntiP5, scena);
     creaLineaScena(gruppo,"6", puntiP6, scena);
     creaLineaScena(gruppo,"7", puntiP7, scena);
     creaLineaScena(gruppo,"8", puntiP8, scena);
     creaLineaScena(gruppo,"9", puntiP9, scena);
     creaLineaScena(gruppo,"10", puntiP10, scena);
     creaLineaScena(gruppo,"11", puntiP11, scena);
     creaLineaScena(gruppo,"12", puntiP11, scena);

}

// Funzione che calcola la percentuale di ogni punto della linea (per ora non ancora usata)
function  calcolaPercentuale(punti, lunghezza) {
    for (let i = 0; i < punti.length; i++) {
        // serve a calcolare la lunghezza della linea fino al punto corrente in teoria
        let subPath = gruppoLinee.append("path")
                        .attr("id","temp_path")
                        .attr("d",Gen(punti.slice(0, i+1)))
                        .attr("stroke","black")
                        .attr("fill", "none")
                        .attr("stroke-width", spessoreLinee)
                        .attr("style","display:none");

        const lunghezzaTratto = i > 0 ? subPath.node().getTotalLength() : 0;

        // calcola la percentuale
        const percentuale= (lunghezzaTratto / lunghezza) * 100;

        punti[i].progresso=percentuale;
        d3.select("#temp_path").remove();
    }
}


// crea la linea di un personaggio in una scena 
function creaLineaScena(gruppo, idPersonaggio, puntiP, scena) { 
    let puntiScena = datasetPerScena(puntiP, scena);
    let line = gruppo.append("path")
                .attr("id","linea_"+scena+"_P"+idPersonaggio)
                .attr("class","linea_P"+idPersonaggio)
                .attr("d",Gen(puntiScena))
                .attr("stroke", "white")
                .attr("fill", "none")
                .attr("stroke-width", spessoreLinee);
    lunghezzaLinee[scena][idPersonaggio] = line.node().getTotalLength();
    calcolaPercentuale(puntiScena,lunghezzaLinee[scena][idPersonaggio]); 

    /* INSERIRE TRATTEGGI */
     if (scena == 2 && idPersonaggio == 2 ) {
       //console.log("tratt in");
        line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 8, 15));

   }
 

   
}

// crea tutte le linee
for (let scena = 0; scena<numeroScene; scena++) {
    let id = "linee_"+scena;
    console.log(id);
    lunghezzaLinee[scena]=[]; //inizializza l'array della lunghezza delle linee per quella scena specifica
    let gruppoLineeScena = gruppoLinee.append("g").attr("id",id).attr("visibility","hidden");
    creaLineeScena(gruppoLineeScena, scena);
}


// FACCE


function creaFaccia(idPersonaggio) {
    //console.log(personaggi[idPersonaggio].faccia);
    let faccia = svg
        .append("image")
        .attr("class","faccia")
        .attr("id","faccia"+idPersonaggio)
        .attr("width",dimensioneFacce)
        .attr("height",dimensioneFacce)
        .attr("x",-dimensioneFacce/2)
        .attr("y",-dimensioneFacce/2)
        .attr("href", personaggi[parseInt(idPersonaggio)-1].faccia);
}

/* .append("image")
.attr("class","livello2")
.attr("id","livello0-"+rip)
.attr("x",x)
.attr("y",(percentualeAltezzaStanze)*altezzaPagina)
.attr("width",unit*k)
.attr("height",unit)
.attr("href","./assets/casa-park-1.svg"); */


// crea facce 
function creaFacce (){
    //console.log("personaggi: "+personaggi.length);
    for (let i = 1; i<=personaggi.length; i++) {
        creaFaccia(i);
    }
}

creaFacce();




 // POSIZIONA LA FACCIA IN BASE ALLA X DATA COME PARAMETRO
 function muoviFacciaDaX (idFaccia, puntiP, x, traslazione, scena) {
    console.log("in facce id "+idFaccia);
    let obj = document.getElementById(idFaccia);
    let numPunti = puntiP.length; // ottieni il numero di punti che definiscono la linea
   // let ampiezza = puntiP[numPunti-1].x - puntiP[0].x; // ottieni l'ampiezza in x del progresso
    let pt = {}; // crea l'oggetto pt che definirà la posizione della faccia
   // pt.x = puntiP[0].x + progresso * ampiezza;  x della faccia è proporzionale al progresso
    
    pt.x = x;
    let xLinea = x + traslazione;
    //console.log("dentro");
    let i = 0;
    //console.log("x linea "+ xLinea);
    //console.log("num punti: "+numPunti);

    // cerca i due punti tra cui è compresa la x
    while (i < numPunti && puntiP[i].x < xLinea) { // esce quando x è maggiore (o quando la linea è finita)
        i++; 
    } 

    if (idFaccia=="faccia0") {
      //  console.log("il prossimo è "+ i);
    } // il prossimo
    let pt0, pt1;
    if (i< (numPunti-1)) {
         pt0 = puntiP[i-1]; //punto precedente
         pt1 = puntiP[i]; //punto successivo
    }
    else if (i == (numPunti-1)) {
      //  console.log("in ultimo");
         pt0 = puntiP[i];
         pt1 = puntiP[i];
    }
   
    
    console.log(pt0);
    console.log(pt1);
    // calcolo la percentuale di progresso (da 0 a 1) lungo il tratto e la differenza tra le Y
    let progressoTratto = (xLinea-pt0.x) / (pt1.x - pt0.x); 
    let diffY = progressoTratto * (pt1.y - pt0.y);

    // calcolo la y della faccia
    pt.y =  pt0.y + diffY;


    // calcolo il fattore di scala della faccia
  /*   let k = (coordinateLivelli[zoomScena[scena][0]].max - coordinateLivelli[zoomScena[scena][1]].min)/unit;
    console.log("dimensione facce rapporto "+k);
    let nuovaDimensione = k*dimensioneFacce;
    obj.setAttribute("width",nuovaDimensione);
    obj.setAttribute("height",nuovaDimensione);
    obj.setAttribute("x",-nuovaDimensione/2);
    obj.setAttribute("y",-nuovaDimensione/2); */

    // traslo la faccia
    console.log("trasl "+pt.x+" "+pt.y);

    obj.style.webkitTransform = 'translate3d('+pt.x+'px,'+pt.y+'px, 0)'; 
    
 }

 //funzione per ottenere la percentuale nella linea a partire dalla x
 export function muoviFacce(scena, progresso, traslazione) {   
    muoviFacciaDaX("faccia1", datasetPerScena(puntiP1,scena), xMaschera, traslazione, scena);
    muoviFacciaDaX("faccia2", datasetPerScena(puntiP2,scena), xMaschera, traslazione, scena);
    muoviFacciaDaX("faccia3", datasetPerScena(puntiP3,scena), xMaschera, traslazione, scena);
    muoviFacciaDaX("faccia4", datasetPerScena(puntiP4,scena), xMaschera, traslazione, scena); 
    muoviFacciaDaX("faccia5", datasetPerScena(puntiP5,scena), xMaschera, traslazione, scena);
    muoviFacciaDaX("faccia6", datasetPerScena(puntiP6,scena), xMaschera, traslazione, scena);
    muoviFacciaDaX("faccia7", datasetPerScena(puntiP7,scena), xMaschera, traslazione, scena);
    muoviFacciaDaX("faccia8", datasetPerScena(puntiP8,scena), xMaschera, traslazione, scena); 
    muoviFacciaDaX("faccia9", datasetPerScena(puntiP9,scena), xMaschera, traslazione, scena); 
    muoviFacciaDaX("faccia10", datasetPerScena(puntiP10,scena), xMaschera, traslazione, scena); 
    muoviFacciaDaX("faccia11", datasetPerScena(puntiP11,scena), xMaschera, traslazione, scena); 
    muoviFacciaDaX("faccia11", datasetPerScena(puntiP12,scena), xMaschera, traslazione, scena); 

    //...
   
 }


 // MUOVI LA FACCIA A PARTIRE DALLA % PROGRESSO (funzione per ora non usata)
 function muoviFacciaDaProgresso (idFaccia, puntiP, progresso, traslazione) {
    let obj = document.getElementById(idFaccia);
    let numPunti = puntiP.length; // ottieni il numero di punti che definiscono la linea
    let ampiezza = puntiP[numPunti-1].x - puntiP[0].x; // ottieni l'ampiezza in x del progresso
    let pt = {}; // crea l'oggetto pt che definirà la posizione della faccia
    pt.x = puntiP[0].x + progresso * ampiezza; // x della faccia è proporzionale al progresso
  
    let i = 0;
    // cerca i due punti tra cui è compresa la x
    while (i < numPunti && puntiP[i].x < pt.x) { // esce quando x è maggiore (o quando la linea è finita)
        i++; 
    } 


    let pt0 = puntiP[i-1]; //punto precedente
    let pt1 = puntiP[i]; //punto successivo


    // calcolo la percentuale di progresso (da 0 a 1) lungo il tratto e la differenza tra le Y
    let progressoTratto = (pt.x-pt0.x) / (pt1.x - pt0.x); 
    let diffY = progressoTratto * (pt1.y - pt0.y);

    // calcolo la y della faccia
    pt.y =  pt0.y + diffY;

    // traslo la faccia
    let traslazioneX = pt.x - traslazione; 
    obj.style.webkitTransform = 'translate3d('+traslazioneX+'px,'+pt.y+'px, 0)'; 
    
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
// #########################         ZOOM         #############################
// ############################################################################


export function impostaZoomSfondo(rapporto,traslazioneY) {
    svg
    .attr("transform","scale("+rapporto+") "+"translate("+-100*(rapporto / 2)+" "+traslazioneY+") ");
}

export function impostaZoomFacce(rapporto, scena){ 
    let dimensione = dimensioneFacce*2*modificatoriZoom[scena]/rapporto;
    for (let i = 0; i<personaggi.length; i++) {
        let idFaccia="faccia"+i;
        let obj = document.getElementById(idFaccia);
        obj.setAttribute("width",dimensione);
        obj.setAttribute("height",dimensione);
        obj.setAttribute("x",-dimensione/2);
        obj.setAttribute("y",-dimensione/2);
    }
    
}

export function calcolaZoom(progresso, scena, nuovo, vecchio) {
    let deltaAltezza = coordinateLivelli[nuovo[0]].max - coordinateLivelli[nuovo[1]].min;
    let rapportoFinale = altezzaPagina / deltaAltezza;
    let rapporto, traslazioneY;
    let ritardoZoom=0.05;

    if (progresso <= zoomProgressoFinale) // quando deve progredire
     {
      //  console.log("zoom in")

        let deltaAltezzaOld = coordinateLivelli[vecchio[0]].max - coordinateLivelli[vecchio[1]].min;
        let rapportoIniziale = altezzaPagina / deltaAltezzaOld;
      //  console.log("zoom deltaAltezzaOld "+deltaAltezzaOld);
      //  console.log("zoom rapporotiniziale "+rapportoIniziale);
        if (progresso > zoomProgressoFinale*ritardoZoom){
            let calcolaRapporto = d3.scaleLinear().domain([zoomProgressoFinale*ritardoZoom,zoomProgressoFinale]).range([rapportoIniziale,rapportoFinale]);
            rapporto = calcolaRapporto(progresso);    
        } else {
            rapporto = rapportoIniziale;
        }
     //   console.log("progresso zoom: "+rapporto);
        let calcolaTraslazioneY = d3.scaleLinear().domain([0,zoomProgressoFinale]).range([-coordinateLivelli[vecchio[1]].min, -coordinateLivelli[nuovo[1]].min]);
        //rapporto = calcolaRapporto(progresso);    
        traslazioneY = calcolaTraslazioneY(progresso);
     } else {
        rapporto = rapportoFinale;
        traslazioneY = -coordinateLivelli[nuovo[1]].min;
    }
    
    impostaZoomSfondo(rapporto,traslazioneY);
    impostaZoomFacce(rapporto,scena);
} 

/* TRANSIZIONE (A SCATTI..)
export function impostaZoom(progresso, pianoInferiore, pianoSuperiore) {
    let deltaAltezza = coordinateLivelli[pianoInferiore].max - coordinateLivelli[pianoSuperiore].min;
    let rapportoFinale = altezzaPagina / deltaAltezza;
 
    let yCentrale = coordinateLivelli[pianoSuperiore].min + (deltaAltezza / 2);
    svg
        .transition()
        .duration(200)
        .attr("transform","scale("+rapporto+") "+"translate("+-100*(rapporto / 2)+" "+-coordinateLivelli[pianoSuperiore].min+") ");
    svg.attr("transform","scale("+2+")");
} */

export function mostraLineeScena(scena, direzione) {
    d3.select("#linee_"+scena).attr("visibility","visible");
    if(scena>0) {
        let scenaPrec = scena-1;
        d3.select("#linee_"+scenaPrec).attr("visibility","visible");
    }    

    let x;
    if (direzione == "up") {
        x=parseInt(scena)+1;
    }
    if (direzione == "down") 
        x=parseInt(scena)-2;

    d3.select("#linee_"+x).attr("visibility","hidden")

}



// TRATTEGGI LINEE

/*
    1. in input dai i punti iniziali e finali
    2. ottieni lunghezza a-b, b-c, c-d
    3. calcola stringa da mettere nel dasharray

*/

// punti: [0]: scena, x, y, progresso

function tratteggio(personaggio, punti, scena, idInizio, idFine){
    var sottoarray = punti.filter(el => el.scena == scena);

console.log(sottoarray);

    var l = lunghezzaLinee[scena][personaggio];
 //   console.log("tratt lunghezza tot: "+l);
    //lunghezza per i punti
   /*  var a = l * sottoarray[idInizio].progresso/100;
    var b = l * sottoarray[idFine].progresso/100; */

    var a = l * sottoarray[0].progresso/100;
    var b = l * sottoarray[idFine-idInizio-1].progresso/100;

    // crea stringa del dasharray
    var dasharray = a + " ";
    for(var usedlen = 0; usedlen < (b-a-tratt); ) {
        dasharray += tratt + " " + trattS + " "; 
        usedlen += tratt+trattS;
    }
    dasharray += tratt + " " + (l-b);
 //   console.log("tratteggio: "+ dasharray);
    return dasharray;
    


}
