#!/bin/bash

# Worklenz 本地开发模式启动脚本
# 数据库使用Docker，前后端完全本地化

echo "🚀 启动 Worklenz 本地开发模式..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker Desktop"
    exit 1
fi

# 1. 启动数据库 (Docker)
echo "📊 启动数据库..."
cd /Users/wangyuan/Downloads/Exercise_副本/worklenz
docker compose up -d db

# 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 10

# 检查数据库是否就绪
until docker compose exec db pg_isready -U postgres -d worklenz_db > /dev/null 2>&1; do
    echo "⏳ 等待数据库就绪..."
    sleep 2
done
echo "✅ 数据库已就绪"

# 2. 启动后端 (本地)
echo "🔧 启动后端服务..."
cd /Users/wangyuan/Downloads/Exercise_副本/worklenz/worklenz-backend

# 设置环境变量并启动后端
DB_HOST=localhost DB_PORT=5432 DB_USER=postgres DB_PASSWORD=password DB_NAME=worklenz_db DB_MAX_CLIENTS=20 npm start &
BACKEND_PID=$!

# 等待后端启动
echo "⏳ 等待后端启动..."
sleep 5

# 检查后端是否就绪
until curl -s http://localhost:3000/csrf-token > /dev/null 2>&1; do
    echo "⏳ 等待后端就绪..."
    sleep 2
done
echo "✅ 后端已就绪"

# 3. 启动前端 (本地)
echo "🎨 启动前端服务..."
cd /Users/wangyuan/Downloads/Exercise_副本/worklenz/worklenz-frontend
npm run dev &
FRONTEND_PID=$!

# 等待前端启动
echo "⏳ 等待前端启动..."
sleep 5

# 检查前端是否就绪
until curl -s http://localhost:5002 > /dev/null 2>&1; do
    echo "⏳ 等待前端就绪..."
    sleep 2
done
echo "✅ 前端已就绪"

echo ""
echo "🎉 Worklenz 本地开发模式启动完成！"
echo ""
echo "📋 服务状态："
echo "   • 数据库: PostgreSQL (Docker) - localhost:5432"
echo "   • 后端: Node.js (本地) - http://localhost:3000"
echo "   • 前端: Vite (本地) - http://localhost:5002"
echo ""
echo "🔗 访问地址："
echo "   • 前端应用: http://localhost:5002"
echo "   • 后端API: http://localhost:3000"
echo ""
echo "🛑 停止服务："
echo "   按 Ctrl+C 停止所有服务"
echo ""

# 保存进程ID到文件，方便停止
echo $BACKEND_PID > /tmp/worklenz_backend.pid
echo $FRONTEND_PID > /tmp/worklenz_frontend.pid

# 等待用户中断
trap 'echo "🛑 正在停止服务..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; docker compose down; rm -f /tmp/worklenz_*.pid; echo "✅ 服务已停止"; exit 0' INT

# 保持脚本运行
wait
