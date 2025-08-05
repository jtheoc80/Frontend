# Aplicación Frontend de Valve Chain

Este proyecto es una aplicación frontend React para gestionar operaciones de cadena de suministro de válvulas a través de Órdenes de Compra (OC) basadas en blockchain. Proporciona herramientas integrales para crear, gestionar y rastrear órdenes de compra a través de diferentes etapas de la cadena de suministro de válvulas.

> **Nota de Traducción**: Este documento está traducido de la versión en inglés. Consulte la documentación original en inglés para cualquier aclaración.

## Características

### Contador de Tokens del Panel de Fabricante

El panel de fabricante ahora incluye un contador de tokens en tiempo real que muestra el número de tokens de por vida actualmente activos en la blockchain. El contador incluye:

- **Actualizaciones en Tiempo Real**: Se actualiza automáticamente cada 30 segundos para mostrar el conteo actual de tokens
- **Actualización Manual**: Haga clic en el botón de actualización (↻) para actualizar el conteo inmediatamente
- **Conteo de Tokens en Vivo**: Muestra el número total de tokens activos con separadores de miles (ej. "1,247")
- **Estado de Conexión**: Muestra indicador de "Modo Demo" cuando usa datos simulados
- **Estados de Carga**: Retroalimentación visual durante operaciones de actualización
- **Manejo de Errores**: Manejo elegante de problemas de conexión con funcionalidad de reintento
- **Diseño Responsivo**: Se adapta a diferentes tamaños de pantalla manteniendo la visibilidad

El contador se muestra prominentemente en la esquina superior derecha del panel de fabricante y se incrementa automáticamente cuando nuevas válvulas son tokenizadas a través de la interfaz.

## Scripts Disponibles

En el directorio del proyecto, puede ejecutar:

### `npm start`

Ejecuta la aplicación en modo de desarrollo.\
Abra [http://localhost:3000](http://localhost:3000) para verla en su navegador.

La página se recargará cuando haga cambios.\
También puede ver errores de lint en la consola.

### `npm test`

Lanza el ejecutor de pruebas en modo de observación interactivo.\
Incluye pruebas de componentes integrales y pruebas de instantáneas para componentes de flujo de trabajo de OC.

### `npm run build`

Construye la aplicación para producción en la carpeta `build`.\
Empaqueta correctamente React en modo de producción y optimiza la construcción para el mejor rendimiento.

La construcción está minificada y los nombres de archivo incluyen los hashes.\
¡Su aplicación está lista para ser desplegada!

## Flujo de Trabajo de Orden de Compra (OC)

La aplicación soporta un flujo de trabajo integral de cadena de suministro de válvulas de 3 etapas:

### Etapa 1: Distribución → Fabricante
- **Propósito**: Órdenes de inventario inicial de distribuidores a fabricantes
- **Componentes**: `CreatePOForm`, `POList`
- **Características Clave**:
  - Especificaciones de válvulas (diámetro, presión, temperatura, material)
  - Seguimiento de certificaciones de fabricante
  - Términos de envío y entrega
  - Términos de garantía y pago

### Etapa 2: Planta → Distribución
- **Propósito**: Requisición de válvulas de plantas a centros de distribución
- **Características Clave**:
  - Requisitos específicos de planta
  - Niveles de urgencia (bajo, medio, alto, crítico)
  - Seguimiento de códigos de proyecto y presupuesto
  - Detalles específicos de aplicación

### Etapa 3: Reparación → Planta
- **Propósito**: Facturación de servicios de reparación de servicios de reparación a plantas
- **Características Clave**:
  - Seguimiento de tipos de servicio (mantenimiento, reparación, revisión, prueba, calibración)
  - Horas de trabajo y tarifas
  - Seguimiento de uso de piezas
  - Detalles de factura con cálculos de impuestos

## Variables de Entorno

Cree un archivo `.env` en el directorio raíz con las siguientes variables:

```bash
# Configuración de Blockchain
PO_CONTRACT_ADDRESS=0x...  # Dirección del contrato inteligente para gestión de OC
ETHEREUM_RPC_URL=http://localhost:8545  # URL del nodo Ethereum
CHAIN_ID=1337  # ID de cadena de red

# Configuración de Aplicación
REACT_APP_API_BASE_URL=http://localhost:3001  # URL de API backend
REACT_APP_ENVIRONMENT=development  # Entorno (development, staging, production)

# Opcional: Configuración de Billetera
REACT_APP_WALLET_CONNECT_PROJECT_ID=your_project_id  # ID de proyecto WalletConnect
REACT_APP_INFURA_API_KEY=your_infura_key  # Clave API de Infura para producción

# Opcional: Monitoreo y Analíticas
REACT_APP_SENTRY_DSN=your_sentry_dsn  # Seguimiento de errores
REACT_APP_ANALYTICS_ID=your_analytics_id  # Seguimiento de analíticas
```

## Arquitectura

### Integración de Blockchain
- Contratos inteligentes para gestión de OC
- Procesamiento de transacciones basado en Ethereum
- Integración de billetera MetaMask
- IPFS para almacenamiento de documentos

## Desarrollo

### Prerrequisitos
- Node.js 16+
- npm o yarn
- Extensión de navegador MetaMask
- Nodo Ethereum local (opcional)

### Configuración
```bash
npm install
cp .env.example .env  # Configurar variables de entorno
npm start
```

### Contribución
1. Seguir patrones de código existentes
2. Agregar pruebas para nuevos componentes
3. Actualizar documentación
4. Asegurar conformidad con TypeScript

## Despliegue

### Construcción de Producción
```bash
npm run build
```

### Construcciones Específicas de Entorno
- **Desarrollo**: Pruebas locales con datos simulados
- **Staging**: Integración con testnet
- **Producción**: Despliegue en mainnet

## Consideraciones de Seguridad

- Todas las transacciones de blockchain requieren confirmación del usuario
- Las claves privadas nunca se almacenan en la aplicación
- Validación de entrada en todos los campos de formulario
- Comunicación API segura
- Actualizaciones regulares de dependencias

## Aprende Más

Puede aprender más sobre las tecnologías utilizadas:

- [Documentación de React](https://reactjs.org/)
- [Documentación de TypeScript](https://www.typescriptlang.org/)
- [Desarrollo de Ethereum](https://ethereum.org/developers/)
- [Documentación de Testing Library](https://testing-library.com/)

---

**Versión de Traducción**: Basada en versión inglesa v0.1.0
**Última Actualización**: Agosto 2024
**Estado de Traducción**: Traducción completa, requiere revisión de experto técnico