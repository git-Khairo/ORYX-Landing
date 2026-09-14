# syntax=docker/dockerfile:1.7
#
# ORYX GROUP landing — a static Vite build served by nginx.
#
# Two stages. The first has Node and the whole dependency tree and exists only
# to produce `dist/`; the second is a plain nginx image that carries nothing
# but that folder and one config file. The image that ships has no Node, no
# node_modules and no source in it.
#
# `npm run build` runs the publication gate first (`prebuild` →
# scripts/check-claims.mjs). A BLOCKED claim in the copy fails the build, so a
# production image cannot be made from copy the source document forbids. The
# placeholder-footage warning prints in the build log but does not fail it.

# ── Stage 1: build ────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# Dependencies first, on their own layer, so a copy change does not reinstall.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# ── Stage 2: serve ────────────────────────────────────────────────────────
FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
