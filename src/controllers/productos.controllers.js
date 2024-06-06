import { getConnection } from "../database/connection.js";
import sql from 'mssql';

export const getProducts =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM VistaProductos');
    res.json(result.recordset);
};

export const getProduct = async (req, res) => {
    console.log(req.params.id)
    const pool = await getConnection();
    const result = await pool.request()
    .input('id', sql.Int,req.params.id)
    .query('SELECT * FROM VistaProductos where IdProducto = @id');
    
    if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Producto no encontrado"})
        }
    return res.json(result.recordset[0]);
};

export const getProductoname = async (req, res) => {
    const pool =  await getConnection();
    const result = await pool.request()
    .input('Nombre',sql.VarChar,req.body.Nombre)
    .query("SELECT * FROM vistaProductos where Nombre like '%'+@Nombre+'%'");
    console.log(result);

    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({message : "Empleado not found"});
    }
    return res.json(result.recordset);
};

export const createProduct = async (req, res) => {
    console.log(req.body);
    const pool = await getConnection();
    const result = await pool.request()
    .input('Nombre',sql.VarChar,req.body.Nombre)
    .input('IdCategoria',sql.Int,req.body.IdCategoria)
    .input('PrecioCompra',sql.Money,req.body.PrecioCompra)
    .input('PrecioVenta',sql.Money,req.body.PrecioVenta)
    .input('Stock',sql.Int,req.body.Stock)
    .input('IdProveedor',sql.Int,req.body.IdProveedor)
    .query("EXEC sp_insertProducto @Nombre, @IdCategoria, @PrecioCompra, @PrecioVenta, @Stock, @IdProveedor; SELECT IDENT_CURRENT('Productos') as id;");
    
    console.log(result);
    res.json({
        IdProducto : result.recordset[0].id,
        Nombre : req.body.Nombre,
        IdCategoria : req.body.IdCategoria,
        PrecioCompra : req.body.PrecioCompra,
        PrecioVenta : req.body.PrecioVenta,
        Stock : req.body.Stock,
        IdProveedor : req.body.IdProveedor
    })
};

export const updateProduct = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .input('Nombre',sql.VarChar,req.body.Nombre)
    .input('IdCategoria',sql.Int,req.body.IdCategoria)
    .input('PrecioCompra',sql.Money,req.body.PrecioCompra)
    .input('PrecioVenta',sql.Money,req.body.PrecioVenta)
    .input('Stock',sql.Int,req.body.Stock)
    .input('IdProveedor',sql.Int,req.body.IdProveedor)
    .query("EXEC sp_upProductos @id, @Nombre, @IdCategoria, @PrecioCompra, @PrecioVenta, @Stock, @IdProveedor");
    
    console.log(result);
    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Producto no encontrado"})
    }
    return res.json({message : "Producto Actualizado"});
};

export const deleteProduct = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
    .input("id",sql.Int,req.params.id)
    .query("EXEC sp_borrarProducto @id");

    console.log(result);
    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Producto no encontrado"})
    }
    return res.json({message : "Producto eliminado"});  
};

export const getNombresProveedores =  async (req, res) => {
    try {
        const pool = await getConnection();
    const result = await pool.request().query('SELECT IdProveedor as Id, Proveedor as Nombre from Proveedores');
    res.json(result.recordset);
    }catch(error) {
        console.error("Error:", error.message);
    }
}

export const getNombresCategorias =  async (req, res) => {
    try {
        const pool = await getConnection();
    const result = await pool.request().query('SELECT IdCategoria as Id, Categoria as Nombre from Categorias');
    res.json(result.recordset);
    }catch(error) {
        console.error("Error:", error.message);
    }
}