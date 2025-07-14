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
tar -czf qiankun-deploy.tar.gz \
    Dockerfile \
    docker-compose.yml \
    nginx.conf \
    package.json \
    package-lock.json \
    lerna.json \
    packages/main-app \
    packages/subApp1 \
    packages/subApp2 \
    shared/utils
```