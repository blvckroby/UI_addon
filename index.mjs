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
    idPrefixes: ["tt", "tvvoo"]
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

    if (channel) {
        return {
            meta: {
                id: channel.id,        // ⚠️ STESSO ID TvVoo
                type: "tv",
                name: channel.name,
                poster: channel.poster,   // tua immagine
                background: channel.poster,
                description: `${channel.name} – Live 🔴`
            }
        };
    }

    return { meta: null };
});
*/
builder.defineMetaHandler(async (args) => {
    const channel = channels.find(c => c.id === args.id);

    if (!channel) return { meta: null };

    return {
        meta: {
            id: channel.id,
            type: "tv",
            name: channel.name,
            poster: channel.poster,
            background: channel.background || channel.poster,
            logo: channel.logo,
            description: channel.description,
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


// 4️⃣ Avvio server
serveHTTP(builder.getInterface(), { port: PORT });

console.log("Addon avviato sulla porta:", PORT);
