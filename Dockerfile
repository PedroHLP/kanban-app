# Use uma imagem oficial do Node.js como imagem base
FROM node:22-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências da aplicação
RUN npm install --production

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta que a aplicação irá rodar
EXPOSE 5000

# Define a variável de ambiente para a porta (opcional)
ENV PORT=5000

# Comando para iniciar a aplicação
CMD ["node", "serve.js"]


