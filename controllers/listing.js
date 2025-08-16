const Listing = require("../model/listing.js");

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/listings.ejs", { listings });
};

module.exports.showPage = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!list) {
    req.flash("error", "Listing you requested doesn't exist");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { list });
  }
};

module.exports.newListing = async (req, res, next) => {
  let { title, description, image, location, country, price } = req.body;
  const newListing = new Listing({
    title: title,
    description: description,
    image: image,
    location: location,
    country: country,
    price: price,
    owner: req.user._id,
  });
  console.log(req.file);
  await newListing.save();
  req.flash("success", "New Listing created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing you requested doesn't exist");
    res.redirect("/listings");
  } else {
    res.render("listings/edit.ejs", { list });
  }
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let { title, description, image, location, country, price } = req.body;
  if (!req.body || !title || !description || !price)
    throw new ExpressError(400, "Required fields are missing");
  await Listing.findByIdAndUpdate(id, {
    $set: {
      title: title,
      description: description,
      image: image,
      location: location,
      country: country,
      price: price,
    },
  });
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.renderNewform = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("error", "Listing Deleted");
  res.redirect("/listings");
};
