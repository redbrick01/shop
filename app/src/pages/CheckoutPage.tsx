import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getProductById } from "../data/products";
import { formatPrice, generateOrderNumber } from "../utils/format";
import { useShop } from "../context/ShopContext";
import type { Order, ShippingInfo } from "../types/product";

export function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState<ShippingInfo>({
    name: "",
    phone: "",
    address: "",
    addressDetail: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (cartItems.length === 0 && !submitted) {
    return <Navigate to="/cart" replace />;
  }

  function handleChange(field: keyof ShippingInfo, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("이름, 연락처, 주소는 필수 입력 항목입니다.");
      return;
    }

    const items = cartItems
      .map((item) => {
        const product = getProductById(item.productId);
        return product ? { product, quantity: item.quantity } : null;
      })
      .filter((v): v is { product: NonNullable<typeof v>["product"]; quantity: number } => v !== null);

    const order: Order = {
      orderNumber: generateOrderNumber(),
      items,
      shipping: form,
      totalPrice: cartTotal,
      createdAt: new Date().toISOString(),
    };

    setSubmitted(true);
    clearCart();
    navigate("/order-complete", { state: { order } });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">주문서 작성</h1>
      <p className="mt-1 text-sm text-amber-600">
        본 서비스는 Mock 데모로, 실제 결제가 진행되지 않습니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <Field label="받으시는 분" value={form.name} onChange={(v) => handleChange("name", v)} placeholder="홍길동" />
        <Field label="연락처" value={form.phone} onChange={(v) => handleChange("phone", v)} placeholder="010-1234-5678" />
        <Field label="주소" value={form.address} onChange={(v) => handleChange("address", v)} placeholder="서울특별시 강남구 테헤란로 123" />
        <Field
          label="상세 주소 (선택)"
          value={form.addressDetail}
          onChange={(v) => handleChange("addressDetail", v)}
          placeholder="101동 1001호"
        />

        {error && <p className="text-sm text-rose-500">{error}</p>}

        <div className="rounded-lg bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-800">주문 상품 요약</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {cartItems.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;
              return (
                <li key={item.productId} className="flex justify-between">
                  <span>{product.name} × {item.quantity}</span>
                  <span>{formatPrice(product.price * item.quantity)}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-semibold text-slate-900">
            <span>총 금액</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-700"
        >
          주문 접수하기 (결제 없이 진행)
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
      />
    </label>
  );
}
