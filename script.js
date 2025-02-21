document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los selects de Materialize.
    var selects = document.querySelectorAll('select');
    M.FormSelect.init(selects);

    // --- COMENTAMOS TEMPORALMENTE EL CÓDIGO DE DIÓCESIS Y PARROQUIAS ---
    
    const url = "https://script.google.com/macros/s/AKfycbyrETpCS5xhp28diUHwVR0LKmU9TLU6hdKu3WAXnMfMU8teLI--bFui7LR3c6WOCskr/exec"; //  ¡¡¡ REEMPLAZA CON LA URL REAL !!!

    fetch(url)
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

            // Cuando se cambia la diócesis, actualizar las parroquias.
            document.getElementById('diocesis').addEventListener('change', function() {
                const diocesisId = this.value;
                llenarSelectParroquias(diocesisId);
            });
          
          	llenarSelectDiocesis();

        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            alert("Hubo un error al cargar los datos de diócesis y parroquias.");
        });

    // --- FIN DEL CÓDIGO COMENTADO ---


    // --- Funciones para las Horas (CORREGIDAS) ---

    function generarOpcionesHoras() {
        const horas = [];
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 60; j += 30) {
                const hora = String(i).padStart(2, '0');
                const minuto = String(j).padStart(2, '0');
                horas.push(`${hora}:${minuto}`); //  ¡CORRECTO! Usa template literals.
            }
        }
        return horas;
    }

    function llenarSelectsHoras() {
        const horas = generarOpcionesHoras();
        const selectIds = ['horaViernes1', 'horaViernes2', 'horaSabado', 'horaDomingo'];

        selectIds.forEach(selectId => {
            const select = document.getElementById(selectId);
            // ¡LIMPIAR EL SELECT ANTES DE AÑADIR OPCIONES!
            select.innerHTML = '<option value="" disabled selected>Selecciona una hora</option>';

            horas.forEach(hora => {
                const option = document.createElement('option');
                option.value = hora;
                option.textContent = hora; //  Usar directamente la hora formateada.
                select.appendChild(option);
            });
            M.FormSelect.init(select); // Re-inicializar *DESPUÉS* de añadir las opciones.
        });
    }
	// --- Inicialización (SOLO LAS HORAS) ---
  	llenarSelectsHoras();

     // --- Envío del formulario (COMENTADO PARA PRUEBAS) ---
   
    const form = document.getElementById('myForm');
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        // ... (resto del código de envío del formulario) ...
      });
});
