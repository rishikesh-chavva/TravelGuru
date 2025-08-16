const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../model/listing.js");
const { isLoggedIN, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const storage = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index)) //ntg much to say just want post to go to next line
  // .post
  // isLoggedIN,
  // //   validateListing,
  // wrapAsync(listingController.newListing)
  .post(upload.single("image"), (res, req) => {
    res.send(req.file);
  });

router.get("/new", isLoggedIN, listingController.renderNewform);

router
  .route("/:id")
  .get(wrapAsync(listingController.showPage))
  .put(isLoggedIN, isOwner, wrapAsync(listingController.editListing))
  .delete(isLoggedIN, isOwner, wrapAsync(listingController.deleteListing));

router.get(
  "/:id/edit",
  isLoggedIN,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
