---
title: x-cmd 命令行增强工具
lang: zh
version: v0.9.4
date: "2026-05-11"
github: x-cmd/x-cmd
colWidth: 13
desc: x-cmd 是一个高效的命令行增强工具，支持跨平台使用（Windows、Linux、macOS）。提供 370+ 预置模块，覆盖 git/npm/fs/shell/http/json/regex/tools/docker/k8s 等领域，支持批量操作、自定义指令映射、参数模板和输出管道等高级功能。
tags:
  - CLI 工具
  - 命令行
  - Shell 工具
  - 效率工具
---

## 一眼入口

x-cmd 是一个统一的命令行工具调用层，通过 `x <module> [子命令]` 访问 370+ 预置工具模块。

```bash
# 安装
npm install -g x-cmd

# 基本用法
x <模块> [子命令] [参数]

# 查看帮助
x help <模块>

# 离线文档
x --help
x <模块> -h
```

---

## 核心模块速查

### Git 相关
| 模块 | 用途 | 常用子命令 |
|------|------|-----------|
| git | Git 仓库操作 | clone, pull, push, branch, stash, log, diff, commit |
| gh | GitHub CLI | repo, issue, pr, workflow, release |
| gitb | Git 浏览器 | browse, search, explore |

### 包管理
| 模块 | 用途 | 常用子命令 |
|------|------|-----------|
| npm | Node.js 包管理 | install, update, audit, publish, outdated |
| yarn | Yarn 包管理 | add, remove, upgrade, why |
| pnpm | PNPM 包管理 | add, remove, update, why |
| pip | Python 包管理 | install, list, show, freeze |
| apt | Debian 包管理 | install, remove, update, search |
| brew | macOS 包管理 | install, update, search, info |
| apk | Alpine 包管理 | add, del, update, info |

### 文件操作
| 模块 | 用途 | 常用子命令 |
|------|------|-----------|
| fs | 文件批量操作 | copy, move, rm, mkdir, touch, find, stats |
| cp | 复制 | cp, mv, scp, sync |
| find | 文件查找 | find, locate, which, whereis |

### 网络 & HTTP
| 模块 | 用途 | 常用子命令 |
|------|------|-----------|
| http | HTTP 请求 | get, post, put, delete, download |
| httpget | 文件下载 | get, post, put |
| curl | curl 封装 | get, post, upload, header |
| wget | 文件下载 | get, mirror, recursive |
| dns | DNS 查询 | lookup, trace, dig, nslookup |

### JSON & 数据处理
| 模块 | 用途 | 常用子命令 |
|------|------|-----------|
| jq | JSON 处理（调用 jq 二进制） | open, repl, schema |
| json | JSON 文件操作 | parse, pretty, validate |
| csv | CSV 处理 | parse, convert, filter, join |
| xml | XML 处理 | parse, convert, query |
| yaml | YAML 处理 | parse, dump, validate, convert |
| regex | 正则查找替换 | match, replace, extract, split |

### Shell & 脚本
| 模块 | 用途 | 常用子命令 |
|------|------|-----------|
| shell | 执行 Shell 脚本 | run, exec, source, pipe |
| bash | Bash 执行 | -i, -c, -v |
| awk | 文本处理 | -f, -v, print, if, while |
| sed | 流编辑器 | -i, -e, substitute |

### 容器 & 云
| 模块 | 用途 | 常用子命令 |
|------|------|-----------|
| docker | Docker 容器 | run, images, container, ps, exec, logs, network, info |
| podman | Podman 容器 | run, build, push, ps |

### 数据库
| 模块 | 用途 | 常用子命令 |
|------|------|-----------|
| redis | Redis 客户端 | get, set, hget, hset, keys, expire |
| sqlite | SQLite | query, import, export, backup |
| mysql | MySQL 客户端 | query, backup, import |
| pg | PostgreSQL | query, backup, import |

### AI & LLM
| 模块 | 用途 | 常用子命令 |
|------|------|-----------|
| openai | OpenAI API | chat, completion, embed, image |
| claude | Claude API | chat, completion, embed |
| gemini | Gemini API | chat, completion, embed |
| deepseek | DeepSeek API | chat, completion |
| grok | Grok API | chat, completion |
| aider | Aider AI 编程 | chat, edit, diff |
| codex | Codex AI | chat, edit |
| jina | Jina AI | embed, classify, search |

### 开发工具
| 模块 | 用途 | 常用子命令 |
|------|------|-----------|
| code | 代码编辑 | open, edit, diff, search |
| vscode | VS Code | open, extension, settings |
| go | Go 工具链 | build, test, run, get, mod |
| rust | Rust 工具链 | build, test, run, cargo |
| node | Node.js | run, eval, install, nvm |
| deno | Deno | run, eval, install |
| bun | Bun | run, add, dev, test |

### 系统工具
| 模块 | 用途 | 常用子命令 |
|------|------|-----------|
| env | 环境变量 | get, set, list, export |
| cron | 定时任务 | list, add, remove, edit |
| ssh | SSH 客户端 | connect, key, copy, tunnel |
| tmux | 终端复用 | new, attach, split, kill |
| htop | 系统监控 | top, cpu, mem, process |
| top | 进程监控 | ps, kill, priority |
| free | 内存查看 | -h, -m, -g |
| df | 磁盘查看 | -h, -T, -i |

### 压缩 & 归档
| 模块 | 用途 | 常用子命令 |
|------|------|-----------|
| zip | ZIP 压缩 | compress, extract, list |
| tar | TAR 归档 | create, extract, list |
| unzip | 解压 | -o, -d, -l |
| unarc | 通用解压 | extract, list, info |

### 编码 & 转换
| 模块 | 用途 | 常用子命令 |
|------|------|-----------|
| base64 | Base64 编解码 | encode, decode |
| hash | 哈希计算 | md5, sha1, sha256, sha512 |
| uuid | UUID 生成 | v1, v4, generate |
| iconv | 编码转换 | -f, -t, convert |

### 日期 & 时间
| 模块 | 用途 | 常用子命令 |
|------|------|-----------|
| date | 日期时间 | now, format, parse, diff |
| epoch | Unix 时间戳 | now, convert, parse |

---

## 通用选项

| 选项 | 说明 |
|------|------|
| `-h`, `--help` | 显示帮助 |
| `-v`, `--version` | 显示版本 |
| `--dry-run` | 预览执行（不实际运行） |
| `-q`, `--quiet` | 静默输出 |
| `-d` 变量=值1,值2 | 批量展开 |
| `--concurrency N` | 并发数 |
| `--timeout N` | 超时（秒） |
| `--verbose` | 详细输出 |
| `--json` | JSON 输出 |
| `--table` | 表格输出 |

---

## 高级功能

### 管道操作
```bash
x cmd1 | x cmd2
x git stat | x json pretty
```

### 变量嵌套
```bash
x cp {src}/{file} {dest}/
x git clone {repo} --path={path}
```

### 批量操作
```bash
x fs find . -name "*.log" -exec x rm {}
x -d file=file1.txt,file2.txt x fs copy {file} {dest}
```

### 条件执行
```bash
x build --then "x deploy"
x test --else "x notify"
```

### 配置文件
- 全局配置：`~/.xcmddrc`
- 项目配置：`.xcmddrc`
- 支持别名、默认值、环境变量

---

## 完整模块列表（370+）

### A
abox, advise, agent, aider, alias, api, apk, apt, arg, arp, ascii, asdf, assert, aur, awk

### B
bakman, bfind, boot, brew, browse, btop, build, bun, buse, busybox, bwh

### C
cacert, caddy, cal, cat, cawk, cb, ccal, ccmd, cd, cf, cfgy, chat, choco, cht, claude, claw, clawhub, cleanup, clear, co, coco, code, codex, codi, coin, coincap, colr, cosmo, cowrie, cowsay, cp, cpu, cron, crush, csh, csv, curl, cutt

### D
daemon, date, ddgo, deepseek, demo, deno, depend, df, dict, dingtalk, discord, disk, display, dnf, dns, docker, dos2unix, doubao, dregistry

### E
eclist, elv, emacs, emoji, endlessh, env, envy, epoch

### F
facl, feishu, ff, ffmpeg, fifo, fileage, find, fish, fjo, fkill, font, free, fsiter, fskv, fslock, functor, fzf

### G
gawk, gcal, gcode, gddy, gemini, gg, gh, git, gitb, gitconfig, githook, gl, gm, go, gop, gpg, gpu, gram, grep, grok, groovy, gt, gtb, gx

### H
hash, hashdir, helpapp, hima, history, hn, hok, home, host, hostname, hotkey, htag, html, htop, http, httpget, hua, hub, huggingface, humantime, hw

### I
icmd, iconv, id, ifconfig, install, ip, is, ish

### J
ja, jar, java, jina, jj, jo, jobs, joern, join, jql, json, jsonx, jv, jvm

### K
kafka, kev, keyword, kill, kmod, kube

### L
labs, lambda, last, leet, link, lint, list, llm, lm, lock, log, lookup, lua

### M
mac, mach, mail, man, manja, md, media, meta, miner, ming, mix, mkdir, mkfifo, mm, mod, msg, mterm, mult, mux, mv, mx, mycli

### N
nano, nats, nav, neofetch, net, new, next, nginx, nix, nmap, node, noti, npm, npx, ntfy, num

### O
od, odo, onepassword, open, openai, opencode, openssl, opm, ora, os, osm, otel

### P
pair, pandoc, paste, patch, php, ping, pip, pipx, pki, plan, plank, pm, png, podman, pom, portal, posthog, pov, pq, prom, ps, pt, pty, pulse, pwd, pyenv

### Q
qemu, qing, qr, quantum, query

### R
raku, rand, rbash, rclone, rd, read, redis, reg, release, report, rg, ri, rime, rm, ro, rocket, rss, run, rust, rustup, ryo

### S
scan, sci, scrip, sd, search, semver, seq, ser, sf, sha, share, shell, shift, shuf, sig, signal, size, skip, sleep, sm, smtp, snap, snmp, so, socat, space, split, spot, sql, sqlite, srv, ssh, ssl, stack, start, stat, status, stop, storage, su, sudo, sup, suz, sw, sync, sys

### T
t7, ta, tag, tail, talk, task, tcli, tcp, tdsl, template, term, test, this, th, theme, tidi, time, timeout, tip, title, tl, tldr, tm, tmp, to, tool, top, trace, tracker, trap, trz, tube, tunnel, tv, tw, txt, type, tyyp

### U
ufw, uhy, unarc, uname, uni, update, upty, url, user, uuid

### V
v, var, vbox, vc, vcs, vec, verb, verify, verup, vi, vim, vlm, vpn, vs, vscode, vscodium

### W
w, w3m, wait, wallpaper, watch, wc, web, webtop, wget, wifi, win, wind, wm, wpath, write, ww

### X
x, xbin, xdg, xhttp, xi, xls, xml, xpkg, xq, xray, xselectx, xtrace, xxx

### Y
yaml, yazi, ye, yield, yq

### Z
z, zellij, zfs, zip, zoxide, zplug, zpy, zsh

---

## 版本变更

---
link: https://github.com/x-cmd/x-cmd/releases
desc: 按官方发布说明整理本次跨版本更新中对速查用户最重要的变化。
---

### v0.9.4 (2026-05-11)

- 新增多个 AI 相关模块（doubao, jina, huggingface）
- 完善 Kubernetes 相关功能
- 增强 JSON/YAML 处理能力
- 修复多个稳定性问题

### v0.9.0

- 370+ 预置模块
- 统一命令行接口
- 跨平台支持（Windows、Linux、macOS）
- 批量操作与并发支持