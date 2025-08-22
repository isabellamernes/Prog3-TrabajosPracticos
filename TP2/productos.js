'use strict';
/**
 * TP2 – JS Fecth y FileSystem
 * Programación III – 2025 
 * Grupo: G
 */

const fs = require('node:fs/promises');
const path = require('node:path');

const URL_PRODUCTOS = 'https://fakestoreapi.com/products';
// const URL_LOGIN     = 'https://fakestoreapi.com/auth/login'; // (no se usa en /products)
const ARCHIVO_JSON  = path.join(__dirname, 'inventario.json');

// Estado de autenticación 
// let tokenJWT = null; // (eliminado: /products no requiere autenticación)

//  Utilidades 
function asegurarOk(respuesta) {
  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status} – ${respuesta.statusText}`);
  }
}

async function leerJSON(ruta) {
  try {
    const texto = await fs.readFile(ruta, 'utf8');
    return JSON.parse(texto);
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

async function escribirJSON(ruta, datos) {
  await fs.writeFile(ruta, JSON.stringify(datos, null, 2), 'utf8');
}

/** Envoltura de fetch con headers ~y token si existe~ (sin token) */
async function llamarApi(sufijo = '', opciones = {}) {
  const headersBase = { 'Content-Type': 'application/json; charset=utf-8' };
  const headers = { ...headersBase, ...(opciones.headers || {}) };
  // if (tokenJWT) headers.Authorization = `Bearer ${tokenJWT}`; // (eliminado)

  const respuesta = await fetch(`${URL_PRODUCTOS}${sufijo}`, { ...opciones, headers });
  asegurarOk(respuesta);
  return respuesta.json();
}

//  Autenticación 
// async function autenticacion(credenciales) { /* (eliminado) */ }

// ===== Fetch API =====
async function obtenerTodos() {
  return llamarApi('/');
}

async function obtenerLimitados(limite = 5) {
  return llamarApi(`?limit=${encodeURIComponent(limite)}`);
}

async function crearProducto(nuevoProducto) {
  return llamarApi('/', { method: 'POST', body: JSON.stringify(nuevoProducto) });
}

async function obtenerPorId(idProducto) {
  return llamarApi(`/${encodeURIComponent(idProducto)}`);
}

async function eliminarPorId(idProducto) {
  return llamarApi(`/${encodeURIComponent(idProducto)}`, { method: 'DELETE' });
}

async function actualizarPorId(idProducto, cambios) {
  return llamarApi(`/${encodeURIComponent(idProducto)}`, {
    method: 'PUT',
    body: JSON.stringify(cambios)
  });
}

// ===== FileSystem =====
async function persistirLista(lista) {
  await escribirJSON(ARCHIVO_JSON, lista);
}

async function agregarAlArchivo(productoNuevo) {
  const lista = await leerJSON(ARCHIVO_JSON);
  lista.push(productoNuevo);
  await escribirJSON(ARCHIVO_JSON, lista);
  return lista.length;
}

async function eliminarMayoresA(precioTope) {
  const lista = await leerJSON(ARCHIVO_JSON);
  const antes = lista.length;
  const depurada = lista.filter(p => Number(p.price) <= Number(precioTope));
  await escribirJSON(ARCHIVO_JSON, depurada);
  return { eliminados: antes - depurada.length, restantes: depurada.length };
}

// ===== Demostración completa =====
(async function main() {
  try {
    // console.log('0) Autenticación'); // (eliminado)
    // await autenticacion({ username: 'johnd', password: 'm38rmF$' }); // (eliminado)

    // 1) GET – todos
    console.log('\n1) GET – todos');
    const todos = await obtenerTodos();
    console.log('   → cantidad:', todos.length);

    // 2) GET – limitados (5) y persistir en archivo
    console.log('\n2) GET – limitados (5) y persistir en archivo');
    const pocos = await obtenerLimitados(5);
    console.log('   → ids:', pocos.map(p => p.id).join(', '));
    await persistirLista(pocos);
    console.log('   → guardado en', ARCHIVO_JSON);

    // 3) POST – crear producto
    console.log('\n3) POST – crear producto');
    const creado = await crearProducto({
      title: 'Silla Ergonómica XR-12',
      price: 152.0, // número (la API espera número)
      description: 'Respaldo alto, soporte lumbar ajustable.',
      image: 'https://sillaergonomica.com/silla.jpg',
      category: 'Muebles'
    });
    console.log('   → respuesta POST:', creado);

    // 4) GET – por id
    const idProducto = 5;  // cambiar este valor
    console.log(`\n4) GET – por id (id=${idProducto})`);
    const producto = await obtenerPorId(idProducto);
    console.log(`   → ${producto.id} | ${producto.title} | $${producto.price}`);

    // 5) DELETE – por id
    const idAEliminar = 3; // ← cambiá este valor
    console.log(`\n5) DELETE – por id (id=${idAEliminar})`);
    const borrado = await eliminarPorId(idAEliminar);
    console.log('   → respuesta DELETE:', borrado);

    // 6) PUT – actualizar por id (id=6)
    console.log('\n6) PUT – actualizar por id (id=6)');
    const actualizado = await actualizarPorId(6, {
      title: 'Producto 6 – Actualizado',
      price: 200.0 // número
    });
    console.log('   → respuesta PUT:', actualizado);

    // 7) GET – nuevamente todos
    console.log('\nFS-1) Agregar al archivo local');
    const totalArchivo = await agregarAlArchivo({
      id: 'local-001',
      title: 'Cámara Web HD 1080p',
      price: 79.5,
      description: 'Micrófono integrado, autoenfoque.',
      category: 'electronics'
    });
    console.log('   → total en archivo:', totalArchivo);

    // 8) Eliminar del archivo productos con precio > 120
    console.log('\nFS-2) Eliminar del archivo productos con precio > $120.000');
    const resumen = await eliminarMayoresA(120);
    console.log(`   → eliminados: ${resumen.eliminados} | restantes: ${resumen.restantes}`);

    // 9) Leer archivo y mostrar contenido
    console.log('\n✔ TP2 completado. Revisá inventario.json y la consola.');
  } catch (e) {
    console.error('\n❌ Error general:', e.message);
  }
})();
