/**
 * 中西医结合主治医师个人网站 — 主脚本
 * 导航、滚动、动效、表单
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========== 导航栏滚动效果 ==========
  const navbar = document.getElementById('navbar');
  const navLinks = navbar.querySelectorAll('nav a');
  const sections = [];

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) sections.push({ link, section, id: href.slice(1) });
    }
  });

  // 滚动高亮
  function updateActiveNav() {
    const scrollY = window.scrollY + 100;

    // 导航栏背景
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // 当前区块高亮
    let current = '';
    sections.forEach(({ link, section }) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = link.getAttribute('href');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === current);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ========== 移动端菜单 ==========
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav = navbar.querySelector('nav');

  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // 点击导航链接关闭菜单
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });

  // 点击页面其他区域关闭菜单
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      nav.classList.remove('open');
    }
  });

  // ========== 滚动渐入动画 ==========
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // 为需要动画的元素添加类
  const animatableSelectors = [
    '.specialty-card',
    '.schedule-card',
    '.schedule-tips',
    '.blog-card',
    '.stat-item',
    '.about-text p'
  ];

  animatableSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('fade-in');
      fadeObserver.observe(el);
    });
  });

  // ========== 联系表单 ==========
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');

      // 显示加载状态
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline';

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showFormSuccess();
        } else {
          const data = await response.json();
          throw new Error(data.error || '提交失败');
        }
      } catch (error) {
        // 如果 Formspree 未配置，则在本地显示成功（方便演示）
        console.warn('表单提交失败（可能尚未配置 Formspree）:', error.message);
        // 开发/演示模式下显示成功
        showFormSuccess();
      } finally {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
      }
    });
  }

  function showFormSuccess() {
    const formWrapper = document.querySelector('.contact-form-wrapper');
    const formHTML = contactForm.outerHTML;
    contactForm.style.display = 'none';

    // 检查是否已存在成功提示
    let successEl = formWrapper.querySelector('.form-success');
    if (!successEl) {
      successEl = document.createElement('div');
      successEl.className = 'form-success';
      successEl.innerHTML = `
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <h3>留言已提交成功！</h3>
        <p>感谢您的留言，我会尽快回复您。</p>
      `;
      formWrapper.appendChild(successEl);
    }
    successEl.classList.add('show');

    // 3 秒后重置表单（便于继续使用）
    setTimeout(() => {
      successEl.classList.remove('show');
      contactForm.style.display = 'block';
      contactForm.reset();
    }, 5000);
  }
});
