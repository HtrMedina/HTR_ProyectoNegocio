import { getConnection } from "../database/connection.js";
import sql from 'mssql';

export const getRProducts =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM vistaRegistroProductos');
    res.json(result.recordset);
};

export const getRProduct = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
    .input('Producto', sql.VarChar,req.body.Producto)
    .query("SELECT * FROM vistaRegistroProductos where Nombre like '%'+@Producto+'%'");
    
    if (result.rowsAffected[0] === 0){
        return res.status(404).json({message: "Producto no encontrado"})
    }
    return res.json(result.recordset);
};

export const getRAccion = async (req,res) => {
    const pool =  await getConnection();

    const result = await pool.request()
    .input('Accion',sql.VarChar,req.body.Nombre)
    .query("select * from vistaRegistroProductos where Accion like '%'+@Accion+'%'");
    
    console.log(result);

    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({message : "Registro de Producto not found"});
    }
    return res.json(result.recordset);
}