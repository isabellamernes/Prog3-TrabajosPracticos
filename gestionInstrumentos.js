// Grupo: G
// Trabajo Práctico 1 - Arrays JS - Programación III | 2025 | UNER

// 1. Configuración Inicial

// Declarar array de instrumentos con precios 
const instrumentos = [
    { id: 1, nombre: "Guitarra Eléctrica", precio: "$934.383", stock: 2 },
    { id: 2, nombre: "Bajo", precio: "$513.276", stock: 1 },
    { id: 3, nombre: "Batería Acústica", precio: "$1.506.695", stock: 0 },
    { id: 4, nombre: "Teclado", precio: "$422.362", stock: 5 },
    { id: 5, nombre: "Micrófono", precio: "$263.985", stock: 7 }
];

// 2. Operaciones Básicas y Acceso

// 2.1 Imprimir longitud total
console.log("Cantidad de instrumentos cargados:", instrumentos.length);

// 2.2 Imprimir nombre del segundo y cuarto elemento
console.log("Segundo instrumento:", instrumentos[1].nombre);
console.log("Cuarto instrumento:", instrumentos[3].nombre);

// 3. Recorrido del Array

// 3.1  nombre y el precio de cada instrumento
console.log("\n--- Instrumentos y Precios ---");
for (const inst of instrumentos) {
    console.log(`${inst.nombre}: ${inst.precio}`);
}

// 3.2 forEach con frase descriptiva
console.log("\n--- Instrumentos Detallados ---");
instrumentos.forEach((inst, i) => {
    console.log(`Instrumento ${i+1}: ${inst.nombre} | Precio final: ${inst.precio}`);
});

// 4. Manipulación de Arrays

// 4.1 Agregar dos instrumentos al final (push)
instrumentos.push(
    { id: 6, nombre: "Amplificador", precio: "$819.624", stock: 3 },
    { id: 7, nombre: "Pandereta", precio: "$84.947", stock: 4 }
);
console.log("\nSe agregan dos instrumentos al final:");
console.table(instrumentos);

// 4.2 Eliminar último instrumento (pop)
const eliminadoFinal = instrumentos.pop();
console.log(`\nEliminado del final: ${eliminadoFinal.nombre}`);
console.log("Se elimina el último instrumento:");
console.table(instrumentos);

// 4.3 Agregar un instrumento al inicio (unshift)
instrumentos.unshift({ id: 8, nombre: "Cajón Peruano", precio: "$93.093", stock: 2 });
console.log("\nSe agrega un instrumento al inicio:");
console.table(instrumentos);

// 4.4 Eliminar el primero (shift)
const eliminadoInicio = instrumentos.shift();
console.log(`Eliminado del inicio: ${eliminadoInicio.nombre}`);
console.log("Se elimina el primer instrumento:");
console.table(instrumentos);

// 4.5 Crear array con stock > 0 (filter)
const instrumentosConStock = instrumentos.filter(inst => inst.stock > 0);
console.log("\nInstrumentos con stock disponible:", instrumentosConStock);

// 4.6 Array de nombres de todos los productos (map)
const nombresInstrumentos = instrumentos.map(inst => inst.nombre);
console.log("\nListado de nombres de instrumentos:", nombresInstrumentos);

// 4.7 Buscar por id específico (find)
const idBuscado = 3; // Cambiar este valor para buscar otro id
const instrumentoBuscado = instrumentos.find(inst => inst.id === idBuscado);
if (instrumentoBuscado) {
    console.log(`\nInstrumento con id ${idBuscado} encontrado:`, instrumentoBuscado);
} else {
    console.log(`\nNo existe instrumento con id ${idBuscado}`);
}

// 4.8 Array ordenado por precio decreciente (sort)
const aNumero = (s) => Number(s.replaceAll(".", "").replace("$", ""));
const instrumentosOrdenados = [...instrumentos].sort((a, b) => aNumero(b.precio) - aNumero(a.precio));
console.log("\nInstrumentos ordenados por precio (desc):", instrumentosOrdenados);

// ---------- Mostrar estado final del array ----------
console.log("\nArray final de instrumentos:");
console.table(instrumentos);
