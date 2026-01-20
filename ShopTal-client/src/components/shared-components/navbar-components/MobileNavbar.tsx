import { fetchCategories } from "@/lib/api";
import MobileNavbarMenu from "./MobileNavbarMenu";

interface Brand {
  brandId: string;
  categoryId: string;
  brand: {
    id: string;
    name: string;
  };
}

interface ProductSubcategory {
  id: string;
  name: string;
  categoryId?: string;
}

export interface NavbarCategory {
  id: string;
  name: string;
  productSubcategory: ProductSubcategory[];
  brands: Brand[];
}

export default async function MobileNavbar() {
  const categories = await fetchCategories();
  return <MobileNavbarMenu categories={categories} />;
}
