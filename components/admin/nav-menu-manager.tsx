"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNavItemSchema, updateNavItemSchema } from "@/lib/validators";
import { useAdminSearch } from "@/components/admin/admin-search-context";
import toast from "react-hot-toast";

type NavItem = {
  id: string;
  label: string;
  href: string | null;
  order: number;
  type: string;
  pageType: "SERVICE" | "GENERIC";
  isLoginLink: boolean;
  isActive: boolean;
  parentId: string | null;
  groupLabel: string | null;
  children: NavItem[];
};

type NavMenuManagerProps = {
  region: "INDIA" | "US";
  initialItems: NavItem[];
};

const navFormSchema = createNavItemSchema.extend({
  order: z.preprocess((value) => Number(value ?? 0), z.number().int().min(0)),
  type: z.enum(["LINK", "DROPDOWN"]).default("LINK"),
  isLoginLink: z.boolean().default(false),
});

const updateFormSchema = updateNavItemSchema.extend({
  order: z.preprocess((value) => Number(value ?? 0), z.number().int().min(0)),
});

type NavFormValues = z.infer<typeof navFormSchema>;
type UpdateFormValues = z.infer<typeof updateFormSchema>;

export function NavMenuManager({ region, initialItems }: NavMenuManagerProps) {
  const router = useRouter();
  const [items] = useState<NavItem[]>(initialItems);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [isPending, startTransition] = useTransition();
  const { query } = useAdminSearch();
  const normalizedQuery = query.trim().toLowerCase();

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<NavFormValues>({
    resolver: zodResolver(navFormSchema),
    defaultValues: {
      label: "",
      href: "",
      order: 0,
      pageType: "SERVICE",
      type: "LINK",
      isLoginLink: false,
      region,
      parentId: undefined,
      groupLabel: undefined,
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    formState: { errors: updateErrors },
  } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
  });

  const onSubmitCreate = handleSubmitCreate((values) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/navbar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          let errorMessage = "Unable to save navigation item";
          try {
            const data = await response.json();
            errorMessage = data.error || errorMessage;
          } catch (e) {
            console.error("Create error:", await response.text());
          }
          toast.error(errorMessage);
          return;
        }

        await response.json();
        resetCreate();
        toast.success("Navigation item created successfully");
        router.refresh();
      } catch (error) {
        console.error("Create failed:", error);
        toast.error("Failed to create navigation item. Please try again.");
      }
    });
  });

  const onSubmitUpdate = handleSubmitUpdate((values) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/navbar", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          let errorMessage = "Unable to update navigation item";
          try {
            const data = await response.json();
            errorMessage = data.error || errorMessage;
          } catch (e) {
            console.error("Update error:", await response.text());
          }
          toast.error(errorMessage);
          return;
        }

        await response.json();
        setEditingItem(null);
        resetUpdate();
        toast.success("Navigation item updated successfully");
        router.refresh();
      } catch (error) {
        console.error("Update failed:", error);
        toast.error("Failed to update navigation item. Please try again.");
      }
    });
  });

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this item? All children will also be deleted."
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/navbar?id=${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          let errorMessage = "Unable to delete navigation item";
          try {
            const data = await response.json();
            errorMessage = data.error || errorMessage;
          } catch (e) {
            console.error("Delete error:", await response.text());
          }
          toast.error(errorMessage);
          return;
        }

        await response.json();
        toast.success("Navigation item deleted successfully");
        router.refresh();
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error("Failed to delete navigation item. Please try again.");
      }
    });
  };

  const handleEdit = (item: NavItem) => {
    setEditingItem(item);
    resetUpdate({
      id: item.id,
      label: item.label,
      href: item.href || "",
      order: item.order,
      pageType: item.pageType ?? "SERVICE",
      type: item.type as "LINK" | "DROPDOWN",
      isLoginLink: item.isLoginLink,
      region,
      parentId: item.parentId || undefined,
      groupLabel: item.groupLabel || undefined,
      isActive: item.isActive,
    });
  };

  const filterNavItems = (inputItems: NavItem[]): NavItem[] => {
    return inputItems.reduce<NavItem[]>((acc, item) => {
      const target = `${item.label ?? ""} ${item.href ?? ""} ${
        item.groupLabel ?? ""
      } ${item.type ?? ""}`.toLowerCase();
      const childMatches = item.children.length
        ? filterNavItems(item.children)
        : [];
      if (target.includes(normalizedQuery) || childMatches.length > 0) {
        acc.push({ ...item, children: childMatches });
      }
      return acc;
    }, []);
  };

  // Get all items flattened for parent selection
  const getAllItems = (items: NavItem[]): NavItem[] => {
    const result: NavItem[] = [];
    items.forEach((item) => {
      result.push(item);
      if (item.children.length > 0) {
        result.push(...getAllItems(item.children));
      }
    });
    return result;
  };

  const allItemsFlat = getAllItems(items);
  const topLevelItems = allItemsFlat.filter((item) => !item.parentId);
  const displayItems = normalizedQuery ? filterNavItems(items) : items;
  const displayTopLevelItems = getAllItems(displayItems).filter(
    (item) => !item.parentId
  );

  const renderItem = (item: NavItem, level: number = 0) => (
    <div
      key={item.id}
      className={`${level > 0 ? "ml-6 border-l-2 border-zinc-200 pl-4" : ""}`}
    >
      <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-zinc-400">
              #{item.order}
            </span>
            <span className="font-semibold text-zinc-900">{item.label}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-600">
              {item.type}
            </span>
            {item.groupLabel && (
              <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-600">
                Group: {item.groupLabel}
              </span>
            )}
            {!item.isActive && (
              <span className="text-xs text-red-500">(Inactive)</span>
            )}
          </div>
          {item.href && (
            <p className="text-xs text-zinc-500 mt-1">{item.href}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            Delete
          </button>
        </div>
      </div>
      {item.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {item.children.map((child) => renderItem(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Create Form */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Add New Menu Item
        </h2>
        <form onSubmit={onSubmitCreate} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-800">
                Label *
              </label>
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                {...registerCreate("label")}
              />
              {createErrors.label && (
                <p className="text-xs text-red-500">
                  {createErrors.label.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-800">
                Href
              </label>
              <input
                type="text"
                placeholder="/services"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                {...registerCreate("href")}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-800">
                Order
              </label>
              <input
                type="number"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                {...registerCreate("order")}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-800">
                Item Type
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                {...registerCreate("type")}
              >
                <option value="LINK">Link</option>
                <option value="DROPDOWN">Dropdown</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-800">
                Page Type
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                {...registerCreate("pageType")}
              >
                <option value="SERVICE">Service</option>
                <option value="GENERIC">Generic</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-800">
                Parent Menu
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                {...registerCreate("parentId")}
              >
                <option value="">None (Top Level)</option>
                {topLevelItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-800">
              Group Label
            </label>
            <input
              type="text"
              placeholder="Company Registration"
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              {...registerCreate("groupLabel")}
            />
            <p className="text-xs text-zinc-500">For grouping submenu items</p>
          </div>

          <input type="hidden" value={region} {...registerCreate("region")} />
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-70"
          >
            {isPending ? "Saving..." : "Add Menu Item"}
          </button>
        </form>
      </div>

      {/* Edit Form (shown when editing) */}
      {editingItem && (
        <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Edit Menu Item
          </h2>
          <form onSubmit={onSubmitUpdate} className="space-y-4">
            <input type="hidden" {...registerUpdate("id")} />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">
                  Label *
                </label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  {...registerUpdate("label")}
                />
                {updateErrors.label && (
                  <p className="text-xs text-red-500">
                    {updateErrors.label.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">
                  Href
                </label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  {...registerUpdate("href")}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">
                  Order
                </label>
                <input
                  type="number"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  {...registerUpdate("order")}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">
                  Item Type
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  {...registerUpdate("type")}
                >
                  <option value="LINK">Link</option>
                  <option value="DROPDOWN">Dropdown</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">
                  Page Type
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  {...registerUpdate("pageType")}
                >
                  <option value="SERVICE">Service</option>
                  <option value="GENERIC">Generic</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">
                  Parent Menu
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  {...registerUpdate("parentId")}
                >
                  <option value="">None (Top Level)</option>
                  {topLevelItems
                    .filter((item) => item.id !== editingItem.id)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-800">
                Group Label
              </label>
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                {...registerUpdate("groupLabel")}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
                {...registerUpdate("isActive")}
              />
              <label
                htmlFor="isActive"
                className="text-sm font-semibold text-slate-800"
              >
                Active?
              </label>
            </div>

            <input type="hidden" value={region} {...registerUpdate("region")} />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-70"
              >
                {isPending ? "Updating..." : "Update Item"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  resetUpdate();
                }}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Current Items List */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Current Menu Items
        </h2>
        {items.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No menu items yet. Add one above to get started.
          </p>
        ) : (
          <div className="space-y-2">
            {displayTopLevelItems.length === 0 ? (
              <p className="text-sm text-zinc-500">No matches found.</p>
            ) : (
              displayTopLevelItems.map((item) => renderItem(item))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
