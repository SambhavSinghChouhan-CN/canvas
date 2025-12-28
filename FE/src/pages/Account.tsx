import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { User, Package, MapPin, Heart, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { useReduxWishlist } from '@/redux/wishlist/ReduxWishlistProvider';

interface Profile {
  full_name: string | null;
  phone: string | null;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { wishlist, loading: wishlistLoading, removeFromWishlist } = useReduxWishlist();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user!.id.toString())
      .maybeSingle();

    if (data) setProfile(data);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('id, order_number, status, total_amount, created_at')
      .eq('user_id', user!.id.toString())
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) setOrders(data);
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user, fetchProfile, fetchOrders]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate('/');
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with Redux action
    console.log('Address form data:', addressFormData);
    toast({
      title: "Address Added",
      description: "Your address has been saved successfully."
    });
    setShowAddressForm(false);
    setAddressFormData({
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: false
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-500';
      case 'shipped': return 'text-blue-500';
      case 'pending': return 'text-yellow-500';
      case 'cancelled': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>My Account | YF Decor</title>
        <meta name="description" content="Manage your YF Decor account, orders, and preferences" />
      </Helmet>

      <div className="container py-8">
        <h1 className="text-3xl font-display font-bold mb-8">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{profile?.full_name || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              {/* Menu */}
              <nav className="space-y-1">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
              </nav>

              <hr className="my-4 border-border" />

              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg border border-border p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-muted-foreground">Full Name</label>
                      <p className="font-medium mt-1">{profile?.full_name || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="font-medium mt-1">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Phone</label>
                      <p className="font-medium mt-1">{profile?.phone || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Order History</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                      <Button 
                        className="mt-4" 
                        onClick={() => navigate('/shop')}
                      >
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div 
                          key={order.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium">Order #{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">₹{order.total_amount.toLocaleString()}</p>
                            <p className={`text-sm capitalize ${getStatusColor(order.status)}`}>

                              {order.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Saved Addresses</h2>
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No addresses saved</p>
                    <Button className="mt-4" onClick={() => setShowAddressForm(true)}>Add New Address</Button>
                  </div>

                  {showAddressForm && (
                    <div className="mt-6 p-6 border border-border rounded-lg bg-secondary/20">
                      <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
                      <form className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                              type="text"
                              className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                              placeholder="Enter full name"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Phone Number</label>
                            <input
                              type="tel"
                              className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                              placeholder="Enter phone number"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Address Line 1</label>
                          <input
                            type="text"
                            className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                            placeholder="Street address, building, apartment"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Address Line 2 (Optional)</label>
                          <input
                            type="text"
                            className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                            placeholder="Landmark, area"
                          />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium">City</label>
                            <input
                              type="text"
                              className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                              placeholder="Enter city"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">State</label>
                            <input
                              type="text"
                              className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                              placeholder="Enter state"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">ZIP Code</label>
                            <input
                              type="text"
                              className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                              placeholder="Enter ZIP code"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Country</label>
                          <input
                            type="text"
                            className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                            placeholder="Enter country"
                            defaultValue="India"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="isDefault" />
                          <label htmlFor="isDefault" className="text-sm">Set as default address</label>
                        </div>
                        <div className="flex gap-3">
                          <Button type="submit">Save Address</Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowAddressForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">My Wishlist</h2>
                  {wishlistLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-pulse text-muted-foreground">Loading wishlist...</div>
                    </div>
                  ) : wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Your wishlist is empty</p>
                      <Button className="mt-4" onClick={() => navigate('/shop')}>
                        Browse Products
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {wishlist.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-md cursor-pointer"
                            onClick={() => navigate(`/product/${item.product.id}`)}
                          />
                          <div className="flex-1">
                            <h3
                              className="font-medium cursor-pointer hover:text-primary"
                              onClick={() => navigate(`/product/${item.product.id}`)}
                            >
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.product.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-semibold text-primary">
                                ₹{item.product.price.toLocaleString()}
                              </span>
                              {item.product.discount > 0 && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ₹{(item.product.price * (1 + item.product.discount / 100)).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              onClick={() => navigate(`/product/${item.product.id}`)}
                            >
                              View Product
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromWishlist(item.product.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
