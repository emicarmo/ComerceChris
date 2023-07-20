// Elementos del DOM
const contenedorCarritoVacio = document.getElementById('carrito-vacio');
const contenedorCarritoProductos = document.getElementById('carrito-productos');
const contenedorCarritoAcciones = document.getElementById('carrito-acciones');
const contenedorCarritoComprado = document.getElementById('carrito-comprado');
let botonesEliminar = document.querySelectorAll('.carrito-producto-eliminar');
const botonVaciar = document.getElementById('carrito-acciones-vaciar');
const contenedorTotal = document.getElementById('total');
const botonComprar = document.getElementById('carrito-acciones-comprar')

// Traer la informacion del localSorage
const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));

// Lo que queremos saber es si hay algo en el carrito, si lo esta, que desaparezca carrito vacio, y aparezca los productos.

function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        // Le agregamos clases y removemos, 
        contenedorCarritoVacio.classList.add('disabled');
        contenedorCarritoProductos.classList.remove('disabled');
        contenedorCarritoAcciones.classList.remove('disabled');
        contenedorCarritoComprado.classList.add('disabled');
    
        contenedorCarritoProductos.innerHTML = "";
    
        // Hacemos un foreach de productosEnCarrito
        productosEnCarrito.forEach(producto => {
            // Vamos a crear un div, para que se muestren los productos que tenemos en el array de productos
            const div = document.createElement('div');
            div.classList.add('carrito-producto');
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Titulo</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
            contenedorCarritoProductos.appendChild(div);
        });
    } else {
        contenedorCarritoVacio.classList.remove('disabled');
        contenedorCarritoProductos.classList.add('disabled');
        contenedorCarritoAcciones.classList.add('disabled');
        contenedorCarritoComprado.classList.add('disabled');
    }

    actualizarBotonesEliminar();
    actualizarTotal();
}

// Cada vez que se carga la pagina se ejecuta esta funcion
cargarProductosCarrito()

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll('.carrito-producto-eliminar');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', eliminarCarrito);
    });
}

function eliminarCarrito(e) {
    // Libreria Toastify
    Toastify({
        text: "Producto eliminado",
        duration: 2000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
        borderRadius: "2rem",
        textTransform: "uppercase",
        fontSize: '.75rem'
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        onClick: function(){} // Callback after click
    }).showToast()
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    productosEnCarrito.splice(index, 1);
    
    cargarProductosCarrito();

    localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
}

// Evento para vaciar por completo el carrito
botonVaciar.addEventListener('click', vaciarCarrito);

function vaciarCarrito() {
    // Libreria sweetalert
    Swal.fire({
        title: '<b>¿Estas Seguro?</b>',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos!`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:'Si',
        cancelButtonText:'No',
        background: '#198754',
        color: 'white'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
            cargarProductosCarrito()
        }
    })
}

function actualizarTotal() {
    const totalCalculado = total.innerText = productosEnCarrito.reduce((acumulador, producto)=> acumulador + (producto.precio * producto.cantidad),0)
    total.innerText = `$${totalCalculado}`
}

// Evento para que me diga compra exitosa
botonComprar.addEventListener('click', comprarCarrito);

function comprarCarrito() {
    Swal.fire({
        title: '<b>¿Estas Seguro?</b>',
        icon: 'question',
        html: `Se van a comprar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos!`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:'Si',
        cancelButtonText:'No',
        background: '#198754',
        color: 'white'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
            contenedorCarritoVacio.classList.remove('disabled');
            contenedorCarritoProductos.classList.add('disabled');
            contenedorCarritoAcciones.classList.add('disabled');
            contenedorCarritoComprado.classList.add('disabled');
            Swal.fire({
                icon: 'success',
                title: 'Muchas gracias por su compra',
            })
        }
    })
}