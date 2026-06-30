import test from "node:test";
import assert from "node:assert/strict";
import cartReducer, { addToCartLocal, updateQtyLocal, getCartItemId, mergeCartItems } from "./cartSlice.js";

test("addToCartLocal preserves product details from nested product payloads", () => {
  const state = cartReducer(undefined, { type: "@@INIT" });
  const nextState = cartReducer(
    state,
    addToCartLocal({
      product: {
        _id: "p1",
        name: "Running Shoes",
        price: 49.99,
        image: "/shoe.jpg",
      },
      qty: 2,
    })
  );

  assert.equal(nextState.cartItems.length, 1);
  assert.equal(nextState.cartItems[0].name, "Running Shoes");
  assert.equal(nextState.cartItems[0].price, 49.99);
  assert.equal(nextState.cartItems[0].image, "/shoe.jpg");
  assert.equal(nextState.cartItems[0].qty, 2);
});

test("updateQtyLocal clamps quantities to the available stock", () => {
  const state = cartReducer(undefined, { type: "@@INIT" });
  const withItem = cartReducer(
    state,
    addToCartLocal({
      product: {
        _id: "p1",
        name: "Running Shoes",
        price: 49.99,
        countInStock: 3,
      },
      qty: 1,
    })
  );

  const nextState = cartReducer(withItem, updateQtyLocal({ id: "p1", qty: 99 }));

  assert.equal(nextState.cartItems[0].qty, 3);
});

test("getCartItemId resolves product ids from nested payloads", () => {
  assert.equal(getCartItemId({ product: { _id: "p1" } }), "p1");
  assert.equal(getCartItemId({ _id: "p2" }), "p2");
  assert.equal(getCartItemId({ productId: "p3" }), "p3");
});

test("mergeCartItems keeps the higher quantity when the same product exists in both carts", () => {
  const merged = mergeCartItems(
    [{ product: { _id: "p1" }, qty: 2 }],
    [{ product: { _id: "p1" }, qty: 1 }]
  );

  assert.equal(merged.length, 1);
  assert.equal(merged[0].qty, 2);
});
