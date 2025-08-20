
const fs = require('fs').promises;
const path = require('path');

// URL base de la API y el nombre del archivo local.
const API_URL = 'https://fakestoreapi.com/products';
const FILE_NAME = path.join(__dirname, 'productos.json');

// --- Funciones para interactuar con la API (Fetch) ---

// 1. Obtiene todos los productos (GET).
async function obtenerProductos() {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) {
      throw new Error(`Error en la solicitud: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    console.log('--- Productos recuperados (Todos) ---');
    console.log(datos);
    return datos;
  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
  }
}

// 2. Obtiene un número limitado de productos (GET).
async function obtenerProductosLimitados(limite) {
  try {
    const respuesta = await fetch(`${API_URL}?limit=${limite}`);
    if (!respuesta.ok) {
      throw new Error(`Error en la solicitud: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    console.log(`--- Productos recuperados (Límite: ${limite}) ---`);
    console.log(datos);
    return datos;
  } catch (error) {
    console.error('Error al obtener productos limitados:', error);
  }
}

// 3. Agrega un nuevo producto (POST).
async function agregarProducto(producto) {
  try {
    const respuesta = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(producto),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!respuesta.ok) {
      throw new Error(`Error en la solicitud: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    console.log('--- Nuevo producto agregado (POST) ---');
    console.log(datos);
  } catch (error) {
    console.error('Error al agregar el producto:', error);
  }
}

// 4. Busca un producto por ID (GET).
async function obtenerProductoPorId(id) {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`);
    if (!respuesta.ok) {
      throw new Error(`Error en la solicitud: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    console.log(`--- Producto encontrado por ID (${id}) ---`);
    console.log(datos);
  } catch (error) {
    console.error(`Error al buscar el producto con ID ${id}:`, error);
  }
}

// 5. Elimina un producto (DELETE).
async function eliminarProducto(id) {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!respuesta.ok) {
      throw new Error(`Error en la solicitud: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    console.log(`--- Producto eliminado (DELETE) ---`);
    console.log(datos);
  } catch (error) {
    console.error(`Error al eliminar el producto con ID ${id}:`, error);
  }
}

// 6. Modifica un producto (PUT).
async function modificarProducto(id, productoActualizado) {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productoActualizado),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!respuesta.ok) {
      throw new Error(`Error en la solicitud: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    console.log(`--- Producto modificado (PUT) ---`);
    console.log(datos);
  } catch (error) {
    console.error(`Error al modificar el producto con ID ${id}:`, error);
  }
}

// --- Funciones para interactuar con el archivo local (FileSystem) ---

// 7. Persiste los datos en un archivo JSON local.
async function guardarProductosEnArchivo(productos) {
  try {
    // Convierte el array de productos a una cadena JSON con formato legible.
    await fs.writeFile(FILE_NAME, JSON.stringify(productos, null, 2));
    console.log(`Datos guardados exitosamente en ${FILE_NAME}`);
  } catch (error) {
    console.error('Error al guardar en el archivo:', error);
  }
}

// 8. Lee los datos del archivo local.
async function leerProductosDeArchivo() {
  try {
    // Lee el contenido del archivo y lo parsea como un objeto JSON.
    const datos = await fs.readFile(FILE_NAME, 'utf-8');
    return JSON.parse(datos);
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    // Si hay un error (ej. el archivo no existe), devuelve un array vacío.
    return [];
  }
}

// 9. Agrega un producto al archivo local.
async function agregarProductoAArchivo(nuevoProducto) {
  const productos = await leerProductosDeArchivo();
  productos.push(nuevoProducto);
  await guardarProductosEnArchivo(productos);
  console.log('Producto agregado al archivo local.');
}

// 10. Elimina productos con precio superior a un valor.
async function eliminarProductosCaros(valorMaximo) {
  const productos = await leerProductosDeArchivo();
  // Filtra el array, manteniendo solo los productos con un precio menor o igual al valor máximo.
  const productosFiltrados = productos.filter(producto => producto.price <= valorMaximo);
  await guardarProductosEnArchivo(productosFiltrados);
  console.log(`Productos con precio superior a $${valorMaximo} eliminados del archivo local.`);
}

// --- Orquestación de las tareas ---

async function main() {
  // Tareas de la API
  const productosLimitados = await obtenerProductosLimitados(5);
  if (productosLimitados) {
    await guardarProductosEnArchivo(productosLimitados);
  }

  const nuevoProducto = {
    title: 'Nueva mochila',
    price: 109.95,
    description: 'Una mochila elegante y duradera.',
    image: 'https://i.pravatar.cc',
    category: 'electronics'
  };
  await agregarProducto(nuevoProducto);
  await obtenerProductoPorId(1);
  await eliminarProducto(6);
  
  const productoActualizado = {
    title: 'MacBook Pro 2025',
    price: 1500,
    description: 'La última tecnología en laptops.',
    image: 'https://i.pravatar.cc',
    category: 'electronics'
  };
  await modificarProducto(7, productoActualizado);
  await obtenerProductos(); // Opcional: para ver la lista completa
  
  // Tareas del FileSystem
  const productoParaAgregar = {
    id: 101,
    title: 'Auriculares Inalámbricos',
    price: 89.99,
    description: 'Excelente calidad de sonido.',
    image: 'https://i.pravatar.cc',
    category: 'electronics'
  };
  await agregarProductoAArchivo(productoParaAgregar);

  await eliminarProductosCaros(500);
}

// Ejecuta el script principal
main();