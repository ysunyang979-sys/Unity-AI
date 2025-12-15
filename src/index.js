/**
 * Unity AI 代码助手 - ChatGPT 风格
 */

// 只保留 32B 模型
const MODEL = '@cf/qwen/qwen2.5-coder-32b-instruct';

// 内置完整系统提示词
const SYSTEM_PROMPT = `# Role: Unity 资深架构师与代码叙事者

## ⚠️ 回复规则（最重要）
- 禁止说"好的"、"我明白了"、"请告诉我"等废话
- 直接针对用户的具体需求进行分析和追问
- 用户说"背包系统"，你就直接分析背包系统并追问相关问题

## Profile
- 拥有 10 年经验的 Unity 专家，兼具技术深度与教学能力。
- Core Philosophy: 你极度排斥"上帝类 (God Class)"。你坚信代码应当遵循 SOLID 原则。
- Special Ability: 你擅长用"讲故事"或"生动的比喻"来解释晦涩的代码逻辑。

## ⛔ 核心铁律
1. 非 OOK 不写代码：在用户输入触发词（"OOK", "ook", "OK", "开始"）之前，禁止输出完整代码。
2. 拒绝巨型脚本：交付代码时，必须根据功能模块化拆分文件。
3. 防御性编程：交付的代码必须包含空值检查 (?.) 和必要的 RequireComponent。

## 🌟 功能开发工作流

用户提出需求后，直接进行以下步骤：

### 第一阶段：需求分析（直接开始，不要废话）
直接针对用户说的功能：
1. 分析核心玩法
2. 提出 2-3 个与该功能相关的架构问题
3. 给出模块化拆分建议

### 第二阶段：确认与调整
根据用户反馈调整设计。

### 第三阶段：执行与交付（触发词 "OOK"）
收到 OOK 后输出代码，格式要求严格：
1. 每个脚本必须用三个反引号包裹：\`\`\`csharp 开头，\`\`\` 结尾
2. 顶部第一行注明 // 文件名.cs
3. 关键逻辑加中文注释
4. 末尾说明挂载方式

重要：所有C#代码必须在代码块内，不能有代码在代码块外面！

## 📖 代码叙事者模式

当用户发送代码求解释时，用"讲故事"方式解释，不要逐行翻译语法。

始终用中文回答。`;

async function hashPass(p) {
  const d = new TextEncoder().encode(p + 'unity2024');
  const h = await crypto.subtle.digest('SHA-256', d);
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function html() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Unity AI 代码助手</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" id="hlcss">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/csharp.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/11.1.1/marked.min.js"></script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{
--bg:#0f0f0f;--bg2:#171717;--bg3:#1f1f1f;--bgH:#2a2a2a;
--tx:#fafafa;--tx2:#a1a1aa;--tx3:#71717a;
--bd:rgba(255,255,255,.08);--acc:#10b981;--acc2:#059669;--acc-glow:rgba(16,185,129,.25);
--purple:#8b5cf6;--purple-glow:rgba(139,92,246,.25);
--shadow:0 4px 24px rgba(0,0,0,0.4);
--glass:rgba(255,255,255,.03);
}
.light{
--bg:#f8fafc;--bg2:#f1f5f9;--bg3:#fff;--bgH:#e2e8f0;
--tx:#0f172a;--tx2:#475569;--tx3:#94a3b8;
--bd:rgba(0,0,0,.08);--shadow:0 4px 24px rgba(0,0,0,0.08);
--glass:rgba(255,255,255,.7);
}
body{font-family:'Inter',system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--tx);height:100vh;overflow:hidden;transition:all .3s ease}
::selection{background:var(--acc);color:#fff}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--bd);border-radius:10px}
::-webkit-scrollbar-thumb:hover{background:var(--tx3)}

.app{display:flex;height:100vh}

/* 侧边栏 - 玻璃拟态 */
.side{width:280px;background:var(--bg2);display:flex;flex-direction:column;border-right:1px solid var(--bd);transition:all .3s cubic-bezier(.4,0,.2,1);flex-shrink:0;backdrop-filter:blur(20px)}
.side.collapsed{width:0;overflow:hidden;border:none;padding:0}
@media(max-width:768px){.side{position:fixed;z-index:200;height:100%;transform:translateX(-100%)}.side.open{transform:translateX(0)}.side.collapsed{transform:translateX(-100%);width:280px}}
.side-hd{padding:20px;border-bottom:1px solid var(--bd)}
.new-btn{width:100%;padding:14px 18px;background:linear-gradient(135deg,var(--acc),var(--acc2));border:none;border-radius:14px;color:#fff;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .25s;box-shadow:0 4px 16px var(--acc-glow)}
.new-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px var(--acc-glow)}
.new-btn:active{transform:translateY(0)}
.new-btn svg{stroke:#fff}

.hist{flex:1;overflow-y:auto;padding:12px}
.h-grp{margin-bottom:20px}
.h-lbl{padding:10px 14px;font-size:11px;font-weight:700;color:var(--tx3);text-transform:uppercase;letter-spacing:1px}
.h-itm{padding:14px 16px;border-radius:12px;font-size:13px;color:var(--tx2);cursor:pointer;display:flex;align-items:center;gap:12px;transition:all .2s;margin-bottom:4px;position:relative}
.h-itm:hover{background:var(--glass);color:var(--tx);border:1px solid var(--bd)}
.h-itm.act{background:var(--glass);color:var(--tx);border:1px solid var(--bd)}
.h-itm svg{width:18px;height:18px;opacity:.5;flex-shrink:0}
.h-txt{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.h-del{opacity:0;padding:8px;border-radius:8px;transition:all .2s;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:transparent;border:none;color:var(--tx3);font-size:16px;position:relative;z-index:10}
.h-itm:hover .h-del{opacity:1}
.h-del:hover{background:rgba(239,68,68,.15);color:#ef4444}

.side-ft{padding:20px;border-top:1px solid var(--bd)}
.user{display:flex;align-items:center;gap:14px;padding:14px;border-radius:14px;cursor:pointer;transition:all .2s;background:var(--glass);border:1px solid transparent}
.user:hover{border-color:var(--bd);background:var(--bgH)}
.ava{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--acc),var(--acc2));display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff;transition:all .3s;position:relative;overflow:hidden}
.ava:hover{transform:scale(1.05)}
.ava img{width:100%;height:100%;object-fit:cover;border-radius:12px}
.u-info{flex:1;overflow:hidden}
.u-nm{font-size:14px;font-weight:600;margin-bottom:2px}
.u-em{font-size:12px;color:var(--tx3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* 主区域 */
.main{flex:1;display:flex;flex-direction:column;min-width:0;background:linear-gradient(180deg,var(--bg) 0%,var(--bg2) 100%)}
.hdr{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid var(--bd);background:var(--glass);backdrop-filter:blur(20px);position:sticky;top:0;z-index:100}
.hdr-l{display:flex;align-items:center;gap:16px}
.menu{width:42px;height:42px;border-radius:12px;border:1px solid var(--bd);background:var(--glass);color:var(--tx);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.menu:hover{background:var(--bgH);border-color:var(--acc);color:var(--acc)}
.menu svg{width:20px;height:20px}
.new-chat-btn{width:42px;height:42px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;box-shadow:0 4px 16px var(--acc-glow)}
.new-chat-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px var(--acc-glow)}
.hdr-title{font-size:18px;font-weight:700;background:linear-gradient(135deg,var(--acc),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hdr-r{display:flex;gap:10px}
.icon-btn{width:42px;height:42px;border-radius:12px;border:1px solid var(--bd);background:var(--glass);color:var(--tx);cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s}
.icon-btn:hover{background:var(--bgH);border-color:var(--acc);transform:translateY(-2px)}

/* 聊天区 */
.chat{flex:1;overflow-y:auto;scroll-behavior:smooth}
.welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:48px;text-align:center}
.w-icon{width:88px;height:88px;background:linear-gradient(135deg,var(--acc),var(--acc2));border-radius:28px;display:flex;align-items:center;justify-content:center;margin-bottom:32px;box-shadow:0 12px 40px var(--acc-glow);animation:float 6s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.welcome h1{font-size:32px;font-weight:800;margin-bottom:16px;background:linear-gradient(135deg,var(--acc),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.welcome p{color:var(--tx2);font-size:16px;max-width:500px;line-height:1.8}
.welcome strong{color:var(--acc);font-weight:600}
.quick{display:flex;flex-wrap:wrap;gap:12px;margin-top:36px;justify-content:center}
.q-btn{padding:14px 24px;border-radius:50px;border:1px solid var(--bd);background:var(--glass);color:var(--tx2);font-size:14px;font-weight:500;cursor:pointer;transition:all .25s;backdrop-filter:blur(10px);display:flex;align-items:center;gap:8px}
.q-btn:hover{border-color:var(--acc);color:var(--tx);background:var(--bgH);transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.2)}
.q-btn svg{width:16px;height:16px}

.msgs{max-width:820px;margin:0 auto;padding:32px 24px}
.msg{padding:28px 0;animation:slideIn .4s ease}
@keyframes slideIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.msg+.msg{border-top:1px solid var(--bd)}
.msg-row{display:flex;gap:18px}
.msg-av{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;font-weight:600}
.msg.user .msg-av{background:linear-gradient(135deg,var(--purple),#a855f7);color:#fff;box-shadow:0 4px 16px var(--purple-glow)}
.msg.ai .msg-av{background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;box-shadow:0 4px 16px var(--acc-glow)}
.msg-ct{flex:1;min-width:0;padding-top:4px}
.msg-hd{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.msg-nm{font-weight:700;font-size:15px}
.msg-bd{font-size:15px;line-height:1.85;color:var(--tx2)}
.msg-bd p{margin-bottom:14px}
.msg-bd p:last-child{margin-bottom:0}
.msg-bd ul,.msg-bd ol{margin:14px 0 14px 28px}
.msg-bd li{margin-bottom:8px}
.msg-bd strong{font-weight:600;color:var(--acc)}
.msg-bd code{font-family:'JetBrains Mono',Menlo,Consolas,monospace;background:var(--bg3);padding:4px 10px;border-radius:8px;font-size:.88em;color:var(--acc);border:1px solid var(--bd)}
.msg-bd pre{background:#0d0d0d!important;border-radius:16px;margin:20px 0;overflow:hidden;box-shadow:var(--shadow);border:1px solid var(--bd)}
.msg-bd pre code{display:block;padding:20px!important;font-size:13px!important;line-height:1.7;overflow-x:auto;background:transparent!important;color:#e4e4e7!important;border:none}
.code-hd{display:flex;justify-content:space-between;align-items:center;padding:12px 20px;background:#1a1a1a;font-size:12px;color:#71717a;border-bottom:1px solid rgba(255,255,255,.05)}
.copy-btn{padding:8px 16px;background:rgba(255,255,255,.08);border:none;border-radius:8px;color:#a1a1aa;font-size:12px;font-weight:500;cursor:pointer;transition:all .2s}
.copy-btn:hover{background:var(--acc);color:#fff}

.typing{display:flex;gap:6px;padding:8px 0}
.typing span{display:block;width:10px;height:10px;background:var(--acc);border-radius:50%;animation:bounce 1.4s infinite}
.typing span:nth-child(1){animation-delay:-.32s}
.typing span:nth-child(2){animation-delay:-.16s}
@keyframes bounce{0%,80%,100%{opacity:.4;transform:scale(.8)}40%{opacity:1;transform:scale(1.1)}}

/* 输入区 */
.inp-area{padding:24px;background:linear-gradient(transparent,var(--bg2) 30%)}
.inp-wrap{max-width:820px;margin:0 auto}
.inp-box{display:flex;align-items:flex-end;gap:14px;background:var(--bg3);border:2px solid var(--bd);border-radius:20px;padding:16px 20px;transition:all .25s;box-shadow:var(--shadow)}
.inp-box:focus-within{border-color:var(--acc);box-shadow:0 0 0 4px var(--acc-glow)}
.inp-box textarea{flex:1;background:transparent;border:none;color:var(--tx);font-size:15px;line-height:1.6;resize:none;max-height:200px;font-family:inherit}
.inp-box textarea:focus{outline:none}
.inp-box textarea::placeholder{color:var(--tx3)}
.send{width:46px;height:46px;border-radius:14px;border:none;background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .25s;box-shadow:0 4px 16px var(--acc-glow)}
.send:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 8px 24px var(--acc-glow)}
.send:disabled{background:var(--bg3);color:var(--tx3);cursor:not-allowed;box-shadow:none;transform:none}
.send svg{width:20px;height:20px}
.hint{text-align:center;font-size:12px;color:var(--tx3);margin-top:14px}

/* 弹窗 */
.modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(12px);z-index:1000;align-items:center;justify-content:center;padding:24px}
.modal.on{display:flex}
.m-box{background:var(--bg2);border:1px solid var(--bd);border-radius:28px;padding:32px;width:100%;max-width:400px;max-height:85vh;overflow-y:auto;box-shadow:0 32px 64px rgba(0,0,0,.5);animation:modalIn .4s cubic-bezier(.4,0,.2,1)}
@keyframes modalIn{from{opacity:0;transform:scale(.92) translateY(24px)}to{opacity:1;transform:scale(1) translateY(0)}}
.m-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}
.m-hd h3{font-size:20px;font-weight:700;display:flex;align-items:center;gap:12px}
.m-close{width:40px;height:40px;border-radius:50%;border:none;background:var(--bg3);color:var(--tx3);cursor:pointer;font-size:18px;transition:all .25s;display:flex;align-items:center;justify-content:center}
.m-close:hover{background:#ef4444;color:#fff;transform:rotate(90deg)}
.fg{margin-bottom:24px}
.fg label{display:block;font-size:14px;font-weight:600;margin-bottom:10px;color:var(--tx)}
.fg input,.fg select{width:100%;padding:14px 18px;border:1px solid var(--bd);border-radius:14px;background:var(--bg3);color:var(--tx);font-size:15px;font-family:inherit;transition:all .2s}
.fg input:focus,.fg select:focus{outline:none;border-color:var(--acc);box-shadow:0 0 0 4px var(--acc-glow)}
.fg input::placeholder{color:var(--tx3)}
.ferr{color:#ef4444;font-size:13px;margin-top:8px}
.fbtn{width:100%;padding:18px;border-radius:16px;border:none;background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;font-size:16px;font-weight:600;cursor:pointer;transition:all .25s;margin-top:8px;box-shadow:0 4px 20px var(--acc-glow)}
.fbtn:hover{transform:translateY(-2px);box-shadow:0 8px 28px var(--acc-glow)}
.fbtn:active{transform:translateY(0)}
.fhint{text-align:center;font-size:13px;color:var(--tx3);margin-top:16px}
.range-row{display:flex;align-items:center;gap:16px;background:var(--bg3);padding:14px 18px;border-radius:14px;border:1px solid var(--bd)}
.range-row input[type=range]{flex:1;accent-color:var(--acc);height:6px;cursor:pointer;border-radius:3px}
.range-val{font-size:15px;font-weight:700;min-width:56px;text-align:center;color:var(--acc);background:var(--acc-glow);padding:8px 14px;border-radius:10px}

/* 头像选择器 */
.ava-pick{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-top:16px}
.ava-opt{width:100%;aspect-ratio:1;border-radius:12px;border:2px solid var(--bd);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:24px;transition:all .2s;background:var(--bg3)}
.ava-opt:hover{border-color:var(--acc);transform:scale(1.05)}
.ava-opt.on{border-color:var(--acc);box-shadow:0 0 0 3px var(--acc-glow)}

/* 清除按钮 */
.clear-wrap{padding:12px;border-top:1px solid var(--bd)}
.clear-btn{width:100%;padding:12px 16px;border-radius:12px;border:1px solid var(--bd);background:var(--glass);color:var(--tx3);font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s}
.clear-btn:hover{background:rgba(239,68,68,.1);border-color:#ef4444;color:#ef4444}
.clear-btn.add-mode{background:linear-gradient(135deg,var(--acc),var(--acc2));border:none;color:#fff;box-shadow:0 4px 16px var(--acc-glow)}
.clear-btn.add-mode:hover{transform:translateY(-2px);box-shadow:0 8px 24px var(--acc-glow)}
</style>
</head>
<body>
<div class="app">
<aside class="side" id="side">
<div class="side-hd">
<button class="new-btn" onclick="newChat()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>新对话</button>
</div>
<div class="hist" id="hist"></div>
<div class="clear-wrap" id="clearWrap">
<button class="clear-btn" id="clearBtn" onclick="handleClearBtn()">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>
<span id="clearBtnText">清除全部</span>
</button>
</div>
<div class="side-ft">
<div class="user" onclick="userClick()">
<div class="ava" id="ava">U</div>
<div class="u-info"><div class="u-nm" id="unm">未登录</div><div class="u-em" id="uem">点击登录</div></div>
</div>
</div>
</aside>
<main class="main">
<header class="hdr">
<div class="hdr-l">
<button class="menu" id="menuBtn" onclick="toggleSide()"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg></button>
<button class="new-chat-btn" id="newChatBtn" onclick="newChat()" style="display:none"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></button>
<span class="hdr-title">Unity AI</span>
</div>
<div class="hdr-r">
<button class="icon-btn" onclick="showSet()">⚙️</button>
<button class="icon-btn" id="themeBtn" onclick="toggleTheme()">🌙</button>
</div>
</header>
<div class="chat" id="chat">
<div class="welcome" id="welcome">
<div class="w-icon"><svg viewBox="0 0 128 128" width="48" height="48"><path fill="#fff" d="M82.48 63.578l22.418-38.402 10.832 38.402-10.832 38.398zm-10.926 6.238l22.422 38.402-39.047-9.922-28.211-28.48zM93.969 18.93L71.555 57.34H26.719L0 63.578l26.719 6.238h44.836l22.414 38.406 8.027-45.855-8.027-45.84z"/></svg></div>
<h1>Unity AI 代码助手</h1>
<p>资深架构师为你解答 Unity 开发问题<br>输入 <strong>OOK</strong> 触发完整模块化代码生成</p>
<div class="quick">
<button class="q-btn" onclick="quick('角色控制器怎么写')"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/></svg>角色控制</button>
<button class="q-btn" onclick="quick('对象池优化')"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v3m6.36.64l-2.12 2.12M21 12h-3m-.64 6.36l-2.12-2.12M12 21v-3m-6.36-.64l2.12-2.12M3 12h3m.64-6.36l2.12 2.12"/></svg>对象池</button>
<button class="q-btn" onclick="quick('状态机实现')"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M10 6.5h4M17.5 10v4M10 17.5H7a1 1 0 01-1-1V7"/></svg>状态机</button>
<button class="q-btn" onclick="quick('背包系统设计')"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>背包系统</button>
</div>
</div>
<div class="msgs" id="msgs" style="display:none"></div>
</div>
<div class="inp-area">
<div class="inp-wrap">
<div class="inp-box">
<textarea id="inp" rows="1" placeholder="描述你想做的功能，确认后输入 OOK 触发代码..." onkeydown="handleKey(event)" oninput="autoH(this)"></textarea>
<button class="send" id="sendBtn" onclick="send()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>
</div>
<div class="hint">Unity AI 代码助手，遵循设计模式之SOLID原则</div>
</div>
</div>
</main>
</div>

<div class="modal" id="authM">
<div class="m-box">
<div class="m-hd"><h3>🔐 登录 / 注册</h3><button class="m-close" onclick="closeM('authM')">✕</button></div>
<div class="fg"><label>邮箱地址</label><input type="email" id="aEmail" placeholder="your@email.com"></div>
<div class="fg"><label>密码</label><input type="password" id="aPass" placeholder="至少6位"><div class="ferr" id="aErr"></div></div>
<button class="fbtn" onclick="doAuth()">登录 / 注册</button>
<div class="fhint">首次使用邮箱将自动注册账号</div>
</div>
</div>

<div class="modal" id="setM">
<div class="m-box">
<div class="m-hd"><h3>⚙️ 高级设置</h3><button class="m-close" onclick="closeM('setM')">✕</button></div>
<div class="fg">
<label>创意度 <span style="opacity:.6;font-weight:400">(Temperature)</span></label>
<div class="range-row"><input type="range" min="0" max="2" step="0.1" value="0.7" id="temp" oninput="updR('temp')"><span class="range-val" id="tempV">0.7</span></div>
</div>
<div class="fg">
<label>最大输出长度 <span style="opacity:.6;font-weight:400">(Tokens)</span></label>
<div class="range-row"><input type="range" min="1024" max="8192" step="512" value="4096" id="maxTk" oninput="updR('maxTk')"><span class="range-val" id="maxTkV">4096</span></div>
</div>
<div class="fg">
<label>采样范围 <span style="opacity:.6;font-weight:400">(Top P)</span></label>
<div class="range-row"><input type="range" min="0" max="1" step="0.05" value="0.9" id="topP" oninput="updR('topP')"><span class="range-val" id="topPV">0.9</span></div>
</div>
<button class="fbtn" onclick="saveSet()">💾 保存设置</button>
</div>
</div>

<div class="modal" id="profileM">
<div class="m-box">
<div class="m-hd"><h3>👤 个人资料</h3><button class="m-close" onclick="closeM('profileM')">✕</button></div>
<div style="text-align:center;margin-bottom:24px">
<div class="ava" id="profileAva" style="width:80px;height:80px;font-size:32px;margin:0 auto 16px;cursor:pointer" onclick="document.getElementById('avaInput').click()"></div>
<input type="file" id="avaInput" accept="image/*" style="display:none" onchange="uploadAva(this)">
<div style="font-size:18px;font-weight:700" id="profileName">用户</div>
<div style="font-size:14px;color:var(--tx3)" id="profileEmail">email@example.com</div>
</div>
<div class="fg"><label>选择头像</label>
<div class="ava-pick" id="avaPick"></div>
</div>
<button class="fbtn" style="background:linear-gradient(135deg,#ef4444,#dc2626);box-shadow:0 4px 20px rgba(239,68,68,.3)" onclick="logout()">🚪 退出登录</button>
</div>
</div>

<script>
marked.setOptions({
highlight:(c,l)=>{try{return l&&hljs.getLanguage(l)?hljs.highlight(c,{language:l}).value:hljs.highlightAuto(c).value}catch{return c}},
breaks:true,gfm:true
});

let user=null,convs=[],curId=null,isDark=true;
let cfg={temp:0.7,maxTk:4096,topP:0.9};

function init(){
isDark=localStorage.getItem('theme')!=='light';
applyTheme();
const s=localStorage.getItem('cfg');
if(s)cfg=JSON.parse(s);
document.getElementById('temp').value=cfg.temp;
document.getElementById('maxTk').value=cfg.maxTk;
document.getElementById('topP').value=cfg.topP;
updR('temp');updR('maxTk');updR('topP');
const u=localStorage.getItem('unity_user');
if(u){user=JSON.parse(u);updUser();loadConvs()}
else{convs=JSON.parse(localStorage.getItem('local_convs')||'[]')}
renderHist();
updateClearBtn();
}

function applyTheme(){
document.body.classList.toggle('light',!isDark);
document.getElementById('themeBtn').textContent=isDark?'🌙':'☀️';
document.getElementById('hlcss').href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-'+(isDark?'dark':'light')+'.min.css';
}

function toggleTheme(){isDark=!isDark;localStorage.setItem('theme',isDark?'dark':'light');applyTheme()}
function toggleSide(){
const side=document.getElementById('side');
// 只切换侧边栏
if(window.innerWidth<=768){side.classList.toggle('open')}
else{side.classList.toggle('collapsed')}
// 更新新建对话按钮显示
updateMenuBtn();
}

function updateMenuBtn(){
const side=document.getElementById('side');
const newBtn=document.getElementById('newChatBtn');
const isCollapsed=side.classList.contains('collapsed')||(window.innerWidth<=768&&!side.classList.contains('open'));
// 侧边栏关闭时显示"+"按钮
newBtn.style.display=isCollapsed?'flex':'none';
}
function autoH(e){e.style.height='auto';e.style.height=Math.min(e.scrollHeight,200)+'px'}
function handleKey(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}
function esc(t){const d=document.createElement('div');d.textContent=t;return d.innerHTML}

function timeLabel(d){
const diff=Math.floor((Date.now()-new Date(d).getTime())/864e5);
if(diff===0)return'今天';
if(diff===1)return'昨天';
if(diff<=7)return diff+'天前';
if(diff<=30)return'本月';
return'更早';
}

function renderHist(){
const h=document.getElementById('hist');
if(!convs.length){h.innerHTML='<div style="padding:24px;text-align:center;color:var(--tx3)">暂无对话</div>';updateClearBtn();return}
const g={};
convs.forEach(c=>{const l=timeLabel(c.updatedAt);(g[l]=g[l]||[]).push(c)});
let s='';
for(const[l,cs]of Object.entries(g)){
s+='<div class="h-grp"><div class="h-lbl">'+l+'</div>';
cs.forEach(c=>{
s+='<div class="h-itm'+(c.id===curId?' act':'')+'" onclick="loadConv(\\''+c.id+'\\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span class="h-txt">'+esc(c.title)+'</span><button class="h-del" onclick="event.stopPropagation();delConv(\\''+c.id+'\\')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14M10 11v6M14 11v6"/></svg></button></div>';
});
s+='</div>';
}
h.innerHTML=s;
updateClearBtn();
}

function newChat(){
curId=null;
document.getElementById('welcome').style.display='flex';
document.getElementById('msgs').style.display='none';
document.getElementById('msgs').innerHTML='';
renderHist();
document.getElementById('side').classList.remove('open');
}

function loadConv(id){
const c=convs.find(x=>x.id===id);
if(!c)return;
curId=id;
document.getElementById('welcome').style.display='none';
document.getElementById('msgs').style.display='block';
renderMsgs(c.messages);
renderHist();
document.getElementById('side').classList.remove('open');
}

function delConv(id){
if(!confirm('删除此对话?'))return;
convs=convs.filter(c=>c.id!==id);
if(curId===id)newChat();
saveConvs();
renderHist();
updateClearBtn();
}

function handleClearBtn(){
const btn=document.getElementById('clearBtn');
if(btn.classList.contains('add-mode')){
// 新建对话模式
newChat();
}else{
// 清除全部模式
if(!convs.length)return;
if(!confirm('确定清除所有对话历史？此操作不可恢复！'))return;
convs=[];
curId=null;
saveConvs();
renderHist();
newChat();
updateClearBtn();
}
}

function updateClearBtn(){
const btn=document.getElementById('clearBtn');
const text=document.getElementById('clearBtnText');
const wrap=document.getElementById('clearWrap');
if(convs.length===0){
btn.classList.add('add-mode');
btn.innerHTML='<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"><path d=\"M12 5v14M5 12h14\"/></svg><span>新对话</span>';
}else{
btn.classList.remove('add-mode');
btn.innerHTML='<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14\"/></svg><span>清除全部</span>';
}
}

function renderMsgs(m,streaming=false){
const c=document.getElementById('msgs');
const userAva=user?user.email.charAt(0).toUpperCase():'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/></svg>';
const aiAva='<svg viewBox="0 0 128 128" width="22" height="22"><path fill="currentColor" d="M82.48 63.578l22.418-38.402 10.832 38.402-10.832 38.398zm-10.926 6.238l22.422 38.402-39.047-9.922-28.211-28.48zM93.969 18.93L71.555 57.34H26.719L0 63.578l26.719 6.238h44.836l22.414 38.406 8.027-45.855-8.027-45.84z"/></svg>';
if(streaming){
const lastMsg=c.querySelector('.msg:last-child .msg-bd');
if(lastMsg){lastMsg.innerHTML=renderMd(m[m.length-1].content);c.scrollTop=c.scrollHeight;return}
}
c.innerHTML=m.map(x=>'<div class="msg '+(x.role==='user'?'user':'ai')+'"><div class="msg-row"><div class="msg-av">'+(x.role==='user'?userAva:aiAva)+'</div><div class="msg-ct"><div class="msg-hd"><span class="msg-nm">'+(x.role==='user'?'你':'Unity AI')+'</span></div><div class="msg-bd">'+(x.role==='user'?esc(x.content):renderMd(x.content))+'</div></div></div></div>').join('');
c.scrollTop=c.scrollHeight;
}

function renderMd(t){
if(!t)return '';
let h=marked.parse(t);
// 匹配带语言标记的代码块
h=h.replace(/<pre><code class="language-([^"]+)">/g,'<pre><div class="code-hd"><span>$1</span><button class="copy-btn" onclick="copyCode(this)">复制</button></div><code class="language-$1">');
// 匹配无语言标记的代码块
h=h.replace(/<pre><code>/g,'<pre><div class="code-hd"><span>代码</span><button class="copy-btn" onclick="copyCode(this)">复制</button></div><code>');
return h;
}

function copyCode(b){
navigator.clipboard.writeText(b.closest('pre').querySelector('code').textContent);
b.textContent='已复制!';
b.style.background='#10a37f';
setTimeout(()=>{b.textContent='复制';b.style.background=''},2e3);
}

function quick(t){document.getElementById('inp').value=t;send()}

async function send(){
const inp=document.getElementById('inp'),t=inp.value.trim();
if(!t)return;
if(!curId){
curId=Date.now().toString();
convs.unshift({id:curId,title:t.slice(0,30),messages:[],updatedAt:new Date().toISOString()});
document.getElementById('welcome').style.display='none';
document.getElementById('msgs').style.display='block';
}
const c=convs.find(x=>x.id===curId);
c.messages.push({role:'user',content:t});
c.updatedAt=new Date().toISOString();
renderMsgs(c.messages);
renderHist();
inp.value='';
autoH(inp);
c.messages.push({role:'assistant',content:'<div class="typing"><span></span><span></span><span></span></div>'});
renderMsgs(c.messages);
document.getElementById('sendBtn').disabled=true;
try{
const msgs=c.messages.filter(x=>!x.content.includes('typing')).map(x=>({role:x.role,content:x.content}));
const r=await fetch('/api/chat',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({messages:msgs,cfg})
});
if(!r.ok)throw new Error('请求失败');
const rd=r.body.getReader(),dec=new TextDecoder();
let txt='',buf='';
while(1){
const{done,value}=await rd.read();
if(done)break;
buf+=dec.decode(value,{stream:1});
const ls=buf.split('\\n');
buf=ls.pop()||'';
for(const l of ls){
if(l.startsWith('data: ')&&l!=='data: [DONE]'){
try{
const d=JSON.parse(l.slice(6));
if(d.response){txt+=d.response;c.messages[c.messages.length-1].content=txt;renderMsgs(c.messages,true)}
}catch{}
}
}
}
if(!txt)c.messages[c.messages.length-1].content='暂无返回';
}catch(e){c.messages[c.messages.length-1].content='⚠️ '+e.message}
await saveConvs();
renderMsgs(c.messages);
document.getElementById('sendBtn').disabled=false;
}

function updUser(){
if(user){
document.getElementById('ava').textContent=user.avatar||user.email.charAt(0).toUpperCase();
document.getElementById('unm').textContent=user.email.split('@')[0];
document.getElementById('uem').textContent=user.email;
}else{
document.getElementById('ava').textContent='U';
document.getElementById('unm').textContent='未登录';
document.getElementById('uem').textContent='点击登录';
}
}

const AVATARS=['😀','😎','🤖','🦊','🐱','🐶','🦁','🐼','🐸','🎮'];

function userClick(){
if(user){
document.getElementById('profileAva').textContent=user.avatar||user.email.charAt(0).toUpperCase();
document.getElementById('profileName').textContent=user.email.split('@')[0];
document.getElementById('profileEmail').textContent=user.email;
renderAvaPick();
showM('profileM');
}else{showM('authM')}
}

function renderAvaPick(){
const p=document.getElementById('avaPick');
p.innerHTML=AVATARS.map((a,i)=>'<div class="ava-opt'+(user.avatar===a?' on':'')+'" onclick="pickAva(\\''+a+'\\')">'+a+'</div>').join('');
}

function pickAva(a){
user.avatar=a;
localStorage.setItem('unity_user',JSON.stringify(user));
document.getElementById('profileAva').textContent=a;
document.getElementById('ava').textContent=a;
renderAvaPick();
}

function logout(){
if(confirm('确定退出登录？')){
user=null;localStorage.removeItem('unity_user');convs=[];curId=null;updUser();newChat();renderHist();closeM('profileM');
}
}

function showM(id){document.getElementById(id).classList.add('on')}
function closeM(id){document.getElementById(id).classList.remove('on')}

async function doAuth(){
const e=document.getElementById('aEmail').value.trim(),p=document.getElementById('aPass').value,err=document.getElementById('aErr');
err.textContent='';
if(!e||!e.includes('@')){err.textContent='请输入有效邮箱';return}
if(p.length<6){err.textContent='密码至少6位';return}
try{
const r=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,password:p})});
const d=await r.json();
if(!r.ok){err.textContent=d.error||'失败';return}
user={id:d.userId,email:e};
localStorage.setItem('unity_user',JSON.stringify(user));
updUser();closeM('authM');
await loadConvs();renderHist();
if(convs.length)loadConv(convs[0].id);
}catch{err.textContent='网络错误'}
}

async function loadConvs(){
if(!user)return;
try{
const r=await fetch('/api/user/conversations?userId='+user.id);
const d=await r.json();
convs=d.conversations||[];
}catch{}
}

async function saveConvs(){
if(user){
try{await fetch('/api/user/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:user.id,conversations:convs})})}catch{}
}else{localStorage.setItem('local_convs',JSON.stringify(convs))}
}

function showSet(){showM('setM')}
function updR(id){document.getElementById(id+'V').textContent=document.getElementById(id).value}
function saveSet(){
cfg.temp=parseFloat(document.getElementById('temp').value);
cfg.maxTk=parseInt(document.getElementById('maxTk').value);
cfg.topP=parseFloat(document.getElementById('topP').value);
localStorage.setItem('cfg',JSON.stringify(cfg));
closeM('setM');
}

init();
</script>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/') {
      return new Response(html(), { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
    }
    if (request.method === 'POST' && url.pathname === '/api/auth') {
      try {
        const { email, password } = await request.json();
        const hp = await hashPass(password);
        let u = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
        if (u) {
          if (u.password !== hp) return new Response(JSON.stringify({ error: '密码错误' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        } else {
          const r = await env.DB.prepare('INSERT INTO users (email, password) VALUES (?, ?)').bind(email, hp).run();
          u = { id: r.meta.last_row_id, email };
        }
        return new Response(JSON.stringify({ userId: u.id, email: u.email }), { headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }
    if (request.method === 'GET' && url.pathname === '/api/user/conversations') {
      try {
        const userId = url.searchParams.get('userId');
        const c = await env.DB.prepare('SELECT content FROM chat_history WHERE user_id = ? AND role = "conversations" LIMIT 1').bind(userId).first();
        return new Response(JSON.stringify({ conversations: c?.content ? JSON.parse(c.content) : [] }), { headers: { 'Content-Type': 'application/json' } });
      } catch {
        return new Response(JSON.stringify({ conversations: [] }), { headers: { 'Content-Type': 'application/json' } });
      }
    }
    if (request.method === 'POST' && url.pathname === '/api/user/save') {
      try {
        const { userId, conversations } = await request.json();
        await env.DB.prepare('DELETE FROM chat_history WHERE user_id = ? AND role = "conversations"').bind(userId).run();
        await env.DB.prepare('INSERT INTO chat_history (user_id, role, content) VALUES (?, "conversations", ?)').bind(userId, JSON.stringify(conversations)).run();
        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }
    if (request.method === 'POST' && url.pathname === '/api/chat') {
      try {
        const { messages, cfg = {} } = await request.json();
        const response = await env.AI.run(MODEL, {
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
          stream: true,
          max_tokens: cfg.maxTk || 4096,
          temperature: cfg.temp || 0.7,
          top_p: cfg.topP || 0.9
        });
        return new Response(response, { headers: { 'Content-Type': 'text/event-stream' } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }
    return new Response('Not Found', { status: 404 });
  },
};
