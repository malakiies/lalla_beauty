import Coupon from '../models/Coupon.js';

// @desc    Validate a coupon
// @route   POST /api/coupons/validate
// @access  Public (or protected depending on business logic)
export const validateCoupon = async (req, res) => {
  const { code } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    res.status(404);
    throw new Error('Code promo invalide ou introuvable');
  }

  if (!coupon.isActive) {
    res.status(400);
    throw new Error('Ce code promo n\'est plus actif');
  }

  if (new Date(coupon.expiryDate) < new Date()) {
    res.status(400);
    throw new Error('Ce code promo a expiré');
  }

  res.json({
    _id: coupon._id,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
  });
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find({});
  res.json(coupons);
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  const { code, discountType, discountValue, expiryDate } = req.body;

  const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
  if (couponExists) {
    res.status(400);
    throw new Error('Un coupon avec ce code existe déjà');
  }

  const coupon = new Coupon({
    code,
    discountType,
    discountValue,
    expiryDate
  });

  const createdCoupon = await coupon.save();
  res.status(201).json(createdCoupon);
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    await Coupon.deleteOne({ _id: coupon._id });
    res.json({ message: 'Coupon supprimé' });
  } else {
    res.status(404);
    throw new Error('Coupon introuvable');
  }
};
