# VS Code + Ejercicios Progresivos con JUnit

## 1) Instalar extensiones en VS Code

- `Extension Pack for Java` (id: `vscjava.vscode-java-pack`)
- Opcional: `Test Explorer UI`

Archivo de recomendacion ya incluido: `.vscode/extensions.json`.

## 2) Como funciona el flujo en este proyecto

- Clase de ejercicios: `src/EjerciciosPracticos.java`
- Tests por tema:
  - `test/Ejercicio01ScopeTest.java`
  - `test/Ejercicio02StrategyTest.java`
  - `test/Ejercicio03FactoryTest.java`
- Ruta secuencial:
  - `test/RutaAprendizajeTest.java`

## 3) Tu forma de trabajo diaria

1. Abre el panel **Testing** en VS Code.
2. Ejecuta primero `Ejercicio01ScopeTest`.
3. Corrige `EjerciciosPracticos.java` hasta que pase en verde.
4. Repite con `Ejercicio02StrategyTest`.
5. Repite con `Ejercicio03FactoryTest`.
6. Ejecuta `RutaAprendizajeTest` para validar todo en orden.
   - Si no apruebas Paso 1, Paso 2 y 3 quedan en `Skipped`.

## 4) Ejecutar por terminal (opcional)

```bash
mvn test
```

## 5) Objetivo didactico

- Avanzar por niveles.
- Tener feedback inmediato.
- No pasar al siguiente tema hasta tener el anterior en verde.

## 6) Estado inicial esperado

- Al principio los tests fallan porque `src/EjerciciosPracticos.java` tiene metodos vacios.
- Tu trabajo es completar esos metodos para llevar los tests a verde.
