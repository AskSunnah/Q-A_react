import BlockEditor from "../../Components/Admin/BlockEditor";

export default function PageEditor({ page, onChange, onDelete, onAddBlock }) {
  const updateBlock = (idx, newBlock) => {
    const blocks = [...page.blocks];
    blocks[idx] = newBlock;
    onChange({ ...page, blocks });
  };
  const deleteBlock = idx => {
    const blocks = page.blocks.filter((_, i) => i !== idx);
    onChange({ ...page, blocks });
  };

  const updateField = (field, value) => onChange({ ...page, [field]: value });
  const handleRefsChange = e =>
    updateField("references", e.target.value.split(",").map(r => r.trim()).filter(Boolean));

  return (
    <div className="page-block">
      <label>Page #
        <input
          type="number"
          value={page.number || ""}
          onChange={e => updateField("number", Number(e.target.value))}
        />
      </label>
      <label>References
        <input
          value={page.references?.join(", ") || ""}
          onChange={handleRefsChange}
        />
      </label>
      <div>
        {page.blocks.map((block, idx) => (
          <BlockEditor
            key={idx}
            block={block}
            onChange={newBlock => updateBlock(idx, newBlock)}
            onDelete={() => deleteBlock(idx)}
          />
        ))}
        <button type="button" className="btn-add" onClick={onAddBlock}>Add Block</button>
      </div>
      <button type="button" className="btn-delete" onClick={onDelete}>Remove Page</button>
    </div>
  );
}
