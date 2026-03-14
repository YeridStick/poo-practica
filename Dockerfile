## Etapa 1: Build con Maven (monolito)
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos solo el pom primero para aprovechar mejor la caché de dependencias
COPY pom.xml .
RUN mvn -q dependency:go-offline

# Copiamos el código fuente y construimos el proyecto + dependencias
COPY src ./src
RUN mvn -q clean package -DskipTests \
    dependency:copy-dependencies -DincludeArtifactIds=reactor-core,reactive-streams -DoutputDirectory=build/dependency

## Etapa 2: Runtime (JDK completo para el playground)
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copiamos clases compiladas y dependencias (usamos 'build' en lugar de 'target' según pom.xml)
COPY --from=build /app/build/classes /app/build/classes
COPY --from=build /app/build/dependency /app/build/dependency
COPY --from=build /app/src/main/resources/static /app/build/classes/static

# Configuraciones de puerto y memoria para optimizar consumo en Railway
ENV PORT=7860
EXPOSE ${PORT}

# Ejecutar el servidor con flags de optimización de memoria para contenedores
CMD ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -cp build/classes:build/dependency/* HttpEstudioServer ${PORT}"]
