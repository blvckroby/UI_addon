const PORT = process.env.PORT || 7000;

const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

// fetch nativo di Node 18 → NON serve node-fetch
// nessun require necessario

const BASE = "https://tvvoo.hayd.uk/cfg-it";

const manifest = {
    id: "org.roby.proxy.tvvoo",
    version: "1.0.0",
    name: "Roby TVVoo Proxy",
    description: "Proxy personalizzato dell'addon TVVoo",
    background: "https://images5.alphacoders.com/890/thumb-1920-890441.png",
    logo: "https://wallpapercave.com/wp/wp11409149.png",
    catalogs: [
        { type: "tv", id: "tvvoo-proxy", name: "TVVoo Proxy" }
    ],
    resources: ["catalog", "stream", "meta"],
    types: ["movie", "series", "tv"],
    idPrefixes: ["tt", "tvvoo"]
};

const builder = new addonBuilder(manifest);

// 1️⃣ Catalogo
builder.defineCatalogHandler(async (args) => {
    return {
        metas: [
            {
                id: "vavoo_SKY SPORTS F1|group:it",
                type: "tv",
                name: "Sky Sport F1",
                poster: "https://raw.githubusercontent.com/blvckroby/tnb/master/skyf1.jpg",
                genres: ["Sport"],
            },
            {
                id: "vavoo_SKY SPORT UNO|group:it",
                type: "tv",
                name: "Sky Sport Uno",
                poster: "https://raw.githubusercontent.com/blvckroby/provaTV/main/skyuno.jpg",
                genres: ["Sport"]
            },
            {
                id: "vavoo_SKY SPORT MOTOGP|group:it",
                type: "tv",
                name: "Sky Sport MotoGP",
                poster: "https://raw.githubusercontent.com/blvckroby/tnb/master/skymotogp.jpg",
                genres: ["Sport"]
            },
            {
                id: "vavoo_DAZN 1|group:it",
                type: "tv",
                name: "DAZN 1",
                poster: "https://raw.githubusercontent.com/blvckroby/tnb/master/dazn1.jpg",
                genres: ["Sport"]
            },
            {
                id: "vavoo_DAZN 2|group:it",
                type: "tv",
                name: "DAZN 2",
                poster: "https://raw.githubusercontent.com/blvckroby/tnb/master/dazn2.jpg",
                genres: ["Sport"]
            }
        ]
    };
});

// 2️⃣ Stream
builder.defineStreamHandler(async (args) => {
    if (args.id === "vavoo_SKY SPORTS F1|group:it") {
        return {
            streams: [
                {
                    title: "Sky Sport F1 – HLS",
                    url: "https://td3wb1bchdvsahp.ngolpdkyoctjcddxshli469r.org/sunshine/_nuhEl-aHl395l6DmSzW3GBgGxR3n6u3bPwO4AUUI5KxDPqQ2ApWHEr7fqocyi_FwLsPqB5UExfcSUBw0Vqsgci6I3KScdjFhHVHLwtEO84f8YPsIpDYrQivzXPmhGr4uo6nGhQj8iyS890DDgXxoMiNFPNZtc35HY5n8TX2FUMr3CJERF64LXFEl8ILF2YQI2rXfBNzo6d1lUuJOb-_efPVRMS0mCvZYaLHtlA2h3-g6PIdIuf-wLJpfB30VsBZsHXFQ6CjB0F6u2dcTfAeUgKEuDsb3-TXvlOjfq8BeBE/hls/index.m3u8"
                }
            ]
        };
    }

    return { streams: [] };
});

// 3️⃣ Meta
builder.defineMetaHandler(async (args) => {
    if (args.id === "vavoo_SKY SPORTS F1|group:it") {
        return {
            meta: {
                id: "vavoo_SKY SPORTS F1|group:it",
                type: "tv",
                name: "Sky Sport F1",
                poster: "https://raw.githubusercontent.com/blvckroby/provaTV/main/skyf1.jpg",
                description: "Sky Sport F1 – Live"
            }
        };
    }

    return { meta: {} };
});

// 4️⃣ Avvio server
serveHTTP(builder.getInterface(), { port: PORT });

console.log("Addon avviato sulla porta:", PORT);
