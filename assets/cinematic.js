/* VEYRONIS-01 — cinematic layer */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- cursor light ---- */
  if(!reduce && window.matchMedia('(hover:hover)').matches){
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    var gx=innerWidth/2, gy=innerHeight/2, cx=gx, cy=gy;
    window.addEventListener('pointermove', function(e){ gx=e.clientX; gy=e.clientY; }, {passive:true});
    (function follow(){
      cx += (gx-cx)*.12; cy += (gy-cy)*.12;
      glow.style.transform = 'translate('+(cx-310)+'px,'+(cy-310)+'px)';
      requestAnimationFrame(follow);
    })();
  }

  /* ---- boot reveal (only where #boot exists = home) ---- */
  var boot = document.getElementById('boot');
  if(boot){
    if(reduce){ boot.parentNode && boot.remove(); }
    else {
      document.body.classList.add('booting');
      setTimeout(function(){ boot.classList.add('done'); document.body.classList.remove('booting'); }, 2050);
      setTimeout(function(){ boot.parentNode && boot.remove(); }, 3100);
    }
  }

  /* ---- hero parallax (move the media layer; image keeps its slow zoom) ---- */
  var heroMedia = document.querySelector('.hero__media');
  if(heroMedia && !reduce){
    window.addEventListener('scroll', function(){
      heroMedia.style.transform = 'translateY('+(window.scrollY*0.22)+'px)';
    }, {passive:true});
  }

  /* ---- 3D tilt on .tilt elements ---- */
  if(!reduce && window.matchMedia('(hover:hover)').matches){
    document.querySelectorAll('.tilt').forEach(function(el){
      el.addEventListener('pointermove', function(e){
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left)/r.width - .5;
        var py = (e.clientY - r.top)/r.height - .5;
        el.style.transform = 'perspective(1000px) rotateY('+(px*6.5)+'deg) rotateX('+(-py*6.5)+'deg) scale(1.015)';
      });
      el.addEventListener('pointerleave', function(){ el.style.transform=''; });
    });
  }

  /* ---- WebGL ambient depth field ---- */
  if(window.THREE && !reduce){
    var canvas = document.createElement('canvas');
    canvas.className = 'webgl';
    document.body.appendChild(canvas);

    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 1, 1400);
    cam.position.z = 420;
    var renderer = new THREE.WebGLRenderer({canvas:canvas, alpha:true, antialias:true});
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));

    function field(count, spread, color, size, opacity){
      var p = new Float32Array(count*3);
      for(var i=0;i<count;i++){
        p[i*3]   = (Math.random()-.5)*spread.x;
        p[i*3+1] = (Math.random()-.5)*spread.y;
        p[i*3+2] = (Math.random()-.5)*spread.z;
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(p,3));
      var m = new THREE.PointsMaterial({color:color,size:size,transparent:true,opacity:opacity,
        sizeAttenuation:true,blending:THREE.AdditiveBlending,depthWrite:false});
      var pts = new THREE.Points(g,m); scene.add(pts); return pts;
    }

    var dense = innerWidth < 760 ? 320 : 720;
    var dust   = field(dense, {x:1000,y:760,z:620}, 0xc9a24e, 1.7, .5);
    var bright = field(70,    {x:1000,y:760,z:620}, 0xecc986, 3.0, .85);

    var mx=0,my=0,tx=0,ty=0;
    window.addEventListener('pointermove', function(e){
      mx = e.clientX/innerWidth - .5; my = e.clientY/innerHeight - .5;
    }, {passive:true});
    window.addEventListener('resize', function(){
      cam.aspect = innerWidth/innerHeight; cam.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });

    (function loop(){
      requestAnimationFrame(loop);
      tx += (mx-tx)*.045; ty += (my-ty)*.045;
      dust.rotation.y += .00045; bright.rotation.y -= .0003;
      cam.position.x = tx*140; cam.position.y = -ty*100;
      cam.lookAt(scene.position);
      renderer.render(scene, cam);
    })();
  }
})();
