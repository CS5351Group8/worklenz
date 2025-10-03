const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function testAccountSetup() {
    try {
        console.log('🧪 开始测试账户设置流程...\n');

        // 1. 测试健康检查
        console.log('1️⃣ 测试后端健康检查...');
        const healthResponse = await axios.get(`${API_BASE}/public/health`);
        console.log('✅ 后端健康检查通过:', healthResponse.data);

        // 2. 获取 CSRF token
        console.log('\n2️⃣ 获取 CSRF token...');
        const csrfResponse = await axios.get(`${API_BASE}/csrf-token`);
        console.log('✅ CSRF token 获取成功');

        // 3. 测试调查问卷 API
        console.log('\n3️⃣ 测试调查问卷 API...');
        try {
            const surveyResponse = await axios.get(`${API_BASE}/api/v1/surveys/account-setup`);
            console.log('✅ 调查问卷 API 响应:', surveyResponse.data);
        } catch (error) {
            console.log('❌ 调查问卷 API 错误:', error.response?.data || error.message);
        }

        // 4. 模拟账户设置请求
        console.log('\n4️⃣ 模拟账户设置请求...');
        const setupData = {
            project_name: 'Test Project',
            key: 'TP',
            team_members: []
        };

        try {
            const setupResponse = await axios.post(`${API_BASE}/api/v1/settings/setup`, setupData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfResponse.data.csrfToken
                }
            });
            console.log('✅ 账户设置成功:', setupResponse.data);
        } catch (error) {
            console.log('❌ 账户设置失败:');
            console.log('状态码:', error.response?.status);
            console.log('错误信息:', error.response?.data);
            console.log('完整错误:', error.message);
        }

    } catch (error) {
        console.error('❌ 测试过程中发生错误:', error.message);
    }
}

// 运行测试
testAccountSetup();
