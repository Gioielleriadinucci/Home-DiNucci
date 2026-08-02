(() => {
  "use strict";

  const assetRoot = "images/catalog-brands";
  const pad = (value) => String(value).padStart(2, "0");

  const makeCategory = (brand, brandId, id, name, collection, source, reason, products, folder = id) => ({
    id,
    name,
    collection,
    source,
    reason,
    products: products.map((entry, index) => {
      const item = typeof entry === "string" ? { title: entry } : entry;
      return {
        brand,
        category: name,
        title: item.title,
        image: `${assetRoot}/${item.image || `${brandId}/${folder}/${pad(index + 1)}.jpg`}${brandId === "unoaerre" ? "?v=20260731-hd" : ""}`,
        collection: item.collection || collection,
        alt: `${item.title}, ${brand}`,
        source: item.source || source,
        badge: brand
      };
    })
  });

  const milunaSource = "https://www.miluna.it/";
  const unoaerreSource = "https://www.unoaerre.it/it/fedi/";
  const polelloSource = "https://www.polello.com/gioielli/fedi/";
  const cometeSource = "https://www.comete.it/";
  const greggioSource = "https://greggio.com/";
  const ottavianiSource = "https://www.ottaviani.com/it";
  const ottavianiDealer = "https://2bgioielli.it/collections/ottaviani";

  window.catalogBrandData = [
    {
      id: "miluna",
      name: "MILUNA",
      source: milunaSource,
      cover: {
        image: `${assetRoot}/miluna/cover-licensed.jpg`,
        alt: "Immagine evocativa di una donna con filo di perle",
        source: "https://unsplash.com/photos/woman-wearing-a-pearl-necklace-and-earrings-FuhxbFilJhg"
      },
      categories: [
        makeCategory("MILUNA", "miluna", "gemma-del-cielo", "Gemma del Cielo", "Gemma del Cielo", milunaSource, "Linea riconoscibile in argento, topazi bianchi e Gemma del Cielo.", [
          "Anello con Gemma del Cielo ovale e topazi bianchi",
          "Bracciale con Gemma del Cielo a cuore e topazi bianchi",
          "Bracciale con Gemma del Cielo ovale e topazi bianchi",
          "Collana con Gemma del Cielo a cuore e topazi bianchi"
        ]),
        makeCategory("MILUNA", "miluna", "perle-oriente", "Fili di perle Oriente", "Perle Oriente", "https://www.miluna.it/pages/collane-e-bracciali-di-perle", "Il filo di perle è una specializzazione centrale e storica di Miluna.", [
          "Collana di perle Oriente con chiusura in oro bianco 40 cm",
          "Collana di perle Oriente con distanziali in oro e diamanti",
          "Filo di perle Oriente 40 cm con chiusura in oro bianco",
          "Filo di perle Oriente 45 cm con chiusura in oro bianco"
        ]),
        makeCategory("MILUNA", "miluna", "bracciali-di-perle", "Bracciali di perle", "Perle Oriente", "https://www.miluna.it/pages/collane-e-bracciali-di-perle", "Categoria dedicata alle variazioni di chiusura e centrale.", [
          "Bracciale di perle con dischi di diamanti e oro bianco",
          "Bracciale di perle Oriente con chiusura in oro bianco",
          "Bracciale di perle Oriente con centrale e giro di diamanti"
        ]),
        makeCategory("MILUNA", "miluna", "anelli-con-perle", "Anelli con perle", "Perle", "https://www.miluna.it/collections/anelli-con-perle", "La perla diventa protagonista in anelli verificati in oro o argento.", [
          "Anello Anastasia con perla Oriente e topazi taglio goccia",
          "Anello Andromeda con perla Oriente circondata da topazi bianchi",
          "Anello Andromeda con quattro perle Oriente e topazi bianchi",
          "Anello Celestia con perla Oriente, Gemma del Cielo e topazio bianco"
        ]),
        makeCategory("MILUNA", "miluna", "orecchini-di-perle", "Orecchini di perle", "Perle", "https://www.miluna.it/pages/orecchini-perle", "Modelli a lobo, cerchio e pendenti con perle Oriente verificati sul catalogo ufficiale.", [
          "Orecchini a cerchio Eclissi con perle Oriente e topazi",
          "Orecchini a cerchio Venere con perle Oriente e pavé di topazi",
          "Orecchini a lobo Celestia con perle Oriente e Gemma del Cielo",
          "Orecchini Anastasia pendenti con perle Oriente e topazi"
        ]),
        makeCategory("MILUNA", "miluna", "gioielli-con-diamanti", "Gioielli con diamanti", "Diamanti", milunaSource, "Selezione generale e non duplicata di anelli, collane, bracciali e orecchini con diamanti.", [
          { title: "Anello rivière con cinque diamanti a scalare", image: "miluna/diamanti-iconici/01.webp" },
          { title: "Bracciale tennis di diamanti in oro bianco", image: "miluna/diamanti-iconici/03.webp" },
          { title: "Collana punto luce a valentino in oro bianco", image: "miluna/diamanti-valentino/02.webp" },
          { title: "Orecchini di diamanti a cerchio 15 mm", image: "miluna/orecchini-diamanti/01.webp" }
        ])
      ]
    },
    {
      id: "unoaerre",
      name: "UNOAERRE",
      source: unoaerreSource,
      cover: {
        image: `${assetRoot}/unoaerre/cover-licensed.jpg`,
        alt: "Immagine evocativa di una coppia di sposi con fedi nuziali",
        source: "https://unsplash.com/photos/a-close-up-of-two-people-holding-hands-fUSKk57u8pI"
      },
      categories: [
        makeCategory("UNOAERRE", "unoaerre", "fedi-classiche", "Fedi classiche", "Fedi Classiche", "https://www.gioiapura.it/gioielli-fedi-unoaerre-C22B53.htm", "Famiglia tradizionale distinta per peso e larghezza.", [
          "Fede Classica 50 AFN 1 in oro giallo",
          "Fede Classica 30 AFN 1 in oro giallo",
          "Fede Classica 40 AFN 1 in oro giallo",
          "Fede Classica 80 AFN 1 in oro giallo"
        ]),
        makeCategory("UNOAERRE", "unoaerre", "fedi-comode", "Fedi comode", "Comode", "https://www.gioiapura.it/fedi-unoaerre-comode.htm", "La lavorazione interna arrotondata determina una vestibilità specifica.", [
          "Fede Comoda 50 AFC 1 in oro giallo",
          "Fede Comoda 40 AFC 1 in oro bianco",
          "Fede Comoda 30 AFC 1 in oro bianco",
          "Fede Comoda 40 AFC 1 in oro giallo"
        ]),
        makeCategory("UNOAERRE", "unoaerre", "fedi-bicolore", "Fedi bicolore", "Fedi nuziali", "https://www.gioiapura.it/gioielli-fedi-unoaerre-C22B53.htm", "Il contrasto fra metalli è la caratteristica comune della selezione.", [
          "Fede Eclissi bicolore 70 AFC 283",
          "Fede Cassiopea bicolore 70 AFC 282",
          "Fede Andromeda bicolore 50 AFC 281",
          "Fede Cassiopea bicolore con diamante 50 AFC 282"
        ]),
        makeCategory("UNOAERRE", "unoaerre", "fedi-rosa", "Fedi in oro rosa", "Fedi nuziali", "https://www.gioiapura.it/gioielli-fedi-unoaerre-C22B53.htm", "L'oro rosa è una variante materiale verificata.", [
          "Fede Classica 40 AFN 4 in oro rosa",
          "Fede Comoda 40 AFC 1 in oro rosa",
          "Fede Anniversario 24 AFC 011 in oro rosa",
          "Fede Anniversario 50 AFC 53 in oro rosa"
        ]),
        makeCategory("UNOAERRE", "unoaerre", "cerchi-di-luce", "Cerchi di Luce", "Cerchi di Luce", "https://www.gioiapura.it/fedi-unoaerre-cerchi-di-luce.htm", "Design e sigillo distinguono questa linea dalle fedi tradizionali.", [
          "Fede Eclissi bicolore 70 AFC 283",
          "Fede Cerchi di Luce 35 AFC 2 in oro giallo",
          "Fede Cerchi di Luce 50 AFC 111 in oro bianco",
          "Fede Cerchi di Luce 35 AFC 2 con diamante"
        ]),
        makeCategory("UNOAERRE", "unoaerre", "brillanti-promesse", "Brillanti Promesse", "Brillanti Promesse", "https://www.gioiapura.it/fedi-unoaerre-brillanti-promesse.htm", "Linea nuziale preziosa con profili, colori e diamanti differenziati.", [
          "Fede Andromeda slim con diamante 50 AFC 281",
          "Fede Cassiopea slim bicolore 50 AFC 282",
          "Fede Corona in oro bianco 40 AFC 278",
          "Fede Brillanti Promesse 40 AFC 279"
        ])
      ]
    },
    {
      id: "polello",
      name: "POLELLO",
      source: polelloSource,
      cover: {
        image: `${assetRoot}/polello/cover-licensed.jpg`,
        alt: "Immagine evocativa di un orafo che lavora un anello al banco",
        source: "https://unsplash.com/photos/jeweler-working-with-a-ring-in-a-workshop-k8Z_6TJJByM"
      },
      categories: [
        makeCategory("POLELLO", "polello", "fedi-artigianali", "Fedi artigianali personalizzabili", "Fedi artigianali", polelloSource, "Lavorazione artigianale e configurazione di metalli, finiture e dettagli.", [
          "Fedi Attimo 2337DB",
          "Fedi Abbracciami 2503DB",
          "Fedi Amami 2546DB",
          "Fedi Anima 2693DB"
        ], "oro-bianco"),
        makeCategory("POLELLO", "polello", "petalo-amore", "Petalo d'Amore", "Petalo d'Amore", polelloSource, "Collezione ufficiale con oro bianco o champagne e diamante.", [
          "Fede oro champagne e diamante 3367DCH",
          "Fede oro champagne e diamante 3403DCH",
          "Fede oro bianco e diamante 3405DB",
          "Fede oro bianco e diamante 3408DB"
        ]),
        makeCategory("POLELLO", "polello", "bicolore", "Fedi bicolore e tre ori", "Fedi artigianali", polelloSource, "Gli accostamenti di metallo evidenziano incastri e superfici differenti.", [
          "Fedi Abbagliante 1803DBG",
          "Fedi Amore 2835DBR",
          "Fedi Abbraccio Prezioso 2838DBR",
          "Fedi Alba d'Amore 3115DBR"
        ]),
        makeCategory("POLELLO", "polello", "oro-champagne", "Fedi in oro Champagne", "Fedi artigianali", polelloSource, "Tonalità distintiva del marchio con incisioni e dettagli di diamante.", [
          "Fedi A noi 3177DCH",
          "Fedi Champagne! 3178DCH",
          "Fedi Brindisi d'amore 3179DCH",
          "Fede oro champagne e diamante 3367DCH"
        ]),
        makeCategory("POLELLO", "polello", "platino", "Fedi in platino", "Anniversario 50", polelloSource, "Accostamenti tecnici fra platino, oro, argento e diamanti multiforma.", [
          "Fedi oro giallo, platino e diamanti 3449",
          "Fedi oro giallo, platino e diamanti baguette 3450",
          "Fedi platino, oro rosa e diamanti multiforma 3451",
          "Fedi platino, argento e diamante 3455"
        ]),
        makeCategory("POLELLO", "polello", "my-clouds", "My Clouds oro e argento", "My Clouds", polelloSource, "La collezione combina argento con quattro metalli e finiture diverse.", [
          "Fedi oro rosa, argento e diamante 3454",
          "Fedi platino, argento e diamante 3455",
          "Fedi oro giallo, argento e diamante 3456",
          "Fedi oro champagne, argento e diamante 3457"
        ])
      ]
    },
    {
      id: "comete",
      name: "COMETE",
      source: cometeSource,
      cover: {
        image: `${assetRoot}/comete/cover.jpg`,
        alt: "Segno istituzionale Comete Gioielli",
        source: cometeSource
      },
      categories: [
        makeCategory("COMETE", "comete", "perle-amore", "Fili di perle", "Fili di Perle Acquadolce", "https://www.comete.it/prodotti/collane-girocolli-fili-ciondolo-perle-oro-diamanti-donna", "Fili classici e diamantati del catalogo donna.", [
          "Collana filo di perle in oro Acquadolce",
          "Girocollo filo di perle Acquadolce in oro",
          "Girocollo filo di perle in oro e diamanti",
          "Collana filo di perle diamantate in oro"
        ]),
        makeCategory("COMETE", "comete", "acquamarina", "Acquamarina", "Acquamarina", "https://www.comete.it/prodotti/gioielli-donna-collane-orecchini-anelli-bracciali-oro-diamanti-zaffiri-rubini-smeraldi-acquamarina-perle-topazio", "La pietra attraversa anelli, collane e orecchini con tagli diversi.", [
          "Anello in oro, diamanti e acquamarina ovale",
          "Collana in oro, diamanti e acquamarina cuore",
          "Orecchini in oro, diamanti e acquamarina goccia",
          "Orecchini in oro, diamanti e acquamarina cuore"
        ]),
        makeCategory("COMETE", "comete", "smeraldi", "Smeraldi", "Smeraldi", "https://www.comete.it/prodotti/collane-girocolli-smeraldi-oro-diamanti-gioielli-donna", "La pietra è protagonista in tagli tondi, ovali e antichi.", [
          "Collana in oro, diamante e smeraldo tondo",
          "Girocollo in oro, diamanti e smeraldo ovale",
          "Girocollo in oro, diamante e smeraldo tondo",
          "Girocollo in oro, diamanti e smeraldo antico"
        ], "collane-smeraldi"),
        makeCategory("COMETE", "comete", "rubini-zaffiri", "Rubini e zaffiri", "Pietre preziose", "https://www.comete.it/prodotti/orecchini-zaffiri-oro-diamanti-donna", "Rubini e zaffiri riuniti in una selezione verificata di collane, anelli e orecchini.", [
          "Girocollo in oro, diamanti e rubino goccia",
          "Orecchini in oro, diamanti e rubini goccia",
          "Anello in oro, diamanti e zaffiro goccia",
          "Orecchini in oro, diamanti e zaffiri blu ovali"
        ]),
        makeCategory("COMETE", "comete", "anelli-trilogy", "Anelli trilogy", "Trilogy", "https://www.comete.it/prodotti/anelli-fedine-trilogy-oro-bianco-giallo-rose-diamanti-pietre-preziose-smeraldi-rubini-zaffiri", "Tipologia autonoma con versioni classica, Valentino e bicolore.", [
          "Trilogy classico in oro e diamante 1689",
          "Trilogy classico in oro e diamante 2132",
          "Trilogy Valentino in oro e diamante",
          "Trilogy bicolore in oro e diamante"
        ]),
        makeCategory("COMETE", "comete", "gioielli-uomo", "Gioielli uomo", "Uomo", "https://www.comete.it/prodotti/bracciali-collane-acciaio-pvd-pietre-preziose-gioielli-uomo", "Acciaio, PVD, diamanti e pietre naturali costituiscono una linea maschile distinta.", [
          "Bracciale in acciaio PVD rosé e diamanti bianchi",
          "Bracciale in acciaio PVD rosé e diamanti neri",
          "Bracciale catena bicolore in acciaio",
          "Bracciale in acciaio con rodocrosite ed ematite"
        ])
      ]
    },
    {
      id: "greggio",
      name: "GREGGIO ARGENTO",
      source: greggioSource,
      cover: {
        image: `${assetRoot}/greggio/candelabri-candelieri/04.jpg`,
        alt: "Candelabro inglese a tre fiamme in argento Greggio",
        source: greggioSource
      },
      categories: [
        makeCategory("GREGGIO ARGENTO", "greggio", "champagne-cocktail", "Champagne e cocktail", "Tavola", "https://www.greggio.com/shop/it/prodotti/tavola/bar-e-vino.html", "Secchi, caraffe e accessori per il servizio di champagne, cocktail e aperitivi.", [
          { title: "Caraffa Goccia", image: "greggio/bar/01.webp" },
          { title: "Secchio Magnum tre bottiglie", image: "greggio/bar/02.webp" },
          { title: "Porta salatini", image: "greggio/bar/03.webp" },
          { title: "Secchio ghiaccio Manhattan", image: "greggio/bar/04.webp" }
        ]),
        makeCategory("GREGGIO ARGENTO", "greggio", "servizi-te-caffe", "Servizi tè e caffè", "Tavola", "https://greggio.com/product-category/tavola/accessori-colazione-te/", "Servizi coordinati e accessori Greggio dedicati al rito del tè e del caffè.", [
          { title: "Servizio caffè / tè Accenti", image: "greggio/servizi-te-caffe/01.webp", collection: "Accenti", source: "https://greggio.com/prodotto/servizio-caffe-the-accenti/" },
          { title: "Teiera liscia da due tazze", image: "greggio/servizi-te-caffe/02.webp", source: "https://greggio.com/prodotto/teiera/" },
          { title: "Misurino tè e colino tè", image: "greggio/servizi-te-caffe/03.webp", source: "https://greggio.com/prodotto/misurino-te-e-colino-te/" },
          { title: "Molla zucchero", image: "greggio/servizi-te-caffe/04.webp", source: "https://greggio.com/prodotto/molla-zucchero/" },
        ]),
        makeCategory("GREGGIO ARGENTO", "greggio", "candelabri-candelieri", "Candelabri e candelieri", "Home Decor", "https://greggio.com/?s=candeliere&post_type=product", "Candelieri e candelabri Greggio per l'illuminazione decorativa della tavola e della casa.", [
          { title: "Candeliere Colonna h. 15 cm", image: "greggio/candelabri-candelieri/01.webp", collection: "Colonna", source: "https://greggio.com/prodotto/candeliere-colonna/" },
          { title: "Candeliere Inglese h. 23 cm", image: "greggio/candelabri-candelieri/02.webp", collection: "Inglese", source: "https://greggio.com/prodotto/candeliere-h-23-cm/" },
          { title: "Candeliere Inglese h. 28 cm", image: "greggio/candelabri-candelieri/03.webp", collection: "Inglese", source: "https://greggio.com/prodotto/candeliere-h-28-cm/" },
          { title: "Candelabro Inglese a 3 fiamme", image: "greggio/candelabri-candelieri/04.webp", collection: "Inglese", source: "https://greggio.com/prodotto/candelabro-3-fiamme/" },
          { title: "Candelabro Inglese a 5 fiamme", image: "greggio/candelabri-candelieri/05.webp", collection: "Inglese", source: "https://greggio.com/prodotto/candelabro-5-fiamme/" }
        ])
      ]
    },
    {
      id: "ottaviani",
      name: "OTTAVIANI",
      source: ottavianiSource,
      cover: {
        image: `${assetRoot}/ottaviani/cover-licensed.jpg`,
        alt: "Immagine evocativa di bijoux in argento con ametiste e cristalli",
        source: "https://unsplash.com/photos/amethyst-jewelry-and-raw-crystal-on-textured-paper--6ZcXyLWurk"
      },
      categories: [
        makeCategory("OTTAVIANI", "ottaviani", "bijoux", "Bijoux", "Bijoux donna", ottavianiDealer, "Selezione trasversale di bracciali, collane e orecchini rodiati con cristalli e zirconi.", [
          { title: "Bracciale donna 501048B", image: "ottaviani/bracciali/01.webp" },
          { title: "Bracciale donna 501131B", image: "ottaviani/bracciali/02.webp" },
          { title: "Collana donna 501131C", image: "ottaviani/collane/01.webp" },
          { title: "Orecchini donna 501131O", image: "ottaviani/orecchini/01.webp" },
          { title: "Orecchini donna 501130O", image: "ottaviani/bijoux-extra/05.webp", source: "https://2bgioielli.it/products/orecchini-ottaviani-donna-501130o" },
          { title: "Orecchini donna 501125O", image: "ottaviani/bijoux-extra/06.webp", source: "https://2bgioielli.it/products/orecchini-ottaviani-donna-501125o" },
          { title: "Orecchini donna 501117O", image: "ottaviani/bijoux-extra/07.webp", source: "https://2bgioielli.it/products/orecchini-ottaviani-donna-501117o" },
          { title: "Collana donna 501130C", image: "ottaviani/bijoux-extra/08.webp", source: "https://2bgioielli.it/products/collana-ottaviani-donna-501130c" },
          { title: "Collana donna 501129C", image: "ottaviani/bijoux-extra/09.webp", source: "https://2bgioielli.it/products/collana-ottaviani-donna-501129c" },
          { title: "Collana donna 501125C", image: "ottaviani/bijoux-extra/10.webp", source: "https://2bgioielli.it/products/collana-ottaviani-donna-501125c" },
          { title: "Bracciale donna 501130B", image: "ottaviani/bijoux-extra/11.webp", source: "https://2bgioielli.it/products/bracciale-ottaviani-donna-501130b" },
          { title: "Bracciale donna 501125B", image: "ottaviani/bijoux-extra/12.webp", source: "https://2bgioielli.it/products/bracciale-ottaviani-donna-501125b" },
          { title: "Bracciale donna 501117B", image: "ottaviani/bijoux-extra/13.webp", source: "https://2bgioielli.it/products/bracciale-ottaviani-donna-501117b" },
          { title: "Orecchini donna 501100O", image: "ottaviani/bijoux-extra/14.webp", source: "https://2bgioielli.it/products/orecchini-ottaviani-donna-501100o" }
        ]),
        makeCategory("OTTAVIANI", "ottaviani", "gioielli-in-argento", "Gioielli in argento", "Argento 925", ottavianiSource, "Prodotti verificati in argento 925 sul sito ufficiale e presso rivenditori specializzati.", [
          "Collana in argento 925 con pendente 600083C",
          "Bracciale rigido in argento 925 Elegance 47827",
          "Orecchini Unica in argento rodiato 925 490231",
          "Collana Croce Smeraldo in argento 925 48316",
          { title: "Bracciale con charms in argento 925 600233B", image: "ottaviani/gioielli-argento-extra/05.webp", source: "https://www.gioiapura.it/bracciale-con-charms-donna-argento-925-gioiello-ottaviani-600233b-P176340.htm" },
          { title: "Anello in argento 925 600148A-16", image: "ottaviani/gioielli-argento-extra/06.webp", source: "https://www.gioiapura.it/anello-donna-gioielli-ottaviani-600148a-16-P152122.htm" },
          { title: "Anello in argento 925 600147A-12", image: "ottaviani/gioielli-argento-extra/07.webp", source: "https://www.gioiapura.it/anello-donna-gioielli-ottaviani-600147a-12-P152113.htm" },
          { title: "Orecchini in argento 925 600151O", image: "ottaviani/gioielli-argento-extra/08.webp", source: "https://www.gioiapura.it/orecchini-donna-gioielli-ottaviani-600151o-P152132.htm" },
          { title: "Orecchini in argento 925 600131O", image: "ottaviani/gioielli-argento-extra/09.webp", source: "https://www.gioiapura.it/orecchini-donna-gioielli-ottaviani-600131o-P152102.htm" },
          { title: "Collana Elegance in argento 925 501119C", image: "ottaviani/gioielli-argento-extra/10.webp", source: "https://www.gioiapura.it/collana-argento-925-con-pendente-donna-ottaviani-elegance-501119c-P427548.htm" },
          { title: "Collana con pendente in argento 925 600082C", image: "ottaviani/gioielli-argento-extra/11.webp", source: "https://www.gioiapura.it/collana-argento-925-con-pendente-donna-ottaviani-600082c-P313893.htm" },
          { title: "Collana in argento 925 600171C", image: "ottaviani/gioielli-argento-extra/12.webp", source: "https://www.gioiapura.it/collana-donna-gioielli-ottaviani-600171c-P152157.htm" },
          { title: "Collana in argento 925 600131C", image: "ottaviani/gioielli-argento-extra/13.webp", source: "https://www.gioiapura.it/collana-donna-gioielli-ottaviani-600131c-P152101.htm" },
          { title: "Collana in argento 925 600149C", image: "ottaviani/gioielli-argento-extra/14.webp", source: "https://www.gioiapura.it/collana-donna-gioielli-ottaviani-600149c-P152127.htm" }
        ]),
        makeCategory("OTTAVIANI", "ottaviani", "sculture-complementi", "Sculture e complementi", "Home Design", ottavianiDealer, "Cristallo, porcellana e complementi decorativi per la casa.", [
          "Scrigno in cristallo",
          "Alzata in cristallo 30 cm",
          "Profumatore in porcellana 9 cm",
          "Candelabro a tre fiamme",
          { title: "Scultura Toro in cristallo 800488", image: "ottaviani/oggettistica-extra/05.webp", source: "https://2bgioielli.it/products/scultura-ottaviani-toro-800488" },
          { title: "Profumatore e candela 31487", image: "ottaviani/oggettistica-extra/06.webp", source: "https://2bgioielli.it/products/profumatore-e-candela-ottaviani-31487" },
          { title: "Centrotavola Fiamma 15 cm — 800478N", image: "ottaviani/oggettistica-extra/07.webp", source: "https://2bgioielli.it/products/centrotavola-ottaviani-800478n" },
          { title: "Centrotavola Foglie 26 cm — 77217", image: "ottaviani/oggettistica-extra/08.webp", source: "https://2bgioielli.it/products/centrotavola-ottaviani-77217" },
          { title: "Vaso Marea in cristallo 800470", image: "ottaviani/oggettistica-extra/09.webp", source: "https://2bgioielli.it/products/vaso-ottaviani-marea-800470" },
          { title: "Scultura Pesce dei Desideri 800487", image: "ottaviani/oggettistica-extra/10.webp", source: "https://2bgioielli.it/products/scultura-ottaviani-pesce-dei-desideri-800487" },
          { title: "Scultura Navigare in cristallo 800436", image: "ottaviani/oggettistica-extra/11.webp", source: "https://2bgioielli.it/products/scultura-ottaviani-navigare-800436" },
          { title: "Scultura Elefantino Rainbow 800434", image: "ottaviani/oggettistica-extra/12.webp", source: "https://2bgioielli.it/products/scultura-ottaviani-elefantino-rainbow-800434" },
          { title: "Centrotavola Marea in cristallo 800475", image: "ottaviani/oggettistica-extra/13.webp", source: "https://2bgioielli.it/products/centrotavola-ottaviani-marea-800475" },
          { title: "Scultura Gufo in cristallo 80814", image: "ottaviani/oggettistica-extra/14.webp", source: "https://2bgioielli.it/products/scultura-gufo-ottaviani-80814" }
        ], "oggettistica")
      ]
    }
  ];
})();
