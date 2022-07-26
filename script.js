const navs = document.getElementById('navigators');
const hamburgerEl = document.querySelector('#head i');
const allClearEl = document.querySelector('.ac');
const clearEl = document.querySelector('.clear');
const percentEl = document.querySelector('.percent');
const divideEl = document.querySelector('.divide');
const multiplyEl = document.querySelector('.multiply');
const subEl = document.querySelector('.sub');
const addEl = document.querySelector('.add');
const dotEl = document.querySelector('.dot');
const equalEl = document.querySelector('.equal');
const keyBoardEl = document.querySelectorAll('#keyboard .number');
const calculatedValuesEl = document.querySelector('.typing h5');
const totalValueEl = document.querySelector('.total h2');
const calculatorEl = document.getElementById('calculator');
const historyNameEl = document.querySelector('#navigators .history');
const historyEl = document.getElementById('history');

// HAMBURGER ICON TOGGLER....
// The hamburger icon is used to show the history 
//tab and the about app navigators..
hamburgerEl.addEventListener('click',()=>{
    if(navs.classList.contains('visible')){
        navs.classList.remove('visible');
        hamburgerEl.classList.add('fa-bars')
        hamburgerEl.classList.remove('fa-xmark')
    }
    else{
        navs.classList.add('visible');
        hamburgerEl.classList.remove('fa-bars')
        hamburgerEl.classList.add('fa-xmark')
    }
    
})

//Storing the number values using for Each loop which makes
//The code more efficient..
keyBoardEl.forEach((res)=>{
    res.addEventListener('click',(e)=>{
        // console.log(e.path[0].value)
        calculate(e.path[0].value);
    })
})

//percent event listener..
percentEl.addEventListener('click',()=>{
    
    calculate('%');
})
//Divide event listener..
divideEl.addEventListener('click',()=>{
   
    calculate('/')
})
//Multiply event listener..
multiplyEl.addEventListener('click',()=>{
    
    calculate('*')
})
//subract event listener..
subEl.addEventListener('click',()=>{
   
    calculate('-')
})
//Add event listener..
addEl.addEventListener('click',(e)=>{
    
    calculate('+')
   
})
//Dot event listener..
dotEl.addEventListener('click',()=>{
    
    calculate('.')
})

//all clear event will clear the entire calculations..
allClearEl.addEventListener('click',()=>{
    totalValueEl.innerText = 'Empty!';
    value = '';
    calculatedValuesEl.innerText = value;
})

//This is the heart function where every values are called 
//and returned in the DOM.
let value = '';
const calculate = (num) => {
    value += num;
    calculatedValuesEl.innerText = value;
    // validations(value);
    
}

//clear event listener is used to delete or erase the numbers we typed.
//here slice method is used to slice the string from the last..(0,-1);
//Here we have prerequisites if the value length is > than 0 it will pursue
//or else it will return nothing..
clearEl.addEventListener('click',()=>{
    if(value.length > 0){
        value = value.slice(0, -1);
        calculatedValuesEl.innerText = value;
        validations(value);
    }
    else{
        return;
    }
})


//The end result is the variable remains in the array after all the calculations are done.
let endResult = '';
const validations = (numerics) => {
    let values = numerics;//This hold value e.g:- 10+72/88/72-8
    var numericals = values.split(/\*|\+|\-|\/|\%/g);// This will gives e.g:- [10,72,88,72,8]
    let symbols = values.replace(/[0-9]|\./g, "").split('');//This will gives e.g:- ['+','/','/','-'];

    //Here comes the order.
    //1.percentage, 2.division, 3.Multiplication, 4.Subtraction, 5.Addition.
    //In this order the operations needs to be performed..
    let percentage = symbols.indexOf('%');
    while(percentage != -1){
        //If the index of the percentage sign is not equals -1 which means
        //It is present in the array. It should splice the values in either side of the index.
        //and calculate accordingly. This is what happens for rest of the operators.
        numericals.splice(percentage, 2, (numericals[percentage] / 100) * numericals[percentage + 1]);
        symbols.splice(percentage, 1);
        percentage = symbols.indexOf('%');
    }

    let division = symbols.indexOf('/');
    while(division != -1){
        numericals.splice(division, 2, numericals[division] / numericals[division + 1]);
        symbols.splice(division, 1);
        division = symbols.indexOf('/');
    }

    let multiplication = symbols.indexOf('*');
    while(multiplication != -1){
        numericals.splice(multiplication, 2, numericals[multiplication] * numericals[multiplication + 1]);
        symbols.splice(multiplication, 1);
        multiplication = symbols.indexOf('*');
    }

    let subtraction = symbols.indexOf('-');
    while(subtraction != -1){
        numericals.splice(subtraction, 2, numericals[subtraction] - numericals[subtraction + 1]);
        symbols.splice(subtraction, 1);
        subtraction = symbols.indexOf('-');
    }

    let addition = symbols.indexOf('+');
    while(addition != -1){
        numericals.splice(addition, 2, parseFloat(numericals[addition]) + parseFloat(numericals[addition + 1]));
        symbols.splice(addition, 1);
        addition = symbols.indexOf('+');
    }

    //After all the operations done the array contains a single value
    //Which is the end Result..
    endResult = numericals[0];
    return numericals;
}

//Equal to button event listener..
equalEl.addEventListener('click',()=>{
    let conclusion = validity(value,b);
    if(conclusion == 'valid'){
        validations(value);
        totalValueEl.innerText = endResult;
        localStore(value, endResult);
    }
    else{
        alert(conclusion);
    }
})


let b = ['/','*','+','-','%','.'];
//This function validates wheather the user typed values are valid or not..
//This return that status to the above equal event listener..
//In that event listener the machine decides wether to solve it or not.
//If valid it solves else it pops u an alert message.Stating invalid..
function validity(a,b){
    for(var i=0,j=1; i<a.length&&j<a.length-1 ; i++,j++){
        if((b.includes(a.charAt(i))) == true && (b.includes(a.charAt(j))) == true){
            return 'Invalid';
        }
        else{
            continue;
        }
    }
    return 'valid';
}

//This is the function where i used to store my calculated data's..
const localStore = (value, endResult) => {
    localStorage.setItem('calculations', JSON.stringify([...JSON.parse(localStorage.getItem('calculations') || '[]'), {val:`${value}`, res: `${endResult}`}]));
}

//The history name in the navigator has an event.
//What does it do?
//It collect the data from the local storage and append in the container tag..
//On clicking that first it need to remove the previous allocated tags.
//Meanwhile we can able to avoid collision of repeated data's...
historyNameEl.addEventListener('click',()=>{
    let storedValues = [...JSON.parse(localStorage.getItem('calculations'))];
    calculatorEl.style.display = 'none';
    historyEl.style.display = 'block';
    historyEl.innerHTML = '';

    let headDiv = document.createElement('div');
    let headerText = document.createElement('h2');
    let iconCancel = document.createElement('i');

    headDiv.className = 'head';
    headerText.innerText = 'History';
    iconCancel.className = 'fa-solid fa-xmark fa-2xl'
    iconCancel.setAttribute('onclick','removeHistory()');

    historyEl.append(headDiv);
    headDiv.append(headerText);
    headDiv.append(iconCancel);

    storedValues.forEach((result)=>{
        let newDiv = document.createElement('div');
        let headThree = document.createElement('h3');
        let headTwo = document.createElement('h2');
        let headOne = document.createElement('h2');
        let horizontalRow = document.createElement('hr');

        newDiv.className = 'answers';

        historyEl.append(newDiv);
        newDiv.append(headThree);
        newDiv.append(headTwo);
        newDiv.append(headOne);
        historyEl.append(horizontalRow);
        
        headThree.innerText = result.val;
        headTwo.innerText = '=';
        headOne.innerText = result.res;
    })
})

//The function remove history diplays the calculator and remove the history page..
function removeHistory(){
    historyEl.style.display = 'none';
    calculatorEl.style.display = 'block';
}