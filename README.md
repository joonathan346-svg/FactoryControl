# FactoryControl — Fase 2

Maqueta responsiva construida con HTML, CSS, JavaScript y Bootstrap 5.3.8.

## Uso

Abra `index.html` en un navegador con conexión a internet. La conexión se utiliza únicamente para cargar Bootstrap y Bootstrap Icons desde CDN.

## Vistas incluidas

- Resumen general
- Inventario
- Producción
- Ventas
- Flujo de caja
- Reportes
- Clientes
- Empleados

Los datos son estáticos y representan el contenido que posteriormente podrá recuperarse mediante una API REST.

## Fase 3 — API RESTful

La vista **Tipo de cambio** consume dinámicamente la API pública Frankfurter v2.

- Endpoint utilizado: `https://api.frankfurter.dev/v2/rate/{base}/{quote}`
- Método: `GET`
- Autenticación: no requiere API key
- Datos utilizados: `date`, `base`, `quote` y `rate`
- JavaScript usa `fetch()`, `async/await`, validación y manejo de errores

Ejemplo: `https://api.frankfurter.dev/v2/rate/USD/MXN`
