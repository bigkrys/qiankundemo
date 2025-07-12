#!/bin/bash

# 子域名配置脚本
set -e

SUBDOMAIN=${1:-"app"}
DOMAIN=${2:-"yourdomain.com"}

echo "🌐 配置子域名: $SUBDOMAIN.$DOMAIN"

# 检查参数
if [ -z "$SUBDOMAIN" ] || [ -z "$DOMAIN" ]; then
    echo "❌ 请提供子域名和域名参数"
    echo "用法: ./scripts/setup-subdomain.sh <subdomain> <domain>"
    echo "示例: ./scripts/setup-subdomain.sh app example.com"
    exit 1
fi

FULL_DOMAIN="$SUBDOMAIN.$DOMAIN"

# 创建SSL目录
echo "📁 创建SSL目录..."
mkdir -p ssl

# 生成自签名证书（开发环境）
echo "🔐 生成SSL证书..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/$FULL_DOMAIN.key \
    -out ssl/$FULL_DOMAIN.crt \
    -subj "/C=CN/ST=State/L=City/O=Organization/CN=$FULL_DOMAIN"

# 创建Nginx配置
echo "⚙️  创建Nginx配置..."
cat > nginx-subdomain.conf << EOF
# 反向代理配置
upstream qiankun_backend {
    server 127.0.0.1:8888;
}

# 子域名配置
server {
    listen 80;
    server_name $FULL_DOMAIN;
    
    location / {
        proxy_pass http://qiankun_backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# HTTPS配置（可选）
server {
    listen 443 ssl http2;
    server_name $FULL_DOMAIN;
    
    ssl_certificate /etc/nginx/ssl/$FULL_DOMAIN.crt;
    ssl_certificate_key /etc/nginx/ssl/$FULL_DOMAIN.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://qiankun_backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

echo "✅ 子域名配置完成!"
echo "📝 请确保在DNS中配置以下记录:"
echo "  - A记录: $FULL_DOMAIN -> 您的服务器IP"
echo ""
echo "🚀 启动命令:"
echo "  docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "📋 在GitHub Secrets中设置:"
echo "  NGINX_SERVER_NAME=$FULL_DOMAIN" 