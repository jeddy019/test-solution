import { Query, Field } from "@tilework/opus";

export const GET_CATEGORIES = new Query("categories", true).addField("name");

export const GET_CURRENCIES = new Query("currencies", true).addFieldList([
  "symbol",
  "label",
]);

export const GET_PRODUCTS = new Query("categories", true)
  .addField("name")
  .addField(
    new Field("products", true)
      .addFieldList([
        "id",
        "brand",
        "name",
        "inStock",
        "gallery",
        "description",
      ])
      .addField(
        new Field("attributes", true)
          .addFieldList(["id", "name", "type"])
          .addField(
            new Field("items", true).addFieldList([
              "displayValue",
              "value",
              "id",
            ])
          )
      )
      .addField(
        new Field("prices", true)
          .addField("amount")
          .addField(
            new Field("currency", true).addFieldList(["symbol", "label"])
          )
      )
  );
