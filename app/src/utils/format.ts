export function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

export function generateOrderNumber(): string {
  const now = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${now}-${rand}`;
}
