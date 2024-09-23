let archivo = null;
let contenidoSVG = null;
let offsetX = 175.0;
let offsetY = 150.0;
let escala = 1.0;
let vertices = [];
let nombreArchivo = "";
const offsetAdvance = 10;  // Valor de avance del offset
let graficoXY;

// const ctx = document.getElementById('graficoXY').getContext('2d');

crearGrafico();

function crearGrafico(puntos = []) {
    console.log('Graficando...');

    const ctx = document.getElementById('graficoXY').getContext('2d');
    const data = puntos.length > 0
        ? puntos.map(p => ({ x: p[0], y: p[1] })) // Mapear los puntos al formato adecuado
        : []; // Si no hay puntos, data es vacío

    // Verificar si ya existe un gráfico, y destruirlo si es así
    if (graficoXY) {
        graficoXY.destroy();
    }

    // Datos para la circunferencia
    const radius1 = 270;
    const circleData1 = [];
    const numPoints1 = 100;
    for (let i = 0; i <= numPoints1; i++) {
        const angle1 = (i / numPoints1) * 2 * Math.PI; // Ángulo en radianes
        circleData1.push({
            x: radius1 * Math.cos(angle1),
            y: radius1 * Math.sin(angle1)
        });
    }

    // Datos para la circunferencia
    const radius = 170;
    const circleData = [];
    const numPoints = 100;
    for (let i = 0; i <= numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI; // Ángulo en radianes
        circleData.push({
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle)
        });
    }

    graficoXY = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Ejes X e Y',
                    data: data,
                    borderColor: 'rgba(0, 0, 0, 100)', // No mostrar puntos
                    showLine: true,
                    fill: true
                },
                {
                    label: 'Circunferencia de 270',
                    data: circleData1,
                    borderColor: 'rgba(255, 0, 0, 0.5)', // Color de la circunferencia
                    showLine: true, // Mostrar como línea
                    fill: false // No llenar la circunferencia
                },
                {
                    label: 'Circunferencia de 170',
                    data: circleData,
                    borderColor: 'rgba(255, 0, 0, 0.5)', // Color de la circunferencia
                    showLine: true, // Mostrar como línea
                    fill: false // No llenar la circunferencia
                }
            ]
        },
        options: {
            // responsive: true,  // Asegurar que el gráfico sea responsivo
            // maintainAspectRatio: false,  // Permitir ajuste de relación de aspecto
            layout: {
                padding: 20
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Eje X'
                    },
                    ticks: {
                        beginAtZero: true
                    },
                    min: 0,
                    max: 300
                },
                y: {
                    title: {
                        display: true,
                        text: 'Eje Y'
                    },
                    ticks: {
                        beginAtZero: true
                    },
                    min: 0,
                    max: 300
                }
            },
            plugins: {
                legend: {
                    display: false // Ocultar leyenda
                }
            },
            aspectRatio: 1
        }
    });

    return graficoXY;
}

function obtenerVerticesSVG(svgContent, offsetX = 175.0, offsetY = 150.0, escala = 1.0) {
    vertices = [];

    // Parsear el archivo SVG
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(svgContent, "image/svg+xml");

    // Función para procesar coordenadas con desplazamiento y escala
    function procesarCoordenadas(coordenadas) {
        let puntos = coordenadas.trim().split(/[\s,]+/);
        let resultado = [];

        for (let i = 0; i < puntos.length; i += 2) {
            let x = parseFloat(puntos[i]) * escala + offsetX;
            let y = parseFloat(puntos[i + 1]) * escala + offsetY;
            resultado.push([x, y]);
        }

        return resultado;
    }

    // Iterar sobre los elementos del SVG
    let elementos = xmlDoc.getElementsByTagName("*");

    for (let elem of elementos) {
        // Si es una etiqueta 'polygon' o 'polyline'
        if (elem.tagName === 'polygon' || elem.tagName === 'polyline') {
            let puntos = elem.getAttribute('points');
            if (puntos) {
                vertices = vertices.concat(procesarCoordenadas(puntos));
            }
        }

        // Si es una etiqueta 'path'
        if (elem.tagName === 'path') {
            let d = elem.getAttribute('d');
            if (d) {
                // Extraer coordenadas de los comandos 'M', 'L' (mover y línea)
                let comandos = d.match(/[ML]\s*([\d\.,\s]+)/g);
                if (comandos) {
                    comandos.forEach(comando => {
                        let coordenadas = comando.slice(1).trim();
                        vertices = vertices.concat(procesarCoordenadas(coordenadas));
                    });
                }
            }
        }
    }

    // Cerrar la figura si es necesario
    if (vertices.length > 0) {
        vertices.push(vertices[0]);  // Añadir el primer vértice al final
    }

    // console.log(vertices);
    crearGrafico(vertices)
}

function seleccionarArchivo() {
    // Crear un input para seleccionar el archivo
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.svg';  // Solo permite archivos SVG

    input.onchange = (event) => {
        let file = event.target.files[0];

        if (file) {
            archivo = file;
            nombreArchivo = file.name.split('.')[0]; // Obtener el nombre del archivo sin extensión
            vertices = []; // Limpiar los vértices

            // Leer el archivo y procesar
            let reader = new FileReader();
            reader.onload = function (e) {
                contenidoSVG = e.target.result;
                // Aquí puedes añadir la lógica para procesar el archivo SVG
                obtenerVerticesSVG(contenidoSVG)
                // Por ejemplo, extraer sus vértices y graficarlos en los ejes
                console.log("Archivo seleccionado:", archivo.name);
                console.log("Nombre del archivo:", nombreArchivo);
            };
            reader.readAsText(file);
        }
    };

    // Simular el clic en el input para abrir el cuadro de diálogo de selección
    input.click();

}

function increaseXOffset() {
    offsetX += offsetAdvance;
    console.log(`El valor del offset x es: ${offsetX}`);
    obtenerVerticesSVG(contenidoSVG, offsetX, offsetY, escala);
}

function increaseYOffset() {
    offsetY += offsetAdvance;
    console.log(`El valor del offset y es: ${offsetY}`);
    obtenerVerticesSVG(contenidoSVG, offsetX, offsetY, escala);
}

function decreaseXOffset() {
    offsetX -= offsetAdvance;
    console.log(`El valor del offset x es: ${offsetX}`);
    obtenerVerticesSVG(contenidoSVG, offsetX, offsetY, escala);
}

function decreaseYOffset() {
    offsetY -= offsetAdvance;
    console.log(`El valor del offset y es: ${offsetY}`);
    obtenerVerticesSVG(contenidoSVG, offsetX, offsetY, escala);
}

function increaseEscala() {
    escala += 0.5;
    console.log(`El valor de la escala es: ${escala}, ${offsetX}, ${offsetY}`);
    obtenerVerticesSVG(contenidoSVG, offsetX, offsetY, escala);
}

function decreaseEscala() {
    escala -= 0.5;
    console.log(`El valor de la escala es: ${escala}`);
    obtenerVerticesSVG(contenidoSVG, offsetX, offsetY, escala);
}

function downloadFile(posiciones = vertices) {
    // Definir los parámetros
    const nombreArchivo = 'archivo'; // Cambia esto por el nombre que necesites
    const grosor = parseFloat(document.getElementById('grosor_capas').value); // Obtén el grosor de un input HTML
    const capas = parseInt(document.getElementById('capas').value); // Obtén el número de capas de un input HTML

    let grosCapas = grosor;
    let contenido = '';

    for (let i = 1; i <= capas; i++) {
        let row = 0;
        for (let posicion of posiciones) {
            if (row) {
                contenido += `G1 X${(posicion[0] / 10).toFixed(2)} Y${(posicion[1] / 10).toFixed(2)} E0.94529\n`;
            } else {
                contenido += `G0 F600 X${(posicion[0] / 10).toFixed(2)} Y${(posicion[1] / 10).toFixed(2)} Z${grosCapas.toFixed(1)}\n`;
            }
            row++;
        }
        grosCapas += grosor;
    }

    // Crear un blob y un enlace para la descarga
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombreArchivo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`Contenido escrito en ${nombreArchivo}.txt exitosamente.`);
}

function clearPlaceholder(input) {
    // Borra el texto del placeholder cuando el input recibe foco
    input.placeholder = '';
}