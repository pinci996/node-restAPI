const express = require("express");
const router = express.Router();
const { restart } = require("nodemon");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const ProductsController = require("../controllers/products");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const Product = require("../models/product");

router.get("/", ProductsController.products_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductsController.products_create_product
);

router.get("/:productID", ProductsController.products_get_single_product);

router.patch(
  "/:productID",
  checkAuth,
  ProductsController.products_update_product
);

router.delete(
  "/:productID",
  checkAuth,
  ProductsController.products_delete_product
);

module.exports = router;
