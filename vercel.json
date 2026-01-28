{
  "version": 2,
  "framework": "nextjs",
  "regions": ["gru1"],
  "cleanUrls": true,
  "trailingSlash": false,

  "github": {
    "silent": true
  },

  "images": {
    "sizes": [450, 640, 750, 828, 1080, 1200, 1920],
    "minimumCacheTTL": 86400,
    "formats": ["image/avif", "image/webp"],
    "remotePatterns": [
      {
        "protocol": "https",
        "hostname": "*.githubusercontent.com"
      },
      {
        "protocol": "https",
        "hostname": "raw.githubusercontent.com"
      },
      {
        "protocol": "https",
        "hostname": "images.unsplash.com"
      },
      {
        "protocol": "https",
        "hostname": "media.licdn.com"
      }
    ]
  },

  "headers": [
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    },
    {
      "source": "/(assets|fonts|images|favicon.ico)/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
