/*
USE MASTER
GO
DROP DATABASE Negocio;
CREATE DATABASE Negocio;
GO
*/
USE Negocio;
GO

-->> CREACION DE TABLAS PARA CP <<--
CREATE TABLE Paises(
IdPais int identity (1,1) not null,
Pais varchar(50) not null,
Nomenglatura varchar(2) not null,
Codigo smallint not null,
Primary key(IdPais)
)

CREATE TABLE Estados(
IdEstado int identity (1,1) not null,
Estado varchar(50) not null,
IdPais int not null,
constraint PK_IdEstado primary key (IdEstado),
constraint FK_IdPaisPaises foreign key (IdPais) references Paises(IdPais)
)

CREATE TABLE Municipios(
IdMunicipio int identity (1,1) not null,
Municipio varchar(50) not null,
IdEstado int not null,
constraint PK_IdMunicipio primary key (IdMunicipio),
constraint FK_IdEstadoEstados foreign key (IdEstado) references Estados(IdEstado)
)

CREATE TABLE CP(
IdCP int identity (1,1) not null,
CP int not null,
IdMunicipio int not null,
constraint PK_IdCP primary key (IdCP),
constraint FK_IdMunicipioMunicipios foreign key (IdMunicipio) references Municipios(IdMunicipio)
)

CREATE TABLE Colonia(
IdColonia int identity (1,1) not null,
Colonia varchar(50) not null,
IdCP int not null,
constraint PK_IdCiudad primary key (IdColonia),
constraint FK_IdCPs foreign key (IdCP) references CP(IdCP)
)
GO



-->> CREACION DE LAS TABLAS <<--
CREATE TABLE Proveedores(
	IdProveedor int not null identity primary key,
	Proveedor varchar(50) not null,
	Telefono varchar(10) not null
);

CREATE TABLE Categorias(
	IdCategoria int not null identity primary key,
	Categoria varchar(50) not null
);

CREATE TABLE Productos(
	IdProducto int not null identity primary key,
	Nombre varchar(50) not null,
	IdCategoria int foreign key references Categorias(IdCategoria) on delete cascade,
	PrecioCompra money not null check(PrecioCompra>=0),
	PrecioVenta money not null check(PrecioVenta>=0),
	Stock int default 0 not null check(Stock>=0),
	IdProveedor int foreign key references Proveedores(IdProveedor)
);

CREATE TABLE Personas(
	IdPersona int not null identity primary key,
	Nombre varchar(50) not null,
	Apellidos varchar(100) not null,
	Direccion varchar(50) not null,
	Cuenta varchar(20),
	Telefono varchar(10) not null,
	CP int not null,
	IdCP int foreign key references CP(IdCP) on delete cascade,
	Colonia varchar(50)
);

CREATE TABLE Clientes(
	IdCliente int not null identity primary key,
	IdPersona int foreign key references Personas(IdPersona) on delete cascade
);

CREATE TABLE Empleados(
	IdEmpleado int not null identity primary key,
	IdPersona int foreign key references Personas(IdPersona) on delete cascade,
	Sueldo money not null,
	Estatus varchar(50) check(Estatus IN('Empleado','Despedido','Ausente'))
);

CREATE TABLE Ventas(
	IdVenta int not null identity primary key,
	IdProducto int foreign key references Productos(IdProducto) on delete cascade,
	Cantidad int not null,
	Precio money not null,
	Ticket int not null,
	Monto money not null
);

CREATE TABLE DetalleVenta(
	IdDetalleVenta int not null identity primary key,
	Cantidad smallint not null,
	Total money not null check(Total>=0),
	Fecha date not null,
	IdCliente int not null foreign key references Clientes(IdCliente) on delete cascade
);

CREATE TABLE Devoluciones(
	IdDevolucion int not null identity primary key,
	IdDetalleVenta int foreign key references DetalleVenta(IdDetalleVenta) on delete cascade,
	Fecha date not null
);

CREATE TABLE RegistroProducto(
	idAproducto INT IDENTITY PRIMARY KEY,
	idProducto INT,
	Fecha DATE,
	Accion VARCHAR(25),
	Usuario VARCHAR(25),
)

CREATE TABLE RegistroPrecioProducto(
	idAproducto INT IDENTITY PRIMARY KEY,
	idProducto INT FOREIGN KEY REFERENCES Productos(IdProducto) on delete cascade,
	Fecha DATE,
	Accion VARCHAR(25),
	Usuario VARCHAR(25),
	PrecioCompraAnterior MONEY,
	PrecioCompraActual MONEY,
	PrecioVentaAnterior MONEY,
	PrecioVentaActual MONEY
)
GO

-->> DML DE CP <<--
INSERT INTO Paises(Pais, Nomenglatura, Codigo)VALUES
('Mexico','MX','52');

INSERT INTO Estados(Estado, IdPais)VALUES
('Guanajuato','1');

INSERT INTO Municipios(Municipio,IdEstado)
SELECT DISTINCT G.D_mnpio, E.IdEstado from Guanajuato as G inner join Estados as E on G.d_estado = E.Estado

INSERT INTO CP(CP, IdMunicipio)
SELECT DISTINCT G.d_codigo, M.IdMunicipio from Guanajuato as G inner join Municipios as M on G.D_mnpio = M.Municipio ORDER BY G.d_codigo 

INSERT INTO Colonia(Colonia, IdCP)
SELECT G.d_asenta, C.IdCP from Guanajuato as G inner join CP as C on G.d_codigo = C.CP ORDER BY G.d_asenta 

SELECT * FROM Paises
SELECT * FROM Estados
SELECT * FROM Municipios
SELECT * FROM CP
SELECT * FROM Colonia

SELECT *
FROM Colonia as C inner JOIN CP as  CP
ON C.IdCP=CP.IdCP
inner join Municipios as M on CP.IdMunicipio=M.IdMunicipio
inner join Estados as E on M.IdEstado=E.IdEstado
inner join Paises as P on E.IdPais=P.IdPais
where Municipio='Yuriria'
ORDER BY C.Colonia
GO

-->> SELECCION DE TABLAS <<--
	select * from Categorias
	select * from Clientes
	select * from Empleados
	select * from Personas
	select * from Productos
	select * from Proveedores
	select * from Ventas
	select * from DetalleVenta
	select * from Devoluciones
	select * from RegistroPrecioProducto
	select * from RegistroProducto
GO

-->> FUNCIONES <<--
-- FUNCION PARA OBTENER EL TICKET
CREATE FUNCTION obtenerTicket()
 returns int
 as
 begin
	declare @ID int;
	set @ID = (SELECT IDENT_CURRENT('DetalleVenta')+1);
	return @ID;
end
GO

--FUNCION PARA APLICAR DESCUENTO MEDIANTE LA CANTIDAD
CREATE OR ALTER FUNCTION DescuentoCantidad(@IdProducto int, @Cantidad int)
RETURNS money
AS
BEGIN
	declare @result money;
		IF @Cantidad>=10
		BEGIN
		set @result =(Select PrecioVenta-(PrecioVenta*25/100) from Productos where IdProducto=@IdProducto);
		END
		ELSE
		IF @Cantidad>=5
		BEGIN
		set @result =(Select PrecioVenta-(PrecioVenta*10/100) from Productos where IdProducto=@IdProducto);
		END
		ELSE
		IF @Cantidad>=3
		BEGIN
		set @result =(Select PrecioVenta-(PrecioVenta*5/100) from Productos where IdProducto=@IdProducto);
		END
		ELSE
		set @result =(Select PrecioVenta from Productos where IdProducto=@IdProducto);
	RETURN @result
END
GO

-- FUNCION PARA LA SUMA DE LAS VENTAS
CREATE FUNCTION sumasVenta()
returns int 
as
begin 
	declare @Total int
	set @Total = (select SUM(Monto) from Ventas where Ticket = dbo.obtenerTicket()); 
	return @Total
end
go

-- FUNCION PARA SUMAR LA PRIMER VENTA
CREATE FUNCTION sumasPrimerVenta()
returns int 
as
begin 
	declare @Total int
	set @Total = (select SUM(Monto) from Ventas where Ticket = 1); 
	return @Total
end
go

-- FUNCION PARA SUMAR EL DETALLE DE LA VENTA
CREATE FUNCTION sumaDetalleVenta()
returns int
as
begin 
	declare @Total int
	set @Total = (select SUM(Cantidad) from DetalleVenta);
	return @Total;
end
go

--OBTENER CP
CREATE FUNCTION obtenerCP(@codigo int)
returns int
as
begin 
	declare @cp int
	set @cp = (select CP.IdCP from CP as CP where CP.CP=@codigo);
	return @cp;
end
go

--OBTENER COLONIA
CREATE OR ALTER FUNCTION obtenerColonia(@colonia varchar(50), @idcp int)
RETURNS varchar(100)
AS
BEGIN 
    DECLARE @col varchar(50);
    SET @col = (SELECT Col.Colonia FROM Colonia as Col WHERE Col.Colonia LIKE '%' + @colonia + '%' AND Col.IdCP = @idcp);
    RETURN @col;
END
GO

-->> STOCK PROCEDURES <<--
-- PROCEDURE PARA AGREGAR CATEGORIAS
CREATE PROCEDURE sp_insertCategoria(@categoria varchar(50))
AS
BEGIN
    insert into Categorias values (UPPER(@categoria))
END
GO

-- PROCEDURE PARA BORRAR CATEGORIAS
CREATE PROCEDURE sp_borrarCategoria(@id int)
as
BEGIN 
	delete from Categorias where IdCategoria = @id
END
GO

-- PROCEDURE PARA ACTUALIZAR CATEGORIAS
CREATE PROCEDURE sp_upCategoria(@id int, @categoria varchar(50))
AS
BEGIN
	update Categorias set Categoria = UPPER(@categoria) WHERE IdCategoria = @id
END
GO

-- PROCEDURE PARA AGREGAR PERSONAS
CREATE PROCEDURE sp_insertPersonas(
	@persona varchar(50),
	@apellido varchar(100),
	@direccion varchar(50),
	@cuenta varchar(20),
   	@telefono varchar(10),
	@cp int,
	@colonia varchar(50)
)
AS
BEGIN
	declare @idcp int;
	declare @col varchar(50);
	set @idcp = dbo.obtenerCP(@cp);
	set @col = dbo.obtenerColonia(@colonia,@idcp);
    insert into Personas values (UPPER(@persona),UPPER(@apellido),@direccion,@cuenta,@telefono,@cp,@idcp,@col)
END
GO
-- PROCEDURE PARA BORRAR PERSONAS
CREATE PROCEDURE sp_borrarPersona(@id int)
as
BEGIN 
	delete from Personas where IdPersona = @id;
END
GO
-- PROCEDURE PARA ACTUALIZAR PERSONAS
CREATE PROCEDURE sp_updPersonas(
	@idpersona int,
	@direccion varchar(50),
	@cuenta varchar(20),
    @telefono varchar(10),
	@cp int,
	@colonia varchar(50)
)
AS
BEGIN
	declare @idcp int; 
	declare @col varchar(50);
	set @idcp = dbo.obtenerCP(@cp);
	set @col = dbo.obtenerColonia(@colonia,@idcp);
	update Personas set Direccion=@direccion, Cuenta=@cuenta, Telefono=@telefono, CP=@cp, IdCP=@idcp, Colonia=@col WHERE IdPersona=@idpersona
END
GO

-- PROCEDURE PARA AGREGAR PROVEEDORES
CREATE PROCEDURE sp_insertProveedor(@proveedor varchar(50), @telefono varchar(10))
AS
BEGIN
    insert into Proveedores values (UPPER(@proveedor),@telefono)
END
GO
-- PROCEDURE PARA BORRAR PROVEEDOR
CREATE PROCEDURE sp_borrarProveedor(@id int)
as
BEGIN
	delete from Proveedores where IdProveedor = @id;
END
GO
-- PROCEDURE PARA ACTUALIZAR PROVEEDORES
CREATE PROCEDURE sp_upProveedor(@id int, @proveedor varchar(50), @telefono varchar(10))
AS
BEGIN
	update Proveedores set Proveedor = @proveedor, Telefono = @telefono where IdProveedor = @id
END
GO

-- PROCEDURE PARA AGREGAR PRODUCTOS
CREATE PROCEDURE sp_insertProducto(
    	@producto varchar(50),
    	@idCategoria int,
		@precioCompra money,
    	@precioVenta money,
    	@stock int,
		@idProveedor int
)
AS
BEGIN
    insert into Productos values (UPPER(@producto), @idCategoria, @precioCompra, @precioVenta, @stock, @idProveedor)
END
GO
-- PROCEDURE PARA BORRAR PRODUCTOS
CREATE PROCEDURE sp_borrarProducto(@id int)
AS
BEGIN
	delete from Productos where IdProducto = @id;
END
GO
-- PROCEDURE PARA ACTUALIZAR PRODUCTOS
CREATE PROCEDURE sp_upProductos(
	@id int,
	@nombre varchar(50),
	@idcategoria int,
	@preciocompra money,
	@precioventa money,
	@stock int,
	@idproveedor int
)
AS
BEGIN
	update Productos set Nombre = @nombre, IdCategoria = @idcategoria, PrecioCompra = @preciocompra, PrecioVenta =  @precioventa, Stock = @stock, IdProveedor = @idproveedor where IdProducto = @id
END
GO

--PROCEDURE PARA INSERTAR CLIENTES
CREATE PROCEDURE sp_insertCliente(@idpersona INT)
AS
BEGIN
    insert into Clientes values (@idpersona)
END
GO
-- PROCEDURE PARA BORRAR CLIENTES
CREATE PROCEDURE sp_borrarCliente(@id int)
AS
BEGIN
	delete from Clientes where IdCliente = @id;
END
GO

--PROCEDURE PARA INSERTAR EMPLEADOS
CREATE PROCEDURE sp_inserteEmpleados(@idpersona int, @sueldo money, @estatus varchar(50))
AS
BEGIN
    insert into Empleados values (@idpersona, @sueldo, @estatus)
END
GO
-- PROCEDURE PARA BORRAR EMPLEADOS
CREATE PROCEDURE sp_borrarEmpleados(@id int)
AS
BEGIN
	delete from Empleados where IdEmpleado = @id;
END
GO

-- PROCEDURE PARA ACTUALIZAR EMPLEADOS
CREATE PROCEDURE sp_upEmpleados(@id int, @sueldo money, @estatus varchar(50))
AS
BEGIN
	update Empleados set Sueldo = @sueldo, Estatus = @estatus where IdEmpleado = @id
END
GO

-- PROCEDURE PARA HACER UNA LA PRIMER VENTA
CREATE PROCEDURE sp_VentasPrimerVenta(
	@IdProducto int,
	@Cantidad smallint
)
AS
BEGIN
	declare @Monto money, @Precio money;
	set @Precio = dbo.DescuentoCantidad(@IdProducto, @Cantidad)
	select @Monto = @Cantidad*@Precio;
	insert into Ventas values (@IdProducto,@Cantidad,@Precio,1,@Monto);
END
GO
-- PROCEDURE PARA HACER UNA VENTA
CREATE PROCEDURE sp_Ventas(
	@IdProducto int,
	@Cantidad smallint
)
AS
BEGIN
	declare @Monto money, @NumTicket int, @Precio money;
	set @Precio = dbo.DescuentoCantidad(@IdProducto, @Cantidad)
	select @Monto = @Cantidad*@Precio;
	set @NumTicket = (SELECT IDENT_CURRENT('DetalleVenta')+1);
	insert into Ventas values (@IdProducto,@Cantidad,@Precio,@NumTicket,@Monto);
END
GO

-- PROCEDURE PARA BORRAR TICKET
CREATE PROCEDURE sp_borrarProductoTicket(@id int)
AS
BEGIN
	delete from Ventas where IdVenta = @id;
END
GO

-- PROCEDURE PARA EL DETALLE DE LA VENTA
CREATE PROCEDURE sp_DetalleVenta(@IdCliente int)
as
begin
	
	declare @CantidadTotal int, @Total money, @Id int;

	IF (select SUM(Cantidad) from Ventas where Ticket = 2) IS NULL AND (select dbo.obtenerTicket()) < 3
	BEGIN 
		set @Id = 1;
		set @CantidadTotal = (select SUM(Cantidad) from Ventas where Ticket = @Id);
		set @Total = (select SUM(Monto) from Ventas where Ticket = @Id)
		insert into DetalleVenta values (@CantidadTotal,@Total,GETDATE(),@IdCliente)
	END
	ELSE
	BEGIN 
		set @Id = (SELECT IDENT_CURRENT('DetalleVenta')+1);
		set @CantidadTotal = (select SUM(Cantidad) from Ventas where Ticket = @Id);
		set @Total = (select SUM(Monto) from Ventas where Ticket = @Id)
		insert into DetalleVenta values (@CantidadTotal,@Total,GETDATE(),@IdCliente)
	END
end;
GO

-- PROCEDURE PARA HACER EL REGISTRO DE PRECIOS
CREATE OR ALTER PROCEDURE sp_RegistroPrecio(@id int)
AS
BEGIN
	declare @PrecioAnCompra money, @PrecioAnVenta money, @PrecioActCompra money, @PrecioActVenta money;
	set @PrecioAnCompra = (select PrecioCompraAnterior from RegistroPrecioProducto where idAproducto = @id);
	set @PrecioAnVenta = (select PrecioVentaAnterior from RegistroPrecioProducto where idAproducto = @id);
	set @PrecioActCompra = (select PrecioCompraActual from RegistroPrecioProducto where idAproducto = @id);
	set @PrecioActVenta = (select PrecioVentaActual from RegistroPrecioProducto where idAproducto = @id);

	IF @PrecioAnCompra = @PrecioActCompra
	BEGIN
		select RP.idAproducto,RP.IdProducto,P.Nombre,RP.Fecha,RP.Usuario,'Precio Venta' as 'Campo',RP.PrecioVentaAnterior as 'PrecioAnterior', RP.PrecioVentaActual as 'PrecioActual'  from RegistroPrecioProducto as RP INNER JOIN Productos as P ON RP.idProducto=P.IdProducto where idAproducto = @id
	END
	ELSE
	BEGIN 
		select RP.idAproducto,RP.IdProducto,P.Nombre,RP.Fecha,RP.Usuario,'Precio Compra' as 'Campo',RP.PrecioCompraAnterior as 'PrecioAnterior', RP.PrecioCompraActual as 'PrecioActual'  from RegistroPrecioProducto as RP INNER JOIN Productos as P ON RP.idProducto=P.IdProducto where idAproducto = @id
	END
END
GO

-- PROCEDURE PARA HACER LA FACTURA
CREATE OR ALTER PROCEDURE sp_Factura(@id int)
AS
BEGIN
	DECLARE @IdCliente int = (SELECT IdCliente from DetalleVenta where IdDetalleVenta = @id);
	select v.IdVenta, p.IdProducto ,p.Nombre, v.Cantidad, v.Precio, v.Ticket, v.Monto, d.Fecha, d.Total from Ventas as v INNER JOIN DetalleVenta as d on v.Ticket = d.IdDetalleVenta INNER JOIN Productos as p ON v.IdProducto = p.IdProducto where Ticket = @id;
	select * from facturaClienteDatos where ID = @IdCliente;
END
GO

-->> TRIGGERS <<--
--INSER PRODUCTO
CREATE TRIGGER TR_InsertProducto
ON Productos
FOR INSERT
AS
SET NOCOUNT ON;
DECLARE @idProducto INT
SELECT @idProducto=idProducto FROM inserted
INSERT INTO RegistroProducto VALUES(@idProducto,GETDATE(),'Insert',SYSTEM_USER)
GO

--DELETE PRODUCTO
CREATE TRIGGER TR_DeleteProducto
ON Productos
FOR DELETE
AS
SET NOCOUNT ON;
DECLARE @idProducto INT
SELECT @idProducto=idProducto FROM deleted
INSERT INTO RegistroProducto VALUES(@idProducto,GETDATE(),'Delete',SYSTEM_USER)
GO

--UPDATE PRODUCTO
CREATE TRIGGER TR_UpdateProducto
ON Productos
FOR UPDATE
AS
SET NOCOUNT ON;
DECLARE @idProducto INT
SELECT @idProducto=idProducto FROM inserted
INSERT INTO RegistroProducto VALUES(@idProducto,GETDATE(),'Update',SYSTEM_USER)
GO

--DELETE TICKET
CREATE TRIGGER TR_DeletedProductTicket
ON Ventas
FOR DELETE
AS
SET NOCOUNT ON;
DECLARE @IdProducto INT, @Cantidad INT
select @Cantidad = Cantidad from deleted;
select @IdProducto = IdProducto from deleted;
update Productos set Productos.Stock = Productos.Stock+@Cantidad where Productos.IdProducto = @IdProducto;
GO

--STOCK
CREATE TRIGGER TR_UpdateInventarioProductos 
ON Ventas
FOR INSERT 
AS
SET NOCOUNT ON;
UPDATE Productos SET Productos.Stock=Productos.Stock-inserted.Cantidad FROM inserted
INNER JOIN Productos ON Productos.idProducto=inserted.idProducto
GO

--DEVOLVER PRODUCTO
create or alter TRIGGER TR_DevolucionProducto
ON Ventas
after UPDATE 
AS
SET NOCOUNT ON;
DECLARE @Acantidad int, @Bcantidad int, @Idventa INT, @ticket int
SELECT @Acantidad=Cantidad FROM deleted
SELECT @Bcantidad=Cantidad FROM inserted
SELECT @Idventa =IdVenta from inserted
SELECT @ticket = Ticket from inserted
IF @Acantidad >=@Bcantidad
BEGIN
BEGIN TRY 
	BEGIN TRANSACTION
	UPDATE Productos SET Productos.Stock=Productos.Stock+(@Acantidad-@Bcantidad) FROM inserted
    INNER JOIN Productos ON Productos.idProducto=inserted.idProducto
    UPDATE Ventas SET Monto=(@Bcantidad*Precio) where IdVenta=@Idventa
	UPDATE DetalleVenta  SET DetalleVenta.Total=(select sum(Monto) FROM Ventas WHERE Ticket=@ticket) WHERE IdDetalleVenta= @ticket
	COMMIT
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
	END CATCH
END
GO

--UPDATE PRECIO
CREATE OR ALTER TRIGGER TR_UpdatePrecio
ON Productos
AFTER UPDATE
AS
SET NOCOUNT ON;
	DECLARE @idProducto INT
	DECLARE @PrecioCompraAnterior MONEY
	DECLARE @PrecioCompraActual MONEY
	DECLARE @PrecioVentaAnterior MONEY
	DECLARE @PrecioVentaActual MONEY
	SELECT @idProducto=idProducto FROM inserted
	SELECT @PrecioCompraAnterior=PrecioCompra FROM deleted
	SELECT @PrecioCompraActual=PrecioCompra FROM inserted
	SELECT @PrecioVentaAnterior=PrecioVenta FROM deleted
	SELECT @PrecioVentaActual=PrecioVenta FROM inserted
	IF UPDATE(PrecioCompra) OR UPDATE(PrecioVenta)
	BEGIN 	
		IF @PrecioVentaAnterior != @PrecioVentaActual
		BEGIN
		INSERT INTO RegistroPrecioProducto VALUES(@idProducto,GETDATE(),'Update',SYSTEM_USER,@PrecioCompraAnterior,
			@PrecioCompraAnterior,@PrecioVentaAnterior,@PrecioVentaActual)
		END
		IF @PrecioCompraActual != @PrecioCompraAnterior
		BEGIN
		INSERT INTO RegistroPrecioProducto VALUES(@idProducto,GETDATE(),'Update',SYSTEM_USER,@PrecioCompraAnterior,
			@PrecioCompraActual,@PrecioVentaAnterior,@PrecioVentaAnterior)
		END
	END
GO

EXEC sp_insertCategoria 'Corte'
EXEC sp_insertCategoria 'Seguridad'
EXEC sp_insertCategoria 'Construccion'
EXEC sp_insertPersonas 'Juan','Pérez','Calle Guadalupe 54','5423123','4451002030', 36260, 'San Jos'
EXEC sp_insertPersonas 'Ernesto','Sanchez','Calle Independencia 26','123455','4451005787', 38961, 'San Juan'
EXEC sp_insertPersonas 'Martin','Moreno','Calle Libertad 8','876543','4451005674', 36588, 'San Vice'
EXEC sp_insertProveedor 'Truper','8009016200';
EXEC sp_insertProveedor 'Bosch','8009019500';
EXEC sp_insertProveedor 'Makita','8009019500';
EXEC sp_insertProducto 'Martillo',3,35,40,100,1;
EXEC sp_insertProducto 'Disco Corte',1,10,14,250,2;
EXEC sp_insertProducto 'Lentes Transparentes',2,9,12,15,3;
EXEC sp_insertCliente 1
EXEC sp_insertCliente 2
EXEC sp_inserteEmpleados 3,250,'Empleado'
GO

-->> VISTAS <<--
--PRODUCTOS
CREATE VIEW VistaProductos 
AS
	SELECT p.IdProducto ,p.Nombre,c.Categoria, p.PrecioCompra, p.PrecioVenta, p.Stock, pr.Proveedor from Productos AS p INNER JOIN Categorias AS c
	ON p.IdCategoria=c.IdCategoria 
	INNER JOIN Proveedores AS pr 
	ON p.IdProveedor=pr.IdProveedor
GO

--CLIENTE
CREATE or ALTER VIEW VistaCliente
AS
	SELECT c.IdCliente, CONCAT(p.Nombre,' ', p.Apellidos) as Nombre, p.Direccion, p.Telefono from Clientes as c INNER JOIN Personas as p ON c.IdPersona = p.IdPersona;
go

--EMPLEADO
CREATE or ALTER VIEW vistaEmpleados
AS
	SELECT e.IdEmpleado, CONCAT(p.Nombre,' ', p.Apellidos) as Nombre, p.Direccion, e.Sueldo, e.Estatus from Empleados as e INNER JOIN Personas as p ON e.IdPersona = p.IdPersona;
go

--PERSONAS
CREATE OR ALTER VIEW VistaPersonas
AS
select P.IdPersona, CONCAT(P.Nombre,' ', P.Apellidos) as Nombre, P.Direccion, P.Cuenta, P.Telefono, P.CP, P.Colonia from Personas as P
GO

--REGISTRO DE PRODUCTOS
CREATE VIEW vistaRegistroProductos
AS
 select RP.idAproducto as ID, P.Nombre, P.IdProducto, FORMAT(RP.Fecha,'dd-MM-yyyy','en-US') as Fecha, RP.Accion, RP.Usuario from RegistroProducto as RP INNER JOIN Productos as P on RP.idProducto = P.IdProducto;
GO

--VENTAS
CREATE or ALTER VIEW vistaVentas
AS
	SELECT d.IdDetalleVenta, d.Cantidad, d.Total, FORMAT(d.Fecha,'dd-MM-yyyy','en-US') as Fecha, CONCAT(p.Nombre,' ', p.Apellidos) as Nombre from DetalleVenta as d INNER JOIN Clientes as c ON d.IdCliente = c.IdCliente INNER JOIN Personas as p on c.IdPersona=p.IdPersona;
go

--REGISTRO DE PRECIOSPRODUCTOS
CREATE VIEW vistaRegistroPrecioProductos
AS
 select RP.idAproducto as ID, P.Nombre, P.IdProducto, FORMAT(RP.Fecha,'dd-MM-yyyy','en-US') as Fecha, RP.Usuario from RegistroPrecioProducto as RP INNER JOIN Productos as P on RP.idProducto = P.IdProducto;
GO

--PRIMER TICKET
CREATE VIEW vistaTicketPrimerVenta
as
	select v.IdVenta ,p.Nombre as Producto, v.Cantidad, v.Precio,v.Monto from Ventas as v INNER JOIN Productos as p ON v.IdProducto = p.IdProducto where v.Ticket = 1;
go

--TICKET
CREATE VIEW vistaTicket
as
	select v.IdVenta ,p.Nombre as Producto, v.Cantidad, v.Precio,v.Monto from Ventas as v INNER JOIN Productos as p ON v.IdProducto = p.IdProducto where v.Ticket = dbo.obtenerTicket();
go

--FACTURAS
CREATE OR ALTER VIEW VistaFactura
as
	select v.IdVenta ,p.Nombre as Producto, v.Cantidad, v.Precio,v.Monto from Ventas as v INNER JOIN Productos as p ON v.IdProducto = p.IdProducto;
go

--DATOS FACTURA
CREATE OR ALTER VIEW facturaClienteDatos
AS
 select c.IdCliente as ID,CONCAT(p.Nombre,' ', p.Apellidos) as 'Nombre', p.Cuenta, p.Direccion, p.Telefono, p.CP, p.Colonia from Personas as p INNER JOIN Clientes as c on p.IdPersona = c.IdPersona
GO
--DATOS VISTATICKET
CREATE OR ALTER VIEW vistaTicketProductos
as
	select v.IdVenta ,p.Nombre as Producto, v.Cantidad, v.Precio,v.Monto,v.Ticket  from Ventas as v INNER JOIN Productos as p ON v.IdProducto = p.IdProducto;
go

CREATE VIEW vistaNombresRegistro
AS
 select RP.idAproducto as ID, P.Nombre from RegistroPrecioProducto as RP INNER JOIN Productos as P on RP.idProducto = P.IdProducto;
go

-->> TRANSACCIONES <<--
--TRANSACCION DETALLE VENTA
CREATE PROCEDURE sp_TransaccionDetalleVenta (@IdCliente int)
AS
BEGIN
	BEGIN TRY 
	BEGIN TRANSACTION
	EXEC sp_DetalleVenta @Idcliente
	COMMIT
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
	END CATCH
END
go

select * from VistaPersonas
