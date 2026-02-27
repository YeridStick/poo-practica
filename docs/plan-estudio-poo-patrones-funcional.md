# Plan de estudio: POO -> Patrones -> Funcional

## Fase 1: Fundamentos POO (semana 1 y 2)

Objetivo:
- Entender clases, objetos, encapsulacion y responsabilidades.

Archivos:
- `src/PooBasesEjercicios.java`
- `src/ScopeInstanciasPractica.java`
- `src/PooDiaADiaPractica.java`

Ejercicios:
1. Completar ruta obligatoria en playground: nivel 1 y nivel 2.
2. Explicar diferencia entre campo de instancia y `static`.
3. Modelar una tienda con `Producto`, `ItemCarrito`, `Carrito`.
4. Agregar validaciones en constructores y metodos.

## Fase 2: Abstraccion y polimorfismo (semana 3)

Objetivo:
- Cambiar comportamiento por contrato (interfaz) sin romper cliente.

Archivo:
- `src/AbstraccionPractica.java`

Ejercicios:
1. Agregar `NotificadorWhatsapp`.
2. Integrarlo en `NotificadorFactory`.
3. Manejar tipo no soportado con error claro.

## Fase 3: Patrones de diseno (semana 4 y 5)

Objetivo:
- Aplicar Strategy, Factory y Observer en casos simples.

Archivo:
- `src/PatronesDisenoPractica.java`

Ejercicios:
1. Strategy: agregar `PagoEfectivo`.
2. Factory: crear `MetodoPagoFactory.crear(tipo)`.
3. Observer: crear `ObservadorEmail` y `ObservadorLog`.

## Fase 4: Programacion funcional (semana 6)

Objetivo:
- Procesar colecciones de forma declarativa.

Archivo:
- `src/ProgramacionFuncionalPractica.java`

Ejercicios:
1. `filter`: filtrar valores mayores a 10.
2. `map`: convertir textos a mayusculas.
3. `reduce`: calcular suma total.
4. `groupingBy`: agrupar por categoria.

## Fase 5: Integracion final (semana 7 y 8)

Objetivo:
- Combinar POO + patrones + funcional en un mini proyecto.

Reto:
1. Modelar carrito con clases POO.
2. Aplicar descuento con Strategy.
3. Usar Factory para elegir estrategia por texto.
4. Emitir alertas de stock con Observer.
5. Generar reporte final con Streams.

## Uso recomendado

1. Abre la guia web local (`HttpEstudioServer`).
2. Completa primero la ruta obligatoria (POO base).
3. Practica cada fase con el playground embebido.
4. Marca el checklist y valida con mini quiz.
