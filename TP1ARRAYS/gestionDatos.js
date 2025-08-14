//TRABAJO NUM 1 -ARRAYS // Thiago Chamorro

//CREAMOS EL ARRAY//

console.log(`TRABAJO NUMERO 1 - ARRAYS `) 
s

console.log(`PUNTO 1 -Creamos el array`)
const productos = [

{ id:1, nombre:'Teclado Mecanico', precio:25000, stock:8 },
{ id:2, nombre:'Mouse Inalambrico ', precio:15000, stock:15 },
{ id:3, nombre:'Monitor 24"', precio:82000, stock:5 },
{ id:4, nombre:'Auriculares Bluetooth', precio:30000, stock:0 },
{ id:5, nombre:'Notebook Gamer', precio:450000, stock:3 },
];

console.log('Array Inicial: ', productos);



// PUNTO 2//

//Recorremos  y imprimimos la cantidad de productos que hay en el array//

console.log(`PUNTO 2 -Recorremos  y imprimimos la cantidad de productos que hay en el array `)

///////////////////////////////////////////////////
console.log(`Hay ${productos.length} productos en total`);



console.log(`PUNTO 2 -Accedemos y imprimimos el nombres del segundo y cuarto producto `)


//Accedemos y imprimimos el nombres del segundo y cuarto producto//
console.log(`Producto numero 2: ${productos[1].nombre}`);
console.log(`Producto numero 4: ${productos[3].nombre}`);





//PUNTO 3// 

//BUCLE FOR ...OF//
console.log(`PUNTO 3 - Bucle For of`)


for(const producto of productos){
    console.log( `${producto.nombre}`);
    console.log (` ${producto.precio}`);


}


//BUCLE FOR EACH
console.log(`PUNTO 3 - Bucle for each`)



productos.forEach((producto, indice) => {
    console.log(`Producto: ${indice+1} :'Nombre': ${producto.nombre} — 'Precio:' $${producto.precio}`); 
});



//PUNTO 4

//1
console.log(`PUNTO 4.1 - Agregar al final dos productos nuevos`)



console.log(productos)
productos.push(
    { id: 6, nombre: 'Impresora 3D', precio: 120000, stock: 10 },
    { id: 7, nombre: 'Tablet', precio: 170000, stock: 6 }
  );

  console.log(`Se agrego un nuevo producto : ${productos[5].nombre}`);
  console.log(`Se agrego un nuevo producto: ${productos[6].nombre}`);
console.log(productos)

//2
console.log(`PUNTO 4 .2-Eliminar el ultimo elemento de la fila- usando pop`)



console.log(productos)
const ultimoeliminado= productos.pop();
console.log(`Se elimino correctamente el ultimo producto de la fila`)
console.log(`Producto eliminado: ${ultimoeliminado.nombre}`);

//3
console.log(`PUNTO 4.3 -Agregar al inicio un nuevo producto`)


console.log(productos)
productos.unshift(
    { id: 0, nombre: 'Joystick', precio: 80000, stock: 9 },
    
  );
console.log(`Se agrego un nuevo producto al inicio de la fila: ${productos[0].nombre}`);
console.log(productos)

//4

console.log(`PUNTO 4.4 -Eliminar el primer elemento de la fila usando shift`)

console.log(productos)
const primereliminado=productos.shift()
console.log(`Se elimino correctamente el primer producto de la fila`)
console.log(`Producto eliminado: ${primereliminado.nombre}`);

//5

console.log(`PUNTO 4.5 -filtrar los productos con stock mayor que 0`)


const productosConStock=productos.filter((producto) => {
return producto.stock > 0

});

console.log('Productos con stock:', productosConStock);


//6
console.log(`PUNTO 4.6 - obtener solo los nombres de los productos-utilizando map`);


const nombresProductos = productos.map((producto) => {
    return producto.nombre
});
console.log(nombresProductos)

//7

console.log(`PUNTO 4.7 - buscar producto por id`);

const idBuscado = 5; 
const productoEncontrado = productos.find((producto) => {
  return producto.id === idBuscado
});

if (productoEncontrado) {
  console.log(productoEncontrado);
} else {
  console.log('No existe un producto con ese id');
}
 //8


console.log(`PUNTO 4.8 - Ordenar productos segun su  precio`);

const productosOrdenados = productos.sort((a, b) => b.precio - a.precio);
console.log(productosOrdenados);
// Imprimo el array final 
 console.log('Array final despues de todas las operaciones realizadas ')
 console.log(productos)


