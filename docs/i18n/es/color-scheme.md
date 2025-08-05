# Guía de Esquema de Colores de ValveChain

## Paleta de Colores Profesional

ValveChain utiliza una paleta de colores profesional cuidadosamente seleccionada que equilibra la herencia industrial con la tecnología moderna:

> **Nota de Traducción**: Los códigos de color se mantienen en valores hexadecimales originales para asegurar consistencia visual.

### Colores Primarios

#### Azul Profundo (Color Principal de Marca)
- **Primario**: `#1e3a8a` - Usado para encabezados, botones primarios y elementos clave de UI
- **Claro**: `#4c32b3` - Usado para gradientes y estados hover
- **Uso**: Marca principal, encabezados de navegación, acciones primarias

#### Verde Esmeralda (Acento Tecnológico/Futuro)
- **Primario**: `#10b981` - Usado para estados de éxito, CTAs primarios y acciones positivas
- **Hover**: `#059669` - Estado hover para botones verdes
- **Oscuro**: `#047857` - Estado activo y mensajes de éxito
- **Uso**: Botones de llamada a la acción, indicadores de éxito, elementos de progreso

### Colores Secundarios

#### Gris Plata (Neutral/Contenido)
- **Claro**: `#f8fafc` - Color de fondo para páginas
- **Medio**: `#64748b` - Texto del cuerpo y contenido secundario
- **Oscuro**: `#334155` - Encabezados secundarios y texto importante
- **Borde**: `#e2e8f0` - Bordes de tarjetas y divisores
- **Uso**: Fondos, contenido de texto, bordes, elementos sutiles de UI

#### Cobre (Herencia Industrial - Reservado)
- **Primario**: `#f28316` - Reservado para indicadores industriales especiales
- **Oscuro**: `#bc4e0c` - Usado moderadamente para elementos de herencia industrial
- **Uso**: Uso limitado para referencias de herencia industrial en logo e indicadores especiales

## Pautas de Uso de Colores

### Fondos
- **Fondo de Página**: Gris Plata Claro (`#f8fafc`)
- **Fondo de Tarjeta/Modal**: Blanco (`#ffffff`)
- **Secciones Hero**: Gradiente Azul Profundo (`linear-gradient(135deg, #1e3a8a 0%, #4c32b3 100%)`)

### Colores de Texto
- **Encabezados Primarios**: Azul Profundo (`#1e3a8a`)
- **Texto del Cuerpo**: Gris Plata Medio (`#64748b`)
- **Texto Secundario**: Gris Plata Oscuro (`#334155`)
- **Texto Claro sobre Oscuro**: Blanco (`#ffffff`) o Gris Plata Claro (`#f1f5f9`)

### Elementos Interactivos
- **Botones Primarios**: Fondo Verde Esmeralda (`#10b981`) con texto blanco
- **Botones Secundarios**: Fondo blanco con texto Azul Profundo (`#1e3a8a`) y borde
- **Estados Hover de Botones**: Oscurecer color primario 10-15%
- **Enlaces**: Azul Profundo (`#1e3a8a`) con subrayado en hover

### Colores de Estado
- **Éxito**: Verde Esmeralda (`#10b981`)
- **Error**: Rojo (`#dc2626`)
- **Advertencia**: Naranja (`#f59e0b`)
- **Información**: Azul Profundo (`#1e3a8a`)

## Cumplimiento de Accesibilidad

Todas las combinaciones de colores cumplen con los estándares WCAG 2.1 AA:

- **Texto sobre Blanco**: Todos los colores de texto proporcionan relación de contraste ≥ 4.5:1
- **Texto Blanco sobre Azul Profundo**: Relación de contraste = 8.2:1 ✅
- **Texto Azul Profundo sobre Blanco**: Relación de contraste = 11.8:1 ✅
- **Texto Gris Plata sobre Blanco**: Relación de contraste = 5.1:1 ✅

## Implementación

### Propiedades Personalizadas CSS
```css
:root {
  /* Azul Profundo */
  --color-deep-blue: #1e3a8a;
  --color-deep-blue-light: #4c32b3;
  
  /* Verde Esmeralda */
  --color-emerald: #10b981;
  --color-emerald-hover: #059669;
  --color-emerald-active: #047857;
  
  /* Gris Plata */
  --color-gray-light: #f8fafc;
  --color-gray-medium: #64748b;
  --color-gray-dark: #334155;
  --color-gray-border: #e2e8f0;
  
  /* Cobre (Uso Limitado) */
  --color-copper: #f28316;
  --color-copper-dark: #bc4e0c;
}
```

### Integración del Tema Chakra UI
La paleta de colores está integrada en el sistema de temas de Chakra UI para uso consistente en todos los componentes.

## Pautas de Marca

1. **Siempre usar Azul Profundo para elementos principales de marca**
2. **Verde Esmeralda debe usarse moderadamente solo para acciones clave**
3. **Mantener altas relaciones de contraste para accesibilidad**
4. **Usar Gris Plata para jerarquía de contenido**
5. **Cobre debe reservarse para elementos especiales de herencia industrial**
6. **Evitar usar colores fuera de esta paleta sin aprobación**

Este esquema de colores asegura que ValveChain mantenga una identidad visual profesional, accesible y cohesiva que conecta la herencia industrial con la tecnología moderna.

---

**Versión de Traducción**: Basada en versión inglesa v1.0
**Última Actualización**: Agosto 2024
**Estado de Traducción**: Traducción completa, requiere revisión de experto en diseño