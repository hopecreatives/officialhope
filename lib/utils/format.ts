export const formatPriceRWF = (price: number) =>
  `${new Intl.NumberFormat("en-US").format(price)} RWF`;
