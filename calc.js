const numberBtns = Array.from(document.querySelectorAll(".numBtn"));
const dotBtn = document.querySelector(".dotBtn");
const operationBtns = Array.from(document.querySelectorAll(".opBtn"));
const delBtn = document.querySelector("#delete");
const clrBtn = document.querySelector("#clear");
const storedStr = document.querySelector(".stored");
const inputStr = document.querySelector(".input");
const maxDigits = 16;
let historyArr = [];
let evalArr = [];
let firstOperand = [];
let secondOperand = [];
let operator = null;
let result = null;

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
    if (!parseInt(firstOperand[firstOperand.length-1]) || !parseInt(secondOperand[secondOperand.length-1])) return;
    if (firstOperand.length === 0) { // allow negative firstOperand
        if (symbol === "-") firstOperand.push(symbol);
        updateInputText(firstOperand);
        return;
    }
    if (operator && secondOperand.length === 0) {
        if (symbol !== "=" && operator !== symbol) { // change operator
            operator = symbol;
            evalArr[1] = symbol;
        }
        if (operator === "-" && symbol === operator) { // allow negative secondOperand
            secondOperand.push(symbol);
            updateInputText(secondOperand);
            return;
        }
    }
    if (result) { // set result as operand
        evalArr = [];
        operator = symbol;
        updateStoredText();
        storeInput();
        result = null;
        return;
    }
    if (!operator) { // store firstOperand and operator
        operator = symbol;
        updateStoredText();
        storeInput();
    } else if (secondOperand.length > 0) { // evaluate
        evalArr.push(secondOperand.join(''));
        operate(parseFloat(firstOperand.join('')), parseFloat(secondOperand.join('')));
    }
}

numberBtns.forEach(btn => {btn.addEventListener("click", setNumbers)});
dotBtn.addEventListener("click", setDecimal);
operationBtns.forEach(btn => {btn.addEventListener("click", setOperator)});

delBtn.addEventListener("click", del);
clrBtn.addEventListener("click", clear);

function updateInputText (arr) {
    inputStr.textContent = arr.join('');
}

function updateStoredText () {
    storedStr.textContent = evalArr.join('');
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
    if (num2 === 0 ) return "Don't do that!"
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

function toFixedIfNecessary( value, dp ){
    return +parseFloat(value).toFixed( dp );
}
  