# Java POO Academy Dashboard

Una plataforma interactiva y moderna para el aprendizaje de Programación Orientada a Objetos (POO) en Java, diseñada para ofrecer una experiencia fluida tanto en escritorio como en dispositivos móviles.

---

## Características Principales

- **Dashboard Inteligente**: Visualización clara de tu ruta de aprendizaje y retos disponibles.
- **Playground Java en Vivo**: Escribe, compila y ejecuta código Java directamente en el navegador.
- **Personalización de Temas**: Elige entre 4 temas profesionales (Esmeralda, Noche Profunda, Azul Medianoche y Tierra).
- **Diseño Mobile-First**: Navegación adaptativa que se transforma en una barra inferior en dispositivos móviles.
- **Gestión de Repositorios**: Carga retos personalizados directamente desde GitHub y guárdalos en tu navegador.
- **Editor Pro**: Modo pantalla completa "pixel-perfect" con numeración de líneas alineada y snippets rápidos.

---

## Inicio Rápido

### Requisitos Previos

- **Java JDK 17** o superior.
- **Maven 3.6** o superior.

### Instalación y Compilación

1. **Clona el repositorio:**
   ```bash
   git clone <tu-url-del-repositorio>
   cd poo-practica
   ```

2. **Compila el proyecto con Maven:**
   ```bash
   mvn clean package -DskipTests
   ```

### Ejecutar el Servidor

Una vez compilado, puedes levantar el servidor local:

```bash
java -cp build/poo-practica-1.0-SNAPSHOT.jar HttpEstudioServer 8080
```

> [!TIP]
> Si el puerto 8080 está ocupado, el servidor intentará automáticamente el siguiente puerto disponible (8081, 8082, etc.).

Abre tu navegador en: `http://localhost:8080` (o el puerto indicado en la consola).

---

## Estructura del Proyecto

- `src/main/java`: Lógica del servidor HTTP y procesadores de código Java.
- `src/main/resources/static`: Frontend de la aplicación (HTML, CSS dinámico con temas, JS).
- `.gitignore`: Configuración para mantener el repositorio limpio de archivos de compilación y ajustes de IDE.
- `Dockerfile`: Configuración para desplegar la aplicación mediante contenedores.

---

## Desarrollo

Para aplicar cambios en el frontend (CSS/JS) o en el servidor:

1. Realiza tus modificaciones en `src/main/resources/static`.
2. Ejecuta `mvn clean package`.
3. Reinicia el comando de ejecución `java -cp...`.
4. Refresca tu navegador con `F5`.

---

## 📝 Licencia

Este proyecto es para fines educativos. ¡Disfruta practicando Java!
