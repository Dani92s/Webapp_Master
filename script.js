document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los selects de Materialize.
    var selects = document.querySelectorAll('select');
    M.FormSelect.init(selects);

    // --- COMENTA TODO ESTO TEMPORALMENTE ---
    /*
    const url = "URL_DE_TU_WEB_APP";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // ... (todo el código relacionado con diócesis y parroquias) ...
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            alert("Hubo un error al cargar los datos de diócesis y parroquias.");
        });
    */

    // --- Funciones para las horas (DEJA ESTO) ---
    function generarOpcionesHoras() {
        const horas = [];
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 60; j += 30) {
                const hora = String(i).padStart(2, '0');
                const minuto = String(j).padStart(2, '0');
                horas.push(`<span class="math-inline">\{hora\}\:</span>{minuto}`);
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

     // --- Inicialización (SOLO LAS HORAS) ---
    llenarSelectsHoras();
     // --- Envío del formulario (Comentar) ---
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
});
