# Sesion: levantar servicio HTTP y usar guia interactiva

## Objetivo
Crear un servidor HTTP simple en Java que renderice una pagina HTML interactiva para estudiar:
- POO (clases, encapsulacion, composicion)
- Patrones de diseno (Strategy, Factory, Observer)
- Programacion funcional (map/filter/reduce)

Archivo principal: `src/HttpEstudioServer.java`

## Paso a paso

1. Compilar proyecto:
```bash
javac src/*.java
```

2. Levantar servidor HTTP:
```bash
java -cp src HttpEstudioServer
```

3. Abrir en navegador:
```text
http://localhost:8080
```

4. Detener servidor:
- En terminal: `Ctrl + C`

## Que incluye la guia interactiva

- Seccion inicial:
  - Explica que el servidor esta activo y en que URL.
- Tabs por archivo:
  - `AbstraccionPractica.java`
  - `ScopeInstanciasPractica.java`
  - `PooDiaADiaPractica.java`
  - `PatronesDisenoPractica.java`
  - `ProgramacionFuncionalPractica.java`
  - `Main.java`
  - `HttpEstudioServer.java`
- Plan de estudio completo:
  - Ruta POO -> Patrones -> Funcional.
- Ruta obligatoria:
  - Nivel 1 y 2 de POO base antes de avanzar.
- Secciones practicas por tema:
  - Casos de negocio sencillos con ejercicios guiados.
- Checklist interactivo:
  - Guarda progreso en el navegador (`localStorage`).
- Mini quiz autocorregible:
  - Preguntas de POO, patrones y funcional.
- Bloque de comandos:
  - Comandos exactos para compilar y ejecutar.
- Playground Java embebido:
  - Editor de codigo en la web.
  - Boton para ejecutar sin salir de la guia.
  - Salida en pantalla usando endpoint local `/run-java`.
 - Verificacion de backend:
   - Boton en la web para consultar `GET /health`.

## Relacion con tus clases actuales

- `src/AbstraccionPractica.java`:
  - Tiene Strategy + Factory method simple.
- `src/ScopeInstanciasPractica.java`:
  - Tiene ejercicios de scope y static.
- `src/PooDiaADiaPractica.java`:
  - Tiene ejemplo de tienda y carrito.
- `src/PooBasesEjercicios.java`:
  - Tiene bases POO y pruebas simples.
- `src/PatronesDisenoPractica.java`:
  - Tiene Strategy de pago y Observer de stock.
- `src/ProgramacionFuncionalPractica.java`:
  - Tiene ejemplos con streams y ejercicios funcionales.
- `src/HttpEstudioServer.java`:
  - Expone una pagina unica (`/`) como guia interactiva.
  - Expone `/health` para validar estado del backend local.
  - Expone `/run-java` para compilar y ejecutar codigo de practica.

## Ejercicio sugerido para practicar mas

1. Crea un reto final que combine carrito + metodo de pago + reporte con streams.
2. Agrega nuevo snippet del editor: `tryc` para `try/catch`.
3. Agrega un endpoint `/temario` que devuelva el plan de estudio en JSON.
