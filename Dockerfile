# Passo 1: Build da aplicação (compilação)
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY . .
# Compila o projeto ignorando os testes para ser mais rápido
RUN mvn clean package -DskipTests

# Passo 2: Execução da aplicação
FROM openjdk:17-jdk-slim
WORKDIR /app
# Copia o arquivo .jar gerado no passo anterior para a imagem final
COPY --from=build /app/target/*.jar app.jar

# Define a porta (O Render vai passar a porta via variável de ambiente)
EXPOSE 8080

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-Dserver.port=${PORT:8080}", "-jar", "app.jar"]