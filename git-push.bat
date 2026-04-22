@echo off
chcp 65001 >nul
title Git 一键上传工具

echo ╔══════════════════════════════════════╗
echo ║       Resume-Agent  Git 上传工具     ║
echo ╚══════════════════════════════════════╝
echo.

:: 切换到项目目录
cd /d "d:\Claude code\resume-agent"

:: 检查 git 状态
echo [1/5] 检查项目状态...
git status
echo.

:: 询问提交信息
set /p COMMIT_MSG=请输入提交信息（直接回车默认为 "update"）: 
if "%COMMIT_MSG%"=="" set COMMIT_MSG=update

:: 添加所有文件
echo.
echo [2/5] 添加所有修改...
git add .

:: 提交
echo.
echo [3/5] 提交修改：%COMMIT_MSG%
git commit -m "%COMMIT_MSG%"

:: 配置代理
echo.
echo [4/5] 配置代理（端口 7897）...
git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897

:: 推送
echo.
echo [5/5] 推送到 GitHub...
git push origin main

echo.
if %errorlevel%==0 (
    echo ✅ 推送成功！
    echo 🔗 https://github.com/Tongsz315/resume-agent
) else (
    echo ❌ 推送失败，请检查网络或代理设置。
    echo 💡 提示：确认代理软件已开启，端口为 7897
)

echo.
pause
