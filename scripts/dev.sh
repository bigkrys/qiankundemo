#!/bin/bash

# 开发环境脚本
set -e

echo "🔧 启动开发环境..."

# 检查依赖
echo "📦 检查依赖..."
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装，请先安装 pnpm"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 构建共享库（如果不存在）
if [ ! -d "shared/utils/dist" ]; then
    echo "🔨 构建共享库..."
    cd shared/utils
    pnpm build
    cd ../..
fi

# 启动开发服务器
echo "🎯 启动开发服务器..."
pnpm dev 