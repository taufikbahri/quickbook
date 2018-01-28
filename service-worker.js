importScripts('cache-polyfill.js');
// self.addEventListener('install', function(e) {
//     e.waitUntil(
//         caches.open('airhorner').then(function(cache) {
//             return cache.addAll([
//                 'index.html',
//                 'index.html?homescreen=1',
//                 'css/bootstrap.min.css',
//                 'css/font-awesome.min.css',
//                 'css/main.css',
//                 'js/jquery.min.js',
//                 'js/jquery.ui.min.js',
//                 'js/bootstrap.min.js'
//             ]);
//         })
//     );
// });


self.addEventListener('install', (event) => {
    console.info('Event: Install');

    event.waitUntil(
        caches.open(cacheName)
        .then((cache) => {
            //[] of files to cache & if any of the file not present `addAll` will fail
            var files = ['index.html',
                'index.html?homescreen=1',
                'css/bootstrap.min.css',
                'css/font-awesome.min.css',
                'css/main.css',
                'js/jquery.min.js',
                'js/jquery.ui.min.js',
                'js/bootstrap.min.js'
            ];
            return cache.addAll(files)
                .then(() => {
                    console.info('All files are cached');
                    return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
                })
                .catch((error) => {
                    console.error('Failed to cache', error);
                })
        })
    );
});


self.addEventListener('fetch', (event) => {
    console.info('Event: Fetch');

    var request = event.request;

    //Tell the browser to wait for newtwork request and respond with below
    event.respondWith(
        //If request is already in cache, return it
        caches.match(request).then((response) => {
            if (response) {
                return response;
            }

            //if request is not cached, add it to cache
            return fetch(request).then((response) => {
                var responseToCache = response.clone();
                caches.open(cacheName).then((cache) => {
                    cache.put(request, responseToCache).catch((err) => {
                        console.warn(request.url + ': ' + err.message);
                    });
                });

                return response;
            });
        })
    );
});

/*
  ACTIVATE EVENT: triggered once after registering, also used to clean up caches.
*/

//Adding `activate` event listener
self.addEventListener('activate', (event) => {
    console.info('Event: Activate');

    //Remove old and unwanted caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) { //cacheName = 'cache-v1'
                        return caches.delete(cache); //Deleting the cache
                    }
                })
            );
        })
    );
});