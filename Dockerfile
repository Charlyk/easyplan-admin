FROM node:16.15.0-alpine

# Bundle app files
COPY .next .next/
COPY node_modules node_modules/
COPY environment environment/
COPY public public/
COPY package.json package.json

EXPOSE 3000:3000

CMD ["yarn", "start:local"]
