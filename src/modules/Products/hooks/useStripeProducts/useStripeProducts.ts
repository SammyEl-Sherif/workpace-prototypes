export const useStripeProducts = () => {
  const [products] = useFetch<ProductsGridLayout, null>('/all-products')
  return [products] as const
}
