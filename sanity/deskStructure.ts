import type { StructureResolver } from "sanity/structure";
import { SANITY_PRODUCT_CATEGORY_OPTIONS } from "./schemaTypes/product";

const MANAGED_TYPES = new Set(["product", "category"]);

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("All Products")
        .child(
          S.documentTypeList("product")
            .title("All Products")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("Featured Products")
        .child(
          S.documentList()
            .title("Featured Products")
            .filter('_type == "product" && featured == true')
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("Products by Category")
        .child(
          S.list()
            .title("Products by Category")
            .items(
              SANITY_PRODUCT_CATEGORY_OPTIONS.map((category) =>
                S.listItem()
                  .title(category.title)
                  .child(
                    S.documentList()
                      .title(`${category.title} Products`)
                      .filter('_type == "product" && category == $category')
                      .params({ category: category.value })
                      .initialValueTemplates([
                        S.initialValueTemplateItem("product", {
                          category: category.value,
                        }),
                      ])
                      .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
                  ),
              ),
            ),
        ),
      S.listItem()
        .title("Homepage Categories")
        .child(
          S.documentTypeList("category")
            .title("Homepage Category Tiles")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !MANAGED_TYPES.has(item.getId() || ""),
      ),
    ]);
