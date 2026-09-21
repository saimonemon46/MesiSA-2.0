FROM alpine:latest

# Install Node.js & npm using Alpine's package manager
RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "dev"]
