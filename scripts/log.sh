#!/bin/bash

# 日志脚本 - 用于记录命令执行日志
# 用法: ./scripts/log.sh <command> [args...]

LOG_DIR="$(cd "$(dirname "$0")/.." && pwd)/logs"
mkdir -p "$LOG_DIR"

# 获取当前日期时间
TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
LOG_DATE=$(date '+%Y-%m-%d')

# 获取命令名称
if [ $# -eq 0 ]; then
    echo "用法: $0 <command> [args...]"
    exit 1
fi

COMMAND_NAME="$1"
shift

# 生成日志文件名
LOG_FILE="$LOG_DIR/${COMMAND_NAME}_${LOG_DATE}.log"

# 写入日志头
echo "========================================" >> "$LOG_FILE"
echo "执行时间: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
echo "命令: $COMMAND_NAME $*" >> "$LOG_FILE"
echo "工作目录: $(pwd)" >> "$LOG_FILE"
echo "----------------------------------------" >> "$LOG_FILE"

# 执行命令并记录输出
if [ $# -eq 0 ]; then
    # 没有额外参数，直接执行命令
    eval "$COMMAND_NAME" 2>&1 | tee -a "$LOG_FILE"
    EXIT_CODE=${PIPESTATUS[0]}
else
    # 有额外参数
    eval "$COMMAND_NAME $*" 2>&1 | tee -a "$LOG_FILE"
    EXIT_CODE=${PIPESTATUS[0]}
fi

# 写入日志尾
echo "----------------------------------------" >> "$LOG_FILE"
echo "退出码: $EXIT_CODE" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

exit $EXIT_CODE
