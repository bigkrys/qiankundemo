#!/bin/bash

# 构建脚本
set -e

echo "🚀 开始构建微前端应用..."

# 检查依赖
echo "📦 检查依赖..."
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装，请先安装 pnpm"
    exit 1
fi

# 清理旧的构建文件
echo "🧹 清理旧的构建文件..."
pnpm clean

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 构建共享库
echo "🔨 构建共享库..."
cd shared/utils
pnpm build
cd ../..

# 验证共享库构建结果
echo "✅ 验证共享库构建结果..."
if [ ! -f "shared/utils/dist/index.es.js" ]; then
    echo "❌ 共享库构建失败: index.es.js 不存在"
    exit 1
fi

if [ ! -f "shared/utils/dist/index.umd.js" ]; then
    echo "❌ 共享库构建失败: index.umd.js 不存在"
    exit 1
fi

echo "✅ 共享库构建成功!"

# 构建所有应用
echo "🏗️  构建所有应用..."
pnpm build:apps

# 验证构建结果
echo "✅ 验证构建结果..."
if [ ! -d "packages/main-app/dist" ]; then
    echo "❌ 主应用构建失败"
    exit 1
fi

if [ ! -d "packages/sub-app1/dist" ]; then
    echo "❌ 子应用1构建失败"
    exit 1
fi

if [ ! -d "packages/sub-app2/dist" ]; then
    echo "❌ 子应用2构建失败"
    exit 1
fi

echo "🎉 所有应用构建成功!"
echo "📁 构建产物:"
echo "  - 主应用: packages/main-app/dist"
echo "  - 子应用1: packages/sub-app1/dist"
echo "  - 子应用2: packages/sub-app2/dist"
echo "  - 共享库: shared/utils/dist" 