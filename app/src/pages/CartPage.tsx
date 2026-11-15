import { Link, useNavigate } from "react-router-dom";
import { getProductById } from "../data/products";
import { formatPrice } from "../utils/format";
import { ProductImagePlaceholder } from "../components/ProductImagePlaceholder";
import { useShop } from "../context/ShopContext";
import { useSeo } from "../hooks/useSeo";

export function CartPage() {
  const { cartItems, updateCartQuantity, removeFromCart, cartTotal } = useShop();
  const navigate = useNavigate();

  useSeo({
    title: "장바구니",
    description: "장바구니에 담긴 그래픽카드를 확인하고 수량을 조절한 뒤 주문할 수 있습니다.",
    path: "/cart",
    noindex: true,
  });

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">장바구니가 비어있습니다</h1>
        <p className="mt-2 text-sm text-slate-500">원하는 그래픽카드를 담아보세요.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          상품 보러가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">장바구니</h1>

      <div className="mt-6 space-y-4">
        {cartItems.map((item) => {
          const product = getProductById(item.productId);
          if (!product) return null;
          const exceedsStock = item.quantity > product.stock;

          return (
            <div key={item.productId} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4">
              <ProductImagePlaceholder
                color={product.imageColor}
                label={product.series}
                className="h-20 w-20 flex-shrink-0 text-xs"
              />

              <div className="flex-1">
                <Link to={`/products/${product.id}`} className="font-semibold text-slate-900 hover:underline">
                  {product.name}
                </Link>
                <p className="mt-1 text-sm text-slate-500">{formatPrice(product.price)}</p>
                {exceedsStock && (
                  <p className="mt-1 text-xs text-rose-500">재고({product.stock}개)를 초과했습니다.</p>
                )}
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-xs text-slate-400 hover:text-rose-500"
                >
                  삭제
                </button>
                <div className="flex items-center rounded-md border border-slate-300">
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                    className="px-2 py-1 text-slate-600 hover:bg-slate-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= product.stock}
                    className="px-2 py-1 text-slate-600 hover:bg-slate-50 disabled:text-slate-300"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {formatPrice(product.price * item.quantity)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-xl bg-slate-50 p-4">
        <span className="text-sm text-slate-600">총 결제 예상 금액</span>
        <span className="text-xl font-bold text-slate-900">{formatPrice(cartTotal)}</span>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="mt-6 w-full rounded-md bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-700"
      >
        주문하기
      </button>
    </div>
  );
}
