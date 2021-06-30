import Category from "../models/category";
import slugify from "slugify";

export const create = async (req, res) => {
  try {
    const { name } = req.body;
    console.log(name);
    const category = await new Category({ name, slug: slugify(name) }).save();
    res.json(category);
  } catch (err) {
    res.status(400).send("Name is taken");
    console.log(err);
  }
};

export const read = async (req, res) => {
  try {
    let category = await Category.findOne({ slug: req.params.slug }).exec();
    res.json(category);
  } catch (err) {
    console.log(err);
  }
};

export const update = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(category);
  } catch (err) {
    res.status(400).send("Update failed");
    console.log(err);
  }
};

export const remove = async (req, res) => {
  try {
    // console.log(req.params.slug);
    let category = await Category.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(category);
  } catch (err) {
    res.status(400).send("Delete failed");
    console.log(err);
  }
};

export const categories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }).exec();
    res.json(categories);
  } catch (err) {
    console.log(err);
  }
};
