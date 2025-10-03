#!/bin/bash

# Worklenz 本地开发模式停止脚本

echo "🛑 停止 Worklenz 本地开发模式..."

# 停止前端和后端进程
if [ -f /tmp/worklenz_frontend.pid ]; then
    FRONTEND_PID=$(cat /tmp/worklenz_frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "🛑 停止前端服务 (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
    fi
    rm -f /tmp/worklenz_frontend.pid
fi

if [ -f /tmp/worklenz_backend.pid ]; then
    BACKEND_PID=$(cat /tmp/worklenz_backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo "🛑 停止后端服务 (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
    fi
    rm -f /tmp/worklenz_backend.pid
fi

# 停止Docker数据库
echo "🛑 停止数据库服务..."
cd /Users/wangyuan/Downloads/Exercise_副本/worklenz
docker compose down

# 清理端口占用
echo "🧹 清理端口占用..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5002 | xargs kill -9 2>/dev/null || true

echo "✅ 所有服务已停止"
