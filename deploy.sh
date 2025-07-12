#!/bin/bash

# 部署脚本
set -e

# 配置变量
CONTAINER_NAME="qiankun-app"
IMAGE_NAME="${DOCKER_IMAGE_NAME:-qiankun-demo:latest}"
EXTERNAL_PORT="${EXTERNAL_PORT:-8888}"
INTERNAL_PORT="${INTERNAL_PORT:-80}"

echo "开始部署 $CONTAINER_NAME..."

# 停止并删除旧容器
echo "停止旧容器..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# 检查端口是否被占用
echo "检查端口 $EXTERNAL_PORT 占用情况..."
if lsof -Pi :$EXTERNAL_PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "警告: 端口 $EXTERNAL_PORT 已被占用"
    echo "占用进程:"
    lsof -i :$EXTERNAL_PORT
    read -p "是否继续? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 拉取最新镜像
echo "拉取镜像 $IMAGE_NAME..."
docker pull $IMAGE_NAME

# 启动新容器
echo "启动新容器..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $EXTERNAL_PORT:$INTERNAL_PORT \
    -e PORT=$INTERNAL_PORT \
    -e NGINX_SERVER_NAME=${NGINX_SERVER_NAME:-localhost} \
    --restart unless-stopped \
    $IMAGE_NAME

# 等待容器启动
echo "等待容器启动..."
sleep 5

# 检查容器状态
if docker ps | grep -q $CONTAINER_NAME; then
    echo "✅ 容器启动成功!"
    echo "容器信息:"
    docker ps | grep $CONTAINER_NAME
    echo "访问地址: http://localhost:$EXTERNAL_PORT"
else
    echo "❌ 容器启动失败!"
    echo "容器日志:"
    docker logs $CONTAINER_NAME --tail 20
    exit 1
fi

# 健康检查
echo "执行健康检查..."
for i in {1..10}; do
    if curl -f http://localhost:$EXTERNAL_PORT/ >/dev/null 2>&1; then
        echo "✅ 健康检查通过!"
        break
    else
        echo "等待服务启动... ($i/10)"
        sleep 2
    fi
done

echo "部署完成!" 