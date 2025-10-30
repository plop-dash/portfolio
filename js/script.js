// Toggle resume embed visibility
(function() {
  const resumeToggle = document.querySelector('#resume-toggle');
  const resumeEmbed = document.querySelector('#resume-embed');
  if (!resumeToggle || !resumeEmbed) return;

  resumeToggle.addEventListener('click', function() {
    console.log('Resume toggle clicked');

    const computed = window.getComputedStyle(resumeEmbed).display;
    const isHidden = computed === 'none' || resumeEmbed.classList.contains('hidden');

    if (isHidden) {
      resumeEmbed.classList.remove('hidden');
      resumeEmbed.style.display = 'block';
      resumeToggle.setAttribute('aria-pressed', 'true');
      resumeToggle.innerHTML = `<img class="icon" src="icons/icon-file.svg" alt="">Hide Resume`
    } else {
      resumeEmbed.classList.add('hidden');
      resumeEmbed.style.display = 'none';
      resumeToggle.setAttribute('aria-pressed', 'false');
        resumeToggle.innerHTML = `<img class="icon" src="icons/icon-file.svg" alt="">Show Resume`
    }
  });
})();
// Smooth-scroll nav links with offset to account for sticky nav
document.querySelectorAll("nav a[href^='#']").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const nav = document.querySelector('nav');
    const navHeight = nav ? Math.ceil(nav.getBoundingClientRect().height) : 70;
    const extraGap = 16; 
    const offset = navHeight + extraGap;

    const targetY = target.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({ top: targetY, behavior: 'smooth' });

    try { history.replaceState(null, '', href); } catch (err) { }
  });
});

(function initRevealOnScroll() {
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  console.log('[reveal] init, found', reveals.length, 'elements');
  if (!reveals.length) return;

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    console.log('[reveal] prefers-reduced-motion is set; revealing all');
    reveals.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('[reveal] visible:', entry.target);
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15,
    });

    reveals.forEach((el) => obs.observe(el));

    setTimeout(() => {
      const anyVisible = reveals.some(r => r.classList.contains('is-visible'));
      if (!anyVisible) {
        console.warn('[reveal] no elements observed as visible — applying fallback reveal');
        reveals.forEach((el, i) => setTimeout(() => el.classList.add('is-visible'), i * 80));
      }
    }, 1000);

    return;
  }

  console.warn('[reveal] IntersectionObserver not supported — revealing all');
  reveals.forEach((el) => el.classList.add('is-visible'));
})();

  function showInitialLoader() {
    const el = document.getElementById('initial-loader');
    if (el) el.style.display = 'grid';
  }
  function hideInitialLoader() {
    const el = document.getElementById('initial-loader');
    if (el) el.style.display = 'none';
  }

(async function fetchGithubInfo() {

  showInitialLoader();

  const ghUsername = 'plop-dash';
  const ghApi = `https://api.github.com/users/${ghUsername}`;
  let data = null;
  try {
    const response = await fetch(ghApi);
    if (response.ok) data = await response.json();
    else console.warn('GitHub API responded with', response.status);
  } catch (err) {
    console.error('GitHub fetch error', err);
  }

  if (data) {
    console.log(data);
    const imgElement = document.querySelector('.header-portrait img');
    const headerSubElement = document.querySelector('.header-sub');
    if (imgElement && data.avatar_url) imgElement.src = data.avatar_url;
    if (headerSubElement && data.bio) headerSubElement.innerHTML = data.bio;
  }

  setTimeout(hideInitialLoader, 220);
  setTimeout(hideInitialLoader, 6000);
}
)();
