import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllProducts, useInitializeProducts } from '../hooks/useQueries';
import { useAppContext, TrialCartItem } from '../contexts/AppContext';
import { Product } from '../backend';
import ProductCard from '../components/ProductCard';
import TrialCart from '../components/TrialCart';
import SizeWarningDialog from '../components/SizeWarningDialog';
import WardrobeWarningDialog from '../components/WardrobeWarningDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Filter, Zap, ShoppingBag } from 'lucide-react';

// Extra mock products to supplement backend data
const extraProducts: Product[] = [
  { name: 'Floral Maxi Dress', brand: 'Bloom Co', category: 'Dresses', price: 89.99, sizes: ['XS', 'S', 'M', 'L'], fitConfidence: BigInt(91) },
  { name: 'Embroidered Kurta', brand: 'Ethnic Luxe', category: 'Kurtas', price: 55.00, sizes: ['S', 'M', 'L', 'XL'], fitConfidence: BigInt(87) },
  { name: 'Graphic Tee', brand: 'Urban Pulse', category: 'T-Shirts', price: 28.00, sizes: ['XS', 'S', 'M', 'L', 'XL'], fitConfidence: BigInt(95) },
  { name: 'Silk Blouse', brand: 'Luxe Line', category: 'Tops', price: 72.00, sizes: ['XS', 'S', 'M', 'L'], fitConfidence: BigInt(88) },
  { name: 'Straight Leg Jeans', brand: 'Denim Lab', category: 'Jeans', price: 65.00, sizes: ['28', '30', '32', '34', '36'], fitConfidence: BigInt(82) },
  { name: 'Crop Hoodie', brand: 'Fusion', category: 'Tops', price: 48.00, sizes: ['XS', 'S', 'M', 'L'], fitConfidence: BigInt(90) },
];

export default function Shop() {
  const { data: backendProducts, isLoading, error } = useGetAllProducts();
  const { mutate: initialize } = useInitializeProducts();
  const { trialCartItems, addToTrialCart } = useAppContext();
  const { bodyScanData, wardrobeData } = useAppContext();

  const [sizeWarning, setSizeWarning] = useState<{
    open: boolean;
    selectedSize: string;
    pendingItem: TrialCartItem | null;
  }>({ open: false, selectedSize: '', pendingItem: null });

  const [wardrobeWarning, setWardrobeWarning] = useState<{
    open: boolean;
    message: string;
    pendingItem: TrialCartItem | null;
  }>({ open: false, message: '', pendingItem: null });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Initialize products if empty
  useEffect(() => {
    if (!isLoading && backendProducts && backendProducts.length === 0) {
      initialize();
    }
  }, [isLoading, backendProducts, initialize]);

  const allProducts = [...(backendProducts || []), ...extraProducts];
  const categories = ['All', ...Array.from(new Set(allProducts.map((p) => p.category)))];
  const filteredProducts = selectedCategory === 'All'
    ? allProducts
    : allProducts.filter((p) => p.category === selectedCategory);

  const cartFull = trialCartItems.length >= 5;

  const handleSizeWarning = (size: string, product: Product, selectedSize: string) => {
    const item: TrialCartItem = {
      product,
      selectedSize,
      id: `${product.name}-${Date.now()}`,
    };
    setSizeWarning({ open: true, selectedSize: size, pendingItem: item });
  };

  const handleWardrobeWarning = (product: Product, selectedSize: string) => {
    const item: TrialCartItem = {
      product,
      selectedSize,
      id: `${product.name}-${Date.now()}`,
    };
    const pinkTopsCount = wardrobeData.colorDistribution.find(c => c.color === 'Pink')?.count || 0;
    setWardrobeWarning({
      open: true,
      message: `You already own ${pinkTopsCount} pink tops. Are you sure you want another?`,
      pendingItem: item,
    });
  };

  const confirmAddToCart = (item: TrialCartItem | null) => {
    if (item) addToTrialCart(item);
    setSizeWarning({ open: false, selectedSize: '', pendingItem: null });
    setWardrobeWarning({ open: false, message: '', pendingItem: null });
  };

  return (
    <div className="min-h-screen page-transition">
      <div className="max-w-7xl mx-auto px-6 py-8 pl-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(192,132,252,0.3), rgba(96,165,250,0.3))', border: '1px solid rgba(192,132,252,0.4)' }}
            >
              <ShoppingBag size={16} className="text-purple-300" />
            </div>
            <h1 className="font-orbitron text-2xl font-bold gradient-text">AI Shop</h1>
          </div>
          <p className="text-white/40 text-sm">Discover fashion with AI-powered fit confidence</p>
        </div>

        <div className="flex gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Category filter */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <Filter size={14} className="text-white/40" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 font-medium"
                  style={
                    selectedCategory === cat
                      ? {
                          background: 'linear-gradient(135deg, rgba(192,132,252,0.3), rgba(96,165,250,0.3))',
                          border: '1px solid rgba(192,132,252,0.5)',
                          color: 'white',
                        }
                      : {
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.5)',
                        }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Cart full banner */}
            {cartFull && (
              <div
                className="mb-4 p-3 rounded-xl flex items-center gap-2 text-sm"
                style={{
                  background: 'rgba(244, 114, 182, 0.1)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  color: '#f472b6',
                }}
              >
                <Zap size={14} />
                Trial cart is full (5/5). Remove an item to add more.
              </div>
            )}

            {/* Product grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="glass-card rounded-2xl overflow-hidden">
                    <Skeleton className="h-48 w-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" style={{ background: 'rgba(255,255,255,0.05)' }} />
                      <Skeleton className="h-4 w-1/2" style={{ background: 'rgba(255,255,255,0.05)' }} />
                      <Skeleton className="h-8 w-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product, idx) => {
                  const cartItem = trialCartItems.find((i) => i.product.name === product.name);
                  return (
                    <ProductCard
                      key={`${product.name}-${idx}`}
                      product={product}
                      isInCart={!!cartItem}
                      cartFull={cartFull && !cartItem}
                      onAddToTrial={(item) => addToTrialCart(item)}
                      onSizeWarning={(size) => handleSizeWarning(size, product, size)}
                      recommendedSize={bodyScanData.scanned ? bodyScanData.recommendedSize : undefined}
                      onWardrobeWarning={(p) => handleWardrobeWarning(p, p.sizes[0])}
                      wardrobeScanned={wardrobeData.scanned}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Trial Cart sidebar */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-8 h-[calc(100vh-4rem)]">
              <TrialCart />
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <SizeWarningDialog
        open={sizeWarning.open}
        onClose={() => setSizeWarning({ open: false, selectedSize: '', pendingItem: null })}
        onConfirm={() => confirmAddToCart(sizeWarning.pendingItem)}
        recommendedSize={bodyScanData.recommendedSize}
        selectedSize={sizeWarning.selectedSize}
        pendingItem={sizeWarning.pendingItem}
      />

      <WardrobeWarningDialog
        open={wardrobeWarning.open}
        onClose={() => setWardrobeWarning({ open: false, message: '', pendingItem: null })}
        onConfirm={() => confirmAddToCart(wardrobeWarning.pendingItem)}
        message={wardrobeWarning.message}
      />
    </div>
  );
}
