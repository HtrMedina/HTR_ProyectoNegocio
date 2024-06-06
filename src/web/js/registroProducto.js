let idP;

const alertas = document.getElementById("alertas");
const tabla = document.getElementById("tabla");
const div = document.getElementById("divVentana");
const divCrear = document.getElementById("divCrear");

API = "http://localhost:3000/";



async function mostrarTodo() {
  const res = await fetch(API+"registroproductos/");
  if(res.ok)
  {
      const resJson = await res.json();
      limpiarTabla(tabla);
      resJson.forEach(producto => {
          const fila = agregarTabla(producto);
          tabla.appendChild(fila);
      });
      console.log(resJson);
  }
  else{
      console.log("No hay Registros");
  }
};

async function buscarPorNombre(ruta,nombre){
  limpiarTabla(tabla);
  const res = await fetch(API+ruta,{
      method : "POST",
      headers : {
          "Content-Type" : "application/json"
      },
      body : JSON.stringify({
          Producto : nombre
      })
  });
  if(res.ok)
  {
      const resJson = await res.json();
      resJson.forEach( producto => {
          const fila = agregarTabla(producto);
          tabla.appendChild(fila);
      })
  }else
  {
      console.log("Algo salio mal");
      crearAlerta("danger","Registro no encontrado")
  }
};

async function buscarPorAccion(ruta,nombre){
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
  if(res.ok)
  {
      const resJson = await res.json();
      resJson.forEach( producto => {
          const fila = agregarTabla(producto);
          tabla.appendChild(fila);
      })
  }else
  {
      console.log("Algo salio mal");
      crearAlerta("danger","Registro no encontrado")
  }
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
}

function agregarTabla(producto)
{
  const tr = document.createElement("tr");
  const divBotones = document.createElement("div"); 
  tabla.appendChild(tr);

  const thID = document.createElement("th");
  thID.textContent = producto.ID;
  thID.setAttribute("scope","row");
  console.log(producto.IdProducto);
  tr.appendChild(thID);

  const thProducto = document.createElement("td");
  thProducto.textContent = producto.Nombre;
  tr.appendChild(thProducto);

  const thIdCategoria = document.createElement("td");
  thIdCategoria.textContent = producto.Fecha.substring(0,10);
  tr.appendChild(thIdCategoria);

  const thPrecioCompra = document.createElement("td");
  thPrecioCompra.textContent = producto.Accion;
  tr.appendChild(thPrecioCompra);

  const ththPreciVenta = document.createElement("td");
  ththPreciVenta.textContent = producto.Usuario;
  tr.appendChild(ththPreciVenta);

  return tr;
}

function limpiarTabla(tabla) {
  const filas = tabla.querySelectorAll("tr");
  filas.forEach(fila => {
      fila.remove();
  });
}

//Seleccion de buscar por ID

function Buscar(){
  const eleccion = document.getElementById("selectBuscar").value;
  const input = document.getElementById("inputBuscar").value;
  if(eleccion == "Nombre") {
      buscarPorNombre("registroproductosname/",input);
  }
  if(eleccion == "Accion") {
      buscarPorAccion("registroproductosaccion/",input);
  }
}