import { getConnection } from "../database/connection.js";
//import PDFFocument from 'pdfkit';
import fs from 'fs';
import sql from 'mssql';
import PDFFocument from "pdfkit-construct";

function buildPedidoPDF(dataCallback, endCallback,cliente,venta) {
    try{
    const doc = new PDFFocument();
    const fecha = venta[0].Fecha.toLocaleDateString();

    doc.on('data', dataCallback)
    doc.on('end',endCallback)

    doc.setDocumentHeader({
        height: "36%"
    }, () => {
        doc.image('src/images/LogoFerreteria.png', {
            fit: [120, 100], // Ancho y alto de la imagen en el PDF
            align: 'left', // Alineación de la imagen
            valign: 'top' // Alineación vertical de la imagen
        });

        doc.font('Helvetica-Bold').fontSize(30).text("Pedido",{
            align : 'center'
        });
        doc.moveDown(1);
    
        doc.fontSize(10).text("Ticket : " + venta[0].Ticket +"\nFecha de compra: " + fecha, {
            align : 'right'
        });
        doc.moveDown();
        doc.fontSize(10).text(`ID Cliente:  ${cliente.ID} \nCliente: ${cliente.Nombre} \nDireccion: ${cliente.Direccion} \nTeléfono: ${cliente.Telefono} \nCP: ${cliente.CP} \nColonia: ${cliente.Colonia}`);
        doc.moveDown(2);
        doc.fontSize(16).text(`Total: $${venta[0].Total}`,{align : 'right'})
        doc.moveDown();
        
    });
    doc.addTable([
        {key: "IdProducto", label: "ID",align: "center"},
        {key: "Nombre", label: "Producto",align: "left"},
        {key: "Cantidad", label: "Cantidad",align: "left"},
        {key: "Precio", label: "Precio",align: "left"},
        {key: "Monto", label: "Monto",align: "left"},
    ], venta,
    {
        border: null,
        width: "fill_body",
        striped: true,
        stripedColors: ["#ffffff", "#f2f2f2"],
        cellsPadding: 10,
        marginLeft: 45,
        marginRight: 45,
        headAlign: 'center',
        headBackground : "#006BA7"
    });

    doc.render();
    doc.end();
    }
    catch(error) {
        console.log(error);
    }
    
}

export const getPedidoPDF = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("EXEC sp_Factura @id") 

    if (result.recordsets === 0)
    {
        return res.status(404).json({message: "Product not found"})
        
    }else {
        const infoCliente = result.recordsets[1][0];
        const infoVentas = result.recordsets[0];
        const stream = res.writeHead(200, {
            "Content-Type" : "application/pdf",
            "Content-Disposition" : "attachment; filename=Pedido.pdf"
        });
        buildPedidoPDF((data) => {stream.write(data);}, () => {stream.end()},infoCliente,infoVentas)

    }
    
    }
    catch(error)
    { 
        console.error("Error:", error.message);
        return res.status(404).json({message : error.message})
    }
};

export const getPedidoFact = async (req, res) => {
    try{const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("select * from DetalleVenta where IdDetalleVenta = @id") 

    
    if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Venta not found"})
        }
        return res.json(result.recordset);
        }
        catch(error)
        { 
            console.error("Error:", error.message);
            return res.status(404).json({message : error.message})
        }
    
};
