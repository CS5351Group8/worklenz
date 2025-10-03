# Worklenz 本地开发模式

## 🎯 开发模式说明

本项目采用**混合本地开发模式**：
- **数据库**: PostgreSQL (Docker容器)
- **后端**: Node.js (本地运行)
- **前端**: Vite (本地运行)

## 🚀 快速启动

### 一键启动所有服务
```bash
cd /Users/wangyuan/Downloads/Exercise_副本/worklenz
./start-local.sh
```

### 停止所有服务
```bash
cd /Users/wangyuan/Downloads/Exercise_副本/worklenz
./stop-local.sh
```

## 📋 服务地址

启动成功后，访问以下地址：

- **前端应用**: http://localhost:5002
- **后端API**: http://localhost:3000
- **数据库**: localhost:5432

## 🔧 手动启动 (可选)

如果需要单独启动某个服务：

### 1. 启动数据库
```bash
cd /Users/wangyuan/Downloads/Exercise_副本/worklenz
docker compose up -d db
```

### 2. 启动后端
```bash
cd /Users/wangyuan/Downloads/Exercise_副本/worklenz/worklenz-backend
DB_HOST=localhost DB_PORT=5432 DB_USER=postgres DB_PASSWORD=password DB_NAME=worklenz_db npm start
```

### 3. 启动前端
```bash
cd /Users/wangyuan/Downloads/Exercise_副本/worklenz/worklenz-frontend
npm run dev
```

## ✅ 优势

- **开发效率高**: 前后端热重载
- **调试方便**: 直接访问源码
- **避免网络问题**: 不依赖Docker Hub
- **环境简单**: 只需Docker运行数据库
- **性能更好**: 本地运行比容器化更快

## 🛠️ 故障排除

### 端口被占用
```bash
# 查看端口占用
lsof -i :3000
lsof -i :5002
lsof -i :5432

# 强制释放端口
lsof -ti:3000 | xargs kill -9
lsof -ti:5002 | xargs kill -9
```

### 数据库连接问题
```bash
# 检查数据库状态
docker compose ps
docker compose logs db

# 重启数据库
docker compose restart db
```

### 前后端连接问题
- 确保后端运行在 http://localhost:3000
- 确保前端运行在 http://localhost:5002
- 检查浏览器控制台是否有CORS错误

## 📝 开发注意事项

1. **代码修改**: 前后端代码修改会自动热重载
2. **数据库修改**: 需要重启后端服务
3. **环境变量**: 后端环境变量在启动脚本中设置
4. **端口配置**: 前端端口在 `package.json` 中配置为5002

## 🎉 task_type 功能

所有 `task_type` 功能已完全实现：
- ✅ 数据库字段和函数
- ✅ 后端Socket.IO事件处理
- ✅ 前端UI组件和实时更新

启动后即可测试任务类型功能！
