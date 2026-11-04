#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PS5_HOST="${PS5_HOST:-192.168.0.111}"
FTP_PORT="${FTP_PORT:-1337}"
PLDMGR_PORT="${PLDMGR_PORT:-8084}"
RESTORE_PORT="${RESTORE_PORT:-9099}"

if [[ ! -f "${ROOT}/build/restore.elf" ]]; then
  "${ROOT}/tools/build-daemon.sh"
fi

echo "[1/3] 上传应用元数据与第一阶段 UI 静态资源至 ftp://${PS5_HOST}:${FTP_PORT}/data/restore/ ..."
python3 - "${ROOT}" "${PS5_HOST}" "${FTP_PORT}" <<'PY'
import ftplib, io, os, sys

root, host, port = sys.argv[1], sys.argv[2], int(sys.argv[3])
ftp = ftplib.FTP()
ftp.connect(host, port, timeout=10)
ftp.login()

for d in ["/data/restore", "/data/restore/app", "/data/restore/ui", "/data/restore/ui/assets"]:
    try:
        ftp.mkd(d)
    except Exception:
        pass

uploads = [
    ("assets/app/param.json", "/data/restore/app/param.json"),
    ("assets/app/icon0.png", "/data/restore/app/icon0.png"),
    ("src/ui/index.html", "/data/restore/ui/index.html"),
    ("src/ui/styles.css", "/data/restore/ui/styles.css"),
    ("src/ui/app.js", "/data/restore/ui/app.js"),
    ("src/ui/motion.js", "/data/restore/ui/motion.js"),
    ("src/ui/assets/restore-logo.png", "/data/restore/ui/assets/restore-logo.png"),
    ("src/ui/assets/ps5-showcase-crop.jpg", "/data/restore/ui/assets/ps5-showcase-crop.jpg"),
]

for rel, remote in uploads:
    local_path = os.path.join(root, rel)
    with open(local_path, "rb") as f:
        data = f.read()
    ftp.storbinary(f"STOR {remote}", io.BytesIO(data))
    print(f"  -> {remote} ({len(data)} bytes)")

ftp.quit()
PY

echo "[2/3] 检查 ${PS5_HOST}:${RESTORE_PORT} 上的 ReStore 后台常驻服务状态 ..."
if curl -sf -m 3 "http://${PS5_HOST}:${RESTORE_PORT}/api/status" >/dev/null 2>&1; then
  echo "  -> 后台服务已在线，通过 POST /api/register 热刷新 RSTR00001 登记（无需重复注入 ELF）..."
  curl -sf -X POST "http://${PS5_HOST}:${RESTORE_PORT}/api/register"
  echo ""
else
  echo "  -> 后台服务尚未运行，通过 Payload Manager (:${PLDMGR_PORT}) 上传并启动 build/restore.elf ..."
  curl -sf -X POST "http://${PS5_HOST}:${PLDMGR_PORT}/manage:upload?filename=restore.elf" \
    -H "Content-Type: application/octet-stream" \
    --data-binary @"${ROOT}/build/restore.elf"
  echo ""
  curl -sf "http://${PS5_HOST}:${PLDMGR_PORT}/loadpayload:/data/pldmgr/payloads/restore/restore.elf"
  echo ""
  sleep 2
fi

echo "[3/3] 核验 http://${PS5_HOST}:${RESTORE_PORT}/api/status 在线响应 ..."
curl -sf -m 5 "http://${PS5_HOST}:${RESTORE_PORT}/api/status"
echo ""
