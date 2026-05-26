# Stage 1: Build the application using Maven
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml and download dependencies to cache them in the Docker layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the package (skipping tests for speed)
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Run the application using a lightweight JRE image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Spring Boot default port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
