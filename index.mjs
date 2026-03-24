import { addonBuilder, serveHTTP } from "stremio-addon-sdk";
import { channels } from "./channels.mjs";

const PORT = process.env.PORT || 7000;

const manifest = {
    id: "org.roby.proxy.tvvoo",
    version: "1.1.6",
    name: "Ultra Instinct Proxy ADDON for TVVoo",
    description: "Addon proxy personalizzato",
    background: "https://images5.alphacoders.com/890/thumb-1920-890441.png",
    logo: "https://raw.githubusercontent.com/blvckroby/tnb/master/logo.png",
    catalogs: [
        { type: "tv", id: "tvvoo-proxy", name: "UI Sport" }
    ],
    resources: ["catalog", "stream", "meta"],
    types: ["movie", "series", "tv"],
    idPrefixes: ["tt", "tvvoo", "ui"]
};

const builder = new addonBuilder(manifest);

//1️⃣ Catalogo
builder.defineCatalogHandler(async () => {
    return { metas: channels };
});

/* 2️⃣ Stream
builder.defineStreamHandler(async (args) => {
    if (args.id === "vavoo_SKY SPORTS F1|group:it") {
        return {
            streams: [
                {
                    title: "Sky Sport F1 – HLS",
                    url: "https://td3wb1bchdvsahp.ngolpdkyoctjcddxshli469r.org/.../index.m3u8"
                }
            ]
        };
    }

    return { streams: [] };
});*/
builder.defineStreamHandler(async (args) => {
    const channel = channels.find(c => c.id === args.id);

    if (!channel || !channel.streams) {
        return { streams: [] };
    }

    return {
        streams: channel.streams.map(s => ({
            title: `${channel.name} – ${s.title}`,
            url: s.url
        }))
    };
});



/* 3️⃣ Meta
builder.defineMetaHandler(async (args) => {
    const channel = channels.find(c => c.id === args.id);

    if (!channel) {
        return { meta: null };
    }

    return {
        meta: {
            id: channel.id,
            type: "tv",
            name: channel.name,
            poster: channel.poster,
            background: channel.background || channel.poster,
            logo: channel.logo,
            description: channel.description || `${channel.name} – Live`,
            genres: channel.genres || ["TV"],
            videos: [
                {
                    id: "live",
                    title: `${channel.name} – Live`,
                    thumbnail: channel.poster,
                    released: "2026-03-24"
                }
            ]
        }
    };
});
*/
import { addonBuilder } from "stremio-addon-sdk";

const manifest = {
    id: "it.live.catalog",
    version: "1.0.0",
    name: "Live TV Italia",
    description: "Catalogo TV italiano con EPG",
    types: ["tv"],
    catalogs: [
        {
            type: "tv",
            id: "catalog_live_it",
            name: "TV Italia"
        }
    ],
    resources: ["catalog", "meta", "stream"]
};

const builder = new addonBuilder(manifest);

/* ============================
   CATALOGO CANALI (STATICO)
   ============================ */

const channels = [
    {
        id: "vavoo_RAI MOVIE|group:it",
        type: "tv",
        name: "RAI MOVIE",
        poster: "URL_POSTER",
        logo: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/italy/rai-movie-it.png",
        epg_id: "raimovie.it",
        category: "Rai"
    },
    {
        id: "vavoo_RAI ITALIA|group:it",
        type: "tv",
        name: "RAI ITALIA",
        poster: "URL_POSTER",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Rai_Italia_-_Logo_2017.svg/1024px-Rai_Italia_-_Logo_2017.svg.png",
        epg_id: "raiitalia",
        category: "Rai"
    }
    // QUI AGGIUNGI TUTTI GLI ALTRI CANALI ITALIANI
];

/* ============================
   LETTURA EPG XML (COMPATIBILE)
   ============================ */

async function getEPG(epgId) {
    const xmlUrl = "https://raw.githubusercontent.com/qwertyuiop8899/TV/refs/heads/main/epg.xml";

    const xmlText = await fetch(xmlUrl).then(r => r.text());

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "text/xml");

    const programmes = [...xml.querySelectorAll("programme")]
        .filter(p => p.getAttribute("channel") === epgId);

    if (!programmes.length)
        return "Nessuna informazione EPG disponibile.";

    const now = programmes[0];

    const title = now.querySelector("title")?.textContent || "N/A";
    const desc = now.querySelector("desc")?.textContent || "N/A";
    const start = now.getAttribute("start");
    const stop = now.getAttribute("stop");

    return `
In onda ora: ${title}
Trama: ${desc}
Dalle ${start} alle ${stop}
`;
}

/* ============================
   META HANDLER (EPG DINAMICO)
   ============================ */

builder.defineMetaHandler(async (args) => {
    const channel = channels.find(c => c.id === args.id);

    if (!channel) {
        return { meta: {} };
    }

    const epg = await getEPG(channel.epg_id);

    return {
        meta: {
            ...channel,
            description: epg
        }
    };
});

/* ============================
   CATALOG HANDLER (TUO)
   ============================ */

builder.defineCatalogHandler(async () => {
    return { metas: channels };
});


// 4️⃣ Avvio server
serveHTTP(builder.getInterface(), { port: PORT });

console.log("Addon avviato sulla porta:", PORT);
