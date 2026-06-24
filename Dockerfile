FROM maven:3.9-eclipse-temurin-17-alpine
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests
EXPOSE 8080
CMD ["java", "-Dspring.profiles.active=devlocal", "-jar", "target/surgical-copilot-backend.jar"]
