# Multi-stage Dockerfile: build with Maven then run with a small JRE image
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app
# copy pom first to leverage Docker layer caching for dependencies
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
