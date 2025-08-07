# TextShare

Ultra-simple, no-login, real-time **multi-pad** text board you can deploy with Docker/Portainer.

## Features
- Multiple pads with clickable tabs
- Rename pads (double-click tab or use Rename)
- Copy and Clear buttons
- Live updates for everyone viewing
- Ephemeral in-memory storage (resets on container restart)

---

## Run locally (Docker Compose)
```bash
docker compose up -d --build
# open http://localhost:8080
```

---

## Deploy with Portainer (from GitHub)

1. **Create a GitHub repo**
   - On GitHub, click **New repository**, name it e.g. `textshare`.
   - Either upload these files via the web UI (**Add file → Upload files**) or push with git:
     ```bash
     git init
     git remote add origin https://github.com/<your-user>/textshare.git
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git push -u origin main
     ```

2. **Deploy in Portainer**
   - In Portainer, go to **Stacks** → **Add stack** → **Git repository**.
   - **Repository URL**: your repo URL, e.g. `https://github.com/<your-user>/textshare.git`
   - **Compose path**: `docker-compose.yml`
   - If the repo is private, add your Git credentials in Portainer.
   - (Optional) Enable **Automatic updates** to redeploy on commit.
   - Click **Deploy the stack**.

3. **Access**
   - Once deployed, browse to `http://<portainer-node-host>:8080` (or the port you changed to).

### Notes
- The compose file uses `build: .`, so the node will build the image from the repo contents.
- If you prefer to use a prebuilt image, you can push to a registry and change compose to use `image: yourname/textshare:tag`.

---

## Customization
- Change external port in `docker-compose.yml`:
  ```yaml
  ports:
    - "8080:3000"  # host:container
  ```
- Persist pads by replacing in-memory store with a simple file/volume or Redis (ask if you want this).

## License
MIT
