import { addonBuilder, serveHTTP } from "stremio-addon-sdk";
import { channels } from "./channels.mjs";

const PORT = process.env.PORT || 7000;

const manifest = {
    id: "org.roby.proxy.tvvoo",
    version: "1.1.2",
    name: "Ultra Instinct Proxy ADDON for TVVoo",
    description: "Addon proxy personalizzato",
    background: "https://images5.alphacoders.com/890/thumb-1920-890441.png",
    logo: "https://3f76d3c30ed12bfc1032-89cd4604d12caea63ac7d98e7b7a3861.ssl.cf1.rackcdn.com/82667666_l.jpg",
    catalogs: [
        { type: "tv", id: "tvvoo-proxy", name: "TVVoo Proxy" }
    ],
    resources: ["catalog", "stream", "meta"],
    types: ["movie", "series", "tv"],
    idPrefixes: ["tt", "tvvoo"]
};

const builder = new addonBuilder(manifest);

// 1️⃣ Catalogo
builder.defineCatalogHandler(async () => {
    return { metas: channels };
});

// 2️⃣ Stream
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
});

// 3️⃣ Meta
builder.defineMetaHandler(async (args) => {
    const channel = channels.find(c => c.id === args.id);

    if (channel) {
        return {
            meta: {
                ...channel,
                description: `${channel.name} – Live`
            }
        };
    }

    return { meta: {} };
});

// 4️⃣ Avvio server
serveHTTP(builder.getInterface(), { port: PORT });

console.log("Addon avviato sulla porta:", PORT);
