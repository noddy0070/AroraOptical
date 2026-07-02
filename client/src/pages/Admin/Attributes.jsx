import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'react-toastify';

// ── Icons ─────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const PencilIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const XIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
const TYPE_STYLES = {
  Lens:    'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  Frame:   'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  General: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
};
const TypeBadge = ({ type }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${TYPE_STYLES[type] ?? 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'}`}>
    {type || '—'}
  </span>
);

const EMPTY_FORM = { name: '', attributeType: '', attributeValueType: 'Single', attributeValues: [] };

// ── Form panel (shared for Add + Edit) ───────────────────────────────────────
const AttributeForm = ({ title, form, setForm, onSave, onClose, saving }) => {
  const [newVal, setNewVal] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())          e.name = 'Name is required.';
    if (!form.attributeType)        e.attributeType = 'Type is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (validate()) onSave();
  };

  const addValue = () => {
    const v = newVal.trim();
    if (v && !form.attributeValues.includes(v)) {
      setForm((f) => ({ ...f, attributeValues: [...f.attributeValues, v] }));
      setNewVal('');
    }
  };

  const removeValue = (v) =>
    setForm((f) => ({ ...f, attributeValues: f.attributeValues.filter((x) => x !== v) }));

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[420px] bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          <p className="font-bold text-gray-800 text-lg">{title}</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-500">
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Attribute Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Frame Color"
              className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors ${
                errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-gray-900'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Attribute Type <span className="text-red-500">*</span>
            </label>
            <select
              value={form.attributeType}
              onChange={(e) => setForm((f) => ({ ...f, attributeType: e.target.value }))}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-white transition-colors ${
                errors.attributeType ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-gray-900'
              }`}
            >
              <option value="">Select type</option>
              <option value="Lens">Lens</option>
              <option value="Frame">Frame</option>
              <option value="General">General</option>
            </select>
            {errors.attributeType && <p className="text-xs text-red-500 mt-1">{errors.attributeType}</p>}
          </div>

          {/* Value Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Value Type</label>
            <div className="flex gap-4">
              {['Single', 'Multiple'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={opt}
                    checked={form.attributeValueType === opt}
                    onChange={() => setForm((f) => ({ ...f, attributeValueType: opt }))}
                    className="accent-gray-900"
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Values (Multiple only) */}
          {form.attributeValueType === 'Multiple' && (
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Values</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newVal}
                  onChange={(e) => setNewVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())}
                  placeholder="Type a value and press Enter"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button
                  type="button"
                  onClick={addValue}
                  className="px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Add
                </button>
              </div>
              {form.attributeValues.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {form.attributeValues.map((v) => (
                    <span key={v} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {v}
                      <button onClick={() => removeValue(v)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <XIcon />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No values added yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {saving
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
              : 'Save Attribute'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AttributesPage() {
  const [attributes, setAttributes]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [typeFilter, setTypeFilter]       = useState('');
  const [search, setSearch]               = useState('');

  const [addOpen, setAddOpen]             = useState(false);
  const [addForm, setAddForm]             = useState(EMPTY_FORM);
  const [addSaving, setAddSaving]         = useState(false);

  const [editOpen, setEditOpen]           = useState(false);
  const [editForm, setEditForm]           = useState(null);
  const [editSaving, setEditSaving]       = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting]           = useState(false);

  useEffect(() => { fetchAttributes(); }, []);

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/get-attributes', {});
      setAttributes(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load attributes');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setAddSaving(true);
    try {
      await api.post('/api/admin/add-attributes', addForm, {});
      toast.success('Attribute added');
      setAddOpen(false);
      setAddForm(EMPTY_FORM);
      fetchAttributes();
    } catch {
      toast.error('Failed to add attribute');
    } finally {
      setAddSaving(false);
    }
  };

  const handleEdit = async () => {
    setEditSaving(true);
    try {
      await api.put('/api/admin/edit-attributes', editForm, {});
      toast.success('Attribute updated');
      setEditOpen(false);
      fetchAttributes();
    } catch {
      toast.error('Failed to update attribute');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/delete-attributes/${confirmDelete}`, {});
      toast.success('Attribute deleted');
      setAttributes((prev) => prev.filter((a) => a._id !== confirmDelete));
      setConfirmDelete(null);
    } catch {
      toast.error('Failed to delete attribute');
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = (attr) => {
    setEditForm({ ...attr, attributeValues: attr.attributeValues ?? [] });
    setEditOpen(true);
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const filtered = attributes.filter((a) => {
    const matchType   = !typeFilter || a.attributeType === typeFilter;
    const matchSearch = !search || a.name?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50/60 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Attributes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} attribute{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAttributes}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => { setAddForm(EMPTY_FORM); setAddOpen(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-sm transition-colors"
          >
            <PlusIcon />
            Add Attribute
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 px-4 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Type</span>
          {['', 'Lens', 'Frame', 'General'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                typeFilter === t ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t || 'All'}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <input
            type="text"
            placeholder="Search attributes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 w-52"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <span className="text-4xl">🏷️</span>
            <p className="text-sm font-medium">No attributes found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {['#', 'Name', 'Type', 'Value Type', 'Values', ''].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((attr, idx) => (
                  <tr key={attr._id} className="hover:bg-gray-50/70 transition-colors group">
                    <td className="px-5 py-4 text-gray-400 text-xs font-medium">{idx + 1}</td>
                    <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">{attr.name}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <TypeBadge type={attr.attributeType} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        attr.attributeValueType === 'Multiple'
                          ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-200'
                          : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
                      }`}>
                        {attr.attributeValueType}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {attr.attributeValues?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {attr.attributeValues.slice(0, 4).map((v) => (
                            <span key={v} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{v}</span>
                          ))}
                          {attr.attributeValues.length > 4 && (
                            <span className="px-2 py-0.5 text-gray-400 text-xs">+{attr.attributeValues.length - 4} more</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          title="Edit"
                          onClick={() => openEdit(attr)}
                          className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <PencilIcon />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => setConfirmDelete(attr._id)}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add drawer */}
      {addOpen && (
        <AttributeForm
          title="Add Attribute"
          form={addForm}
          setForm={setAddForm}
          onSave={handleAdd}
          onClose={() => setAddOpen(false)}
          saving={addSaving}
        />
      )}

      {/* Edit drawer */}
      {editOpen && editForm && (
        <AttributeForm
          title="Edit Attribute"
          form={editForm}
          setForm={setEditForm}
          onSave={handleEdit}
          onClose={() => setEditOpen(false)}
          saving={editSaving}
        />
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <TrashIcon />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Delete Attribute?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              This will permanently remove the attribute. Products using it may be affected.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
