import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as animations from "./d3-animations.js"


var main = d3.select("main");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");
const altezzaPagina = window.innerHeight;
const percentualeAltezzaStanze = 0.23
const unit = altezzaPagina*percentualeAltezzaStanze; //unità di altezza
const k = 3047/900; // lunghezza / altezza csv stanze
const ampiezzaScene = [];
 ampiezzaScene[0]=20;
 ampiezzaScene[1]=20;
 ampiezzaScene[2]=20;

 // VALORI ZOOM PER SCENA
 var zoomScena = animations.zoomScena;
 
 var oraZoom=[1,1];
 var nuovoZoom=[1,1];
 

const numPersonaggi = 12; 


// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
    // 1. update height of step elements
//    var stepH = Math.floor(window.innerHeight * 4);
//    step.style("height", stepH + "px");

    var stepH = Math.floor(250 * ampiezzaScene[0]);
    step.style("height", stepH + "px");

    var figureHeight = window.innerHeight;
    var figureMarginTop = 2*window.innerHeight ;

    figure
        .style("height", figureHeight + "px")
        .style("top", "0px");

    // 3. tell scrollama to update new element dimensions
    scroller.resize();
}


// scrollama event handlers
function handleProgress(response) {
    console.log("indice: "+response.index);
    // CALCOLO TRASLAZIONE
    var translation = (response.progress) * animations.stabilisciAmpiezzaLinea(response.index);

    // APPLICO TRASLAZIONE A SFONDO
    var backContainer = d3.select("#sfondo");
    backContainer.style("transform", "translateX(" + -translation + "px)");

    // APPLICO TRASLAZIONE A LINEE

    // trasla la linea dato l'id passato come parametro
    function traslaLinea(id, translation) {
        let linea = d3.select("#"+id);
        linea.style("transform", "translateX(" + translation + "px)");
    };

    for (let idPersonaggio=1; idPersonaggio<=numPersonaggi; idPersonaggio++){
        console.log("idPersonaggio "+idPersonaggio);
        traslaLinea("linea_"+response.index+"_P"+idPersonaggio, -translation); // l'id viene calcolato come composizione di stringhe
        if (response.index != 0 ) { // continua a traslare la linea precedente di un modulo in più
            traslaLinea("linea_"+(response.index-1)+"_P"+idPersonaggio, (-translation)-(animations.stabilisciAmpiezzaLinea(response.index-1)));
        }

        animations.muoviFacce(response.index, response.progress, translation);

    }

    animations.mostraLineeScena(response.index,response.direction);
    nascondiLineaTutta(12,response.index);


    // FUNZIONE PER RICHIAMARE GLI ZOOM in "up" e in "down"
    function zoom() {
    
    //  if (response.progress <= animations.zoomProgressoFinale) {
        //   console.log("dentro zoom");
        // nuovoZoom = [pianoInferiore, pianoSuperiore];

        nuovoZoom = zoomScena[response.index];

        animations.calcolaZoom(response.progress,response.index,nuovoZoom,oraZoom);

        if(response.direction === "down" && response.progress>0.2) {
                oraZoom = nuovoZoom;
        }

        if(response.direction === "up" && response.progress<0.2 && response.index>0) {
            nuovoZoom = zoomScena[response.index];
            oraZoom = zoomScena[response.index-1];
        }

        
    }

    fineLinea(5,0,3, response); // FINE MIN
    morte(9,7,2,response)

    switch (response.index) {

   
        case 0:
        //    zoom();
            //A SCATTI animations.impostaZoom(3,3);

            if (response.direction === "up") {
            } else {
            }

            // PIETRA
            mostraTraPunti("pietra",4,0,1,response);
            if (response.progress <= animations.ottieniProgresso(5,response.index,1)) {              // prima del primo vertice di min
                animations.muoviOggetto("pietra", response, 5 ,translation,-15,15); // aggancia a min
            } else {                                                                // altrimenti
                animations.muoviOggetto("pietra", response, 4,translation,-15,15);  // aggancia a kevin
            }
            


            break;
        case 1:
       //     zoom();

           //  mostraDopoSoglia("intro", response, 0.5);
         //   
            //mostraTraProgress("mutande",0.5, 0.7, response);
         //   mostraTraPunti("mutande",12,1,2,response);

            // MOS
          
            break;
        case 2:
        //    zoom();
        //    nascondiLineaTutta(3,response.index);
             //   morte(3,2,2,response);
             
            break;
        case 3:
        //    mostraLineaTutta(3,response.index);
        //    animations.nascondiLineaInizio(7,response.index,2);

            break;
        case 4:
            break;
        case 5:

            break;
        case 6:
            break;
        case 7:
            break;
        case 8: 
            break;
        case 9:
            break;
        case 10:
            break;
        case 11:
            break;
        default:
            break;
    }
}

function setupStickyfill() {
    d3.selectAll(".sticky").each(function() {
        Stickyfill.add(this);
    });
}

function init() {
    setupStickyfill();


    // 1. force a resize on load to ensure proper dimensions are sent to scrollama

    handleResize();

    // 2. setup the scroller passing options
    // 		this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller
        .setup({
            step: "#scrolly article .step",
            offset: 0,
            progress: true,
            debug: false
        })
        .onStepProgress(handleProgress)
        .onStepEnter(handleStepEnter);

    window.addEventListener("resize", handleResize);

}

// kick things off
init();


// FUNZIONI

function mostra(obj) {
    obj.style.visibility = "visible";
}


function nascondi(obj) {
    obj.style.visibility = "hidden";
}

function mostraTraProgress(id, p0, p1, response) {
    let obj = document.getElementById(id);
    console.log("mostra p0 "+p0);
    console.log("mostra p1 "+p1);
    console.log("mostra prog "+response.progress);

    if ((response.progress*100) >= p0 && (response.progress*100) < p1) {
        console.log("mostra in");
        mostra(obj);
    } else {
        nascondi(obj);
    }
}

function mostraTraPunti(id, idPersonaggio, tempo0, tempo1, response) {
    //TEMPO SONO IL NUMERO ORDINALE DI PUNTI DELLA SCENA!!
    let puntiScena = animations.datasetPerScena(animations.ottieniPuntiP(parseInt(idPersonaggio)),response.index);
 //   console.log(puntiScena);
    let p0 = puntiScena[tempo0].progresso;
    let p1 = puntiScena[tempo1].progresso;

    mostraTraProgress(id,p0,p1,response);
}


function mostraDopoSoglia(id, response, soglia) {

    let oggetto = document.getElementById(id);
   /*  if (response.index < index) {
        oggetto.style.visibility = "hidden";
    } */

    if (response.progress >= soglia) {
        oggetto.style.visibility = "visible";
        } 
    
    if (response.progress <= soglia) {
        oggetto.style.visibility = "hidden";
            } 


    /* if (response.index > index) {
                oggetto.style.visibility = "visible";
            } */
    }


// nasconde linea e scena intera e fa sparire faccia
function nascondiLineaTutta(personaggio, scena, nascondiFaccia) {
    let idLinea = "linea_"+scena+"_P"+personaggio;
    let linea = document.getElementById(idLinea);

    nascondi(linea);

    if (nascondiFaccia) {
        let idFaccia = "faccia"+personaggio;
        let faccia = document.getElementById(idFaccia);
    
        nascondi(faccia);
    }
   

}

// mostra

function mostraLineaTutta(personaggio, scena) {
    let id = "linea_"+scena+"_P"+personaggio;
    let obj = document.getElementById(id);
    mostra(obj);
}

// blocca oggetto o faccia in corrispondenza di un vertice di un personaggio



function fineLinea(idPersonaggio, scena, indiceTempo, response) {
    if (response.index == scena) {
        animations.nascondiLineaFine(idPersonaggio, scena, indiceTempo);
    }
    if (response.index > scena) {
        nascondiLineaTutta(idPersonaggio, response.index, false);
    }
    animations.bloccaElemento("faccia"+idPersonaggio, idPersonaggio, scena, indiceTempo, response, 0, 0);
}

/* 
function morte(idPersonaggio,scena,indiceTempo,response) {
    animations.nascondiLineaFine(idPersonaggio,scena,indiceTempo);
    if (response.progress >= animations.ottieniProgresso(idPersonaggio,scena,indiceTempo)) {// blocca solo dopo aver superato il punto
        animations.bloccaElemento("faccia"+idPersonaggio,idPersonaggio,scena,indiceTempo,response,0,0);
        animations.cambiaFaccia(idPersonaggio,true);
    }  else {
        animations.cambiaFaccia(idPersonaggio,false);
    }
} */


function morte(idPersonaggio,scena,indiceTempo,response) {
    fineLinea(idPersonaggio,scena, indiceTempo, response);
    if (response.index > scena || (response.index == scena && response.progress >= animations.ottieniPercX(idPersonaggio,scena,indiceTempo))) {// blocca solo dopo aver superato il punto
      console.log("facciaIn")
        animations.cambiaFaccia(idPersonaggio,true);
    }  else {
        animations.cambiaFaccia(idPersonaggio,false);
    } 
}