<!-- Generate a README for the current project -->
# personal-multiuse-api

personal-multiuse-api is a node.js api with advanced features such as Swagger Documentation, JWT Authentication, Route Handling, Rate Limits, Caching, Game Server Information, Provider Stock Tracking and more.

![api documentation Banner](https://cdn.chit.sh/uploads/2c9qka3lfo2io8axiglvio9esmasq4.png)

## Features

- **Swagger Documentation:** Easily access and test all endpoints using Swagger UI.

- **JWT Authentication:** Secure endpoints using JWT authentication.

- **Route Handling:** Handle routes efficiently using Express.js.

- **Rate Limits:** Prevent abuse by limiting the number of requests per IP address.

- **Caching:** Cache responses to reduce server load and improve performance.

- **Game Server Information:** Retrieve information about game servers, including player count, map, and more.

- **Provider Stock Tracking:** Track stock information for providers, including stock percentages, stock notifications, and more.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Whogivsachit/personal-multiuse-api
   cd personal-multiuse-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file and set your secretKey and other configuration options:
   ```
    secretKey = ""
    host = ""
    port = ""

    # Rate limit
    RATE_LIMIT = 
    RATE_LIMIT_MAX =

    # Cache
    CACHE_TTL =
   ```

4. Start the bot:
   ```
   node index.js
   ```