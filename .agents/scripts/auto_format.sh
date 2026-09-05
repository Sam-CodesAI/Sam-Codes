#!/usr/bin/env bash
# Auto-format hook for modified files

TARGET_FILE="$1"
if [ -z "$TARGET_FILE" ] || [ ! -f "$TARGET_FILE" ]; then
    exit 0
fi

EXT="${TARGET_FILE##*.}"

case "$EXT" in
    py)
        if command -v ruff >/dev/null 2>&1; then
            ruff format "$TARGET_FILE" >/dev/null 2>&1 || true
        fi
        ;;
    js|jsx|ts|tsx|json|css|md)
        if command -v prettier >/dev/null 2>&1; then
            prettier --write "$TARGET_FILE" >/dev/null 2>&1 || true
        fi
        ;;
esac

exit 0
