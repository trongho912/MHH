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

// ----------------------------- //
// ----- REACHABLITY GRAPH ----- //
// ----------------------------- //
class my_pair{
    constructor(name, detail){
        this.name = name
        this.detail = detail
    }
}
var reachability_graph = []




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


function checkEnable(name, cur_marking) {    //place name
    for (let i = 0; i < cur_marking.length; i++) {
        if(cur_marking[i].name == name){
            if(cur_marking[i].token >= 1) return true;
            else return false;
        }   
    }
}



function consume(name, cur_marking){     //place name
    cur_marking.forEach(place => {
        if(place.name == name) place.token = place.token - 1;
    });
}

function produce(name, cur_marking){     //place name
    cur_marking.forEach(place => {
        if(place.name == name) place.token = place.token + 1;
    });
}
// ----- END HELP FUNCTION ------ //
// ------------------------------ //





// ----------------------------------- //
// ----- MAIN FLOW OF PETRI NET ------ //
// ----------------------------------- //


function setIM(){   //Initial Marking
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

    // reachbility
    reachability_graph = []
    reachability_graph.push( new my_pair("M0", marking) )

    document.getElementById("show-area").innerHTML = ""
    r_graph = []
    document.getElementById("done").classList.add("d-none")
    document.getElementById("loading").classList.add("d-none")
}



function check_condi(cur_marking){
    console.log(cur_marking)
    console.log("check condi")
    let num_Enable = 0
    petriNet.forEach(transition => {
        let isTranEnable = true
        for (let i = 0; i < transition.inputArr.length; i++) {
            isTranEnable = checkEnable(transition.inputArr[i], cur_marking)
            if(isTranEnable == false) break;
        }

        transition.isEnabled = isTranEnable
        if(isTranEnable == true) num_Enable = num_Enable + 1
    });


    if(num_Enable == 0) return "every thing oke"
    else {
        let enable_arr = []
        for (let i = 0; i < petriNet.length; i++) {
            enable_arr.push(petriNet[i].isEnabled)
        }
        
        for (let i = 0; i < petriNet.length; i++) {
            if(enable_arr[i] == true) firing(petriNet[i].name, cur_marking)
        }
    }


}


var first_of_first = true;
var all_done = false;

function firing(name, arg_marking) {
    // shallow copy
    let cur_marking =[]
    for (let i = 0; i < arg_marking.length; i++) {
        let temp = Object.assign({}, arg_marking[i]);
        cur_marking.push(temp)
    }

    let transition = findT(name)
    console.log(JSON.parse(JSON.stringify(cur_marking)))


    transition.inputArr.forEach(place_name => {
        consume(place_name, cur_marking)
    });

    transition.outputArr.forEach(place_name => {
        produce(place_name, cur_marking)
    });


    let temp_tri = findTri(arg_marking);
    console.log(JSON.parse(JSON.stringify(temp_tri)))

    if(temp_tri == "null"){
        r_graph.push( new Triplet(arg_marking, [new Bilet(cur_marking, name)] ) )
        console.log("noew oke")
        console.log(JSON.parse(JSON.stringify(r_graph)))
    }
    else{
        let temp_bi = findBi(temp_tri.action, cur_marking)
        if(temp_bi == "null") temp_tri.action.push( new Bilet(cur_marking, name) )
    }


    let dest = findTri(cur_marking);
    if(dest == "null") noDieNoEND(cur_marking)
    else return "hahahha"


    console.log("   --- vss ---   ")
    console.log(JSON.parse(JSON.stringify(cur_marking)))

    console.log(JSON.parse(JSON.stringify(r_graph)))
    document.getElementById("play-btn").disabled = false;
}





////////////////////////////////

class Bilet{
    constructor(arg_marking, name){
        // shallow copy
        this.cur_marking = []
        for (let i = 0; i < arg_marking.length; i++) {
            let temp = Object.assign({}, arg_marking[i]);
            this.cur_marking.push(temp)
        }

        this.name = name
    }
}

class Triplet{
    constructor(arg_marking, arg_action){
        // shallow copy
        this.cur_marking = []
        for (let i = 0; i < arg_marking.length; i++) {
            let temp = Object.assign({}, arg_marking[i]);
            this.cur_marking.push(temp)
        }

        this.action = []
        for (let i = 0; i < arg_action.length; i++) {
            let temp = Object.assign({}, arg_action[i]);
            this.action.push(temp)
        }
    }
}



var r_graph = []

function findTri(cur_marking) {
    let ans = "null"
    r_graph.forEach(triplet => {
        let is_same = true
        for (let i = 0; i < cur_marking.length; i++) {
            if(triplet.cur_marking[i].token != cur_marking[i].token){
                console.log("4")
                is_same = false
                break;
            }
        }
        if(is_same) {
            ans = triplet
            return ""
        }
    });
    
    
    return ans;
}

function findBi(array, cur_marking) {
    let ans = "null"
    array.forEach(triplet => {
        let is_same = true
        for (let i = 0; i < cur_marking.length; i++) {
            if(triplet.cur_marking[i].token != cur_marking[i].token){
                is_same = false
                break;
            }
        }
        if(is_same) {
            ans = triplet
            return ""
        }
    });
    
    return ans;
}

function find_index_mark(cur_marking){
    for (let i = 0; i < r_graph.length; i++) {
        let temp = r_graph[i].cur_marking

        let is_that_true = true;
        for (let index = 0; index < temp.length; index++) {
            if(temp[index].token != cur_marking[index].token) is_that_true = false
        }

        if(is_that_true == true) return i;
    }
    return -1;
}




function firstClick() {
    document.getElementById("loading").classList.remove("d-none")
    document.getElementById("done").classList.add("d-none")
    document.getElementById("play-btn").disabled = true;

    setTimeout(() => {
        noDieNoEND(marking)

        document.getElementById("loading").classList.add("d-none")
        document.getElementById("done").classList.remove("d-none")
    
        document.getElementById("play-btn").disabled = false;

        showCurrent()
    }, 500);

}


function showCurrent() {
    for (let t = 0; t < r_graph.length; t++) {
        let triplet = r_graph[t];

        let show_area = document.getElementById("show-area")

        show_area.innerHTML += "<br>"

        show_area.innerHTML += ("<strong>M<sub>" + t + "</sub></strong> = " )


        show_area.innerHTML += "["

        let is_first = true
        for (let i = 0; i < triplet.cur_marking.length; i++) {
            if(triplet.cur_marking[i].token != 0){
                if(!is_first){
                    show_area.innerHTML += ", "
                }
                else{
                    is_first = false
                }
                show_area.innerHTML += triplet.cur_marking[i].name
                show_area.innerHTML += ("<sup>" + triplet.cur_marking[i].token + "</sup>")
            }
        }


        show_area.innerHTML += "]"

        let first_action = true;
        for (let i = 0; i < triplet.action.length; i++) {
            if(first_action){
                show_area.innerHTML += "<br>"
                show_area.innerHTML += '&emsp; &#x250A;'    //&#x250A;
                first_action = false
            }

            show_area.innerHTML += "<br>"
            show_area.innerHTML += "&emsp; &#x2506;---- "   //&#x2506; &#x00A6;
            show_area.innerHTML += triplet.action[i].name
            show_area.innerHTML += "----&rarr;"

            show_area.innerHTML += "&emsp;"
            show_area.innerHTML += ("<strong>M<sub>" + find_index_mark(triplet.action[i].cur_marking) + "</sub></strong> = " )

            show_area.innerHTML += "["
            let is_first = true
            for (let index = 0; index < triplet.action[i].cur_marking.length; index++) {
                if(triplet.action[i].cur_marking[index].token != 0){
                    if(!is_first){
                        show_area.innerHTML += ", "
                    }
                    else{
                        is_first = false
                    }
                    show_area.innerHTML += triplet.action[i].cur_marking[index].name
                    show_area.innerHTML += ("<sup>" + triplet.action[i].cur_marking[index].token + "</sup>")
                }
            }
            show_area.innerHTML += "]"
        }

        show_area.innerHTML += "<br>"        
    }

    
    // document.getElementById("tu-temp").textContent += ("[" + JSON.parse(JSON.stringify(cur_marking)) + "]");
}


function noDieNoEND(arg_marking) {
    console.log("no end")
    // shallow copy
    let cur_marking =[]
    for (let i = 0; i < arg_marking.length; i++) {
        let temp = Object.assign({}, arg_marking[i]);
        cur_marking.push(temp)
    }

    check_condi(cur_marking)
}



