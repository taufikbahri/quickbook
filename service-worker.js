importScripts('cache-polyfill.js');
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('airhorner').then(function(cache) {
            return cache.addAll([
                'index.html',
                'index.html?homescreen=1',
                'css/bootstrap.min.css',
                'css/font-awesome.min.css',
                'css/main.css',
                'js/jquery.min.js',
                'js/jquery.ui.min.js',
                'js/bootstrap.min.js'
            ]);
        })
    );
});