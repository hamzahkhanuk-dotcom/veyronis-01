/* VEYRONIS-01 — interactions */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nav: solid background after scroll */
  var nav = document.querySelector('.nav');
  function onScroll(){
    if(nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    /* spine fill = scroll progress */
    var fill = document.querySelector('.spine__fill');
    var node = document.querySelector('.spine__node');
    if(fill){
      var h = document.documentElement;
      var p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      p = Math.max(0, Math.min(1, p));
      fill.style.height = (p*100) + '%';
      if(node) node.style.top = (p*100) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* mobile menu */
  var burger = document.querySelector('.burger');
  var links = document.querySelector('.nav__links');
  if(burger && links){
    burger.addEventListener('click', function(){
      var open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('open'); burger.classList.remove('open');
      });
    });
  }

  /* scroll reveals */
  var items = document.querySelectorAll('.reveal');
  if(reduce || !('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
    items.forEach(function(el){ io.observe(el); });
  }

  /* footer year */
  var y = document.querySelector('[data-year]');
  if(y) y.textContent = new Date().getFullYear();
})();
