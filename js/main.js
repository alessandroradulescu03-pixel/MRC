var mb = document.getElementById('mb');
var nv = document.getElementById('nv');

// Menu mobile
if (mb && nv) {
    mb.addEventListener('click', function () {
        var aperto = nv.classList.toggle('open');
        mb.setAttribute('aria-expanded', aperto ? 'true' : 'false');
        mb.textContent = aperto ? '✕' : '☰';
    });

    nv.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            nv.classList.remove('open');
            mb.setAttribute('aria-expanded', 'false');
            mb.textContent = '☰';
        });
    });
}

// Schede
document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.tab').forEach(function (element) {
            element.setAttribute('aria-selected', element === tab ? 'true' : 'false');
        });

        var p0 = document.getElementById('p0');
        var p1 = document.getElementById('p1');

        if (p0) p0.hidden = tab.dataset.t !== '0';
        if (p1) p1.hidden = tab.dataset.t !== '1';
    });
});

// Animazioni delle sezioni
if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('on');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.rv').forEach(function (element) {
        observer.observe(element);
    });
} else {
    document.querySelectorAll('.rv').forEach(function (element) {
        element.classList.add('on');
    });
}

// Modulo contatti: apre WhatsApp
var form = document.getElementById('f');

if (form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var data = new FormData(form);
        var messaggio =
            'Ciao MRC, sono ' + data.get('n') +
            '. Auto: ' + (data.get('a') || 'n.d.') +
            '. Mi serve: ' + data.get('t') +
            '. ' + (data.get('m') || '');

        window.open(
            'https://wa.me/393497861240?text=' + encodeURIComponent(messaggio),
            '_blank'
        );
    });
}

// ===== VISTA NEGOZIO (pagina separata, senza ricaricare) =====

function apriNegozio(event) {
    var negozio = document.getElementById('negozio');
    if (!negozio) return;

    if (event) event.preventDefault();

    negozio.hidden = false;
    negozio.removeAttribute('hidden');
    document.body.classList.add('vista-negozio');

    // Crea il pulsante "Torna al sito" una sola volta
    if (!document.getElementById('tornaHome')) {
        var wrap = negozio.querySelector('.w');
        var btn = document.createElement('a');
        btn.id = 'tornaHome';
        btn.className = 'btn o torna-home';
        btn.href = '#top';
        btn.textContent = '← Torna al sito';
        btn.addEventListener('click', chiudiNegozio);
        wrap.insertBefore(btn, wrap.firstChild);
    }

    // Chiude il menu mobile
    if (nv) nv.classList.remove('open');
    if (mb) {
        mb.setAttribute('aria-expanded', 'false');
        mb.textContent = '☰';
    }

    // Aggiorna l'indirizzo senza ricaricare la pagina
    if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', '#negozio');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function chiudiNegozio(event) {
    var negozio = document.getElementById('negozio');
    if (event) event.preventDefault();

    if (negozio) negozio.hidden = true;
    document.body.classList.remove('vista-negozio');

    if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', '#top');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// "Negozio" nel menu e "COMPONENTI AFTERMARKET" nella galleria
document.querySelectorAll('a[href="#negozio"]').forEach(function (link) {
    link.addEventListener('click', apriNegozio);
});

// Dal negozio, i link del menu riportano alla home e poi alla sezione scelta
document.querySelectorAll('nav a, .logo, header .btn').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href === '#negozio' || href.charAt(0) !== '#') return;

    link.addEventListener('click', function (event) {
        if (!document.body.classList.contains('vista-negozio')) return;

        event.preventDefault();
        chiudiNegozio();

        window.setTimeout(function () {
            var target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    });
});

// Carrello dimostrativo
(function () {
    var drawer = document.getElementById('cartDrawer');
    var backdrop = document.getElementById('cartBackdrop');

    if (!drawer || !backdrop) return;

    var cart = {};
    var products = Array.prototype.slice.call(
        document.querySelectorAll('.product')
    );

    function money(amount) {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }

    function openCart() {
        drawer.classList.add('open');
        backdrop.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function renderCart() {
        var items = document.getElementById('cartItems');
        var keys = Object.keys(cart);

        var count = keys.reduce(function (total, key) {
            return total + cart[key].qty;
        }, 0);

        var total = keys.reduce(function (sum, key) {
            return sum + cart[key].price * cart[key].qty;
        }, 0);

        document.querySelectorAll('.cart-count').forEach(function (element) {
            element.textContent = count;
        });

        var cartTotal = document.getElementById('cartTotal');
        if (cartTotal) cartTotal.textContent = money(total);

        if (!items) return;

        if (!keys.length) {
            items.innerHTML =
                '<p class="cart-empty">Il carrello è vuoto. Aggiungi un prodotto per iniziare.</p>';
            return;
        }

        items.innerHTML = keys.map(function (key) {
            var product = cart[key];

            return '<div class="cart-line">' +
                '<div>' +
                    '<h4>' + product.name + '</h4>' +
                    '<small>Prezzo unitario: ' + money(product.price) + '</small>' +
                    '<div class="cart-controls">' +
                        '<button data-action="minus" data-id="' + key + '" aria-label="Diminuisci quantità">−</button>' +
                        '<span>' + product.qty + '</span>' +
                        '<button data-action="plus" data-id="' + key + '" aria-label="Aumenta quantità">+</button>' +
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<button class="cart-remove" data-action="remove" data-id="' + key + '" aria-label="Rimuovi prodotto">×</button>' +
                    '<strong>' + money(product.price * product.qty) + '</strong>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    document.querySelectorAll('.add-cart').forEach(function (button) {
        button.addEventListener('click', function () {
            var element = button.closest('.product');
            if (!element) return;

            var id = element.dataset.id;

            if (cart[id]) {
                cart[id].qty++;
            } else {
                cart[id] = {
                    name: element.dataset.name,
                    price: Number(element.dataset.price),
                    qty: 1
                };
            }

            renderCart();
            openCart();
        });
    });

    document.querySelectorAll('.cart-open').forEach(function (button) {
        button.addEventListener('click', openCart);
    });

    var closeButton = document.querySelector('.cart-close');
    if (closeButton) closeButton.addEventListener('click', closeCart);

    backdrop.addEventListener('click', closeCart);

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeCart();
    });

    var cartItems = document.getElementById('cartItems');

    if (cartItems) {
        cartItems.addEventListener('click', function (event) {
            var button = event.target.closest('button[data-action]');
            if (!button) return;

            var id = button.dataset.id;
            var action = button.dataset.action;

            if (!cart[id]) return;

            if (action === 'plus') cart[id].qty++;
            if (action === 'minus') cart[id].qty--;

            if (action === 'remove' || cart[id].qty < 1) {
                delete cart[id];
            }

            renderCart();
        });
    }

    document.querySelectorAll('.filter').forEach(function (button) {
        button.addEventListener('click', function () {
            document.querySelectorAll('.filter').forEach(function (element) {
                element.classList.toggle('active', element === button);
            });

            products.forEach(function (product) {
                product.hidden =
                    button.dataset.filter !== 'all' &&
                    product.dataset.category !== button.dataset.filter;
            });
        });
    });

    var checkoutButton = document.getElementById('checkoutDemo');

    if (checkoutButton) {
        checkoutButton.addEventListener('click', function () {
            var keys = Object.keys(cart);
            var message = document.getElementById('checkoutMessage');

            if (!message) return;

            message.hidden = false;

            if (!keys.length) {
                message.textContent =
                    'Il carrello è vuoto: aggiungi un prodotto prima di creare il riepilogo.';
                return;
            }

            var total = keys.reduce(function (sum, key) {
                return sum + cart[key].price * cart[key].qty;
            }, 0);

            message.innerHTML =
                '<strong>Riepilogo dimostrativo</strong><br>' +
                keys.map(function (key) {
                    return cart[key].name + ' × ' + cart[key].qty;
                }).join('<br>') +
                '<br><br><strong>Totale: ' + money(total) + '</strong>' +
                '<br>Nessun ordine inviato e nessun pagamento richiesto.';
        });
    }
})();

// Se la pagina viene aperta direttamente con #negozio nell'indirizzo
if (window.location.hash === '#negozio') {
    apriNegozio();
}