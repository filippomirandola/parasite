import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as animations from "./d3-animations.js"
import * as scrollCode from "./scroll_code.js"

export var altezzaPagina = window.innerHeight;
export var larghezzaPagina = window.innerWidth;
const percentualeAltezzaStanze = 0.23;
const unit = altezzaPagina*percentualeAltezzaStanze; //unità di altezza
const k = 3040/858;


let containerTesti = document.getElementById("chart").appendChild(document.createElement("div"));
containerTesti.setAttribute("id","testi");

containerTesti.innerHTML = "";
containerTesti.classList.add("nascondiTxt");
let etichette = ["KIMS' HOUSE", "PARKS' HOUSE","BUNKER"];



let containerEtichette= document.getElementById("chart").appendChild(document.createElement("div"));
containerEtichette.setAttribute("id","etichette");

const testi=[];
testi[0] = "The Kims struggle in a sub-basement apartment, folding pizza boxes to make ends meet. Ki Woo's friend, Min, arrives with a gift for the family.";
testi[1] = "Ki Woo, the son, gets the chance to tutor the daughter of the wealthy Park family, thanks to Min";
testi[2] = "The infiltration begins: Ki Woo recommends his sister Ki Jung as an art therapist for Da Song.";
testi[3] = "The Parks’ chauffeur gets fired after the panty-scandal organized by Ki Jung. Mr. Kim gets employed.";
testi[4] = "The Kims cause an allergic reaction to the housekeeper by using peach fuzz. She gets replaced by Chung Sook, Kims' mom.";
testi[5] = "Da Song notices the Kims have the same smell.<br/><br/>While the Parks leave for a camping trip, the Kims revel in their luxurious house.<br/><br/>Suddenly, the old housekeeper rings the doorbell.";
testi[6] = "The Kims discover the underground bunker and who’s living in there.<br/><br/>A big fight follows and the Parks suddenly come back home, because of a storm.";
testi[7] = "The former housekeeper dies. Mrs. Kim serves dinner to the Parks, while her family members hide under the coffee table.<br/><br/>They manage to escape, coming back to the Kim’s house. They discover their home is flooded and Ki Woo takes the stone with him."
testi[8] = "While the Parks are organizing Da Song’s birthday party, tension escalates in the bunker, leading to a violent confrontation.<br/><br/>Geun Sae hits Ki Woo in the head, by using the stone.";
testi[9] = "Then the violent aftermath begins: Geun Se kills Ki Jung, and Chung Sook mortally wounds him. Da Song faints. Ki Taek kills Dong Ik.";
testi[10] = "Ki Taek escapes and hides himself in the bunker.<br/><br/>Ki Woo, some days after, will see the message that his father is communicating using the morse code.";
testi[11] = "Ki Woo dreams about becoming rich enough to buy the Parks’ former house and then setting his father free.";


function mostraTesto(){
    containerTesti.classList.add("mostraTxt");
    containerTesti.classList.remove("nascondiTxt");
}

function nascondiTesto(){
    containerTesti.classList.remove("mostraTxt");
    containerTesti.classList.add("nascondiTxt");
}



export function mostraTestoTraProgress(p0,p1,response){

    if ((response.progress*100) >= p0 && (response.progress*100) < p1) {
        containerTesti.classList.add("mostraTxt");
        containerTesti.classList.remove("nascondiTxt");

    } else {
        containerTesti.classList.add("nascondiTxt");
        containerTesti.classList.remove("mostraTxt");

    }}



export function mostraTestiTraTempi(response,t0,t1,idTxt1,t2,t3,idTxt2){
    let mostra = false;
    let testo = "";
        let p0 = animations.calcolaPercentualeTempo(response.index,t0);
        let p1 = animations.calcolaPercentualeTempo(response.index,t1);
        let p2 = animations.calcolaPercentualeTempo(response.index,t2);
        let p3 = animations.calcolaPercentualeTempo(response.index,t3);

        if (response.progress < p0) {
            mostra = false;
        } else if (response.progress >= p0 && response.progress < p1){
                mostra = true;
                containerTesti.innerHTML = testi[idTxt1];
            }  else if (response.progress >= p1 && response.progress < p2) {
                    mostra = false;
            }   else if (response.progress >= p2 && response.progress < p3){
                mostra = true;
                containerTesti.innerHTML = testi[idTxt2];
            } else if(response.progress >= p3) {
                mostra = false;
            }
        if (mostra) mostraTesto();
        else nascondiTesto();
} 


export function mostraTestoTraTempi(response,t0,t1,idTxt){
    let mostra = false;
    let testo = "";
    let p0 = animations.calcolaPercentualeTempo(response.index,t0);
    let p1 = animations.calcolaPercentualeTempo(response.index,t1);
  
    if (response.progress < p0 || response.progress >= p1) {
        mostra = false;
    } else if (response.progress >= p0 && response.progress < p1){
            mostra = true;
            containerTesti.innerHTML = testi[idTxt];
        }

    if (mostra) mostraTesto();
    else nascondiTesto();
} 

function mostraEtichetta(){
    containerEtichette.classList.add("mostraTxt");
    containerEtichette.classList.remove("nascondiTxt");
}

function nascondiEtichetta(){
    containerEtichette.classList.remove("mostraTxt");
    containerEtichette.classList.add("nascondiTxt");
}

export function mostraEtichettaTraTempi(response,t0,t1,idTxt){

    if(idTxt==2) {
        containerEtichette.setAttribute("style","margin-top: "+(altezzaPagina-unit)+"px");
    } else containerEtichette.setAttribute("style","");

    let mostra = false;
    let testo = "";
    let p0 = animations.calcolaPercentualeTempo(response.index,t0);
    let p1 = animations.calcolaPercentualeTempo(response.index,t1);
  
    if (response.progress < p0 || response.progress >= p1) {
        mostra = false;
    } else if (response.progress >= p0 && response.progress < p1){
            mostra = true;
            containerEtichette.innerHTML = etichette[idTxt];
        }

    if (mostra) mostraEtichetta();
    else nascondiEtichetta();

} 




containerEtichette.innerHTML = "";
containerEtichette.classList.add("nascondiTxt");

