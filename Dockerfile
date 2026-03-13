## Etapa 1: Build con Maven (monolito)
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos solo el pom primero para aprovechar mejor la caché de dependencias
COPY pom.xml .
RUN mvn -q dependency:go-offline

# Copiamos el código fuente y construimos el proyecto + dependencias (incluye Reactor)
COPY src ./src
RUN mvn -q clean package -DskipTests \
    dependency:copy-dependencies -DincludeArtifactIds=reactor-core,reactive-streams -DoutputDirectory=target/dependency

## Etapa 2: Runtime (JDK completo, se usa javac dentro del playground)
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copiamos clases compiladas y dependencias
COPY --from=build /app/target/classes /app/target/classes
COPY --from=build /app/target/dependency /app/target/dependency

EXPOSE 8080

# Ejecutar el servidor HTTP del dashboard (monolito)
CMD ["java", "-cp", "target/classes:target/dependency/*", "HttpEstudioServer", "8080"]
