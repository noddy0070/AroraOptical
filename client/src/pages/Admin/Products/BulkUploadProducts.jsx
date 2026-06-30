import { useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { baseURL } from "@/url";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const REQUIRED_FIELDS = ["Category", "Model Name", "Model Number", "Color Code", "Brand", "Gender", "Price"];

// ── Icons ─────────────────────────────────────────────────────────────────────
const ChevronLeft   = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>;
const UploadCloud   = () => <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 12v8m-3-3l3-3 3 3"/></svg>;
const CheckCircle   = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const XCircle       = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const FileIcon      = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>;
const DownloadIcon  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>;

const BulkUploadProducts = () => {
  const [file, setFile]               = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType]   = useState("idle");
  const [previewCount, setPreviewCount] = useState(0);
  const [dragOver, setDragOver]       = useState(false);
  const fileInputRef                  = useRef(null);
  const navigate                      = useNavigate();

  const applyFile = (selected) => {
    setFile(selected);
    setStatusMessage("");
    setStatusType("idle");
    setPreviewCount(0);
  };

  const handleFileChange = (e) => applyFile(e.target.files?.[0] || null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && (dropped.name.endsWith('.xlsx') || dropped.name.endsWith('.xls'))) {
      applyFile(dropped);
    } else {
      toast.error('Please drop an Excel file (.xlsx or .xls)');
    }
  };

  const normalizeRowToProduct = (row) => {
    const images = [];
    for (let i = 1; i <= 10; i++) {
      const key = `Image${i}`;
      if (row[key]) images.push(String(row[key]).trim());
    }

    const lensAttributes = [];
    ['Lens Color', 'Lens Base Color', 'Lens Width', 'Lens Treatment'].forEach((field) => {
      if (row[field]) lensAttributes.push({ name: field, value: String(row[field]).trim() });
    });

    const frameAttributes = [];
    ['Frame Color', 'Bridge Size', 'Fit', 'Exact Size', 'Shape', 'Temple Color', 'Frame Material', 'Temple Material', 'Color Code'].forEach((field) => {
      if (row[field]) frameAttributes.push({ name: field, value: String(row[field]).trim() });
    });

    const generalAttributes = [];
    if (row['Gender']) generalAttributes.push({ name: 'Gender', value: String(row['Gender']).trim() });

    const rx = String(row['RX']);
    return {
      modelTitle: String(row['Color Code'] || '').trim(),
      modelName: String(row['Model Name'] || '').trim(),
      modelCode: String(row['Model Number'] || '').trim(),
      brand: String(row['Brand'] || 'Arora Opticals').trim(),
      rx: String(rx.toLowerCase() === 'true' ? true : false),
      isSellable: 'true',
      category: String(row['Category'] || '').trim(),
      gender: String(row['Gender'] || '').trim(),
      description: String(row['Description'] || '').trim(),
      price: Number(row['Price'] || 0),
      taxRate: 18,
      discount: Number(row['Discount'] || 0),
      hashtags: String(row['Advertising Hashtags'] || '').trim(),
      images,
      size: [],
      stock: [],
      lensAttributes,
      frameAttributes,
      generalAttributes,
    };
  };

  const handleUpload = () => {
    if (!file) {
      toast.error('Please select an Excel file first.');
      return;
    }

    setIsUploading(true);
    setStatusMessage('');
    setStatusType('idle');

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        if (!Array.isArray(rows) || rows.length === 0) {
          setStatusType('error');
          setStatusMessage('Invalid Excel format: no rows found.');
          setIsUploading(false);
          return;
        }

        const missingRequired = rows.some((row) =>
          REQUIRED_FIELDS.some((field) => !row[field] || String(row[field]).trim() === '')
        );

        if (missingRequired) {
          setStatusType('error');
          setStatusMessage('One or more required fields are missing. Please use the latest template.');
          setIsUploading(false);
          return;
        }

        const products = rows.map(normalizeRowToProduct);
        setPreviewCount(products.length);

        const response = await axios.post(
          `${baseURL}/api/admin/bulk-add-products`,
          { products },
          { withCredentials: true }
        );

        if (response.data?.success) {
          setStatusType('success');
          setStatusMessage(`Successfully inserted ${response.data.insertedCount} products.`);
          toast.success(`${response.data.insertedCount} products uploaded`);
          setFile(null);
          setPreviewCount(0);
        } else {
          setStatusType('error');
          setStatusMessage(response.data?.message || 'Bulk upload failed. Please try again.');
        }
      } catch {
        setStatusType('error');
        setStatusMessage('Invalid Excel format or server error. Please verify the file and try again.');
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      setStatusType('error');
      setStatusMessage('Failed to read the Excel file.');
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="min-h-screen bg-gray-50/60 p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/Admin/products')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors mb-1"
          >
            <ChevronLeft /> Back to Products
          </button>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bulk Upload</h1>
          <p className="text-sm text-gray-500 mt-0.5">Import multiple products from an Excel file</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">

        {/* Upload panel */}
        <div className="col-span-2 space-y-4">
          {/* Drop zone */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-12 transition-colors ${
                dragOver
                  ? 'border-gray-900 bg-gray-50'
                  : file
                  ? 'border-emerald-400 bg-emerald-50/40'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/60'
              }`}
            >
              {file ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><FileIcon /></div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB — click to change</p>
                  </div>
                  {previewCount > 0 && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                      {previewCount} products parsed
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className="text-gray-400"><UploadCloud /></div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">Drag &amp; drop your Excel file here</p>
                    <p className="text-xs text-gray-400 mt-1">or click to browse · .xlsx / .xls</p>
                  </div>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Status banner */}
            {statusMessage && (
              <div className={`mt-4 flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
                statusType === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {statusType === 'success' ? <CheckCircle /> : <XCircle />}
                {statusMessage}
              </div>
            )}

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading…</>
                ) : 'Upload Products'}
              </button>
              {file && (
                <button
                  onClick={() => { setFile(null); setStatusMessage(''); setStatusType('idle'); setPreviewCount(0); }}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-700">Excel Template</h2>
              <a
                href={new URL('../../../assets/templates/product-template.xlsx', import.meta.url).href}
                download="product-template.xlsx"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <DownloadIcon /> Download
              </a>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Use the official template to ensure all columns are in the correct format.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-3">Required Columns</h2>
            <div className="space-y-2.5 text-xs text-gray-500">
              <div>
                <p className="font-semibold text-gray-700 mb-1">Basic</p>
                <p className="leading-relaxed">Category, Model Name, Model Number, Color Code, Brand, Gender, Price, Discount, Description, Advertising Hashtags</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Lens Attributes</p>
                <p className="leading-relaxed">Lens Color, Lens Base Color, Lens Width, Lens Treatment</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Frame Attributes</p>
                <p className="leading-relaxed">Frame Color, Bridge Size, Fit, Exact Size, Shape, Temple Color, Frame Material, Temple Material</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Images</p>
                <p className="leading-relaxed">Image1 … Image10 (each cell = a Cloudinary URL)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadProducts;
