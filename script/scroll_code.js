import * as animations from "./d3-animations.js"

// using d3 for convenience
var main = d3.select("main");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");

// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
    // 1. update height of step elements
    var stepH = Math.floor(window.innerHeight * 4);
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


    var backContainer = d3.select("#chart");
    console.log("response progress: "+response.progress);
    // Calculate the translation amount based on the scroll progress
    var translation = 10+ response.progress * window.innerWidth;

    // Apply the translation to the back container
    backContainer.style("transform", "translateX(" + -translation + "px)");


    switch(response.index){
        case 0:
            if(response.direction === "up"){
                if(response.progress == 0) {}

            }else{ // we are going down the page
                if(response.progress == 1) {}
                 //   animations.drawBubbles()
                   
            }
            break;
        case 1:
            if(response.direction === "up"){
                animations.drawLinePath(response.progress);
            } else { // we are going down the page
                animations.drawLinePath(response.progress);

            }
            break;
        case 2:
           // animations.mapOpacity(response.progress);
            break;
        case 3:
         //   animations.increaseJourney(response.progress);
         //   animations.allCitiesOpacity(response.progress);
            break;
        case 4:
         //   animations.setOpacityAxes(true, true, response.progress)
            break;
        case 5:
         //   animations.drawLinePath(response.progress)
        //    animations.increaseJourney(1-response.progress)
            break;
        case 6:
            break;
        case 7:
            break;
        default:
            break;
    }
}

function handleStepEnter(response){
    //console.log(response);

    switch(response.index){
        case 0:
            animations.selezionaSfondo(0);
            if(response.direction === "down") {}
            
            else if(response.direction === "up") {}
                //animations.hideBubbles();

            break;
        case 1:
            if(response.direction === "down"){
                animations.selezionaSfondo(1);

            }
            else if(response.direction === "up")
            animations.selezionaSfondo(1);

                
            break;
        case 2:
            animations.selezionaSfondo(2);
            break;
        case 3:
            break;
            case 4:
                break;        
        case 4:
            break;
        case 5:
            break;
        case 6:
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