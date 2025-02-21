document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los selects de Materialize.
    var selects = document.querySelectorAll('select');
    M.FormSelect.init(selects);

    // --- Obtener datos de Diócesis y Parroquias desde la WebApp ---

    // ¡¡¡ DEFINE LA URL *ANTES* DE USARLA !!!
    const url = "https://script.google.com/macros/s/AKfycbyrETpCS5xhp28diUHwVR0LKmU9TLU6hdKu3WAXnMfMU8teLI--bFui7LR3c6WOCskr/exec"; //  ¡¡¡ REEMPLAZA CON LA URL REAL DE TU WEBAPP !!!

    fetch(url) //  Ahora 'url' está definida, y fetch puede usarla.
        .then(response => response.json())
        .then(data => {
            const diocesisData = data.diocesis;
            const parroquiasData = data.parroquias;

            function llenarSelectDiocesis() {
                const diocesisSelect = document.getElementById('diocesis');
                diocesisData.forEach(diocesis => {
                    const option = document.createElement('option');
                    option.value = diocesis.id;
                    option.textContent = diocesis.nombre;
                    diocesisSelect.appendChild(option);
                });
                M.FormSelect.init(diocesisSelect);
            }

            function llenarSelectParroquias(diocesisId) {
                const parroquiaSelect = document.getElementById('parroquia');
                parroquiaSelect.innerHTML = '<option value="" disabled selected>Selecciona una Parroquia</option>';

                if (parroquiasData[diocesisId]) {
                    parroquiasData[diocesisId].forEach(parroquia => {
                        const option = document.createElement('option');
                        option.value = parroquia.id;
                        option.textContent = parroquia.nombre;
                        parroquiaSelect.appendChild(option);
                    });
                }
                M.FormSelect.init(parroquiaSelect);
            }


            function generarOpcionesHoras() {
                const horas = [];
                for (let i = 0; i < 24; i++) {
                    for (let j = 0; j < 60; j += 30) {
                        const hora = String(i).padStart(2, '0');
                        const minuto = String(j).padStart(2, '0');
                        horas.push(`${hora}:${minuto}`); // Correcto: template literal.
                    }
                }
                return horas;
            }

            function llenarSelectsHoras() {
                const horas = generarOpcionesHoras();
                const selectIds = ['horaViernes1', 'horaViernes2', 'horaSabado', 'horaDomingo'];

                selectIds.forEach(selectId => {
                    const select = document.getElementById(selectId);
                    select.innerHTML = '<option value="" disabled selected>Selecciona una hora</option>'; // Limpiar.

                    horas.forEach(hora => {
                        const option = document.createElement('option');
                        option.value = hora;
                        option.textContent = hora;
                        select.appendChild(option);
                    });
                    M.FormSelect.init(select);
                });
            }


            // Evento change para el select de diócesis.
            document.getElementById('diocesis').addEventListener('change', function() {
                const diocesisId = this.value;
                llenarSelectParroquias(diocesisId);
            });

            // Inicialización.
            llenarSelectDiocesis();
            llenarSelectsHoras();
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            alert("Hubo un error al cargar los datos de diócesis y parroquias.");
        });

    // --- Envío del formulario ---
    const form = document.getElementById('myForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const diocesisId = document.getElementById('diocesis').value;
        const parroquiaId = document.getElementById('parroquia').value;
        const horaViernes1 = document.getElementById('horaViernes1').value;
        const horaViernes2 = document.getElementById('horaViernes2').value;
        const horaSabado = document.getElementById('horaSabado').value;
        const horaDomingo = document.getElementById('horaDomingo').value;
        const email = document.getElementById('email').value;

        const data = {
            diocesis: diocesisId,
            parroquia: parroquiaId,
            horaViernes1: horaViernes1,
            horaViernes2: horaViernes2,
            horaSabado: horaSabado,
            horaDomingo: horaDomingo,
            email: email
        };

        fetch(url, { //  'url' ya está definida arriba.
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            alert("Datos enviados correctamente!");
            form.reset();
            llenarSelectDiocesis();
            llenarSelectsHoras();
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Hubo un error al enviar los datos.");
        });
    });
});
