@echo off
echo Configurando variaveis de ambiente para MySQL...
set DB_URL=jdbc:mysql://localhost:3306/epidemia?createDatabaseIfNotExist=true
set DB_USER=root
set DB_PASSWORD=

echo.
echo IMPORTANTE: Altere a senha acima se necessario!
echo Usuario padrao: root
echo Senha padrao: (vazia)
echo.
echo Pressione qualquer tecla para iniciar a aplicacao...
pause > nul

echo Iniciando aplicacao com MySQL...
java -jar target/epidemia-monitoramento-0.0.1-SNAPSHOT.jar