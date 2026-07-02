import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'react-toastify';
import { formatINR } from '@/components/IntToPrice';

const productTemplateHref = new URL(
  '../../../assets/templates/product-template.xlsx',
  import.meta.url
).href;

// ── Icons ─────────────────────────────────────────────────────────────────────
const PlusIcon  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>;
const EyeIcon   = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>;
const PencilIcon= () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;
const ChevronL  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>;
const ChevronR  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>;
const DownloadIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>;

// ── Helpers ───────────────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  'Eyeglasses':     'bg-blue-50   text-blue-700   ring-1 ring-blue-200',
  'Sunglasses':     'bg-amber-50  text-amber-700  ring-1 ring-amber-200',
  'Contact Lenses': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  'Accessories':    'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  'Smart Glasses':  'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
};

const CategoryBadge = ({ cat }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_COLORS[cat] ?? 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'}`}>
    {cat}
  </span>
);

const totalStock = (p) => (Array.isArray(p.stock) ? p.stock.reduce((a, b) => a + Number(b || 0), 0) : 0);

const PAGE_SIZE = 10;

// ── Main component ─────────────────────────────────────────────────────────────
const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage]     = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting]           = useState(false);
  const [addModalOpen, setAddModalOpen]   = useState(false);
  const [downloading, setDownloading]     = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/get-products');
      setProducts(data.products ?? []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/delete-product/${confirmDelete}`);
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p._id !== confirmDelete));
      setConfirmDelete(null);
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    setDownloading(true);
    try {
      const link = document.createElement('a');
      link.href  = productTemplateHref;
      link.download = 'product-template.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error('Failed to download template');
    } finally {
      setDownloading(false);
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();

  const filtered = products.filter((p) => {
    const matchCat    = !categoryFilter || p.category === categoryFilter;
    const matchSearch = !search || [p.modelName, p.modelTitle, p.brand, p.modelCode]
      .some((v) => v?.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(currentPage, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (e) => { setSearch(e.target.value); setCurrentPage(1); };
  const handleCat    = (c)  => { setCategoryFilter(c); setCurrentPage(1); };

  return (
    <div className="min-h-screen bg-gray-50/60 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={handleDownloadTemplate}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors disabled:opacity-50"
          >
            <DownloadIcon /> Template
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-sm transition-colors"
          >
            <PlusIcon /> Add Product
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 px-4 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-600">Category</span>
          {['', ...categories].map((c) => (
            <button
              key={c}
              onClick={() => handleCat(c)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                categoryFilter === c ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c || 'All'}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <input
            type="text"
            placeholder="Search name, brand, model…"
            value={search}
            onChange={handleSearch}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 w-56"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <span className="text-4xl">📦</span>
            <p className="text-sm font-medium">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {['#', 'Product', 'Model No.', 'Brand', 'Category', 'Price', 'Stock', ''].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((product, idx) => {
                  const stock = totalStock(product);
                  const discPct = Number(product.discount) || 0;
                  return (
                    <tr key={product._id} className="hover:bg-gray-50/70 transition-colors group">
                      <td className="px-5 py-3.5 text-gray-400 text-xs font-medium">
                        {(safePage - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs shrink-0">📷</div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 truncate max-w-[12rem]">{product.modelName}</p>
                            {product.modelCode && <p className="text-[11px] text-gray-400 mt-0.5">{product.modelTitle}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">{product.modelCode || '—'}</td>
                      <td className="px-5 py-3.5 text-gray-700 text-xs font-medium whitespace-nowrap">{product.brand || '—'}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap"><CategoryBadge cat={product.category} /></td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <p className="font-semibold text-gray-800">{formatINR(product.price)}</p>
                        {discPct > 0 && <p className="text-[11px] text-emerald-600 font-medium">{discPct}% off</p>}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          stock > 10 ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            : stock > 0 ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                            : 'bg-red-50 text-red-600 ring-1 ring-red-200'
                        }`}>
                          {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a
                            href={`/product/${product._id}`}
                            target="_blank"
                            rel="noreferrer"
                            title="View on site"
                            className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <EyeIcon />
                          </a>
                          <button
                            title="Edit product"
                            onClick={() => navigate(`/Admin/edit-product/${product._id}`)}
                            className="p-2 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            <PencilIcon />
                          </button>
                          <button
                            title="Delete product"
                            onClick={() => setConfirmDelete(product._id)}
                            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Page {safePage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={safePage === 1}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"><ChevronL /></button>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={safePage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"><ChevronR /></button>
            </div>
          </div>
        )}
      </div>

      {/* Add Product modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setAddModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Add Products</h2>
              <button onClick={() => setAddModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">✕</button>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setAddModalOpen(false); navigate('/Admin/add-product'); }}
                className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                Add Product Manually
              </button>
              <button
                onClick={() => { setAddModalOpen(false); navigate('/Admin/products/bulk-upload'); }}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
              >
                Upload via Excel
              </button>
            </div>
            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
              <p className="text-xs text-gray-500">Need the Excel template?</p>
              <button
                onClick={handleDownloadTemplate}
                disabled={downloading}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {downloading ? 'Downloading…' : 'Download Template'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4"><TrashIcon /></div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Delete Product?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">This will permanently remove the product and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {deleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
