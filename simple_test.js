const fs = require('fs');
const path = require('path');

console.log('=== 简单测试 task_type 功能 ===');

// 1. 检查前端文件是否存在
const frontendFile = path.join(__dirname, 'worklenz-frontend/src/components/task-drawer/shared/info-tab/task-details-form.tsx');
console.log('\n1. 检查前端文件...');
if (fs.existsSync(frontendFile)) {
    console.log('✅ 前端文件存在');
    
    const content = fs.readFileSync(frontendFile, 'utf8');
    
    // 检查关键代码片段
    const checks = {
        'task_type字段': /task_type:\s*string;/,
        'Form.Item task_type': /<Form\.Item\s+name="task_type"/,
        'Select组件': /<Select\s+placeholder="Select task type"/,
        'handleTaskTypeChange函数': /const\s+handleTaskTypeChange\s*=\s*\(taskType:\s*string\)/,
        'TASK_TYPE_CHANGE事件': /SocketEvents\.TASK_TYPE_CHANGE\.toString\(\)/,
        'console.log调试': /console\.log\('=== TASK TYPE CHANGE DEBUG ==='\)/,
    };
    
    console.log('\n2. 检查关键代码片段...');
    for (const [name, regex] of Object.entries(checks)) {
        if (regex.test(content)) {
            console.log(`✅ 找到${name}`);
        } else {
            console.log(`❌ 未找到${name}`);
        }
    }
    
    // 检查task_type引用数量
    const taskTypeCount = (content.match(/task_type/g) || []).length;
    console.log(`\n📊 task_type引用数量: ${taskTypeCount}`);
    
    if (taskTypeCount >= 7) {
        console.log('✅ task_type引用数量正常');
    } else {
        console.log('❌ task_type引用数量不足');
    }
    
} else {
    console.error('❌ 前端文件不存在:', frontendFile);
}

// 2. 检查后端文件
const backendFile = path.join(__dirname, 'worklenz-backend/src/socket.io/commands/on-task-type-change.ts');
console.log('\n3. 检查后端文件...');
if (fs.existsSync(backendFile)) {
    console.log('✅ 后端Socket处理文件存在');
} else {
    console.log('❌ 后端Socket处理文件不存在');
}

// 3. 检查数据库函数文件
const dbFile = path.join(__dirname, 'worklenz-backend/database/sql/4_functions.sql');
console.log('\n4. 检查数据库函数文件...');
if (fs.existsSync(dbFile)) {
    const dbContent = fs.readFileSync(dbFile, 'utf8');
    if (dbContent.includes('handle_task_type_change')) {
        console.log('✅ 数据库函数存在');
    } else {
        console.log('❌ 数据库函数不存在');
    }
} else {
    console.log('❌ 数据库函数文件不存在');
}

console.log('\n=== 测试完成 ===');
