import express from 'express'

import productosRoutes from './routes/productos.routes.js'
import proveedoresRoutes from './routes/proveedores.routes.js'
import categoriasRoutes from './routes/categorias.routes.js'
import personasRoutes from './routes/personas.routes.js'
import clientesRoutes from './routes/clientes.routes.js'
import empleadosRoutes from './routes/empleados.routes.js'
import registroProductos from './routes/registroProductos.js'
import registroVentas from './routes/registroVentas.routes.js'
import facturas from './routes/facturas.routes.js'
import descargarPDF from './routes/descargarPDF.routes.js'
import ventasRoutes from './routes/ventas.routes.js'
import registroPrecio from './routes/registroPrecio.routes.js'
import pedidos from './routes/pedidosPDF.routes.js'
import cors from "cors";
const app = express()

app.use(cors({
    origin : ["http://127.0.0.1:5501","http://127.0.0.1:5501"]
}))
app.use(express.json());
app.use(productosRoutes);
app.use(proveedoresRoutes);
app.use(categoriasRoutes);
app.use(personasRoutes);
app.use(clientesRoutes);
app.use(empleadosRoutes);
app.use(registroProductos);
app.use(registroVentas);
app.use(facturas);
app.use(descargarPDF);
app.use(ventasRoutes);
app.use(registroPrecio);
app.use(pedidos);

export default app