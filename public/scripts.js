document.addEventListener('DOMContentLoaded', () => {
    const selectCursos = document.getElementById('selectCursos');
    const asignaturasInputs = document.getElementById('asignaturasInputs');
    const formularioDatos = document.getElementById('formularioDatos');
    const graficoRendimiento = document.getElementById('graficoRendimiento').getContext('2d');
    const verAnalisisBtn = document.getElementById('verAnalisisBtn');
    let chart;

    let notasGuardadas = {};

    console.log('Script cargado y DOMContentLoaded event capturado');

    selectCursos.addEventListener('change', function() {
        generarCamposCursos();
    });

    function generarCamposCursos() {
        asignaturasInputs.innerHTML = ''; // Limpia los inputs anteriores
        const numCursos = parseInt(selectCursos.value);

        if (numCursos) {
            for (let i = 0; i < numCursos; i++) {
                const cursoDiv = document.createElement('div');
                cursoDiv.classList.add('curso-section');

                const cursoLabel = document.createElement('h3');
                cursoLabel.textContent = `Notas de las asignaturas del ${obtenerDescripcionCurso(i, numCursos)}:`;
                cursoDiv.appendChild(cursoLabel);
                cursoLabel.classList.add('curso-label');

                const numAsignaturasLabel = document.createElement('label');
                numAsignaturasLabel.textContent = `   - Nº de asignaturas del ${obtenerDescripcionCurso(i, numCursos)}:`;
                cursoDiv.appendChild(numAsignaturasLabel);
                numAsignaturasLabel.classList.add('asignatura-label');

                const numAsignaturasInput = document.createElement('input');
                numAsignaturasInput.type = 'number';
                numAsignaturasInput.min = 1;
                numAsignaturasInput.max = 20;
                numAsignaturasInput.placeholder = 'Número de asignaturas';
                numAsignaturasInput.classList.add('input-num-asignaturas');
                numAsignaturasInput.value = notasGuardadas[`curso${i + 1}`] ? notasGuardadas[`curso${i + 1}`].numAsignaturas : ''; // Mantener el valor

                cursoDiv.appendChild(numAsignaturasInput);

                const notasDiv = document.createElement('div');
                notasDiv.classList.add('notas-asignaturas');
                cursoDiv.appendChild(notasDiv);

                // Si ya hay asignaturas guardadas, generar los campos automáticamente
                if (numAsignaturasInput.value) {
                    generarNotasAsignaturas(notasDiv, i, parseInt(numAsignaturasInput.value));
                }

                numAsignaturasInput.addEventListener('change', function() {
                    guardarNotasCurso(i); // Guardar notas cada vez que cambie el número de asignaturas
                    generarNotasAsignaturas(notasDiv, i, parseInt(this.value));
                });

                asignaturasInputs.appendChild(cursoDiv);
            }
        }
    }

    // Generar campos de notas para cada asignatura
    function generarNotasAsignaturas(notasDiv, cursoIndex, numAsignaturas) {
        notasDiv.innerHTML = ''; // Limpia los inputs de notas previos

        const notasExistentes = notasGuardadas[`curso${cursoIndex + 1}`] ? notasGuardadas[`curso${cursoIndex + 1}`].notas : {};

        for (let j = 0; j < numAsignaturas; j++) {
            const notaLabel = document.createElement('label');
            notaLabel.textContent = `Asignatura ${j + 1}: `;
            const notaInput = document.createElement('input');
            notaInput.type = 'number';
            notaInput.min = 0;
            notaInput.step = 0.001;
            notaInput.max = 10;
            notaInput.placeholder = 'Nota';
            notaInput.name = `curso${cursoIndex + 1}Asignatura${j + 1}`;

            // Rellenar con las notas existentes si están disponibles
            if (notasExistentes[`Asignatura${j + 1}`]) {
                notaInput.value = notasExistentes[`Asignatura${j + 1}`];
            }

            notasDiv.appendChild(notaLabel);
            notasDiv.appendChild(notaInput);
            notaLabel.classList.add('nota-label');
            notasDiv.appendChild(document.createElement('br'));
        }
        checkInputs();
    }

    // Guarda las notas del curso actual en el objeto notasGuardadas
    function guardarNotasCurso(cursoIndex) {
        const notasDiv = asignaturasInputs.querySelectorAll('.curso-section')[cursoIndex].querySelector('.notas-asignaturas');
        const inputs = notasDiv.querySelectorAll('input');

        const notas = {};
        inputs.forEach((input, index) => {
            if (input.value) {
                notas[`Asignatura${index + 1}`] = input.value;
            }
        });

        notasGuardadas[`curso${cursoIndex + 1}`] = {
            numAsignaturas: inputs.length,
            notas: notas
        };
    }


    formularioDatos.addEventListener('submit', async function(event) {
        event.preventDefault(); // Evitar el comportamiento por defecto del formulario

        console.log('Submit formulario capturado');

        const formData = new FormData(formularioDatos);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        data.cantidadCursos = selectCursos.value;

        console.log('Datos enviados:', data);

        try {
            const response = await fetch('/api/rendimientos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const result = await response.json();
            console.log('Respuesta del servidor:', result);

            generarGrafico(result);
        } catch (error) {
            console.error('Error:', error);
        }
    });

    function checkInputs() {
        const inputs = asignaturasInputs.querySelectorAll('input');
        let isAnyInputFilled = false;

        inputs.forEach(input => {
            if (input.value.trim() !== '') {
                isAnyInputFilled = true;
            }
        });

        verAnalisisBtn.disabled = !isAnyInputFilled;
    }

    function obtenerDescripcionCurso(indice, totalCursos) {
        if (indice === 0) {
            return 'curso más reciente';
        } else if (indice === totalCursos - 1) {
            return 'curso más antiguo';
        } else {
            return `${indice + 1}º curso más reciente`;
        }
    }

    function generarGrafico(data) {

        //FUNCIONALIDAD MOSTRAR NOTAS MEDIAS AL LADO DEL GRAFICO
        const notasMediasLista = document.getElementById('notasMediasLista');
        notasMediasLista.innerHTML = '';

        const coloresPuntos = [
            'rgba(255, 99, 132, 1)',  // Rojo
            'rgba(0, 255, 0, 1)',  // Verde
            'rgba(153, 102, 255, 1)', // Púrpura
            'rgba(255, 159, 64, 1)'   // Naranja
        ];


        data.values.forEach((notaMedia, index) => {
            const li = document.createElement('li');
            li.textContent = `Curso ${index + 1}: ${notaMedia.toFixed(2)}`;

            li.style.setProperty('--color-cuadradito', coloresPuntos[index % coloresPuntos.length]);

            notasMediasLista.appendChild(li);
        });

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(graficoRendimiento, {
            type: 'line',
            data: {
                labels: data.labels, // Etiquetas para el gráfico
                datasets: [{
                    label: 'Rendimiento promedio por curso',
                    data: data.values, // Valores para el gráfico
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1,
                    pointBackgroundColor: coloresPuntos.slice(0, data.values.length),
                    pointBorderColor: 'rgba(75, 192, 192, 1)',
                    pointRadius: 8,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 10,
                        title: {
                            display: true,
                            text: 'Notas'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                        },
                        border: {
                            color: 'black',
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Cursos'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                        },
                        border: {
                            color: 'black',
                        }
                    }
                }
            }
        });
    }
});
