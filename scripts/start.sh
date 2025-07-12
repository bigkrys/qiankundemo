#!/bin/bash

# 启动脚本
set -e

echo "🚀 启动微前端应用..."

# 检查是否已构建
if [ ! -d "shared/utils/dist" ]; then
    echo "⚠️  共享库未构建，正在构建..."
    cd shared/utils
    pnpm build
    cd ../..
fi

# 启动所有应用
echo "🎯 启动所有应用..."
pnpm start 