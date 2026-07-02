window.onload = function () {
    cargarPaises();
    cargarComunas();
}

function validar_fomulario() {
    let inputNombre = $("#inputNombre");
    let inputRut = $("#inputRut");
    let inputCorreo = $('#inputCorreo');
    let fechaNacimiento = $('#inputFechaNac');
    let nacionalidad = $('#selectNacionalidad');
    let contrasena = $('#inputContrasena');
    let repetirContrasena = $('#inputRepetirContrasena');
    let tecnologias = $('input[name="checkTecnologias"]:checked').map(function () {
        return $(this).val();
    }).get().join(', ');
    let genero = $('input[name="radioGenero"]:checked');
    let formularioValido = true;

    if (!validarInput(inputNombre)) {
        formularioValido = false;
    }
    if (!validarInput(inputRut)){
        formularioValido = false;
    }
    if (!validarInput(inputCorreo)) {
        formularioValido = false;
    }
    if (!validarInput(fechaNacimiento)) {
        formularioValido = false;
    }
    if (!validarInput(nacionalidad)) {
        formularioValido = false;
    }
    if (!validarContrasena(contrasena)) {
        formularioValido = false;
    }
    if (!validarRepetirContrasena(repetirContrasena, contrasena)) {
        formularioValido = false;
    }

    if (formularioValido === true) {
        alert('Formulario Válido, enviando datos al servidor...')

        const elementoForm = $('#formularioRegistro')[0];
        const dataForm = new FormData(elementoForm);

        const dataDireccion = {
            comuna: dataForm.get('comuna'),
            calle: dataForm.get('calle'),
            numero: dataForm.get('numero'),
            departamento: dataForm.get('departamento')
        }
        dataForm.set('direccion',JSON.stringify(dataDireccion));

        const datos = Object.fromEntries(dataForm.entries());

        datos.tecnologias = dataForm.getAll('tecnologias');

        const enviarFomulario = async () => {
            try {
                const respuesta = await fetch("http://localhost:3000/guardarUsuario", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                });

                if (respuesta.ok) {
                    window.location.href = './inicio.html'
                }
                const data = await respuesta.json();
                console.log('El servidor ha respondido: ', data)
            } catch (error) {
                console.log('Ha ocurrido el siguiente error: ', error)
            }
        }
        enviarFomulario();
    } else {
        alert('Complete todos los campos del formulario.')
    }
};

function validarInput(input) {
    if (input.val() === '') {
        input.addClass('is-invalid');
        return false;
    } else {
        input.removeClass('is-invalid');
        return true;
    }
}

function validarEmail(input) {
    if (validarInput(input)) {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/
        if (regexEmail.test(input.val())) {
            input.removeClass('is-invalid');
            return true;
        } else {
            input.addClass('is-invalid');
            return false;
        }
    }
}

function validarContrasena(input) {
    if (validarInput(input)) {
        const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
        if (regexContrasena.test(input.val())) {
            input.removeClass('is-invalid');
            return true;
        } else {
            input.addClass('is-invalid');
            return false;
        }
    }
}

function validarRepetirContrasena(input, input2) {
    if (validarInput(input)) {
        if (input.val() === input2.val()) {
            input.removeClass('is-invalid');
            return true;
        } else {
            input.addClass('is-invalid');
            return false;
        }
    }
}

async function cargarPaises() {
    try {
        const respuesta = await fetch("http://localhost:3000/listadoPaises");
        const datos = await respuesta.json();

        const select = $('#selectNacionalidad');
        datos.forEach(pais => {
            const option = $("<option></option>",{
                'text':pais.nombre,
                'value':pais.iso2
            });
            select.append(option.css("text-transform", "capitalize"));            
        });

        if (!respuesta.ok) {
            throw new Error(respuesta.status);
        }
    } catch (error) {
        console.log('Ha ocurrido el siguiente error: ', error)
    }
}

async function cargarComunas() {
    try {
        const respuesta = await fetch("http://localhost:3000/listadoComunas");
        const datos = await respuesta.json();

        const select = $('#selectComuna');
        datos.forEach(comuna => {
            const option = $("<option></option>",{
                'text':comuna.nombre_comuna,
                'value':comuna.codigo_comuna
            });
            select.append(option.css("text-transform", "capitalize"));            
        });

        if (!respuesta.ok) {
            throw new Error(respuesta.status);
        }
    } catch (error) {
        console.log('Ha ocurrido el siguiente error: ', error)
    }
}