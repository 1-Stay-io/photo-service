const { Database, aql } = require("arangojs");

const arangoDb = new Database();
arangoDb.useDatabase('stayio');
arangoDb.useBasicAuth('root', '');
const listings = arangoDb.collection('listings');



const express = require('express')


const router = express.Router();

router.get = ('/:id/photos', async (req, res)=> {
  const listingId = req.params.id;
  console.log(listingId);
  try {
    const listing = await arangoDb.query(aql`
    FOR home IN listings
    FILTER home._key == ${listingId}
    RETURN home
    `);
      res.status(200).send(listing._result)
    } catch(err) {
      res.sendStatus(404)
    }
  }
);

module.exports = router

