$(document).ready(function () {
    cargarUsuariosParaFactura(); 
    cargarFacturas();
});

$(document).ready(function () {
    cargarUsuariosParaFactura(); 
    cargarFacturas();           
});

async function cargarUsuariosParaFactura() {
    try {
        const respuesta = await fetch("http://localhost:3000/listadoUsuarios");
        const usuarios = await respuesta.json();
        
        const select = $('#selectUsuarioFactura');
        usuarios.forEach(user => {
            const option = $("<option></option>", {
                'text': `${user.nombre} (${user.rut})`,
                'value': user._id 
            });
            select.append(option);
        });
    } catch (error) {
        console.log('Error al cargar usuarios en el selector: ', error);
    }
}

async function registrarFactura() {
    let usuario = $('#selectUsuarioFactura');
    let numero = $('#inputNumeroFactura');
    let proveedor = $('#inputProveedor');
    let fecha = $('#inputFechaFactura');
    let monto = $('#inputMonto');
    let impuesto = $('#inputImpuesto');

    if (usuario.val() === '' || numero.val() === '' || proveedor.val() === '' || fecha.val() === '' || monto.val() === '' || impuesto.val() === '') {
        alert('Por favor, complete todos los campos obligatorios del formulario.');
        return;
    }

    const elementoForm = $('#formularioFactura')[0];
    const dataForm = new FormData(elementoForm);
    const datos = Object.fromEntries(dataForm.entries());

    try {
        const respuesta = await fetch("http://localhost:3000/guardarFactura", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (respuesta.ok) {
            alert('Factura almacenada con éxito.');
            window.location.reload(); 
        } else {
            const errData = await respuesta.json();
            alert('Error del servidor: ' + errData.message);
        }
    } catch (error) {
        console.log('Error al enviar la factura: ', error);
    }
}

async function cargarFacturas() {
    try {
        const respuesta = await fetch("http://localhost:3000/listadoFacturas");
        const datos = await respuesta.json();

        $('#tablaFacturas').DataTable({
            destroy: true,
            data: datos,
            columns: [
                { data: 'numero' },
                { data: 'proveedor' },
                { 
                    data: 'fecha',
                    render: function(data) {
                        if (!data) return '';
                        const fechaObjeto = new Date(data);
                        return fechaObjeto.toLocaleDateString('es-CL', { timeZone: 'UTC' });
                    }
                },
                { 
                    data: 'monto',
                    render: function(data, type, row) {
                        return new Intl.NumberFormat('es-CL', { 
                            style: 'currency', 
                            currency: row.moneda || 'CLP' 
                        }).format(data);
                    }
                },
                { data: 'estado' },
                { data: 'datosUsuario.rut', defaultContent: '<span class="text-muted">No asociado</span>' },
                { data: 'datosUsuario.nombre', defaultContent: '<span class="text-muted">No asociado</span>' }
            ],
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
            }
        });
    } catch (error) {
        console.log('Ha ocurrido el siguiente error al cargar las facturas: ', error);
    }
}