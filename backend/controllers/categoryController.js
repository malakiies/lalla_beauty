import Category from '../models/Category.js';

// @desc    Fetch all categories
// @route   GET /api/categories
export const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};

// @desc    Create a category
// @route   POST /api/categories
export const createCategory = async (req, res) => {
  const { name, description, image } = req.body;

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = new Category({
    name,
    description,
    image,
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await Category.deleteOne({ _id: category._id });
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
};
