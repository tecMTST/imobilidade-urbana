self.addEventListener("install", function (event) {
  caches.open("sw-cashe").then(function (cache) {
    return cache.add(
      "index.html",
      "./build/build.js",
      // Assets
      "assets/img/interacao_0.png",
      "assets/img/interacao_1.png",
      "assets/img/logo-ntmtst.png",
      "assets/img/metro_temp.png",
      "icons/640.png",
      "assets/img/metro_temp.png",
      "assets/img/personagem_temp.png",
      "assets/img/rotate.png",
      "assets/img/tela_inicial.png",
      "assets/img/titulo_temp.png",
      // Libraries
      "./p5.min.js",
      "./p5.sound.min.js"
    );
  });
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
