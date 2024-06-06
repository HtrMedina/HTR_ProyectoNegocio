import { getConnection } from "../database/connection.js";
import sql from 'mssql';

export const getClientes =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM VistaCliente');
    res.json(result.recordset);
};

export const getCliente = async (req, res) => {
    console.log(req.params.id)
    const pool = await getConnection();
    const result = await pool.request()
    .input('id', sql.Int,req.params.id)
    .query('SELECT * FROM VistaCliente where IdCliente = @id');
    
    if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Cliente no encontrado"})
        }
    return res.json(result.recordset[0]);
};

export const getClientename = async (req, res) => {
    const pool =  await getConnection();
    const result = await pool.request()
    .input('Nombre',sql.VarChar,req.body.Nombre)
    .query("SELECT * FROM VistaCliente where Nombre like '%'+@Nombre+'%'");
    console.log(result);

    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({message : "Categoria not found"});
    }
    return res.json(result.recordset);
};

export const createCliente = async (req, res) => {
    console.log(req.body);
    const pool = await getConnection();
    const result = await pool.request()
    .input('IdPersona',sql.Int,req.body.IdPersona)
    .query("EXEC sp_insertCliente @IdPersona; SELECT IDENT_CURRENT('Clientes') as id;");
    
    console.log(result);
    res.json({
        IdCliente : result.recordset[0].id,
        IdPersona : req.body.IdPersona,
    })
};

export const updateCliente = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .input('IdPersona',sql.Int,req.body.IdPersona)
    .query("UPDATE Clientes set IdPersona = @IdPersona where IdCliente = @id");
    
    console.log(result);
    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Cliente no encontrado"})
    }
    return res.json({message : "Cliente Actualizado"});
};

export const deleteCliente = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
    .input("id",sql.Int,req.params.id)
    .query("EXEC sp_borrarCliente @id");

    console.log(result);
    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Cliente no encontrado"})
    }
    return res.json({message : "Cliente eliminado"});  
};