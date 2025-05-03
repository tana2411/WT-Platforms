#############
### build ###
#############

# base image
FROM node:20.19.1-alpine as build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci
RUN npm install -g @angular/cli@19.2.0

# add app
COPY . /app

# generate build
RUN npm run build
# RUN ng build

############
### prod ###
############

# base image
FROM nginx:1.27.5-alpine

# copy artifact build from the 'build environment'
COPY --from=build /app/dist/watse-trade/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
