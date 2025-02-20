document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los selects de Materialize.
    var selects = document.querySelectorAll('select');
    M.FormSelect.init(selects);

    // --- Obtener datos de Diócesis y Parroquias desde la WebApp ---

    // URL de tu WebApp (¡REEMPLAZA ESTO!).  Esta vez la usaremos para un GET.
    const url = "https://script.google.com/macros/s/AKfycbyrETpCS5xhp28diUHwVR0LKmU9TLU6hdKu3WAXnMfMU8teLI--bFui7LR3c6WOCskr/exec"; //  ¡¡¡ REEMPLAZA ESTO CON LA URL REAL !!!

    fetch(url) // Por defecto, fetch hace una solicitud GET.
        .then(response => response.json())
        .then(data => {
            // data contiene { diocesis: [...], parroquias: {...} }
            const diocesisData = data.diocesis;
            const parroquiasData = data.parroquias;

            // --- Funciones para llenar los selects (ahora usan los datos recibidos) ---

            function llenarSelectDiocesis() {
                const diocesisSelect = document.getElementById('diocesis');
                diocesisData.forEach(diocesis => {
                    const option = document.createElement('option');
                    option.value = diocesis.id;
                    option.textContent = diocesis.nombre;
                    diocesisSelect.appendChild(option);
                });
                M.FormSelect.init(diocesisSelect); // Re-inicializar el select.
            }

            function llenarSelectParroquias(diocesisId) {
                const parroquiaSelect = document.getElementById('parroquia');
                parroquiaSelect.innerHTML = '<option value="" disabled selected>Selecciona una Parroquia</option>'; // Limpiar opciones.

                if (parroquiasData[diocesisId]) {
                    parroquiasData[diocesisId].forEach(parroquia => {
                        const option = document.createElement('option');
                        option.value = parroquia.id;
                        option.textContent = parroquia.nombre;
                        parroquiaSelect.appendChild(option);
                    });
                }
                M.FormSelect.init(parroquiaSelect); // Re-inicializar.
            }

           function generarOpcionesHoras() {
              const horas = [];
              for (let i = 0; i < 24; i++) {
                for (let j = 0; j < 60; j += 30) {
                  const hora = String(i).padStart(2, '0'); // Asegura formato de 2 dígitos
                  const minuto = String(j).padStart(2, '0');
                  horas.push(`${hora}:${minuto}`);
                }
              }
              return horas;
            }


            function llenarSelectsHoras() {
                const horas = generarOpcionesHoras();
                const selectIds = ['horaViernes1', 'horaViernes2', 'horaSabado', 'horaDomingo'];

                selectIds.forEach(selectId => {
                    const select = document.getElementById(selectId);
                      horas.forEach(hora => {
                        const option = document.createElement('option');
                        option.value = hora;
                        option.textContent = hora;
                        select.appendChild(option);
                    });
                    M.FormSelect.init(select); // Re-inicializar.
                });
            }


            // --- Eventos ---

            // Cuando se cambia la diócesis, actualizar las parroquias.
            document.getElementById('diocesis').addEventListener('change', function() {
                const diocesisId = this.value;
                llenarSelectParroquias(diocesisId);
            });

            // --- Inicialización ---
            llenarSelectDiocesis();
            llenarSelectsHoras();


            // --- Envío del formulario ---
            const form = document.getElementById('myForm');

            form.addEventListener('submit', function(event) {
                event.preventDefault();

                // Obtener los valores de los campos.
                const diocesisId = document.getElementById('diocesis').value;
                const parroquiaId = document.getElementById('parroquia').value;
                const horaViernes1 = document.getElementById('horaViernes1').value;
                const horaViernes2 = document.getElementById('horaViernes2').value;
                const horaSabado = document.getElementById('horaSabado').value;
                const horaDomingo = document.getElementById('horaDomingo').value;
                const email = document.getElementById('email').value; // Obtener el email (puede estar vacío).


                // Crear el objeto con los datos.
                const data = {
                    diocesis: diocesisId,
                    parroquia: parroquiaId,
                    horaViernes1: horaViernes1,
                    horaViernes2: horaViernes2,
                    horaSabado: horaSabado,
                    horaDomingo: horaDomingo,
                    email: email // Incluir el email (puede ser null/undefined).
                };

                // Enviar los datos (usando la misma URL, pero ahora para POST).
                fetch(url, {
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
                    form.reset(); // Limpiar el formulario.
                    llenarSelectDiocesis(); //Recargar Select
                    llenarSelectsHoras();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("Hubo un error al enviar los datos.");
                });
            });

        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            alert("Hubo un error al cargar los datos de diócesis y parroquias.");
        });
});
