let idP;

const alertas = document.getElementById("alertas");

API = "http://localhost:3000/";



async function mostrarTodo() {
  const res = await fetch(API+"registroventas/");
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
      console.log("No hay ventas");
  }
};
  
function agregarTabla(producto)
{
    const tr = document.createElement("tr");
    const divBotones = document.createElement("div"); 
    tabla.appendChild(tr);

    const thID = document.createElement("th");
    thID.textContent = producto.IdDetalleVenta;
    thID.setAttribute("scope","row");
    console.log(producto.IdDetalleVenta);
    tr.appendChild(thID);

    const thProducto = document.createElement("td");
    thProducto.textContent = producto.Cantidad;
    tr.appendChild(thProducto);

    const thIdCategoria = document.createElement("td");
    thIdCategoria.textContent = producto.Total;
    tr.appendChild(thIdCategoria);

    const thPrecioCompra = document.createElement("td");
    thPrecioCompra.textContent = producto.Fecha.substring(0,10);
    tr.appendChild(thPrecioCompra);

    const ththPreciVenta = document.createElement("td");
    ththPreciVenta.textContent = producto.Nombre;
    tr.appendChild(ththPreciVenta);

    return tr;

}

function limpiarTabla(tabla) {
  const filas = tabla.querySelectorAll("tr");
  filas.forEach(fila => {
      fila.remove();
  });
}

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

async function Buscar() {
  limpiarTabla(tabla);
  const input = document.getElementById("inputBuscar").value;
  const res = await fetch(API+"registroventas/"+input);
  if(res.ok){
        const resJson = await res.json();
        const fila = agregarTabla(resJson);
        tabla.appendChild(fila);
    }else{  
        crearAlerta("danger","La venta no se ha encontrado. Vuelva a intentarlo");
    }
};