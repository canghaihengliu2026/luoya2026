# 罗叶医师个人网站

> 中西医结合内科学主治医师 | 武汉方泰医院疼痛康复科

## 技术栈

- 纯静态网站（HTML + CSS + JavaScript）
- 无需构建工具，开箱即用
- 响应式设计，适配手机/平板/桌面

## 网站结构

```
├── index.html              ← 首页（6 区域单页）
├── images/
│   └── photo.jpeg          ← 医师照片
├── css/
│   ├── style.css           ← 全局样式（蓝绿现代简约风）
│   └── blog.css            ← 博客页面样式
├── js/
│   ├── main.js             ← 导航、滚动动效、表单提交
│   └── blog.js             ← 博客列表渲染 + Markdown 解析
├── blog/
│   ├── index.html          ← 博客列表页
│   ├── article.html        ← 文章详情页
│   └── posts.json          ← 文章配置
└── posts/                  ← 6 篇科普文章（疼痛康复为主）
    ├── pain-rehab.md               ← 颈肩腰腿痛康复
    ├── neck-shoulder-pain.md       ← 办公室颈肩综合征
    ├── lumbar-disc-herniation.md   ← 腰椎间盘突出
    ├── knee-osteoarthritis.md      ← 膝骨关节炎
    ├── insomnia-tcm.md             ← 失眠调理（疼痛患者视角）
    └── seasonal-health-spring.md   ← 春季养生
```

## 快速开始

```bash
# Python
python -m http.server 8080

# 或 Node.js
npx serve .
```

访问 `http://localhost:8080`

## 待完善

- [ ] 替换 Formspree 表单 ID
- [ ] 填写 ICP 备案号
- [ ] 完善微信联系方式
