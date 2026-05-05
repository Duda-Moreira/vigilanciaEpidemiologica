#!/bin/bash
# =========================================
# Epidemia Monitoramento - Start Script
# Linux / macOS
# =========================================

echo ""
echo "=== Monitoramento Epidemiologico - Inicializando ==="
echo ""

# Verifica se Maven está instalado
if ! command -v mvn &> /dev/null; then
    echo "[ERRO] Maven não foi encontrado!"
    echo "Instale Maven em: https://maven.apache.org/download.cgi"
    exit 1
fi

# Verifica se Java está instalado
if ! command -v java &> /dev/null; then
    echo "[ERRO] Java não foi encontrado!"
    echo "Instale Java 17 em: https://www.oracle.com/java/technologies/downloads/"
    exit 1
fi

echo "[OK] Maven e Java detectados"
echo ""

# Menu de opções
echo "Escolha uma opção:"
echo "1 - Rodar com H2 em memória (desenvolvimento - padrão)"
echo "2 - Rodar com MySQL (requer MySQL configurado)"
echo "3 - Limpar e recompilar"
echo "4 - Ver logs detalhados"
echo ""

read -p "Digite a opção (1-4): " opcao

case $opcao in
    1)
        echo ""
        echo "[INFO] Iniciando com H2 em memória..."
        echo ""
        mvn clean spring-boot:run -DskipTests
        ;;
    2)
        echo ""
        echo "[INFO] Iniciando com MySQL..."
        echo "Configure as variáveis de ambiente se necessário:"
        echo "  export DB_URL=jdbc:mysql://localhost:3306/epidemia?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Sao_Paulo"
        echo "  export DB_USER=root"
        echo "  export DB_PASSWORD=sua_senha"
        echo ""
        mvn clean spring-boot:run -DskipTests
        ;;
    3)
        echo ""
        echo "[INFO] Limpando e compilando..."
        echo ""
        mvn clean install -DskipTests
        if [ $? -eq 0 ]; then
            echo ""
            echo "[OK] Compilação concluída com sucesso!"
            echo "[INFO] Para iniciar, execute novamente este script."
        fi
        ;;
    4)
        echo ""
        echo "[INFO] Iniciando com logs detalhados..."
        echo ""
        mvn -X spring-boot:run -DskipTests
        ;;
    *)
        echo "[ERRO] Opção inválida!"
        exit 1
        ;;
esac

echo ""
echo "A aplicação está disponível em: http://localhost:8080"
echo "Pressione Ctrl+C para parar."
echo ""
