const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
  id: "mio-addon",
  version: "1.0.0",
  name: "Mio Addon",
  description: "Un addon di esempio",
  types: ["movie"],
  catalogs: [
    {
      type: "movie",
      id: "demo",
      name: "Catalogo Demo"
    }
  ],
  resources: ["catalog", "meta", "stream"]
};

const builder = new addonBuilder(manifest);

// Catalogo demo
builder.defineCatalogHandler(() => {
  return Promise.resolve({
    metas: [
      {
        id: "movie1",
        type: "movie",
        name: "Film di prova",
        poster: "https://via.placeholder.com/300x450"
      }
    ]
  });
});

// Meta
builder.defineMetaHandler(({ id }) => {
  return Promise.resolve({
    meta: {
      id,
      type: "movie",
      name: "Film di prova",
      poster: "https://via.placeholder.com/300x450",
      description: "Questo è un film di test"
    }
  });
});

// Stream
builder.defineStreamHandler(({ id }) => {
  return Promise.resolve({
    streams: [
      {
        title: "Stream di test",
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      }
    ]
  });
});

// 🚀 AVVIO DEL SERVER (mancava!)
const { serveHTTP } = require("stremio-addon-sdk");
serveHTTP(builder.getInterface(), { port: 7000 });
