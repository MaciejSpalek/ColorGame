const checkDuration = 10000;
const fadeDuration = 0;
const score = [];

let bar;
let squareSize;
let currentPercent;
let scoreCounter = 0;

// wylosowane kolory na samym początku
let drawRed = 0;
let drawGreen = 0;
let drawBlue = 0;

// kolory ustawione przez player'a
let checkRed = 0;
let checkGreen = 0;
let checkBlue = 0;

// timeoutsy
let firstTimeOut;
let secondTimeOut;

function addScore() {
    score[scoreCounter] = $('<div>').addClass('score').text((scoreCounter+1) + ".  " + currentPercent);
    $('.list-layer').append(score[scoreCounter]);
}
function randNumber(min, max) {
    return Math.round(Math.random()*max + min);
}
function setCssVariable(cssVariable, currentValue) {
    document.documentElement.style.setProperty(cssVariable, currentValue);
}
function updateValue(cssVariable,  sliderClass) {  
    setCssVariable(cssVariable, parseInt($(sliderClass).val())); // ustawia zmienną css'ową na daną wartość slidera
    setGlobalVariable(sliderClass)
}
function setGlobalVariable(sliderClass) {
    if(sliderClass == '.redInput') {
        checkRed = parseInt($(sliderClass).val());
    }
    else if(sliderClass == '.greenInput'){
        checkGreen = parseInt($(sliderClass).val());
    } 
    else  {
        checkBlue = parseInt($(sliderClass).val());
    }
}
function setColor() {
    firstTimeOut = setTimeout(()=> {
        checkLayer();
    }, checkDuration)
}

function deleteProgressBar() {
    $(bar).remove();
}

function addProgressBar(destination) {
            bar = $('<div>').addClass('my-progress-bar');
            $(destination).append(bar);
            $(bar).circularProgress({
                width: squareSize,
                height: squareSize,
                line_width:10,
                color: "rgba(0, 0, 0, .25)",
                starting_position: 0,
                percent: 0
            }).circularProgress('animate', 100, checkDuration);
}

function fadeLayer(show, element, duration) {
    if(show) {
        $(element).css('display', 'flex').fadeIn(duration); 
    } else {
        $(element).css('display', 'none').fadeOut(duration); 
    }
    
}

function checkLayer() {
    fadeLayer(true, '.check-layer', fadeDuration);
    addProgressBar('.check-layer .player-square'); 
    
    secondTimeOut = setTimeout(()=>{ 
        compareColors();
        addScore();
        fadeLayer(true, '.end-layer', fadeDuration);
        scoreCounter++;
    }, checkDuration);
    
}

function compareColors() {

    // algoryt I

    // const redDeviation = drawRed-checkRed
    // const greenDeviation = drawGreen-checkGreen;
    // const blueDeviation = drawBlue-checkBlue;
    // // const distance = Math.sqrt(Math.pow(redDeviation, 2) + Math.pow(greenDeviation, 2) + Math.pow(blueDeviation, 2))
    // // const percent = Math.floor(100 - (distance/Math.sqrt(3*Math.pow(255, 2)))*100) +"%";
    // const distance = Math.sqrt(redDeviation*redDeviation + greenDeviation*greenDeviation + blueDeviation*blueDeviation);
    // console.log(distance)
    // const percent = Math.floor(100 - (distance/442)*100) +"%"


// algorytm II
    const rmean = (drawRed+checkRed)/2;
    const r = drawRed-checkRed
    const g = drawGreen-checkGreen;
    const b = drawBlue-checkBlue;
    const weightR = 2 + rmean/256;
    const weightG = 4.0;
    const weightB = 2 + (255-rmean)/256;
    const d1 =  Math.sqrt(weightR*r*r + weightG*g*g + weightB*b*b);
    const maxColDist = 764.8339663572415;
    const s1 = Math.round(((maxColDist-d1)/maxColDist)*100) + "%";
    currentPercent = s1;
    $('.result-text').text(s1);
}

function changeButtonState(element, isOff) {
    if(isOff) {
        $(element).prop('disabled', isOff).css({
            'background-color': 'rgb(95, 30, 0)',
            'box-shadow': 'inset -.1em -.1em .2em .05em rgb(27, 9, 0), .03em .03em .01em .01em rgb(12, 4, 0)'
        }); 
    } else {
        $(element).prop('disabled', isOff).css({
            'background-color': 'rgb(223, 70, 0)',
            'box-shadow': 'inset -.1em -.1em .2em .05em rgb(95, 30, 0), .03em .03em .01em .01em rgb(12, 4, 0)'
        }); 
    }
    
    
}
function drawButton() {
    $('.drawButton').click(()=> {

        // zablokowanie przycisku
        changeButtonState('.drawButton', true);
        changeButtonState('.listButton', true);
        
        // losuje liczby do rgb() w css'ie
        drawRed = randNumber(0, 255);
        drawGreen = randNumber(0, 255);
        drawBlue = randNumber(0, 255);
        
        // ustawia zmiennym wylosowaną wartość
        setCssVariable('--drawRed', drawRed)
        setCssVariable('--drawGreen', drawGreen)
        setCssVariable('--drawBlue', drawBlue)   

        setColor(); 
    })
}
function sliders() {
    $('.redInput').on('change mousemove touchmove', updateValue.bind(this, "--checkRed", '.redInput'));
    $('.greenInput').on('change mousemove touchmove', updateValue.bind(this, "--checkGreen", '.greenInput'));
    $('.blueInput').on('change mousemove touchmove', updateValue.bind(this, "--checkBlue", '.blueInput'));  
}
function cross() {
    $('.cross').click(() => {
        restart();
    })
}
function setDefaultSliderPosition() {
    $('.redInput').val(0);
    $('.greenInput').val(0);
    $('.blueInput').val(0);
}
function restart() {
    changeButtonState('.drawButton', false);
    changeButtonState('.listButton', false);
    fadeLayer(false, '.check-layer', 0);
    fadeLayer(false, '.end-layer', 0);
    setCssVariable('--drawRed', 0);
    setCssVariable('--drawGreen', 0);
    setCssVariable('--drawBlue', 0);
    setCssVariable('--checkRed', 0);
    setCssVariable('--checkGreen', 0);
    setCssVariable('--checkBlue', 0);
    setDefaultSliderPosition();
    deleteProgressBar();
    clearTimeout(firstTimeOut); 
    clearTimeout(secondTimeOut); 
    
}
function list() {
    $('.listButton, .list-layer .flaticon-close').click(() => { 
        $('.list-layer').slideToggle(1500, 'easeOutBounce');
    }); 
}

function resize() {
    $(window).on('resize', () => {
        squareSize = $('.square').css("width");
    });
}

$('.list-layer').fadeOut(0);

// nasłuchiwania
drawButton();
sliders();
cross();  
list();
resize();




