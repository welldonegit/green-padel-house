(function () {
  function tick() {
    var sec = document.getElementById('hero');
    if (!sec) { requestAnimationFrame(tick); return; }
    var frame = sec.firstElementChild;
    var card = frame && frame.firstElementChild;
    var man = sec.querySelector('img[src*="player-man"]');
    var woman = sec.querySelector('img[src*="player-woman"]');
    if (!frame || !card || !man || !woman) { requestAnimationFrame(tick); return; }

    var vh = window.innerHeight;
    var p = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / vh));
    var ease = 1 - Math.pow(1 - p, 3);

    var inset = 24 * ease;
    frame.style.padding = inset + 'px ' + inset + 'px 0';
    var shrink = window.innerWidth <= 860 ? 40 * Math.min(1, Math.max(0, (p - 0.7) / 0.3)) : 0;
    frame.style.height = 'calc(100vh - ' + shrink.toFixed(1) + 'px)';
    card.style.borderRadius = (32 * ease) + 'px';

    var cw = card.getBoundingClientRect().width;
    var size = cw > 900 ? 'min(87.12%,851px)' : (cw > 600 ? 'min(44%,352px)' : 'min(39.6%,304px)');
    man.style.height = size;
    woman.style.height = size;
    man.style.opacity = '1';
    woman.style.opacity = '1';

    var travel = cw * 0.55;
    man.style.transform = 'translateX(' + (-travel * ease) + 'px)';
    woman.style.transform = 'translateX(' + (travel * ease) + 'px)';

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
