const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../model/listing.js");
const Review = require("../model/review.js");

const { validateReview, isLoggedIN, isAuthor } = require("../middleware.js");
const { createReview, deleteReview } = require("../controllers/review.js");

router.post("/", isLoggedIN, validateReview, wrapAsync(createReview));

router.delete("/:reviewId", isLoggedIN, isAuthor, wrapAsync(deleteReview));

module.exports = router;
