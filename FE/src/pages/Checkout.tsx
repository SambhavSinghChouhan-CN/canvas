import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, CreditCard, Truck, Check, ChevronRight } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

const addressSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit phone number"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter valid 6-digit pincode")
});

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [processing, setProcessing] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateAddress = () => {
    const result = addressSchema.safeParse(address);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateAddress()) {
      setStep(2);
    }
  };

  const generateOrderNumber = () => {
    return 'YF' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
  };

  const handlePlaceOrder = async () => {
    if (!user) return;
    
    setProcessing(true);
    
    try {
      const orderNumber = generateOrderNumber();
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: 'pending',
          total_amount: totalPrice,
          shipping_address: {
            full_name: address.fullName,
            phone: address.phone,
            address_line1: address.addressLine1,
            address_line2: address.addressLine2,
            city: address.city,
            state: address.state,
            pincode: address.pincode
          },
          payment_method: paymentMethod
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        price: item.price,
        quantity: item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      clearCart();
      
      // Clear cart from database
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${orderNumber} has been placed.`
      });

      navigate('/account');
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || items.length === 0) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  const deliveryCharge = totalPrice >= 999 ? 0 : 99;
  const grandTotal = totalPrice + deliveryCharge;

  return (
    <Layout>
      <Helmet>
        <title>Checkout | YF Decor</title>
        <meta name="description" content="Complete your purchase at YF Decor" />
      </Helmet>

      <div className="container py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
              {step > 1 ? <Check className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
            </div>
            <span className="ml-2 font-medium hidden sm:block">Address</span>
          </div>
          <div className={`w-16 h-0.5 mx-2 ${step > 1 ? 'bg-primary' : 'bg-secondary'}`} />
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="ml-2 font-medium hidden sm:block">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border border-border p-6">
              {step === 1 && (
                <>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Shipping Address
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={address.fullName}
                        onChange={handleAddressChange}
                        placeholder="Enter full name"
                      />
                      {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={address.phone}
                        onChange={handleAddressChange}
                        placeholder="10-digit mobile number"
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="addressLine1">Address Line 1 *</Label>
                      <Input
                        id="addressLine1"
                        name="addressLine1"
                        value={address.addressLine1}
                        onChange={handleAddressChange}
                        placeholder="House no., Building, Street"
                      />
                      {errors.addressLine1 && <p className="text-sm text-destructive">{errors.addressLine1}</p>}
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="addressLine2">Address Line 2</Label>
                      <Input
                        id="addressLine2"
                        name="addressLine2"
                        value={address.addressLine2}
                        onChange={handleAddressChange}
                        placeholder="Landmark, Area (optional)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        placeholder="Enter city"
                      />
                      {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        placeholder="Enter state"
                      />
                      {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={address.pincode}
                        onChange={handleAddressChange}
                        placeholder="6-digit pincode"
                      />
                      {errors.pincode && <p className="text-sm text-destructive">{errors.pincode}</p>}
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-6 h-12"
                    onClick={handleNextStep}
                  >
                    Continue to Payment
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </h2>
                  
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <label 
                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="cod" />
                        <Truck className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-muted-foreground">Pay when you receive</p>
                        </div>
                      </label>
                      <label 
                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors opacity-50 ${
                          paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <RadioGroupItem value="online" disabled />
                        <CreditCard className="h-6 w-6" />
                        <div>
                          <p className="font-medium">Online Payment</p>
                          <p className="text-sm text-muted-foreground">Coming soon</p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>

                  {/* Address Summary */}
                  <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Delivering to:</p>
                    <p className="font-medium">{address.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-sm text-muted-foreground">Phone: {address.phone}</p>
                    <button 
                      className="text-sm text-primary mt-2 hover:text-gold-light"
                      onClick={() => setStep(1)}
                    >
                      Change Address
                    </button>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button 
                      className="flex-1 h-12"
                      onClick={handlePlaceOrder}
                      disabled={processing}
                    >
                      {processing ? 'Placing Order...' : `Place Order • ₹${grandTotal.toLocaleString()}`}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <hr className="border-border my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={deliveryCharge === 0 ? 'text-green-500' : ''}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
              </div>

              <hr className="border-border my-4" />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{grandTotal.toLocaleString()}</span>
              </div>

              {deliveryCharge > 0 && (
                <p className="text-xs text-muted-foreground mt-3">
                  Add ₹{999 - totalPrice} more for FREE delivery
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
