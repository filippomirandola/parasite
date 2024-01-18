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

let coloreLinea = ["black","red","white","#690000"];
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
        let larghezzaFacciaP = larghezzaFaccia*animations.personaggi[personaggiL[p]-1].dimensione;
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