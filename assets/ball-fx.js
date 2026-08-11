(function(){
  if (window.__gphBalls) return; window.__gphBalls = 1;
  var LIFE = 1000;
  var last = null;
  function spawn(btn){
    // one volley at a time: a ball still in flight blocks the next
    if (btn.__gphAlive > 0) return;
    var r = btn.getBoundingClientRect();
    btn.__gphAlive = 0;
    for (var i=0;i<3;i++){
      var ball = document.createElement('img');
      ball.src = 'assets/tennis-ball.svg'; ball.alt='';
      var size = 12 + Math.random()*9;
      var dx = (Math.random()-0.5)*190, dy = -(64 + Math.random()*86), rot = (Math.random()-0.5)*560;
      var s = ball.style;
      s.position='fixed';
      s.left = (r.left + r.width*(0.18+Math.random()*0.64))+'px';
      s.top  = (r.top + r.height*(0.35+Math.random()*0.4))+'px';
      s.width=size+'px'; s.height=size+'px'; s.zIndex='2147483000'; s.pointerEvents='none';
      s.setProperty('--dx', dx.toFixed(1)+'px');
      s.setProperty('--dy', dy.toFixed(1)+'px');
      s.setProperty('--rot', rot.toFixed(0)+'deg');
      s.animation = 'gphBallFly ' + (0.62+Math.random()*0.22).toFixed(2) + 's cubic-bezier(.22,.72,.32,1) ' + (i*55) + 'ms both';
      document.body.appendChild(ball);
      btn.__gphAlive++;
      (function(el, owner){
        setTimeout(function(){
          if (el.parentNode) el.parentNode.removeChild(el);
          owner.__gphAlive = Math.max(0, (owner.__gphAlive || 1) - 1);
        }, LIFE);
      })(ball, btn);
    }
  }
  document.addEventListener('mouseover', function(e){
    var t = e.target; if (!t || !t.closest) return;
    var btn = t.closest('.gph-wave'); if (!btn || btn === last) return;
    last = btn; spawn(btn);
  }, true);
  document.addEventListener('mouseout', function(e){
    var t = e.target; if (!t || !t.closest) return;
    var btn = t.closest('.gph-wave'); if (!btn || btn !== last) return;
    var to = e.relatedTarget;
    if (to && btn.contains(to)) return;
    last = null;
  }, true);
})();
