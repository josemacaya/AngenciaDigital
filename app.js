let auth0 = null;
let carrito = [];
let total = 0;

// CONFIGURACIÓN DE TU TENANT
const DOMINIO = "dev-igrych82l3265zi.us.auth0.com"; 
const CLIENTE_ID = "q4GVfiwbKnIcxBnk98CxZHbYLCmrQOHM";

async function inicializar() {
    if (typeof createAuth0Client === 'undefined') {
        setTimeout(inicializar, 1000);
        return;
    }
    
    try {
        auth0 = await createAuth0Client({
            domain: DOMINIO,
            client_id: CLIENTE_ID,
            redirect_uri: window.location.origin + window.location.pathname
        });

        if (location.search.includes("code=")) {
            await auth0.handleRedirectCallback();
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const isAuth = await auth0.isAuthenticated();
        if (isAuth) {
            const user = await auth0.getUser();
            document.getElementById("welcome-msg").innerText = "¡Hola, " + user.name + "!";
            document.getElementById("btn-login").classList.add("hidden");
            document.getElementById("btn-logout").classList.remove("hidden");
        }
    } catch (e) {
        console.error("Fallo Auth0:", e);
    }
}

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    total += precio;
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const lista = document.getElementById("lista-items");
    lista.innerHTML = "";
    carrito.forEach(item => {
        const p = document.createElement("p");
        p.innerText = `1x ${item.nombre} - $${item.precio.toLocaleString('es-CL')}`;
        lista.appendChild(p);
    });
    document.getElementById("total-monto").innerText = total.toLocaleString('es-CL');
}

function mostrarCheckout() {
    if (carrito.length === 0) return alert("Agrega productos al carrito primero.");
    document.getElementById("vista-tienda").classList.add("hidden");
    document.getElementById("vista-checkout").classList.remove("hidden");
}

function login() { if(auth0) auth0.loginWithRedirect(); }
function logout() { auth0.logout({ returnTo: window.location.origin + window.location.pathname }); }

window.onload = () => {
    inicializar();
    
    document.getElementById("formulario-pago").onsubmit = (e) => {
        e.preventDefault(); // Detiene el envío real para simular
        
        const nombre = document.getElementById("nom").value;
        const direccion = document.getElementById("dir").value;
        const totalFinal = total.toLocaleString('es-CL');

        document.getElementById("vista-checkout").classList.add("hidden");
        document.getElementById("vista-confirmacion").classList.remove("hidden");

        // Generar resumen detallado para el informe
        let productosHTML = carrito.map(i => `<li>${i.nombre} ($${i.precio.toLocaleString('es-CL')})</li>`).join("");
        
        document.getElementById("resumen-final").innerHTML = `
            <h3>Detalles del Pedido:</h3>
            <p><strong>Cliente:</strong> ${nombre}</p>
            <p><strong>Despacho a:</strong> ${direccion}</p>
            <hr>
            <p><strong>Productos:</strong></p>
            <ul>${productosHTML}</ul>
            <p style="font-size: 1.2rem;"><strong>Total Pagado: $${totalFinal}</strong></p>
        `;
    };
};