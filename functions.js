const punktA1 = document.getElementById('punktA1'),
    punktA2 = document.getElementById('punktA2'),
    punktB1 = document.getElementById('punktB1'),
    punktB2 = document.getElementById('punktB2'),
    punktC1 = document.getElementById('punktC1'),
    punktC2 = document.getElementById('punktC2'),
    punktD1 = document.getElementById('punktD1'),
    punktD2 = document.getElementById('punktD2'),
    canvas = document.getElementById('canvas');
context = document.getElementById('canvas').getContext('2d');
display = document.getElementById('results');
canvasContainer = document.getElementById('canvas-container');


function iloczynWektorowy(X1, X2, Y1, Y2, Z1, Z2) {
    const x1 = Z1 - X1;
    const y1 = Z2 - X2;
    const x2 = Y1 - X1;
    const y2 = Y2 - X2;

    return (x1 * y2) - (x2 * y1);
}

/* sprawdzenie czy koniec odcinka lezy na linii */
function sprawdzKoniec(X1, X2, Y1, Y2, Z1, Z2) {
    return Math.min(Number(X1), Number(Y1)) <= Number(Z1) && Number(Z1) <= Math.max(Number(X1), Number(Y1)) && Math.min(Number(X2), Number(Y2)) <= Number(Z2)
}

function sprawdzPrzecinanie(A1, A2, B1, B2, C1, C2, D1, D2) {
    v1 = iloczynWektorowy(C1, C2, D1, D2, A1, A2); // C, D, A
    v2 = iloczynWektorowy(C1, C2, D1, D2, B1, B2); // C, D, B
    v3 = iloczynWektorowy(A1, A2, B1, B2, C1, C2); // A, B, C
    v4 = iloczynWektorowy(A1, A2, B1, B2, D1, D2); // A, B, D

    if ((v1 > 0 && v2 < 0 || v1 < 0 && v2 > 0) && (v3 > 0 && v4 < 0 || v3 < 0 && v4 > 0)) {
        return 1;
    }

    if (v1 === 0 && sprawdzKoniec(C1, C2, D1, D2, A1, A2)) {
        return 2;
    }
    if (v2 === 0 && sprawdzKoniec(C1, C2, D1, D2, B1, B2)) {
        return 2;
    }
    if (v3 === 0 && sprawdzKoniec(A1, A2, B1, B2, C1, C2)) {
        return 2;
    }
    if (v4 === 0 && sprawdzKoniec(A1, A2, B1, B2, D1, D2)) {
        return 2;
    }

    return 0;
}

function punktPrzeciecia(A1, A2, B1, B2, C1, C2, D1, D2) {
    let przeciecie = {
        x: null,
        y: null
    }

    if (A1 === C1 && B1 === D1) {
        przeciecie.x = "wielu";
        przeciecie.y = "wielu";
        return przeciecie;
    }

    // skrzyżowanie (prostej przez A,B) z (prostą przez C,D):
    przeciecie.x = ((B1 - A1) * (D1 * C2 - D2 * C1) - (D1 - C1) * (B1 * A2 - B2 * A1)) / ((B2 - A2) * (D1 - C1) - (D2 - C2) * (B1 - A1));
    przeciecie.y = ((D2 - C2) * (B1 * A2 - B2 * A1) - (B2 - A2) * (D1 * C2 - D2 * C1)) / ((D2 - C2) * (B1 - A1) - (B2 - A2) * (D1 - C1));
    przeciecie.x = przeciecie.x.toFixed(1);
    przeciecie.y = przeciecie.y.toFixed(1);
    return przeciecie;
}


function drawPoint(x, y, color) {
    context.fillStyle = color || 'black';
    context.beginPath();
    context.arc(x, y, 5, 0, 2 * Math.PI, true);
    context.fill();
};

function drawLine(line, color, text1, text2) {
    color = color || 'black';
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(line.startX, line.startY);
    context.lineTo(line.endX, line.endY);
    context.fillText(text1, line.startX, line.startY);
    context.fillText(text2, line.endX, line.endY);
    context.stroke();
};

function aktualizuj() {
    const line1 = {
            startX: punktA1.value,
            startY: punktA2.value,
            endX: punktB1.value,
            endY: punktB2.value
        },
        line2 = {
            startX: punktC1.value,
            startY: punktC2.value,
            endX: punktD1.value,
            endY: punktD2.value
        };

    let czyPrzeciete = sprawdzPrzecinanie(line1.startX, line1.startY, line1.endX, line1.endY, line2.startX, line2.startY, line2.endX, line2.endY);
    let przeciecie = {
        x: null,
        y: null
    }

    context.clearRect(0, 0, 400, 300);
    canvas.width = canvasContainer.offsetWidth;
    canvas.height = canvasContainer.offsetHeight;
    drawLine(line1, '#be1b1b', "A", "B");
    drawLine(line2, '#1b72be', "C", "D");
    if (czyPrzeciete === 1 || czyPrzeciete === 2) {
        przeciecie = punktPrzeciecia(line1.startX, line1.startY, line1.endX, line1.endY, line2.startX, line2.startY, line2.endX, line2.endY);
        drawPoint(przeciecie.x, przeciecie.y, 'green');
    }

    if (czyPrzeciete === 1) {
        display.innerHTML = 'Proste przecinają się w punkcie:<br> x = ' + przeciecie.x + ', y = ' + przeciecie.y;
    } else if (czyPrzeciete === 2) {
        display.innerHTML = 'Proste stykają się w punkcie:<br> x = ' + przeciecie.x + ', y = ' + przeciecie.y;
    } else {
        display.innerHTML = 'Proste nie przecinają się, ani nie stykają'
    }
}

aktualizuj();

punktA1.onchange = aktualizuj;
punktA2.onchange = aktualizuj;
punktB1.onchange = aktualizuj;
punktB2.onchange = aktualizuj;
punktC1.onchange = aktualizuj;
punktC2.onchange = aktualizuj;
punktD1.onchange = aktualizuj;
punktD2.onchange = aktualizuj;
window.onresize = aktualizuj;
