@echo off
REM =========================================
REM Epidemia Monitoramento - Start Script
REM Windows CMD
REM =========================================

echo.
echo === Monitoramento Epidemiologico - Inicializando ===
echo.

REM Verifica se Maven está instalado
mvn -version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Maven nao foi encontrado!
    echo Instale Maven em: https://maven.apache.org/download.cgi
    echo Adicione Maven ao PATH do sistema.
    pause
    exit /b 1
)

REM Verifica se Java está instalado
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Java nao foi encontrado!
    echo Instale Java 17 em: https://www.oracle.com/java/technologies/downloads/
    echo Adicione Java ao PATH do sistema.
    pause
    exit /b 1
)

echo [OK] Maven e Java detectados
echo.

REM Menu de opcoes
echo Escolha uma opcao:
echo 1 - Rodar com H2 em memoria (desenvolvimento - padrao)
echo 2 - Rodar com MySQL (requer MySQL configurado)
echo 3 - Limpar e recompilar
echo 4 - Ver logs detalhados
echo.

set /p opcao="Digite a opcao (1-4): "

if "%opcao%"=="1" (
    echo.
    echo [INFO] Iniciando com H2 em memoria...
    echo.
    mvn clean spring-boot:run -DskipTests
    goto fim
)

if "%opcao%"=="2" (
    echo.
    echo [INFO] Iniciando com MySQL...
    echo Configure as variaveis de ambiente se necessario:
    echo   set DB_URL=jdbc:mysql://localhost:3306/epidemia?useSSL=false^&allowPublicKeyRetrieval=true^&serverTimezone=America/Sao_Paulo
    echo   set DB_USER=root
    echo   set DB_PASSWORD=sua_senha
    echo.
    mvn clean spring-boot:run -DskipTests
    goto fim
)

if "%opcao%"=="3" (
    echo.
    echo [INFO] Limpando e compilando...
    echo.
    mvn clean install -DskipTests
    if errorlevel 0 (
        echo.
        echo [OK] Compilacao concluida com sucesso!
        echo [INFO] Para iniciar, execute novamente este script.
    )
    goto fim
)

if "%opcao%"=="4" (
    echo.
    echo [INFO] Iniciando com logs detalhados...
    echo.
    mvn -X spring-boot:run -DskipTests
    goto fim
)

echo [ERRO] Opcao invalida!
pause

:fim
echo.
echo A aplicacao esta disponivel em: http://localhost:8080
echo Pressione Ctrl+C para parar.
echo.
pause
