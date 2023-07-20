// Elementos DOM
const openMenu = document.getElementById('open-menu');
const closeMenu = document.getElementById('close-menu');
const aside = document.querySelector('aside'); 

// Evento click

openMenu.addEventListener('click', ()=>{
    aside.classList.add('aside-visible');
});

closeMenu.addEventListener('click', ()=>{
    aside.classList.remove('aside-visible');
});

// Vamos a traer botonesCategoria, para poder cerrar el aside cada vez que hagamos click en uno de los links de categoria

botonesCategorias.forEach(boton => {
    boton.addEventListener('click', ()=>{
        aside.classList.remove('aside-visible');
    })
});