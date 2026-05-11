# Passo 1: Build da aplicação (compilação)
FROM maven:3.8.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Passo 2: Execução da aplicação (Usando Eclipse Temurin, que é a sucessora oficial)
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Copia o arquivo .jar gerado no passo anterior
COPY --from=build /app/target/*.jar app.jar

# Define a porta
EXPOSE 8080

# Comando para rodar a aplicação com a variável de porta do Render
ENTRYPOINT ["java", "-Dserver.port=${PORT:8080}", "-jar", "app.jar"]