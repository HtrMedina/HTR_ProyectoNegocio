import { getConnection } from "../database/connection.js";
import sql from 'mssql';

export const getRVentas =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM vistaVentas');
    res.json(result.recordset);
};

export const getRVenta = async (req, res) => {
    console.log(req.params.id)
    const pool = await getConnection();
    const result = await pool.request()
    .input('id', sql.Int,req.params.id)
    .query('SELECT * FROM vistaVentas where IdDetalleVenta = @id');
    
    if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Producto no encontrado"})
        }
    return res.json(result.recordset[0]);
};