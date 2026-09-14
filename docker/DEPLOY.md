# Deploying to the server

The site is a static build served by nginx inside one container. The server
needs git and Docker (with the compose plugin) and nothing else — no Node.
The container is published on host port **8084** (override with `PORT=`);
point the server's reverse proxy at it for the public hostname.

## First time

```bash
# 1. Get the code — one branch only, checked out directly.
git clone --branch new-project --single-branch https://github.com/git-Khairo/ORYX-Landing.git oryx-landing
cd oryx-landing

# 2. Build the image and start it.
docker compose up -d --build

# 3. Check.
docker compose ps
curl -I http://localhost:8084/
```

## Every update after that

```bash
cd oryx-landing
git fetch origin
git checkout new-project
git pull --ff-only origin new-project
docker compose up -d --build
```

`--ff-only` refuses to pull if the server's copy has diverged from GitHub,
which can only happen if someone edited files on the server. Nobody should;
if it happens, `git reset --hard origin/new-project` discards the server-side
edits and takes GitHub's version.

## Switching to a different branch

```bash
git fetch origin
git checkout main            # or any branch name that exists on GitHub
git pull --ff-only origin main
docker compose up -d --build
```

## If the repository is private

Clone over SSH with a deploy key instead of HTTPS:

```bash
ssh-keygen -t ed25519 -C "oryx-production" -f ~/.ssh/oryx_deploy -N ""
cat ~/.ssh/oryx_deploy.pub     # paste into GitHub → repo → Settings → Deploy keys (read-only)
git clone --branch new-project --single-branch git@github.com:git-Khairo/ORYX-Landing.git oryx-landing
```

## What the build enforces

`docker compose build` runs `npm run build`, and that runs the publication
gate first (`scripts/check-claims.mjs`). A blocked claim in the copy fails the
build — the image cannot be made. The placeholder-footage warning
(`public/film/01-wide.mp4`) prints in the log and does not fail it; replace
the file before the site is public.
