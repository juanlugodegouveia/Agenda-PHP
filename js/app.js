(function () { // Para que se ejecute solo una vez
    "use strict";

document.addEventListener('DOMContentLoaded', function () { //Agregado del proyecto

const  formularioContactos = document.querySelector('#contacto'),
       listadoContactos = document.querySelector('#listado-contactos tbody'),
       inputBuscador = document.querySelector('#buscar');


eventListeners();

function eventListeners() {

  if(formularioContactos) { //Agregado por mi
    //Cuando el formulario de crear o crear se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);
  }

  if(listadoContactos) { //Agregado por mi
    //Listener para eliminar el contacto
    listadoContactos.addEventListener('click', eliminarContacto);
  }

  if(inputBuscador) {
    inputBuscador.addEventListener('input', buscarContactos);
  }

  if(numeroContactos) {
    numeroContactos();
  }

}

function leerFormulario(e) { //Cada vez que se usa javascript utilizamos la sintaxis del evento "e" se recormiendo usarla para prevenir que la pagina se actualiza una y otra vez
  e.preventDefault();

  //Leer los datos de los inputs

  const nombre = document.querySelector('#nombre').value,
  empresa = document.querySelector('#empresa').value,
  telefono = document.querySelector('#telefono').value,
  accion = document.querySelector('#accion').value;

  if(nombre === '' || empresa === '' || telefono === '') { //Validación.
    mostrarNotificacion('Todos los campos son obligatorios', 'error'); //Dos paramentros, texto y clase.
  }
  else {
    const infoContacto = new FormData(); //Pasa la validacion, crear llamado a Ajax, formadta es la mejor forma para leer formularios
    infoContacto.append('nombre', nombre);
    infoContacto.append('empresa', empresa);
    infoContacto.append('telefono', telefono);
    infoContacto.append('accion', accion);

    if(accion === 'crear') {
      insertarBD(infoContacto);
      //Crearemos un nuevo elemento
    } else {
      //Editar el contacto
      //leer el ID
      const idRegistro = document.querySelector('#id').value;
      infoContacto.append('id', idRegistro);
      actualizarRegistro(infoContacto);
    }
  }
}

/*Inserta en la base da datos via Ajax*/

function insertarBD(datos) {
  //Llamado a Ajax

  //Creal el objeto

  const xhr = new XMLHttpRequest();

  //Abrir la conexion

  xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

  //Pasar los datos

  xhr.onload = function() {
    if(this.status === 200) {
      console.log(JSON.parse( xhr.responseText) ); //Funcion que convierte un string a obejto para poder acceder
      //Leemos la respuesta de php
      const respuesta = JSON.parse( xhr.responseText);

      //Inserta un nuevo elemento a la tabla
      const nuevoContacto = document.createElement('tr');

      nuevoContacto.innerHTML = `
      <td>${respuesta.datos.nombre}</td>
      <td>${respuesta.datos.empresa}</td>
      <td>${respuesta.datos.telefono}</td>
      `;

      //Creamos contenedor para los botones
      const contenedorAcciones = document.createElement('td');

      //Crear el icono de editar
      const inconoEditar = document.createElement('i');

      inconoEditar.classList.add('fas', 'fa-pen-square');

      //Crea el enlace para Editar
      const btnEditar = document.createElement('a');
      btnEditar.appendChild(inconoEditar);
      btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
      btnEditar.classList.add('btn', 'btn-editar');

      //Agregamos al padre (contenedorAcciones)

      contenedorAcciones.appendChild(btnEditar);

      //Crear el icono de eliminar
      const iconoEliminar = document.createElement('i');
      iconoEliminar.classList.add('fas', 'fa-trash-alt');

      //Creamos el boton de iconoEliminar
      const btnEliminar = document.createElement('button');
      btnEliminar.appendChild(iconoEliminar);
      btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
      btnEliminar.classList.add('btn', 'btn-borrar');

      //Agregarlo al padre
      contenedorAcciones.appendChild(btnEliminar);

      //Agregarlo al tr
      nuevoContacto.appendChild(contenedorAcciones);

      //agregarlo con los contactos
      listadoContactos.appendChild(nuevoContacto);

      //Resetear el formulario

      document.querySelector('form').reset();

      //Mostrar la notificación

      mostrarNotificacion('Contacto Creado Correctamente', 'correcto');

      //Actualizamos el numero

      numeroContactos();

    }
  }

  //Enviar los datos

  xhr.send(datos);
}

function actualizarRegistro(datos) {
  //Crear el objeto

  const xhr = new XMLHttpRequest();

  //Abrir la conexion

  xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

  //Leer la respuesta

  xhr.onload = function() {

    if(this.status == 200) {
      const respuesta = JSON.parse(xhr.responseText);
      if(respuesta.respuesta === 'correcto') {

        //Mostrar notificacion

        mostrarNotificacion('Contacto Editado Correctamete', 'correcto');
      } else {

        //Hubo un error
        mostrarNotificacion('Hubo un error', 'error');
      }

      //Despues de 3 segundos redireccionar
      setTimeout (() => {
        window.location.href = 'index.php';
      }, 2000);
    }
  }

  //Enviar la peticion

  xhr.send(datos);
}

//Eliminar contacto

function eliminarContacto(e) {
  if(e.target.parentElement.classList.contains('btn-borrar') )  { //Nos muestra en donde dimos click, pasamos e que es nuestro evento
    //Tomar el ID
    const id = e.target.parentElement.getAttribute('data-id');

    //console.log(id);
    //Preguntar al usuario si estan seguros
    const respuesta = confirm('Estas seguro?'); //Confirm es nativo del navegador

    if(respuesta) {
      //Llamado a Ajax
      //Crear el objeto

      const xhr = new XMLHttpRequest();

      //Abrir la conexion

      xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

      //Leer la respuesta
      xhr.onload = function() {
        if(this.status === 200) {
          const resultado = JSON.parse(xhr.responseText);

          if(resultado.respuesta == 'correcto') {
            //Eliminar el registro del DOM
            e.target.parentElement.parentElement.parentElement.remove();

            //Mostrar notificacion
            mostrarNotificacion('Contacto eliminado', 'correcto');

            //Actualizamos el numero

            numeroContactos();
            
          } else {
            //Mostramos una notificacion
            mostrarNotificacion('Hubo un error', 'error');
          }
        }
      }
      //Enviar la peticion
      xhr.send();

    }
  }
}


//Notificación en pantalla

function mostrarNotificacion(mensaje, clase) {
  const notificacion = document.createElement('div'); //Creo elemento
  notificacion.classList.add(clase, 'notificacion', 'sombra'); //Agrego una clase al elemento
  notificacion.textContent = mensaje;

  //Formulario

  formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

  //Ocular y Mostrar la notificacion

  setTimeout (() => { //Funcion que ejecuta un codigo por variable de tiempo
    notificacion.classList.add('visible');

    setTimeout (() => {
      notificacion.classList.remove('visible');
      setTimeout (() => {
        notificacion.remove(); //Para remover elemento
      }, 500);
    }, 3000);

  }, 100);
}

//Buscardor de registros

function buscarContactos(e) {
  const expresion = new RegExp(e.target.value, "i"),
        registros = document.querySelectorAll('tbody tr');

        registros.forEach(registro => {
          registro.style.display = 'none';

          if(registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {
            registro.style.display = 'table-row';
          }
          numeroContactos();
        });
}

//Muestra el numero de contactos

function numeroContactos() {
  const totalContactos = document.querySelectorAll('tbody tr'),
        contenedorNumero = document.querySelector('.total-contactos span');

  let total = 0;

  totalContactos.forEach(contacto => {
    if(contacto.style.display === '' || contacto.style.display === 'table-row') {
      total++;
    }
  });

  contenedorNumero.textContent = total;
}


}); //DOM CONTENT LOADED
})(); //Strict
