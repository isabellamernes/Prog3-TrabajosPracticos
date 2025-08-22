const fs = require('fs').promises;

// URL base de la API
const urlApi = 'https://fakestoreapi.com/products';

// Nombre del archivo local para persistir los datos
const FILENAME = 'productos.json';

// --- API Fetch ---

// 1. Recuperar la información de todos los productos (GET)
async function getTodosProductos() {
    try {
        console.log("--- 1. Recuperando todos los productos ---");
        const response = await fetch(urlApi);
        if (!response.ok) {
            throw new Error('Error ' + response.status);
        }
        const productos = await response.json();
        console.log(`Productos recuperados: ${productos.length}`);
        return productos;
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
}

// 2. Recuperar la información de un número limitado de productos (GET)
async function getProductosLimitados(limit) {
    try {
        console.log(`\n--- 2. Recuperando ${limit} productos ---`);
        const response = await fetch(`${urlApi}?limit=${limit}`);
        if (!response.ok) {
            throw new Error('Error ' + response.status);
        }
        const productos = await response.json();
        console.log(`Productos limitados (${productos.length}):`, productos);
        return productos;
    } catch (error) {
        console.error("Error al obtener productos limitados:", error);
    }
}

// 3. Agregar un nuevo producto (POST)
async function crearProducto(nuevoProducto) {
    try {
        console.log("\n--- 4. Agregando un nuevo producto (POST) ---");
        const response = await fetch(urlApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoProducto)
        });
        if (!response.ok) {
            throw new Error('Error ' + response.status);
        }
        const datos = await response.json();
        console.log("Producto agregado (respuesta de la API):", datos);
        return datos;
    } catch (error) {
        console.error("Error al agregar producto:", error);
    }
}

// 4. Buscar la información de un determinado producto por ID (GET)
async function getProductoPorId(id) {
    try {
        console.log(`\n--- 5. Buscando producto con ID: ${id} (GET) ---`);
        const response = await fetch(`${urlApi}/${id}`);
        if (!response.ok) {
            throw new Error('Error ' + response.status);
        }
        const producto = await response.json();
        console.log("Producto encontrado:", producto);
        return producto;
    } catch (error) {
        console.error(`Error al buscar producto con ID ${id}:`, error);
    }
}

// 5. Eliminar un producto (DELETE)
async function eliminarProducto(id) {
    try {
        console.log(`\n--- 6. Eliminando producto con ID: ${id} (DELETE) ---`);
        const response = await fetch(`${urlApi}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error('Error ' + response.status);
        }
        const resultado = await response.json();
        console.log("Producto eliminado (respuesta de la API):", resultado);
        return resultado;
    } catch (error) {
        console.error(`Error al eliminar producto con ID ${id}:`, error);
    }
}

// 6. Modificar los datos de un producto (UPDATE/PUT)
async function modificarProducto(id, datosModificados) {
    try {
        console.log(`\n--- 7. Modificando producto con ID: ${id} (PUT) ---`);
        const response = await fetch(`${urlApi}/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosModificados)
        });
        if (!response.ok) {
            throw new Error('Error ' + response.status);
        }
        const resultado = await response.json();
        console.log("Producto modificado (respuesta de la API):", resultado);
        return resultado;
    } catch (error) {
        console.error(`Error al modificar producto con ID ${id}:`, error);
    }
}

// --- FileSystem ---

// 1. Persistir los datos en un archivo local JSON
async function persistirEnArchivo(productos) {
    try {
        console.log(`\n--- 3. Persistiendo datos en ${FILENAME} ---`);
        await fs.writeFile(FILENAME, JSON.stringify(productos, null, 2));
        console.log("Datos guardados correctamente.");
    } catch (error) {
        console.error("Error al guardar el archivo:", error);
    }
}

// 2. Agregar un producto al archivo local
async function agregarAlArchivo(nuevoProducto) {
    try {
        console.log("\n--- FileSystem: Agregando un nuevo producto al archivo local ---");
        const datos = await fs.readFile(FILENAME, 'utf8');
        const productos = JSON.parse(datos);
        productos.push(nuevoProducto);
        await fs.writeFile(FILENAME, JSON.stringify(productos, null, 2));
        console.log(`Producto "${nuevoProducto.title}" agregado al archivo.`);
        console.log("Estado actual del archivo:");
        console.log(await fs.readFile(FILENAME, 'utf8'));
    } catch (error) {
        console.error("Error al agregar producto al archivo:", error);
    }
}

// 3. Eliminar los productos superiores a un determinado valor del archivo local
async function eliminarPorPrecioMaximo(precioMaximo) {
    try {
        console.log(`\n--- FileSystem: Eliminando productos con precio superior a $${precioMaximo} ---`);
        const datos = await fs.readFile(FILENAME, 'utf8');
        const productos = JSON.parse(datos);
        const productosFiltrados = productos.filter(p => p.price <= precioMaximo);
        await fs.writeFile(FILENAME, JSON.stringify(productosFiltrados, null, 2));
        console.log(`Se eliminaron ${productos.length - productosFiltrados.length} productos.`);
        console.log("Estado actual del archivo:");
        console.log(await fs.readFile(FILENAME, 'utf8'));
    } catch (error) {
        console.error("Error al eliminar productos del archivo:", error);
    }
}

// --- Ejecución del programa ---

async function main() {
    try {
        // Ejecución de las tareas de la API
        const productosLimitados = await getProductosLimitados(3);
        await persistirEnArchivo(productosLimitados);

        const productoParaAgregar = {
            title: 'Producto de prueba',
            price: 15.5,
            description: 'Nueva descripción',
            image: 'https://i.pravatar.cc',
            category: 'electrónica'
        };
        await crearProducto(productoParaAgregar);

        await getProductoPorId(1);

        const datosModificados = {
            title: 'Producto Modificado',
            price: 99.99
        };
        await modificarProducto(1, datosModificados);

        // La API devuelve el objeto eliminado, no lo elimina realmente
        await eliminarProducto(2);

        // Ejecución de las tareas de FileSystem
        const productoLocal = {
            id: 101,
            title: 'Producto Agregado Localmente',
            price: 25.50
        };
        await agregarAlArchivo(productoLocal);

        await eliminarPorPrecioMaximo(50);

        console.log('\n✅ Todas las operaciones completadas. Revisa el archivo "productos.json" para ver el resultado final.');
    } catch (error) {
        console.error("Ha ocurrido un error en la ejecución:", error);
    }
}

main();