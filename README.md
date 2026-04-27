# 🛒 SevenMarket - Retail Intelligence 7

SevenMarket es un sistema de Punto de Venta (POS) y Gestión de Inventario diseñado específicamente para comercios minoristas. Permite realizar ventas de forma ágil, gestionar productos y categorías, y obtener informes de cierre de caja diario en tiempo real.

## 🚀 Tecnologías Utilizadas

### Backend
* **Lenguaje:** C# (.NET 8)
* **Framework:** ASP.NET Core Web API
* **ORM:** Entity Framework Core
* **Base de Datos:** PostgreSQL (Alojada en Neon.tech)
* **Seguridad:** Autenticación por sesión y persistencia en DB.

### Frontend
* **Framework:** Vite + Vanilla JavaScript
* **Estilos:** Tailwind CSS (v4)
* **Iconografía:** Heroicons / Lucide
* **Tipografía:** Poppins (Google Fonts)

## ✨ Características Principales

* **Punto de Venta (POS):** Interfaz rápida para búsqueda de productos, carrito de compras dinámico y selección de medios de pago (Efectivo/Mercado Pago).
* **Gestión de Inventario (ABM):** Panel administrativo completo para Crear, Leer, Actualizar y Eliminar Productos y Categorías.
* **Informes de Gestión:** Historial de las últimas ventas y módulo de Cierre de Caja con desglose de recaudación diaria.
* **Seguridad:** Pantalla de acceso restringido con validación de credenciales y manejo de sesión volátil.
* **Diseño Moderno:** Interfaz responsiva, delicada y profesional con modo "App" para escritorio.

## 🛠️ Instalación y Configuración

### Prerrequisitos
* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
* [Node.js](https://nodejs.org/)
* Instancia de PostgreSQL (Local o Neon.tech)

### Configuración del Backend
1. Navegar a la carpeta del servidor:
   ```bash
   cd SevenMarket.API
