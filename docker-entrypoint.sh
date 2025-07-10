#!/bin/sh

# 使用环境变量替换nginx配置模板中的变量
envsubst '${PORT} ${NGINX_SERVER_NAME}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# 执行传入的命令
exec "$@" 