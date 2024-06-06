let idP;

const tabla = document.getElementById("tabla");
const div = document.getElementById("divVentana");
const alertas = document.getElementById("alertas");
const divCrear = document.getElementById("divCrear");


API = "http://localhost:3000/";


async function mostrarTodo() {
    const res = await fetch(API+"personas/");
    if(res.ok){
        const resJson = await res.json();
        limpiarTabla(tabla);
        resJson.forEach(producto => {
            const fila = agregarTabla(producto);
            tabla.appendChild(fila);
        });
        console.log(resJson);
    }else{
        console.log("No hay personas");
    }
};

function agregarTabla(producto){
  const tr = document.createElement("tr");
    const divBotones = document.createElement("div"); 
    tabla.appendChild(tr);

    const thID = document.createElement("th");
    thID.textContent = producto.IdPersona;
    thID.setAttribute("scope","row");
    console.log(producto.IdProducto);
    tr.appendChild(thID);

    const thProducto = document.createElement("td");
    thProducto.textContent = producto.Nombre;
    tr.appendChild(thProducto);

    const thIdCategoria = document.createElement("td");
    thIdCategoria.textContent = producto.Direccion;
    tr.appendChild(thIdCategoria);

    const thPrecioCompra = document.createElement("td");
    thPrecioCompra.textContent = producto.Cuenta;
    tr.appendChild(thPrecioCompra);

    const ththPreciVenta = document.createElement("td");
    ththPreciVenta.textContent = producto.Telefono;
    tr.appendChild(ththPreciVenta);

    const thStock = document.createElement("td");
    thStock.textContent = producto.CP;
    tr.appendChild(thStock);

    const thIdProveedor = document.createElement("td");
    thIdProveedor.textContent = producto.Colonia;
    tr.append(thIdProveedor);

    const botonEditar = document.createElement("button");
    const iconoEditar = document.createElement("i");
    
    iconoEditar.classList.add("fa-solid","fa-pen-to-square");
    botonEditar.classList.add("boton-icono");
    botonEditar.onclick = obtenerDato;
    botonEditar.appendChild(iconoEditar);
    botonEditar.setAttribute('editar-id',producto.IdPersona);
    botonEditar.setAttribute('data-bs-toggle',"modal");
    botonEditar.setAttribute('data-bs-target',"#staticBackdrop");
    divBotones.appendChild(botonEditar);

    const iconoEliminar = document.createElement("i");
    iconoEliminar.classList.add("fa-solid", "fa-trash");
    const botonEliminar = document.createElement("button");
    botonEliminar.classList.add("boton-icono");
    botonEliminar.setAttribute("borrar-id",producto.IdPersona);
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
    lbProducto.textContent = "Nombre:"
    form.appendChild(lbProducto);
    const inProducto = document.createElement("input");
    inProducto.classList.add("form-control");
    inProducto.id = "inNombreCr";
    form.appendChild(inProducto);

    const lbPrecioC = document.createElement("label");
    lbPrecioC.classList.add("form-labe");
    lbPrecioC.textContent = "Apellido:"
    form.appendChild(lbPrecioC);
    const inPrecioCompra = document.createElement("input");
    inPrecioCompra.classList.add("form-control");
    inPrecioCompra.id = "inApellidoCr";
    form.appendChild(inPrecioCompra);

    const lbPrecioV = document.createElement("label");
    lbPrecioV.classList.add("form-labe");
    lbPrecioV.textContent = "Direccion:"
    form.appendChild(lbPrecioV);
    const inPrecioVenta = document.createElement("input");
    inPrecioVenta.classList.add("form-control");
    inPrecioVenta.id = "inDireccionCr";
    form.appendChild(inPrecioVenta);

    const lbStock = document.createElement("label");
    lbStock.classList.add("form-labe");
    lbStock.textContent = "Cuenta:"
    form.appendChild(lbStock);
    const inStock = document.createElement("input");
    inStock.classList.add("form-control");
    inStock.id = "inCuentaCr";
    form.appendChild(inStock);

    const lbTelefono = document.createElement("label");
    lbTelefono.classList.add("form-labe");
    lbTelefono.textContent = "Telefono:"
    form.appendChild(lbTelefono);
    const inTelefono = document.createElement("input");
    inTelefono.classList.add("form-control");
    inTelefono.id = "inTelefonoCr";
    form.appendChild(inTelefono);

    const lbCP = document.createElement("label");
    lbCP.classList.add("form-labe");
    lbCP.textContent = "CP:"
    form.appendChild(lbCP);
    const inCP = document.createElement("input");
    inCP.classList.add("form-control");
    inCP.id = "inCPCr";
    form.appendChild(inCP);

    const lbColonia = document.createElement("label");
    lbColonia.classList.add("form-labe");
    lbColonia.textContent = "Colonia:"
    form.appendChild(lbColonia);
    const inColonia = document.createElement("input");
    inColonia.classList.add("form-control");
    inColonia.id = "inColoniaCr";
    form.appendChild(inColonia);

    divCrear.appendChild(form);

};

async function obtenerDato() {
  div.innerHTML = '';
  idP = this.getAttribute('editar-id');
  console.log(idP);
  const res = await fetch(API + "personas/" + idP);
  if (res.ok) {
      const resJson = await res.json();
      crearFormulario(resJson);
  }
};

function crearFormulario(producto){
  const form = document.createElement("div");
    const p = document.createElement("p");
    p.textContent = "ID de la Persona: "+producto.IdPersona;
    form.appendChild(p);

    const lbProducto = document.createElement("laber");
    lbProducto.classList.add("form-labe");
    lbProducto.textContent = "Nombre:"
    form.appendChild(lbProducto);
    const inProducto = document.createElement("input");
    inProducto.classList.add("form-control");
    inProducto.id = "inNombre";
    inProducto.disabled = true;
    inProducto.value = producto.Nombre;
    form.appendChild(inProducto);

    const lbPrecioV = document.createElement("label");
    lbPrecioV.classList.add("form-labe");
    lbPrecioV.textContent = "Direccion:"
    form.appendChild(lbPrecioV);
    const inPrecioVenta = document.createElement("input");
    inPrecioVenta.classList.add("form-control");
    inPrecioVenta.id = "inDireccion";
    inPrecioVenta.value = producto.Direccion;
    form.appendChild(inPrecioVenta);

    const lbStock = document.createElement("label");
    lbStock.classList.add("form-labe");
    lbStock.textContent = "Cuenta:"
    form.appendChild(lbStock);
    const inStock = document.createElement("input");
    inStock.classList.add("form-control");
    inStock.id = "inCuenta";
    inStock.value = producto.Cuenta;
    form.appendChild(inStock);

    const lbTelefono = document.createElement("label");
    lbTelefono.classList.add("form-labe");
    lbTelefono.textContent = "Telefono:"
    form.appendChild(lbTelefono);
    const inTelefono = document.createElement("input");
    inTelefono.classList.add("form-control");
    inTelefono.id = "inTelefono";
    inTelefono.value = producto.Telefono;
    form.appendChild(inTelefono);

    const lbCP = document.createElement("label");
    lbCP.classList.add("form-labe");
    lbCP.textContent = "CP:"
    form.appendChild(lbCP);
    const inCP = document.createElement("input");
    inCP.classList.add("form-control");
    inCP.id = "inCP";
    inCP.value = producto.CP;
    form.appendChild(inCP);

    const lbColonia = document.createElement("label");
    lbColonia.classList.add("form-labe");
    lbColonia.textContent = "Colonia:"
    form.appendChild(lbColonia);
    const inColonia = document.createElement("input");
    inColonia.classList.add("form-control");
    inColonia.id = "inColonia";
    inColonia.value = producto.Colonia;
    form.appendChild(inColonia);

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
  const res = await fetch(API+"personas/"+idP, {
      method : "DELETE",
      headers : {
          "Content-Type" : "application/json"
      }
  });
  if(res.ok){
      mostrarTodo();
      crearAlerta("success","La persona se ha eliminado exitosamente");
  }else{
      crearAlerta("danger","Error al borrar la persona");
  }
}; 

async function AgregarElemento(){
    limpiarTabla(tabla);
    const res = await fetch(API+"personas/",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            Nombre : document.getElementById("inNombreCr").value,
            Apellidos : document.getElementById("inApellidoCr").value,
            Direccion : document.getElementById("inDireccionCr").value,
            Cuenta : document.getElementById("inCuentaCr").value,
            Telefono : document.getElementById("inTelefonoCr").value,
            CPs : document.getElementById("inCPCr").value,
            Colonia : document.getElementById("inColoniaCr").value
        })
    });
    if(res.ok){
        const resJson = await res.json();
        encontrarPorId("personas/",resJson.IdPersona);
        console.log(resJson);
        crearAlerta("success","Agregado correctamente")
    }else{
        crearAlerta("danger","No se pudo agregar. Verifique los datos");
    }
    
};

function Buscar(){
  const eleccion = document.getElementById("selectBuscar").value;
  const input = document.getElementById("inputBuscar").value;
  if(eleccion == "Nombre") {
      buscarPorNombre("personasname/",input);
  }
  if(eleccion == "ID") {
      encontrarPorId("personas/",input);
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
    crearAlerta("danger","Persona no encontrada")
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
    crearAlerta("danger","No se ha encontrado. Vuelva a intentarlo");
}
};

async function EditarElemento() {
  limpiarTabla(tabla);
  console.log(idP);
  const res = await fetch(API+"personas/"+idP,{
      method : "PUT",
      headers : {
          "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        Direccion : document.getElementById("inDireccion").value,
        Cuenta : document.getElementById("inCuenta").value,
        Telefono : document.getElementById("inTelefono").value,
        CPs : document.getElementById("inCP").value,
        Colonia : document.getElementById("inColonia").value
      })
  });
  if(res.ok){
      encontrarPorId("personas/",idP)
      crearAlerta("success","Se ha actualizado con exito");
  } else {
      crearAlerta("danger","Error al actualizar");
  }
};





