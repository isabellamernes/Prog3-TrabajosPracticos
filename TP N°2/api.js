async function obtenerProductos(limit = 0) {
    const url = `https://fakestoreapi.com/products?limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}