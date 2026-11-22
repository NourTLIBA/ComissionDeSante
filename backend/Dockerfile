FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
EXPOSE 3000
# schema + seed are safe to run on every start
CMD ["sh", "-c", "npm run migrate && npm run seed && npm start"]
