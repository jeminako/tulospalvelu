"use strict";  // pidä tämä ensimmäisenä rivinä

console.log(data);

window.addEventListener("load", alusta);

function alusta() {
    asetaOminaisuuksia();
    tarkistaData(data);
    listaaJoukkueet(data);
}
    
//Asetetaan EventListener buttonille
function asetaOminaisuuksia() {
    let button = document.getElementById("lisaa");
    button.addEventListener("click", tallennaPainettu);
    let nimiInput = document.getElementById("nimi");
    nimiInput.addEventListener("keyup", ilmoitus);
}

//Antaa ja poistaa nimen ilmoituksen
function ilmoitus() {
    let nimiInput = document.getElementById("nimi");
    nimiInput.setCustomValidity("");
    if (!nimiInput.checkValidity()) {
        nimiInput.setCustomValidity("Oltava vähintään kaksi merkkiä pitkä! (Välimerkkiä ei lasketa)");
        nimiInput.reportValidity();
        return;
    }
    else {
        nimiInput.setCustomValidity("");
        nimiInput.reportValidity();
    }
}

//Tarkistetaan, onko dataan tullut uusia leimaustapoja/sarjoja ja päivitetään ulkoasua 
function tarkistaData(data) {
    let tavat = document.getElementsByName("tapa");
    let vanhatTavat = [];
    for (let tapa of tavat) {
        vanhatTavat.push(tapa.value);
    }
    let leimaustavat = data[2].leimaustapa;
    for (let leimatapa of leimaustavat) {
        if (!(vanhatTavat.includes(leimatapa))) {
            let divLeimat = document.getElementById("leimavalinta");
            let label = document.createElement("label");
            let input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.setAttribute("id", leimatapa);
            input.setAttribute("name", "tapa");
            input.setAttribute("value", leimatapa);
            label.htmlFor = leimatapa;
            label.appendChild(document.createTextNode(leimatapa));
            divLeimat.appendChild(label);
            divLeimat.appendChild(input);
        }
    }
    let sarjaVaihtoehdot = document.getElementsByName("sarja");
    let vanhatSarjat = [];
    for (let sarja of sarjaVaihtoehdot) {
        vanhatSarjat.push(sarja.value);
    }
    let kilpailuSarjat = data[2].sarjat;
    let sarjaNimet = [];
    for (let kilpailuSarja of kilpailuSarjat) {
        sarjaNimet.push(kilpailuSarja.nimi);
    }
    for (let nimi of sarjaNimet) {
        if (!(vanhatSarjat.includes(nimi))) {
            let divSarjat = document.getElementById("sarjavalinta");
            let label = document.createElement("label");
            let input = document.createElement("input");
            input.setAttribute("type", "radio");
            input.setAttribute("id", nimi);
            input.setAttribute("name", "sarja");
            input.setAttribute("value", nimi);
            label.htmlFor = nimi;
            label.appendChild(document.createTextNode(nimi));
            divSarjat.appendChild(label);
            divSarjat.appendChild(input);
        }
    }
}

//Käsitellään Tallenna-painike
function tallennaPainettu(e) {
    e.preventDefault();
    let jnimi = document.getElementById("nimi");
    //Tarkistetaan, että nimi on uniikki
    let sarjat = data.map(rogaining => rogaining.sarjat).flat();
    for (let sarja of sarjat) {
        let joukkueet = sarja.joukkueet;
        for (let joukkue of joukkueet) {
            if (jnimi.value.trim() == joukkue.nimi.trim()) {
                jnimi.setCustomValidity("Oltava uniikki nimi!");
                jnimi.reportValidity();
                return;
            }
            else {
                jnimi.setCustomValidity("");
            }
        }
    }
    //Tarkistetaan, että ehdotettu nimi noudattaa patternia
    if (!jnimi.checkValidity()) {
        jnimi.setCustomValidity("Oltava vähintään kaksi merkkiä pitkä! (Välimerkkiä ei lasketa)");
        jnimi.reportValidity();
        return;
    }
    else {
        jnimi.setCustomValidity("");
    }
    let nimi = jnimi.value;
    //Tarkistetaan, että vähintään 1 checkbox on valittu
    let checkboxit = document.getElementsByName("tapa");
    let jtavat = [];
    for (let box of checkboxit) {
        if (box.checked) {
            jtavat.push(box.value);
        }
    }
    checkboxit[3].setCustomValidity("");
    if (jtavat.length == 0) {
        checkboxit[3].setCustomValidity("Valittava vähintään 1 leimaustapa!");
        checkboxit[3].reportValidity();
        return;
    }
    else {
        checkboxit[3].setCustomValidity("");
    }
    //Tarkistetaan, mikä radiobuttoneista valittuna
    let radiobuttonit = document.getElementsByName("sarja");
    let jsarja = "";
    for (let radio of radiobuttonit) {
        if (radio.checked) {
            jsarja = radio.value;
        }
    }
    lisaaJoukkue(data, nimi, jtavat, jsarja);
}

//Suoritetaan joukkueen lisääminen halutuilla arvoilla
function lisaaJoukkue(data, jnimi, jtavat, jsarja) {
    let sarjat = data[2].sarjat;
    for (let sarja of sarjat) {
        if (sarja.nimi == jsarja) {
            let joukkue = {
                nimi: jnimi,
                id: luoId(sarja.joukkueet),
                leimaustapa: jtavat,
                jasenet: ["Foo Bar", "Bar Foo"]
            };
            sarja.joukkueet.push(joukkue);
            let ilmoitus = document.getElementById("ilmoitus");
            if (ilmoitus.firstChild) {
                ilmoitus.removeChild(ilmoitus.firstChild);
            }
            ilmoitus.appendChild(document.createTextNode("Joukkue " + joukkue.nimi + " on lisätty"));
            let lista = document.getElementById("joukkuelista");
            while (lista.firstChild) {
                lista.removeChild(lista.firstChild);
            }
            listaaJoukkueet(data);
            tyhjennaKentat();
            break;
        }
    }
}

//Tyhjeennetään kenttien arvot onnistuneen lisäämisen jälkeen
function tyhjennaKentat() {
    let nimiInput = document.getElementById("nimi");
    nimiInput.value = "";
    let checkboxit = document.getElementsByName("tapa");
    for (let box of checkboxit) {
        box.checked = false;
    }
    let radiobuttonit = document.getElementsByName("sarja");
    for (let i = 0; i<radiobuttonit.length; i++) {
        if (i == 0) {
            radiobuttonit[i].checked = true;
        }
        else {
            radiobuttonit[i].checked = false;
        }
    }
}

//Luodaan uudelle rastille oma uniikki id
function luoId(tiedot) {
    let nro = parseInt(Math.random() * 100000);
    if (tiedot.some(tieto => tieto.id == nro)) {
        return luoId(tiedot);
    }
    return nro;
}

//Listataan kaikki joukkueet
function listaaJoukkueet(data) {
    let sarjat = data.map(kilpailu => kilpailu.sarjat).flat();
    let joukkueet = sarjat.map(sarja => sarja.joukkueet).flat();
    let jnimet = joukkueet.map(joukkue => joukkue.nimi);
    jnimet = jnimet.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });    
    for (let nimi of jnimet) {
        let jasenet = [];
        for (let joukkue of joukkueet) {
            if (nimi == joukkue.nimi) {
                jasenet = joukkue.jasenet;
            }
        }
        jasenet.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });        
        let lista = document.getElementById("joukkuelista");
        let ul1 = document.createElement("ul");
        let li1 = document.createElement("li");
        li1.appendChild(document.createTextNode(nimi));
        let ul2 = document.createElement("ul");
        for (let i = 0; i<jasenet.length; i++) {
            let li2 = document.createElement("li");
            li2.appendChild(document.createTextNode(jasenet[i]));
            ul2.appendChild(li2);
        }
        li1.appendChild(ul2);
        ul1.appendChild(li1);
        lista.appendChild(ul1);
    }
}