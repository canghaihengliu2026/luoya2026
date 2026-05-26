/**
 * 中西医结合主治医师个人网站 — 博客系统
 * 首页文章列表渲染 + 文章详情
 */

(function() {
  'use strict';

  // ========== 配置 ==========
  const POSTS_JSON_PATH = 'blog/posts.json';
  const ARTICLE_PAGE_PATH = 'blog/article.html';

  // ========== 首页博客列表渲染 ==========
  const blogList = document.getElementById('blog-list');
  if (blogList) {
    fetch(POSTS_JSON_PATH)
      .then(res => res.json())
      .then(posts => {
        // 取最新 3 篇
        const recent = posts.slice(0, 3);
        blogList.innerHTML = recent.map(post => createBlogCard(post)).join('');

        // 动画观察
        blogList.querySelectorAll('.blog-card').forEach(card => {
          card.classList.add('fade-in');
          if (typeof IntersectionObserver !== 'undefined') {
            const obs = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('visible');
                  obs.unobserve(entry.target);
                }
              });
            }, { threshold: 0.15 });
            obs.observe(card);
          }
        });
      })
      .catch(err => {
        console.error('加载文章列表失败:', err);
        blogList.innerHTML = '<p style="text-align:center;color:#636E72;grid-column:1/-1;">文章加载中...</p>';
      });
  }

  function createBlogCard(post) {
    const tag = post.tags && post.tags.length > 0 ? post.tags[0] : '健康科普';
    return `
      <article class="blog-card" onclick="window.location.href='${ARTICLE_PAGE_PATH}?id=${post.id}'">
        <div class="blog-card-image">
          <svg viewBox="0 0 48 48" fill="none">
            <rect x="8" y="6" width="32" height="36" rx="3" stroke="#fff" stroke-width="1.5"/>
            <line x1="14" y1="16" x2="34" y2="16" stroke="#fff" stroke-width="1.5"/>
            <line x1="14" y1="22" x2="30" y2="22" stroke="#fff" stroke-width="1.5"/>
            <line x1="14" y1="28" x2="26" y2="28" stroke="#fff" stroke-width="1.5"/>
          </svg>
          <span class="blog-tag">${escapeHTML(tag)}</span>
        </div>
        <div class="blog-card-body">
          <h3>${escapeHTML(post.title)}</h3>
          <p>${escapeHTML(post.excerpt || '')}</p>
          <div class="blog-card-meta">${formatDate(post.date)}</div>
        </div>
      </article>
    `;
  }

  // ========== 博客列表页 ==========
  const blogListPage = document.getElementById('blog-full-list');
  if (blogListPage) {
    fetch(POSTS_JSON_PATH)
      .then(res => res.json())
      .then(posts => {
        blogListPage.innerHTML = posts.map(post => createBlogCard(post)).join('');
        // 设置页面标题
        const titleEl = document.querySelector('.blog-page-header h1');
        if (titleEl) titleEl.textContent = `全部文章 (${posts.length})`;
      })
      .catch(err => {
        console.error('加载文章列表失败:', err);
        blogListPage.innerHTML = '<p style="text-align:center;color:#636E72;">暂时没有文章</p>';
      });
  }

  // ========== 文章详情页 ==========
  const articleContent = document.getElementById('article-content');
  if (articleContent) {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    fetch(POSTS_JSON_PATH)
      .then(res => res.json())
      .then(posts => {
        const post = posts.find(p => p.id === postId);
        if (!post) {
          articleContent.innerHTML = '<p style="text-align:center;padding:100px 0;color:#636E72;">文章未找到</p>';
          return;
        }

        // 更新标题
        document.title = post.title + ' | 罗叶医师健康科普';
        const titleEl = document.getElementById('article-title');
        const dateEl = document.getElementById('article-date');
        const tagsEl = document.getElementById('article-tags');

        if (titleEl) titleEl.textContent = post.title;
        if (dateEl) dateEl.textContent = formatDate(post.date);
        if (tagsEl && post.tags) {
          tagsEl.innerHTML = post.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('');
        }

        // 加载 Markdown 内容
        fetch(post.file)
          .then(res => res.text())
          .then(md => {
            // 简易 Markdown 渲染
            articleContent.innerHTML = renderMarkdown(md);
          })
          .catch(() => {
            articleContent.innerHTML = '<p style="color:#636E72;">文章内容加载失败</p>';
          });
      })
      .catch(() => {
        articleContent.innerHTML = '<p style="text-align:center;padding:100px 0;color:#636E72;">文章加载失败</p>';
      });
  }
})();

// ========== 工具函数 ==========

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/**
 * 简易 Markdown 渲染器
 * 支持：标题、段落、粗体、斜体、列表、链接、代码块、分割线
 */
function renderMarkdown(md) {
  // 转义 HTML
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 代码块 (```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 标题
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // 分割线
  html = html.replace(/^[-*_]{3,}$/gm, '<hr>');

  // 粗体 + 斜体
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // 无序列表
  html = html.replace(/^(\s*)[-*]\s+(.+)$/gm, (_, indent, text) => {
    const level = Math.floor(indent.length / 2);
    if (level === 0) {
      return '</p><ul>\n<li>' + text + '</li>';
    }
    return '<li>' + text + '</li>';
  });

  // 有序列表
  html = html.replace(/^(\s*)\d+\.\s+(.+)$/gm, (_, indent, text) => {
    const level = Math.floor(indent.length / 2);
    if (level === 0) {
      return '</p><ol>\n<li>' + text + '</li>';
    }
    return '<li>' + text + '</li>';
  });

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // 段落：双换行分割
  html = '<p>' + html.replace(/\n\n+/g, '</p><p>') + '</p>';

  // 清理：闭合列表前后的 p 标签
  html = html.replace(/<p><ul>/g, '<ul>');
  html = html.replace(/<\/ul><\/p>/g, '</ul>');
  html = html.replace(/<p><ol>/g, '<ol>');
  html = html.replace(/<\/ol><\/p>/g, '</ol>');
  html = html.replace(/<p><\/p>/g, '');

  return html;
}
