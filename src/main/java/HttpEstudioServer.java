import java.io.IOException;
import java.io.OutputStream;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.net.BindException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class HttpEstudioServer {
    // Capturar el directorio del servidor al inicio para localizar dependencias
    private static final Path PROJECT_DIR = Path.of(".").toAbsolutePath().normalize();

    public static void main(String[] args) throws IOException {
        int puerto = 8080;
        if (args.length > 0) {
            try {
                puerto = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.out.println("Puerto invalido '" + args[0] + "'. Se usara 8080.");
            }
        }
        iniciarConFallback(puerto, 10);
    }

    public static void iniciarConFallback(int puertoBase, int maxIntentos) throws IOException {
        int ultimoPuertoIntentado = puertoBase;
        for (int i = 0; i < maxIntentos; i++) {
            int puerto = puertoBase + i;
            ultimoPuertoIntentado = puerto;
            try {
                iniciar(puerto);
                return;
            } catch (BindException e) {
                System.out.println("Puerto " + puerto + " ocupado. Intentando siguiente...");
            }
        }
        throw new IOException("No se pudo iniciar el servidor entre los puertos "
                + puertoBase + " y " + ultimoPuertoIntentado + ".");
    }

    public static void iniciar(int puerto) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(puerto), 0);
        server.createContext("/", new PaginaEstudioHandler());
        server.createContext("/entrevista", new EntrevistaHandler());
        server.createContext("/entrevista/mock", new EntrevistaMockHandler());
        server.createContext("/entrevista/webflux", new EntrevistaWebfluxHandler());
        server.createContext("/entrevista/webflux2", new EntrevistaWebflux2Handler());
        server.createContext("/entrevista/ia", new EntrevistaIaHandler());
        server.createContext("/entrevista/docs", new EntrevistaDocsHandler());
        server.createContext("/health", new HealthHandler());
        server.createContext("/run-java", new RunJavaHandler());
        server.createContext("/run-java-reactivo", new RunJavaReactivoHandler());
        server.createContext("/setup-reactivo", new SetupReactivoHandler());
        server.createContext("/repo/load", new RepoLoadHandler());
        server.createContext("/index.css", new StaticFileHandler("/static/index.css", "text/css; charset=UTF-8"));
        server.createContext("/index.js", new StaticFileHandler("/static/index.js", "application/javascript; charset=UTF-8"));
        server.createContext("/referencia.json", new StaticFileHandler("/static/referencia.json", "application/json; charset=UTF-8"));
        server.setExecutor(null);
        server.start();

        System.out.println("Servidor HTTP activo en http://localhost:" + puerto);
        System.out.println("Presiona Ctrl + C para detenerlo.");
    }

    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                byte[] cuerpo = "Metodo no permitido. Usa GET.".getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(405, cuerpo.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(cuerpo);
                }
                return;
            }
            String json = "{\"status\":\"ok\",\"service\":\"HttpEstudioServer\",\"language\":\"java\"}";
            byte[] respuesta = json.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, respuesta.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(respuesta);
            }
        }
    }

    static class RunJavaHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                byte[] cuerpo = "Metodo no permitido. Usa POST.".getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(405, cuerpo.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(cuerpo);
                }
                return;
            }

            String source = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            String resultado = ejecutarCodigoJava(source);
            byte[] respuesta = resultado.getBytes(StandardCharsets.UTF_8);

            exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=UTF-8");
            exchange.sendResponseHeaders(200, respuesta.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(respuesta);
            }
        }
    }

    static class RunJavaReactivoHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                byte[] cuerpo = "Metodo no permitido. Usa POST.".getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(405, cuerpo.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(cuerpo);
                }
                return;
            }

            String source = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            String resultado = ejecutarCodigoJavaReactivo(source);
            byte[] respuesta = resultado.getBytes(StandardCharsets.UTF_8);

            exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=UTF-8");
            exchange.sendResponseHeaders(200, respuesta.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(respuesta);
            }
        }
    }

    static class SetupReactivoHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                responder(exchange, 405, "text/plain; charset=UTF-8", "Metodo no permitido. Usa POST.");
                return;
            }
            String resultado = prepararEntornoReactivo();
            responder(exchange, 200, "text/plain; charset=UTF-8", resultado);
        }
    }

    static class RepoLoadHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                responder(exchange, 405, "text/plain; charset=UTF-8", "Metodo no permitido. Usa POST.");
                return;
            }
            String url = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8).trim();
            if (url.isEmpty()) {
                responder(exchange, 400, "text/plain; charset=UTF-8", "URL vacia.");
                return;
            }

            System.out.println("Sincronizando repo real: " + url);
            Path tempDir = null;
            try {
                tempDir = Files.createTempDirectory("git-repo-sync-");
                CommandResult clone = runCommand(tempDir, 30, "git", "clone", "--depth", "1", url, ".");
                
                if (clone.exitCode != 0) {
                    responder(exchange, 500, "text/plain; charset=UTF-8", "Error clonando repo: " + clone.output);
                    return;
                }

                // 1. Intentar cargar desde "retos.json" si existe
                Path retosJson = tempDir.resolve("retos.json");
                if (Files.exists(retosJson)) {
                    String content = Files.readString(retosJson, StandardCharsets.UTF_8).trim();
                    // Normalizar para que el frontend reciba "ejercicios" en lugar de "retos"
                    String normalized = content.replaceFirst("\"retos\"\\s*:", "\"ejercicios\":");
                    // Envolver en el objeto repo
                    String fullResponse = String.format("{\"repo\":\"%s\", %s", escapeJson(url), normalized.substring(1));
                    responder(exchange, 200, "application/json; charset=UTF-8", fullResponse);
                    return;
                }

                // 2. Fallback: Escanear archivos .java (comportamiento original)
                StringBuilder json = new StringBuilder("{\"repo\":\"" + url + "\", \"ejercicios\": [");
                boolean primero = true;
                
                try (var paths = Files.walk(tempDir)) {
                    var javaFiles = paths.filter(Files::isRegularFile)
                                         .filter(p -> p.toString().endsWith(".java"))
                                         .collect(Collectors.toList());
                    
                    for (Path file : javaFiles) {
                        String content = Files.readString(file, StandardCharsets.UTF_8);
                        String title = extractTitle(content, file.getFileName().toString());
                        String description = extractDescription(content);
                        
                        if (!primero) json.append(",");
                        json.append(String.format("{\"id\":\"%s\", \"titulo\":\"%s\", \"descripcion\":\"%s\", \"template\":%s}",
                            escapeJson(file.getFileName().toString()),
                            escapeJson(title),
                            escapeJson(description),
                            quoteJson(content)
                        ));
                        primero = false;
                    }
                }
                json.append("]}");
                
                responder(exchange, 200, "application/json; charset=UTF-8", json.toString());
            } catch (Exception e) {
                responder(exchange, 500, "text/plain; charset=UTF-8", "Error procesando repo: " + e.getMessage());
            } finally {
                if (tempDir != null) borrarRecursivo(tempDir);
            }
        }

        private String extractTitle(String content, String fallback) {
            // Intenta extraer titulo de un comentario /* TITULO: ... */
            var lines = content.lines().limit(10).collect(Collectors.toList());
            for (String line : lines) {
                if (line.contains("TITULO:") || line.contains("Objetivo:")) {
                    return line.substring(Math.max(line.indexOf("TITULO:"), line.indexOf("Objetivo:")) + 8).trim().replace("*/", "");
                }
            }
            return fallback;
        }

        private String extractDescription(String content) {
            // Intenta extraer descripcion de un bloque de comentario inicial
            if (content.contains("/*") && content.indexOf("*/") > content.indexOf("/*")) {
                return content.substring(content.indexOf("/*") + 2, content.indexOf("*/")).trim()
                    .replaceAll("\\r?\\n", " ")
                    .replaceAll("\\s+", " ");
            }
            return "Reto Java importado.";
        }

        private String escapeJson(String s) {
            return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
        }

        private String quoteJson(String s) {
            return "\"" + escapeJson(s) + "\"";
        }
    }

    private static String ejecutarCodigoJava(String source) {
        if (source == null || source.isBlank()) {
            return "Editor vacio. Escribe codigo Java.";
        }
        if (!source.contains("class Main")) {
            return "El codigo debe incluir 'class Main' para poder ejecutar 'java Main'.";
        }
        if (source.length() > 30_000) {
            return "Codigo demasiado largo (maximo 30000 caracteres).";
        }

        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("java-playground-");
            Path archivo = tempDir.resolve("Main.java");
            Files.writeString(archivo, source, StandardCharsets.UTF_8);

            CommandResult compilacion = runCommand(tempDir, 6, "javac", "Main.java");
            if (compilacion.timeout) {
                return "Timeout compilando (6s).\n" + compilacion.output;
            }
            if (compilacion.exitCode != 0) {
                return "Error de compilacion:\n" + compilacion.output;
            }

            CommandResult ejecucion = runCommand(tempDir, 6, "java", "Main");
            if (ejecucion.timeout) {
                return "Timeout ejecutando (6s). Revisa bucles infinitos.\n" + ejecucion.output;
            }
            if (ejecucion.exitCode != 0) {
                return "Error de ejecucion:\n" + ejecucion.output;
            }

            if (ejecucion.output.isBlank()) {
                return "Programa ejecutado. No hubo salida en consola.";
            }
            return "Salida:\n" + ejecucion.output;
        } catch (IOException e) {
            return "Error interno ejecutando Java: " + e.getMessage();
        } finally {
            if (tempDir != null) {
                borrarRecursivo(tempDir);
            }
        }
    }

    private static String ejecutarCodigoJavaReactivo(String source) {
        if (source == null || source.isBlank()) {
            return "Editor vacio. Escribe codigo Java reactivo.";
        }
        if (!source.contains("class Main")) {
            return "El codigo debe incluir 'class Main' para poder ejecutar 'java Main'.";
        }
        if (source.length() > 40_000) {
            return "Codigo demasiado largo (maximo 40000 caracteres).";
        }

        String reactorClasspath;
        try {
            reactorClasspath = construirClasspathReactor();
        } catch (IOException e) {
            return "No se pudo resolver classpath de Reactor: " + e.getMessage();
        }
        
        if (reactorClasspath == null || reactorClasspath.isBlank()) {
            System.out.println("[WebFlux] Reactor no encontrado. Iniciando descarga forzada...");
            
            // Forzar descarga de dependencias
            String setupResult = prepararEntornoReactivo();
            System.out.println("[WebFlux] Resultado del setup: " + setupResult);
            
            // Intentar resolver nuevamente después de descargar
            try {
                Thread.sleep(1000); // Dar tiempo para que se escriban los archivos
                reactorClasspath = construirClasspathReactor();
            } catch (IOException | InterruptedException e) {
                System.out.println("[WebFlux] Error al resolver classpath después del setup: " + e.getMessage());
                return "No se encontraron dependencias. Resultado del setup: " + setupResult + "\nError: " + e.getMessage();
            }
            
            // Si aun no se encuentra, error
            if (reactorClasspath == null || reactorClasspath.isBlank()) {
                return "No se pudo descargar Reactor. Intenta ejecutar manualmente en terminal:\n" +
                       "mvn dependency:copy-dependencies -DincludeArtifactIds=reactor-core,reactive-streams -DoutputDirectory=target/dependency\n" + 
                       "Luego recarga la página.";
            }
        }


        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("java-reactivo-playground-");
            Path archivo = tempDir.resolve("Main.java");
            Files.writeString(archivo, source, StandardCharsets.UTF_8);

            System.out.println("[WebFlux] Compilando desde: " + tempDir);
            System.out.println("[WebFlux] Classpath para javac: " + reactorClasspath);
            System.out.println("[WebFlux] Archivo Main.java: " + archivo);

            CommandResult compilacion = runCommand(tempDir, 10, "javac", "-cp", reactorClasspath, "Main.java");
            System.out.println("[WebFlux] Compilación - Exit code: " + compilacion.exitCode);
            if (compilacion.timeout) {
                return "Timeout compilando reactivo (10s).\n" + compilacion.output;
            }
            if (compilacion.exitCode != 0) {
                return "Error de compilacion reactiva:\n" + compilacion.output;
            }

            String runtimeClasspath = reactorClasspath + File.pathSeparator + ".";
            CommandResult ejecucion = runCommand(tempDir, 10, "java", "-cp", runtimeClasspath, "Main");
            if (ejecucion.timeout) {
                return "Timeout ejecutando reactivo (10s).\n" + ejecucion.output;
            }
            if (ejecucion.exitCode != 0) {
                return "Error de ejecucion reactiva:\n" + ejecucion.output;
            }
            if (ejecucion.output.isBlank()) {
                return "Programa reactivo ejecutado. No hubo salida en consola.";
            }
            return "Salida reactiva:\n" + ejecucion.output;
        } catch (IOException e) {
            return "Error interno ejecutando Java reactivo: " + e.getMessage();
        } finally {
            if (tempDir != null) {
                borrarRecursivo(tempDir);
            }
        }
    }

    private static String construirClasspathReactor() throws IOException {
        String fromTarget = construirClasspathDesdeTargetDependency();
        if (fromTarget != null) {
            return fromTarget;
        }

        Path repo = obtenerMavenRepo();

        Path reactorVersion = buscarUltimaCarpetaVersion(repo.resolve("io").resolve("projectreactor").resolve("reactor-core"));
        if (reactorVersion == null) {
            return null;
        }
        Path reactorJar = buscarJarPorPrefijo(reactorVersion, "reactor-core-");
        if (reactorJar == null) {
            return null;
        }

        Path rsVersion = buscarUltimaCarpetaVersion(repo.resolve("org").resolve("reactivestreams").resolve("reactive-streams"));
        Path rsJar = rsVersion == null ? null : buscarJarPorPrefijo(rsVersion, "reactive-streams-");
        if (rsJar == null) {
            return reactorJar.toString();
        }
        return reactorJar + File.pathSeparator + rsJar;
    }

    private static String construirClasspathDesdeTargetDependency() throws IOException {
        // Intenta en build/dependency primero
        Path buildDep = PROJECT_DIR.resolve("build/dependency");
        System.out.println("[Reactor] Buscando en build/dependency: " + buildDep);
        
        if (Files.isDirectory(buildDep)) {
            Path reactor = buscarJarPorPrefijo(buildDep, "reactor-core-");
            if (reactor != null) {
                Path rs = buscarJarPorPrefijo(buildDep, "reactive-streams-");
                System.out.println("[Reactor] ✓ Encontrado en build/dependency: " + reactor);
                if (rs != null) {
                    System.out.println("[Reactor] ✓ reactive-streams: " + rs);
                    return reactor.toAbsolutePath() + File.pathSeparator + rs.toAbsolutePath();
                }
                return reactor.toAbsolutePath().toString();
            }
        }
        
        // Luego intenta en target/dependency
        Path targetDep = PROJECT_DIR.resolve("target/dependency");
        System.out.println("[Reactor] Buscando en target/dependency: " + targetDep);
        
        if (!Files.isDirectory(targetDep)) {
            System.out.println("[Reactor] No encontrado en target/dependency");
            return null;
        }
        
        Path reactor = buscarJarPorPrefijo(targetDep, "reactor-core-");
        if (reactor == null) {
            System.out.println("[Reactor] reactor-core JAR no encontrado");
            return null;
        }
        System.out.println("[Reactor] ✓ Encontrado reactor-core en target: " + reactor);
        
        Path rs = buscarJarPorPrefijo(targetDep, "reactive-streams-");
        if (rs == null) {
            System.out.println("[Reactor] reactive-streams no encontrado, usando solo reactor-core");
            return reactor.toAbsolutePath().toString();
        }
        System.out.println("[Reactor] ✓ reactive-streams: " + rs);
        return reactor.toAbsolutePath() + File.pathSeparator + rs.toAbsolutePath();
    }

    private static String prepararEntornoReactivo() {
        try {
            String actual = construirClasspathReactor();
            if (actual != null && !actual.isBlank()) {
                System.out.println("✓ Reactor ya disponible en: " + actual);
                return "Reactor ya disponible. Classpath detectado correctamente.";
            }
        } catch (IOException e) {
            System.out.println("Detección de Reactor falló: " + e.getMessage());
        }

        System.out.println("[Setup] Descargando dependencias de Reactor con Maven desde: " + PROJECT_DIR);
        try {
            CommandResult result = runCommand(
                    PROJECT_DIR,
                    60,
                    "mvn",
                    "dependency:copy-dependencies",
                    "-DincludeArtifactIds=reactor-core,reactive-streams",
                    "-DoutputDirectory=target/dependency");
            
            System.out.println("[Setup] Maven exit code: " + result.exitCode + ", Timeout: " + result.timeout);
            if (!result.output.isBlank()) {
                System.out.println("[Setup] Maven output:\n" + result.output);
            }
            
            if (result.timeout) {
                return "Timeout descargando dependencias (60s).";
            }
            if (result.exitCode != 0) {
                return "Error en Maven:\n" + result.output;
            }
            System.out.println("✓ Entorno reactivo preparado en: " + PROJECT_DIR.resolve("target/dependency"));
            return "Entorno reactivo listo.";
        } catch (IOException e) {
            System.out.println("[Setup] Error ejecutando Maven: " + e.getMessage());
            e.printStackTrace();
            return "No se pudo ejecutar Maven: " + e.getMessage();
        }
    }

    private static Path obtenerMavenRepo() {
        String m2Repo = System.getenv("M2_REPO");
        if (m2Repo != null && !m2Repo.isBlank()) {
            return Path.of(m2Repo);
        }
        return Path.of(System.getProperty("user.home"), ".m2", "repository");
    }

    private static Path buscarUltimaCarpetaVersion(Path base) throws IOException {
        if (!Files.isDirectory(base)) {
            return null;
        }
        try (var stream = Files.list(base)) {
            return stream.filter(Files::isDirectory)
                    .max(Comparator.comparing(HttpEstudioServer::safeLastModified))
                    .orElse(null);
        }
    }

    private static Path buscarJarPorPrefijo(Path base, String prefijo) throws IOException {
        if (!Files.isDirectory(base)) {
            return null;
        }
        try (var stream = Files.list(base)) {
            return stream
                    .filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().startsWith(prefijo))
                    .filter(path -> path.getFileName().toString().endsWith(".jar"))
                    .max(Comparator.comparing(HttpEstudioServer::safeLastModified))
                    .orElse(null);
        }
    }

    private static long safeLastModified(Path path) {
        try {
            return Files.getLastModifiedTime(path).toMillis();
        } catch (IOException e) {
            return Long.MIN_VALUE;
        }
    }


    private static CommandResult runCommand(Path dir, int timeoutSeconds, String... command) throws IOException {
        Process process = new ProcessBuilder(command)
                .directory(dir.toFile())
                .redirectErrorStream(true)
                .start();

        boolean finished;
        try {
            finished = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                process.waitFor(1, TimeUnit.SECONDS);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            process.destroyForcibly();
            return new CommandResult(-1, true, "Proceso interrumpido.");
        }

        String output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        return new CommandResult(process.exitValue(), !finished, output);
    }

    private static void borrarRecursivo(Path dir) {
        try (var stream = Files.walk(dir)) {
            stream.sorted(Comparator.reverseOrder()).forEach(path -> {
                try {
                    Files.deleteIfExists(path);
                } catch (IOException ignored) {
                    // Limpieza best-effort del directorio temporal.
                }
            });
        } catch (IOException ignored) {
            // Limpieza best-effort del directorio temporal.
        }
    }

    private static String cargarRecurso(String path) {
        try (InputStream is = HttpEstudioServer.class.getResourceAsStream(path)) {
            if (is == null) return "Recurso no encontrado: " + path;
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
                return reader.lines().collect(Collectors.joining("\n"));
            }
        } catch (IOException e) {
            return "Error cargando recurso " + path + ": " + e.getMessage();
        }
    }

    /** Añade cabeceras CORS para que el frontend pueda consumir la API desde otro origen. */
    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
        exchange.getResponseHeaders().add("Access-Control-Max-Age", "86400");
    }

    private static void responder(HttpExchange exchange, int status, String contentType, String body) throws IOException {
        addCorsHeaders(exchange);
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    static class StaticFileHandler implements HttpHandler {
        private final String path;
        private final String contentType;

        StaticFileHandler(String path, String contentType) {
            this.path = path;
            this.contentType = contentType;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                responder(exchange, 405, "text/plain; charset=UTF-8", "Metodo no permitido.");
                return;
            }
            responder(exchange, 200, contentType, cargarRecurso(path));
        }
    }

    static class CommandResult {
        final int exitCode;
        final boolean timeout;
        final String output;

        CommandResult(int exitCode, boolean timeout, String output) {
            this.exitCode = exitCode;
            this.timeout = timeout;
            this.output = output;
        }
    }

    static class EntrevistaMockHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                responder(exchange, 405, "text/plain; charset=UTF-8", "Metodo no permitido. Usa GET.");
                return;
            }
            responder(exchange, 200, "text/html; charset=UTF-8", cargarRecurso("/static/mock.html"));
        }
    }

    static class EntrevistaWebfluxHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                responder(exchange, 405, "text/plain; charset=UTF-8", "Metodo no permitido. Usa GET.");
                return;
            }
            responder(exchange, 200, "text/html; charset=UTF-8", cargarRecurso("/static/webflux.html"));
        }
    }

    static class EntrevistaWebflux2Handler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                responder(exchange, 405, "text/plain; charset=UTF-8", "Metodo no permitido. Usa GET.");
                return;
            }
            responder(exchange, 200, "text/html; charset=UTF-8", cargarRecurso("/static/laboratorio.html"));
        }
    }

    static class EntrevistaIaHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                responder(exchange, 405, "text/plain; charset=UTF-8", "Metodo no permitido. Usa GET.");
                return;
            }
            responder(exchange, 200, "text/html; charset=UTF-8", cargarRecurso("/static/ia.html"));
        }
    }

    static class EntrevistaDocsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                responder(exchange, 405, "text/plain; charset=UTF-8", "Metodo no permitido. Usa GET.");
                return;
            }
            responder(exchange, 200, "text/html; charset=UTF-8", cargarRecurso("/static/docs.html"));
        }
    }

    static class EntrevistaHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                responder(exchange, 405, "text/plain; charset=UTF-8", "Metodo no permitido. Usa GET.");
                return;
            }
            responder(exchange, 200, "text/html; charset=UTF-8", cargarRecurso("/static/ruta.html"));
        }
    }

    static class PaginaEstudioHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                responder(exchange, 405, "text/plain; charset=UTF-8", "Metodo no permitido. Usa GET.");
                return;
            }
            responder(exchange, 200, "text/html; charset=UTF-8", cargarRecurso("/static/index.html"));
        }
    }
}
