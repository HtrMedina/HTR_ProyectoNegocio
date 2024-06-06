import sql from 'mssql'

const dbSettings = {
    user: "sa",
    password: "Passw0rd!",
    server: "localhost",
    database: "Negocio",
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
}

export const getConnection = async () => {
    try{
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch(error){
        console.error(error);
    }
}