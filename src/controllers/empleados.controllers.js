import { getConnection } from "../database/connection.js";
import sql from 'mssql';

export const getEmpleados =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM vistaEmpleados');
    res.json(result.recordset);
};

export const getEmpleado = async (req, res) => {
    console.log(req.params.id)
    const pool = await getConnection();
    const result = await pool.request()
    .input('id', sql.Int,req.params.id)
    .query('SELECT * FROM vistaEmpleados where IdEmpleado = @id');
    
    if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Empleado no encontrado"})
        }
    return res.json(result.recordset[0]);
};

export const getEmpleadoname = async (req, res) => {
    const pool =  await getConnection();
    const result = await pool.request()
    .input('Nombre',sql.VarChar,req.body.Nombre)
    .query("SELECT * FROM vistaEmpleados where Nombre like '%'+@Nombre+'%'");
    console.log(result);

    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({message : "Empleado not found"});
    }
    return res.json(result.recordset);
};

export const createEmpleado = async (req, res) => {
    console.log(req.body);
    const pool = await getConnection();
    const result = await pool.request()
    .input('IdPersona',sql.Int,req.body.IdPersona)
    .input('Sueldo',sql.Money,req.body.Sueldo)
    .input('Estatus',sql.VarChar,req.body.Estatus)
    .query("EXEC sp_inserteEmpleados @IdPersona, @Sueldo, @Estatus; SELECT IDENT_CURRENT('Empleados') as id;");
    
    console.log(result);
    res.json({
        IdEmpleado : result.recordset[0].id,
        IdPersona : req.body.IdPersona,
        Sueldo : req.body.Sueldo,
        Estatus : req.body.Estatus
    })
};

export const updateEmpleado = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .input('Sueldo',sql.Money,req.body.Sueldo)
    .input('Estatus',sql.VarChar,req.body.Estatus)
    .query("EXEC sp_upEmpleados @id, @Sueldo, @Estatus");
    
    console.log(result);
    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Empleado no encontrado"})
    }
    return res.json({message : "Empleado Actualizado"});
};

export const deleteEmpleado = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
    .input("id",sql.Int,req.params.id)
    .query("EXEC sp_borrarEmpleados @id");

    console.log(result);
    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Empleado no encontrado"})
    }
    return res.json({message : "Empleado eliminado"});  
};