#############
### build ###
#############

# base image
FROM node:20.19.1-alpine as build

# set working directory
WORKDIR /

# add `/app/node_modules/.bin` to $PATH
ENV PATH /node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /package.json
COPY package-lock.json /package-lock.json
RUN npm ci

# add app
COPY . /

# generate build
RUN npm run build

############
### prod ###
############

# base image
FROM nginx:1.21.6-alpine

# copy artifact build from the 'build environment'
COPY --from=build /dist/watse-trade/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
