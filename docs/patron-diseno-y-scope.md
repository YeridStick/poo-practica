# Patron de diseno + scope + instancias (guia practica)

## 1) Patron de diseno usado: Strategy

Archivo base: `src/AbstraccionPractica.java`

- `Notificador`:
  - Es la interfaz (contrato).
  - Define el metodo `enviar`.
- `NotificadorBase`:
  - Clase abstracta con validacion reutilizable.
  - Evita duplicar reglas entre implementaciones.
- `NotificadorEmail`, `NotificadorSms`, `NotificadorPush`:
  - Son estrategias concretas.
  - Cada una implementa el mismo contrato con comportamiento distinto.
- `ServicioAlerta`:
  - Cliente que usa el contrato `Notificador`.
  - No conoce detalles de email/sms/push.

Que aprender aqui:
- Polimorfismo.
- Inversion de dependencias (DIP).
- Open/Closed (agregas estrategias sin tocar cliente).

## 2) Patron complementario: Factory Method simple

Tambien en `src/AbstraccionPractica.java`:

- `NotificadorFactory.crear(tipo)` centraliza la creacion de objetos.
- Evita llenar el codigo de `new NotificadorX()` en varias clases.
- Facilita pruebas y cambios de implementacion.

## 3) Scope, instancias y static

Archivo base: `src/ScopeInstanciasPractica.java`

Conceptos:
- Scope local:
  - Variables definidas dentro de un metodo.
  - Solo existen dentro de ese metodo.
- Scope de bloque:
  - Variables dentro de `if`, `for`, `{ }`.
  - No existen fuera del bloque.
- Variables de instancia:
  - Campo normal (sin `static`).
  - Cada objeto tiene su propia copia.
- Variables de clase (`static`):
  - Compartidas por todos los objetos.
  - Ideal para contadores o configuracion global.

## 4) Ejercicios recomendados

1. Ejecuta `demoNotificaciones()` y agrega una nueva estrategia `NotificadorWhatsapp`.
2. Modifica `NotificadorFactory` para soportar `"whatsapp"`.
3. En `ScopeInstanciasPractica`, crea 3 objetos mas e imprime `getTotalInstancias()`.
4. En `ejercicioScopeBloques`, descomenta la linea de `categoria` y explica el error.
5. Crea un metodo que reciba un parametro `nombre` (igual que el campo) y usa `this.nombre` para evitar confusion de scope.
6. Declara un `final` local dentro de un metodo y prueba reasignarlo para ver el error de compilacion.
7. Crea una clase nueva con:
   - 1 campo de instancia
   - 1 campo static
   - 1 metodo de instancia
   - 1 metodo static
   y explica cuando usar cada uno.

## 5) Mini checklist para estudiar

- Entiendo por que `ServicioAlerta` depende de `Notificador` y no de `NotificadorEmail`.
- Puedo agregar una nueva estrategia sin romper codigo existente.
- Puedo explicar diferencia entre scope local y de bloque.
- Puedo explicar diferencia entre campo de instancia y campo `static`.
- Puedo detectar cuando debo usar `this`.
