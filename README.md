# SisInventario — Sistema Integral de Control y Gestión de Inventario TI

Sistema completo de control y gestión de inventario informático, periféricos, consumibles y repuestos. Desarrollado con Clean Architecture en **Go (Golang)** para el backend y **React + TypeScript + Tailwind CSS** para el frontend.

---

## 🛠️ Stack Tecnológico

### Backend
- **Lenguaje**: Go (Golang) 1.21+
- **Framework HTTP**: Gin Gonic (`github.com/gin-gonic/gin`)
- **ORM / BD**: GORM (`gorm.io/gorm`) con driver PostgreSQL (`gorm.io/driver/postgres`)
- **Seguridad**: JWT (`github.com/golang-jwt/jwt/v5`) y hash bcrypt (`golang.org/x/crypto/bcrypt`)
- **UUID**: Google UUID (`github.com/google/uuid`)

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Estilos**: Tailwind CSS 3.4
- **Iconografía**: Lucide React
- **Routing**: React Router DOM v6
- **Cliente HTTP**: Axios con interceptor Bearer JWT
- **Herramientas**:
  - Códigos QR: `qrcode.react` (generación e impresión de etiquetas)
  - Escáner de Cámara: `html5-qrcode`
  - Exportación de Reportes: `xlsx` (Excel) y `jspdf` + `jspdf-autotable` (PDF)

---

## 🗄️ Modelo de Datos (16 Entidades)

1. **`roles`**: Administrador, Encargado de almacén, Técnico, Auditor.
2. **`usuarios`**: Cuentas con UUID, hash de contraseña y asignación de rol.
3. **`almacenes`**: Sedes y centros de almacenamiento.
4. **`usuario_almacen`**: Relación N:M de almacenes autorizados para cada usuario.
5. **`categorias`**: Categorías jerárquicas (Hardware, Periféricos, Redes, Insumos).
6. **`marcas`**: Fabricantes (Dell, HP, Lenovo, Cisco, Logitech, etc.).
7. **`modelos`**: Modelos asociados a marca y categoría con especificaciones JSON.
8. **`estados_equipo`**: Disponible, Asignado, Mantenimiento, Baja, Perdido.
9. **`proveedores`**: Directorio de proveedores de compra y talleres de servicio.
10. **`activos`**: Equipos serializados con código único, placa, valor y garantía.
11. **`items`**: Insumos y consumibles fungibles controlados por cantidad.
12. **`stock`**: Conteo y cantidad física de insumos por almacén con alerta de stock mínimo.
13. **`movimientos`**: Bitácora inmutable (entradas, salidas, transferencias, ajustes, asignaciones, devoluciones).
14. **`asignaciones`**: Historial y responsivas de equipos entregados a colaboradores.
15. **`mantenimientos`**: Control de tickets preventivos/correctivos con costos y talleres.
16. **`auditoria`**: Trazabilidad completa con visor de diffs JSON (Antes vs Después).

---

## ⚡ Transacciones ACID Obligatorias

Todas las operaciones críticas se ejecutan mediante transacciones atómicas seguras:
- **`TransferirActivo`**: Modifica la ubicación del activo y registra automáticamente el movimiento de tipo `transferencia`.
- **`AsignarEquipo`**: Pasa el estado del activo a `Asignado`, asocia el colaborador y registra el movimiento de tipo `asignacion`.
- **`DevolverEquipo`**: Cierra la asignación activa, restaura el estado a `Disponible` y genera el movimiento de `devolucion`.
- **`AjustarStock`**: Ajusta el conteo físico exacto de un insumo y registra el movimiento de `ajuste`.
- **`RegistrarEntradaInventario`**: Incrementa el stock cuantitativo y genera el movimiento de `entrada`.

---

## 🔑 Credenciales Iniciales por Defecto

Al iniciar el backend por primera vez, se ejecutan las migraciones y semillas automáticas:

| Rol | Correo Electrónico | Contraseña |
|---|---|---|
| **Administrador** | `admin@sisinventario.com` | `Admin123*` |

---

## 🚀 Guía de Ejecución

### 1. Iniciar el Backend (Go)

```bash
cd backend

# Iniciar servidor
go run cmd/api/main.go
# o ejecutar el binario compilado:
./server.exe
```

El servidor estará escuchando en `http://localhost:8080`.  
Verifica el estado en: `http://localhost:8080/health`.

### 2. Iniciar el Frontend (React + Vite)

```bash
cd frontend

# Iniciar entorno de desarrollo
npm run dev

# O compilar para producción
npm run build
```

La aplicación web estará disponible en `http://localhost:5173`.
