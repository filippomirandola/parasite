import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import * as scrollCode from "./scroll_code.js"

    // TYPEWRITER

    var speedPunto = 70;
    var src;

     // punto = 50 luce 50 buio
     // linea = 150 luce 50 buio
     // spazio = 100 buio
     // \n = 500 buio

    function mettiLuce(luce) {

        document.getElementById("morsefinal").setAttribute("src","assets/finale/finale-on.png");
        //mette il buio dopo il tempo luce
        

    }

    function mettiBuio() {
        document.getElementById("morsefinal").setAttribute("src","assets/finale/finale-off-scuro.png");
    }

    function cambiaLuce(c) {
        let luce, buio;  
        if (c === "·") {
            luce = speedPunto;
            buio = speedPunto;
        } else {
            if (c === "—") {
                luce = 3*speedPunto;
                buio = speedPunto;
            } else {
                if (c === " ") {
                    luce = 0;
                    buio = 2*speedPunto; //50 già inclusi in quello precedente
                } 
            }
        }
        if (c === "P") {
            luce = 0;
            buio = 5*speedPunto;
        }
        
        
        if(luce != 0) mettiLuce(luce);
        setTimeout(function() {
            mettiBuio();
        }, luce);
        return luce+buio;
    }

    function initTypewriter() {
        document.getElementById("testo").innerHTML="";
        var i = 0;
        var txt = '··· · ·P—·—— ——— ··—P··· ——— ——— —·P— ···· · —· '; 
           
    
            function typeWriter() {
                if (i < txt.length) {
                    if (txt.charAt(i) === "P") {
                        document.getElementById("testo").innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    }
                    else {
                        document.getElementById("testo").innerHTML += "&ThinSpace;"+txt.charAt(i);
                    }
                
                    let speed = cambiaLuce(txt.charAt(i));
                    i++;
                    setTimeout(function(){
                        typeWriter();
                    }, speed);
                }

            }
        typeWriter();
    }





    //  FINE TYPEWRITER Chiamata alla funzione typeWriter


     // INIZIO DECODE

     function decodeText(){
        var text = document.getElementById('decode-text');

        var state = [];
        for(var i = 0, j = text.children.length; i < j; i++ ){
            text.children[i].classList.remove('state-1','state-2','state-3');
            state[i] = i;
        }

        // shuffle the array to get new sequences each time
        var shuffled = shuffle(state);
    
        for(var i = 0, j = shuffled.length; i < j; i++ ){
            var child = text.children[shuffled[i]];
            var classes = child.classList;

            // fire the first one at random times
            var state1Time = Math.round( Math.random() * (2000 - 300) ) + 50;
            if(classes.contains('text-animation')){ 
                setTimeout(firstStages.bind(null, child), state1Time);
            }
        }
    }

    // send the node for later .state changes
    function firstStages(child){
        if( child.classList.contains('state-2') ){   
            child.classList.add('state-3');
        } else if( child.classList.contains('state-1') ){
            child.classList.add('state-2')
        } else if( !child.classList.contains('state-1') ){
            child.classList.add('state-1');
            setTimeout(secondStages.bind(null, child), 100);
        }    
    }
    function secondStages(child){
        if( child.classList.contains('state-1') ){
            child.classList.add('state-2')
            setTimeout(thirdStages.bind(null, child), 100);
        } 
        else if( !child.classList.contains('state-1') )
        {
            child.classList.add('state-1')
        }
    }
    function thirdStages(child){
        if( child.classList.contains('state-2') ){
            child.classList.add('state-3')
        }
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    // FINE DECODE




let parent = d3.select("#container-finale");





// FUNZIONI VARIE

// imposta opacità da progresso
export function mostraFinaleOpacita(response,p0,p1) {
    let calcolaOpacita = d3.scaleLinear().domain([p0,p1]).range([0,1]);
    let opacita;
    if (response.progress >= p0) {
        if (response.progress <= p1) {
            opacita = calcolaOpacita(response.progress);
        }
        else opacita = 1
    } else opacita = 0;
    document.getElementById("container-finale").style.opacity = opacita;
}

export function nascondiTestoFinale() {
    d3.select("#testo").classed("visibile",false);
    d3.select("#decode-text").classed("visibile",false);
}

export function mostraTestoFinale() {
    d3.select("#testo").classed("visibile",true);
    d3.select("#decode-text").classed("visibile",true);
}




export function avviaFinale(){
    d3.select("#decode-text").classed("visibile",false); 
    d3.select("#testo").classed("visibile",true); 

    initTypewriter();
    setTimeout(function() {
      d3.select("#testo").classed("visibile",false);  // nascondi il testo Morse
       d3.select("#decode-text").classed("visibile",true);  // mostra il testo "see you soon then"
      decodeText(); //avvia il decode
    
    }, 10000)
}
export function mostraFinale() { 
    d3.select("#container-finale").classed("visibile",true);
    setTimeout(avviaFinale(),500);
}


export function nascondiFinale() {
    d3.select("#container-finale").classed("visibile",false);
}

export function togliFinale(){
    d3.select("#container-finale").classed("togli",true);
    d3.select("#container-finale").style("");

}

export function aggiungiFinale(){
    d3.select("#container-finale").classed("togli",false);
}


// CREDITS

export function mostraCredits() {
    d3.select("#container-finale").classed("blurred",true);
    d3.select("#credits").classed("visibile",true);
}

export function nascondiCredits() {
    d3.select("#container-finale").classed("blurred",false);
    d3.select("#credits").classed("visibile",false);
}

