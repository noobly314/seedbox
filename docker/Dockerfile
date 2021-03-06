#
# Build stage
#
FROM golang:1.13-alpine as build

# args
ARG version="1.0.4"

# build root
WORKDIR /build
ADD ./main.go ./

# build & test
RUN apk add --no-cache git \
    && echo -e "module caddy\nrequire github.com/caddyserver/caddy v${version}" > go.mod \
    && CGO_ENABLED=0 GOOS=linux GO111MODULE=on go build \
    && ./caddy -version

#
# Final image
#
FROM scratch

# copy binary
COPY --from=build /build/caddy /bin/caddy

# copy default caddyfile
COPY Caddyfile /etc/Caddyfile

# copy trui files
COPY trui /srv/trui

# set default caddypath
ENV CADDYPATH=/etc/.caddy
VOLUME /etc/.caddy

# serve from /srv
WORKDIR /srv
EXPOSE 80

ENTRYPOINT ["/bin/caddy", "--conf", "/etc/Caddyfile", "--log", "stdout"]
