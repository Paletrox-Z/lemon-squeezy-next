"use client";
import { ProductCard, ProductType } from "@/components/ProductCard";
import { initializeLemonSqueezy } from "@/utils/InitializeLemonSqueezy";
import {
  getAuthenticatedUser,
  lemonSqueezySetup,
  listProducts,
  listVariants,
} from "@lemonsqueezy/lemonsqueezy.js";
import React, { ReactNode } from "react";

type HomePropType = {};

type HomeStateType = {
  productList: ProductType[];
  isLoading: boolean;
};

export default class Home extends React.Component<HomePropType, HomeStateType> {
  constructor(props: HomePropType) {
    super(props);
    this.state = {
      productList: [],
      isLoading: false,
    };
    initializeLemonSqueezy();
  }

  componentDidMount(): void {
    this.loadProducts();
  }

  loadProducts = async () => {
    this.setState({
      isLoading: true,
    });

    await listProducts({
      filter: {
        storeId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID!,
      },
    }).then((productResponse) =>
      productResponse.data?.data.forEach((item) => {
        const getVariantInfo = async () => {
          await listVariants({ filter: { productId: item.id } }).then(
            async (variantResponse) => {
              const id = parseInt(
                (await variantResponse.data?.data[0].id) || "0"
              );

              const name = (await item.attributes.name) || "No Name";

              const price = (await item.attributes.price_formatted) || "Free";

              const isSubscription =
                (await variantResponse.data?.data[0].attributes
                  .is_subscription) || false;

              const subscriptionInterval =
                (await variantResponse.data?.data[0].attributes.interval) ||
                "None";

              const description =
                (await variantResponse.data?.data[0].attributes.description) ||
                "No Description";

              const filter = this.state.productList?.filter(
                (existing) => existing.id === id
              );

              if (filter?.length === 0) {
                this.setState({
                  productList: [
                    ...(this.state.productList || []),
                    {
                      id,
                      name,
                      price,
                      isSubscription,
                      interval: subscriptionInterval,
                      description,
                    },
                  ],
                });
              }
            }
          );
        };
        getVariantInfo();
      })
    );

    this.setState({
      isLoading: false,
    });
  };

  renderProductCard = (data: ProductType, index: number): ReactNode => {
    return <ProductCard {...data} key={`product-card-key-${index}`} />;
  };

  render() {
    if (this.state.isLoading) {
      return <div>Checking in the back... Please wait!</div>;
    }
    if (!this.state.isLoading && (this.state?.productList?.length || 0) < 1) {
      return <div>We are all out of stock, please check back later!</div>;
    }
    return (
      <div className="catalog-root">
        {this.state.productList?.map(this.renderProductCard)}
      </div>
    );
  }
}
