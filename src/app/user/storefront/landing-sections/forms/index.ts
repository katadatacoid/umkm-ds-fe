import type React from "react";
import HeroForm, { heroDefaults } from "./hero-form";
import WhoWeAreForm, { whoWeAreDefaults } from "./who-we-are-form";
import OurProductsForm, { ourProductsDefaults } from "./our-products-form";
import MarqueeForm, { marqueeDefaults } from "./marquee-form";
import WhyChooseUsForm, { whyChooseUsDefaults } from "./why-choose-us-form";
import ExploreProductsForm, { exploreProductsDefaults } from "./explore-products-form";
import BlogInsightsForm, { blogInsightsDefaults } from "./blog-insights-form";
import FooterForm, { footerDefaults } from "./footer-form";
import type { SectionFormProps } from "./shared";

type AnyForm = React.ComponentType<SectionFormProps<any>>;

interface SectionFormDef {
  Form: AnyForm;
  defaults: () => unknown;
}

export const sectionFormRegistry: Record<string, SectionFormDef> = {
  hero: { Form: HeroForm as AnyForm, defaults: heroDefaults },
  who_we_are: { Form: WhoWeAreForm as AnyForm, defaults: whoWeAreDefaults },
  our_products: { Form: OurProductsForm as AnyForm, defaults: ourProductsDefaults },
  marquee: { Form: MarqueeForm as AnyForm, defaults: marqueeDefaults },
  why_choose_us: { Form: WhyChooseUsForm as AnyForm, defaults: whyChooseUsDefaults },
  explore_products: {
    Form: ExploreProductsForm as AnyForm,
    defaults: exploreProductsDefaults,
  },
  blog_insights: { Form: BlogInsightsForm as AnyForm, defaults: blogInsightsDefaults },
  footer: { Form: FooterForm as AnyForm, defaults: footerDefaults },
};

export function getSectionForm(key: string): SectionFormDef | null {
  return sectionFormRegistry[key] ?? null;
}
