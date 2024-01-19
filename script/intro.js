import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as animations from "./d3-animations.js"
import * as scrollCode from "./scroll_code.js"

const larghezzaDaSx = 40 //%;
const altezza = 25;
const spessoreLinea = 20;

let svg = d3.select("#legenda-parent").append("svg")
    .attr("id","legenda")
    .attr("width","100%")
    .attr("height",altezza+"em");

let personaggiL0=[1,2,7,11];
let personaggiL1=[8,6,3,4];
let personaggiL2=[9,10];
let personaggiL3=[5];

let coloreLinea = ["black","#C00000","white","#690000"];
let nomeFamiglia = ["THE PARKS","THE KIMS","",""]

let personaggiLinee = [personaggiL0,personaggiL1,personaggiL2,personaggiL3];

function creaFacciaNome(idPersonaggio){

}


let larghezzaFaccia = 80;

let gruppo = svg.append("g")
    .attr("width","70%")
    .attr("transform","translate(0,"+larghezzaFaccia+")");

function creaLineaLegenda(idLinea) {
    let x1 = larghezzaDaSx;
    let x2 = 100;
    let distanza = altezza/3;
    let y = idLinea*distanza;
    if (idLinea ==2) {
        x2 = larghezzaDaSx + (0.5*(100-larghezzaDaSx));
    }
    if(idLinea==3) {
        x1 = larghezzaDaSx + (0.75*(100-larghezzaDaSx));
        y = 2*distanza;
    }
    let linea = gruppo.append("line")
        .attr("id","legenda-L"+idLinea)
        .attr("x1",x1+"%")
        .attr("x2",x2+"%")
        .attr("y1",y+"em")
        .attr("y2",y+"em")
        .attr("stroke",coloreLinea[idLinea])
        .attr("stroke-width",spessoreLinea+"px");

    // nome famiglia
    gruppo
            .append("text")
            .text(nomeFamiglia[idLinea])
            .attr("x",larghezzaDaSx-2+"%")
            .attr("y",y+"em")
            .attr("fill","#C1976b")
            .attr("text-anchor","end")  
            .attr("dominant-baseline","central"); 
          //  .attr("transform","translate(0,"+spessoreLinea/2+")");


    let personaggiL=personaggiLinee[idLinea];
    for(let p=0;p<personaggiL.length;p++) {
        let larghezzaFacciaP = larghezzaFaccia;
        let x = parseInt(x1)+parseInt(p)*((100-larghezzaDaSx)/4)+((100-larghezzaDaSx)/8);
        gruppo
            .append("image")
            .attr("class","facciaLegenda")
            .attr("id","facciaLegenda"+personaggiL[p])
            .attr("width",larghezzaFacciaP+"px")
            .attr("height",larghezzaFacciaP+"px")
            .attr("x",x+"%")
            .attr("y",y+"em")
            .attr("href",animations.personaggi[personaggiL[p]-1].faccia)
            .attr("transform","translate("+-larghezzaFacciaP/2+","+-larghezzaFacciaP/2+")");

        // nomi personaggi
        gruppo
            .append("text")
            .text(animations.personaggi[personaggiL[p]-1].nome)
            .attr("x",x+"%")
            .attr("fill", "#C1976b")
            .attr("y",(parseInt(y)+parseInt(distanza)/3+1.5)+"em")
            .attr("text-anchor","middle");   
    }
    
}

for (let i=0;i<4;i++) {
    creaLineaLegenda(i);
}



// 

let larghezzaFacciaX = 80;

let tipoLinee = d3.select("#legenda-tipolinee").append("svg")
.attr("id","tipolinee")
.attr("width","50%")
.attr("height",altezza+"em");

let tipoLineeG = tipoLinee.append("g").attr("width","100%");

tipoLineeG.append("line")
    .attr("x1",0)
    .attr("x2","60%")
    .attr("y1",altezza/4+"em")
    .attr("y2",altezza/4+"em")
    .attr("stroke","red")
    .attr("stroke-width",spessoreLinea+"px");

tipoLineeG.append("image")
    .attr("x","60%")
    .attr("y",altezza/4+"em")
    .attr("width", larghezzaFacciaX+"px")
    .attr("height",larghezzaFacciaX+"px")
    .attr("href","./assets/facce/figliaParks.svg")
    .attr("transform","translate("+-larghezzaFacciaX/2+","+-larghezzaFacciaX/2+")");


    tipoLineeG.append("line")
    .attr("x1",0)
    .attr("x2","60%")
    .attr("y1",2*altezza/4+"em")
    .attr("y2",2*altezza/4+"em")
    .attr("stroke","red")
    .attr("stroke-width",spessoreLinea+"px")
    .attr("stroke-dasharray","6% 9%");

    tipoLineeG.append("image")
    .attr("x","60%")
    .attr("y",2*altezza/4+"em")
    .attr("width", larghezzaFacciaX+"px")
    .attr("height",larghezzaFacciaX+"px")
    .attr("href","./assets/facce/figliaParks.svg")
    .attr("transform","translate("+-larghezzaFacciaX/2+","+-larghezzaFacciaX/2+")");

    tipoLineeG.append("line")
    .attr("x1",0)
    .attr("x2","60%")
    .attr("y1",3*altezza/4+"em")
    .attr("y2",3*altezza/4+"em")
    .attr("stroke","red")
    .attr("stroke-width",spessoreLinea+"px");


    tipoLineeG.append("image")
    .attr("x","60%")
    .attr("y",3*altezza/4+"em")
    .attr("width", larghezzaFacciaX+"px")
    .attr("height",larghezzaFacciaX+"px")
    .attr("href","./assets/facce/figliaParks.svg")
    .attr("transform","translate("+-larghezzaFacciaX/2+","+-larghezzaFacciaX/2+")");


/*     tipoLineeG.append("text")
    .text("The characters’ paths are indicated by lines.")
         .attr("x","100%")
         .attr("y",altezza/4+"em")
         .attr("text-anchor","middle")
         .attr("fill","white");

    tipoLineeG.append("text")
    .text("The dashed line represents the path we imagined for the character. when the movie didn't show us.")
         .attr("x","100%")
         .attr("y",2*altezza/4+"em")
         .attr("text-anchor","middle")
         .attr("fill","white");


    tipoLineeG.append("text")
    .text("Il morto.")
         .attr("x","100%")
         .attr("y",3*altezza/4+"em")
         .attr("text-anchor","middle")
         .attr("fill","white"); */

d3.select("#legenda-tipolinee").append("div").attr("id","testo-legenda").attr("width","50%").attr("height","100%")
.html("The characters’ paths are indicated by lines. </br> The dashed line represents the path we imagined for the character </br> when the movie didn't show us.");