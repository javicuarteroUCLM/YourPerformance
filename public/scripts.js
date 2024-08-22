document.addEventListener('DOMContentLoaded', () => {
    const selectCursos = document.getElementById('selectCursos');
    const asignaturasInputs = document.getElementById('asignaturasInputs');
    const formularioDatos = document.getElementById('formularioDatos');
    const graficoRendimiento = document.getElementById('graficoRendimiento').getContext('2d');
    const verAnalisisBtn = document.getElementById('verAnalisisBtn');
    let chart;

    console.log('Script cargado y DOMContentLoaded event capturado');

    selectCursos.addEventListener('change', function() {
        asignaturasInputs.innerHTML = ''; // Limpia los inputs introducidos previamente
        const numCursos = parseInt(this.value);
        
        if (numCursos) {
            for (let i = 0; i < numCursos; i++) {
                const cursoDiv = document.createElement('div');
                cursoDiv.classList.add('curso-section');
                
                const cursoLabel = document.createElement('h3');
                cursoLabel.textContent = `Notas de las asignaturas del ${obtenerDescripcionCurso(i, numCursos)}:`;
                cursoDiv.appendChild(cursoLabel);

                const numAsignaturasLabel = document.createElement('label');
                numAsignaturasLabel.textContent = `Nº de asignaturas del ${obtenerDescripcionCurso(i, numCursos)}:`;
                cursoDiv.appendChild(numAsignaturasLabel);

                const numAsignaturasInput = document.createElement('input');
                numAsignaturasInput.type = 'number';
                numAsignaturasInput.min = 1;
                numAsignaturasInput.placeholder = 'Número de asignaturas';
                numAsignaturasInput.classList.add('input-num-asignaturas');
                cursoDiv.appendChild(numAsignaturasInput);

                const notasDiv = document.createElement('div');
                notasDiv.classList.add('notas-asignaturas');
                cursoDiv.appendChild(notasDiv);

                // Evento que genera la entrada manual de notas
                numAsignaturasInput.addEventListener('change', function() {
                    notasDiv.innerHTML = ''; // Limpia los inputs de notas previos
                    const numAsignaturas = parseInt(this.value);

                    for (let j = 0; j < numAsignaturas; j++) {
                        const notaLabel = document.createElement('label');
                        notaLabel.textContent = `Asignatura ${j + 1}: `;
                        const notaInput = document.createElement('input');
                        notaInput.type = 'number';
                        notaInput.min = 0;
                        notaInput.step = 0.001;
                        notaInput.max = 10;
                        notaInput.placeholder = 'Nota';
                        notaInput.name = `curso${i + 1}Asignatura${j + 1}`;

                        notasDiv.appendChild(notaLabel);
                        notasDiv.appendChild(notaInput);
                        notasDiv.appendChild(document.createElement('br'));
                    }

                });

                const inputs = asignaturasInputs.querySelectorAll('input');
                    inputs.forEach(input => {
                        input.addEventListener('input', function() {
                            checkInputs();
                        });
                    });

                asignaturasInputs.appendChild(cursoDiv);
            }
        }
    });

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
        if (chart) {
            chart.destroy();
        }

        chart = new Chart(graficoRendimiento, {
            type: 'line',
            data: {
                labels: data.labels, // Etiquetas para el gráfico
                datasets: [{
                    label: 'Rendimiento',
                    data: data.values, // Valores para el gráfico
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1,
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    pointBorderColor: 'rgba(75, 192, 192, 1)',
                    pointRadius: 5,
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
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Cursos'
                        }
                    }
                }
            }
        });
    }
});
