# Base image for Node.js and Python microservices
FROM node:18-alpine as nodebase
FROM python:3.11-alpine as pythonbase

# Node.js service build
FROM node:18-alpine as node_service
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
EXPOSE 4001 4002 4003 4004
CMD ["node", "nmt-llm-service.js"]

# Python service build
FROM python:3.11-alpine as python_service
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5001 5002 5003 6001 6002
CMD ["uvicorn", "annotation_service:app", "--host", "0.0.0.0", "--port", "5001"]
