
Con eso, si alguien entra a GitHub o si tú mandas el link, **ya se entiende qué es DataCleaner** y para quién es.

---

## 2. Aterrizar qué queremos que haga v1 (para sector público)

Aunque el código lo haya armado IA Studio, la gracia ahora es meterle tu criterio + RockCode:

Para DataCleaner v1 yo apuntaría a esto (para que lo uses como checklist):

- ✅ Subir CSV  
- ✅ Ver una tabla previa  
- ✅ Elegir **acciones de limpieza**:
  - [ ] Eliminar filas completamente vacías  
  - [ ] Eliminar duplicados (por fila completa o por columnas clave)  
  - [ ] Aplicar “trim” y minúsculas a columnas seleccionadas  
- ✅ Ver un mini resumen:
  - “Filas originales: X / Filas resultantes: Y”  
- ✅ Descargar CSV limpio  

Y muy importante para venderlo a servicios públicos:

> Todo el procesamiento en el navegador (sin backend),  
> así puedes decirles “sus datos no salen de su computador”.

Después podemos:

- revisar juntos `App.tsx` y los componentes,  
- y ajustar la UI para que sea **hiper clara y sin miedo** para funcionarias/os (botones grandes, español claro, etc.).

---

## 3. Próximo pasito que haría yo ahora

Mientras tú sigues con tus temas (banco, patente, vida), yo que tú haría esto hoy o mañana:

1. Abrir `README.md` del repo y pegar el texto que te dejé (ajustar lo que no te guste).  
2. Anotar en un TODO (issue o lista en el README) estas acciones de limpieza v1.  
3. Cuando te sientes a codear, ya no partes en blanco:  
   trabajas directo contra esa lista.

Cuando quieras, me dices:  
> “Spark, veamos el App.tsx y definamos bien la UI de DataCleaner v1”  

y armamos el flujo pantalla por pantalla, para que solo tengas que implementarlo, no inventarlo sobre la marcha.
