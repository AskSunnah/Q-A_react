

export default function BlockEditor({ block, onChange, onDelete }) {
  return (
    <div className="block-block">
      <label>Type
        <select
          value={block.type}
          onChange={e => onChange({ ...block, type: e.target.value })}
        >
          <option value="heading">Heading</option>
          <option value="paragraph">Paragraph</option>
          <option value="ayah">Ayah</option>
          <option value="hadith">Hadith</option>
          <option value="quote">Quote</option>
        </select>
      </label>
      <label>Text
        <textarea
          rows={2}
          value={block.text}
          onChange={e => onChange({ ...block, text: e.target.value })}
        />
      </label>
      <label>Reference
        <input
          value={block.reference}
          onChange={e => onChange({ ...block, reference: e.target.value })}
        />
      </label>
      <label>Narrator
        <input
          value={block.narrator}
          onChange={e => onChange({ ...block, narrator: e.target.value })}
        />
      </label>
      <label>Commentary
        <textarea
          rows={1}
          value={block.commentary}
          onChange={e => onChange({ ...block, commentary: e.target.value })}
        />
      </label>
      <button type="button" className="btn-delete" onClick={onDelete}>Remove Block</button>
    </div>
  );
}
