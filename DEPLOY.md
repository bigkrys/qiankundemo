# 部署指南

## 环境要求

- Docker 20.10.0 或更高版本
- Docker Compose 2.0.0 或更高版本
- Node.js 18.x (仅用于本地开发)
- 至少 2GB 可用内存
- 至少 10GB 可用磁盘空间

## 部署步骤

### 1. 准备工作

```bash
# 克隆代码仓库
git clone <repository-url>
cd qiankun

# 确保在主分支上
git checkout main
```

### 2. 构建和启动

```bash
# 使用 Docker Compose 构建和启动
docker-compose up -d --build

# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 3. 验证部署

访问以下地址验证部署是否成功：

- 主应用：http://localhost/
- 子应用1：http://localhost/sub-app1/
- 子应用2：http://localhost/sub-app2/

## 维护命令

```bash
# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 更新部署
git pull
docker-compose up -d --build

# 查看容器日志
docker-compose logs -f
```

## 故障排查

1. 如果页面无法访问：
   - 检查容器状态：`docker-compose ps`
   - 检查日志：`docker-compose logs -f`
   - 确认端口是否被占用：`netstat -an | grep 80`

2. 如果子应用加载失败：
   - 检查 nginx 配置是否正确
   - 检查浏览器控制台是否有跨域错误
   - 验证子应用的构建产物是否正确

3. 如果静态资源加载失败：
   - 检查 nginx 的静态资源配置
   - 确认文件权限是否正确
   - 检查资源路径是否正确

## 备份策略

1. 定期备份以下内容：
   - 配置文件
   - 构建产物
   - 数据库（如果有）

2. 备份命令：
```bash
# 备份配置文件
tar -czf config-backup-$(date +%Y%m%d).tar.gz *.conf

# 备份构建产物
tar -czf dist-backup-$(date +%Y%m%d).tar.gz packages/*/dist
```

## 回滚流程

1. 使用 Git 回滚到上一个稳定版本：
```bash
git reset --hard <commit-hash>
```

2. 重新构建和部署：
```bash
docker-compose down
docker-compose up -d --build
```

## 监控和告警

建议配置以下监控：
- 容器状态监控
- 服务可用性监控
- 资源使用监控（CPU、内存、磁盘）
- 错误日志监控

## 安全建议

1. 始终使用最新的基础镜像
2. 定期更新依赖包
3. 配置适当的防火墙规则
4. 使用 HTTPS（需要配置 SSL 证书）
5. 设置适当的文件权限

## 性能优化

1. 启用 Nginx Gzip 压缩
2. 配置浏览器缓存
3. 使用 CDN 加速静态资源
4. 优化 Docker 镜像大小
5. 配置合适的 Node.js 内存限制 


tar -czf qiankun-deploy.tar.gz \
    --exclude='*/node_modules' \
    --exclude='*/.git' \
    --exclude='*/dist' \
    --exclude='*/.DS_Store' \
    Dockerfile \
    docker-compose.yml \
    nginx.conf \
    package.json \
    package-lock.json \
    lerna.json \
    packages/main-app \
    packages/sub-app1 \
    packages/sub-app2 \
    shared/utils \
    docker-entrypoint.sh \
    .env

    tar -czf qiankun-deploy.tar.gz --exclude='*/node_modules' --exclude='*/.git' --exclude='*/dist' --exclude='*/.DS_Store' Dockerfile docker-compose.yml nginx.conf package.json package-lock.json lerna.json packages/main-app packages/sub-app1 packages/sub-app2 shared/utils docker-entrypoint.sh .env