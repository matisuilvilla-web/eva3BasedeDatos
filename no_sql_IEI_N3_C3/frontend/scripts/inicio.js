window.onload = function () {
    obtenerUsuarios();
}

async function obtenerUsuarios() {
    try {
        const respuesta = await fetch("http://localhost:3000/listadoUsuarios");
        const datos = await respuesta.json();

        new DataTable('#tablaUsuarios', {
            data: datos,
            columns: [
                { data: 'nombre' },
                { data: 'rut'},
                { data: 'correo' },
                { data: 'fechaNacimiento' },
                { data: 'gentilicio.nombre' },
                { data: 'tecnologias' },
                {
                    data: 'genero', render: function (data) {
                        return data === 'M' ? 'Masculino' : data === 'F' ? 'Femenino' : 'Otro';
                    }
                }
            ]
        });

        if (!respuesta.ok) {
            throw new Error(respuesta.status);
        }
    } catch (error) {
        console.log('Ha ocurrido el siguiente error: ', error)
    }
};