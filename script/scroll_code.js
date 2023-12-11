import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


import * as animations from "./d3-animations.js"



// using d3 for convenience
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
 ampiezzaScene[0]=21;
 ampiezzaScene[1]=21;

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
    console.log("altezza:"+window.innerHeight);
    console.log(response);
    

    var backContainer = d3.select("#sfondo");
   //  var linea = d3.select("#the_line");
    console.log("response progress: "+response.progress);
     // var translation = (response.progress) * k * unit;
     var translation = (response.progress) * animations.stabilisciAmpiezzaLinea(response.index);
    backContainer.style("transform", "translateX(" + -translation + "px)");

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




var oraZoom = [3,3];
var nuovoZoom;

function zoom(pianoInferiore, pianoSuperiore) {
   
    console.log("AAA ora "+ oraZoom);
    console.log("AAA nuovo "+ nuovoZoom);
  //  if (response.progress <= animations.zoomProgressoFinale) {
     //   console.log("dentro zoom");
        nuovoZoom = [pianoInferiore, pianoSuperiore];
        animations.calcolaZoom(response.progress,nuovoZoom,oraZoom);
        oraZoom = nuovoZoom;
        console.log("AAA nuovo2 "+nuovoZoom);

        console.log("AAA nuovo2 "+nuovoZoom);
  //  }
//    else {}
    
}

switch (response.index) {
    case 0:
        zoom(3,3);
        //A SCATTI animations.impostaZoom(3,3);

        if (response.direction === "up") {
        } else {
        }
        break;
    case 1:
        zoom(3,4);
            
        break;
    case 2:
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