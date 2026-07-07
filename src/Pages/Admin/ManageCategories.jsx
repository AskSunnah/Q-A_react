import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import {
  getQACategories,
  createQACategory,
  updateQACategory,
  toggleQACategory,
} from "../../api/qaCategories";
import {
  FolderTree,
  Plus,
  Pencil,
  Power,
  Save,
  X,
  Languages,
} from "lucide-react";

function flattenCategories(categories, level = 0) {
  return categories.flatMap((cat) => [
    {
      ...cat,
      level,
      displayName: `${"— ".repeat(level)}${cat.name}`,
    },
    ...flattenCategories(cat.children || [], level + 1),
  ]);
}

function CategoryTreeItem({ cat, onEdit, onToggle }) {
  return (
    <div className="mb-2">
      <div
        className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
          cat.isActive === false
            ? "bg-slate-50 border-slate-200 opacity-60"
            : "bg-white border-slate-200"
        }`}
        style={{ marginLeft: `${cat.level * 22}px` }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="m-0 font-bold text-slate-800">{cat.name}</p>

            {cat.parent && (
              <span className="text-[0.7rem] bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">
                Sub Category
              </span>
            )}

            {cat.isActive === false && (
              <span className="text-[0.7rem] bg-slate-100 text-slate-500 border border-slate-200 rounded-full px-2 py-0.5">
                Inactive
              </span>
            )}
          </div>

          <p className="m-0 mt-1 text-xs text-slate-400 break-all">
            {cat.path}
          </p>

          {cat.description && (
            <p className="m-0 mt-1 text-sm text-slate-500">{cat.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(cat)}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
            title="Edit"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() => onToggle(cat._id)}
            className={`p-2 rounded-lg ${
              cat.isActive === false
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
            title={cat.isActive === false ? "Activate" : "Deactivate"}
          >
            <Power size={16} />
          </button>
        </div>
      </div>

      {(cat.children || []).map((child) => (
        <CategoryTreeItem
          key={child._id}
          cat={{ ...child, level: (cat.level || 0) + 1 }}
          onEdit={onEdit}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

export default function ManageQACategories() {
  const [lang, setLang] = useState("en");
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    parent: "",
    description: "",
    order: 0,
  });

  const flatCategories = useMemo(
    () => flattenCategories(categoriesTree),
    [categoriesTree],
  );

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getQACategories(lang, true, true);
      setCategoriesTree(data);
    } catch (err) {
      setMsg(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEditing(null);
    setForm({
      name: "",
      parent: "",
      description: "",
      order: 0,
    });
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: "",
      parent: "",
      description: "",
      order: 0,
    });
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name || "",
      parent: cat.parent?._id || cat.parent || "",
      description: cat.description || "",
      order: cat.order || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!form.name.trim()) {
      setMsg("Please enter a category name.");
      return;
    }

    try {
      if (editing) {
        await updateQACategory(editing._id, {
          name: form.name,
          parent: form.parent || null,
          description: form.description,
          order: form.order,
          isActive: editing.isActive !== false,
        });
        setMsg("Category updated successfully.");
      } else {
        await createQACategory({
          name: form.name,
          lang,
          parent: form.parent || null,
          description: form.description,
          order: form.order,
        });
        setMsg("Category created successfully.");
      }

      resetForm();
      await loadCategories();
    } catch (err) {
      setMsg(err.message || "Could not save category.");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleQACategory(id);
      await loadCategories();
    } catch (err) {
      setMsg(err.message || "Could not update category.");
    }
  };

  const parentOptions = flatCategories.filter((cat) => {
    if (!editing) return true;
    return cat._id !== editing._id;
  });

  return (
    <AdminLayout>
      <div className="max-w-[980px] mx-auto mt-10 px-4">
        <div className="mb-6">
          <h1 className="text-[1.85rem] font-bold text-slate-800 m-0 flex items-center gap-2.5">
            <FolderTree size={27} className="text-[#c3a421]" />
            Q&amp;A Categories
          </h1>
          <p className="text-[0.95rem] text-slate-500 mt-1 mb-0">
            Create, edit, and organize nested categories for published answers.
          </p>
        </div>

        {msg && (
          <div
            className={`mb-5 px-4 py-2.5 rounded-xl text-[0.9rem] font-medium ${
              msg.toLowerCase().includes("failed") ||
              msg.toLowerCase().includes("could") ||
              msg.toLowerCase().includes("please")
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            {msg}
          </div>
        )}

        <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1.5 mb-6 max-w-[360px]">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`flex-1 px-4 py-2.5 rounded-[10px] font-semibold text-[0.9rem] cursor-pointer flex items-center justify-center gap-2 transition-all ${
              lang === "en"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Languages size={16} />
            English
          </button>

          <button
            type="button"
            onClick={() => setLang("ar")}
            className={`flex-1 px-4 py-2.5 rounded-[10px] font-semibold text-[0.9rem] cursor-pointer flex items-center justify-center gap-2 transition-all ${
              lang === "ar"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            العربية
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8"
        >
          <div className="flex items-center justify-between gap-3 mb-5">
            <h2 className="m-0 text-xl font-bold text-slate-800 flex items-center gap-2">
              {editing ? (
                <>
                  <Pencil size={20} className="text-[#c3a421]" />
                  Edit Category
                </>
              ) : (
                <>
                  <Plus size={20} className="text-[#c3a421]" />
                  Create Category
                </>
              )}
            </h2>

            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X size={15} />
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder={lang === "ar" ? "مثال: الصلاة" : "Example: Prayer"}
                dir={lang === "ar" ? "rtl" : "ltr"}
                className={`w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#c3a421] ${
                  lang === "ar" ? "text-right" : "text-left"
                }`}
              />
              <p className="text-xs text-slate-400 mt-1 mb-0">
                Slug is created automatically.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Parent Category
              </label>
              <select
                value={form.parent}
                onChange={(e) =>
                  setForm((p) => ({ ...p, parent: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#c3a421] bg-white"
              >
                <option value="">No parent — top level</option>
                {parentOptions.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.displayName}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1 mb-0">
                Select a parent to create a nested category.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Order
              </label>
              <input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm((p) => ({ ...p, order: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#c3a421]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Optional"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#c3a421]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 flex items-center justify-center gap-2 bg-[var(--bg-color-header)] text-white rounded-xl px-5 py-3 font-bold hover:opacity-90"
          >
            <Save size={17} />
            {editing ? "Update Category" : "Create Category"}
          </button>
        </form>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between gap-3 mb-5">
            <h2 className="m-0 text-xl font-bold text-slate-800">
              Existing Categories
            </h2>
            <span className="bg-slate-100 text-slate-500 text-[0.8rem] font-semibold px-2.5 py-1 rounded-full">
              {flatCategories.length}
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : flatCategories.length === 0 ? (
            <div className="text-center py-12 px-6 text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
              No categories found. Create your first category above.
            </div>
          ) : (
            <div>
              {categoriesTree.map((cat) => (
                <CategoryTreeItem
                  key={cat._id}
                  cat={{ ...cat, level: 0 }}
                  onEdit={handleEdit}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
