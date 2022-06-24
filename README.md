# View Live app

https://points-amber.vercel.app/


## How to verify response payloads

> 🗣️ As part of this exercise the following APIs and actions were built in accordance with [these requirements](https://fetch-hiring.s3.us-east-1.amazonaws.com/points.pdf).

- /api/pointsByPayer
  - GET: retrieves all points balance
  - POST: adds a points transaction
- /api/spendPoints
  - POST: spends points

> 🗣️ **View the live app** at https://points-amber.vercel.app/ in [Chrome](https://www.google.com/chrome) and open your network tab.

The first API response you receive in network tab should be `GET /api/pointsByPayer` and will initially be empty. You must first add points!

**To add points simply do the following in sequenece to verify this exercise:**

1. Add DANNON with 300 points
2. Add UNILEVER with 200 points
3. Add DANNON with -200 points (yes, I know the exercise says not to allow points to go negative, but this is from the exercise's example!)
4. Add MILLER COORS with 10000
5. Add DANNON with 1000 points

In your network tab you should see five network calls `POST /api/pointsByPayer` with the required payload. Furthermore, in the GUI you should see the following:

```
DANNON: 1100
UNILEVER: 200
MILLER COORS: 10000
```

**Now it is time to spend points!** 🤑

Add `5000` to the Spend input and click "Spend points!". Now you should see the GUI update to:

```
DANNON: 1000
UNILEVER: 0
MILLER COORS: 5300
```

To verify the payload is correct for `POST /api/spendPoints` please view the network tab.

Alternatively, you can simply [run this app locally](#Deploy locally) and see the payloads in STDOUT logs in the node environment.

## Deploy locally

Deploy the example by checking out this repo and running the following commands (make sure you have [yarn installed](https://yarnpkg.com/)):

```bash
yarn install
yarn dev
````

View dev site at http://localhost:3000 :tada:
