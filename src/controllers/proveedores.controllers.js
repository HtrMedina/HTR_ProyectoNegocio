import { getConnection } from "../database/connection.js";
import sql from 'mssql';

export const getProveedores =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Proveedores');
    res.json(result.recordset);
};

export const getProveedor = async (req, res) => {
    console.log(req.params.id)
    const pool = await getConnection();
    const result = await pool.request()
    .input('id', sql.Int,req.params.id)
    .query('SELECT * FROM Proveedores where IdProveedor = @id');
    
    if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Proveedor no encontrado"})
        }
    return res.json(result.recordset[0]);
};

export const getProveedorname = async (req, res) => {
    const pool =  await getConnection();
    const result = await pool.request()
    .input('Nombre',sql.VarChar,req.body.Nombre)
    .query("SELECT * FROM Proveedores where Proveedor like '%'+@Nombre+'%'");
    console.log(result);

    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({message : "Empleado not found"});
    }
    return res.json(result.recordset);
};

export const createProveedor = async (req, res) => {
    console.log(req.body);
    const pool = await getConnection();
    const result = await pool.request()
    .input('Proveedor',sql.VarChar,req.body.Proveedor)
    .input('Telefono',sql.VarChar,req.body.Telefono)
    .query("EXEC sp_insertProveedor @Proveedor, @Telefono; SELECT IDENT_CURRENT('Proveedores') as id;");
    
    console.log(result);
    res.json({
        IdProveedor : result.recordset[0].id,
        Proveedor : req.body.Proveedor,
        Telefono : req.body.Telefono
    })
};

export const updateProveedor = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .input('Proveedor',sql.VarChar,req.body.Proveedor)
    .input('Telefono',sql.VarChar,req.body.Telefono)
    .query("EXEC sp_upProveedor @id, @Proveedor, @Telefono");
    
    console.log(result);
    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Proveedor no encontrado"})
    }
    return res.json({message : "Proveedor Actualizado"});
};

export const deleteProveedor = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
    .input("id",sql.Int,req.params.id)
    .query("EXEC sp_borrarProveedor @id");

    console.log(result);
    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Proveedor no encontrado"})
    }
    return res.json({message : "Proveedor eliminado"});  
};