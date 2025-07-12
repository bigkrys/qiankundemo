# 构建阶段
FROM node:23.6.0 as builder

# 安装 pnpm
RUN npm install -g pnpm@8.15.5
# 设置工作目录
WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package*.json ./
COPY pnpm-workspace.yaml ./
COPY lerna.json ./
COPY packages/main-app/package*.json ./packages/main-app/
COPY packages/sub-app1/package*.json ./packages/sub-app1/
COPY packages/sub-app2/package*.json ./packages/sub-app2/
COPY shared/utils/package*.json ./shared/utils/

# 安装依赖
RUN pnpm install
RUN pnpm add -w typescript

# 复制源代码
COPY . .

# 先构建共享库
RUN cd shared/utils && pnpm build

# 构建所有应用
RUN pnpm build

# 运行阶段
FROM nginx:alpine

# 安装 envsubst 和 curl (用于健康检查)
RUN apk add --no-cache gettext curl

# 复制 nginx 配置模板
COPY nginx.conf /etc/nginx/templates/default.conf.template

# 复制构建产物
COPY --from=builder /app/packages/main-app/dist /usr/share/nginx/html
COPY --from=builder /app/packages/sub-app1/dist /usr/share/nginx/html/sub-app1
COPY --from=builder /app/packages/sub-app2/dist /usr/share/nginx/html/sub-app2

# 设置默认环境变量
ENV PORT=8888
ENV NGINX_SERVER_NAME=localhost

# 启动脚本
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8888}/ || exit 1

EXPOSE 8888

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"] 