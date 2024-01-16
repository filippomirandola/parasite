import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as animations from "./d3-animations.js"
import * as scrollCode from "./scroll_code.js"

export function creaFinale() {

    // CREAZIONE HTML

    var txtF = "SEE YOU SOON THEN";
    let creaParent = document.getElementById("chart").appendChild(document.createElement("div"));
    creaParent.setAttribute("id","container-finale");


    let parent = d3.select("#container-finale");

    let immagine = parent.append("img")
        .attr("id","morsefinal")
        .attr("src","assets/finale/sfondo-final-morse.png")
        .attr("alt","impossibile caricare l'immagine");

    let container = parent.append("div")
        .attr("id","testo-container");

    let paragrafo = container.append("p")
        .attr("id","testo");

    let decodeTextDiv = container.append("div")
        .attr("class","decode-text")
        .attr("id","decode-text");

    let c;

    
    for (let j = 0; j < txtF.length; j++) {
        c = txtF[j];
        if (c !== " ") {
            let textAnimation = decodeTextDiv.append("div")
                .attr("class","text-animation");
            textAnimation.html(c);
        } else {
            decodeTextDiv.append("div")
                .attr("class","space");
        }
    }


   

   
}


    // TYPEWRITER

    function initTypewriter() {
        document.getElementById("testo").innerHTML="";
        var i = 0;
        var txt = '... . . \n-.-- --- ..- \n... --- --- -.\n- .... . -. '; 
            var speed = 150;
    
            function typeWriter() {
                if (i < txt.length) {
                    document.getElementById("testo").innerHTML += txt.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                }
            }
        typeWriter();
    }





    //  FINE TYPEWRITER Chiamata alla funzione typeWriter


     // INIZIO DECODE

     function decodeText(){
        var text = document.getElementById('decode-text');
        console.log(text.children.length);
        // debug with
        // console.log(text, text.children.length);

        // assign the placeholder array its places
        var state = [];
        for(var i = 0, j = text.children.length; i < j; i++ ){
            text.children[i].classList.remove('state-1','state-2','state-3');
            state[i] = i;
        }

        // shuffle the array to get new sequences each time
        var shuffled = shuffle(state);
    
        for(var i = 0, j = shuffled.length; i < j; i++ ){
            var child = text.children[shuffled[i]];
            console.log(child);
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





// setInterval(function(){ decodeText(); }, 10000);

let parent = d3.select("#container-finale");

creaFinale();




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
       //console.log("opacita "+opacita);
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
    
    }, 9500)
}
export function mostraFinale() { // nonUsata
    d3.select("#container-finale").classed("visibile",true);
    setTimeout(avviaFinale(),500);
}



// 
