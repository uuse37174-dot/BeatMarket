import React, { useState } from "react";
import { useCartContext } from "../context/CartContext";
import { useAuthContext } from "../context/AuthContext";
import { CreditCard, Lock, CheckCircle2, ShieldCheck, X, Phone } from "lucide-react";

interface Props {
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export const StripeCheckoutModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const { cart, subtotal, clearCart } = useCartContext();
  const { user, placeOrder } = useAuthContext();

  const [name, setName] = useState<string>(user?.displayName || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [phone, setPhone] = useState<string>("+1 (555) 321-9876");
  const [address, setAddress] = useState<string>("123 Luxury Promenade, New York, NY");
  const [cardNumber, setCardNumber] = useState<string>("4242 •••• •••• 4242");
  const [expDate, setExpDate] = useState<string>("12/28");
  const [cvc, setCvc] = useState<string>("888");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [orderCompletedId, setOrderCompletedId] = useState<string | null>(null);

  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shipping = subtotal > 500 ? 0 : 25;
  const total = Math.round((subtotal + tax + shipping) * 100) / 100;

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Group items by store if multi-store
    const storeId = cart.length > 0 ? cart[0].product.storeId : "store_noir";
    const storeName = cart.length > 0 ? cart[0].product.storeName : "Noir & Co. Atelier";

    try {
      // Simulate Stripe 1.8s payment confirmation
      await new Promise((resolve) => setTimeout(resolve, 1800));

      const orderId = await placeOrder({
        storeId,
        storeName,
        customerUid: user ? user.uid : `guest_${Date.now()}`,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        items: cart.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.images[0]
        })),
        totalAmount: total,
        status: "pending",
        paymentMethod: "Stripe Secure Card",
        deliveryAddress: address
      });

      setIsProcessing(false);
      setOrderCompletedId(orderId);
      clearCart();
    } catch (err) {
      console.error("Order error:", err);
      setIsProcessing(false);
    }
  };

  if (orderCompletedId) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-black">Payment Confirmed!</h2>
          <p className="text-xs text-zinc-500 mt-2">
            Your payment was processed securely via Stripe. Order ID:{" "}
            <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
              {orderCompletedId}
            </span>
          </p>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 my-6 text-left">
            <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Shopkeeper Live Alert Triggered
            </p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
              The shopkeeper has received your order notification in real time. You can call or message them anytime regarding delivery!
            </p>
          </div>

          <button
            onClick={() => {
              onSuccess(orderCompletedId);
              onClose();
            }}
            className="w-full py-3.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs uppercase tracking-wider"
          >
            Done & View Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-6 h-6 text-zinc-900 dark:text-white" />
          <h2 className="text-xl font-black">Stripe Checkout</h2>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300/40 flex items-center gap-1 ml-auto">
            <Lock className="w-3 h-3" /> 256-bit AES
          </span>
        </div>

        {/* Order Summary Box */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 mb-6">
          <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {item.quantity}x {item.product.name}
                </span>
                <span className="font-bold">${item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-800 mt-3 pt-3 space-y-1 text-xs">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Estimated Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Express Shipping</span>
              <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-zinc-900 dark:text-white pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <span>Total Amount</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Stripe Payment Form */}
        <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] uppercase font-bold text-zinc-500 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
              placeholder="Alexander Wright"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase font-bold text-zinc-500 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
                placeholder="alex@example.com"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase font-bold text-zinc-500 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-zinc-500 mb-1">
              Delivery Address
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
            />
          </div>

          {/* Card Input */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              Stripe Test Card
            </span>
            <div>
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 font-mono text-xs focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 font-mono text-xs focus:outline-none"
                placeholder="MM/YY"
              />
              <input
                type="text"
                required
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 font-mono text-xs focus:outline-none"
                placeholder="CVC"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span className="animate-pulse">Processing via Stripe...</span>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" /> Pay ${total.toFixed(2)}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
