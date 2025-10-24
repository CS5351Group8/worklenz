#!/bin/bash

echo "🧪 开始测试账户设置流程..."
echo ""

# 1. 测试健康检查
echo "1️⃣ 测试后端健康检查..."
health_response=$(curl -s http://localhost:3000/public/health)
if [ $? -eq 0 ]; then
    echo "✅ 后端健康检查通过: $health_response"
else
    echo "❌ 后端健康检查失败"
    exit 1
fi

echo ""

# 2. 获取 CSRF token
echo "2️⃣ 获取 CSRF token..."
csrf_response=$(curl -s http://localhost:3000/csrf-token)
if [ $? -eq 0 ]; then
    echo "✅ CSRF token 获取成功"
    csrf_token=$(echo $csrf_response | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
    echo "CSRF Token: $csrf_token"
else
    echo "❌ CSRF token 获取失败"
    exit 1
fi

echo ""

# 3. 测试调查问卷 API
echo "3️⃣ 测试调查问卷 API..."
survey_response=$(curl -s http://localhost:3000/api/v1/surveys/account-setup)
if [ $? -eq 0 ]; then
    echo "✅ 调查问卷 API 响应成功"
    echo "响应内容: $survey_response"
else
    echo "❌ 调查问卷 API 失败"
fi

echo ""

# 4. 模拟账户设置请求
echo "4️⃣ 模拟账户设置请求..."
setup_data='{
    "project_name": "Test Project",
    "key": "TP",
    "team_members": []
}'

setup_response=$(curl -s -X POST http://localhost:3000/api/v1/settings/setup \
    -H "Content-Type: application/json" \
    -H "X-CSRF-Token: $csrf_token" \
    -d "$setup_data")

if [ $? -eq 0 ]; then
    echo "✅ 账户设置请求发送成功"
    echo "响应内容: $setup_response"
else
    echo "❌ 账户设置请求失败"
fi

echo ""
echo "🎉 测试完成！"
