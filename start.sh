#!/bin/bash
echo "========================================"
echo "   简历分析智能体 - 安装脚本"
echo "========================================"
echo ""

echo "[1/3] 安装根目录依赖..."
npm install

echo ""
echo "[2/3] 安装前端依赖..."
cd client
npm install
cd ..

echo ""
echo "[3/3] 安装后端依赖..."
cd server
npm install
cd ..

echo ""
echo "========================================"
echo "   安装完成！"
echo "========================================"
echo ""
echo "请配置 API Key："
echo "  1. 打开 server/.env 文件"
echo "  2. 将 GLM_API_KEY=your_api_key_here"
echo "     替换为你的智谱 API Key"
echo ""
echo "启动开发服务器："
echo "  npm run dev"
echo ""
