import type * as React from "react";

type DotLottieProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  src?: string;
  autoplay?: boolean;
  loop?: boolean;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "dotlottie-wc": DotLottieProps;
    }
  }
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "dotlottie-wc": DotLottieProps;
    }
  }
}
