$(document).ready(function () {
    // var $ = $jQuery;
    var calculator = $('#calculator');
    var display = $('.display-container');
    var controls = $('.controls-container');
    var displayInput = display.children('#calc-display');
    // the operator selected
    var operator = null;
    // displayed solution upon pressing "equals"
    var solution = null;
    // first number's value
    var number1 = null;
    // secind number's value
    var number2 = null;
    // the modifier digit
    var modifier = "";
    // the post-calculation modifier
    var modifierQuotient = "";
    // has the current number been modified
    var modified = false;
    // has a decimal been typed yet in this number?
    var decimal = false;
    // should numbers append the current display?
    var append = false;
    // has this total been equaled yet?
    var equaled = null;
    // this checks to see if a number has been pressed after the operator or not
    var operatorInitiated = null;
    // memory storage
    var memory = 0;
    // should recall-clear clear?
    var recallClear = true;
    //time it takes for a held-down button to activate.
    var timeoutId = 0;

    $('body').on('mousedown', '.btn', function (e) {
        var btn = $(this);
        timeoutId = setTimeout(function () {
            if (btn.data('type') == "clear") {
                displayInput.val(0);
                number1 = null;
                number2 = null;
                operator = null;
                modifier = null;
                modifierQuotient = null;
            }
            else if (btn.data('type') == "memory") {
                if (btn.data('value') == "recall-clear") {
                    memory = 0;
                    recallClear = false;
                }
            }
        }, 1000);
    }).on('mouseup mouseleave', function () {
        clearTimeout(timeoutId);
    });


    $('body').on('click', '.btn', function(e){
        if($(this).data('type') == 'digit'){
            var digit = $(this).data('value');
            if(displayInput.val() == "" && digit == "."){
                displayInput.val('0');
            }
            // if this number already has a decimal, and the decimal is pressed again, ignore it.
            if(decimal == true && digit == "."){
                return;
            }
            // if the number is expected to be overwritten on keystroke, do so. 
            if(append == false){
                displayInput.val(digit);
                append = true;
            }
            else{
                displayInput.val(function(){
                    return this.value + digit;
                });
                if(digit == "."){
                    decimal = true;
                }
            }
            operatorInitiated = false;
        }
        else if($(this).data('type') == "operator"){
            if(equaled === false && operatorInitiated == false){
                equals();
                equaled = true;
            }
            operator = $(this).data('value');
            number1 = displayInput.val();
            decimal = false;
            append = false;
            solution = null;
            equaled = false;
            modified = false;
            currentOperation = operator;
            operatorInitiated = true;
        }
        else if($(this).data('type') == "modifier"){
            if($(this).data('value') == "%"){
                if(modified == true){
                    number1 = displayInput.val();
                    modifiedQuotient = eval(modifier / 100 * number1);
                    solution = eval(number1 + currentOperation + modifiedQuotient);
                }
                else{
                    modifier = displayInput.val();
                    modifiedQuotient = eval(modifier / 100 * number1);
                    solution = eval(number1 + currentOperation + modifiedQuotient);
                    modified = true;
                }
                displayInput.val(solution);
            }
            if($(this).data('value') == "sqrt"){
                solution = Math.sqrt(displayInput.val());
                displayInput.val(solution);
            }
            if($(this).data('value') == "pos-neg"){
                solution = eval(displayInput.val() * -1);
                displayInput.val(solution);
            }
        }
        else if($(this).data('type') == "memory"){
            if($(this).data('value') == "+"){
                memory = eval( memory + parseInt(displayInput.val()) );
                append = false;
            }
            else if ($(this).data('value') == "-"){
                memory = eval( memory - parseInt(displayInput.val()) );
                append = false;
            }
            else if ($(this).data('value') == "recall-clear"){
                if(recallClear != false){
                    displayInput.val(memory);
                }
                recallClear = true;
            }
        }
        else if($(this).data('type') == "equals"){
            equals();
            equaled = true;
            modified = false;
        }
        else if($(this).data('type') == 'clear'){
            displayInput.val(0);
            decimal = false;
            solution = null;
            modified = false;
            append = false;
            decimal = false;
            solution = null;
        }
        else{
        }
    });

    function equals(){
        if (solution != null) {
            solution = eval(solution + currentOperation + number2);
        }
        else {
            number2 = displayInput.val();
            solution = eval(number1 + currentOperation + number2);
        }
        append = false;
        displayInput.val(solution);
    }

}); // end doc ready
