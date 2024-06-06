let idP;

const tabla = document.getElementById("tabla");
const div = document.getElementById("divVentana");
const alertas = document.getElementById("alertas");
const divCrear = document.getElementById("divCrear");


API = "http://localhost:3000/";


async function mostrarTodo() {
    const res = await fetch(API+"empleados/");
    if(res.ok){
        const resJson = await res.json();
        limpiarTabla(tabla);
        resJson.forEach(producto => {
            const fila = agregarTabla(producto);
            tabla.appendChild(fila);
        });
        console.log(resJson);
    }else{
        console.log("No hay empleados");
    }
};

function agregarTabla(producto){
  const tr = document.createElement("tr");
  const divBotones = document.createElement("div"); 
  tabla.appendChild(tr);

  const thID = document.createElement("th");
  thID.textContent = producto.IdEmpleado;
  thID.setAttribute("scope","row");
  console.log(producto.IdEmpleado);
  tr.appendChild(thID);

  const thProducto = document.createElement("td");
  thProducto.textContent = producto.Nombre;
  tr.appendChild(thProducto);

  const thDireccion = document.createElement("td");
  thDireccion.textContent = producto.Direccion;
  tr.appendChild(thDireccion);

  const thTelefono = document.createElement("td");
  thTelefono.textContent = producto.Sueldo;
  tr.appendChild(thTelefono);

  const thEstatus = document.createElement("td");
  thEstatus.textContent = producto.Estatus;
  tr.appendChild(thEstatus);

  const botonEditar = document.createElement("button");
  const iconoEditar = document.createElement("i");

  iconoEditar.classList.add("fa-solid","fa-pen-to-square");
  botonEditar.classList.add("boton-icono");
  botonEditar.onclick = obtenerDato;
  botonEditar.appendChild(iconoEditar);
  botonEditar.setAttribute('editar-id',producto.IdEmpleado);
  botonEditar.setAttribute('data-bs-toggle',"modal");
  botonEditar.setAttribute('data-bs-target',"#staticBackdrop");
  divBotones.appendChild(botonEditar);

  const iconoEliminar = document.createElement("i");
  iconoEliminar.classList.add("fa-solid", "fa-trash");
  const botonEliminar = document.createElement("button");
  botonEliminar.classList.add("boton-icono");
  botonEliminar.setAttribute("borrar-id",producto.IdEmpleado);
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
  inProducto.id = "inEmpleadoCr";
  form.appendChild(inProducto);

  const lbPrecioC = document.createElement("label");
  lbPrecioC.classList.add("form-labe");
  lbPrecioC.textContent = "Sueldo:"
  form.appendChild(lbPrecioC);
  const inPrecioCompra = document.createElement("input");
  inPrecioCompra.classList.add("form-control");
  inPrecioCompra.id = "inSueldoCr";
  form.appendChild(inPrecioCompra);

  const lbCategoria = document.createElement("label");
  lbCategoria.classList.add("form-labe");
  lbCategoria.textContent = "Estatus:"
  form.appendChild(lbCategoria);
  const inCategoria = document.createElement("select");
  inCategoria.classList.add("form-select","form-control-sm");
  inCategoria.setAttribute("aria-label","Default select example");
  inCategoria.id = "inEstatusCr";
  form.appendChild(inCategoria);

    // Opciones predefinidas para el estatus
    const opcionesEstatus = ["Empleado", "Despedido", "Ausente"];

    // Recorrer el array de opciones de estatus y agregar cada una como opción
    opcionesEstatus.forEach(function(opcionEstatus) {
    const opcion = document.createElement("option");
    opcion.textContent = opcionEstatus;
    // Verificar si la opción de estatus coincide con la del producto
    if (opcionEstatus === "Empleado", "Despedido", "Ausente") {
      opcion.selected = true; // seleccionar esta opción si coincide
    }
    inCategoria.appendChild(opcion);
    });

    divCrear.appendChild(form);
};

async function obtenerDato() {
  div.innerHTML = '';
  idP = this.getAttribute('editar-id');
  console.log(idP);
  const res = await fetch(API + "empleados/" + idP);
  if (res.ok) {
      const resJson = await res.json();
      crearFormulario(resJson);
  }
};

function crearFormulario(producto){
  const form = document.createElement("div");
    const p = document.createElement("p");
    p.textContent = "ID del Empleado: "+producto.IdEmpleado;
    form.appendChild(p);

    const lbProducto = document.createElement("laber");
    lbProducto.classList.add("form-labe");
    lbProducto.textContent = "Nombre:";
    form.appendChild(lbProducto);
    const inProducto = document.createElement("input");
    inProducto.classList.add("form-control");
    inProducto.disabled = true; // El campo no es editable
    inProducto.value = producto.Nombre;
    form.appendChild(inProducto);


    const lbPrecioC = document.createElement("label");
    lbPrecioC.classList.add("form-labe");
    lbPrecioC.textContent = "Sueldo:"
    form.appendChild(lbPrecioC);
    const inPrecioCompra = document.createElement("input");
    inPrecioCompra.classList.add("form-control");
    inPrecioCompra.id = "inSueldo";
    inPrecioCompra.value = producto.Sueldo;
    form.appendChild(inPrecioCompra);

    // Crear campo para mostrar el estatus actual del empleado
    const lbEstatusActual = document.createElement("label");
    lbEstatusActual.classList.add("form-labe");
    lbEstatusActual.textContent = "Estatus actual:";
    form.appendChild(lbEstatusActual);
    const inEstatusActual = document.createElement("input");
    inEstatusActual.classList.add("form-control");
    inEstatusActual.disabled = true; // El campo no es editable
    inEstatusActual.value = producto.Estatus;
    form.appendChild(inEstatusActual);

    // Crear campo para seleccionar el nuevo estatus
    const lbNuevoEstatus = document.createElement("label");
    lbNuevoEstatus.classList.add("form-labe");
    lbNuevoEstatus.textContent = "Nuevo estatus:";
    form.appendChild(lbNuevoEstatus);
    const inNuevoEstatus = document.createElement("select");
    inNuevoEstatus.classList.add("form-select", "form-control-sm");
    inNuevoEstatus.setAttribute("aria-label", "Default select example");
    inNuevoEstatus.id = "inNuevoEstatus";
    form.appendChild(inNuevoEstatus);

    // Opciones predefinidas para el nuevo estatus
    const opcionesEstatus = ["Empleado", "Despedido", "Ausente"];

    // Recorrer el array de opciones de estatus y agregar cada una como opción
    opcionesEstatus.forEach(function(opcionEstatus) {
    const opcion = document.createElement("option");
    opcion.textContent = opcionEstatus;
    // Verificar si la opción de estatus coincide con la del producto
    if (opcionEstatus === "Empleado", "Despedido", "Ausente") {
        opcion.selected = true; // seleccionar esta opción si coincide
    }
    inNuevoEstatus.appendChild(opcion);
    });
    
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
  const res = await fetch(API+"empleados/"+idP, {
      method : "DELETE",
      headers : {
          "Content-Type" : "application/json"
      }
  });
  if(res.ok){
      mostrarTodo();
      crearAlerta("success","El empleado se ha eliminado exitosamente");
  }else{
      crearAlerta("danger","Error al borrar al empleado");
  }
}; 

async function AgregarElemento(){
    limpiarTabla(tabla);
    const res = await fetch(API+"empleados/",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            IdPersona : document.getElementById("inEmpleadoCr").value,
            Sueldo : document.getElementById("inSueldoCr").value,
            Estatus : document.getElementById("inEstatusCr").value,
        })
    });
    if(res.ok){
        const resJson = await res.json();
        encontrarPorId("empleados/",resJson.IdEmpleado);
        console.log(resJson);
        crearAlerta("success","El empleado se creó correctamente")
    }else{
        crearAlerta("danger","No se pudo agregar al empleado. Verifique los datos");
    }
    
};

function Buscar(){
  const eleccion = document.getElementById("selectBuscar").value;
  const input = document.getElementById("inputBuscar").value;
  if(eleccion == "Nombre") {
      buscarPorNombre("empleadosname/",input);
  }
  if(eleccion == "ID") {
      encontrarPorId("empleados/",input);
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
    crearAlerta("danger","Empleado no encontrado")
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
    crearAlerta("danger","El empleado no se ha encontrado. Vuelva a intentarlo");
}
};

async function EditarElemento() {
  limpiarTabla(tabla);
  console.log(idP);
  const res = await fetch(API+"empleados/"+idP,{
      method : "PUT",
      headers : {
          "Content-Type" : "application/json"
      },
      body : JSON.stringify({
          Sueldo : document.getElementById("inSueldo").value,
          Estatus : document.getElementById("inNuevoEstatus").value,
      })
  });
  if(res.ok){
      encontrarPorId("empleados/",idP)
      crearAlerta("success","El empleado se ha actualizado con exito");
  } else {
      crearAlerta("danger","Error al actualizar empleado");
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
        console.log("No hay empleado");
    }
};

