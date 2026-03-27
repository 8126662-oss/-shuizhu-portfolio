const fs = require('fs');
const path = require('path');

console.log('=== OpenClaw 配置检查 ===\n');

// 检查配置文件
const configPath = path.join(process.env.USERPROFILE, '.openclaw', 'openclaw.json');
const modelsPath = path.join(process.env.USERPROFILE, '.openclaw', 'agents', 'main', 'agent', 'models.json');

console.log('1. 检查配置文件存在性:');
console.log(`   openclaw.json: ${fs.existsSync(configPath) ? '✅ 存在' : '❌ 不存在'}`);
console.log(`   models.json: ${fs.existsSync(modelsPath) ? '✅ 存在' : '❌ 不存在'}`);

// 读取并分析配置文件
if (fs.existsSync(configPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('\n2. 配置文件分析:');
    console.log(`   Tools Profile: ${config.tools?.profile || '未设置'}`);
    console.log(`   Moonshot API Base URL: ${config.models?.providers?.moonshot?.baseUrl || '未设置'}`);
    console.log(`   Feishu 配置: ${config.channels?.feishu?.enabled ? '✅ 已启用' : '❌ 未启用'}`);
    
    if (config.tools?.exec?.applyPatch) {
      console.log('   Apply Patch 配置:');
      console.log(`     Enabled: ${config.tools.exec.applyPatch.enabled}`);
      console.log(`     Workspace Only: ${config.tools.exec.applyPatch.workspaceOnly}`);
    } else {
      console.log('   Apply Patch 配置: ❌ 未设置');
    }
  } catch (error) {
    console.log('   配置文件解析错误:', error.message);
  }
}

// 读取模型配置
if (fs.existsSync(modelsPath)) {
  try {
    const models = JSON.parse(fs.readFileSync(modelsPath, 'utf8'));
    console.log('\n3. 模型配置分析:');
    console.log(`   Moonshot 模型: ${models.providers?.moonshot?.models?.map(m => m.id).join(', ') || '未设置'}`);
  } catch (error) {
    console.log('   模型配置解析错误:', error.message);
  }
}

console.log('\n=== 配置建议 ===');
console.log('1. 修复 Apply Patch 异常:');
console.log('   在 openclaw.json 中添加以下配置:');
console.log('   "tools": {');
console.log('     "profile": "coding",');
console.log('     "exec": {');
console.log('       "applyPatch": {');
console.log('         "enabled": true,');
console.log('         "workspaceOnly": true');
console.log('       }');
console.log('     }');
console.log('   }');

console.log('\n2. 解决 LLM 超时问题:');
console.log('   在 openclaw.json 中添加超时配置:');
console.log('   "models": {');
console.log('     "providers": {');
console.log('       "moonshot": {');
console.log('         "baseUrl": "https://api.moonshot.cn/v1",');
console.log('         "timeoutSeconds": 300,  // 5分钟超时');
console.log('         "models": [');
console.log('           {');
console.log('             "id": "kimi-k2.5",');
console.log('             "name": "Kimi K2.5",');
console.log('             "reasoning": false,');
console.log('             "input": ["text", "image"],');
console.log('             "contextWindow": 256000,');
console.log('             "maxTokens": 8192');
console.log('           }');
console.log('         ]');
console.log('       }');
console.log('     }');
console.log('   }');

console.log('\n3. 验证网络连接:');
console.log('   运行 test-net.js 检查 DNS 解析和网络连接');

console.log('\n=== 完成 ===');
