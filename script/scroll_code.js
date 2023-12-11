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
 const zoomScena = [
    [1,1],
    [1,3],
    [0,4]
 ];
 
 var oraZoom=[1,1];
 var nuovoZoom=[1,1];
 

const numPersonaggi = 4; 


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



    // FUNZIONE PER RICHIAMARE GLI ZOOM in "up" e in "down"
    function zoom() {
    
    //  if (response.progress <= animations.zoomProgressoFinale) {
        //   console.log("dentro zoom");
        // nuovoZoom = [pianoInferiore, pianoSuperiore];

        nuovoZoom = zoomScena[response.index];

        animations.calcolaZoom(response.progress,nuovoZoom,oraZoom);

        if(response.direction === "down" && response.progress>0.2) {
                oraZoom = nuovoZoom;
        }

        if(response.direction === "up" && response.progress<0.2 && response.index>0) {
            nuovoZoom = zoomScena[response.index];
            oraZoom = zoomScena[response.index-1];
        }

        
    }

    switch (response.index) {
        case 0:
            zoom();
            //A SCATTI animations.impostaZoom(3,3);

            if (response.direction === "up") {
            } else {
            }
            break;
        case 1:
            zoom();
                
            break;
        case 2:
            zoom();
            break;
        case 3:
        
            break;
        case 4:
            break;
        case 5:

            break;
        case 6:
            break;
        case 7:
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