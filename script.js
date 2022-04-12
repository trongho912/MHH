class Place{
    constructor(name, token){
        this.name = name
        this.token = token
    }
}

class Transition{
    constructor(name, inputArr, outputArr, isEnabled){
        this.name = name
        this.inputArr = inputArr
        this.outputArr = outputArr
        this.isEnabled = isEnabled
    }
}

console.log(document.getElementById("ex").textContent)

//   CREATE PETRI NET   //
// -------------------- //
let exercise = document.getElementById("ex").textContent;
var marking = []
var petriNet = []

if(exercise == "1"){
    marking = [
        new Place("free", 1), 
        new Place("busy", 0), 
        new Place("docu", 0)
    ]
    petriNet = [
        new Transition("start", ["free"], ["busy"], false), 
        new Transition("change", ["busy"], ["docu"], false), 
        new Transition("end", ["docu"], ["free"], false)
    ]
}
else if(exercise == "2"){
    marking = [
        new Place("wait", 1), 
        new Place("inside", 0), 
        new Place("done", 0)
    ]
    petriNet = [
        new Transition("start", ["wait"], ["inside"], false), 
        new Transition("change", ["inside"], ["done"], false), 
    ]
}
else if(exercise == "3"){
    marking = [
        new Place("wait", 1), 
        new Place("free", 0),
        new Place("docu", 0),
        new Place("work", 0),
        new Place("done", 0)
    ]
    petriNet = [
        new Transition("start", ["wait", "free"], ["work"], false), 
        new Transition("change", ["work"], ["docu", "done"], false), 
        new Transition("end", ["docu"], ["free"], false)
    ]
}




// -------------------------------- //
// ----- BEGIN HELP FUNCTION ------ //
function showToken() {
    marking.forEach(place => {
        document.getElementById(place.name).innerHTML = place.token
    });
}


function findT(name) {
    for (let i = 0; i < petriNet.length; i++) {
        if(petriNet[i].name == name) return petriNet[i]
    }
    alert("can't find your transition by name")
    return null;
}
// not used yet
function findP(name) {
    for (let i = 0; i < marking.length; i++) {
        if(marking[i].name == name) return marking[i]
    }
    alert("can't find your place by name")
    return null
}



function checkEnable(name) {    //place name
    for (let i = 0; i < marking.length; i++) {
        if(marking[i].name == name){
            console.log(marking[i].name)
            if(marking[i].token >= 1) return true;
            else return false;
        }   
    }
}



function consume(name){     //place name
    marking.forEach(place => {
        if(place.name == name) place.token = place.token - 1;
    });
}

function produce(name){     //place name
    marking.forEach(place => {
        if(place.name == name) place.token = place.token + 1;
    });
}
// ----- END HELP FUNCTION ------ //
// ------------------------------ //




// ------------------------------------- //
// ----- BEGIN ANIMATION FUNCTION ------ //
function setTAni(name) {
    let pre = "transition_";

    document.getElementById(pre + name).classList.add("border")
    document.getElementById(pre + name).classList.add("border-primary")
    document.getElementById(pre + name).classList.add("border-5")  
}

function setPAni(name, type) {
    let pre = "place_"

    document.getElementById(pre + name).classList.add("border")
    document.getElementById(pre + name).classList.add("border-5")
    document.getElementById(pre + name).classList.add("rounded-circle")
    if(type == "out") {
        document.getElementById(pre + name).classList.add("border-success")
    }
    else if(type == "in") document.getElementById(pre + name).classList.add("border-warning")
    else alert("Nhap sai type trong setPAni() js")
}

function set3Ani(name){
    let transition = findT(name)
    setTAni(name)
    transition.inputArr.forEach(place_name => {
        setPAni(place_name, "in")
    });
    transition.outputArr.forEach(place_name => {
        setPAni(place_name, "out")
    });
}

function removeAni(){
    for (let i = 0; i < petriNet.length; i++) {
        let pre = "transition_";

        document.getElementById(pre + petriNet[i].name).classList.remove("border")
        document.getElementById(pre + petriNet[i].name).classList.remove("border-primary")
        document.getElementById(pre + petriNet[i].name).classList.remove("border-5")
    }

    for (let i = 0; i < marking.length; i++) {
        let pre = "place_"
        document.getElementById(pre + marking[i].name).classList.remove("border")
        document.getElementById(pre + marking[i].name).classList.remove("border-success")
        document.getElementById(pre + marking[i].name).classList.remove("border-warning")
        document.getElementById(pre + marking[i].name).classList.remove("border-5")
        document.getElementById(pre + marking[i].name).classList.remove("rounded-circle")
    }
}

function highlightNum(name){
    document.getElementById(name).style.color = "red";
    document.getElementById(name).style.fontWeight = "bolder"
}
function highlightNum_done(name) {
    document.getElementById(name).style.color = "black";
    document.getElementById(name).style.fontWeight = "initial"
}
// ----- END ANIMATION FUNCTION ------ //
// ----------------------------------- //


// ----------------------------------- //
// ----- MAIN FLOW OF PETRI NET ------ //
// ----------------------------------- //



function setIM(){   //Initial Marking
    document.getElementById("next-btn").disabled = false

    removeAni()

    console.log("--- set Initial Marking ---")

    let initial_form = []
    marking.forEach(place => {
        let pre = "form-"
        let temp = document.getElementById(pre + place.name).value;

        place.token = (temp == "" || parseInt(temp)<0) ? 0 : parseInt(temp);
    });
    console.log("   -> marking:")
    console.log(JSON.parse(JSON.stringify(marking)))


    petriNet.forEach(transition =>{
        transition.isEnabled = false
    });
    console.log("   -> petri Net:")
    console.log(JSON.parse(JSON.stringify(petriNet)))


    showToken()
}


function petriNet_checkCondi(){
    document.getElementById("next-btn").disabled = true     //wait untill the whole process done

    removeAni()

    let num_Enable = 0
    petriNet.forEach(transition => {
        let isTranEnable = true
        for (let i = 0; i < transition.inputArr.length; i++) {
            isTranEnable = checkEnable(transition.inputArr[i])
            if(isTranEnable == false) break;
        }

        transition.isEnabled = isTranEnable
        if(isTranEnable == true) num_Enable = num_Enable + 1
    });

    console.log("--- check number of transition is enabled ---")
    console.log(num_Enable)

    if(num_Enable > 1)
        getStuck()
    else if(num_Enable == 1){
        for (let i = 0; i < petriNet.length; i++) {
            if(petriNet[i].isEnabled == true){
                set3Ani(petriNet[i].name)
                firing(petriNet[i].name)
                break
            }
            
        }
    }
    else alert("The petri net is deadlock")
}


function getStuck(){
    console.log("--- Please input which transition that you want to fire ---")
    document.getElementById("stuck").classList.remove("d-none")

    petriNet.forEach(transition => {
        if(transition.isEnabled == true){
            let pre = "sl-"
            setTAni(transition.name)
            document.getElementById(pre + transition.name).classList.remove("d-none")
        }
    });
}

// (this function will change if change petrinet)
function stuck_form_click() {
    let user_choice = document.getElementById("sl-form");
    if(user_choice.value == "null") return "null";
    else{
        // alert(user_choice.value)
        let pre = "sl-"
        petriNet.forEach(transition => {
            document.getElementById(pre + transition.name).classList.add("d-none")
        });
        document.getElementById("stuck").classList.add("d-none")

        removeAni()
        set3Ani(user_choice.value)

        console.log("--- user-choice ---")
        console.log(user_choice.value)
        firing(user_choice.value)

        user_choice.value = "null";
    }
}


function firing(name) {
    let transition = findT(name)
    
    console.log("--- firing '" + name + "' ---")
    console.log("   -> marking(before firing):")
    console.log(JSON.parse(JSON.stringify(marking)))


    transition.inputArr.forEach(place_name => {
        highlightNum(place_name)
        consume(place_name)
    });

    setTimeout(function(){
        showToken()

        setTimeout(function(){
            transition.inputArr.forEach(place_name => {
                highlightNum_done(place_name)
            });

            transition.outputArr.forEach(place_name => {
                highlightNum(place_name)
            });

            transition.outputArr.forEach(place_name => {
                produce(place_name)
            });

            setTimeout(function(){
                showToken()

                setTimeout(function(){
                    transition.outputArr.forEach(place_name => {
                        highlightNum_done(place_name)
                    });
                    console.log("   -> marking(after firing):")
                    console.log(JSON.parse(JSON.stringify(marking)))
                    console.log("========================================================")
                    document.getElementById("next-btn").disabled = false
                }, 900);
            }, 1200);

        }, 900);
    }, 1300);

}