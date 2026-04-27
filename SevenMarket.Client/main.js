const API_URL = "http://localhost:5140/api/productos";
let productos = [];
let carrito = [];

// 1. Cargar productos desde la API
async function cargarProductos() {
    try {
        const res = await fetch(API_URL);
        productos = await res.json();
        renderizarProductos(productos);
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

// 2. Dibujar productos en pantalla
function renderizarProductos(lista) {
    const contenedor = document.getElementById('lista-productos');
    contenedor.innerHTML = '';

    lista.forEach(p => {
        const card = document.createElement('div');
        card.className = "bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer border border-transparent hover:border-blue-400 transition-all";
        card.innerHTML = `
            <h3 class="font-bold text-gray-800">${p.nombre}</h3>
            <p class="text-blue-600 font-black text-lg">$${p.precio.toLocaleString('es-AR')}</p>
        `;
        card.onclick = () => agregarAlCarrito(p);
        contenedor.appendChild(card);
    });
}

// 3. Manejo del Carrito
function agregarAlCarrito(producto) {
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarInterfaz();
}

function actualizarInterfaz() {
    const contenedorCarrito = document.getElementById('carrito');
    const totalLabel = document.getElementById('total-venta');
    contenedorCarrito.innerHTML = '';
    
    let total = 0;
    carrito.forEach((item, index) => {
        total += item.precio * item.cantidad;
        const div = document.createElement('div');
        div.className = "flex justify-between items-center bg-gray-50 p-2 rounded border-l-4 border-blue-500 shadow-sm";
        div.innerHTML = `
            <div class="flex-1">
                <p class="font-bold text-sm">${item.nombre}</p>
                <p class="text-xs text-gray-500">${item.cantidad} x $${item.precio}</p>
            </div>
            <div class="flex items-center gap-2">
                <p class="font-bold mr-2">$${(item.precio * item.cantidad).toFixed(2)}</p>
                <button onclick="restarDelCarrito(${index})" class="bg-red-100 text-red-600 px-2 py-1 rounded-md hover:bg-red-200 font-bold">-</button>
            </div>
        `;
        contenedorCarrito.appendChild(div);
    });

    totalLabel.innerText = `$${total.toLocaleString('es-AR')}`;
}

// Nueva función para restar o eliminar
window.restarDelCarrito = (index) => {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
    } else {
        carrito.splice(index, 1);
    }
    actualizarInterfaz();
};

window.Vaciar = () => {
    if (!confirm("¿Desea vaciar el ticket?")) return;
    carrito = [];
    actualizarInterfaz();
}


// 4. Buscador
document.getElementById('buscador').oninput = (e) => {
    const termino = e.target.value.toLowerCase();
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(termino));
    renderizarProductos(filtrados);
};

// Iniciar aplicación
cargarProductos();

let medioPagoSeleccionado = "Efectivo"; // Por defecto

// Seleccionar botones
const botonesPago = document.querySelectorAll('.metodo-pago');

botonesPago.forEach(btn => {
    btn.onclick = () => {
        // Quitar estilo activo de todos
        botonesPago.forEach(b => b.classList.remove('bg-blue-600', 'text-white', 'border-blue-600'));
        // Agregar estilo al seleccionado
        btn.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
        medioPagoSeleccionado = btn.getAttribute('data-tipo');
    };
});

document.getElementById('btn-cobrar').onclick = async () => {
    if (carrito.length === 0) return alert("El carrito está vacío");

    const venta = {
        total: carrito.reduce((sum, i) => sum + (i.precio * i.cantidad), 0),
        metodoPago: medioPagoSeleccionado,
        ventaDetalles: carrito.map(i => ({
            idProducto: i.id,
            cantidad: i.cantidad,
            precioUnitarioMomento: i.precio
        }))
    };

    try {
        const res = await fetch("http://localhost:5140/api/ventas", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(venta)
        });

        if (res.ok) {
            alert("¡Venta registrada con éxito!");
            carrito = []; // Limpiar carrito
            actualizarInterfaz();
        } else {
            const err = await res.json();
            alert("Error: " + err.detalle);
        }
    } catch (error) {
        alert("Error de conexión con el servidor");
    }
};

// --- CONFIGURACIÓN Y NAVEGACIÓN ---
const API_BASE = "http://localhost:5140/api";

window.cerrarAdmin = () => {
    document.getElementById('seccion-admin').classList.add('hidden');
    limpiarFormularioAdmin();
}

document.getElementById('btn-ver-admin').onclick = () => {
    document.getElementById('seccion-admin').classList.remove('hidden');
    actualizarListasAdmin();
};

// --- LÓGICA DE PRODUCTOS (ABM) ---

async function actualizarListasAdmin() {
    try {
        // 1. Cargar Categorías
        const resCat = await fetch(`${API_BASE}/categorias`);
        const categorias = await resCat.json();
        
        // Llenar Select del Formulario
        const select = document.getElementById('adm-p-categoria');
        select.innerHTML = categorias.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
        
        // Llenar Lista de Gestión de Categorías
        const listaCat = document.getElementById('adm-lista-categorias');
        listaCat.innerHTML = categorias.map(c => `
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                <span class="font-medium text-gray-700">${c.nombre}</span>
                <button onclick="eliminarCategoria(${c.id})" class="text-red-400 hover:text-red-600 font-bold">✕</button>
            </div>
        `).join('');

        // 2. Cargar Productos
        const resProd = await fetch(`${API_BASE}/productos`);
        const productos = await resProd.json();
        const tablaProd = document.getElementById('adm-tabla-productos');
        
        tablaProd.innerHTML = productos.map(p => `
            <tr class="hover:bg-gray-50 transition">
                <td class="p-4 font-bold text-gray-700">${p.nombre}</td>
                <td class="p-4 text-blue-600 font-black">$${p.precio.toLocaleString('es-AR')}</td>
                <td class="p-4">
                    <div class="flex justify-center gap-2">
                        <button onclick="prepararEdicionAdmin(${p.id}, '${p.nombre}', ${p.precio}, ${p.idCategoria})" 
                            class="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition">
                            EDITAR
                        </button>
                        <button onclick="eliminarProductoAdmin(${p.id})" 
                            class="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition">
                            BORRAR
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error("Error actualizando listas:", error);
    }
}

window.prepararEdicionAdmin = (id, nombre, precio, idCat) => {
    // Llenado de campos con prefijo adm-
    document.getElementById('adm-p-id').value = id;
    document.getElementById('adm-p-nombre').value = nombre;
    document.getElementById('adm-p-precio').value = precio;
    document.getElementById('adm-p-categoria').value = idCat;

    // Cambios Visuales
    document.getElementById('adm-titulo-form').innerText = "Editando Producto";
    document.getElementById('adm-indicador').classList.replace('bg-green-500', 'bg-orange-500');
    
    const btn = document.getElementById('adm-btn-guardar');
    btn.innerText = "CONFIRMAR CAMBIOS";
    btn.classList.replace('bg-green-600', 'bg-orange-600');
    
    document.getElementById('adm-btn-cancelar').classList.remove('hidden');
    document.getElementById('seccion-admin').scrollTo({ top: 0, behavior: 'smooth' });
};

window.limpiarFormularioAdmin = () => {
    document.getElementById('adm-p-id').value = "";
    document.getElementById('adm-p-nombre').value = "";
    document.getElementById('adm-p-precio').value = "";
    
    document.getElementById('adm-titulo-form').innerText = "Nuevo Producto";
    document.getElementById('adm-indicador').classList.replace('bg-orange-500', 'bg-green-500');
    
    const btn = document.getElementById('adm-btn-guardar');
    btn.innerText = "GUARDAR PRODUCTO";
    btn.classList.replace('bg-orange-600', 'bg-green-600');
    
    document.getElementById('adm-btn-cancelar').classList.add('hidden');
};

window.ejecutarGuardarProducto = async () => {
    const id = document.getElementById('adm-p-id').value;
    const producto = {
        nombre: document.getElementById('adm-p-nombre').value,
        precio: parseFloat(document.getElementById('adm-p-precio').value),
        idCategoria: parseInt(document.getElementById('adm-p-categoria').value)
    };

    if (!producto.nombre || isNaN(producto.precio)) return alert("Completa los datos correctamente");

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/productos/${id}` : `${API_BASE}/productos`;
    if (id) producto.id = parseInt(id);

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });

        if (res.ok) {
            limpiarFormularioAdmin();
            actualizarListasAdmin();
            if (typeof cargarProductos === 'function') cargarProductos(); // Refresca POS
        }
    } catch (error) {
        alert("Error al guardar el producto");
    }
};

window.eliminarProductoAdmin = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`${API_BASE}/productos/${id}`, { method: 'DELETE' });
    actualizarListasAdmin();
    if (typeof cargarProductos === 'function') cargarProductos();
};

window.crearCategoria = async () => {
    const nombre = document.getElementById('adm-c-nombre').value;
    if (!nombre) return;
    await fetch(`${API_BASE}/categorias`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nombre })
    });
    document.getElementById('adm-c-nombre').value = "";
    actualizarListasAdmin();
};

window.eliminarCategoria = async (id) => {
    if (!confirm("¿Eliminar categoría? (No debe tener productos)")) return;
    const res = await fetch(`${API_BASE}/categorias/${id}`, { method: 'DELETE' });
    if (!res.ok) alert("No se puede eliminar: tiene productos asociados");
    actualizarListasAdmin();
};

// --- LÓGICA DE INFORMES ---

window.cargarHistorial = async () => {
    try {
        const res = await fetch(`${API_BASE}/ventas/historial?n=10`);
        const ventas = await res.json();
        const contenedor = document.getElementById('adm-lista-historial');
        
        contenedor.innerHTML = ventas.map(v => `
            <div class="py-2 flex justify-between items-center">
                <div>
                    <p class="font-bold">#${v.id} - ${new Date(v.fechaHora).toLocaleTimeString()}</p>
                    <p class="text-xs text-gray-400">${v.metodoPago}</p>
                </div>
                <span class="font-black text-gray-700">$${v.total.toLocaleString('es-AR')}</span>
            </div>
        `).join('');
    } catch (e) { console.error("Error historial:", e); }
};

window.generarCierreCaja = async () => {
    try {
        const res = await fetch(`${API_BASE}/ventas/cierre-diario`);
        const d = await res.json();

        // Actualizar UI
        document.getElementById('cierre-efectivo').innerText = `$${d.totalEfectivo.toLocaleString('es-AR')}`;
        document.getElementById('cierre-mp').innerText = `$${d.totalMercadoPago.toLocaleString('es-AR')}`;
        document.getElementById('cierre-total').innerText = `$${d.totalGeneral.toLocaleString('es-AR')}`;

        alert(`Cierre realizado:\nTotal Ventas: ${d.cantidadVentas}\nRecaudado: $${d.totalGeneral}`);
    } catch (e) { 
        alert("Error al obtener el cierre diario");
    }
};

// Modificamos el botón de ver admin para que también cargue esto
const originalVerAdmin = document.getElementById('btn-ver-admin').onclick;
document.getElementById('btn-ver-admin').onclick = () => {
    originalVerAdmin();
    cargarHistorial();
    generarCierreCaja(); // Carga previa de los números de hoy
};

// Al inicio de main.js
window.onload = () => {
    // Verificar si hay sesión activa (solo vive mientras la pestaña está abierta)
    if (sessionStorage.getItem('logueado') !== 'true') {
        document.getElementById('pantalla-login').classList.remove('hidden');
    } else {
        document.getElementById('pantalla-login').classList.add('hidden');
        cargarProductos(); // Solo carga si está logueado
    }
};

window.autenticar = async () => {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    const errorMsg = document.getElementById('login-error');

    try {
        // Consultamos a un nuevo endpoint que crearemos
        const res = await fetch(`${API_BASE}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, passwordHash: pass })
        });

        if (res.ok) {
            sessionStorage.setItem('logueado', 'true');
            document.getElementById('pantalla-login').classList.add('hidden');
            cargarProductos();
        } else {
            errorMsg.classList.remove('hidden');
        }
    } catch (e) {
        alert("Error de conexión con el servidor");
    }
};

window.cerrarSesion = () => {
    sessionStorage.removeItem('logueado');
    location.reload(); // Esto recarga y vuelve a mostrar el login
};