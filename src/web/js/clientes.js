let idP;

const tabla = document.getElementById("tabla");
const div = document.getElementById("divVentana");
const alertas = document.getElementById("alertas");
const divCrear = document.getElementById("divCrear");


API = "http://localhost:3000/";


async function mostrarTodo() {
    const res = await fetch(API+"clientes/");
    if(res.ok){
        const resJson = await res.json();
        limpiarTabla(tabla);
        resJson.forEach(producto => {
            const fila = agregarTabla(producto);
            tabla.appendChild(fila);
        });
        console.log(resJson);
    }else{
        console.log("No hay clientes");
    }
};

function agregarTabla(producto){
  const tr = document.createElement("tr");
  const divBotones = document.createElement("div"); 
  tabla.appendChild(tr);

  const thID = document.createElement("th");
  thID.textContent = producto.IdCliente;
  thID.setAttribute("scope","row");
  console.log(producto.IdCliente);
  tr.appendChild(thID);

  const thProducto = document.createElement("td");
  thProducto.textContent = producto.Nombre;
  tr.appendChild(thProducto);

  const thDireccion = document.createElement("td");
  thDireccion.textContent = producto.Direccion;
  tr.appendChild(thDireccion);

  const thTelefono = document.createElement("td");
  thTelefono.textContent = producto.Telefono;
  tr.appendChild(thTelefono);

  //const botonEditar = document.createElement("button");
  const iconoEditar = document.createElement("i");

  //iconoEditar.classList.add("fa-solid","fa-pen-to-square");
  //botonEditar.classList.add("boton-icono");
  //botonEditar.onclick = obtenerDato;
  //botonEditar.appendChild(iconoEditar);
  //botonEditar.setAttribute('editar-id',producto.IdCliente);
  //botonEditar.setAttribute('data-bs-toggle',"modal");
  //botonEditar.setAttribute('data-bs-target',"#staticBackdrop");
  //divBotones.appendChild(botonEditar);

  const iconoEliminar = document.createElement("i");
  iconoEliminar.classList.add("fa-solid", "fa-trash");
  const botonEliminar = document.createElement("button");
  botonEliminar.classList.add("boton-icono");
  botonEliminar.setAttribute("borrar-id",producto.IdCliente);
  botonEliminar.onclick = BorrarElemento;
  botonEliminar.appendChild(iconoEliminar);
  divBotones.appendChild(botonEliminar);
  tr.appendChild(divBotones);

  return tr;
};

function Crear(){
  divCrear.innerHTML="";
  const form = document.createElement("div");

  const lbProducto = document.createElement("laber");
  lbProducto.classList.add("form-labe");
  lbProducto.textContent = "IdPersona:"
  form.appendChild(lbProducto);
  const inProducto = document.createElement("input");
  inProducto.classList.add("form-control");
  inProducto.id = "inClienteCr";
  form.appendChild(inProducto);

  divCrear.appendChild(form);
};

async function obtenerDato() {
  div.innerHTML = '';
  idP = this.getAttribute('editar-id');
  console.log(idP);
  const res = await fetch(API + "clientes/" + idP);
  if (res.ok) {
      const resJson = await res.json();
      crearFormulario(resJson);
  }
};

function crearFormulario(producto){
  const form = document.createElement("div");
  const p = document.createElement("p");
  p.textContent = "ID del Cliente: "+producto.IdCliente;
  form.appendChild(p);

  const lbProducto = document.createElement("laber");
  lbProducto.classList.add("form-labe");
  lbProducto.textContent = "IdPersona:"
  form.appendChild(lbProducto);
  const inProducto = document.createElement("input");
  inProducto.classList.add("form-control");
  inProducto.id = "inCliente";
  inProducto.value = producto.IdPersona;
  form.appendChild(inProducto);

  div.appendChild(form);
}

function limpiarTabla(tabla) {
  const filas = tabla.querySelectorAll("tr");
  filas.forEach(fila => {
      fila.remove();
  });
};

function crearAlerta(tipo,texto){
  const divAlerta = document.createElement("div");
  divAlerta.classList.add("alert","alert-dismissible","fade","show");
  divAlerta.classList.add("alert-"+tipo);
  divAlerta.setAttribute("role","alert");
  alertas.appendChild(divAlerta);
  
  divAlerta.textContent = texto;

  const botonCerrar = document.createElement("button");
  botonCerrar.type = "button";
  botonCerrar.classList.add("btn-close");
  botonCerrar.setAttribute("data-bs-dismiss","alert");
  botonCerrar.setAttribute("aria-label","Close");

  divAlerta.appendChild(botonCerrar);
  
  setTimeout(function() {
      divAlerta.remove();
  }, 4000);
};

async function BorrarElemento() {
  idP = this.getAttribute('borrar-id');
  const res = await fetch(API+"clientes/"+idP, {
      method : "DELETE",
      headers : {
          "Content-Type" : "application/json"
      }
  });
  if(res.ok){
      mostrarTodo();
      crearAlerta("success","El cliente se ha eliminado exitosamente");
  }else{
      crearAlerta("danger","Error al borrar al cliente");
  }
}; 

async function AgregarElemento(){
    limpiarTabla(tabla);
    const res = await fetch(API+"clientes/",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            IdPersona : document.getElementById("inClienteCr").value
        })
    });
    if(res.ok){
        const resJson = await res.json();
        encontrarPorId("clientes/",resJson.IdCliente);
        console.log(resJson);
        crearAlerta("success","El cliente se creó correctamente")
    }else{
        crearAlerta("danger","No se pudo agregar al cliente. Verifique los datos");
    }
    
};

function Buscar(){
  const eleccion = document.getElementById("selectBuscar").value;
  const input = document.getElementById("inputBuscar").value;
  if(eleccion == "Nombre") {
      buscarPorNombre("clientesname/",input);
  }
  if(eleccion == "ID") {
      encontrarPorId("clientes/",input);
  }
  
}

async function buscarPorNombre(ruta,nombre){
limpiarTabla(tabla);
const res = await fetch(API+ruta,{
    method : "POST",
    headers : {
        "Content-Type" : "application/json"
    },
    body : JSON.stringify({
        Nombre : nombre
    })
});
if(res.ok){
    const resJson = await res.json();
    resJson.forEach( producto => {
        const fila = agregarTabla(producto);
        tabla.appendChild(fila);
    })
}else{
    console.log("Algo salio mal");
    crearAlerta("danger","Cliente no encontrado")
}
};

async function encontrarPorId(ruta,id) {
limpiarTabla(tabla);
const res = await fetch(API+ruta+id);
if(res.ok){
    const resJson = await res.json();
    const fila = agregarTabla(resJson);
    tabla.appendChild(fila);
}else{  
    crearAlerta("danger","El cliente no se ha encontrado. Vuelva a intentarlo");
}
};

async function EditarElemento() {
  limpiarTabla(tabla);
  console.log(idP);
  const res = await fetch(API+"clientes/"+idP,{
      method : "PUT",
      headers : {
          "Content-Type" : "application/json"
      },
      body : JSON.stringify({
          IdPersona : document.getElementById("inCliente").value
      })
  });
  if(res.ok){
      encontrarPorId("categorias/",idP)
      crearAlerta("success","El cliente se ha actualizado con exito");
  } else {
      crearAlerta("danger","Error al actualizar cliente");
  }
};

async function obtenerNombre(ruta,select,actual) {
    const res = await fetch(API+ruta);
    console.log(actual);
    if(res.ok)
    {
        const resJson = await res.json();
        resJson.forEach(elemento => {
            const opcion = document.createElement("option");
            if(elemento.Nombre == actual) {
                opcion.setAttribute("selected","");
            }
            opcion.value = elemento.Id;
            opcion.textContent = elemento.Nombre;
            select.appendChild(opcion);
        });
        console.log(resJson);
    }
    else{
        console.log("No hay clientes");
    }
};





