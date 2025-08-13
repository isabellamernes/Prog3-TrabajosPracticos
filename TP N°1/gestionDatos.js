console.log("---"); 
console.log("Parte 1:  Configuración Inicial");
console.log("---");

// 3) Declaración del array 'productos' con al menos 5 objetos
const productos = [
    { id: 1, nombre: "Computadora", precio: 1200, stock: 10 },
    { id: 2, nombre: "Mouse Inalámbrico", precio: 255, stock: 50 },
    { id: 3, nombre: "Teclado", precio: 75, stock: 15 },
    { id: 4, nombre: "Monitor", precio: 300, stock: 5 },
    { id: 5, nombre: "Auriculares", precio: 60, stock: 20 },
    { id: 6, nombre: "Cámara", precio: 100, stock: 0 }
];

console.log("Array de productos inicial:", productos);

console.log("---");
console.log("Parte 2: Operaciones Básicas y Acceso");
console.log("---");

// 1) Imprimir la longitud total del array
console.log("Cantidad total de productos:", productos.length);

// 2) Acceder e imprimir el nombre del segundo y cuarto elemento
console.log("Nombre del segundo producto:", productos[1].nombre);
console.log("Nombre del cuarto producto:", productos[3].nombre);

console.log("---"); 
console.log("Parte 3: Recorrido del Array");
console.log("---");

// 1) Recorrer con un bucle for...of e imprimir nombre y precio
for (const producto of productos) {
    console.log(`Nombre: ${producto.nombre}, Precio: $ ${producto.precio}, Stock: ${producto.stock}`);
}

// 2) Recorrer con el método forEach() e imprimir la misma información con frase descriptiva
productos.forEach(producto => {
    console.log(`Producto: ${producto.nombre}, Precio: $ ${producto.precio}, Stock: ${producto.stock}`);
});

console.log("---"); 
console.log("Parte 4: Manipulación de Arrays");
console.log("---");

// 1. Agregar dos elementos al final con push()
productos.push(
    { id: 7, nombre: "Tarjeta Gráfica", precio: 800, stock: 8 },
    { id: 8, nombre: "Fuente de Poder", precio: 60, stock: 12 }
);
console.log("Array después de push():", productos);

// 2. Eliminar el último elemento con pop()
const productoEliminadoPop = productos.pop();
console.log("\nArray después de pop():", productos);
console.log("Producto eliminado con pop():", productoEliminadoPop);

// 3. Agregar un nuevo elemento al inicio con unshift()
productos.unshift({ id: 9, nombre: "Mousepad XL", precio: 15, stock: 30 });
console.log("\nArray después de unshift():", productos);

// 4. Eliminar el primer elemento con shift()
const productoEliminadoShift = productos.shift();
console.log("\nArray después de shift():", productos);
console.log("Producto eliminado con shift():", productoEliminadoShift);

// 5. Crear un nuevo array con filter() donde stock > 0
const productosConStock = productos.filter(producto => producto.stock > 0);
console.log("\nProductos con stock > 0 (usando filter):", productosConStock);

// 6. Crear un nuevo array con map() que contenga solo los nombres
const nombresProductos = productos.map(producto => producto.nombre);
console.log("\nArray de nombres de productos (usando map):", nombresProductos);

// 7. Encontrar un producto por ID con find()
const idBuscado = 3;
const productoEncontrado = productos.find(producto => producto.id === idBuscado);
if (productoEncontrado) {
    console.log(`\nProducto con id ${idBuscado} encontrado:`, productoEncontrado);
} else {
    console.log(`\nNo se encontró ningún producto con el id ${idBuscado}.`);
}

// 8. Crear un nuevo array ordenado por precio de forma decreciente con sort()
const productosOrdenados = productos.slice().sort((a, b) => b.precio - a.precio);
console.log("\nProductos ordenados por precio (decreciente):", productosOrdenados);

// 9. Imprimir el array final (el original) para verificar
console.log("\nArray 'productos' original después de todas las operaciones:", productos);