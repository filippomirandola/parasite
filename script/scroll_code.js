import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as animations from "./d3-animations.js";
import * as pioggia from "./pioggia.js";
import * as testi from "./testi.js";
import * as finale from "./finale.js";



var main = d3.select("main");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");
var stepFinale = step.filter(function() {
  return d3.select(this).attr("data-step") == 12; 
})
var stepCredits = step.filter(function() {
    return d3.select(this).attr("data-step") == 13; 
  })

var acqua = document.getElementById("acqua-parent");
const altezzaPagina = window.innerHeight;
const percentualeAltezzaStanze = 0.23
const unit = altezzaPagina*percentualeAltezzaStanze; //unità di altezza
const k = 3047/900; // lunghezza / altezza csv stanze
const ampiezzaScene = [];
 ampiezzaScene[0]=20;
 ampiezzaScene[1]=20;
 ampiezzaScene[2]=20;
 const dim = animations.dimensioneFacce;

 // VALORI ZOOM PER SCENA
 var zoomScena = animations.zoomScena;
 
 var oraZoom=[1,1];
 var nuovoZoom=[1,1];
 

const numPersonaggi = 11; 


// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
    // 1. update height of step elements

    var stepH = Math.floor(250 * ampiezzaScene[0]);
    step.style("height", stepH + "px");
    stepFinale.style("height", Math.floor(75 * ampiezzaScene[0])+ "px");
    stepCredits.style("height", Math.floor(75 * ampiezzaScene[0])+ "px");

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
    if (response.index <= 11 ) {

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
        traslaLinea("linea_"+response.index+"_P"+idPersonaggio, -translation); // l'id viene calcolato come composizione di stringhe
        if (response.index != 0 ) { // continua a traslare la linea precedente di un modulo in più
            traslaLinea("linea_"+(response.index-1)+"_P"+idPersonaggio, (-translation)-(animations.stabilisciAmpiezzaLinea(response.index-1)));
        }

        animations.muoviFacce(response.index, response.progress, translation);

    }

    animations.mostraLineeScena(response.index,response.direction);

        // APPLICO TRASLAZIONE A INTRO
        var introSVG = d3.select("#introSVG");
        introSVG.style("transform", "translateX(" + -translation*3 + "px)");


    // FUNZIONE PER RICHIAMARE GLI ZOOM in "up" e in "down"
    function zoom() {

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



    // COME INSERIRE LA FINE DELLA LINEA E/O LA MORTE:
    // si scrive morte(idPersonaggio, scena della morte, tempo della morte,  response)
    //      - idPersonaggio è quello che si trova nell'array "personaggi" alla riga 43 di d3-animations.js
    //      - la scena della morte va da 0 a 11
    //      - il tempo della morte NON è il tempo da 0 a 19!!!!
    //        è il numero ordinale del punto in cui muore nel DATASET.
    //        per esempio, se in un dataset ho i punti ai tempi
    //          0 
    //          1
    //          5
    //          10
    //          11
    //          19
    //       e voglio che muoia al tempo 11, come valore devo inserire 4 (perché è il 5° valore ma si parte a contare dallo 0).
    //      NB nel dataset, anche se magari non sono presenti, è come se ci fossero SEMPRE il tempo 0 e il tempo 19, per cui vengono sempre conteggiati!
    //         In altre parole, se nel dataset manca il tempo0 e il primo punto è il tempo5, e voglio che muoia al tempo5, dovrò mettere come indice 1 e non 0. 

    
    fineLinea(5,0,3, response); // FINE MIN
    morte(9,7,2,response);
    morte(3,9,3,response); // jessica
    morte(11,9,2,response); // papà parks
    morte(10,9,2,response); // bunkerbro
    mostraDopoTempo("campanello1",5,13,response);
    mostraDopoTempo("campanello2",6,10,response);
    mostraDopoTempo("bicchiere",5,12,response);
    mostraDopoTempo("lotta",6,4,response);

    fineLinea(1,9,2, response); 
    fineLinea(2,9,2, response); 
    fineLinea(7,9,2, response);
    fineLinea(6,11,2, response); 
    fineLinea(4,11,2, response); 
    fineLinea(8,11,1, response); 



// BUNKERSIS

    if (response.index <4) {
        
        mostraLineaTutta(9,3);
        nascondiLineaTutta(9, 4, false)
        fineLinea(9,3,2, response); // FINE bunker sis
    }
        if (response.index == 4) {
            mostraLineaTutta(9,3);
            nascondiLineaTutta(9, 4, false)
            fineLinea(9,3,2, response);
        nascondiLineaTutta(9, 5, false)
        if(response.progress < calcolaPercentualeTempo(5,12)) {
            document.getElementById("gruppo-faccia9").setAttribute("visibility","visible");
            mostra(document.getElementById("gruppo-faccia9"));
        }
    }


    if (response.index >= 5) {
        if(response.index === 5 && response.progress < calcolaPercentualeTempo(5,12)) document.getElementById("gruppo-faccia9").setAttribute("visibility","hidden");
        else document.getElementById("gruppo-faccia9").setAttribute("visibility","visible");
        inizioLinea(9,5,3,response);
        mostraDopoTempo("linea_5_P9",5,13,response);
        mostraDopoTempo("gruppo-faccia9",5,13,response);
        if (response.index > 7) {
            document.getElementById("linea_"+response.index+"_P9").style.visibility = "hidden";
        }

    }

    switch (response.index) {

   
        case 0:
            zoom();
            testi.mostraTestoTraTempi(response,1,10,0);
            testi.mostraEtichettaTraTempi(response,5,14,0);

            if (response.progress < 0.1) {
                if (response.direction === "up") {
                    document.getElementById("container").classList.remove("mostra");
                }
                else                     document.getElementById("container").classList.add("mostra");

            }

            if (response.progress <= 0.9) {
                mostra(document.getElementById("introSVG"));
            } else {
                nascondi(document.getElementById("introSVG"));

            }





            // PIETRA
           mostraTraProgressN("pietra",calcolaPercentualeTempo(0,1),calcolaPercentualeTempo(0,19),response);
            if (response.progress <= calcolaPercentualeTempo(0,12)) {              // animations.ottieniProgresso(5,response.index,2)prima del primo vertice di min
                animations.muoviOggetto("pietra", response, 5 ,translation,dim*0.7,dim*0.2); // aggancia a min
            } else if (response.progress <= calcolaPercentualeTempo(0,16)){                                                                // altrimenti
                animations.muoviOggetto("pietra", response, 4,translation,dim*0.7,dim*0.2);  // aggancia a kevin
            } else {
                animations.muoviOggetto("pietra", response, 8,translation,dim*0.7,dim*0.2); // aggancia a mamma parks
            }

                    // anima
            if(response.progress > calcolaPercentualeTempo(0,12)-0.02 && response.progress < calcolaPercentualeTempo(0,12)+0.02) {
                d3.select("#pietra").classed("anima",true);
            } else if(response.progress > calcolaPercentualeTempo(0,16)-0.02 && response.progress < calcolaPercentualeTempo(0,16)+0.02) {
                d3.select("#pietra").classed("anima",true);
            } else d3.select("#pietra").classed("anima",false);
            


            break;
        case 1:
            zoom();
            
            testi.mostraTestiTraTempi(response,2,11,1,16,19,2);
            testi.mostraEtichettaTraTempi(response,3,10,1);
            if(response.direction=="down") nascondi(document.getElementById("pietra"));

            break;
        case 2:
            zoom();
            testi.mostraTestiTraTempi(response,0,10,2,13,19,3);

          mostraTraProgressN("auto",calcolaPercentualeTempo(2,11),calcolaPercentualeTempo(2,15)-0.05,response);
           // AUTO va al padreParks dal t12 al t13

            if (response.progress <= calcolaPercentualeTempo(2,12)) {  
                animations.muoviOggetto("auto", response, 11 ,translation,-dim*0.75,dim*0.2); // aggancia a jessica
               // aggancia a papà parks
            } else    animations.muoviOggetto("auto", response, 3,translation,-dim*0.75,dim*0.2);    // a Jessica dal 13 al 16

                          // anima
                          if(response.progress > calcolaPercentualeTempo(2,12)-0.02 && response.progress < calcolaPercentualeTempo(2,12)+0.02) {
                            d3.select("#auto").classed("anima",true);
                        } else d3.select("#auto").classed("anima",false);


           // MUTANDE JESSICA(3) s2 t16 le 
           mostraTraProgressN("mutande",calcolaPercentualeTempo(2,13),calcolaPercentualeTempo(2,14),response);
           animations.muoviOggetto("mutande", response, 3 ,translation,dim*1.3,-dim*0.9); // aggancia a jessica 

             
            break

        case 3:
            zoom();
            testi.mostraTestiTraTempi(response,0,3,3,4,19,4);


      // AUTO va al padreKim dal t3 al t17

            mostraTraPunti("auto",6,1,4,response);
            animations.muoviOggetto("auto", response, 6,translation,-dim*0.75,dim*0.2);


            
            // PESCA da 3,3 fino a 3,11 con padrekim(6) 
            // da 3,11 a 3,12 a bunkersis(9)
        mostraTraProgressN("pesca",calcolaPercentualeTempo(3,1),calcolaPercentualeTempo(3,12),response);
        if (response.progress <= calcolaPercentualeTempo(3,3)) { 
            animations.muoviOggetto("pesca", response, 3 ,translation,dim*1.3,-dim*0.9); // aggancia a jessica
        } else if (response.progress <= calcolaPercentualeTempo(3,9)){ 
            animations.muoviOggetto("pesca", response, 6,translation,dim*1.3,-dim*0.9); // aggancia a padre kim
        } else {
            animations.muoviOggetto("pesca", response, 9,translation,-dim*1.1,-dim*0.4); // aggancia a bunker sis
            }

        if(response.progress > calcolaPercentualeTempo(3,3)-0.02 && response.progress < calcolaPercentualeTempo(3,3)+0.02) {
                d3.select("#pesca").classed("anima",true);
            } else if(response.progress > calcolaPercentualeTempo(3,9)-0.02 && response.progress < calcolaPercentualeTempo(3,9)+0.02) {
                d3.select("#pesca").classed("anima",true);
            } else d3.select("#pesca").classed("anima",false);   



            break;
        case 4:
            zoom();
            testi.mostraTestoTraTempi(response,15,19,5);


            break;
        case 5:
            zoom();
            testi.mostraTestoTraTempi(response,0,14,5);


            // a 5,12 - legato a nessuno: bicchiere
            posizionaOggetto("bicchiere",5,12,3,6,-translation,0); // RICORDA DI ALZARE
            posizionaOggetto("campanello1",5,13,3,6,-translation,0); // RICORDA DI ALZARE


             // VALIGIE - DA 5,5 A 6,10
             mostraDopoTempo("valigia1",5,5,response);
             mostraDopoTempo("valigia2",5,5,response);
             mostraDopoTempo("valigia3",5,5,response);
             mostraDopoTempo("valigia4",5,5,response);

             animations.muoviOggetto("valigia1", response, 1,translation,-30,0);
             animations.muoviOggetto("valigia2", response, 7,translation,-30,0);
             animations.muoviOggetto("valigia3", response, 11,translation,-30,0);
             animations.muoviOggetto("valigia4", response, 2,translation,-30,0);

             // A TUTTI I PARKS (1,7,11,2)

             mostraTraProgressN("auto",calcolaPercentualeTempo(5,6),1,response);  
            animations.muoviOggetto("auto", response, 11 ,translation,-dim*0.75,dim*0.2); 

             // AUTO




             nascondi(document.getElementById("lotta"));



            break;
        case 6:
            zoom();
            testi.mostraTestoTraTempi(response,1,10,6);
            testi.mostraEtichettaTraTempi(response,5,15,2);


            posizionaOggetto("bicchiere",5,12,3,6,-translation-animations.stabilisciAmpiezzaLinea(6),0); // RICORDA DI ALZARE
            posizionaOggetto("campanello1",5,13,3,6,-translation-animations.stabilisciAmpiezzaLinea(6),0); // RICORDA DI ALZARE
            posizionaOggetto("campanello2",6,10,3,6,-translation,0); // RICORDA DI ALZARE
            posizionaOggetto("lotta",6,4,3,6,-translation,0); // RICORDA DI ALZARE


                 // VALIGIE - DA 5,5 A 6,10

                 mostraPrimaTempo("valigia1",6,10,response);
                 mostraPrimaTempo("valigia2",6,10,response);
                 mostraPrimaTempo("valigia3",6,10,response);
                 mostraPrimaTempo("valigia4",6,10,response);

                 animations.muoviOggetto("valigia1", response, 1,translation,-30,0);
                 animations.muoviOggetto("valigia2", response, 7,translation,-30,0);
                 animations.muoviOggetto("valigia3", response, 11,translation,-30,0);
                 animations.muoviOggetto("valigia4", response, 2,translation,-30,0);
    
                 // A TUTTI I PARKS (1,7,11,2)
// AUTO 
                 mostraTraProgressN("auto",0,calcolaPercentualeTempo(6,10),response);  
                 animations.muoviOggetto("auto", response, 11 ,translation,-dim*0.75,dim*0.2); 
                 if (response.direction=="up") nascondi(document.getElementById("pietra"));

    

            break;

        case 7:
            testi.mostraTestoTraTempi(response,1,10,7);
            piove(response.progress);
            posizionaOggetto("campanello2",6,10,3,6,-translation-animations.stabilisciAmpiezzaLinea(7),0); // RICORDA DI ALZARE
            posizionaOggetto("lotta",6,4,3,6,-translation-animations.stabilisciAmpiezzaLinea(7),0); // RICORDA DI ALZARE
       //     mostraDopoTempo("faccia12",7,16,response);

       // PIETRA
            mostraTraProgressN("pietra",calcolaPercentualeTempo(7,18),calcolaPercentualeTempo(7,19),response);         
                animations.muoviOggetto("pietra", response, 4 ,translation,dim*0.7,dim*0.2); // aggancia a kevin
    


            break;
        case 8: 
        zoom();
        testi.mostraTestiTraTempi(response,1,10,8,17,19,9);

// PIETRA
mostraTraProgressN("pietra",calcolaPercentualeTempo(8,0),calcolaPercentualeTempo(8,19),response);
if (response.progress <= calcolaPercentualeTempo(8,13)) {              
    animations.muoviOggetto("pietra", response, 4 ,translation,dim*0.7,dim*0.2);
} else {                                                                // altrimenti
    animations.muoviOggetto("pietra", response, 10,translation,dim*0.7,dim*0.2); 
};

if(response.progress > calcolaPercentualeTempo(8,13)-0.01 && response.progress < calcolaPercentualeTempo(8,13)+0.02) {
    d3.select("#pietra").classed("anima",true);
} else d3.select("#pietra").classed("anima",false);   


            break;
        case 9:
            zoom();
            testi.mostraTestoTraTempi(response,0,14,9);
            


            // coltello al t14 legato a bunkerbro(10) 
            mostraTraPunti("coltello-bunkerbro",10,1,2,response);
            animations.muoviOggetto("coltello-bunkerbro", response, 10,translation,-20,0); //capire se farlo sparire o no 
        
            // coltello jessica
            mostraTraPunti("coltello-jessica",3,2,3,response);
            animations.muoviOggetto("coltello-jessica", response, 3,translation,-20,0); //capire se farlo sparire o no 
       
              // coltello jessica
            mostraTraPunti("coltello-papaparks",11,1,2,response);
            animations.muoviOggetto("coltello-papaparks", response, 11,translation,-20,0); //capire se farlo sparire o no 

         
            // torta. jessica(3) da 9,3 a 9,13

            mostraTraPunti("torta",3,1,2,response);
            animations.muoviOggetto("torta", response, 3,translation,dim*0.8,0); //capire se farlo sparire o no 

// PIETRA
mostraTraProgressN("pietra",calcolaPercentualeTempo(9,0),calcolaPercentualeTempo(9,2),response);
if (response.progress <= calcolaPercentualeTempo(9,0)){                                                                // altrimenti
    animations.muoviOggetto("pietra", response, 10,translation,dim*0.7,dim*0.2); 
} else {
    animations.muoviOggetto("pietra", response, 4,translation,dim*0.7,dim*0.2);
}

if(response.progress > calcolaPercentualeTempo(9,0)-0.02 && response.progress < calcolaPercentualeTempo(9,0)+0.02) {
    d3.select("#pietra").classed("anima",true);
} else d3.select("#pietra").classed("anima",false);  

animations.bloccaElemento("pietra",4,9,1,response,-dim*0.5,dim*0.2);


            break;
        case 10:
            zoom();
            testi.mostraTestoTraTempi(response,1,10,10);

            animations.gestioneLampada(response,translation);

            break;
        case 11:
            testi.mostraTestoTraTempi(response,1,10,11);
            animations.gestioneLampada(response,translation);
            finale.mostraFinaleOpacita(response,0.5,0.99);
            break;
        default:
            break;
    }

}
}


function handleStepEnter(response) {
    switch (response.index) {

   
        case 0:
            document.getElementById("container").classList.add("mostra");
            document.getElementById("introSVG").style.visibility="visible";

            break;
        case 1:

            break;
        case 2:

             
            break;
        case 3:


            break;
        case 4:
            if(response.direction=="up") pioggia.disattivaAnimazione();
           
            break;
        case 5:
            if(response.direction=="down") pioggia.attivaAnimazione();
            pioggia.nascondiPioggia();


            break;
        case 6:
            pioggia.mostraPioggia();

            break;
        case 7:
            pioggia.mostraPioggia();

            break;
        case 8: 
        pioggia.nascondiPioggia();

            break;
        case 9:
            if(response.direction=="down") pioggia.disattivaAnimazione();
            if(response.direction=="up")  {
                pioggia.attivaAnimazione();
                animations.rimuoviLampada();
            }
            if (response.direction === "up") finale.togliFinale();

            break;
        case 10:
            d3.select("#parent").classed("blur",false);
            if(response.direction == "down") animations.generaLampada();
            if(response.direction=="up") finale.togliFinale();

            break;
        case 11:
            if(response.direction=="down") finale.aggiungiFinale();
            d3.select("#parent").classed("blur",true);
            finale.nascondiTestoFinale();
            break;
        case 12:
            if(response.direction==="down") finale.avviaFinale();
            break;
        case 13:
            finale.mostraCredits();
            break;
        default:
            break;
    }
}




function handleStepExit(response) {

    switch (response.index) {

   
        case 0:
         //   if(response.direction === "up") document.getElementById("container").classList.remove("mostra");
            if(response.direction==="down") document.getElementById("introSVG").style.visibility="hidden";

            break;
        case 13:
            finale.nascondiCredits();
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
        .onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit);

    window.addEventListener("resize", handleResize);

}

// kick things off
init();


// FUNZIONI

function mostra(obj) {
 //   obj.style.opacity = 100;
 obj.classList.remove("nascondi");
 obj.classList.add("mostra");
}


function nascondi(obj) {
  //  obj.style.opacity = 0;
  obj.classList.remove("mostra");
  obj.classList.add("nascondi");


}

function mostraTraProgress(id, p0, p1, response) {
    let obj = document.getElementById(id);
   
    if ((response.progress*100) >= p0 && (response.progress*100) < p1) {
        mostra(obj);
    } else {
        nascondi(obj);
    }
}

function mostraTraProgressN(id, p0, p1, response) {
    let obj = document.getElementById(id);


    if ((response.progress) >= p0 && (response.progress) < p1) {
        mostra(obj);
    } else {
        nascondi(obj);
    }
}

function mostraTraPunti(id, idPersonaggio, tempo0, tempo1, response) {
    //TEMPO SONO IL NUMERO ORDINALE DI PUNTI DELLA SCENA!!
    let puntiScena = animations.datasetPerScena(animations.ottieniPuntiP(parseInt(idPersonaggio)),response.index);
    let p0 = puntiScena[tempo0].progresso;
    let p1 = puntiScena[tempo1].progresso;

    mostraTraProgress(id,p0,p1,response);
}


function mostraDopoSoglia(id, response, scena, soglia) {

    let oggetto = document.getElementById(id);
 
    if (response.progress > soglia || response.index > scena) {
       // oggetto.style.opacity = 100;
       mostra(oggetto);
        } 
    
    if ((response.index < scena)||(response.progress <= soglia && response.index == scena)) {
     //   oggetto.style.opacity = 0;
     nascondi(oggetto);
            } 

    }

    function mostraPrimaSoglia(id, response, scena, soglia) {

        let oggetto = document.getElementById(id);
   
        if (response.progress <= soglia || response.index < scena) {
         //   oggetto.style.opacity = 100;
         mostra(oggetto);
            } 
        
        if (response.progress >= soglia && response.index >= scena) {
          //  oggetto.style.opacity = 0;
          nascondi(oggetto);
                } 

        }

function mostraDopoPunto(id, idPersonaggio, scena, tempo, response) {
    let puntiScena = animations.datasetPerScena(animations.ottieniPuntiP(parseInt(idPersonaggio)),scena);
    let p = puntiScena[tempo].progresso/100;

    mostraDopoSoglia(id, response, scena, p);
}

function calcolaPercentualeTempo(scena, tempo) {
    return (animations.calcolaScalaX(scena)(tempo)-animations.xMaschera)/(animations.stabilisciAmpiezzaLinea(scena));
}

function mostraDopoTempo(id, scena, tempo, response) {
    
    let p = calcolaPercentualeTempo(scena,tempo);
    mostraDopoSoglia(id, response, scena, p);
}

function mostraPrimaTempo(id, scena, tempo, response) {
    
    let p = calcolaPercentualeTempo(scena,tempo);
    mostraPrimaSoglia(id, response, scena, p);
}



// nasconde linea e scena intera e fa sparire faccia
function nascondiLineaTutta(personaggio, scena, nascondiFaccia) {
    let idLinea = "linea_"+scena+"_P"+personaggio;
    let linea = document.getElementById(idLinea);

     nascondi(linea);
    if (nascondiFaccia) {
        let idFaccia = "gruppo-faccia"+personaggio;
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

function mostraFaccia(personaggio) {
    let id = "gruppo-faccia"+personaggio;
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
    animations.bloccaElemento("gruppo-faccia"+idPersonaggio, idPersonaggio, scena, indiceTempo, response, 0, 0);
}

function inizioLinea(idPersonaggio, scena, indiceTempo, response) {
    if (response.index == scena) {
        animations.nascondiLineaInizio(idPersonaggio, scena, indiceTempo);
    }
    if (response.index < scena) {
        nascondiLineaTutta(idPersonaggio, response.index, false);
    }
}



function morte(idPersonaggio,scena,indiceTempo,response) {
    fineLinea(idPersonaggio,scena, indiceTempo, response);
    if (response.index > scena || (response.index == scena && response.progress >= animations.ottieniPercX(idPersonaggio,scena,indiceTempo))) {// blocca solo dopo aver superato il punto
        animations.cambiaFaccia(idPersonaggio,true);
    }  else {
        animations.cambiaFaccia(idPersonaggio,false);
    } 
}

function piove(progresso) {
    pioggia.calcolaAcqua(progresso);
}

function posizionaOggetto(id,scena,tempo,livello,sottolivello, deltaX, deltaY) {
    let pt = {};
    pt.x = animations.calcolaScalaX(scena)(tempo);
    pt.y = animations.calcolaY(livello,sottolivello);
    pt.x += deltaX;
    pt.y += deltaY;
    
    let obj = document.getElementById(id);
    obj.style.webkitTransform = 'translate3d('+pt.x+'px,'+pt.y+'px, 0)'; 

}



