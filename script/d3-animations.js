//bunkersis sparisce a 3,12
// e riappare a 5,14 a piano 3,1

// papaparks compare a 2,12

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
//import * as finale from "./finale.js";

//import * as scrolling from "./scroll_code.js";

export var altezzaPagina = window.innerHeight;
export var larghezzaPagina = window.innerWidth;
const percentualeAltezzaStanze = 0.23;
const unit = altezzaPagina*percentualeAltezzaStanze; //unità di altezza
const k = 3040/858; // lunghezza/altezza csv stanze
const ampiezzaStep = 50;
const zoomX = ampiezzaStep * 2;
export const zoomProgressoFinale = 0.2;
export const dimensioneFacce = altezzaPagina/50;
let dimensioneNomi = 0.85;
let dimensioneOggetti = 30;
let kMaschera = 2.3;


const tratt = 20;
const trattS = 10;
const mostraDebug = false;




export var zoomScena = [
    [1,1],
    [1,4],
    [1,4],
    [1,4],
    [1,4],
    [1,4],
    [0,4],
    [0,4],
    [0,4],
    [3,3],
    [0,4],
    [0,4]
 ];
 var modificatoriZoom = [3,1.2,1.2,1.2,1.2,1.2,1,1,1,2.7,1,1];

// Dataset piani  bunker / casaPoveri / strada / casaRicchi1 / casaRicchi2
const livelli = [6,5,4,9,5];
let coordinateLivelli = [];
//const personaggi = [4];
export const personaggi = [
    {
        i: 1,
        nome: "Da Hye",
        famiglia: "Parks",
        dataset: "./data/data_figliaparks.csv",
        faccia: "./assets/facce/figliaParks.svg",
        dimensione: 1
    },
    {
        i: 2,
        nome: "Da Song",
        famiglia: "Parks",
        dataset: "./data/data_figlioparks.csv",
        faccia: "./assets/facce/bimboParks.svg",
        dimensione: 0.8
    },
    {
        i: 3,
        nome: "Ki Jung",
        famiglia: "Kim",
        dataset: "./data/data_jessica.csv",
        faccia: "./assets/facce/jessica.svg",
        morte: "./assets/facce/morti/jessica-morta.svg",
        dimensione: 1.2
    },
    {
        i: 4,
        nome: "Ki Woo",
        famiglia: "Kim",
        dataset: "./data/data_kevin.csv",
        faccia: "./assets/facce/kevin.svg",
        dimensione: 1
    },
    {
        i: 5,
        nome: "Min",
        famiglia: "Min",
        dataset: "./data/data_min.csv",
        faccia: "./assets/facce/min.svg",
        dimensione: 0.9
    },
    {
        i: 6,
        nome: "Ki Taek",
        famiglia: "Kim",
        dataset: "./data/data_papakim.csv",
        faccia: "./assets/facce/papaKim.svg",
        dimensione: 1.2
    },
    {
        i: 7,
        nome: "Yeon Kyo",
        famiglia: "Parks",
        dataset: "./data/data_mammaparks.csv",
        faccia: "./assets/facce/mammaParks.svg",
        dimensione: 1.1
    },
    {
        i: 8,
        nome: "Chung Sook",
        famiglia: "Kim",
        dataset: "./data/data_mammakim.csv",
        faccia: "./assets/facce/mammaKim.svg",
        dimensione: 0.8
    },
    {
        i: 9,
        nome: "Moon Gwang",
        famiglia: "Bunker",
        dataset: "./data/data_bunkersis.csv",
        faccia: "./assets/facce/bunkerSis.svg",
        morte: "./assets/facce/morti/bunkerSis-morta.svg",
        dimensione: 1
    },

    {
        i: 10,
        nome: "Geun Se",
        famiglia: "Bunker",
        dataset: "./data/data_bunkerbro.csv",
        faccia: "./assets/facce/bunkerBro.svg",
        morte: "./assets/facce/morti/bunkerBro-morto.svg",
        dimensione: 0.9
    },
    {
        i: 11,
        nome: "Dong Ik",
        famiglia: "Parks",
        dataset: "./data/data_papaparks.csv",
        faccia: "./assets/facce/papaParks.svg",
        morte: "./assets/facce/morti/papaParks-morto.svg",
        dimensione: 1.1

    }/* ,
    {
        i: 12,
        nome: "Pietra",
        famiglia: "Pietra",
        dataset: "./data/data_pietra.csv",
        faccia: "./assets/oggetti/pietra.svg",
        dimensione: 1
    },
    {
        i: 13,
        nome: "Auto",
        famiglia: "Auto",
        dataset: "./data/data_auto.csv",
        faccia: "./assets/oggetti/auto.svg",
        dimensione: 1
    },
    {
        i: 14,
        nome: "Pesca",
        famiglia: "Auto",
        dataset: "./data/data_pietra.csv",
        faccia: "./assets/oggetti/pesca.svg",
        dimensione: 1
    } */
];

const oggetti = [
    {
        i: 0,
        id: "auto",
        src: "./assets/oggetti/auto.svg",
        dimensione: 1.5
    },
    {
        i: 1,
        id: "bicchiere",
        src: "./assets/oggetti/bicchiere.svg",
        dimensione: 1.3
    },
    {
        i: 2,
        id: "bottiglia",
        src: "./assets/oggetti/bottiglia.svg",
        dimensione: 1
    },
    {
        i: 3,
        id: "campanello1",
        src: "./assets/oggetti/campanello.svg",
        dimensione: 1
    },
    {
        i: 4,
        id: "campanello2",
        src: "./assets/oggetti/campanello.svg",
        dimensione: 1
    },
    {
        i: 5,
        id: "coltello-bunkerbro",
        src: "./assets/oggetti/coltello.svg",
        dimensione: 3
    },
    {
        i: 6,
        id: "coltello-jessica",
        src: "./assets/oggetti/coltello.svg",
        dimensione: 3
    },
    {
        i: 7,
        id: "coltello-papaparks",
        src: "./assets/oggetti/coltello.svg",
        dimensione: 3
    },
    {
        i: 8,
        id: "lotta",
        src: "./assets/oggetti/lotta.svg",
        dimensione: 1.5
    },
    {
        i: 9,
        id: "mutande",
        src: "./assets/oggetti/mutande.svg",
        dimensione: 1
    },
    {
        i: 10,
        id: "nuvoletta",
        src: "./assets/oggetti/nuvoletta.svg",
        dimensione: 1
    },
    {
        i: 11,
        id: "pesca",
        src: "./assets/oggetti/pesca.svg",
        dimensione: 1
    },
    {
        i: 12,
        id: "pietra",
        src: "./assets/oggetti/pietra.svg",
        dimensione: 1
    },
    {
        i: 13,
        id: "puzza",
        src: "./assets/oggetti/puzza.svg",
        dimensione: 1
    },
    {
        i: 14,
        id: "torta",
        src: "./assets/oggetti/torta.svg",
        dimensione: 2
    },
    {
        i: 15,
        id: "valigia1",
        src: "./assets/oggetti/valigia.svg",
        dimensione: 0.9
    },
    {
        i: 16,
        id: "valigia2",
        src: "./assets/oggetti/valigia.svg",
        dimensione: 0.9
    },
    {
        i: 17,
        id: "valigia3",
        src: "./assets/oggetti/valigia.svg",
        dimensione: 0.9
    },
    {
        i: 18,
        id: "valigia4",
        src: "./assets/oggetti/valigia.svg",
        dimensione: 0.9
    }
];
/* 
const testi = [
    {
        i: 0,
        y: [2,2],
        inizio: [0,0],
        fine: [0,5],
        txt: "The Kims struggle in a sub-basement apartment, folding pizza boxes to make ends meet.",
    },

    {
        i: 1,
        y: [3,2],
        inizio: [1,0],
        fine: [1,5],
        txt: "BBBB",
    },

    {
        i: 2,
        y: [4,2],
        inizio: [1,10],
        fine: [1,15],
        txt: "CCCC",
    },
    {
        i: 3,
        y: [2,2],
        inizio: [0,0],
        fine: [0,5],
        txt: "AAAA",
    },

    {
        i: 4,
        y: [3,2],
        inizio: [1,0],
        fine: [1,5],
        txt: "BBBB",
    },

    {
        i: 5,
        y: [4,2],
        inizio: [1,10],
        fine: [1,15],
        txt: "CCCC",
    },

    {
        i: 6,
        y: [4,2],
        inizio: [1,10],
        fine: [1,15],
        txt: "CCCC",
    },
    
    {
        i: 7,
        y: [4,2],
        inizio: [1,10],
        fine: [1,15],
        txt: "CCCC",
    },
    {
        i: 8,
        y: [3,2],
        inizio: [1,0],
        fine: [1,5],
        txt: "BBBB",
    },

    {
        i: 9,
        y: [4,2],
        inizio: [1,10],
        fine: [1,15],
        txt: "CCCC",
    },

    {
        i: 10,
        y: [4,2],
        inizio: [1,10],
        fine: [1,15],
        txt: "CCCC",
    },
    
    {
        i: 11,
        y: [4,2],
        inizio: [1,10],
        fine: [1,15],
        txt: "CCCC",
    }
   
   
];
 */

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
/* const dataP12 = await d3.dsv(",",personaggi[11].dataset);
const dataP13 = await d3.dsv(",",personaggi[12].dataset);
const dataP14 = await d3.dsv(",",personaggi[13].dataset); */


const spessoreLinee = 5;
export var xMaschera = larghezzaPagina/kMaschera;


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
/* let puntiP12 = []; 
let puntiP13 = []; 
let puntiP14 = [];  */



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
 ampiezzaScene[10]=20; 
 ampiezzaScene[11]=20; 



const numeroScene = ampiezzaScene.length;
console.log(numeroScene);

// calcola l'ampiezza della linea calcolando il multiplo dell'ampiezza del modulo dello sfondo più vicino (e maggiore) nell'ampiezza degli step * numero Step
export function stabilisciAmpiezzaLinea(scena) {
    let ampiezzaMin = ampiezzaStep*ampiezzaScene[parseInt(scena)];
    let ampiezzaModulo = k*unit;
    return ampiezzaModulo * (parseInt(ampiezzaMin/ampiezzaModulo)+1);

}

// Scala X sulla base dell'ampiezzaX della linea di una scena
export function calcolaScalaX(scena) {
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
export function calcolaY(piano,livello) {
   
    // piano 0: bunker
    // piano 1: casa poveri
    // piano 2: strada
    // piano 3: casa ricchi - 01
    // piano 4: casa ricchi - 02

    livello = livello-1;
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
           
            if (scena != 11) {//INSERIRE VALORE CORRETTO SCENA FINALE
                let indiceFineScena = dataP.findIndex((el) => el.scena == scena+1);
                dataP.splice(indiceFineScena, 0, elemento);
            } 
        } 

        
    }
}

// calcola e pusha nell'array i punti della linea di ogni personaggio sulla base del suo csv

function creaDatabase(dataPersonaggio, puntiPersonaggio){
    for (const elem of dataPersonaggio) {
        puntiPersonaggio.push({"scena":elem.scena,"x":calcolaScalaX(elem.scena)(elem.tempo), "y":calcolaY(elem.livello, parseInt(elem.sottolivello))});
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
/* verificaDatabase(dataP12);
verificaDatabase(dataP13); */
// verificaDatabase(dataP14);

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
/* creaDatabase(dataP12, puntiP12);
creaDatabase(dataP13, puntiP13); */
// creaDatabase(dataP14, puntiP14);



console.log("INIZIO PUNTI");
console.log(dataP11);
/* console.log(dataP12); */


console.log("FINE PUNTI");


/* creaDatabase(dataP3, puntiP3);
creaDatabase(dataP4, puntiP4);
creaDatabase(dataP5, puntiP5); */
//console.log(puntiP5);


export function ottieniPuntiP(id) {
    let x;
    switch (id) {
        case 1: x = puntiP1; break;
        case 2: x = puntiP2; break;
        case 3: x = puntiP3; break;
        case 4: x = puntiP4; break;
        case 5: x = puntiP5; break;
        case 6: x = puntiP6; break;
        case 7: x = puntiP7; break;
        case 8: x = puntiP8; break;
        case 9: x = puntiP9; break;
        case 10: x = puntiP10; break;
        case 11: x = puntiP11; break;
/*         case 12: x = puntiP12; break; */
    }
    console.log(x);
    return x;
}



//...


// ############################################################################
// #########################    CREAZIONE SFONDO     ##########################
// ############################################################################

// Set the width and height of the SVG container
const width = 600;
const height = 500;

const megaSVG = d3.select("#chart")
    .append("svg")
    .attr("id","parent")
    .attr("class","sfocatura")
    .attr("width",window.innerWidth)
    .attr("height",window.innerHeight);

// Create an SVG element


const svg = megaSVG
    .append("g")
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
    .attr("class","sfondo-modulo livello0")
    .attr("id","livello0-"+rip)
    .attr("x",x)
    .attr("y",(1-percentualeAltezzaStanze)*altezzaPagina)
    .attr("width",unit*k)
    .attr("height",unit)
    .attr("href","./assets/sfondi/livello0.svg");
    //.attr("href","./assets/sfondi/bunker.svg");
 
    gruppo
    .append("image")
    .attr("class","sfondo-modulo livello1")
    .attr("id","livello1-"+rip)
    .attr("x",x)
    .attr("y",(1-2*percentualeAltezzaStanze)*altezzaPagina)
    .attr("width",unit*k)
    .attr("height",unit)
    .attr("href","./assets/sfondi/livello1.svg");

  //  .attr("href","./assets/sfondi/casa-kim.svg");

    gruppo
    .append("image")
    .attr("class","sfondo-modulo livello2")
    .attr("id","livello2-"+rip)
    .attr("x",x)
    .attr("y",2*(percentualeAltezzaStanze)*altezzaPagina)
    .attr("width",unit*k)
    .attr("height",altezzaPagina-4*unit)
    .attr("href","./assets/sfondi/livello2.svg");

   // .attr("href","./assets/sfondi/strada.svg");

    gruppo
    .append("image")
    .attr("class","sfondo-modulo livello3")
    .attr("id","livello3-"+rip)
    .attr("x",x)
    .attr("y",(percentualeAltezzaStanze)*altezzaPagina)
    .attr("width",unit*k)
    .attr("height",unit)
    .attr("href","./assets/sfondi/livello3.svg");
  //  .attr("href","./assets/sfondi/casa-park-1.svg");
    gruppo
    .append("image")
    .attr("class","sfondo-modulo livello4")
    .attr("id","livello4-"+rip)
    .attr("x",x)
    .attr("y",0)
    .attr("width",unit*k)
    .attr("height",unit)
    .attr("href","./assets/sfondi/livello4.svg");

 //   .attr("href","./assets/sfondi/casa-park-2.svg");
 
}

function generaSfondoFisso(l) {
    gruppo
    .append("rect")
    .attr("class","sfondo-fisso")
    .attr("x",0)
    .attr("y",(1-percentualeAltezzaStanze)*altezzaPagina)
    .attr("width",l)
    .attr("height",unit)
    .attr("fill","#3a523d");
 
    gruppo
    .append("rect")
    .attr("class","sfondo-fisso")
    .attr("x",0)
    .attr("y",(1-2*percentualeAltezzaStanze)*altezzaPagina)
    .attr("width",l)
    .attr("height",unit)
    .attr("fill","#3a523d");

    gruppo
    .append("rect")
    .attr("class","sfondo-fisso")
    .attr("x",0)
    .attr("y",2*(percentualeAltezzaStanze)*altezzaPagina)
    .attr("width",l)
    .attr("height",altezzaPagina-4*unit)
    .attr("fill","#808071");

    gruppo
    .append("rect")
    .attr("class","sfondo-fisso")
    .attr("x",0)
    .attr("y",(percentualeAltezzaStanze)*altezzaPagina)
    .attr("width",l)
    .attr("height",unit)
    .attr("fill","#c1976b");
 
    gruppo
    .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",l)
    .attr("height",unit)
    .attr("fill","#c1976b");
}

// genera gli sfondi in modo che si raggiunga almeno il doppio dell'ampiezza delle linee della scena più ampia
function generaSfondi() {
  
 //   .attr("href","./assets/sfondi/casa-park-2.svg");
    let n = 0;
    while (n*unit*k <= 2*stabilisciAmpiezzaLinea(d3.maxIndex(ampiezzaScene))) {
        //console.log("sfondo " +n);
        //generaSfondoModulo(n);
        n++;
    }
    generaSfondoFisso((n-1)*unit*k);
    for (let i = 0; i<n; i++)  generaSfondoModulo(i);


}
   
generaSfondi();



// OVERLAY SFONDO PER LAMPADA CHE SI ACCENDE

export function generaLampada() {
    let x = unit*k;
    gruppo
    .append("image")
    .attr("class","lampada")
    .attr("id","lampada-filo")
    .attr("x",x)
    .attr("y",percentualeAltezzaStanze*altezzaPagina)
    .attr("width",unit*k)
    .attr("height",altezzaPagina-unit)
    .attr("href","./assets/sfondi/lampada-filo.svg");

    gruppo
    .append("image")
    .attr("class","lampada")
    .attr("id","lampada-luce")
    .attr("x",x)
    .attr("y",percentualeAltezzaStanze*altezzaPagina)
    .attr("width",unit*k)
    .attr("height",altezzaPagina-unit)
    .attr("href","./assets/sfondi/lampada-luce.svg");

}

export function rimuoviLampada() {
    d3.selectAll(".lampada").remove();
}

export function accendiLampada(){
    d3.selectAll(".lampada").classed("accesa",true);
}

export function spegniLampada(){
    d3.selectAll(".lampada").classed("accesa",false);
}

let progressoLampada = (((1600/3040))*(unit*k))/stabilisciAmpiezzaLinea(10);
console.log("progresso lampada "+progressoLampada);

export function gestioneLampada(response,traslazione){
    console.log("progresso "+response.progress);
    d3.selectAll('.lampada').attr('transform', "translate(0,0)");
    if (response.index == 10){
        if (response.progress > progressoLampada) {
            accendiLampada();
        }
        else spegniLampada();
    }

    if (response.index == 11){
        accendiLampada();
        console.log("ampiezza "+stabilisciAmpiezzaLinea(10)+" traslazione "+traslazione);
        d3.selectAll('.lampada').attr('transform', "translate("+-(stabilisciAmpiezzaLinea(11))+",0)");
    }

}

spegniLampada();






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
export function datasetPerScena(dataset, numScena){
   // console.log(d3.groups(dataset, d=>d.scena)[numScena]);
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
/*      creaLineaScena(gruppo,"12", puntiP12, scena);
     creaLineaScena(gruppo,"13", puntiP12, scena);
     creaLineaScena(gruppo,"14", puntiP12, scena); */

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

function coloreLinea(id) {
    switch(personaggi[id-1].famiglia) {
        case "Parks":
            return "#000000";
            break;
        case "Kim":
            return "#C00000";
            break;
        case "Bunker":
            return "#ffffff";
            break;
        case "Min":
            return "#690000";
            break;
        default: break;
    }
}

function creaLineaScena(gruppo, idPersonaggio, puntiP, scena) { 
    let puntiScena = datasetPerScena(puntiP, scena);
    let line = gruppo.append("path")
                .attr("id","linea_"+scena+"_P"+idPersonaggio)
                .attr("class","P"+idPersonaggio+" linea linea_P"+idPersonaggio)
                .attr("d",Gen(puntiScena))
                .attr("stroke", coloreLinea(idPersonaggio))
                .attr("fill", "none")
                .attr("stroke-width", spessoreLinee)
                .attr("pointer-events","visibleStroke")
                .style("filter","drop-shadow(0px 0px 2px "+coloreLinea(idPersonaggio)+")");
               

    lunghezzaLinee[scena][idPersonaggio] = line.node().getTotalLength();
    calcolaPercentuale(puntiScena,lunghezzaLinee[scena][idPersonaggio]); 

    if (idPersonaggio == 12) {
        if (mostraDebug === false) {
            line.style.display = "none";
        }
    }

    /* INSERIRE TRATTEGGI */

    if (idPersonaggio == 3) { // JESSICA 
        if (scena == 3) {
            line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 1, 2, false));
        }
        if (scena == 4) {
            line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 0, 1, false));
        }
    }

    if (idPersonaggio == 4) { // KEVIN
        switch (scena) {
            case 2: 
                line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 4, 6, false));
                break;
            case 3:
                line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 1,2, true, 4,5));
                break;
            case 4:
                line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 0, 2, false));
                break;
            case 5:
                line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 0, 1, false));
                break;
            case 8: 
                line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 7, 8, false));
                break;
            case 9: 
                line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 0, 2, false));
                break;
            case 10:
                line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 0, 2, false));
            default: break;

        } 
    }

    if (idPersonaggio == 7) { // MAMMA PARKS 
        if (scena == 3) {
            line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 2, 3, false));
        }
        if (scena == 4) {
            line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 0, 1, false));
        }
    }
 
    if (idPersonaggio == 1) { // FIGLIA PARKS 
        if (scena == 2) {
            line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 2, 5, false));
        }
        if (scena == 3) {
            line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 0, 3, false));
        }
        if (scena == 4) {
            line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 0, 3, false));
        }
        if (scena == 5) {
            line.style("stroke-dasharray",tratteggio(idPersonaggio, puntiP, scena, 0, 1, false));
        }
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
    let dimensione = dimensioneFacce * personaggi[parseInt(idPersonaggio)-1].dimensione;
    let gruppo = svg.append("g").attr("id","gruppo-faccia"+idPersonaggio).attr("class","P"+idPersonaggio+" gruppo-faccia");
    let faccia = gruppo
        .append("image")
        .attr("class","faccia")
        .attr("id","faccia"+idPersonaggio)
        .attr("width",dimensione)
        .attr("height",dimensione)
        .attr("x",-dimensione/2)
        .attr("y",-dimensione/2)
        .style("filter","drop-shadow(0px 0px 1px "+coloreLinea(idPersonaggio)+")")
        .attr("href", personaggi[parseInt(idPersonaggio)-1].faccia);
    let nome = gruppo
        .append("text")
        .text(personaggi[parseInt(idPersonaggio)-1].nome)
        .attr("class","nome-faccia")
        .attr("id","nome-faccia"+idPersonaggio)
        .attr("x",dimensioneFacce)
        .attr("y",0)
        .attr("dominant-baseline","middle")
        .attr("font-size",dimensioneNomi+"em");
}


/* function creaFaccia(idPersonaggio) {
    //console.log(personaggi[idPersonaggio].faccia);
    let dimensione = dimensioneFacce * personaggi[parseInt(idPersonaggio)-1].dimensione;
    let faccia = svg
        .append("image")
        .attr("class","faccia")
        .attr("id","faccia"+idPersonaggio)
        .attr("width",dimensione)
        .attr("height",dimensione)
        .attr("x",-dimensione/2)
        .attr("y",-dimensione/2)
        .style("filter","drop-shadow(0px 0px 3px "+coloreLinea(idPersonaggio)+")")
        .attr("href", personaggi[parseInt(idPersonaggio)-1].faccia);
}
 */
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

// creaFacce();




 // POSIZIONA LA FACCIA IN BASE ALLA X DATA COME PARAMETRO
 function muoviFacciaDaX (idFaccia, puntiP, x, traslazione, scena, deltaX, deltaY) {
    let obj = document.getElementById(idFaccia);
    let numPunti = puntiP.length; // ottieni il numero di punti che definiscono la linea
   // let ampiezza = puntiP[numPunti-1].x - puntiP[0].x; // ottieni l'ampiezza in x del progresso
    let pt = {}; // crea l'oggetto pt che definirà la posizione della faccia
   // pt.x = puntiP[0].x + progresso * ampiezza;  x della faccia è proporzionale al progresso
    
    pt.x = x + deltaX;
    let xLinea = x + traslazione;
    //console.log("dentro");
    let i = 0;
    //console.log("x linea "+ xLinea);
    //console.log("num punti: "+numPunti);

    // cerca i due punti tra cui è compresa la x
    while (i < numPunti-1 && puntiP[i].x < xLinea) { // esce quando x è maggiore (o quando la linea è finita)
        i++; 
    } 

    /* if (idFaccia=="faccia11") {
        console.log("il prossimo è "+ i);
    }  */// il prossimo

    let pt0, pt1;

   /*  if (i< (numPunti-1)) {
         pt0 = puntiP[i-1]; //punto precedente
         pt1 = puntiP[i]; //punto successivo
    } */

  /*   if (i< (numPunti-1)) {
        pt0 = puntiP[i-1]; //punto precedente
        pt1 = puntiP[i]; //punto successivo
   }
    else if (i == (numPunti-1)) {
      //  console.log("in ultimo");
         pt0 = puntiP[i];
         pt1 = puntiP[i];
    } */

    pt0 = puntiP[i-1]; //punto precedente
    pt1 = puntiP[i]; //punto successivo
   

    // calcolo la percentuale di progresso (da 0 a 1) lungo il tratto e la differenza tra le Y
    let progressoTratto = (xLinea-pt0.x) / (pt1.x - pt0.x); 
    let diffY = progressoTratto * (pt1.y - pt0.y);

    // calcolo la y della faccia
    pt.y =  pt0.y + diffY + deltaY;


    // calcolo il fattore di scala della faccia
  /*   let k = (coordinateLivelli[zoomScena[scena][0]].max - coordinateLivelli[zoomScena[scena][1]].min)/unit;
    console.log("dimensione facce rapporto "+k);
    let nuovaDimensione = k*dimensioneFacce;
    obj.setAttribute("width",nuovaDimensione);
    obj.setAttribute("height",nuovaDimensione);
    obj.setAttribute("x",-nuovaDimensione/2);
    obj.setAttribute("y",-nuovaDimensione/2); */

    // traslo la faccia
    obj.style.webkitTransform = 'translate3d('+pt.x+'px,'+pt.y+'px, 0)'; 
    
 }

 //funzione per ottenere la percentuale nella linea a partire dalla x
 export function muoviFacce(scena, progresso, traslazione) {   
    muoviFacciaDaX("gruppo-faccia1", datasetPerScena(puntiP1,scena), xMaschera, traslazione, scena, 0, 0);
    muoviFacciaDaX("gruppo-faccia2", datasetPerScena(puntiP2,scena), xMaschera, traslazione, scena, 0, 0);
    muoviFacciaDaX("gruppo-faccia3", datasetPerScena(puntiP3,scena), xMaschera, traslazione, scena, 0, 0);
    muoviFacciaDaX("gruppo-faccia4", datasetPerScena(puntiP4,scena), xMaschera, traslazione, scena, 0, 0); 
    muoviFacciaDaX("gruppo-faccia5", datasetPerScena(puntiP5,scena), xMaschera, traslazione, scena, 0, 0);
    muoviFacciaDaX("gruppo-faccia6", datasetPerScena(puntiP6,scena), xMaschera, traslazione, scena, 0, 0);
    muoviFacciaDaX("gruppo-faccia7", datasetPerScena(puntiP7,scena), xMaschera, traslazione, scena, 0, 0);
    muoviFacciaDaX("gruppo-faccia8", datasetPerScena(puntiP8,scena), xMaschera, traslazione, scena, 0, 0); 
    muoviFacciaDaX("gruppo-faccia9", datasetPerScena(puntiP9,scena), xMaschera, traslazione, scena, 0, 0); 
    muoviFacciaDaX("gruppo-faccia10", datasetPerScena(puntiP10,scena), xMaschera, traslazione, scena, 0, 0); 
    muoviFacciaDaX("gruppo-faccia11", datasetPerScena(puntiP11,scena), xMaschera, traslazione, scena, 0, 0); 
/*     muoviFacciaDaX("gruppo-faccia12", datasetPerScena(puntiP12,scena), xMaschera, traslazione, scena, 0, 0); 
    muoviFacciaDaX("gruppo-faccia13", datasetPerScena(puntiP13,scena), xMaschera, traslazione, scena, 0, 0);  */
    // muoviFacciaDaX("gruppo-faccia14", datasetPerScena(puntiP14,scena), xMaschera, traslazione, scena, 0, 0); 

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
    while ((i < numPunti-1) && puntiP[i].x < pt.x) { // esce quando x è maggiore (o quando la linea è finita)
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
// #########################        OGGETTI        ############################
// ############################################################################


function creaOggetto(id) {
    let dimensione = dimensioneOggetti*oggetti[id].dimensione;
    let oggetto = svg
        .append("image")
        .attr("class","oggetto")
        .attr("id",oggetti[parseInt(id)].id)
        .attr("width",dimensione)
        .attr("height",dimensione)
        .attr("x",-dimensione/2)
        .attr("y",-dimensione/2)
        .attr("href", oggetti[parseInt(id)].src)
        .attr("style","opacity: 0");
}

for (let i = 0; i < oggetti.length; i++){
    creaOggetto(i);
}

creaFacce();

function agganciaOggettoAPersonaggio(idOggetto, idPersonaggio,scena, progresso0, progresso1) {
    let oggetto = document.getElementById(idOggetto);


}

export function muoviOggetto(idOggetto, response, idPersonaggio, traslazione, deltaX, deltaY) {

    
    let progresso = response.progress;
    let scena = response.index;
    let puntiP;
    puntiP = ottieniPuntiP(parseInt(idPersonaggio));
    // console.log(puntiP);
    muoviFacciaDaX(idOggetto, datasetPerScena(puntiP,scena), xMaschera, traslazione, scena, deltaX, deltaY);

}



// ############################################################################
// #########################         INTRO         ############################
// ############################################################################

let introX = 0;
let introY = coordinateLivelli[1].min;
let introH = unit;
let introW = unit*larghezzaPagina/altezzaPagina;

let intro = megaSVG.append("g").
    attr("id","introSVG")
    .attr("width",larghezzaPagina)
    .attr("height",altezzaPagina);

var gradient = intro.append("defs")
    .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "50%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%")
        .attr("spreadMethod", "pad");

    gradient.append("stop")
        .attr("offset", "20%")
        .attr("stop-color", "#121a1c")
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#121a1c")
        .attr("stop-opacity", 0);

let rectIntro = intro.append("rect")
            .attr("width",larghezzaPagina+100)
            .attr("height",altezzaPagina)
            .attr("fill","url(#gradient)") //121a1c
            .attr("opacity",1);

let altezzaImg = 0.15*altezzaPagina;
let xTesto = 0.3*larghezzaPagina;

/*let imgIntro = intro.append("image")
        .attr("id","introLines")
        .attr("href","../assets/landing/introLines.png")
        .attr("height",altezzaImg)
        .attr("x",0)
        .attr("y",0.5*altezzaPagina-(altezzaImg/2));*/

let txtP = intro.append("text")
        .attr("id","textIntro")
        .attr("class","rightText")
        .attr("dominant-baseline","middle");

let r3 = txtP.append("tspan")
        .attr("x",xTesto)
        .attr("y","50%")
        .attr("dy","1.2em")
        .html("The visualization will expand horizontally but");
let r4 = txtP.append("tspan")
        .attr("x",xTesto)
        .attr("dy","1.2em")
        .html("don't worry, just keep scrolling as you always do, and enjoy!");
/*let r1 = txtP.append("tspan")
.attr("x",xTesto)
.attr("dy","-2.4em")
.html("");*/

/*let r2 = txtP.append("tspan")
.attr("x",xTesto)
.attr("dy","-1.2em")
.html("The characters’ paths are indicated by lines.");*/


// txtP.html("blabla");

// ############################################################################
// #########################         ACQUA         ############################
// ############################################################################

let acqua = megaSVG.append("g").
    attr("id","acqua-parent")
    .attr("width",larghezzaPagina)
    .attr("height",altezzaPagina);


// ############################################################################
// #########################         TESTI         ############################
// ############################################################################

// CREA TESTI

let margineSx = 40;

let gTesti = svg.append("g").attr("id","testi");

for (let iTesto = 0; iTesto < testi.length; iTesto++) {
    let testo = gTesti.append("text")
        .text(testi[iTesto].txt)
        .attr("id","testo"+testi[iTesto].i)
        .attr("x", xMaschera+margineSx)
        .attr("y",calcolaY(testi[iTesto].y[0], testi[iTesto].y[1]))
        .style("opacity","0");
}


// ############################################################################
// #########################         FINALE         ###########################
// ############################################################################


// CREA FINALE

function creaFinale() {

    // CREAZIONE HTML

    var txtF = "SEE YOU SOON THEN";
    let creaParent = document.getElementById("chart").appendChild(document.createElement("div"));
    creaParent.setAttribute("id","container-finale");
    creaParent.setAttribute("class","togli");


    let parent = d3.select("#container-finale");

    let immagine = parent.append("img")
        .attr("id","morsefinal")
        .attr("src","assets/finale/finale-on.png")
        .attr("alt","impossibile caricare l'immagine");

    let container = parent.append("div")
        .attr("id","testo-container");

    let paragrafo = container.append("p")
        .attr("id","testo");

    let decodeTextDiv = container.append("div")
        .attr("class","decode-text")
        .attr("id","decode-text");

    let c;

    
    for (let j = 0; j < txtF.length; j++) {
        c = txtF[j];
        if (c !== " ") {
            let textAnimation = decodeTextDiv.append("div")
                .attr("class","text-animation");
            textAnimation.html(c);
        } else {
            decodeTextDiv.append("div")
                .attr("class","space");
        }
    }

} 

function creaCredits() {
    let creditsDOM = document.getElementById("container-finale").appendChild(document.createElement("div"));
    creditsDOM.setAttribute("id","credits");
    creditsDOM.setAttribute("class","forzaNoBlur");

    let credits = d3.select("#credits");
  //  credits.html("Corso di Laurea di Design della Comunicazione</br>Laboratorio di Computer Grafica sez. C2</br>a.a. 2023/2024</br></br>Crimi Martina, Garcia Sanchez Thomas, Genovese Francesca, Mirandola Filippo, Romagnuolo Renata, Savoldi Elena, Sirtori Vittoria");
/*     document.getElementById("credits").style.fontSize="1em"; 
    document.getElementById("credits").style.textAlign="center"; 
    document.getElementById("credits").style.paddingTop="20%"; */

    let creditsLogo = credits.append("div")
        .attr("id","logo-container")
        .attr("class","forzaNoBlur");

        let logo = creditsLogo.append("img")
        .attr("id","logo")
        .attr("class","forzaNoBlur")
        .attr("src","./assets/finale/logo-polimi.svg");

    let creditsTxt = credits.append("div")
        .attr("id","credits-txt")
        .attr("class","forzaNoBlur")
        .html("Corso di Laurea in Design della Comunicazione</br>Laboratorio di Computer Grafica &ndash; C2</br>A.A. 2023/2024</br></br>Crimi Martina, Garcia Sanchez Thomas, Genovese Francesca, Mirandola Filippo, Romagnuolo Renata, Savoldi Elena, Sirtori Vittoria");
       // .html("TESt");



}

creaFinale();
creaCredits();



// ############################################################################
// #########################         ZOOM         #############################
// ############################################################################


export function impostaZoomSfondo(rapporto,traslazioneY,traslazioneX) {
    svg
  //  .attr("transform","scale("+rapporto+") "+"translate("+-100*(rapporto / 2)+" "+traslazioneY+") ");
  .attr("transform","scale("+rapporto+") "+"translate("+traslazioneX+" "+traslazioneY+") ");
}

export function impostaZoomFacce(rapporto,modificatoreFacce, scena){ 
    console.log("zoom dentro facce "+rapporto);
   // let dimensione = dimensioneFacce*2*modificatoriZoom[scena]/rapporto;
   let dimensione = dimensioneFacce*2*modificatoreFacce/rapporto;
  //let dimensioneTxt = dimensioneFacce*2/rapporto
    for (let i = 1; i<=personaggi.length; i++) {
        dimensione=dimensione*personaggi[parseInt(i)-1].dimensione;
        let idFaccia="faccia"+i;
        console.log(idFaccia);

        let obj = document.getElementById(idFaccia);
        obj.setAttribute("width",dimensione);
        obj.setAttribute("height",dimensione);
        obj.setAttribute("x",-dimensione/2);
        obj.setAttribute("y",-dimensione/2);


       //dimensione=dimensione/modificatoreFacce; //per i testi
        let txt = document.getElementById("nome-faccia"+i);
        if (rapporto < 3) {
            txt.setAttribute("font-size",(dimensioneNomi/rapporto)+"em");
        }
        else txt.setAttribute("font-size",(dimensioneNomi/3)+"em");
    }
    
}

export function impostaZoomOggetti(rapporto, scena){ 
   // let dimensione = dimensioneFacce*2*modificatoriZoom[scena]/rapporto;
   console.log("oggetti zoom "+rapporto);
    for (let i = 0; i<oggetti.length; i++) {
        let dimensione = dimensioneOggetti/rapporto*oggetti[i].dimensione;
        dimensione=dimensione*oggetti[i].dimensione;

        let obj = document.getElementById(oggetti[i].id);
        obj.setAttribute("width",dimensione);
        obj.setAttribute("height",dimensione);
        obj.setAttribute("x",-dimensione/2);
        obj.setAttribute("y",-dimensione/2);
    }
    
}




export function impostaZoomIntro(rapporto,traslazioneX,traslazioneY){
    let obj = document.getElementById("introSVG");

}



export function calcolaZoom(progresso, scena, nuovo, vecchio) {
    let deltaAltezza = coordinateLivelli[nuovo[0]].max - coordinateLivelli[nuovo[1]].min;
    let rapportoFinale = altezzaPagina / deltaAltezza;
    let rapporto, modificatoreFacce, traslazioneY, traslazioneX;
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
        if (scena != 0) {
            let calcolaModificatore = d3.scaleLinear().domain([0,zoomProgressoFinale]).range([modificatoriZoom[scena-1],modificatoriZoom[scena]]);
            modificatoreFacce = calcolaModificatore(progresso);
        }
        else modificatoreFacce = modificatoriZoom[0];
        //rapporto = calcolaRapporto(progresso);    
        traslazioneY = calcolaTraslazioneY(progresso);
        traslazioneX = - ((xMaschera)-(xMaschera/rapporto));

     } else {
        rapporto = rapportoFinale;
        traslazioneY = -coordinateLivelli[nuovo[1]].min;
        modificatoreFacce = modificatoriZoom[scena];
    }
    
    traslazioneX = - ((xMaschera)-(xMaschera/rapporto));

    impostaZoomSfondo(rapporto,traslazioneY,traslazioneX);
    impostaZoomOggetti(rapporto,scena);
    impostaZoomFacce(rapporto,modificatoreFacce,scena);
    impostaZoomIntro(rapporto,0,0);
} 


calcolaZoom(0,0,[1,1],[1,1]);

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

function tratteggio(personaggio, punti, scena, idInizio, idFine, trattiMultipli, idInizio2, idFine2){
    var sottoarray = punti.filter(el => el.scena == scena);


    var l = lunghezzaLinee[scena][personaggio];
 //   console.log("tratt lunghezza tot: "+l);
    //lunghezza per i punti
   /*  var a = l * sottoarray[idInizio].progresso/100;
    var b = l * sottoarray[idFine].progresso/100; */

    if (trattiMultipli === false) {
        var a = l * sottoarray[idInizio].progresso/100;
        var b = l * sottoarray[idFine].progresso/100;
        
        // crea stringa del dasharray
        var dasharray = a + " ";
        for(var usedlen = 0; usedlen < (b-a-tratt); ) {
            dasharray += tratt + " " + trattS + " "; 
            usedlen += tratt+trattS;
        }
        dasharray += tratt + " " + (l-b);
       console.log("tratteggio: "+ dasharray);
    }

    if (trattiMultipli === true) {
        var a = l * sottoarray[idInizio].progresso/100;
        var b = l * sottoarray[idFine].progresso/100;
        var c = l * sottoarray[idInizio2].progresso/100;
        var d = l * sottoarray[idFine2].progresso/100;

        var dasharray = a + " ";
        for(var usedlen = 0; usedlen < (b-a-tratt); ) {
            dasharray += tratt + " " + trattS + " "; 
            usedlen += tratt+trattS;
        }
        dasharray += tratt + " " + (c-b) + " ";
        
        for(var usedlen = 0; usedlen < (d-c-tratt); ) {
            dasharray += tratt + " " + trattS + " "; 
            usedlen += tratt+trattS;
        }

        dasharray += tratt + " " + (l-d);

       console.log("tratteggio: "+ dasharray);
    }

    return dasharray;    

}


// ############################################################################
// #########################        NASCONDI LINEE        ##############################
// ############################################################################



// nasconde parte iniziale linea e fa comparire faccia
export function nascondiLineaInizio(personaggio, scena, puntoInizio){
    let id = "linea_"+scena+"_P"+personaggio;
    console.log(id);
    let linea = document.getElementById(id);

    var punti = ottieniPuntiP(parseInt(personaggio));
    var sottoarray = punti.filter(el => el.scena == scena);
    console.log(sottoarray);
    var l = lunghezzaLinee[scena][personaggio];
 //   console.log("tratt lunghezza tot: "+l);
    //lunghezza per i punti
   /*  var a = l * sottoarray[idInizio].progresso/100;
    var b = l * sottoarray[idFine].progresso/100; */

    var a = l * sottoarray[parseInt(puntoInizio)].progresso/100;

    // crea stringa del dasharray
    var dasharray = "0 " + a + " " + (l-a);

   let style = linea.getAttribute("style");
   style = style + " stroke-dasharray: "+dasharray;

   linea.setAttribute("style",style);
}

// nasconde parte finale linea

export function nascondiLineaFine(personaggio, scena, puntoInizio){
    let id = "linea_"+scena+"_P"+personaggio;
    console.log(id);
    let linea = document.getElementById(id);

    var punti = ottieniPuntiP(parseInt(personaggio));
    var sottoarray = punti.filter(el => el.scena == scena);
    console.log(sottoarray);
    var l = lunghezzaLinee[scena][personaggio];
 //   console.log("tratt lunghezza tot: "+l);
    //lunghezza per i punti
   /*  var a = l * sottoarray[idInizio].progresso/100;
    var b = l * sottoarray[idFine].progresso/100; */

    var a = l * sottoarray[parseInt(puntoInizio)].progresso/100;

    // crea stringa del dasharray
    var dasharray = a + " " + (l-a);

   let style = linea.getAttribute("style");
   style = style + " stroke-dasharray: "+dasharray;
   

   linea.setAttribute("style",style);
}


// ############################################################################
// #####################        CAMBIA FACCIA        ##########################
// ############################################################################

export function cambiaFaccia(idPersonaggio,diventaMorto) {
    let id = "faccia"+idPersonaggio;
    let obj = document.getElementById(id);
    if (diventaMorto === true) {
        obj.setAttribute("href",personaggi[idPersonaggio-1].morte);
       // obj.setAttribute("style", "rotate(45) "+obj.getAttribute("style")); //slice(0,-1) toglie l'ultimo carattere della stringa
    }
    else {
        obj.setAttribute("href",personaggi[idPersonaggio-1].faccia);
    }

}



// ############################################################################
// #####################        FUNZIONI UTILI       ##########################
// ############################################################################

export function ottieniProgresso(idPersonaggio, scena, indice) {
    let puntiScena = datasetPerScena(ottieniPuntiP(parseInt(idPersonaggio)),scena);
    console.log(puntiScena);
    return puntiScena[indice].progresso/100;
}

export function ottieniX(idPersonaggio, scena, indice) {
    let puntiScena = datasetPerScena(ottieniPuntiP(parseInt(idPersonaggio)),scena);
    console.log(puntiScena);
    return puntiScena[indice].x;
}

export function ottieniPercX(idPersonaggio, scena, indiceTempo) {
    let puntiScena = datasetPerScena(ottieniPuntiP(parseInt(idPersonaggio)),scena);
    let z = puntiScena[indiceTempo].x;
    let percX = (z-xMaschera)/stabilisciAmpiezzaLinea(scena);
    return percX;
}

/* export function bloccaElemento(idElemento, idPersonaggio, scena, indiceTempo, response, deltaX, deltaY) {
    if (response.index > scena || (response.index == scena && response.progress > ottieniProgresso(idPersonaggio,scena, indiceTempo))) {  // blocca solo dopo aver superato il punto
        console.log("blocca "+idElemento);
        
        let translationAttuale = (response.progress) * stabilisciAmpiezzaLinea(scena) + (response.index-scena)*(stabilisciAmpiezzaLinea(scena)); // il secondo addendo permette di continuare la traslazione dopo aver cambiato scena "togliendo" la traslazione data dal nuovo progress
       //  console.log("prog :"+ ottieniProgresso(idPersonaggio,scena, indiceTempo));
        // let translationPunto = (ottieniProgresso(idPersonaggio,scena, indiceTempo))*stabilisciAmpiezzaLinea(scena);
        let translationPunto = ottieniX(idPersonaggio,scena, indiceTempo);
        // let traslazione = translationAttuale - translationPunto;
        let traslazione = translationPunto - translationAttuale;
        console.log("traslaz: "+traslazione);

        let obj = document.getElementById(idElemento);
        let pt = {};
        let puntiScena = datasetPerScena(ottieniPuntiP(parseInt(idPersonaggio)),scena);
       // pt.x = xMaschera - traslazione + deltaX;
       pt.x = xMaschera - translationAttuale + deltaX;
        pt.y = puntiScena[indiceTempo].y + deltaY;
        console.log(pt.y);

        console.log("posizione nuova: "+pt.x+" "+pt.y);
        obj.style.webkitTransform = 'translate3d('+pt.x+'px,'+pt.y+'px, 0)'; 
    }
}
 */

export function bloccaElemento(idElemento, idPersonaggio, scena, indiceTempo, response, deltaX, deltaY) {
    let percX = ottieniPercX(idPersonaggio,scena,indiceTempo);

    if (response.index > scena || (response.index == scena && response.progress > percX)) {  // blocca solo dopo aver superato il punto        
        let obj = document.getElementById(idElemento);
        let pt = {};
        let puntiScena = datasetPerScena(ottieniPuntiP(parseInt(idPersonaggio)),scena);


       pt.x = xMaschera - ((response.progress-percX)*stabilisciAmpiezzaLinea(scena)) - (response.index-scena)*(stabilisciAmpiezzaLinea(scena)); // il secondo addendo permette di continuare la traslazione dopo aver cambiato scena "togliendo" la traslazione data dal nuovo progress;
        pt.y = puntiScena[indiceTempo].y + deltaY;
        console.log(pt.y);

        console.log("posizione nuova: "+pt.x+" "+pt.y);
        obj.style.webkitTransform = 'translate3d('+pt.x+'px,'+pt.y+'px, 0)'; 
    }
}

export function getCoordinateLivelli(livello) {
    return coordinateLivelli[livello];
}



export function calcolaPercentualeTempo(scena, tempo) {
    return (calcolaScalaX(scena)(tempo)-xMaschera)/(stabilisciAmpiezzaLinea(scena));
}



// ############################################################################
// #####################        HOVER       ##########################
// ############################################################################

//class linea_P9 #gruppo-faccia4
//document.getElementById("gruppo-faccia4")addEventListener()

function nascondiTutto(x){
    for(let i = 1; i <= personaggi.length; i++){
        if (i != x) {
            d3.selectAll(".P"+i).classed("copri",true);
        } else {
            d3.selectAll(".P"+i).classed("copri",false);
            d3.select("#nome-faccia"+i).classed("mostra",true);
    }
}
}

function nascondiTuttoFine(x){
    for(let i = 1; i <= personaggi.length; i++){
            d3.selectAll(".P"+i).classed("copri",false);
        } 
    d3.select("#nome-faccia"+x).classed("mostra",false);
    }


for (let i = 1; i <= personaggi.length; i++) {
    d3.selectAll(".P"+i).on("mouseover",function () {
        nascondiTutto(i);
      });
    d3.selectAll(".P"+i).on("mouseout",function () {
        nascondiTuttoFine(i);
    });
    }
