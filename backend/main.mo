import Text "mo:core/Text";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

actor {
  type Product = {
    name : Text;
    brand : Text;
    category : Text;
    price : Float;
    sizes : [Text];
    fitConfidence : Nat;
  };

  module Product {
    public func compareByName(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.name, product2.name);
    };

    public func compareByBrand(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.brand, product2.brand);
    };
  };

  let productList = List.empty<Product>();

  // Hardcoded product data for demo
  public shared ({ caller }) func initialize() : async () {
    if (productList.size() > 0) { Runtime.trap("Product list is already initialized") };

    let products = [
      {
        name = "Slim Fit Shirt";
        brand = "IC Style";
        category = "Shirts";
        price = 42.00;
        sizes = ["S", "M", "L", "XL"];
        fitConfidence = 89;
      },
      {
        name = "Relaxed Jeans";
        brand = "Core Apparel";
        category = "Pants";
        price = 60.00;
        sizes = ["28", "30", "32", "34"];
        fitConfidence = 83;
      },
      {
        name = "Athletic Tank";
        brand = "Fusion";
        category = "Tops";
        price = 30.00;
        sizes = ["S", "M", "L"];
        fitConfidence = 92;
      },
      {
        name = "Classic Denim Jacket";
        brand = "IC Style";
        category = "Jackets";
        price = 75.00;
        sizes = ["S", "M", "L", "XL"];
        fitConfidence = 88;
      },
      {
        name = "Chino Shorts";
        brand = "Breeze Wear";
        category = "Shorts";
        price = 40.00;
        sizes = ["30", "32", "34", "36"];
        fitConfidence = 78;
      },
    ];

    let tempList = List.fromArray<Product>(products);
    productList.clear();
    productList.addAll(tempList.values());
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    productList.values().toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    productList.filter(func(p) { Text.equal(p.category, category) }).values().toArray();
  };

  public query ({ caller }) func getProductsByBrand(brand : Text) : async [Product] {
    productList.filter(func(p) { Text.equal(p.brand, brand) }).values().toArray();
  };

  public query ({ caller }) func getFilteredProducts(category : ?Text, brand : ?Text, sortIndex : Nat) : async [Product] {
    let filteredList = productList.filter(
      func(p) {
        switch (category, brand) {
          case (?cat, ?br) { Text.equal(p.category, cat) and Text.equal(p.brand, br) };
          case (?cat, null) { Text.equal(p.category, cat) };
          case (null, ?br) { Text.equal(p.brand, br) };
          case (null, null) { true };
        };
      }
    );

    switch (sortIndex) {
      case (2) { filteredList.values().toArray().sort(Product.compareByName) };
      case (3) { filteredList.values().toArray().sort(Product.compareByBrand) };
      case (_) { filteredList.values().toArray() };
    };
  };
};
