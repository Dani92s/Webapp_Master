document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los selects de Materialize.
    var selects = document.querySelectorAll('select');
    M.FormSelect.init(selects);

    // --- Datos de Diócesis y Parroquias (¡Aquí debes poner tus datos!) ---
    const diocesisData = [
        { id: 1, nombre: "Diócesis de Ejemplo 1" },
        { id: 2, nombre: "Diócesis de Ejemplo 2" },
        { id: 3, nombre: "Diócesis de Ejemplo 3" },
    ];

    //Simulamos que las parroquias se actualizan
    const parroquiasData = {
        1: [ // Diócesis ID 1
            { id: 1, nombre: "Parroquia A (Diócesis 1)" },
            { id: 2, nombre: "Parroquia B (Diócesis 1)" },
        ],
        2: [ // Diócesis ID 2
            { id: 3, nombre: "Parroquia C (Diócesis 2)" },
            { id: 4, nombre: "Parroquia D (Diócesis 2)" },
        ],
        3: [ // Diócesis ID 3
             { id: 5, nombre: "Parroquia E (Diócesis 3)" },
        ]
    };


    // --- Funciones para llenar los selects ---

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
        parroquiaSelect.innerHTML = '<option value="" disabled selected>Selecciona una Parroquia</option>'; // Limpiar opciones anteriores.

        if (parroquiasData[diocesisId]) {
            parroquiasData[diocesisId].forEach(parroquia => {
                const option = document.createElement('option');
                option.value = parroquia.id;
                option.textContent = parroquia.nombre;
                parroquiaSelect.appendChild(option);
            });
        }
        M.FormSelect.init(parroquiaSelect);  // Re-inicializar el select.

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
              M.FormSelect.init(select); // Re-inicializar el select.
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


    // --- Envío del formulario (código de la respuesta anterior, adaptado) ---
     const form = document.getElementById('myForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtener los datos del formulario (usando los IDs correctos).
        const diocesis = document.getElementById('diocesis').value;
        const parroquia = document.getElementById('parroquia').value;
        const horaViernes1 = document.getElementById('horaViernes1').value;
        const horaViernes2 = document.getElementById('horaViernes2').value;
        const horaSabado = document.getElementById('horaSabado').value;
        const horaDomingo = document.getElementById('horaDomingo').value;

        // Crear el objeto con los datos.
        const data = {
            diocesis: diocesis,
            parroquia: parroquia,
            horaViernes1: horaViernes1,
            horaViernes2: horaViernes2,
            horaSabado: horaSabado,
            horaDomingo: horaDomingo
        };
       // console.log(data) //para verificar
        // URL de tu WebApp (¡REEMPLAZA ESTO!).
        const url = "URL_DE_TU_WEB_APP";

        // Enviar los datos.
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
             form.reset(); // Limpiar el formulario
             // Re-inicializar los selects, para que se actualicen las listas.
             llenarSelectDiocesis();
             llenarSelectsHoras();
             llenarSelectParroquias();

        })
        .catch(error => {
            console.error('Error:', error);
            alert("Hubo un error al enviar los datos.");
        });
    });
});