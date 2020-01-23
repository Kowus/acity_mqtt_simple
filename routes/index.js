const express = require("express"),
  router = express.Router(),
  { connect } = require("mqtt"),
  { mqtt } = require("../config/env"),
  client = connect(mqtt.url);

let i = 10000;

client.subscribe("Temps", (err, granted) => {
  if (err) return console.error(err);
  console.log(`subscribed to ${granted[0].topic}`);
});

router.get("./stream", function(req, res, next) {
  // set timeout as high as possible
  req.socket.setTimeout((i *= 6));

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  res.write("\n");

  var timer = setInterval(function() {
    res.write(":" + "\n");
  }, 2000);

  client.on("message", function(topc, msg, pkt) {
    res.write("data:" + msg + "\n\n");
  });

  req.on("close", function() {
    clearTimeout(timer);
  });
});

// sub...

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

client.on("error", err => {
  console.error(err);
});
module.exports = router;
