var mb=document.getElementById('mb'),nv=document.getElementById('nv');
mb.onclick=function(){var o=nv.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.textContent=o?'✕':'☰'};
nv.querySelectorAll('a').forEach(function(a){a.onclick=function(){nv.classList.remove('open');mb.textContent='☰'}});
document.querySelectorAll('.tab').forEach(function(t){t.onclick=function(){document.querySelectorAll('.tab').forEach(function(x){x.setAttribute('aria-selected',x===t)});document.getElementById('p0').hidden=t.dataset.t!=='0';document.getElementById('p1').hidden=t.dataset.t!=='1'}});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.rv').forEach(function(e){io.observe(e)});
document.getElementById('f').onsubmit=function(e){e.preventDefault();var d=new FormData(e.target);var t='Ciao MRC, sono '+d.get('n')+'. Auto: '+(d.get('a')||'n.d.')+'. Mi serve: '+d.get('t')+'. '+(d.get('m')||'');window.open('https://wa.me/393497861240?text='+encodeURIComponent(t),'_blank')};


// Demo store: cart is client-side only; no checkout or payment processing.
(function(){
 var drawer=document.getElementById('cartDrawer'),backdrop=document.getElementById('cartBackdrop');
 if(!drawer)return;
 var cart={},products=[].slice.call(document.querySelectorAll('.product'));
 function money(n){return new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(n)}
 function openCart(){drawer.classList.add('open');backdrop.classList.add('open');drawer.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
 function closeCart(){drawer.classList.remove('open');backdrop.classList.remove('open');drawer.setAttribute('aria-hidden','true');document.body.style.overflow=''}
 function render(){
  var items=document.getElementById('cartItems'),keys=Object.keys(cart),count=keys.reduce(function(a,k){return a+cart[k].qty},0),total=keys.reduce(function(a,k){return a+cart[k].price*cart[k].qty},0);
  document.querySelectorAll('.cart-count').forEach(function(e){e.textContent=count});
  document.getElementById('cartTotal').textContent=money(total);
  if(!keys.length){items.innerHTML='<p class="cart-empty">Il carrello è vuoto. Aggiungi un prodotto per iniziare.</p>';return}
  items.innerHTML=keys.map(function(k){var p=cart[k];return '<div class="cart-line"><div><h4>'+p.name+'</h4><small>Prezzo unitario: '+money(p.price)+'</small><div class="cart-controls"><button data-action="minus" data-id="'+k+'" aria-label="Diminuisci quantità">−</button><span>'+p.qty+'</span><button data-action="plus" data-id="'+k+'" aria-label="Aumenta quantità">+</button></div></div><div><button class="cart-remove" data-action="remove" data-id="'+k+'" aria-label="Rimuovi prodotto">×</button><strong>'+money(p.price*p.qty)+'</strong></div></div>'}).join('');
 }
 document.querySelectorAll('.add-cart').forEach(function(b){b.addEventListener('click',function(){var el=b.closest('.product'),id=el.dataset.id;if(cart[id])cart[id].qty++;else cart[id]={name:el.dataset.name,price:Number(el.dataset.price),qty:1};render();openCart();})});
 document.querySelectorAll('.cart-open').forEach(function(b){b.addEventListener('click',openCart)});
 document.querySelector('.cart-close').addEventListener('click',closeCart);backdrop.addEventListener('click',closeCart);
 document.addEventListener('keydown',function(e){if(e.key==='Escape')closeCart()});
 document.getElementById('cartItems').addEventListener('click',function(e){var b=e.target.closest('button[data-action]');if(!b)return;var id=b.dataset.id,action=b.dataset.action;if(!cart[id])return;if(action==='plus')cart[id].qty++;if(action==='minus')cart[id].qty--;if(action==='remove'||cart[id].qty<1)delete cart[id];render()});
 document.querySelectorAll('.filter').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.filter').forEach(function(x){x.classList.toggle('active',x===b)});products.forEach(function(p){p.hidden=b.dataset.filter!=='all'&&p.dataset.category!==b.dataset.filter})})});
 document.getElementById('checkoutDemo').addEventListener('click',function(){var keys=Object.keys(cart),msg=document.getElementById('checkoutMessage');msg.hidden=false;if(!keys.length){msg.textContent='Il carrello è vuoto: aggiungi un prodotto prima di creare il riepilogo.';return}msg.innerHTML='<strong>Riepilogo dimostrativo</strong><br>'+keys.map(function(k){return cart[k].name+' × '+cart[k].qty}).join('<br>')+'<br><br><strong>Totale: '+money(keys.reduce(function(a,k){return a+cart[k].price*cart[k].qty},0))+'</strong><br>Nessun ordine inviato e nessun pagamento richiesto.'});
})();
