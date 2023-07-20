// Llamada fetch al archivo local JSON
let productos = [];
fetch("./js/productos.json")
    .then(response => response.json())
    .then(data =>{
        productos = data;
        // Ejecutamos la funcion que trae los productos
        cargarProductos(productos);
    });

//Llamadas del DOM
const contenedorProductos = document.getElementById('contenedor-productos');
const botonesCategorias = document.querySelectorAll('.boton-categoria');
const tituloPrincipal = document.getElementById('titulo-principal');
let botonesAgregar = document.querySelectorAll('.producto-agregar');
const numerito = document.getElementById('numerito');

// Funcion para cargar los productos
function cargarProductos(productosSeleccionados) {
    // Vaciamos el HTML cada vez que apretamos para traer productos asi no se duplican
    contenedorProductos.innerHTML = ''; 
    productosSeleccionados.forEach(producto => {
        const div = document.createElement('div'); 
        div.classList.add('producto');
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.appendChild(div);
    });
    actualizarBotonesAgregar();
}

// Hacemos un forEach para recorrer todos los botones
botonesCategorias.forEach(boton => {
    //Agregamos un evento click
    boton.addEventListener('click', (e)=>{
        //Realizamos otro forEach a todos los botones para removerle su clase active, cada vez que hacemos click
        botonesCategorias.forEach(boton => boton.classList.remove('active'));
        // Y luego si haces click a uno se le agrega la clase active
        e.currentTarget.classList.add("active");
        // Hacemos un condicional para hacer el filtro de cada tipo de producto, y tambien un find para cambiar el titulo cada vez que hacemos click en cada tipo de producto
        if (e.currentTarget.id != 'todos') {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosElegidos = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosElegidos);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

function actualizarBotonesAgregar() {
    // Cada vez que se carguen productos se va ejecutar esta funcion
    botonesAgregar = document.querySelectorAll('.producto-agregar');
    // Ahora que siempre los botones se van actualizando cada vez que cargamos productos, le vamos a poner un listener cada uno de ellos, pero antes realizamos un foreach para tener cada uno de los botones.
    botonesAgregar.forEach(boton => {
        // A cada boton le pasamos el click con la funcion agregarAlCarrito
        boton.addEventListener('click', agregarAlCarrito);
    });
}

let productosEnCarrito;
// Traer la informacion del localStorage
const productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {
    // Libreria Toastify
    Toastify({
        text: "Producto agregado",
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
    }).showToast();
    // Lo que queremos que haga esta funcion es que agregue esos elementos a un array, vamos a crear ese array por fuera de la funcion
    // Sabemos que los botones AGREGAR, tiene el id del producto, osea como propiedad id, entonces podemos saber en que producto vamos hacer click
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);
    // Este condiconal es para cuando por ejemplo agregamos el "abrigo 02" dos veces, vamos a tener ese abrigo varias veces nuestro array, nosotros queremos que si ya existe en el carrito que no se vuelve agregar, sino que simplmenete aumente la cantidad 
    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        // Si encuentra ese producto le sume uno a su cantidad, lo que tenemos que hacer es buscar el index de ese producto que ya existe
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        // Le estamos asignando una propiedad nueva a productos, esto nos va a servir porque despues en el carrito vamos a tener cuanta una cierta cantidad segun hayamos echo click para agregarlo para comprar.
        productoAgregado.cantidad = 1;
        // Ahora que cada vez que hacemos click en el boton AGREGAR, nos trae el producto entero osea el objeto, que nos sirve porque ahora lo podemos agregar a nuestro array creado arriba
        productosEnCarrito.push(productoAgregado); 
    }
    actualizarNumerito()
    // Hay que llevar productosCarrito al localStorage para poder llamarlo desde el carrito, osea guardar el array
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Ahora queremos que cada vez que agregamos producto al carrito se actualize el numero que figura en el nav
function actualizarNumerito() {
    let numeritoNuevo = productosEnCarrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);
    numerito.innerText = numeritoNuevo;
}