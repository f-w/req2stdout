# syntax=docker/dockerfile:1
ARG nodeVersion=lts
# Check out https://hub.docker.com/_/node to select a new base image
FROM node:${nodeVersion}

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# Bundle app source code
COPY --chown=node . .

ENV PORT=3000 NODE_ENV=production

EXPOSE ${PORT}
CMD [ "node", "." ]
