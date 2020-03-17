function eval() {
    // Do not use eval!!!
    return;
}

const mathOperators = {
    '*': (a, b) => a * b,
    '/': (a, b) => {
        if (b == 0) {
            throw new Error('TypeError: Division by zero.')
        } else { return a / b }
    },
    '+': (a, b) => +a + +b,
    '-': (a, b) => a - b,
}

function calculate(subExpr) {
    let arrayFromBrackets = subExpr.trim().split(' ');
    let operators = [];
    let regOperators = /[\+\-\*\/]/

    if (arrayFromBrackets.length <= 1) {
        arrayFromBrackets = arrayFromBrackets[0].split(regOperators);
        let subExprOperator = subExpr.match(regOperators);
        arrayFromBrackets = arrayFromBrackets.join(` ${subExprOperator} `).split(' ');
    };

    arrayFromBrackets.forEach(element => {
        if (regOperators.test(element) && !Number(element)) { operators.push(element) }
    });

    operators.sort((a, b) => {
        if (/[\/\*]/.test(a) && /[\+\-]/.test(b)) { return -1 }
        if (/[\+\-]/.test(a) && /[\*\/]/.test(b)) { return 1 }
    });
    while (operators.length) {
        let operator = operators.splice(0, 1);
        let operatorPosition = arrayFromBrackets.indexOf(operator[0]);
        let result = mathOperators[operator](arrayFromBrackets[operatorPosition - 1], arrayFromBrackets[operatorPosition + 1]);
        arrayFromBrackets.splice(operatorPosition - 1, 3, result);
    }

    return arrayFromBrackets[0];
}

function expressionCalculator(expr) {
    let openBrackets = [];
    let braccketsCounter = 0;
    for (let i = 0; i < expr.length; i++) {
        if (expr[i] === '(') {
            braccketsCounter++;
            openBrackets.push(expr[i]);
        }
        if (expr[i] === ')') braccketsCounter--;
    }

    if (braccketsCounter != 0) throw new Error('ExpressionError: Brackets must be paired');
    while (openBrackets.length) {
        let openBracket = openBrackets.pop();
        let lastOpenBracketPosition = expr.lastIndexOf(openBracket);
        let firstCloseBracketPosition = expr.indexOf(')', lastOpenBracketPosition);
        let subExpr = expr.slice(lastOpenBracketPosition + 1, firstCloseBracketPosition);
        expr = expr.slice(0, lastOpenBracketPosition) + calculate(subExpr) + expr.slice(firstCloseBracketPosition + 1);
    }

    if (/[\+\-\*\/]/.test(expr)) return calculate(expr);

    return expr;
}

module.exports = {
    expressionCalculator
}