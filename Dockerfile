# Passo 1: Build da aplicação (compilação)
FROM maven:3.8.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Passo 2: Execução da aplicação
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Copia o arquivo .jar gerado no passo anterior
COPY --from=build /app/target/*.jar app.jar

# Define a porta dinâmica para o Render
EXPOSE 8080

# Comando de inicialização
ENTRYPOINT ["java", "-Dserver.port=${PORT:8080}", "-jar", "app.jar"]