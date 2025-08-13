console.log("1ER Punto: Configuración Inicial: Se instaló la versión v22.18.0 de Node.js");
console.log( "---");
console.log( "1.2 Dentro de la carpeta TP1 se creo gestionDatos.js");

/*1.3 Declaración array de productos de informática*/
console.log( "*****************");
const productos = [
{ id: 1, nombre: 'Monitor', precio: 1200, stock: 10 },
{ id: 2, nombre: 'Teclado', precio: 2200, stock: 2 },
{ id: 3, nombre: 'Mouse', precio: 200, stock: 5 },
{ id: 4, nombre: 'Impresora', precio: 4500, stock: 35 },
{ id: 5, nombre: 'Auriculares', precio: 4700, stock: 75 },
{ id: 6, nombre: 'Camara', precio: 1900, stock: 35 },
];

console.log("2DO Punto: Operaciones Básicas y Acceso");
console.log( "*****************");

console.log("2.1 Imprimir la longitud total del array productos.");

console.log(`En la tienda tenemos: ${productos.length} productos distintos`);/* Como lo pensamos en una tienda de informática, por eso esta declarado ese comentario*/
console.log( "*****************");

/*2.2 Acceder e imprimir por consola el nombre del segundo y cuarto elemento del array utilizando su índice.*/
console.log("2.2 El nombre del segundo y cuarto elmento del array acorde índice son:");
console.log(`*El nombre del segundo producto es: ${productos[1].nombre}`);
console.log(`*El nombre del cuarto producto es: ${productos[3].nombre}`); 
console.log( "*****************");

console.log("3ER Punto: Recorrido del Array");
console.log( "*****************");

console.log("3.1 ER Punto: Recorrido del Array");
console.log("Recorrido del array productos utilizando -un bucle for...of- e impresión del nombre y precio de cada elemento:");

for (const producto of productos) {
  console.log(`Nombre: ${producto.nombre}, Precio: ${producto.precio}`);
}

console.log( "*****************");
console.log("3.2 Recorrido el array productos utilizando el método forEach() e impresión la misma información que en el punto anterior, pero agregando una frase descriptiva.");
console.log("\nRecorrido con forEach():");
productos.forEach(producto => {
  console.log(`Producto: ${producto.nombre}, Precio: ${producto.precio}`);
});


console.log( "*****************");
console.log("4TO Punto: Manipulación de Arrays");
console.log( "*****************");

console.log("4.1 Agregar dos elementos al final del array productos utilizando push()");
productos.push({ id: 7, nombre: 'Pendrive', precio: 1505, stock: 5 });
productos.push({ id: 8, nombre: 'Parlante', precio: 7650, stock: 12 });
console.log("\nArray actualizado despues de usar push():", productos);

console.log( "*****************");

console.log("4.2 Eliminar el último elemento del array productos utilizando pop()");
const ultimoElemento = productos.pop();
console.log("\nElemento eliminado con pop():", ultimoElemento);
console.log("Array después de usar pop():", productos);

console.log( "*****************");

console.log("4.3 Agregar un nuevo elemento al inicio del array productos utilizando unshift()");
productos.unshift({ id: 0, nombre: 'Microfono', precio: 4500, stock: 20 });
console.log("\nArray después de usar unshift():", productos);

console.log( "*****************");

console.log("4.4 Elimina el primer elemento del array productos utilizando shift()");
const primerElemento = productos.shift();
console.log("\nElemento eliminado con shift():", primerElemento);
console.log("Array después de usar shift():", productos);

console.log( "*****************");

console.log("4.5 Crear un nuevo array llamado productosConStock que contenga solo los elementos del array productos donde el stock sea mayor que 0 utilizando filter()");
const productosConStock = productos.filter(producto => producto.stock > 0);
console.log("\nProductos con stock mayor a 0 (usando filter):", productosConStock); 

console.log( "*****************");

console.log("4.6 Crear un nuevo array llamado nombresProductos que contenga solo los nombres de todos los productos en el inventario utilizando map()");
const nombresProductos = productos.map(producto => producto.nombre); 
console.log("\nNombres de los productos (usando map):", nombresProductos);


console.log( "*****************");

console.log("4.7 Encontrar y guardar en una variable el primer producto en productos que tenga un id específico (ej. id:3) utilizando find(). Si no lo encuentra, indicar que no existe.")
const productoBuscado = productos.find(producto => producto.id === 3);
console.log("\nResultado de find() para id: 3:");
if (productoBuscado) {
  console.log(productoBuscado);
} else {
  console.log("Producto con id: 3 no encontrado.");
}

const productoBuscado2 = productos.find(producto => producto.id ===10);
console.log("\nResultado de find() para id: 10:");
if (productoBuscado2) {
  console.log(productoBuscado2);
} else {
  console.log("Producto con id: 10 no encontrado.");
}

console.log( "*****************");

console.log("4.8 Crear un nuevo array llamado  productosOrdenados que contenga los productos ordenados por precio en orden decreciente. (investigar método sort())");
console.log("El método sort() ordena los elementos de un array. Para ordenar objetos por una propiedad específica (como precio), se necesita proporcionar una función de comparación. Para ordenar en orden decreciente, se va a querer que la función de comparación devuelva un valor positivo si el primer elemento debe ir antes que el segundo.")

const productosOrdenados = [...productos].sort((a, b) => b.precio - a.precio);
console.log("\nProductos ordenados por precio (descendente):", productosOrdenados);