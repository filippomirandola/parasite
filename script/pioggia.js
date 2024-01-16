import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as animations from "./d3-animations.js"
import * as scrollCode from "./scroll_code.js"


//
//  CREAZIONE PIOGGIA 
//

let containerPioggia = document.getElementById("chart").appendChild(document.createElement("div"));
containerPioggia.setAttribute("id","pioggia");
let hrElement;
let counter = 100;
for (let i = 0; i < counter; i++) {
  hrElement = document.createElement("HR");
  hrElement.setAttribute("class","pioggia-el")
    hrElement.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
    hrElement.style.animationDuration = 0.2 + Math.random() * 0.3 + "s";
    hrElement.style.animationDelay = Math.random() * 5 + "s";
 
 // document.getElementById("chart").appendChild(hrElement);
 containerPioggia.appendChild(hrElement);
}

let tuttaPioggia = d3.selectAll(".pioggia-el");



//
//  CREAZIONE ACQUA 
//

let progressoMax = 0.6; // a che progresso far finire il riempimento
let livello = 2; // a che livello far arrivare

let containerAcqua = d3.select("#acqua-parent");
let altezzaMax = animations.getCoordinateLivelli(livello).min;

console.log(altezzaMax);
let calcolaAltezza = d3.scaleLinear().domain([0,progressoMax]).range([window.innerHeight,altezzaMax]);

let acqua = containerAcqua.append("image")
    .attr("id","acqua")
    .attr("width",2*window.innerWidth)
    .attr("x",0)
    .attr("y",window.innerHeight)
//    .attr("opacity",0.5)
    .attr("href","./assets/oggetti/acqua.svg");

export function calcolaAcqua(progresso) {
    if (progresso <= progressoMax)
    document.getElementById("acqua").setAttribute("y",calcolaAltezza(progresso));
    else     document.getElementById("acqua").setAttribute("y",calcolaAltezza(progressoMax));

}


// MOSTRA E NASCONDI

export function mostraPioggia() {
    tuttaPioggia.classed("nascondi",false);
    acqua.classed("nascondi",false);
    tuttaPioggia.classed("mostra",true);
    acqua.classed("mostra",true);
}

export function nascondiPioggia() {
    tuttaPioggia.classed("nascondi",true);
    acqua.classed("nascondi",true);
    tuttaPioggia.classed("mostra",false);
    acqua.classed("mostra",false);
}

nascondiPioggia();

export function attivaAnimazione() {
    tuttaPioggia.classed("animazione",true);
}

export function disattivaAnimazione() {
    tuttaPioggia.classed("animazione",false);
}