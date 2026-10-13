# MRC Automotive — sito demo

Sito web statico one-page per la demo MRC Automotive. Non richiede installazione, framework o compilazione.

## Struttura

- `index.html` — struttura e contenuti della pagina
- `css/style.css` — stile grafico e layout responsive
- `js/main.js` — menu mobile, interazioni e comportamento del modulo contatti

## Visualizzazione locale

Apri `index.html` nel browser. Per vedere i font e le fotografie esterne serve una connessione Internet.

## Pubblicazione gratuita con GitHub Pages

1. Crea un repository GitHub, ad esempio `mrc-automotive`.
2. Carica **tutti** i file e le cartelle di questa cartella mantenendo la struttura.
3. Nel repository apri **Settings → Pages**.
4. In **Build and deployment**, seleziona **Deploy from a branch**.
5. Seleziona il branch `main` e la cartella `/ (root)`, poi salva.
6. Attendi la pubblicazione: GitHub mostrerà l'indirizzo del sito nella stessa pagina Pages.

Importante: `index.html` deve rimanere nella cartella principale del repository, non dentro un'altra sottocartella.

## Prima di presentarlo o pubblicarlo

- Le immagini sono caricate da URL esterni Unsplash: serve Internet. Sostituiscile con fotografie originali di MRC o immagini per cui hai i diritti d'uso.
- Verifica indirizzo, telefono, Instagram, orari e ogni informazione aziendale con MRC.
- Il modulo contatti può aprire WhatsApp; controlla il numero destinatario in `js/main.js` prima dell'uso reale.
- Questa è una demo statica: non contiene un backend né salva dati su un server.
