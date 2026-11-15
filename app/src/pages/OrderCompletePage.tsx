import { Link, Navigate, useLocation } from "react-router-dom";
import { formatPrice } from "../utils/format";
import type { Order } from "../types/product";

export function OrderCompletePage() {
  const location = useLocation();
  const order = (location.state as { order?: Order } | null)?.order;

  if (!order) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
        ✓
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-900">주문이 접수되었습니다</h1>
      <p className="mt-2 text-sm text-slate-500">
        이 주문은 데모용 Mock 처리로, 실제 결제 및 배송이 이루어지지 않습니다.
      </p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">주문번호</span>
          <span className="font-semibold text-slate-900">{order.orderNumber}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-slate-500">받는 사람</span>
          <span className="text-slate-900">{order.shipping.name}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-slate-500">배송지</span>
          <span className="text-right text-slate-900">
            {order.shipping.address} {order.shipping.addressDetail}
          </span>
        </div>

        <ul className="mt-4 space-y-1 border-t border-slate-200 pt-4 text-sm text-slate-600">
          {order.items.map(({ product, quantity }) => (
            <li key={product.id} className="flex justify-between">
              <span>{product.name} × {quantity}</span>
              <span>{formatPrice(product.price * quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 font-bold text-slate-900">
          <span>총 결제 금액</span>
          <span>{formatPrice(order.totalPrice)}</span>
        </div>
      </div>

      <Link
        to="/products"
        className="mt-8 inline-block rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700"
      >
        계속 쇼핑하기
      </Link>
    </div>
  );
}
