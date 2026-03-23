import { addonBuilder, serveHTTP } from "stremio-addon-sdk";
import { channels } from "./channels.mjs";

const PORT = process.env.PORT || 7000;

const manifest = {
    id: "org.roby.proxy.tvvoo",
    version: "1.1.2",
    name: "Ultra Instinct Proxy ADDON for TVVoo",
    description: "Addon proxy personalizzato",
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
