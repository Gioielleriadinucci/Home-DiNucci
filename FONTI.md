# Fonti della nuova home

Tutti i file pubblicati dalla nuova home si trovano dentro `nuova-home/`. La sola immagine reinterpretata con intelligenza artificiale è indicata esplicitamente qui sotto e nella relativa scheda di provenienza.

## Immagini

- Le immagini dei gioielli e della storia provengono dalla repository originale della Gioielleria Di Nucci. Le serie `images/catalog-fedi-*`, `images/catalog-fidanzamento-*`, `images/catalog-perle-*`, `images/catalog-anelli-*` e `images/catalog-bracciali-*` sono copie locali degli asset presenti in `img/uploads/`, scelte per corrispondere alle rispettive categorie.
- L'impostazione espositiva del catalogo riprende il riferimento indicato dal cliente, <https://ansuini.it/>, senza copiarne fotografie o testi.
- `images/negozio-1.png`–`images/negozio-4.png` derivano dagli scatti del negozio forniti dal cliente (`7.png`–`10.png`).
- `images/esterno-di-nucci.jpeg` è la fotografia dell'esterno fornita dal cliente come `17.jpeg`.
- `images/esterno-di-nucci-hero.png` è la nuova fotografia dell'ingresso fornita dal cliente per la hero; nella timeline viene mostrata con un ritaglio orizzontale CSS centrato sull'insegna e sull'ingresso.
- `images/timeline-novara-stazione-1900.jpg` è una fotografia autentica della stazione ferroviaria di Novara, datata circa 1900 e pubblicata su Wikimedia Commons come pubblico dominio: <https://commons.wikimedia.org/wiki/File:Stazione_ferroviaria_di_Novara_-_binari.jpg>. Resta archiviata localmente ma non viene più caricata dalla pagina. Anche `images/timeline-corso-cavour-1945.jpg`, proveniente dal Fondo Bonzanini dell'ISRN "Piero Fornara", resta archiviata localmente e non viene caricata perché il suo uso commerciale richiede l'autorizzazione del titolare.
- `images/timeline-corso-cavour-1900-restored.png` è una reinterpretazione restaurata di una cartolina di Corso Cavour a Novara dei primi del Novecento, edita da G. Modiano & Co. (Milano), n. 3219. È usata nella prima tappa della timeline, che racconta le origini dell'attività in Corso Cavour 11. Provenienza, intervento e valutazione sui diritti sono documentati in `images/timeline-corso-cavour-1900-restored.SOURCE.md`.
- La precedente fotografia richiamata dalla scheda pubblica della Gioielleria Di Nucci su LeMieNozze.it non viene più caricata dalla pagina.
- `images/timeline-viale-roma-1991.png` è un ritaglio 16:9 dell'ortofoto ufficiale in bianco e nero di Viale Roma, centrato sul civico 17/A. Il quadro regionale `NOVARA SUD` indica `anno_volo = 1991`. Fonte: Regione Piemonte, servizio WMS `Ortofoto 1980-1990 Regione Piemonte`: <https://webgis.arpa.piemonte.it/agportal/home/item.html?id=191940e57ffa4a1893eb019a48a088f8>. Licenza CC BY 4.0: <https://creativecommons.org/licenses/by/4.0/deed.it>. Il ritaglio non altera il contenuto fotografico ed è presentato nella timeline come “Viale Roma vista dall'alto, 1991”.
- `images/compro-oro-pesatura.jpg` è “Weighing gold” di Mauro Cateb, Wikimedia Commons, licenza CC BY-SA 4.0: <https://commons.wikimedia.org/wiki/File:Weighing_gold.jpg>. Nella pagina viene usata come fotografia di sfondo con ritaglio CSS, senza alterare il file originale; l'attribuzione è spostata dal banner al footer.

- `images/timeline-terza-generazione.jpg` è “Hands Arranging Rings on Display” di Antoni Shkraba Studio, scaricata da Pexels con licenza Pexels: <https://www.pexels.com/photo/hands-arranging-rings-on-display-7167031/>. Nella timeline illustra la cura quotidiana dell'esposizione dei gioielli, senza mostrare volti riconoscibili.

## Informazioni e Google Business

- Storia, indirizzo, telefono fisso ed email sono ricavati dai contenuti originali presenti nella repository. Nella CTA Contatti viene utilizzato esclusivamente il numero fisso della gioielleria.
- La sezione Recensioni incorpora direttamente la scheda Google Maps dell'attività e rimanda al Profilo Google Business tramite il CID già presente nel sito originale. La mappa è caricata da Google; valutazione, conteggio e singole recensioni non sono copiati o simulati nel codice della home.
- Il pulsante “Lascia una recensione” usa il riferimento Google dell'attività. Per un collegamento breve proprietario è possibile sostituirlo con quello esportato dal pannello Google Business Profile, senza altre modifiche alla pagina.
- Un carosello automatico con i testi delle singole recensioni richiede un'applicazione registrata e credenziali OAuth 2.0 del proprietario: è il requisito indicato dalla documentazione ufficiale per l'endpoint `accounts.locations.reviews.list` (<https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list>). Le credenziali non vanno inserite nel JavaScript pubblico della home; in loro assenza è stato mantenuto il collegamento live e verificabile al Profilo Google.

## Catalogo marchi

Le immagini del Catalogo sono copie locali ordinate in `images/catalog-brands/<marchio>/<categoria>/`. Non vengono effettuati hotlink dal sito pubblicato. I dati visualizzati sono centralizzati in `js/catalog-data.js`; ogni prodotto conserva marchio, categoria, titolo, immagine locale, collezione, testo alternativo, fonte e badge.

### Fonti primarie e categorie incluse

- **Miluna** — sito ufficiale: <https://www.miluna.it/>; [anelli con perle](https://www.miluna.it/collections/anelli-con-perle); [orecchini di perle](https://www.miluna.it/pages/orecchini-perle). Categorie: Gemma del Cielo, Fili di perle Oriente, Bracciali di perle, Anelli con perle, Orecchini di perle, Gioielli con diamanti.
- **Unoaerre** — catalogo ufficiale fedi: <https://www.unoaerre.it/it/fedi/>; Classiche: <https://www.unoaerre.it/it/matrimonio-e-fidanzamento/fedi-nuziali/fedi-classiche/>; Comode: <https://www.unoaerre.it/it/matrimonio-e-fidanzamento/fedi-nuziali/fedi-comode/fedi/>; Brillanti Promesse: <https://www.unoaerre.it/it/matrimonio-e-fidanzamento/fedi-nuziali/brillanti-promesse/>. Il sito ufficiale applica un controllo anti-bot alle immagini: gli asset prodotto sono stati verificati anche tramite GioiaPura (<https://www.gioiapura.it/gioielli-fedi-unoaerre-C22B53.htm>), Gioielloro (<https://www.gioielloro.it/it/fedi-comode-unoaerre/>) e Gioielleria Lucchese (<https://www.gioiellerialucchese.it/64-fedi-unoaerre-cerchi-di-luce>). Categorie: Fedi classiche, Fedi comode, Fedi bicolore, Fedi in oro rosa, Cerchi di Luce, Brillanti Promesse.
- **Polello** — pagina ufficiale fedi e collezioni: <https://www.polello.com/gioielli/fedi/>. Categorie: Fedi artigianali personalizzabili, Petalo d'Amore, Fedi bicolore e tre ori, Fedi in oro Champagne, Fedi in platino, My Clouds oro e argento.
- **Comete** — pagine ufficiali dedicate a [perle](https://www.comete.it/prodotti/collane-girocolli-fili-ciondolo-perle-oro-diamanti-donna), [smeraldi](https://www.comete.it/prodotti/collane-girocolli-smeraldi-oro-diamanti-gioielli-donna), [rubini e zaffiri](https://www.comete.it/prodotti/orecchini-zaffiri-oro-diamanti-donna), [trilogy](https://www.comete.it/prodotti/anelli-fedine-trilogy-oro-bianco-giallo-rose-diamanti-pietre-preziose-smeraldi-rubini-zaffiri), [uomo](https://www.comete.it/prodotti/bracciali-collane-acciaio-pvd-pietre-preziose-gioielli-uomo) e [gioielli donna](https://www.comete.it/prodotti/gioielli-donna-collane-orecchini-anelli-bracciali-oro-diamanti-zaffiri-rubini-smeraldi-acquamarina-perle-topazio). Categorie: Fili di perle, Acquamarina, Smeraldi, Rubini e zaffiri, Anelli trilogy, Gioielli uomo.
- **Greggio Argento** — sito e catalogo ufficiale: <https://greggio.com/> e <https://www.greggio.com/wp-content/uploads/2021/06/catalogo-Argento.pdf>. Categorie: Champagne e cocktail, Servizi tè e caffè, Candelabri e candelieri.
- **Ottaviani** — sito ufficiale: <https://www.ottaviani.com/it>. Il catalogo ufficiale risultava in manutenzione; i prodotti sono stati incrociati con [2B Gioielli](https://2bgioielli.it/collections/ottaviani) e, per verificare il materiale Argento 925, con le [schede Ottaviani di GioiaPura](https://www.gioiapura.it/donna-gioielli-ottaviani-G2C2B252.htm). Categorie: Bijoux, Gioielli in argento, Sculture e complementi.

### Criteri ed esclusioni

- Sono state pubblicate soltanto categorie con almeno tre prodotti e tre immagini verificabili; il totale aggiornato è di 33 categorie e 400 prodotti.
- L'ampliamento del 2 agosto 2026 aggiunge 236 fotografie locali e distinte. Sono state aggiunte 10 fotografie a ogni categoria quando le fonti ne offrivano abbastanza; per rispettare il divieto di duplicati e le esclusioni richieste, l'incremento si ferma a 9 per Comete Rubini e zaffiri, 5 per Greggio Champagne e cocktail, 3 per Greggio Servizi tè e caffè, 2 per Greggio Candelabri e candelieri, 9 per Polello Petalo d'Amore, 1 per Polello My Clouds, 9 per Unoaerre Fedi in oro rosa e 8 per Unoaerre Cerchi di Luce.
- Non sono state create categorie da una singola referenza. Sono quindi escluse, fra le altre, le aree Ottaviani con meno di tre articoli nel feed verificato (penne e sacro) e le sottolinee Miluna/Comete non documentate da almeno tre immagini nella stessa fonte.
- Le immagini sono state salvate come JPEG/PNG locali nelle dimensioni distribuite dalle fonti. Non contengono watermark del rivenditore né il marchio Di Nucci; il badge corretto viene composto in HTML sopra la fotografia.
- Le cover di marchio sono separate dagli asset prodotto. Per Miluna, Unoaerre, Polello e Ottaviani sono state scelte fotografie illustrative distribuite con [licenza Unsplash](https://unsplash.com/license), che consente l'uso gratuito anche commerciale. Non raffigurano prodotti ufficiali dei marchi e vengono quindi descritte come immagini evocative nei testi alternativi.

### Cover illustrative con licenza commerciale

- **Miluna** — donna con filo di perle, foto di Kateryna Hliznitsova: <https://unsplash.com/photos/woman-wearing-a-pearl-necklace-and-earrings-FuhxbFilJhg>.
- **Unoaerre** — coppia di sposi con fedi, foto di Raymond Petrik: <https://unsplash.com/photos/a-close-up-of-two-people-holding-hands-fUSKk57u8pI>.
- **Polello** — orafo al banco mentre lavora un anello, foto di Jeremy Hoye: <https://unsplash.com/photos/jeweler-working-with-a-ring-in-a-workshop-k8Z_6TJJByM>.
- **Ottaviani** — still life di bijoux in argento con ametiste e cristalli, foto di atelierbyvineeth: <https://unsplash.com/photos/amethyst-jewelry-and-raw-crystal-on-textured-paper--6ZcXyLWurk>.
