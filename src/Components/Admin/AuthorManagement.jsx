// Components/Admin/AuthorManagement.jsx
import React, { useState } from "react";
import {
  updateAuthor,
  fetchAuthorBooks,
  deleteAuthor,
  createAuthor,
} from "../../api/adminBook";

const BLANK_YEAR_FIELDS = {
  birthYear: null,
  birthYearUnknown: false,
  deathYear: null,
  deathYearUnknown: false,
};
function YearFields({ obj, onChange, labelCls }) {
  return (
    <>
      <label className={labelCls}>Birth Year:</label>
      <div className="flex items-center gap-3 mb-4">
        <input
          type="number"
          className="flex-1 px-3 py-[0.6rem] text-base border border-[#ccc] rounded-lg box-border"
          value={obj.birthYear ?? ""}
          onChange={(e) =>
            onChange({
              ...obj,
              birthYear: e.target.value ? Number(e.target.value) : null,
            })
          }
          disabled={!!obj.birthYearUnknown}
          placeholder="e.g. 1263"
        />

        <label className="flex items-center gap-2 whitespace-nowrap text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={!!obj.birthYearUnknown}
            onChange={(e) =>
              onChange({
                ...obj,
                birthYearUnknown: e.target.checked,
                birthYear: e.target.checked ? null : obj.birthYear,
              })
            }
          />
          Unknown
        </label>
      </div>

      <label className={labelCls}>Death Year:</label>
      <div className="flex items-center gap-3 mb-4">
        <input
          type="number"
          className="flex-1 px-3 py-[0.6rem] text-base border border-[#ccc] rounded-lg box-border"
          value={obj.deathYear ?? ""}
          onChange={(e) =>
            onChange({
              ...obj,
              deathYear: e.target.value ? Number(e.target.value) : null,
            })
          }
          disabled={!!obj.deathYearUnknown}
          placeholder="e.g. 1328"
        />

        <label className="flex items-center gap-2 whitespace-nowrap text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={!!obj.deathYearUnknown}
            onChange={(e) =>
              onChange({
                ...obj,
                deathYearUnknown: e.target.checked,
                deathYear: e.target.checked ? null : obj.deathYear,
              })
            }
          />
          Unknown / Still alive
        </label>
      </div>
    </>
  );
}
export default function AuthorManagement({
  authors,
  setAuthors,
  selectedAuthorId,
  language,
  onSelect,
  onError,
  onSuccess,
  contentDirectionProps,
  fieldCls,
  labelCls,
  selectFieldCls,
}) {
  const [editingAuthor, setEditingAuthor] = useState(null); // full author object | null
  const [linkedBooks, setLinkedBooks] = useState(null); // null | array
  const [reassignMap, setReassignMap] = useState({}); // { slug: newAuthorId }
  const [busy, setBusy] = useState(false);

  // When a book row in the reassign list is set to "-- Create new --",
  // this holds the slug of that book so we can show the inline form.
  const [creatingForSlug, setCreatingForSlug] = useState(null);
  const [newAuthorForm, setNewAuthorForm] = useState({
    name: "",
    bio: "",
    ...BLANK_YEAR_FIELDS,
  });
  const [savingNew, setSavingNew] = useState(false);

  // ── Dropdown ────────────────────────────────────────────────────────────────

  const handleAuthorSelect = (e) => {
    const id = e.target.value;
    if (!id) {
      onSelect(null);
      return;
    }
    const author = authors.find((a) => a._id === id);
    if (author) onSelect(author);
  };

  // ── Edit author ─────────────────────────────────────────────────────────────

  const openEditAuthor = () => {
    const a = authors.find((x) => x._id === selectedAuthorId);
    if (a) setEditingAuthor({ ...a });
  };

  const closeEditAuthor = () => setEditingAuthor(null);

  const handleSaveAuthor = async () => {
    if (!editingAuthor?.name?.trim()) {
      onError("Author name is required.");
      return;
    }

    setBusy(true);
    try {
      const updated = await updateAuthor(editingAuthor._id, {
        name: editingAuthor.name,
        bio: editingAuthor.bio,
        birthYear: editingAuthor.birthYearUnknown
          ? null
          : editingAuthor.birthYear || null,
        birthYearUnknown: !!editingAuthor.birthYearUnknown,
        deathYear: editingAuthor.deathYearUnknown
          ? null
          : editingAuthor.deathYear || null,
        deathYearUnknown: !!editingAuthor.deathYearUnknown,
      });

      setAuthors((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a)),
      );

      if (selectedAuthorId === updated._id) {
        onSelect(updated);
      }

      setEditingAuthor(null);
    } catch (err) {
      onError(err.message);
    } finally {
      setBusy(false);
    }
  };

  // ── Delete author flow ───────────────────────────────────────────────────────

  const handleDeleteAuthorClick = async () => {
    setBusy(true);
    try {
      const books = await fetchAuthorBooks(editingAuthor._id);
      setLinkedBooks(books);
      setReassignMap({});
      setCreatingForSlug(null);
      setNewAuthorForm({ name: "", bio: "", ...BLANK_YEAR_FIELDS });
    } catch (err) {
      onError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const cancelDeleteFlow = () => {
    setLinkedBooks(null);
    setReassignMap({});
    setCreatingForSlug(null);
    setNewAuthorForm({ name: "", bio: "", ...BLANK_YEAR_FIELDS });
  };

  const finishDelete = (message) => {
    setAuthors((prev) => prev.filter((a) => a._id !== editingAuthor._id));

    if (selectedAuthorId === editingAuthor._id) {
      onSelect(null);
    }

    setLinkedBooks(null);
    setReassignMap({});
    setCreatingForSlug(null);
    setNewAuthorForm({ name: "", bio: "", ...BLANK_YEAR_FIELDS });
    setEditingAuthor(null);
    onSuccess?.(message);
  };

  const handleConfirmDelete = async () => {
    setBusy(true);
    try {
      const reassignments = linkedBooks.map((b) => ({
        slug: b.slug,
        newAuthorId: reassignMap[b.slug],
      }));

      const result = await deleteAuthor(editingAuthor._id, reassignments);
      finishDelete(result.message);
    } catch (err) {
      onError(err.message);
    } finally {
      setBusy(false);
    }
  };

  // ── Inline "create new author" inside reassign flow ─────────────────────────

  const handleReassignDropdownChange = (slug, value) => {
    if (value === "__create_new__") {
      setCreatingForSlug(slug);
      setNewAuthorForm({ name: "", bio: "", ...BLANK_YEAR_FIELDS });
      // Don't set reassignMap yet — wait until the new author is actually saved
    } else {
      setCreatingForSlug(null);
      setReassignMap((prev) => ({ ...prev, [slug]: value }));
    }
  };

  const handleSaveNewAuthor = async () => {
    if (!newAuthorForm.name.trim()) {
      onError("Author name is required.");
      return;
    }

    setSavingNew(true);
    try {
      const created = await createAuthor({
        name: newAuthorForm.name.trim(),
        bio: newAuthorForm.bio,
        language,
        birthYear: newAuthorForm.birthYearUnknown
          ? null
          : newAuthorForm.birthYear || null,
        birthYearUnknown: !!newAuthorForm.birthYearUnknown,
        deathYear: newAuthorForm.deathYearUnknown
          ? null
          : newAuthorForm.deathYear || null,
        deathYearUnknown: !!newAuthorForm.deathYearUnknown,
      });

      // Add to the local authors list so it appears in other dropdowns too
      setAuthors((prev) => [...prev, created]);

      // Mark this book as reassigned to the new author
      setReassignMap((prev) => ({ ...prev, [creatingForSlug]: created._id }));
      setCreatingForSlug(null);
      setNewAuthorForm({ name: "", bio: "", ...BLANK_YEAR_FIELDS });
    } catch (err) {
      onError(err.message);
    } finally {
      setSavingNew(false);
    }
  };

  const allReassigned =
    linkedBooks?.length > 0 && linkedBooks.every((b) => !!reassignMap[b.slug]);

  return (
    <>
      <label className={labelCls}>Saved Author:</label>
      <div className="flex items-center gap-2">
        <select
          {...contentDirectionProps}
          className={`${selectFieldCls} flex-1`}
          value={selectedAuthorId || ""}
          onChange={handleAuthorSelect}
        >
          <option value="">-- Select saved author or add new below --</option>
          {authors.map((author) => (
            <option key={author._id} value={author._id}>
              {author.name}
            </option>
          ))}
        </select>

        {selectedAuthorId && (
          <button
            type="button"
            title="Edit author details"
            onClick={openEditAuthor}
            className="p-2 rounded-lg border border-[#ccc] hover:bg-gray-50 shrink-0"
          >
            ✏️
          </button>
        )}
      </div>

      {/* ── Edit Author modal ── */}
      {editingAuthor && !linkedBooks && (
        <div className="block fixed top-5 left-1/2 -translate-x-1/2 bg-white text-[#1e293b] border border-[#ccc] py-6 px-8 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[10000] w-[90%] max-w-[500px] overflow-y-auto max-h-[90vh]">
          <strong className="block text-[1.1rem] mb-3">Edit Author</strong>

          <label className={labelCls}>Name:</label>
          <input
            className={fieldCls}
            value={editingAuthor.name}
            onChange={(e) =>
              setEditingAuthor({ ...editingAuthor, name: e.target.value })
            }
          />

          <label className={labelCls}>Bio:</label>
          <textarea
            className={fieldCls}
            value={editingAuthor.bio || ""}
            onChange={(e) =>
              setEditingAuthor({ ...editingAuthor, bio: e.target.value })
            }
          />

          <YearFields
            obj={editingAuthor}
            onChange={(updated) => setEditingAuthor(updated)}
            labelCls={labelCls}
          />

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              disabled={busy}
              className="bg-[#287346] text-white border-none py-2 px-5 font-bold rounded-[6px] cursor-pointer disabled:opacity-50"
              onClick={handleSaveAuthor}
            >
              Save
            </button>
            <button
              type="button"
              disabled={busy}
              className="bg-[#e53e3e] text-white border-none py-2 px-5 font-bold rounded-[6px] cursor-pointer disabled:opacity-50"
              onClick={closeEditAuthor}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={busy}
              className="bg-transparent text-[#e53e3e] border border-[#e53e3e] py-2 px-4 font-bold rounded-[6px] cursor-pointer ml-auto disabled:opacity-50"
              onClick={handleDeleteAuthorClick}
            >
              🗑 Delete Author
            </button>
          </div>
        </div>
      )}

      {/* ── Delete / Reassign modal ── */}
      {linkedBooks && (
        <div className="block fixed top-5 left-1/2 -translate-x-1/2 bg-white text-[#1e293b] border border-[#ccc] py-6 px-8 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[10001] w-[90%] max-w-[580px] overflow-y-auto max-h-[90vh]">
          <strong className="block text-[1.1rem] mb-2">
            {linkedBooks.length === 0
              ? `Delete "${editingAuthor.name}"?`
              : `Can't delete "${editingAuthor.name}" yet`}
          </strong>

          {linkedBooks.length === 0 ? (
            <>
              <p className="mb-4">
                This author isn't linked to any books. Deleting is safe.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={busy}
                  className="bg-[#e53e3e] text-white border-none py-2 px-5 font-bold rounded-[6px] cursor-pointer disabled:opacity-50"
                  onClick={handleConfirmDelete}
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className="bg-[#287346] text-white border-none py-2 px-5 font-bold rounded-[6px] cursor-pointer disabled:opacity-50"
                  onClick={cancelDeleteFlow}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mb-4">
                This author is linked to {linkedBooks.length} book
                {linkedBooks.length > 1 ? "s" : ""}. Reassign each one to a
                different author below, then delete.
              </p>

              <div className="mb-4">
                {linkedBooks.map((b) => (
                  <div
                    key={b.slug}
                    className="mb-4 pb-4 border-b border-[#eee] last:border-b-0"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="font-medium flex-1">{b.title}</span>
                      <select
                        className="px-2 py-1 border border-[#ccc] rounded-md text-sm min-w-[180px]"
                        value={
                          creatingForSlug === b.slug
                            ? "__create_new__"
                            : reassignMap[b.slug] || ""
                        }
                        onChange={(e) =>
                          handleReassignDropdownChange(b.slug, e.target.value)
                        }
                      >
                        <option value="">-- Choose new author --</option>
                        {authors
                          .filter((a) => a._id !== editingAuthor._id)
                          .map((a) => (
                            <option key={a._id} value={a._id}>
                              {a.name}
                            </option>
                          ))}
                        <option value="__create_new__">
                          ➕ Create new author…
                        </option>
                      </select>
                    </div>

                    {/* Inline create-new-author form for this book */}
                    {creatingForSlug === b.slug && (
                      <div className="mt-2 p-4 bg-[#f8f9fa] border border-[#ddd] rounded-lg">
                        <strong className="block text-sm mb-3 text-[#1e293b]">
                          New Author for "{b.title}"
                        </strong>

                        <label className="font-bold text-sm block mb-1 text-[var(--bg-color-header)]">
                          Name:
                        </label>
                        <input
                          className="block w-full mb-3 px-3 py-2 text-sm border border-[#ccc] rounded-lg"
                          value={newAuthorForm.name}
                          onChange={(e) =>
                            setNewAuthorForm((f) => ({
                              ...f,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Author name"
                          autoFocus
                        />

                        <label className="font-bold text-sm block mb-1 text-[var(--bg-color-header)]">
                          Bio:
                        </label>
                        <textarea
                          className="block w-full mb-3 px-3 py-2 text-sm border border-[#ccc] rounded-lg"
                          rows={2}
                          value={newAuthorForm.bio}
                          onChange={(e) =>
                            setNewAuthorForm((f) => ({
                              ...f,
                              bio: e.target.value,
                            }))
                          }
                          placeholder="Short biography (optional)"
                        />

                        <label className="font-bold text-sm block mb-1 text-[var(--bg-color-header)]">
                          Birth Year:
                        </label>
                        <div className="flex items-center gap-3 mb-3">
                          <input
                            type="number"
                            className="flex-1 px-3 py-2 text-sm border border-[#ccc] rounded-lg"
                            value={newAuthorForm.birthYear ?? ""}
                            onChange={(e) =>
                              setNewAuthorForm((f) => ({
                                ...f,
                                birthYear: e.target.value
                                  ? Number(e.target.value)
                                  : null,
                              }))
                            }
                            disabled={!!newAuthorForm.birthYearUnknown}
                            placeholder="e.g. 1263"
                          />
                          <label className="flex items-center gap-2 whitespace-nowrap text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!newAuthorForm.birthYearUnknown}
                              onChange={(e) =>
                                setNewAuthorForm((f) => ({
                                  ...f,
                                  birthYearUnknown: e.target.checked,
                                  birthYear: e.target.checked
                                    ? null
                                    : f.birthYear,
                                }))
                              }
                            />
                            Unknown
                          </label>
                        </div>

                        <label className="font-bold text-sm block mb-1 text-[var(--bg-color-header)]">
                          Death Year:
                        </label>
                        <div className="flex items-center gap-3 mb-4">
                          <input
                            type="number"
                            className="flex-1 px-3 py-2 text-sm border border-[#ccc] rounded-lg"
                            value={newAuthorForm.deathYear ?? ""}
                            onChange={(e) =>
                              setNewAuthorForm((f) => ({
                                ...f,
                                deathYear: e.target.value
                                  ? Number(e.target.value)
                                  : null,
                              }))
                            }
                            disabled={!!newAuthorForm.deathYearUnknown}
                            placeholder="e.g. 1328"
                          />
                          <label className="flex items-center gap-2 whitespace-nowrap text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!newAuthorForm.deathYearUnknown}
                              onChange={(e) =>
                                setNewAuthorForm((f) => ({
                                  ...f,
                                  deathYearUnknown: e.target.checked,
                                  deathYear: e.target.checked
                                    ? null
                                    : f.deathYear,
                                }))
                              }
                            />
                            Unknown / Still alive
                          </label>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={savingNew}
                            className="bg-[#287346] text-white border-none py-1.5 px-4 text-sm font-bold rounded-[6px] cursor-pointer disabled:opacity-50"
                            onClick={handleSaveNewAuthor}
                          >
                            {savingNew ? "Saving…" : "Save Author"}
                          </button>
                          <button
                            type="button"
                            disabled={savingNew}
                            className="bg-transparent text-[#555] border border-[#ccc] py-1.5 px-4 text-sm font-bold rounded-[6px] cursor-pointer disabled:opacity-50"
                            onClick={() => {
                              setCreatingForSlug(null);
                              setNewAuthorForm({
                                name: "",
                                bio: "",
                                ...BLANK_YEAR_FIELDS,
                              });
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Confirmation chip once reassigned */}
                    {reassignMap[b.slug] && creatingForSlug !== b.slug && (
                      <p className="text-xs text-[#287346] mt-1">
                        ✓ Will be reassigned to{" "}
                        <strong>
                          {authors.find((a) => a._id === reassignMap[b.slug])
                            ?.name ?? "selected author"}
                        </strong>
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={busy || !allReassigned || !!creatingForSlug}
                  className="bg-[#e53e3e] text-white border-none py-2 px-5 font-bold rounded-[6px] cursor-pointer disabled:opacity-50"
                  onClick={handleConfirmDelete}
                >
                  Reassign & Delete
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className="bg-[#287346] text-white border-none py-2 px-5 font-bold rounded-[6px] cursor-pointer disabled:opacity-50"
                  onClick={cancelDeleteFlow}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
