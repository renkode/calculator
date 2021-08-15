const numberBtns = Array.from(document.querySelectorAll(".numBtn"));
const dotBtn = document.querySelector(".dotBtn");
const operationBtns = Array.from(document.querySelectorAll(".opBtn"));
const delBtn = document.querySelector("#delete");
const clrBtn = document.querySelector("#clear");
const storedStr = document.querySelector(".stored");
const inputStr = document.querySelector(".input");
let historyArr = [];
let evalArr = [];
let firstOperand = [];
let secondOperand = [];
let operator = "";
let result = null;

numberBtns.forEach(btn => {
    btn.addEventListener("click", function(e){
        let num = e.target.textContent;
        if (operator === "") { 
            firstOperand.push(num);
            updateInputText(firstOperand)
        } else {
            secondOperand.push(num);
            updateInputText(secondOperand)
        }
    })
});

dotBtn.addEventListener("click", function(e){
    if (operator === "") {
        if (!firstOperand.includes(".")) {
            if (firstOperand.length === 0) firstOperand.push("0");
            firstOperand.push(e.target.textContent)
            updateInputText(firstOperand)
        } 
    } else {
        if (!secondOperand.includes(".")) {
            if (secondOperand.length === 0) secondOperand.push("0");
            secondOperand.push(e.target.textContent)
            updateInputText(secondOperand)
        }
    }
})

operationBtns.forEach(btn => {
    btn.addEventListener("click", function(e){
        let symbol = e.target.textContent;
        if (symbol === "=" && secondOperand.length === 0) return;
        if (result) { // set result as operand
            evalArr = [];
            operator = symbol;
            firstOperand.push(result);
            updateStoredText();
            storeInput();
            result = null;
            return;
        }
        if (operator === "") { 
            operator = symbol;
            updateStoredText();
            storeInput();
        } else { // evaluate
            evalArr.push(secondOperand);
            operate(parseFloat(firstOperand), parseFloat(secondOperand));
        }
    })
});

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
    operator = '';
}

function storeInput() {
    evalArr.push(firstOperand.join(''));
    if (operator !== "") evalArr.push(operator);
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
    return num1 / num2;
};

function operate(num1, num2) {
    switch (operator !== "") {
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
    result = toFixedIfNecessary(result, 7).toString();
    showResult();
}

function del() {
    if (operator === "") { 
        firstOperand.pop();
        updateInputText(firstOperand)
    } else {
        secondOperand.pop();
        updateInputText(secondOperand)
    }
}

function clear() {
    historyArr = [];
    evalArr = [];
    firstOperand = [];
    secondOperand = [];
    operator = "";
    inputStr.textContent = "";
    storedStr.textContent = ""
    result = null;
}

function toFixedIfNecessary( value, dp ){
    return +parseFloat(value).toFixed( dp );
}
  