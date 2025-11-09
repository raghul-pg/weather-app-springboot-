# Multi-stage Dockerfile: build with Maven, run with a minimal JRE image

# 1) Build stage
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app

# copy pom first to leverage Docker layer caching for dependencies
COPY pom.xml .
COPY src ./src

# Build the application (skip tests to speed up builds in CI; remove -DskipTests if you want tests)
RUN mvn -B -DskipTests package

# 2) Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy jar produced by Maven
COPY --from=build /app/target/weather-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app listens on (override with PORT env var if needed)
EXPOSE 8080

# Use a non-root user (optional, better security)
RUN groupadd -g 1000 appuser && useradd -r -u 1000 -g appuser appuser && chown -R appuser:appuser /app
USER appuser

# Start command. Provide OPENWEATHER_API_KEY when running the container.
ENTRYPOINT ["java","-jar","/app/app.jar"]
