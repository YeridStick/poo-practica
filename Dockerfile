# Etapa 1: Build con Maven
FROM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /app

# Copiar el archivo pom.xml y descargar dependencias (para aprovechar caché)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar el código fuente y compilar
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Runtime con JDK completo (necesario para el playground/javac)
FROM eclipse-temurin:17-jdk-focal
WORKDIR /app

# Copiar el JAR generado desde la etapa de build
COPY --from=build /app/build/poo-practica-1.0-SNAPSHOT.jar app.jar

# También podríamos copiar las dependencias si el servidor las necesita dinámicamente
# Pero el JAR generado por Maven suele ser suficiente si se configura como fat-jar 
# o si se copian las librerías a /app/lib

EXPOSE 8080

# Ejecutar el servidor por defecto
CMD ["java", "-cp", "app.jar", "HttpEstudioServer", "8080"]
