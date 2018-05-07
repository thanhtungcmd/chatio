FROM "node:9.11"

RUN npm install express-generator -g
RUN npm install nodemon -g

WORKDIR /home/node/app

CMD ["nodemon", "-L", "./bin/www"]

EXPOSE 3000