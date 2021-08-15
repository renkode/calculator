const calc = document.querySelector(".calculator");
const display = document.querySelector(".display");
const numberBtns = Array.from(document.querySelectorAll(".numBtn"));
const dotBtn = document.querySelector(".dotBtn");
const operationBtns = Array.from(document.querySelectorAll(".opBtn"));
const delBtn = document.querySelector("#delete");
const clrBtn = document.querySelector("#clear");
const extraBtn = document.querySelector("#click-me");
const storedStr = document.querySelector(".stored");
const inputStr = document.querySelector(".input");
const maxDigits = 16;
let evalArr = [];
let firstOperand = [];
let secondOperand = [];
let operator = null;
let result = null;
let sound = new Audio("https://cdn.discordapp.com/attachments/577559988554301451/876392235099365386/yatta.mp3");
let divideByZero = ["ARGH","STOP THAT","IT HURTS", "YOU FOOL"]

let setNumbers = function(e) {
    let num = e.target.textContent;
    if (isNaN(result)) clear();
    if (!operator) { 
        if (firstOperand.length >= maxDigits) return;
        if (num === "0" && firstOperand[0] === "0" && !firstOperand.includes(".")) return;
        if (firstOperand[0] === "0" && firstOperand.length === 1) {
            firstOperand[0] = num 
        } else { 
            firstOperand.push(num)
        };
        updateInputText(firstOperand)
    } else {
        if (secondOperand.length >= maxDigits) return;
        if (num === "0" && secondOperand[0] === "0" && !secondOperand.includes(".")) return;
        secondOperand.push(num);
        updateInputText(secondOperand)
    }
}

let setDecimal = function(e) {
    if (isNaN(result)) clear();
    if (!operator) {
        if (firstOperand.length >= maxDigits) return;
        if (!firstOperand.includes(".")) {
            if (firstOperand.length === 0) firstOperand.push("0");
            firstOperand.push(e.target.textContent);
            updateInputText(firstOperand);
        } 
    } else {
        if (secondOperand.length >= maxDigits) return;
        if (!secondOperand.includes(".")) {
            if (secondOperand.length === 0) secondOperand.push("0");
            secondOperand.push(e.target.textContent);
            updateInputText(secondOperand);
        }
    }
}

let setOperator = function(e) {
    let symbol = e.target.textContent;
    if (isNaN(result)) clear();
    if (firstOperand.length > 0 && !Number.isInteger(parseInt(firstOperand[firstOperand.length-1]))) return;
    if (secondOperand.length > 0 && !Number.isInteger(parseInt(secondOperand[secondOperand.length-1]))) return;
    if (firstOperand.length === 0) { // allow negative firstOperand
        if (symbol === "-") {
            firstOperand.push(symbol);
            updateInputText(firstOperand);
            return;
        } else { return; }
    }
    if (result) { // set result as operand
        if (symbol === "=") return;
        evalArr = [];
        operator = symbol;
        updateStoredText();
        storeInput();
        result = null;
        return;
    }
    if (operator) {
        if (symbol === "-" && secondOperand.length === 0) { // allow negative secondOperand
            secondOperand.push(symbol);
            updateInputText(secondOperand);
            return;
        }
        if (symbol !== "=") { // change operator
            operator = symbol;
            evalArr[1] = symbol;
            updateStoredText();
            return;
        }
    }
    if (!operator) { // store firstOperand and operator
        if (symbol === "=") return;
        operator = symbol;
        updateStoredText();
        storeInput();
    } else if (secondOperand.length > 0) { // evaluate
        evalArr.push(secondOperand.join(''));
        operate(parseFloat(firstOperand.join('')), parseFloat(secondOperand.join('')));
    }
}

function del() {
    if (!operator) { 
        firstOperand.pop();
        updateInputText(firstOperand)
    } else {
        secondOperand.pop();
        updateInputText(secondOperand)
    }
    //result = null;
}

function clear() {
    historyArr = [];
    evalArr = [];
    firstOperand = [];
    secondOperand = [];
    operator = null;
    inputStr.textContent = "";
    storedStr.textContent = ""
    result = null;
}

function updateInputText (arr) {
    inputStr.textContent = arr.join('');
}

function updateStoredText () {
    storedStr.textContent = evalArr.join(" ");
}

function showResult () {
    storedStr.textContent = evalArr.join(" ") + " =";
    inputStr.textContent = result;
    firstOperand = [];
    secondOperand = [];
    operator = null;
    firstOperand.push(...result.split(''));
}

function storeInput() {
    evalArr.push(firstOperand.join(''));
    if (operator) evalArr.push(operator);
    inputStr.textContent = "";
    storedStr.textContent = evalArr.join(" ")
}

const add = function(num1, num2) {
	return num1 + num2;
};

const subtract = function(num1, num2) {
	return num1 - num2;
};

const multiply = function(num1, num2) {
    return num1 * num2;
};

const divide = function(num1, num2) {
    if (num2 === 0 ) {
        calc.classList.add("shake");
        display.classList.add("glowRed");
        return divideByZero[Math.floor(Math.random()*divideByZero.length)];
    }
    return num1 / num2;
};

function operate(num1, num2) {
    switch (operator !== null) {
        case (operator === "÷"):
            result = divide(num1,num2);
            break;
        case (operator === "×"):
            result = multiply(num1,num2);
            break;
        case (operator === "-"):
            result = subtract(num1,num2);
            break;
        case (operator === "+"):
            result = add(num1,num2);
            break;
    }
    if (!isNaN(result)) result = toFixedIfNecessary(result, 7).toString();
    showResult();
    console.log(evalArr);
}

function toFixedIfNecessary( value, dp ){
    return +parseFloat(value).toFixed( dp );
}

numberBtns.forEach(btn => {btn.addEventListener("click", setNumbers)});
dotBtn.addEventListener("click", setDecimal);
operationBtns.forEach(btn => {btn.addEventListener("click", setOperator)});
delBtn.addEventListener("click", del);
clrBtn.addEventListener("click", clear);
extraBtn.addEventListener("click", () => {sound.play(); calc.classList.add("shake")});
calc.addEventListener('animationend', () => calc.classList.remove("shake"));
display.addEventListener('animationend', () => display.classList.remove("glowRed"));