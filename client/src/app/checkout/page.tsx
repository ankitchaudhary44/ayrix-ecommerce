'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Truck, CreditCard, ChevronRight, CheckCircle2, Lock, X, Smartphone, Building2, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cartItems, cartTotal, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [useWallet, setUseWallet] = useState(false);

  
  const [pinCode, setPinCode] = useState('');
  const [pinStatus, setPinStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);
  const [checkingPin, setCheckingPin] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(1);

  const savedAddresses = [
    { id: 1, type: 'Home', name: user?.name || 'Ayrix Customer', address: 'Flat 402, Sunshine Apartments, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pin: '560038', phone: '+91 9876543210' },
    { id: 2, type: 'Work', name: user?.name || 'Ayrix Customer', address: 'Tech Park, Tower B, Whitefield', city: 'Bengaluru', state: 'Karnataka', pin: '560066', phone: '+91 9876543210' },
  ];

  const handleCheckPin = async () => {
    if (pinCode.length === 6) {
      setCheckingPin(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
        const data = await res.json();
        if (data && data[0].Status === 'Success') {
          setPinStatus({ type: 'success', msg: `Delivery to ${data[0].PostOffice[0].Name}, ${data[0].PostOffice[0].State} in 2 days` });
        } else {
          setPinStatus({ type: 'error', msg: 'Invalid Pincode' });
        }
      } catch (e) {
        setPinStatus({ type: 'error', msg: 'Could not verify pincode' });
      } finally {
        setCheckingPin(false);
      }
    } else {
      setPinStatus({ type: 'error', msg: 'Enter 6 digit pincode' });
    }
  };

  const triggerMockPayment = async () => {
    setProcessing(true);
    try {
      if (useWallet && walletDeduction > 0) {
        await fetch('http://localhost:5001/api/payment/wallet-deduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('ayrix_token')}` },
          body: JSON.stringify({ amount: walletDeduction })
        });
      }
      
      await fetch('http://localhost:5001/api/purchases/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('ayrix_token')}` },
        body: JSON.stringify({ items: cartItems })
      });

      setTimeout(() => {
        setProcessing(false);
        setShowRazorpayModal(false);
        setSuccess(true);
        clearCart();
      }, 1000);
    } catch(e) {
      setProcessing(false);
    }
  };



  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-zinc-50 text-center px-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 mb-2 uppercase tracking-wide">Payment Successful</h1>
        <p className="text-zinc-500 mb-8 max-w-md">Your order has been placed successfully and will be delivered in 2-3 business days.</p>
        <div className="flex gap-4">
          <Link href="/purchases" className="bg-white border border-zinc-200 text-zinc-900 hover:border-zinc-300 font-bold py-3 px-8 rounded transition-colors uppercase tracking-wider text-sm shadow-sm">
            View Orders
          </Link>
          <Link href="/shop" className="bg-rose-500 text-white font-bold py-3 px-8 rounded hover:bg-rose-600 transition-colors uppercase tracking-wider text-sm shadow-sm">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-zinc-50 px-4 text-center">
        <div className="w-24 h-24 bg-zinc-200 rounded-full flex items-center justify-center mb-6">
          <img src="https://constant.myntassets.com/checkout/assets/img/empty-bag.webp" alt="Empty Bag" className="w-12 h-12 opacity-50 grayscale" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2 uppercase tracking-wide">Hey, it feels so light!</h2>
        <p className="text-sm text-zinc-500 mb-8">There is nothing in your bag. Let's add some items.</p>
        <Link href="/shop" className="border border-rose-500 text-rose-500 hover:bg-rose-50 font-bold py-3 px-12 rounded uppercase tracking-wider text-sm transition-colors">
          Add items from wishlist
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('http://localhost:5001/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ayrix_token')}`
        },
        body: JSON.stringify({ code: couponCode })
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || 'Invalid coupon');
        setDiscountAmount(0);
        setAppliedCoupon(null);
      } else {
        if (data.discountType === 'percentage') {
          setDiscountAmount(Math.round(cartTotal * (data.discountValue / 100)));
        } else {
          setDiscountAmount(data.discountValue);
        }
        setAppliedCoupon(couponCode.toUpperCase());
      }
    } catch (e) {
      setCouponError('Failed to apply coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
    setCouponError('');
  };

  const tax = Math.round((cartTotal - discountAmount) * 0.18);
  const rawTotal = Math.max(0, cartTotal - discountAmount + tax);
  const walletBal = (user as any)?.walletBalance || 0;
  const walletDeduction = useWallet ? Math.min(rawTotal, walletBal) : 0;
  const total = rawTotal - walletDeduction;

  return (
    <div className="min-h-screen bg-zinc-50 py-8 font-sans">
      
      {/* Checkout Steps */}
      <div className="max-w-[1000px] mx-auto px-4 mb-8">
        <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <span className="text-rose-500 border-b-2 border-rose-500 pb-1">Bag</span>
          <span className="text-zinc-300">--------</span>
          <span>Address</span>
          <span className="text-zinc-300">--------</span>
          <span>Payment</span>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Items */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Saved Addresses Section */}
          <div className="bg-white border border-zinc-200 rounded p-4 shadow-sm">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4" /> Select Delivery Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedAddresses.map((addr) => (
                <div 
                  key={addr.id} 
                  onClick={() => {
                     setSelectedAddress(addr.id);
                     setPinCode(addr.pin);
                  }}
                  className={`border rounded p-3 cursor-pointer transition-colors relative ${selectedAddress === addr.id ? 'border-rose-500 bg-rose-50/50' : 'border-zinc-200 hover:border-zinc-300 bg-white'}`}
                >
                  {selectedAddress === addr.id && (
                    <div className="absolute top-3 right-3 bg-rose-500 rounded-full p-0.5 text-white">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                  <div className="text-[10px] font-bold bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded inline-block mb-2 uppercase text-zinc-600">{addr.type}</div>
                  <div className="font-bold text-sm text-zinc-900">{addr.name}</div>
                  <div className="text-[13px] text-zinc-600 mt-1 leading-relaxed">
                    {addr.address}<br />
                    {addr.city}, {addr.state} - <span className="font-bold">{addr.pin}</span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-2">Mobile: <span className="font-medium text-zinc-900">{addr.phone}</span></div>
                </div>
              ))}
            </div>
            <button className="text-xs font-bold text-rose-500 uppercase tracking-wider mt-4 hover:underline">
              + Add New Address
            </button>
          </div>

          <div className="bg-white border border-zinc-200 rounded p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <Truck className="w-5 h-5 text-zinc-600" />
              <span className="text-sm font-medium text-zinc-900">Check delivery time & services</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                maxLength={6}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode" 
                className="flex-grow border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-rose-500"
              />
              <button 
                onClick={handleCheckPin}
                disabled={checkingPin}
                className="text-rose-500 font-bold text-xs uppercase tracking-wider border border-rose-500 rounded px-4 py-2 hover:bg-rose-50 transition-colors disabled:opacity-50 shrink-0"
              >
                {checkingPin ? 'Checking...' : 'Check'}
              </button>
            </div>
            {pinStatus && (
              <div className={`text-xs font-bold mt-1 ${pinStatus.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {pinStatus.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />}
                {pinStatus.msg}
              </div>
            )}
          </div>

          <div className="bg-white border border-zinc-200 rounded shadow-sm">
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
              <h2 className="font-bold text-zinc-900 uppercase tracking-wide">
                Items In Bag ({cartItems.length})
              </h2>
            </div>
            <div className="divide-y divide-zinc-200">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 flex gap-4 relative hover:bg-zinc-50/50 transition-colors">
                  <div className="w-28 h-36 bg-zinc-100 shrink-0">
                    <img 
                      src={item.product.images?.[0] || 'https://via.placeholder.com/300'} 
                      alt={item.product.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-grow pt-1">
                    <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wide mb-1">{item.product.brand}</h3>
                    <p className="text-sm text-zinc-600 mb-2 truncate max-w-sm">{item.product.name}</p>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-zinc-100 text-zinc-800 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        Size: {item.size}
                      </div>
                      <div className="bg-zinc-100 text-zinc-800 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        Qty: {item.quantity}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-900">Rs. {Math.round(item.product.price * 82)}</span>
                      <span className="text-xs text-zinc-400 line-through">Rs. {Math.round((item.product.price * 82) * 1.4)}</span>
                      <span className="text-[10px] font-bold text-rose-500 uppercase">40% OFF</span>
                    </div>

                    <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-2">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> 14 days return available
                    </p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-4 right-4 text-xs font-bold text-zinc-400 hover:text-rose-500 uppercase tracking-wider"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Price Summary & Payment */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Coupon Code Section */}
          <div className="bg-white border border-zinc-200 rounded p-5 shadow-sm">
            <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wide mb-3 flex items-center justify-between">
              Apply Coupon
              {appliedCoupon && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
            </h3>
            
            {!appliedCoupon ? (
              <div>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-grow border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-zinc-900 font-mono uppercase"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponCode}
                    className="bg-zinc-900 text-white text-xs font-bold px-4 py-2 rounded uppercase tracking-wider hover:bg-zinc-800 disabled:opacity-50"
                  >
                    {applyingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-rose-500 text-xs mt-2 font-medium">{couponError}</p>}
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-emerald-700">{appliedCoupon}</span>
                  <p className="text-xs text-emerald-600 mt-0.5">Coupon applied successfully</p>
                </div>
                <button 
                  onClick={removeCoupon}
                  className="text-xs text-zinc-500 hover:text-rose-500 font-bold uppercase tracking-wider"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="bg-white border border-zinc-200 rounded p-5 shadow-sm sticky top-24">
            <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wide mb-4">Price Details ({cartItems.length} Items)</h3>
            
            <div className="space-y-3 mb-4 pb-4 border-b border-zinc-200 text-sm text-zinc-600">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>Rs. {Math.round(cartTotal * 1.4)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Discount on MRP</span>
                <span>- Rs. {Math.round(cartTotal * 1.4) - cartTotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>- Rs. {discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (18% GST)</span>
                <span>Rs. {tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-emerald-600">FREE</span>
              </div>
              
              {((user as any)?.walletBalance > 0) && (
                <div className="py-2 mt-2 border-t border-zinc-100 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={useWallet} onChange={e => setUseWallet(e.target.checked)} className="w-4 h-4 accent-black" />
                    <span className="font-bold">Use Wallet Balance (₹{(user as any).walletBalance})</span>
                  </label>
                  {useWallet && <span className="text-emerald-600 font-bold">- Rs. {walletDeduction}</span>}
                </div>
              )}
            </div>

            <div className="flex justify-between font-bold text-zinc-900 mb-6 border-t border-zinc-200 pt-4">
              <span>Total Amount</span>
              <span>Rs. {total}</span>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => total === 0 ? triggerMockPayment() : setShowRazorpayModal(true)}
                disabled={processing}
                className="w-full bg-zinc-900 hover:bg-black text-white font-bold py-3.5 rounded shadow-sm flex items-center justify-center gap-2 uppercase tracking-wide transition-colors disabled:opacity-75"
              >
                {processing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> {total === 0 ? 'Pay using Wallet' : 'Secure Checkout (Razorpay)'}
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
              <ShieldCheck className="w-4 h-4" /> Secure Payment via 256-bit Encryption
            </div>
          </div>
        </div>

      </div>

      {/* Realistic Razorpay Modal Mock */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-[420px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#0b121f] text-white p-5 relative">
              <button 
                onClick={() => setShowRazorpayModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-extrabold text-black tracking-tighter">
                  AYRIX
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">AYRIX Fashion Engine</h3>
                </div>
              </div>
              <div className="flex items-end justify-between border-t border-white/20 pt-4 mt-2">
                <span className="text-white/80 text-sm">Amount to Pay</span>
                <span className="font-bold text-xl">₹ {total}</span>
              </div>
            </div>

            {/* Body */}
            <div className="flex h-[380px]">
              {/* Sidebar */}
              <div className="w-[140px] bg-zinc-50 border-r border-zinc-200 py-2">
                <button 
                  onClick={() => setPaymentMethod('upi')}
                  className={`w-full flex flex-col items-center justify-center gap-2 py-4 px-2 text-xs font-bold ${paymentMethod === 'upi' ? 'bg-white text-blue-600 border-l-4 border-blue-600' : 'text-zinc-600 hover:bg-zinc-100 border-l-4 border-transparent'}`}
                >
                  <Smartphone className="w-6 h-6" /> UPI / QR
                </button>
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full flex flex-col items-center justify-center gap-2 py-4 px-2 text-xs font-bold ${paymentMethod === 'card' ? 'bg-white text-blue-600 border-l-4 border-blue-600' : 'text-zinc-600 hover:bg-zinc-100 border-l-4 border-transparent'}`}
                >
                  <CreditCard className="w-6 h-6" /> Card
                </button>
                <button 
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`w-full flex flex-col items-center justify-center gap-2 py-4 px-2 text-xs font-bold ${paymentMethod === 'netbanking' ? 'bg-white text-blue-600 border-l-4 border-blue-600' : 'text-zinc-600 hover:bg-zinc-100 border-l-4 border-transparent'}`}
                >
                  <Building2 className="w-6 h-6" /> Netbanking
                </button>
                <button 
                  onClick={() => setPaymentMethod('wallet')}
                  className={`w-full flex flex-col items-center justify-center gap-2 py-4 px-2 text-xs font-bold ${paymentMethod === 'wallet' ? 'bg-white text-blue-600 border-l-4 border-blue-600' : 'text-zinc-600 hover:bg-zinc-100 border-l-4 border-transparent'}`}
                >
                  <Wallet className="w-6 h-6" /> Wallet
                </button>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-5 overflow-y-auto">
                <div className="text-sm font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">
                  {paymentMethod === 'upi' && 'Pay via UPI'}
                  {paymentMethod === 'card' && 'Add New Card'}
                  {paymentMethod === 'netbanking' && 'Select Bank'}
                  {paymentMethod === 'wallet' && 'Select Wallet'}
                </div>
                
                {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div className="p-4 border border-zinc-200 rounded text-center bg-zinc-50">
                        <div className="w-40 h-40 bg-white border border-zinc-200 mx-auto flex items-center justify-center mb-2 p-2">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=8252264507@ibl&pn=AYRIX Secure Checkout&am=${total}&cu=INR&mode=02&purpose=00`)}`} 
                            alt="Secure QR" 
                            className="w-full h-full" 
                          />
                        </div>
                        <p className="text-xs text-zinc-500 font-medium">Scan QR with any UPI app</p>
                      </div>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200"></div></div>
                      <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-zinc-400">OR</span></div>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-600 font-bold mb-1 block">UPI ID / Mobile Number</label>
                      <input type="text" placeholder="example@upi" className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-zinc-600 font-bold mb-1 block">Card Number</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-zinc-600 font-bold mb-1 block">Expiry</label>
                        <input type="text" placeholder="MM/YY" className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-600 font-bold mb-1 block">CVV</label>
                        <input type="password" placeholder="***" className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-600 font-bold mb-1 block">Cardholder Name</label>
                      <input type="text" placeholder="Name on card" className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                )}

                {(paymentMethod === 'netbanking' || paymentMethod === 'wallet') && (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center text-zinc-500 text-sm">
                    <Building2 className="w-8 h-8 mb-3 opacity-20" />
                    Feature disabled for your region.<br/>Please use UPI or Card to proceed.
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-zinc-50 p-4 border-t border-zinc-200">
              <button 
                onClick={triggerMockPayment}
                disabled={processing}
                className="w-full bg-[#3366cc] hover:bg-[#2b56ad] text-white font-bold py-3 rounded text-sm transition-colors flex items-center justify-center"
              >
                {processing ? (
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  `Pay ₹ ${total}`
                )}
              </button>
              <div className="text-center mt-3 text-[9px] text-zinc-400 font-bold tracking-widest flex items-center justify-center gap-1 uppercase">
                <Lock className="w-3 h-3" /> Secured by Razorpay
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
