import { addonBuilder, serveHTTP } from "stremio-addon-sdk";
import { channels } from "./channels.mjs";

const PORT = process.env.PORT || 7000;

const manifest = {
    id: "org.roby.proxy.tvvoo",
    version: "1.2.1",
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

/* ============================
   1️⃣ CATALOG HANDLER (UNICO)
   ============================ */

builder.defineCatalogHandler(async () => {
    return { metas: channels };
});

/* ============================
   2️⃣ STREAM HANDLER (FACOLTATIVO)
   ============================ */

// builder.defineStreamHandler(async (args) => {
//     const channel = channels.find(c => c.id === args.id);

//     if (!channel || !channel.streams) {
//         return { streams: [] };
//     }

//     return {
//         streams: channel.streams.map(s => ({
//             title: `${channel.name} – ${s.title}`,
//             url: s.url
//         }))
//     };
// });

/* ============================
   3️⃣ FUNZIONE EPG (COMPATIBILE)
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
   4️⃣ META HANDLER (UNICO)
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
            description: epg,
            type: "tv",
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

/* ============================
   5️⃣ AVVIO SERVER
   ============================ */

serveHTTP(builder.getInterface(), { port: PORT });

console.log("Addon avviato sulla porta:", PORT);
