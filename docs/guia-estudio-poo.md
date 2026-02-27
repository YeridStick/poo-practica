# Guia de estudio: Interfaces, clases abstractas, SOLID y patrones

## 1) Interfaces vs clases abstractas

- Interface:
  - Define contratos (que debe hacer una clase).
  - No guarda estado de instancia por defecto.
  - Una clase puede implementar varias interfaces.

- Clase abstracta:
  - Mezcla contrato + comportamiento base reutilizable.
  - Puede tener atributos, constructores y metodos concretos.
  - Una clase solo puede heredar de una clase abstracta.

- Implementacion concreta:
  - Clase final que cumple contrato y ejecuta logica real.

Ejemplo en este proyecto: `src/AbstraccionPractica.java`
- `Notificador` (interface)
- `NotificadorBase` (abstracta)
- `NotificadorEmail` y `NotificadorSms` (implementaciones)
- `ServicioAlerta` consume la interface, no una implementacion especifica.

## 2) Principios SOLID (version practica)

- S: Single Responsibility Principle
  - Una clase = una razon de cambio.
  - Ejemplo: separar `MapPractica` de `BuclesPractica`.

- O: Open/Closed Principle
  - Abierto para extender, cerrado para modificar.
  - Ejemplo: agregar `NotificadorPush` sin tocar `ServicioAlerta`.

- L: Liskov Substitution Principle
  - Si una clase hereda/implementa, debe poder reemplazar a su base sin romper comportamiento.
  - Ejemplo: `NotificadorEmail` y `NotificadorSms` deben respetar el contrato `enviar`.

- I: Interface Segregation Principle
  - Interfaces pequenas y especificas, no gigantes.
  - Ejemplo: mejor `Notificador` simple que una interface enorme con metodos no usados.

- D: Dependency Inversion Principle
  - Modulos de alto nivel dependen de abstracciones, no de detalles concretos.
  - Ejemplo: `ServicioAlerta` depende de `Notificador`.

## 3) Patrones de diseno para empezar

- Strategy
  - Cambias algoritmo en tiempo de ejecucion.
  - En tu ejemplo: `Notificador` es estrategia de envio.

- Factory Method (simple)
  - Centraliza la creacion de objetos.
  - Util para no instanciar con `new` por todos lados.

- Observer
  - Un sujeto notifica a varios observadores cuando cambia estado.
  - Muy usado en UI, eventos y sistemas reactivos.

- Adapter
  - Convierte una interfaz incompatible a otra que tu sistema espera.
  - Util cuando integras librerias externas.

## 4) Ejercicios recomendados (orden sugerido)

1. Crear `NotificadorPush` y usarlo en `ServicioAlerta`.
2. Crear interface `CalculadorDescuento` con implementaciones:
   - `DescuentoPorcentaje`
   - `DescuentoMontoFijo`
3. Aplicar Strategy: `Carrito` recibe un `CalculadorDescuento`.
4. Crear una fabrica `NotificadorFactory` que devuelva email/sms/push.
5. Dividir `MapPractica` en:
   - `MapConteoPractica`
   - `MapOrdenamientoPractica`
6. Reescribir un metodo de `MapPractica` con pruebas manuales en `main`.
7. Crear tu propio mini Observer:
   - `SensorTemperatura` (sujeto)
   - `Pantalla`, `Alarma` (observadores)

## 5) Checklist de aprendizaje

- Puedo explicar cuando usar interface vs abstracta.
- Puedo detectar una violacion de SRP.
- Puedo cambiar implementaciones sin tocar cliente (OCP + DIP).
- Puedo reconocer Strategy y Factory en codigo real.
- Puedo crear ejercicios propios con datos pequenos y validar salida.

## 6) Modulos nuevos para practicar

- `src/PooBasesEjercicios.java`
  - Bases de POO con ejercicios y pruebas simples.
- `src/PooDiaADiaPractica.java`
  - Caso simple de tienda: producto, item y carrito.
- `src/PatronesDisenoPractica.java`
  - Strategy (pagos) + Observer (alerta de stock).
- `src/ProgramacionFuncionalPractica.java`
  - Transicion a streams: filter/map/reduce/groupingBy.
- `docs/plan-estudio-poo-patrones-funcional.md`
  - Ruta completa por fases con ejercicios y reto integrador.
