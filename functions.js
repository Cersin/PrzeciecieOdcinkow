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

// sprawdzenie czy koniec odcinka lezy na linii
function sprawdzKoniec(X1, X2, Y1, Y2, Z1, Z2) {
    return Math.min(Number(X1), Number(Y1)) <= Number(Z1)
        && Number(Z1) <= Math.max(Number(X1), Number(Y1))
        && Math.min(Number(X2), Number(Y2)) <= Number(Z2)
        && Number(Z2) <= Math.max(X2, Y2);
}

// funkcja sprawdzajaca przecinanie
function sprawdzPrzecinanie(A1, A2, B1, B2, C1, C2, D1, D2) {
    let v1 = iloczynWektorowy(C1, C2, D1, D2, A1, A2); // C, D, A
    let v2 = iloczynWektorowy(C1, C2, D1, D2, B1, B2); // C, D, B
    let v3 = iloczynWektorowy(A1, A2, B1, B2, C1, C2); // A, B, C
    let v4 = iloczynWektorowy(A1, A2, B1, B2, D1, D2); // A, B, D

    // sprawdza czy precinają się w punkcie
    if ((v1 > 0 && v2 < 0 || v1 < 0 && v2 > 0) && (v3 > 0 && v4 < 0 || v3 < 0 && v4 > 0)) return 1;

    // sprawdza czy odcinki stykają się w przedziale
    if (v1 === 0 && v2 === 0 && v3 === 0 && v4 === 0 && (sprawdzKoniec(C1, C2, D1, D2, A1, A2) || sprawdzKoniec(C1, C2, D1, D2, B1, B2) || sprawdzKoniec(A1, A2, B1, B2, C1, C2) || sprawdzKoniec(A1, A2, B1, B2, D1, D2)))
        return 3;

    // sprawdza, czy odcinki stykają się końcami
    if (v1 === 0 && sprawdzKoniec(C1, C2, D1, D2, A1, A2)) return 2;
    if (v2 === 0 && sprawdzKoniec(C1, C2, D1, D2, B1, B2)) return 2;
    if (v3 === 0 && sprawdzKoniec(A1, A2, B1, B2, C1, C2)) return 2;
    if (v4 === 0 && sprawdzKoniec(A1, A2, B1, B2, D1, D2)) return 2;

    return 0;
}

// wyznacza punkt przeciecia
function punktPrzeciecia(czyWspolrzedne, A1, A2, B1, B2, C1, C2, D1, D2) {
    let przeciecie = {
        x: null,
        y: null,
        x1: null,
        x2: null,
        y1: null,
        y2: null
    }

    // gdy są współliniowe
    if (czyWspolrzedne) {
        if (A1 === C1 && B1 === D1 && A2 === C2 && B2 === D2) {
            przeciecie.x1 = A1;
            przeciecie.x2 = A2;
            przeciecie.y1 = B1;
            przeciecie.y2 = B2;
            return przeciecie;
        }

        // poziomo
        if (A1 === C1 && B1 === D1) {
            przeciecie.x1 = A1;
            przeciecie.y1 = C1;
            przeciecie.x2 = Math.max(A2, C2);
            przeciecie.y2 = Math.min(B2, D2);

            if (Number(A2) > Number(B2)) {
                przeciecie.x2 = Math.min(A2, C2);
                przeciecie.y2 = Math.max(B2, D2);
            }

            if (Number(B2) < Number(C2)) {
                przeciecie.y2 = C2;
            }
        }

        // pionowo
        if (A2 === C2 && B2 === D2) {
            przeciecie.x2 = A2;
            przeciecie.y2 = C2;
            przeciecie.x1 = Math.max(A1, C1);
            przeciecie.y1 = Math.min(B1, D1);

            if (Number(A1) > Number(B1)) {
                przeciecie.x1 = Math.min(A1, C1);
                przeciecie.y1 = Math.max(B1, D1);
                if (Number(D1) >= Number(A1)) {
                    przeciecie.y1 = A1;
                }
                if (Number(C1) <= Number(D1)) {
                    przeciecie.x1 = D1;
                }
            }
        }
    }

    // skrzyżowanie (prostej przez A,B) z (prostą przez C,D):
    przeciecie.x = ((B1 - A1) * (D1 * C2 - D2 * C1) - (D1 - C1) * (B1 * A2 - B2 * A1)) / ((B2 - A2) * (D1 - C1) - (D2 - C2) * (B1 - A1));
    przeciecie.y = ((D2 - C2) * (B1 * A2 - B2 * A1) - (B2 - A2) * (D1 * C2 - D2 * C1)) / ((D2 - C2) * (B1 - A1) - (B2 - A2) * (D1 - C1));
    przeciecie.x = przeciecie.x.toFixed(1);
    przeciecie.y = przeciecie.y.toFixed(1);
    console.log(przeciecie);
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
    // sprawdza, czy wprowadzone liczby są o typie number
    if (isNaN(punktA1.value) || isNaN(punktA2.value)
        || isNaN(punktB1.value) || isNaN(punktB2.value)
        || isNaN(punktC1.value) || isNaN(punktC2.value)
        || isNaN(punktD1.value) || isNaN(punktD2.value)) {
        display.innerHTML = 'Dane źle wprowadzone, proszę użyć liczb oraz kropki, jeśli chcemy podać liczbę po przecinku';
        return;
    }

    // wyznacza wartości linii
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

    // sprawdza przecinanie
    let czyPrzeciete = sprawdzPrzecinanie(line1.startX, line1.startY, line1.endX, line1.endY, line2.startX, line2.startY, line2.endX, line2.endY);

    // definiuje punkt przeciecia
    let przeciecie = {
        x: null,
        y: null,
        x1: null,
        x2: null,
        y1: null,
        y2: null,
    }

    // rysuje odcinki
    context.clearRect(0, 0, 400, 300);
    canvas.width = canvasContainer.offsetWidth;
    canvas.height = canvasContainer.offsetHeight;
    drawLine(line1, '#be1b1b', "A", "B");
    drawLine(line2, '#1b72be', "C", "D");

    // jesli przecina to rysuje punkt przeciecia
    if (czyPrzeciete === 1 || czyPrzeciete === 2) {
        przeciecie = punktPrzeciecia(false, line1.startX, line1.startY, line1.endX, line1.endY, line2.startX, line2.startY, line2.endX, line2.endY);
        drawPoint(przeciecie.x, przeciecie.y, 'green');
    } else if (czyPrzeciete === 3) {
        przeciecie = punktPrzeciecia(true, line1.startX, line1.startY, line1.endX, line1.endY, line2.startX, line2.startY, line2.endX, line2.endY);
    }

    // wyświetla tekst z przecięciem
    if (czyPrzeciete === 1) {
        display.innerHTML = 'Odcinki przecinają się w punkcie:<br> x = ' + przeciecie.x + ', y = ' + przeciecie.y;
    } else if (czyPrzeciete === 2) {
        display.innerHTML = 'Odcinki stykają się w punkcie :<br> x = ' + przeciecie.x + ', y = ' + przeciecie.y;
    } else if (czyPrzeciete === 3) {
        display.innerHTML = 'Odcinki stykają się od :<br> x = (' + przeciecie.x1 + ',' + przeciecie.x2 + ') do y = (' + przeciecie.y1 + ',' + przeciecie.y2 + ')';
    } else {
        display.innerHTML = 'Odcinki nie przecinają się, ani nie stykają'
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
