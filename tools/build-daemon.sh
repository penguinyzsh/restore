#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export PATH="/opt/homebrew/opt/llvm@18/bin:/opt/homebrew/opt/llvm/bin:/opt/homebrew/bin:/usr/local/bin:${PATH}"

SDK="${PS5_PAYLOAD_SDK:-}"
if [[ -z "${SDK}" ]]; then
  for candidate in \
    "/Users/penguinyzsh/Project/PS5/Archive/public/tools/ps5-devloop/.build/sdk" \
    "${HOME}/ps5-payload-sdk" \
    "/usr/local/ps5-payload-sdk" \
    "/opt/ps5-payload-sdk"; do
    if [[ -x "${candidate}/bin/prospero-clang" ]]; then
      SDK="${candidate}"
      break
    fi
  done
fi

if [[ -z "${SDK}" || ! -x "${SDK}/bin/prospero-clang" ]]; then
  echo "error: PS5_PAYLOAD_SDK not found" >&2
  exit 1
fi

export PS5_PAYLOAD_SDK="${SDK}"
make -C "${ROOT}/src/daemon" "$@"
ls -lh "${ROOT}/build/restore.elf"
