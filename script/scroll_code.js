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

const numPersonaggi = 2; 


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





switch (response.index) {
    case 0:
        if (response.direction === "up") {
            // animations.drawLinePath(response.progress);
        } else {
            // animations.drawLinePath(response.progress);
        }
        break;
    case 1:
        break;
    case 2:
        // animations.mapOpacity(response.progress);
        break;
    case 3:
        // animations.increaseJourney(response.progress);
        // animations.allCitiesOpacity(response.progress);
        break;
    case 4:
        // animations.setOpacityAxes(true, true, response.progress)
        break;
    case 5:
        // animations.drawLinePath(response.progress)
        // animations.increaseJourney(1 - response.progress)
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