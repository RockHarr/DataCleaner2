# DataCleaner — RockCode

MVP para unificar y limpiar planillas CSV del sector público chileno
(RUT, nombres, regiones, etc.) en un solo dataset utilizable.

Pensado para equipos de gestión, transparencia, planificación y
estadísticas que trabajan con datos provenientes de distintas fuentes
(Excel, sistemas heredados, oficinas regionales).

## Problema que resuelve

En muchos servicios públicos se trabaja con múltiples planillas
inconsistentes:

- Columnas con nombres distintos para la misma cosa
- Filas duplicadas
- Mayúsculas / minúsculas mezcladas
- Espacios en blanco, valores vacíos
- Datos difíciles de consolidar para reportes

DataCleaner ayuda a:

- Unificar estructuras simples de datos
- Limpiar filas y valores
- Preparar datasets que luego se pueden usar en BI, reportes o cargarse en otros sistemas

## Qué hace (v1)

- Carga de archivo CSV
- Vista previa de los datos
- Operaciones básicas de limpieza:
  - Eliminar filas vacías
  - Eliminar filas duplicadas
  - Normalizar texto (trim / minúsculas) en columnas seleccionadas
- Descarga de un CSV limpio

> Nota: el objetivo de este MVP es trabajar **100% en el navegador**,
> sin enviar datos a servidores externos, para ser más amigable con
> requisitos de seguridad de organismos públicos.

## Tecnologías

- React + TypeScript
- Vite
- (Opcional) Integración con modelos de IA para sugerencias de limpieza

## Cómo correrlo en local

1. Instalar dependencias:

   ```bash
   npm install
