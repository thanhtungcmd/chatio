FROM node:9.11

RUN npm install express-generator -g
RUN npm install nodemon -g
#RUN npm install pm2 -g

WORKDIR /home/node/app

CMD ["node", "./bin/www"]
#CMD ["nodemon", "-L", "./bin/www"]
#CMD ["pm2", "start", "./bin/www", "--watch"]

EXPOSE 3000