# Qiankun微前端demo

## 技术栈
- 主应用：React18 + Vite
- 子应用1：Vue3 + Vite
- 子应用2：React18 + Vite
- 微前端框架：qiankun@2.10
- 包管理：Lerna + npm

## 快速启动
```bash
# 安装依赖
npm run bootstrap

# 同时启动所有应用（需要提前安装lerna）
lerna run dev --parallel

# 单独启动应用
cd packages/main-app && npm run dev


##容器化部署
```bash
已配置容器化部署，需在仓库配置如下secret
DOCKER_USERNAME： docker hub的用户名
DOCKER_PASSWORD： docker hub的密码
DOCKER_IMAGE_NAME： docker hub的镜像名
SSH_HOST：服务器SSh的用户名
SSH_USER：服务器SSh的用户名
SSH_PRIVATE_KEY：服务器SSh的私钥
NGINX_SERVER_NAME： nginx的server_name
PORT： nginx的端口
```

