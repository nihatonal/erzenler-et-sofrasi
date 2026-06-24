"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartOrderMode = "table" | "delivery";

export type CartOption = {
  id: string;
  name: string;
  priceDifferenceTry: number;
};

export type CartRemovable = {
  id: string;
  name: string;
};

export type CartItem = {
  cartItemId: string;

  productId: string;
  productSlug: string;
  productName: string;
  productImageUrl: string | null;

  quantity: number;

  basePriceTry: number;
  selectedOption: CartOption | null;
  removables: CartRemovable[];

  note: string | null;

  orderMode: CartOrderMode;
  tableId: string | null;
  tableLabel: string | null;

  locale: string;
};

type AddCartItemInput = Omit<CartItem, "cartItemId" | "quantity"> & {
  quantity?: number;
};

type CartState = {
  items: CartItem[];

  addItem: (item: AddCartItemInput) => void;
  removeItem: (cartItemId: string) => void;
  increaseQuantity: (cartItemId: string) => void;
  decreaseQuantity: (cartItemId: string) => void;
  updateNote: (cartItemId: string, note: string) => void;
  clearCart: () => void;

  getSubtotal: () => number;
  getItemTotal: (item: CartItem) => number;
  getTotalQuantity: () => number;
};

function createCartItemId(item: AddCartItemInput) {
  const optionId = item.selectedOption?.id || "no-option";
  const removableIds = item.removables
    .map((removable) => removable.id)
    .sort()
    .join("-");

  return [
    item.productId,
    optionId,
    removableIds || "no-removable",
    item.note || "no-note",
    item.orderMode,
    item.tableId || "no-table",
  ].join("__");
}

function getItemUnitPrice(item: CartItem) {
  return item.basePriceTry + Number(item.selectedOption?.priceDifferenceTry || 0);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (input) => {
        const cartItemId = createCartItemId(input);

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.cartItemId === cartItemId,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.cartItemId === cartItemId
                  ? {
                      ...item,
                      quantity: item.quantity + (input.quantity || 1),
                    }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...input,
                cartItemId,
                quantity: input.quantity || 1,
              },
            ],
          };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      increaseQuantity: (cartItemId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }));
      },

      decreaseQuantity: (cartItemId) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.cartItemId === cartItemId
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            )
            .filter((item) => item.quantity > 0),
        }));
      },

      updateNote: (cartItemId, note) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, note: note.trim() || null }
              : item,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemTotal: (item) => {
        return getItemUnitPrice(item) * item.quantity;
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          return total + getItemUnitPrice(item) * item.quantity;
        }, 0);
      },

      getTotalQuantity: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "restaurant-cart",
    },
  ),
);