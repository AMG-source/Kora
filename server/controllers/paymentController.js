const Razorpay = require("razorpay");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const crypto = require("crypto");
const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generatePayment = async (req, res) => {
  const userId = req.id;

  try {
    let { amount } = req.body;

    amount = Number(amount);
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount provided",
      });
    }

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: Math.random().toString(36).substring(2),
    };

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    instance.orders.create(options, async (err, order) => {
      if (err) {
        console.error("Razorpay order creation error:", err);
        return res.status(500).json({ success: false, message: "Payment creation failed" });
      }

      return res.status(200).json({
        success: true,
        data: {
          ...order,
          name: user.name,
          amount: options.amount, // attach amount in paise for verification step
        },
      });
    });
  } catch (error) {
    console.error("generatePayment error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const userId = req.id;

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      amount,
      productArray,
      address,
    } = req.body;

    const numericAmount = Number(amount);
    if (!numericAmount || isNaN(numericAmount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount received in payment verification",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      generatedSignature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    for (const product of productArray) {
      await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { purchasedProducts: product.id } }
      );

      await Product.findByIdAndUpdate(
        { _id: product.id },
        { $inc: { stock: -product.quantity } }
      );
    }

    await Order.create({
      amount: numericAmount / 100, // convert from paise to rupees
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: generatedSignature,
      products: productArray,
      address,
      userId,
    });

    return res.status(200).json({ success: true, message: "Payment Verified" });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generatePayment, verifyPayment };
