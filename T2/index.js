// index.js
// TP 2 - Programación III
// Alumno: [THUIAGO CHAMORRO] - Grupo N° [G]

const fs = require("fs");


// URL base de la API
const API_URL = "https://fakestoreapi.com/products";

// =======================
//  FUNCIONES FETCH
// =======================

// Obtener todos los productos
async function getAllProducts() {
  const res = await fetch(API_URL);
  const data = await res.json();
  console.log("Todos los productos obtenidos:", data.length);
  return data;
}

// Obtener productos limitados
async function getLimitedProducts(limit = 5) {
  const res = await fetch(`${API_URL}?limit=${limit}`);
  const data = await res.json();
  console.log(` ${limit} productos obtenidos`);
  return data;
}

// Guardar datos en archivo JSON
function saveToFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(` Datos guardados en ${filename}`);
}

// Agregar un producto (POST)
async function addProduct(product) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(product),
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  console.log(" Producto agregado en API:", data);
  return data;
}

// Buscar producto por ID
async function getProductById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const data = await res.json();
  console.log(` Producto con id=${id}:`, data);
  return data;
}

// Eliminar producto (DELETE)
async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  const data = await res.json();
  console.log(` Producto eliminado en API (id=${id}):`, data);
  return data;
}

// Modificar producto (PUT)
async function updateProduct(id, updates) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  console.log(` Producto actualizado en API (id=${id}):`, data);
  return data;
}

// =======================
//  FUNCIONES FILESYSTEM
// =======================

// Agregar un producto al archivo local
function addProductToFile(filename, product) {
  const data = JSON.parse(fs.readFileSync(filename));
  data.push(product);
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log("Producto agregado al archivo local");
}

// Eliminar productos cuyo precio supere un valor
function removeExpensiveProducts(filename, maxPrice) {
  let data = JSON.parse(fs.readFileSync(filename));
  data = data.filter((p) => p.price <= maxPrice);
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(` Eliminados productos con precio mayor a ${maxPrice}`);
}

// =======================
//  MAIN
// =======================
async function main() {
  // --- FETCH ---
  const allProducts = await getAllProducts(); // GET todos
  const limitedProducts = await getLimitedProducts(5); // GET limitados

  saveToFile("products.json", limitedProducts); // Guardar en archivo

  const newProduct = await addProduct({
    title: "Teclado Mecánico RGB",
    price: 120,
    description: "Switches azules, retroiluminación.",
    image: "https://i.pravatar.cc",
    category: "electronics",
  }); // POST

  await getProductById(1); // GET por id
  await updateProduct(1, { title: "Producto actualizado", price: 250 }); // PUT
  await deleteProduct(2); // DELETE

  // --- FILESYSTEM ---
  addProductToFile("products.json", newProduct); // Agregar al JSON local
  removeExpensiveProducts("products.json", 100); // Eliminar caros

  console.log(" TP 2 Finalizado correctamente");
}

main();

