import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as animations from "./d3-animations.js";
import * as pioggia from "./pioggia.js";
import * as testi from "./testi.js";


var main = d3.select("main");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");
var acqua = document.getElementById("acqua-parent");
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

    animations.resize();


    figure
        .style("height", figureHeight + "px")
        .style("top", "0px");

    // 3. tell scrollama to update new element dimensions
    scroller.resize();
}


// scrollama event handlers

function handleProgress(response) {
    nascondiLineaTutta(12,response.index,true);
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

        // APPLICO TRASLAZIONE A INTRO
        var introSVG = d3.select("#introSVG");
        // introSVG.style("transform", "scale("+0.2+") translate(" + -translation + "px "+ animations.getCoordinateLivelli(1).min +"px)");
        introSVG.style("transform", "translateX(" + -translation*3 + "px)");


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
    morte(9,7,2,response); // bunkersis
    morte(3,9,3,response); // jessica
    morte(11,9,2,response); // papà parks
    morte(10,9,2,response); // bunkerbro
    mostraDopoTempo("campanello1",5,14,response);
    mostraDopoTempo("campanello2",6,10,response);

    mostraDopoTempo("bicchiere",5,12,response);
    mostraDopoTempo("lotta",6,4,response);

    fineLinea(1,9,2, response); 
    fineLinea(2,9,2, response); 
    fineLinea(7,9,2, response);
    fineLinea(6,11,2, response); 
    fineLinea(4,11,2, response); 
    fineLinea(8,11,1, response); 


 

    

    if (response.index <=4) {
        fineLinea(9,3,2, response); // FINE bunker sis
    }

    if (response.index > 5) {
        mostraLineaTutta(9,5); // RICOMINCIA bunker sis
        mostraDopoTempo("linea_5_P9",5,14,response);
    }

mostraTestoTraProgress(10,60,response);

    switch (response.index) {

   
        case 0:
            zoom();


            if (response.progress < 0.1) {
                if (response.direction === "up") {
                    document.getElementById("container").classList.remove("mostra");
                }
                else                     document.getElementById("container").classList.add("mostra");

            }

            //A SCATTI animations.impostaZoom(3,3);
            if (response.progress <= 0.9) {
                mostra(document.getElementById("introSVG"));
            } else {
                nascondi(document.getElementById("introSVG"));

            }

           // mostra(document.getElementById("testo0"));

           /*  if (response.direction === "up" && response.progress <0.9) {
                mostra(document.getElementById("introSVG"));
            }  */





            // PIETRA
            mostraTraPunti("pietra",4,0,1,response);
            if (response.progress <= animations.ottieniProgresso(5,response.index,2)) {              // prima del primo vertice di min
                animations.muoviOggetto("pietra", response, 5 ,translation,-15,15); // aggancia a min
            } else {                                                                // altrimenti
                animations.muoviOggetto("pietra", response, 4,translation,-15,15);  // aggancia a kevin
            }


            


            break;
        case 1:
            zoom();


           //  mostraDopoSoglia("intro", response, 0.5);
         //   
            //mostraTraProgress("mutande",0.5, 0.7, response);
         //   mostraTraPunti("mutande",12,1,2,response);

            // MOS
          
            break;
        case 2:
            zoom();


             mostraTraPunti("auto",3,6,8,response);
           // AUTO va al padreParks dal t12 al t13

            if (response.progress <= animations.ottieniProgresso(3,response.index,7)) {  
                animations.muoviOggetto("auto", response, 11 ,translation,-15,15); // aggancia a jessica
               // aggancia a papà parks
            }
            else    animations.muoviOggetto("auto", response, 3,translation,-15,15);
            // a Jessica dal 13 al 16


           // MUTANDE JESSICA(3) s2 t16 le 
           mostraTraPunti("mutande",3,7,9,response);
           animations.muoviOggetto("mutande", response, 3 ,translation,-15,-15); // aggancia a jessica (PERCHé fa così???)

             
            break;

        case 3:
            zoom();


        


      // AUTO va al padreKim dal t3 al t17

            mostraTraPunti("auto",6,1,4,response);
            animations.muoviOggetto("auto", response, 6,translation,-15,15);
            
            // PESCA da 3,3 fino a 3,11 con padrekim(6) 
            // da 3,11 a 3,12 a bunkersis(9)
            if (response.progress < animations.ottieniProgresso(6,response.index,2)) { 
                mostraDopoPunto("pesca",6,1,2,response);
                animations.muoviOggetto("pesca", response, 6,translation,-15,15);

            }
            else {
                mostraTraPunti("pesca",9,0,2,response); // da mantenere mostrata anche doopo
                animations.muoviOggetto("pesca", response, 9,translation,-15,15);

            }

            animations.bloccaElemento("pesca",9,3,2,response,-15,15);




            break;
        case 4:
            zoom();

            break;
        case 5:
            zoom();

            // a 5,12 - legato a nessuno: bicchiere
            posizionaOggetto("bicchiere",5,12,3,6,-translation,0); // RICORDA DI ALZARE
            posizionaOggetto("campanello1",5,14,3,6,-translation,0); // RICORDA DI ALZARE


             // VALIGIE - DA 5,5 A 6,10
             mostraDopoTempo("valigia1",5,5,response);
             mostraDopoTempo("valigia2",5,5,response);
             mostraDopoTempo("valigia3",5,5,response);
             mostraDopoTempo("valigia4",5,5,response);
   /*           mostraTraPunti("valigia1",1,1,3,response);
             mostraTraPunti("valigia2",1,1,3,response);
             mostraTraPunti("valigia3",1,1,3,response);
             mostraTraPunti("valigia4",1,1,3,response); */

             animations.muoviOggetto("valigia1", response, 1,translation,-30,0);
             animations.muoviOggetto("valigia2", response, 7,translation,-30,0);
             animations.muoviOggetto("valigia3", response, 11,translation,-30,0);
             animations.muoviOggetto("valigia4", response, 2,translation,-30,0);

             // A TUTTI I PARKS (1,7,11,2)



             // AUTO???
             nascondi(document.getElementById("lotta"));



            break;
        case 6:
            zoom();

            console.log(translation+" "+animations.stabilisciAmpiezzaLinea(6));
            console.log(-translation+animations.stabilisciAmpiezzaLinea(5));   // CORREGGERE
            posizionaOggetto("bicchiere",5,12,3,6,-translation-animations.stabilisciAmpiezzaLinea(6),0); // RICORDA DI ALZARE
            posizionaOggetto("campanello1",5,14,3,6,-translation-animations.stabilisciAmpiezzaLinea(6),0); // RICORDA DI ALZARE
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
    

            break;
        case 7:
            piove(response.progress);
            posizionaOggetto("campanello2",6,10,3,6,-translation-animations.stabilisciAmpiezzaLinea(7),0); // RICORDA DI ALZARE
            posizionaOggetto("lotta",6,4,3,6,-translation-animations.stabilisciAmpiezzaLinea(7),0); // RICORDA DI ALZARE


            break;
        case 8: 
        zoom();

            break;
        case 9:
            zoom();

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
            animations.muoviOggetto("torta", response, 3,translation,-15,15); //capire se farlo sparire o no 

            break;
        case 10:
            zoom();

            animations.gestioneLampada(response,translation);

            break;
        case 11:
            animations.gestioneLampada(response,translation);

            break;
        default:
            break;
    }
}


function handleStepEnter(response) {
    setTesto(response);
    console.log("scena "+response.index);
    switch (response.index) {

   
        case 0:
        //    mostra(document.getElementById("introSVG"));
            document.getElementById("container").classList.add("mostra");

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

            break;
        case 10:
            document.getElementById("parent").classList.remove("blur");
            if(response.direction == "down") animations.generaLampada();

            break;
        case 11:
            document.getElementById("parent").classList.add("blur");

            break;
        default:
            break;
    }
}




function handleStepExit(response) {

    switch (response.index) {

   
        case 0:
         //   if(response.direction === "up") document.getElementById("container").classList.remove("mostra");

            break;
        case 1:
  

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
        case 8: 
            break;
        case 9:
            break;
        case 10:

            break;
        case 11:
            d3.select("#parent").classed("blur",false);
            d3.select("#parent").classed("noblur",true);

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
    obj.style.opacity = 100;
}


function nascondi(obj) {
    obj.style.opacity = 0;
}

function mostraTraProgress(id, p0, p1, response) {
    let obj = document.getElementById(id);
    console.log("mostra p0 "+p0);
    console.log("mostra p1 "+p1);
    console.log("mostra prog "+response.progress);

    if ((response.progress*100) >= p0 && (response.progress*100) < p1) {
        console.log("mostra in "+id);
        mostra(obj);
    } else {
        nascondi(obj);
    }
}

function mostraTraPunti(id, idPersonaggio, tempo0, tempo1, response) {
    console.log("mostra "+id+" scena "+response.index+" tempo0 "+tempo0+" tempo1 "+tempo1);
    //TEMPO SONO IL NUMERO ORDINALE DI PUNTI DELLA SCENA!!
    let puntiScena = animations.datasetPerScena(animations.ottieniPuntiP(parseInt(idPersonaggio)),response.index);
 //   console.log(puntiScena);
    let p0 = puntiScena[tempo0].progresso;
    let p1 = puntiScena[tempo1].progresso;

    mostraTraProgress(id,p0,p1,response);
}


function mostraDopoSoglia(id, response, scena, soglia) {

    let oggetto = document.getElementById(id);
   /*  if (response.index < index) {
        oggetto.style.visibility = "hidden";
    } */

    if (response.progress >= soglia || response.index > scena) {
        oggetto.style.opacity = 100;
        } 
    
    if (response.progress <= soglia && response.index <= scena) {
        oggetto.style.opacity = 0;
            } 


    /* if (response.index > index) {
                oggetto.style.visibility = "visible";
            } */
    }

    function mostraPrimaSoglia(id, response, scena, soglia) {

        let oggetto = document.getElementById(id);
       /*  if (response.index < index) {
            oggetto.style.visibility = "hidden";
        } */
    
        if (response.progress <= soglia || response.index < scena) {
            oggetto.style.opacity = 100;
            } 
        
        if (response.progress >= soglia && response.index >= scena) {
            oggetto.style.opacity = 0;
                } 
    
    
        /* if (response.index > index) {
                    oggetto.style.visibility = "visible";
                } */
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
    console.log("p obiettivo "+p+" p attuale "+response.progress);
    mostraDopoSoglia(id, response, scena, p);
}

function mostraPrimaTempo(id, scena, tempo, response) {
    
    let p = calcolaPercentualeTempo(scena,tempo);
    console.log("p obiettivo "+p+" p attuale "+response.progress);
    mostraPrimaSoglia(id, response, scena, p);
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




let containerTesti = document.getElementById("chart").appendChild(document.createElement("div"));
containerTesti.setAttribute("id","testi");

containerTesti.innerHTML = "";
containerTesti.classList.add("nascondiTxt");


function setTesto(response) {
    console.log("in testo "+response.index);
    switch (response.index) {
        case 0:
            containerTesti.innerHTML= "The Kims struggle in a sub-basement apartment, folding pizza boxes to make ends meet.";
            break;
        case 1:
            containerTesti.innerHTML="Ki Woo, the son, manages to get the chance to tutor the daughter of the wealthy Park family, thanks to his friend.";
            break;
        case 2:
            containerTesti.innerHTML= "The infiltration begins: Ki Woo recommends his sister Ki Jeong as an art therapist for Da Song.";
            break;
        case 3:
            containerTesti.innerHTML="The Parks’ chauffeur gets fired after the panty-scandal. Mr. Kim gets employed.";
            break;
        case 4:
            containerTesti.innerHTML= "The Kims cause an allergic reaction to the housekeeper by using peach fuzz. She gets replaced by Chung Sook.";
            break;
        case 5:
            containerTesti.innerHTML="Da Song notices the Kims have the same smell.<br/><br/>While the Parks leave for a camping trip, the Kims revel in their luxurious house.<br/><br/>Suddenly, the old housekeeper rings the intercom.";
            break;
        case 6:
            containerTesti.innerHTML= "The Kims discover the underground bunker and who’s living in there.<br/><br/>A big fight follows and the Parks suddenly come back home, because of a storm.";
            break;
        case 7:
            containerTesti.innerHTML="The former housekeeper dies. Mrs. Kim serves dinner to the Parks, while her family members hide under the coffee table.<br/><br/>They manage to escape, coming back to the Kim’s house. Ki Woo, during the flood, takes the stone with him.";
            break;
        case 8:
            containerTesti.innerHTML= "While the Parks are organizing Da Song’s Birthday Party, tension escalates in the bunker, leading to a violent confrontation.<br/><br/>Geun Sae hits Ki Woo in the head, by using the stone.<br/><br/>The stone symbolizes privilege and ability to fulfill aspirations.<br/><br/>At the birthday party, Da Song recalls the traumatic memory correlated to his previous birthday.";
            break;
        case 9:
            containerTesti.innerHTML="Then the violent aftermath begins: Geun Sae attacks Ki Jeong, and Ki Woo mortally wounds him with the stone.";
            break;
        case 10:
            containerTesti.innerHTML= "Ki Taek escapes and hides himself in the bunker.<br/><br/>Ki Woo will come by the house several times, while his father communicates with him by using the morse code.";
            break;
        case 11:
            containerTesti.innerHTML="Several years go by.<br/><br/>Ki Woo dreams about becoming rich enough to buy the Parks’ former house and then setting his father free.";
            break;
        
        default: break;
    }
}

function mostraTestoTraProgress(p0,p1,response){

    if ((response.progress*100) >= p0 && (response.progress*100) < p1) {
        console.log("testo dentro");
        containerTesti.classList.add("mostraTxt");
        containerTesti.classList.remove("nascondiTxt");

    } else {
        containerTesti.classList.add("nascondiTxt");
        containerTesti.classList.remove("mostraTxt");

    }}