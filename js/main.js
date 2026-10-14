// Immagini: se una foto non si carica, mostra un riquadro grafico MRC al posto dell'icona rotta
(function () {
    var ricambio = 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#1a1a1d"/><stop offset="1" stop-color="#0e4f5f"/></linearGradient></defs>' +
        '<rect width="800" height="500" fill="url(#g)"/>' +
        '<path d="M330 170h50l-40 160h-50z" fill="#16758b"/>' +
        '<path d="M410 170h50l-40 160h-50z" fill="#5fc3d9"/>' +
        '</svg>'
    );

    document.querySelectorAll('img').forEach(function (img) {
        function sostituisci() {
            if (img.dataset.ko) return;
            img.dataset.ko = '1';
            img.classList.add('img-ko');
            img.src = ricambio;
        }

        img.addEventListener('error', sostituisci);
        if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) sostituisci();
    });
})();

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

        var url = 'https://wa.me/393497861240?text=' + encodeURIComponent(messaggio);

        // Da telefono apre direttamente l'app, da computer usa una nuova scheda
        if (window.matchMedia('(pointer: coarse)').matches) {
            window.location.href = url;
        } else {
            window.open(url, '_blank', 'noopener');
        }
    });
}

// ===== VISTA NEGOZIO (pagina separata, senza ricaricare) =====

var posizioneHome = 0;

function mostraNegozio() {
    var negozio = document.getElementById('negozio');
    if (!negozio) return;

    // Ricorda dove eri nella home, per tornarci con la freccia indietro
    if (!document.body.classList.contains('vista-negozio')) {
        posizioneHome = window.pageYOffset || 0;
    }

    // Nasconde la home (tranne negozio e carrello)
    document.querySelectorAll('main > *').forEach(function (el) {
        if (el.id === 'negozio' || el.id === 'cartBackdrop' || el.id === 'cartDrawer') return;
        el.style.display = 'none';
    });

    negozio.hidden = false;
    negozio.removeAttribute('hidden');
    negozio.style.display = 'block';
    negozio.style.paddingTop = '120px';
    negozio.style.minHeight = '100vh';
    document.body.classList.add('vista-negozio');

    if (nv) nv.classList.remove('open');
    if (mb) {
        mb.setAttribute('aria-expanded', 'false');
        mb.textContent = '☰';
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
}

function mostraHome() {
    var negozio = document.getElementById('negozio');

    document.querySelectorAll('main > *').forEach(function (el) {
        if (el.id === 'negozio' || el.id === 'cartBackdrop' || el.id === 'cartDrawer') return;
        el.style.display = '';
    });

    if (negozio) {
        negozio.hidden = true;
        negozio.style.display = 'none';
    }
    document.body.classList.remove('vista-negozio');
}

// Apertura: aggiunge un passaggio alla cronologia, così la freccia indietro funziona
function apriNegozio(event) {
    if (event) event.preventDefault();

    if (window.location.hash !== '#negozio') {
        window.history.pushState({ vista: 'negozio' }, '', '#negozio');
    }
    mostraNegozio();
}

// Frecce avanti/indietro del browser
window.addEventListener('popstate', function () {
    if (window.location.hash === '#negozio') {
        mostraNegozio();
    } else if (document.body.classList.contains('vista-negozio')) {
        // Si esce dal negozio: torna alla home dove eri
        mostraHome();
        window.scrollTo({ top: posizioneHome, behavior: 'instant' });
    }
    // Altrimenti sei già nella home (es. clic su "Lavori"): ci pensa il browser
});

// "Negozio" nel menu e "COMPONENTI AFTERMARKET" nella galleria
document.querySelectorAll('a[href="#negozio"]').forEach(function (link) {
    link.addEventListener('click', apriNegozio);
});

// Dal negozio, i link del menu portano alla home sulla sezione scelta
document.querySelectorAll('nav a, .logo, header .btn').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href === '#negozio' || href.charAt(0) !== '#') return;

    link.addEventListener('click', function (event) {
        if (!document.body.classList.contains('vista-negozio')) return;

        event.preventDefault();
        mostraHome();
        window.history.pushState(null, '', href);

        window.setTimeout(function () {
            var target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    });
});

// Carrello dimostrativo (salvato nel browser)
(function () {
    var drawer = document.getElementById('cartDrawer');
    var backdrop = document.getElementById('cartBackdrop');

    if (!drawer || !backdrop) return;

    var STORAGE_KEY = 'mrc_carrello_v1';
    var cart = {};
    var products = Array.prototype.slice.call(
        document.querySelectorAll('.product')
    );

    // --- Salvataggio e ripristino ---

    function saveCart() {
        try {
            var data = {};
            Object.keys(cart).forEach(function (key) {
                data[key] = cart[key].qty;
            });
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            // Archiviazione non disponibile (es. navigazione privata): il carrello resta solo in memoria
        }
    }

    function loadCart() {
        try {
            var raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return;

            var data = JSON.parse(raw);

            Object.keys(data).forEach(function (id) {
                var qty = parseInt(data[id], 10);
                var element = products.filter(function (p) {
                    return p.dataset.id === id;
                })[0];

                // Nome e prezzo si leggono sempre dalla pagina, si salva solo la quantità
                if (element && qty > 0) {
                    cart[id] = {
                        name: element.dataset.name,
                        price: Number(element.dataset.price),
                        qty: qty
                    };
                }
            });
        } catch (e) {
            cart = {};
        }
    }

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

            saveCart();
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

            saveCart();
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

    // All'avvio: ripristina il carrello salvato
    loadCart();
    renderCart();
})();

// Apertura diretta con #negozio nell'indirizzo
if (window.location.hash === '#negozio') {
    window.history.replaceState({ vista: 'negozio' }, '', '#negozio');
    mostraNegozio();
}