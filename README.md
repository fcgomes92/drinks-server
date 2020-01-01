## How to run the client and server at the same time:

First you need to run the local DNS to the containers names in the host (if it`s not already running):

```bash
docker run --hostname dns.mageddo --restart=unless-stopped -p 5380:5380 \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /etc/resolv.conf:/etc/resolv.conf \
defreitas/dns-proxy-server
```

Then you can run:

```
docker-compose up --build
```

The server will be available at: [server.drinks.local:3000](http://server.drinks.local:3000)