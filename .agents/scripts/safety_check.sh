#!/usr/bin/env bash
# Safety gate for high-risk commands
CMD="$1"

if echo "$CMD" | grep -Eq 'rm -rf /|rm -rf ~|git push.*--force-with-lease:false|mkfs|dd if=/dev'; then
    echo "❌ [SAFETY GATE BLOCKED]: High-risk system destructive command detected." >&2
    exit 1
fi

exit 0
