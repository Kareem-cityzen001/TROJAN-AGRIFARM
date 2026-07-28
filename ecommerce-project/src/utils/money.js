export function formatMoney(amountCents) {
  return `KSh ${(amountCents / 100).toFixed(2)}`;
}