import { getConnection } from "../database/connection.js";
import sql from 'mssql';

export const getCategorias =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Categorias');
    res.json(result.recordset);
};

export const getCategoria = async (req, res) => {
    console.log(req.params.id)
    const pool = await getConnection();
    const result = await pool.request()
    .input('id', sql.Int,req.params.id)
    .query('SELECT * FROM Categorias where IdCategoria = @id');
    
    if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Categoria no encontrada"})
        }
    return res.json(result.recordset[0]);
};

export const getCategorianame = async (req, res) => {
    const pool =  await getConnection();
    const result = await pool.request()
    .input('Nombre',sql.VarChar,req.body.Nombre)
    .query("SELECT * FROM Categorias where Categoria like '%'+@Nombre+'%'");
    console.log(result);

    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({message : "Categoria not found"});
    }
    return res.json(result.recordset);
};

export const createCategoria = async (req, res) => {
    console.log(req.body);
    const pool = await getConnection();
    const result = await pool.request()
    .input('Categoria',sql.VarChar,req.body.Categoria)
    .query("EXEC sp_insertCategoria @Categoria; SELECT IDENT_CURRENT('Categorias') as id;");
    
    console.log(result);
    res.json({
        IdCategoria : result.recordset[0].id,
        Categoria : req.body.Categoria,
    })
};

export const updateCategoria = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .input('Categoria',sql.VarChar,req.body.Categoria)
    .query("EXEC sp_upCategoria @id, @Categoria");
    
    console.log(result);
    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Categoria no encontrada"})
    }
    return res.json({message : "Categoria Actualizada"});
};

export const deleteCategoria = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
    .input("id",sql.Int,req.params.id)
    .query("EXEC sp_borrarCategoria @id");

    console.log(result);
    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Categoria no encontrada"})
    }
    return res.json({message : "Categoria eliminada"});  
};