// Kopieer die handtekening as ryk HTML.
// "Outlook"-knoppie: prent ingebed as base64 (embed.js) -> Outlook stoor dit IN die handtekening, geen bediener nodig.
// "Gmail / iPhone"-knoppie: Gmail aanvaar nie ingebedde prente nie -> absolute URL van waar hierdie bladsy gehos word.
(function () {
  var BASE = 'https://www.zygentic.co.za/sig/', VER = '3';
  var web = /^https?:$/.test(location.protocol);
  var ok = document.getElementById('ok');
  document.querySelectorAll('button[data-mode]').forEach(function (btn) {
   btn.addEventListener('click', function () {
    var mode = btn.getAttribute('data-mode');
    var src = document.getElementById('sig');
    var clone = src.cloneNode(true);
    clone.querySelectorAll('img').forEach(function (im) {
      var f = im.getAttribute('src').split('/').pop().split('?')[0];
      var emb = window.ZYG_EMBED && window.ZYG_EMBED[f];
      var url = (web ? new URL(f, location.href).href : BASE + f) + '?v=' + VER;
      im.setAttribute('src', (mode === 'embed' && emb) ? emb : url);
    });
    var html = clone.innerHTML;
    var done = function () { ok.hidden = false; setTimeout(function () { ok.hidden = true; }, 4000); };
    if (navigator.clipboard && window.ClipboardItem) {
      navigator.clipboard.write([new ClipboardItem({
        'text/html': new Blob([html], {type: 'text/html'}),
        'text/plain': new Blob([src.getAttribute('data-plain') || ''], {type: 'text/plain'})
      })]).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var box = document.createElement('div');
      box.innerHTML = html; box.style.position = 'fixed'; box.style.left = '-9999px';
      document.body.appendChild(box);
      var r = document.createRange(); r.selectNodeContents(box);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      document.execCommand('copy'); s.removeAllRanges(); box.remove(); done();
    }
   });
  });
})();
