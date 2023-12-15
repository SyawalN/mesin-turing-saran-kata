const transition = {
    "q0":{
        "g":["q1", "X", "R"]
    },
    "q1":{
        "o":["q1", "Y", "R"],
        "g":["q2", "X", "R"]
    },
    "q2":{
        "l":["q3", "X", "R"]
    },
    "q3":{
        "e":["q4", "Y", "R"]
    },
    "q4":{
        "$":["Accept", "$", "Halt"]
    },
    "Accept":[]
}

const saranKata = {
    "google":[" classroom", " drive", " translate"]
}

function proses(){
    // Ambil data dari input user
    let data = document.getElementById("inputKata").value;
    // Tambah simbol untuk pembatas tape
    data += "$";
    
    // Cek banyak data
    let dataLength = data.length;

    // Reset tag
    let process = document.getElementById("process-text");
    let result = document.getElementById("result");
    let saranKata = document.getElementById("saran-kata");
    
    process.innerHTML = " ";
    result.innerHTML = " ";
    saranKata.innerHTML = " ";

    // Ambil elemen id tape dan head
    let head = document.getElementById("head");
    let tape = document.getElementById("tape");
    tape.innerHTML = "";
    head.innerHTML = "";

    // Buat simbol panah untuk head
    let arrow = document.createElement("div");
    arrow.setAttribute("class", "head-arrow");

    // Tampilkan data pada kolom tabel head
    for (let i = 0; i < dataLength; i++){
        if (i == 0){
            let headCell = document.createElement("td");
            headCell.appendChild(arrow);
            head.appendChild(headCell);
        } else {
            let headCell = document.createElement("td");
            headCell.textContent = " ";
            head.appendChild(headCell);
        }
    }

    // Tampilkan data pada kolom tabel tape
    for (let i = 0; i < dataLength; i++){
        let tapeCell = document.createElement("td");
        tapeCell.textContent = data[i];
        tape.appendChild(tapeCell);
    }

    // Head akan membawa nilai awal
    head.setAttribute("class", "q0");
    
    const duration = 3000;
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const executeProcess = async () => {
        await delay(duration);
        playLoop();
    };

    let table = document.getElementById("transisi-tape");
    table.style.display = "block";

    executeProcess();
}

function isValidInput(state, input) {
    const validInputs = Object.keys(transition[state] || {});
    return validInputs.includes(input);
}

function playLoop(){
    const loop = setInterval(turingMachine, 1000);
    function turingMachine(){
        // Ambil referensi elemen id head
        let head = document.getElementById("head");
        let headChild = head.getElementsByTagName("td");
    
        // Ambil referensi elemen id tape
        let tape = document.getElementById("tape");
        let tapeChild = tape.getElementsByTagName("td");
    
        // Buat arrow untuk cell baru
        let arrow = document.createElement("div");
        arrow.setAttribute("class", "head-arrow");
    
        // Ambil referensi dari posisi head sekarang
        let headCurrentIndex = 0;
        for (let i = 0; i < headChild.length; i++){
            if (headChild[i].innerHTML !== " "){
                headCurrentIndex = i;
                break;
            }
        }
    
        // Ambil atribut kelas dari head
        let currentState = head.getAttribute("class");
        
        // Ambil data dari input saat ini
        let currentInput = tapeChild[headCurrentIndex].innerHTML.toLowerCase();
        
        let prosesInput;
        if (isValidInput(currentState, currentInput)){
            prosesInput = true;
        } else {
            prosesInput = false;
        }

        // console.log(prosesInput);

        let processText = document.getElementById("process-text");
        processText.style.display = "block";
        
        // Proses transisi
        let nextState;
        let writeCell;
        let moveHead;
        if (prosesInput){
            nextState = transition[currentState][currentInput][0];
            writeCell = transition[currentState][currentInput][1];
            moveHead  = transition[currentState][currentInput][2];
            processText.style.color = "lightgreen";
            processText.innerHTML = "(" + currentState + ", " + currentInput + ") " + "=> (" + nextState + ", " + writeCell + ", " + moveHead + ")"; 
        } else {
            nextState = "Reject";
            processText.style.color = "red";
            processText.innerHTML = "(" + currentState + ", " + currentInput + ") " + "=> (" + nextState + ", " + currentInput + ", " + "Halt)"; ;
        }

        // console.log(currentState);
    
        // Validasi mesin turing
        if ((nextState == "Accept") || (nextState == "Reject")){
            let result = document.getElementById("result");
            result.style.display = "block";
            
            result.innerHTML = "The string input is " + nextState + "ed";
            console.log("Berhenti");

            if (nextState == "Accept"){
                let turingBox = document.getElementById("turing-machine");
                let suggestWord = document.getElementById("saran-kata");
                let data = document.getElementById("inputKata").value.toLowerCase();
                suggestWord.style.display = "block";
                suggestWord.innerHTML = "Saran kata selanjutnya dari kata '" + data + "' :&nbsp" + saranKata[data];

                turingBox.appendChild(suggestWord);
            }
            clearInterval(loop);
            return;
        }
        
        // Ubah state
        head.setAttribute("class", nextState);
    
        // Menulis cell pada tape
        tapeChild[headCurrentIndex].innerHTML = writeCell;
        tapeChild[headCurrentIndex].style.color = "green";
    
        // Gerakan pada head
        if (moveHead == "R"){
            // Gerak ke kanan
            headChild[headCurrentIndex + 1].appendChild(arrow);
            headChild[headCurrentIndex].innerHTML = " ";
        } else {
            // Gerak ke kiri
            headChild[headCurrentIndex - 1].appendChild(arrow);
            headChild[headCurrentIndex].innerHTML = " ";
        }
    }
}