const fs = require('fs');
const path = require('path');

console.log('=== 前端代码调试分析 ===\n');

// 1. 检查前端文件是否存在
const frontendFile = '/Users/wangyuan/Downloads/Exercise_副本/worklenz/worklenz-frontend/src/components/task-drawer/shared/info-tab/task-details-form.tsx';

console.log('1. 检查前端文件...');
if (fs.existsSync(frontendFile)) {
  console.log('✅ 前端文件存在');
  
  const content = fs.readFileSync(frontendFile, 'utf8');
  
  // 2. 检查关键代码片段
  console.log('\n2. 检查关键代码片段...');
  
  // 检查task_type字段定义
  if (content.includes('task_type')) {
    console.log('✅ 找到task_type字段');
  } else {
    console.log('❌ 未找到task_type字段');
  }
  
  // 检查Form.Item
  if (content.includes('<Form.Item name="task_type"')) {
    console.log('✅ 找到Form.Item task_type');
  } else {
    console.log('❌ 未找到Form.Item task_type');
  }
  
  // 检查Select组件
  if (content.includes('<Select')) {
    console.log('✅ 找到Select组件');
  } else {
    console.log('❌ 未找到Select组件');
  }
  
  // 检查onChange处理
  if (content.includes('handleTaskTypeChange')) {
    console.log('✅ 找到handleTaskTypeChange函数');
  } else {
    console.log('❌ 未找到handleTaskTypeChange函数');
  }
  
  // 检查Socket事件
  if (content.includes('TASK_TYPE_CHANGE')) {
    console.log('✅ 找到TASK_TYPE_CHANGE事件');
  } else {
    console.log('❌ 未找到TASK_TYPE_CHANGE事件');
  }
  
  // 3. 分析具体问题
  console.log('\n3. 分析具体问题...');
  
  // 检查initialValues
  const initialValuesMatch = content.match(/initialValues\s*=\s*{[\s\S]*?}/);
  if (initialValuesMatch) {
    console.log('📋 initialValues内容:');
    console.log(initialValuesMatch[0]);
    
    if (initialValuesMatch[0].includes('task_type')) {
      console.log('⚠️  警告: initialValues中包含task_type，可能覆盖setFieldsValue');
    } else {
      console.log('✅ initialValues中不包含task_type');
    }
  }
  
  // 检查setFieldsValue
  const setFieldsValueMatch = content.match(/setFieldsValue\s*\([\s\S]*?}\)/);
  if (setFieldsValueMatch) {
    console.log('📋 setFieldsValue内容:');
    console.log(setFieldsValueMatch[0]);
    
    if (setFieldsValueMatch[0].includes('task_type')) {
      console.log('✅ setFieldsValue中包含task_type');
    } else {
      console.log('❌ setFieldsValue中不包含task_type');
    }
  }
  
  // 检查useEffect
  const useEffectMatch = content.match(/useEffect\s*\([\s\S]*?}, \[[\s\S]*?\]\)/);
  if (useEffectMatch) {
    console.log('📋 useEffect内容:');
    console.log(useEffectMatch[0]);
  }
  
} else {
  console.log('❌ 前端文件不存在');
}

// 4. 检查构建后的文件
console.log('\n4. 检查构建后的文件...');
const buildFile = '/Users/wangyuan/Downloads/Exercise_副本/worklenz/worklenz-frontend/build/assets/js/task-drawer-*.js';

console.log('📋 构建文件路径:', buildFile);

// 5. 检查Docker容器中的文件
console.log('\n5. 检查Docker容器状态...');
const { execSync } = require('child_process');

try {
  const containerStatus = execSync('docker ps --filter name=worklenz_frontend --format "table {{.Names}}\t{{.Status}}"', { encoding: 'utf8' });
  console.log('📋 前端容器状态:');
  console.log(containerStatus);
} catch (error) {
  console.log('❌ 无法检查容器状态:', error.message);
}

console.log('\n=== 调试分析完成 ===');
