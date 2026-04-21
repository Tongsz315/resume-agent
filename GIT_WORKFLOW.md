# Git 操作流程手册

> 本手册记录 resume-agent 项目的 Git 完整操作流程，以备不时之需。

---

## 一、项目信息

| 项目 | 内容 |
|------|------|
| 本地路径 | `d:/Claude code/resume-agent` |
| GitHub 地址 | `https://github.com/Tongsz315/resume-agent` |
| 用户名 | `Tongsz315` |
| 分支 | `main` |
| 代理端口 | `7897` |

---

## 二、日常推送流程

### 1. 进入项目目录
```powershell
cd "d:/Claude code/resume-agent"
```

### 2. 查看当前状态
```powershell
git status
```

### 3. 添加所有修改
```powershell
git add .
```

### 4. 提交修改
```powershell
git commit -m "你的提交信息，例如：feat: 添加新功能"
```

### 5. 配置代理（如果网络不通）
```powershell
git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897
```

### 6. 推送到 GitHub
```powershell
git push origin main
```

### 7. 清除代理（可选）
```powershell
git config --global --unset http.proxy
git config --global --unset https.proxy
```

---

## 三、一键推送命令

如果代理已开启，可以直接复制粘贴以下完整命令：

```powershell
cd "d:/Claude code/resume-agent"; git add .; git commit -m "update"; git config --global http.proxy http://127.0.0.1:7897; git config --global https.proxy http://127.0.0.1:7897; git push origin main
```

---

## 四、常见问题处理

### 问题 1：fatal: not a git repository
**原因**：不在正确的目录下执行 git 命令  
**解决**：
```powershell
cd "d:/Claude code/resume-agent"
git status
```

### 问题 2：Failed to connect to github.com port 443
**原因**：GitHub 被墙，需要配置代理  
**解决**：
```powershell
git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897
```

### 问题 3：Repository not found
**原因**：远程仓库地址错误或仓库不存在  
**解决**：
```powershell
# 查看当前远程地址
git remote -v

# 修改远程地址（如果用户名或仓库名错误）
git remote set-url origin https://github.com/Tongsz315/resume-agent.git
```

### 问题 4：rejected - fetch first
**原因**：远程仓库有本地没有的内容  
**解决**：
```powershell
# 先拉取远程内容
git pull origin main --allow-unrelated-histories

# 然后再推送
git push origin main
```

### 问题 5：代理端口不对
**解决**：根据实际情况修改端口号
```powershell
# 常见代理端口：7890(Clash) 10809(V2Ray) 7897(其他)
git config --global http.proxy http://127.0.0.1:你的端口
git config --global https.proxy http://127.0.0.1:你的端口
```

---

## 五、常用 Git 命令速查

| 命令 | 作用 |
|------|------|
| `git status` | 查看当前状态 |
| `git log --oneline -5` | 查看最近 5 条提交 |
| `git add .` | 添加所有修改到暂存区 |
| `git add 文件名` | 添加指定文件 |
| `git commit -m "信息"` | 提交修改 |
| `git push origin main` | 推送到远程 main 分支 |
| `git pull origin main` | 拉取远程更新 |
| `git remote -v` | 查看远程仓库地址 |
| `git remote set-url origin 地址` | 修改远程仓库地址 |

---

## 六、提交信息规范（建议）

| 前缀 | 含义 | 示例 |
|------|------|------|
| `feat:` | 新功能 | `feat: 添加文件上传功能` |
| `fix:` | 修复 bug | `fix: 修复解析失败问题` |
| `docs:` | 文档更新 | `docs: 更新 README` |
| `style:` | 代码格式 | `style: 格式化代码` |
| `refactor:` | 重构 | `refactor: 优化分析逻辑` |
| `chore:` | 杂项 | `chore: 更新依赖` |

---

## 七、网络诊断命令

如果推送失败，可以用以下命令诊断网络：

```powershell
# 测试是否能 ping 通 GitHub
ping github.com

# 测试 443 端口是否通
Test-NetConnection -ComputerName github.com -Port 443

# 查看当前代理配置
git config --global http.proxy
git config --global https.proxy
```

---

*最后更新：2025-04-21*
