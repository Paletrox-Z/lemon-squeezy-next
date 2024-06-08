import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { ReactNode } from "react";

export type ProductType = {
  id: number;
  name: string;
  description: string;
  price: string;
  isSubscription: boolean;
  interval: string;
};

const checkoutProduct = async (variantId: number) => {
  const response = await createCheckout(
    process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID!,
    variantId
  );
  const checkoutUrl = await response.data?.data.attributes.url;
  if (checkoutUrl) {
    window.open(checkoutUrl, "_blank");
  }
};

export const ProductCard = (props: ProductType): ReactNode => {
  const buttonText = props.isSubscription ? "Subscribe @ " : "Buy @ ";
  return (
    <div className="product-card-parent">
      <div className="product-image" />
      <div className="product-card-title">
        <div>{props.name}</div>
        <div></div>
      </div>
      <button
        onClick={() => checkoutProduct(props.id)}
        className="product-purchase-button"
      >
        <span>{buttonText}</span>
        <span>{props.price}</span>
        {!props.isSubscription && <span>/-</span>}
      </button>
    </div>
  );
};
