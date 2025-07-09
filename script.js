document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const buttons = document.getElementById('buttons');
    let currentInput = '';
    let operator = '';
    let previousInput = '';

    buttons.addEventListener('click', function(e) {
        if (e.target.tagName !== 'BUTTON') {
            return;
        }

        const buttonValue = e.target.innerText;

        handleInput(buttonValue);
    });
    
    document.addEventListener('keydown', function(e) {
        const key = e.key;
        let buttonValue;

        if (key >= '0' && key <= '9') {
            buttonValue = key;
        } else if (['+', '-', '*', '/'].includes(key)) {
            buttonValue = key;
        } else if (key === '.') {
            buttonValue = key;
        } else if (key === 'Enter' || key === '=') {
            buttonValue = '=';
        } else if (key === 'Backspace') {
            buttonValue = '←';
        } else if (key.toLowerCase() === 'c' || key === 'Escape') {
            buttonValue = 'C';
        }

        if (buttonValue) {
            e.preventDefault();
            handleInput(buttonValue);
        }
    });

    function handleInput(value) {
        if (value >= '0' && value <= '9') {
            if (currentInput === 'Error') clear();
            currentInput += value;
            updateDisplay(currentInput);
        } else if (value === '.') {
            if (currentInput === 'Error') clear();
            if (!currentInput.includes('.')) {
                currentInput += '.';
                updateDisplay(currentInput);
            }
        } else if (['+', '-', '*', '/'].includes(value)) {
            if (currentInput === '' && previousInput !== '') {
                 // Change operator
                operator = value;
                updateDisplay(previousInput + ' ' + operator);
                return;
            }
            if (currentInput !== '') {
                if (previousInput !== '') {
                    calculate();
                }
                operator = value;
                previousInput = currentInput;
                currentInput = '';
                updateDisplay(previousInput + ' ' + operator);
            }
        } else if (value === '=') {
            calculate();
        } else if (value === 'C') {
            clear();
        } else if (value === '←') {
            backspace();
        }
    }

    function calculate() {
        if (previousInput === '' || currentInput === '' || operator === '') {
            return;
        }
        
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    displayError();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Round to a reasonable number of decimal places
        result = parseFloat(result.toPrecision(12));
        
        currentInput = result.toString();
        operator = '';
        previousInput = '';
        updateDisplay(currentInput);
    }
    
    function displayError() {
        clear();
        currentInput = 'Error';
        updateDisplay('Error');
    }

    function clear() {
        currentInput = '';
        previousInput = '';
        operator = '';
        updateDisplay('');
    }

    function backspace() {
        if (currentInput !== '' && currentInput !== 'Error') {
            currentInput = currentInput.slice(0, -1);
            updateDisplay(currentInput);
        }
    }

    function updateDisplay(value) {
        display.value = value;
        if (display.value === '') {
            display.placeholder = '0';
        }
    }
});

