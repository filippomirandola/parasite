import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const altezzaPagina = window.innerHeight;
const percentualeAltezzaStanze = 0.23;
const unit = altezzaPagina*percentualeAltezzaStanze; //unità di altezza
const k = 3047/900; // lunghezza/altezza csv stanze
const ampiezzaStep = 50;
const zoomX = ampiezzaStep * 2;
export const zoomProgressoFinale = 0.2;


// Dataset piani  bunker / casaPoveri / strada / casaRicchi1 / casaRicchi2
const livelli = [5, 5, 1, 5, 5];
let coordinateLivelli = [];
const personaggi = [4];
const riferimentiPersonaggi = [
    {
        nome: "a",
        famiglia: "",
        dataset: "./data/data_dasong.csv",
        faccia: "./assets/facce/mamma-kim.svg"
    },
    {
        nome: "b",
        famiglia: "",
        dataset: "./data/data_moongwang.csv",
        faccia: "./assets/facce/mamma-kim.svg"
    },
    {
        nome: "c",
        famiglia: "",
        dataset: "./data/data_dahye.csv",
        faccia: "./assets/facce/mamma-kim.svg"
    },
    {
        nome: "d",
        famiglia: "",
        dataset: "./data/data_yeonkyo.csv",
        faccia: "./assets/facce/mamma-kim.svg"
    }
];


// Dataset personaggi: scena, tempo, livello, sottolivello
const dataP1 = await d3.dsv(",",riferimentiPersonaggi[0].dataset);
const dataP2 = await d3.dsv(",",riferimentiPersonaggi[1].dataset);
const dataP3 = await d3.dsv(",",riferimentiPersonaggi[2].dataset);
const dataP4 = await d3.dsv(",",riferimentiPersonaggi[3].dataset);



const spessoreLinee = 5;
const xMaschera = 300;


// ############################################################################
// #########################    CREAZIONE DATASET    ##########################
// ############################################################################


let puntiP1 = [];
let puntiP2 = []; 
let puntiP3 = [];
let puntiP4 = []; 

                // array che all'indice scena dà l'ampiezza della scena (il numero di sottostep di "tempo")
                //  [00,01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16..] 
const ampiezzaScene = [];
 ampiezzaScene[0]=21;
 ampiezzaScene[1]=21;
const numeroScene = ampiezzaScene.length;

// calcola l'ampiezza della linea calcolando il multiplo dell'ampiezza del modulo dello sfondo più vicino (e maggiore) nell'ampiezza degli step * numero Step
export function stabilisciAmpiezzaLinea(scena) {
    let ampiezzaMin = ampiezzaStep*ampiezzaScene[parseInt(scena)];
    let ampiezzaModulo = k*unit;
    return ampiezzaModulo * (parseInt(ampiezzaMin/ampiezzaModulo)+1);

}

// Scala X sulla base dell'ampiezzaX della linea di una scena
function calcolaScalaX(scena) {
    console.log("calcolaScene "+scena);
    console.log(ampiezzaScene[scena]);
    return d3.scaleLinear().range([xMaschera,xMaschera+stabilisciAmpiezzaLinea(scena)]).domain([0,ampiezzaScene[parseInt(scena)]-1]);
}

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

        coordinateLivelli.push(y);
    }
}

calcolaYLivelli();
console.log(coordinateLivelli);

// Funzione per calcolare la Y dei vari punti (compresa la strada)
function calcolaY(piano,livello) {
   
    // piano 0: bunker
    // piano 1: casa poveri
    // piano 2: strada
    // piano 3: casa ricchi - 01
    // piano 4: casa ricchi - 02
  
    return coordinateLivelli[piano].max - (parseFloat(livello)-0.5) * (unit / (livelli[piano]));

    }
   

// calcola e pusha nell'array i punti della linea di ogni personaggio sulla base del suo csv
function creaDatabase(dataPersonaggio, puntiPersonaggio){
    for (const elem of dataPersonaggio) {
        puntiPersonaggio.push({"scena":elem.scena,"x":calcolaScalaX(elem.scena)(elem.tempo), "y":calcolaY(elem.livello, elem.sottolivello)});
     }
}

creaDatabase(dataP1, puntiP1);
creaDatabase(dataP2, puntiP2);
creaDatabase(dataP3, puntiP3);
creaDatabase(dataP4, puntiP4);
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
    .attr("width", 2 * k * unit) // sfondo grande 2*numero di moduli
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
    .attr("href","./assets/bunker.svg");
 
    gruppo
    .append("image")
    .attr("class","livello1")
    .attr("id","livello1-"+rip)
    .attr("x",x)
    .attr("y",(1-2*percentualeAltezzaStanze)*altezzaPagina)
    .attr("width",unit*k)
    .attr("height",unit)
    .attr("href","./assets/casa-kim.svg");
 
    gruppo
    .append("image")
    .attr("class","livello2")
    .attr("id","livello0-"+rip)
    .attr("x",x)
    .attr("y",(percentualeAltezzaStanze)*altezzaPagina)
    .attr("width",unit*k)
    .attr("height",unit)
    .attr("href","./assets/casa-park-1.svg");
    gruppo
    .append("image")
    .attr("class","livello3")
    .attr("id","livello0-"+rip)
    .attr("x",x)
    .attr("y",0)
    .attr("width",unit*k)
    .attr("height",unit)
    .attr("href","./assets/casa-park-2.svg");
 
}


// genera gli sfondi in modo che si raggiunga almeno il doppio dell'ampiezza delle linee della scena più ampia
function generaSfondi() {
    let n = 0;
    while (n*unit*k < 2*stabilisciAmpiezzaLinea(d3.maxIndex(ampiezzaScene))) {
        generaSfondoModulo(n);
        n++;
    }
        
}
   
generaSfondi();


// ############################################################################
// #########################      CREAZIONE PATH      #########################
// ############################################################################

let mascheraContainer = svg.append("clipPath").attr("id","myMask");
let maschera = mascheraContainer.append("rect").attr("width",xMaschera).attr("height",window.innerHeight).attr("fill","black").attr("style","position: sticky;");

// metodo per ottenere x e y per attributo "d" dei path dai dataset con le coordinate
var Gen = d3.line() 
  .x((p) => p.x) 
  .y((p) => p.y); 

// crea gruppo dei gruppi delle linee
const gruppoLinee = svg.append("g").attr("id","linee").attr("clip-path","url(#myMask)");



//inizializzo l'array che raccoglie la lunghezza di tutte le linee. 
// l'indice dell'array è l'id della scena, e contiene al suo interno l'id del personaggio
let lunghezzaLinee = [];


function datasetPerScena(dataset, numScena){
 //    console.log(d3.groups(dataset, d=>d.scena)[numScena]);
    let x = d3.groups(dataset, d=>d.scena)[numScena][1]; //raggruppo il dataset per il numero di scena e prendo l'array corrispondente
    return x; // riduci il dataset in base alla scena
}

// crea le linee di una scena
function creaLineeScena(gruppo, scena) { 
     creaLineaScena(gruppo,"1", puntiP1, scena);
     creaLineaScena(gruppo,"2", puntiP2, scena);
     creaLineaScena(gruppo,"3", puntiP3, scena);
     creaLineaScena(gruppo,"4", puntiP4, scena);

}

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
                .attr("d",Gen(puntiScena))
                .attr("stroke", "white")
                .attr("fill", "none")
                .attr("stroke-width", spessoreLinee);
    lunghezzaLinee[scena][idPersonaggio] = line.node().getTotalLength();
    calcolaPercentuale(puntiScena,lunghezzaLinee[scena][idPersonaggio]); 
}



// crea tutte le linee

for (let scena = 0; scena<numeroScene; scena++) {
    let id = "linee_"+scena;
    lunghezzaLinee[scena]=[]; //inizializza l'array della lunghezza delle linee per quella scena specifica
    let gruppoLineeScena = gruppoLinee.append("g").attr("id",id);
    creaLineeScena(gruppoLineeScena, scena);
}

function creaFaccia(idPersonaggio) {
    console.log(personaggi[idPersonaggio].faccia);
    let faccia = svg
        .append("image")
        .attr("class","faccia")
        .attr("id","faccia"+idPersonaggio)
        .attr("width",30)
        .attr("height",30)
        .attr("x",-15)
        .attr("y",-15)
        .attr("href", riferimentiPersonaggi[idPersonaggio].faccia);
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
    for (let i = 0; i<personaggi.length; i++) {
        creaFaccia(i);
    }
}

creaFacce();


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

    console.log(pt0);
    // calcolo la percentuale di progresso (da 0 a 1) lungo il tratto e la differenza tra le Y
    let progressoTratto = (pt.x-pt0.x) / (pt1.x - pt0.x); 
    let diffY = progressoTratto * (pt1.y - pt0.y);

    // calcolo la y della faccia
    pt.y =  pt0.y + diffY;

    // traslo la faccia
    let traslazioneX = pt.x - traslazione; 
    obj.style.webkitTransform = 'translate3d('+traslazioneX+'px,'+pt.y+'px, 0)'; 
    
 }

 // POSIZIONA LA FACCIA IN BASE ALLA X DATA COME PARAMETRO
 function muoviFacciaDaX (idFaccia, puntiP, x, traslazione) {
    let obj = document.getElementById(idFaccia);
    let numPunti = puntiP.length; // ottieni il numero di punti che definiscono la linea
   // let ampiezza = puntiP[numPunti-1].x - puntiP[0].x; // ottieni l'ampiezza in x del progresso
    let pt = {}; // crea l'oggetto pt che definirà la posizione della faccia
   // pt.x = puntiP[0].x + progresso * ampiezza;  x della faccia è proporzionale al progresso
    
    pt.x = x;
    let xLinea = x + traslazione;
    console.log("dentro");
    let i = 0;
    console.log("x linea "+ xLinea);
    console.log("num punti: "+numPunti);

    // cerca i due punti tra cui è compresa la x
    while (i < numPunti && puntiP[i].x < xLinea) { // esce quando x è maggiore (o quando la linea è finita)
        i++; 
    } 
    console.log(i); // il prossimo
    let pt0, pt1;
    if (i< (numPunti-1)) {
         pt0 = puntiP[i-1]; //punto precedente
         pt1 = puntiP[i]; //punto successivo
    }
    else if (i == (numPunti-1)) {
        console.log("in ultimo");
         pt0 = puntiP[i];
         pt1 = puntiP[i];
    }
   

    console.log(pt0);
    console.log(pt);
    // calcolo la percentuale di progresso (da 0 a 1) lungo il tratto e la differenza tra le Y
    let progressoTratto = (xLinea-pt0.x) / (pt1.x - pt0.x); 
    let diffY = progressoTratto * (pt1.y - pt0.y);

    // calcolo la y della faccia
    pt.y =  pt0.y + diffY;

    // traslo la faccia
    obj.style.webkitTransform = 'translate3d('+pt.x+'px,'+pt.y+'px, 0)'; 
    
 }

 //funzione per ottenere la percentuale nella linea a partire dalla x
 export function muoviFacce(scena, progresso, traslazione) {   
    muoviFacciaDaX("faccia0", datasetPerScena(puntiP1,scena), xMaschera, traslazione);
    muoviFacciaDaX("faccia0", datasetPerScena(puntiP2,scena), xMaschera, traslazione);
    muoviFacciaDaX("faccia0", datasetPerScena(puntiP3,scena), xMaschera, traslazione);
    muoviFacciaDaX("faccia0", datasetPerScena(puntiP4,scena), xMaschera, traslazione);
   
    //...
   
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
// #########################    FUNCTIONS                   ###################
// ############################################################################



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

export function impostaZoom(rapporto,traslazioneY) {
    svg
    .attr("transform","scale("+rapporto+") "+"translate("+-100*(rapporto / 2)+" "+traslazioneY+") ");
}

export function calcolaZoom(progresso, nuovo, vecchio) {
    let deltaAltezza = coordinateLivelli[nuovo[0]].max - coordinateLivelli[nuovo[1]].min;
    let rapportoFinale = altezzaPagina / deltaAltezza;
    let rapporto, traslazioneY;

    if (progresso <= zoomProgressoFinale) // quando deve progredire
     {
        let deltaAltezzaOld = coordinateLivelli[vecchio[0]].max - coordinateLivelli[vecchio[1]].min;
        let rapportoIniziale = altezzaPagina / deltaAltezzaOld;

        let calcolaRapporto = d3.scaleLinear().domain([0,zoomProgressoFinale]).range([rapportoIniziale,rapportoFinale]);
        let calcolaTraslazioneY = d3.scaleLinear().domain([0,zoomProgressoFinale]).range([-coordinateLivelli[vecchio[1]].min, -coordinateLivelli[nuovo[1]].min]);
        rapporto = calcolaRapporto(progresso);    
        traslazioneY = calcolaTraslazioneY(progresso);
     } else {
        rapporto = rapportoFinale;
        traslazioneY = -coordinateLivelli[nuovo[1]].min;
    }
    
    impostaZoom(rapporto,traslazioneY);
   
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

