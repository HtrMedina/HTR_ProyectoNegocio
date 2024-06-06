import { getConnection } from "../database/connection.js";
import sql from 'mssql';

export const getPersonas =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM VistaPersonas');
    res.json(result.recordset);
};

export const getPersona = async (req, res) => {
    console.log(req.params.id)
    const pool = await getConnection();
    const result = await pool.request()
    .input('id', sql.Int,req.params.id)
    .query('SELECT * FROM VistaPersonas where IdPersona = @id');
    
    if (result.rowsAffected[0] === 0)
        {
            return res.status(404).json({message: "Persona no encontrada"})
        }
    return res.json(result.recordset[0]);
};

export const getPersonaname = async (req, res) => {
    const pool =  await getConnection();
    const result = await pool.request()
    .input('Nombre',sql.VarChar,req.body.Nombre)
    .query("SELECT * FROM VistaPersonas where Nombre like '%'+@Nombre+'%'");
    console.log(result);

    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({message : "Empleado not found"});
    }
    return res.json(result.recordset);
};

export const createPersona = async (req, res) => {
    console.log(req.body);
    const pool = await getConnection();
    const result = await pool.request()
    .input('Nombre',sql.VarChar,req.body.Nombre)
    .input('Apellidos',sql.VarChar,req.body.Apellidos)
    .input('Direccion',sql.VarChar,req.body.Direccion)
    .input('Cuenta',sql.VarChar,req.body.Cuenta)
    .input('Telefono',sql.VarChar,req.body.Telefono)
    .input('CP',sql.Int,req.body.CPs)
    .input('Colonia',sql.VarChar,req.body.Colonia)
    .query("EXEC sp_insertPersonas @Nombre, @Apellidos, @Direccion, @Cuenta, @Telefono, @CP, @Colonia; SELECT IDENT_CURRENT('Personas') as id;");
    
    console.log(result);
    res.json({
         IdPersona : result.recordset[0].id,
         Nombre : req.body.Nombre,
         Apellidos : req.body.Apellidos,
         Direccion : req.body.Direccion,
         Cuenta : req.body.Cuenta,
         Telefono : req.body.Telefono,
         CPs : req.body.CPs,
         Colonia : req.body.Colonia
     })
};

export const updatePersona = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .input('Direccion',sql.VarChar,req.body.Direccion)
    .input('Cuenta',sql.VarChar,req.body.Cuenta)
    .input('Telefono',sql.VarChar,req.body.Telefono)
    .input('CP',sql.Int,req.body.CPs)
    .input('Colonia',sql.VarChar,req.body.Colonia)
    .query("EXEC sp_updPersonas @id, @Direccion, @Cuenta, @Telefono, @CP, @Colonia");
    
    console.log(result);
    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Persona no encontrada"})
    }
    return res.json({message : "Persona Actualizada"});
};

export const deletePersona = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
    .input("id",sql.Int,req.params.id)
    .query("EXEC sp_borrarPersona @id");

    console.log(result);
    if (result.rowsAffected[0] === 0)
    {
        return res.status(404).json({message: "Persona no encontrada"})
    }
    return res.json({message : "Persona eliminada"});  
};