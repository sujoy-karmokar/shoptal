import { fetchCategories } from "@/lib/api";
import NavbarMenu from "./NavbarMenu";

interface Brand {
  id: string;
  name: string;
  categoryId?: string;
}

interface ProductSubcategory {
  id: string;
  name: string;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
  productSubcategory: ProductSubcategory[];
  brands: Brand[];
}

export default async function Navbar() {
  const categories = await fetchCategories();

  return <NavbarMenu categories={categories} />;
}
