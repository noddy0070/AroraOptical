import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from 'react-toastify';
import { api } from '@/lib/axios';
import {
  Categories, GlassesBrand, Classification, AccessoriesType,
  LensBrand, AccessoriesBrand, SmartGlassesBrand
} from './../../../data/glassesInformationData';
import ImageUpload from "@/components/ImageFunctionality";
import { ArrayInputField, AttributeSection, FormField } from "@/components/ProductFields";

const defaultForm = {
  modelName: '',
  modelTitle: '',
  modelCode: '',
  brand: '',
  isSellable: '',
  category: '',
  gender: '',
  taxRate: '',
  hashtags: '',
  description: '',
  price: 0,
  discount: '',
  size: ['Small (50mm or less)', 'Medium (51 to 54mm)', 'Large (55 mm or more)'],
  stock: [0, 0, 0],
  images: [],
  lensAttributes: [],
  frameAttributes: [],
  generalAttributes: [],
  rx: false,
};

// ── Icon ──────────────────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

// ── Section card ──────────────────────────────────────────────────────────────
const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    {title && (
      <div className="px-5 py-3.5 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-700">{title}</h2>
      </div>
    )}
    <div className="px-5 py-5">{children}</div>
  </div>
);

const AddProduct = () => {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [frameAttributes, setFrameAttributes] = useState([]);
  const [lensAttributes, setLensAttributes] = useState([]);
  const [generalAttributes, setGeneralAttributes] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const handleRemoveAttribute = (attributeName, attributeType) => {
    const formKey = `${attributeType.toLowerCase()}Attributes`;
    setForm((prev) => ({ ...prev, [formKey]: prev[formKey].filter((a) => a.name !== attributeName) }));
  };

  const handleAddAttribute = (attribute, attributeType) => {
    const formKey = `${attributeType.toLowerCase()}Attributes`;
    setForm((prev) => ({ ...prev, [formKey]: [...prev[formKey], { name: attribute.name, value: '' }] }));
  };

  const getUsedAttributes = (attributeType) => {
    const formKey = `${attributeType.toLowerCase()}Attributes`;
    return form[formKey].map((a) => ({ name: a.name, value: a.value }));
  };

  const getAvailableAttributes = (attributeType) => {
    switch (attributeType) {
      case 'Frame':   return frameAttributes;
      case 'Lens':    return lensAttributes;
      case 'General': return generalAttributes;
      default:        return [];
    }
  };

  const updateAttributeArray = (prevArray, attrName, value) => {
    const idx = prevArray.findIndex((a) => a.name === attrName);
    const next = [...prevArray];
    if (idx !== -1) { next[idx].value = value; } else { next.push({ name: attrName, value }); }
    return next;
  };

  const handleChange = (e, index, attrName) => {
    const { name, value } = e.target;

    if (['size', 'stock'].includes(name)) {
      setForm((prev) => {
        const updated = [...prev[name]];
        updated[index] = value;
        return { ...prev, [name]: updated };
      });
      return;
    }

    if (name === 'category' && (value === 'Sunglasses' || value === 'Accessories')) {
      setForm((prev) => ({ ...prev, rx: false }));
    }

    if (['lensAttributes', 'frameAttributes', 'generalAttributes'].includes(name)) {
      setForm((prev) => ({ ...prev, [name]: updateAttributeArray(prev[name], attrName, value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.post('/api/admin/add-product', form);
      if (response.status === 200 || response.status === 201) {
        toast.success('Product added successfully!');
        setForm(defaultForm);
        setUploadedImages([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setForm((prev) => ({ ...prev, images: uploadedImages }));
  }, [uploadedImages]);

  useEffect(() => {
    api.get('/api/admin/get-attributes')
      .then(({ data }) => {
        setFrameAttributes(data.filter((a) => a.attributeType === 'Frame'));
        setLensAttributes(data.filter((a) => a.attributeType === 'Lens'));
        setGeneralAttributes(data.filter((a) => a.attributeType === 'General'));
      })
      .catch(() => toast.error('Failed to load attributes'));
  }, []);

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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add Product</h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-60"
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
          ) : 'Save Product'}
        </button>
      </div>

      {/* Basic Information */}
      <SectionCard title="Basic Information">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category"    name="category"    value={form.category}    onChange={handleChange} options={Categories} />
          <FormField label="Model Name"  name="modelName"   value={form.modelName}   onChange={handleChange} />
          <FormField label="Model Number" name="modelTitle" value={form.modelTitle}  onChange={handleChange} />

          {form.category !== 'Accessories' && (
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Color Code" name="modelCode" value={form.modelCode} onChange={handleChange} />
              <FormField label="Gender"     name="gender"    value={form.gender}    onChange={handleChange} options={Classification} />
            </div>
          )}

          {(form.category === 'Sunglasses' || form.category === 'Eyeglasses') && (
            <FormField label="Brand" name="brand" value={form.brand} onChange={handleChange} options={GlassesBrand} />
          )}
          {form.category === 'Smart Glasses' && (
            <FormField label="Brand" name="brand" value={form.brand} onChange={handleChange} options={SmartGlassesBrand} />
          )}
          {form.category === 'Contact Lenses' && (
            <FormField label="Brand" name="brand" value={form.brand} onChange={handleChange} options={LensBrand} />
          )}
          {form.category === 'Accessories' && (
            <FormField label="Brand" name="brand" value={form.brand} onChange={handleChange} options={AccessoriesBrand} />
          )}

          {(form.category === 'Eyeglasses' || form.category === 'Contact Lenses' || form.category === 'Smart Glasses') && (
            <FormField label="Rx" name="rx" value={form.rx} onChange={handleChange} options={['true', 'false']} />
          )}

          {form.category === 'Accessories' && (
            <FormField label="Accessories Type" name="accessoriesType" value={form.accessoriesType} onChange={handleChange} options={AccessoriesType} />
          )}

          <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} />
          <FormField label="Advertising Hashtags" name="hashtags" value={form.hashtags} onChange={handleChange} />
        </div>
      </SectionCard>

      {/* Pricing */}
      <SectionCard title="Pricing & Catalogue">
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Price (₹)" name="price"      value={form.price}      onChange={handleChange} />
          <FormField label="Discount %" name="discount"  value={form.discount}   onChange={handleChange} />
          <FormField label="Tax Rate %" name="taxRate"   value={form.taxRate}    onChange={handleChange} />
          <FormField label="Sellable"   name="isSellable" value={form.isSellable} onChange={handleChange} options={['true', 'false']} />
        </div>
      </SectionCard>

      {/* Images & Stock */}
      <SectionCard title="Images & Stock">
        <ImageUpload uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} />

        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Size &amp; Stock</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, size: [...prev.size, ''], stock: [...prev.stock, 0] }))}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                + Add Size
              </button>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, size: prev.size.slice(0, -1), stock: prev.stock.slice(0, -1) }))}
                disabled={form.size.length <= 1}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-40"
              >
                − Remove Last
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ArrayInputField label="Size"  name="size"  values={form.size}  handleChange={handleChange} />
            <ArrayInputField label="Stock" name="stock" values={form.stock} handleChange={handleChange} />
          </div>
        </div>
      </SectionCard>

      {/* Frame Attributes */}
      {(form.category === 'Sunglasses' || form.category === 'Eyeglasses' || form.category === 'Smart Glasses') && (
        <SectionCard title="Frame Attributes">
          <AttributeSection
            title=""
            attributes={getUsedAttributes('Frame')}
            formKey="frameAttributes"
            form={form}
            handleChange={handleChange}
            onRemoveAttribute={(name) => handleRemoveAttribute(name, 'Frame')}
            availableAttributes={getAvailableAttributes('Frame')}
            onAddAttribute={(attr) => handleAddAttribute(attr, 'Frame')}
          />
        </SectionCard>
      )}

      {/* Lens Attributes */}
      {(form.category === 'Contact Lenses' || form.category === 'Eyeglasses' || form.category === 'Smart Glasses' || form.category === 'Sunglasses') && (
        <SectionCard title="Lens Attributes">
          <AttributeSection
            title=""
            attributes={getUsedAttributes('Lens')}
            formKey="lensAttributes"
            form={form}
            handleChange={handleChange}
            onRemoveAttribute={(name) => handleRemoveAttribute(name, 'Lens')}
            availableAttributes={getAvailableAttributes('Lens')}
            onAddAttribute={(attr) => handleAddAttribute(attr, 'Lens')}
          />
        </SectionCard>
      )}

      {/* General Attributes */}
      <SectionCard title="General Attributes">
        <AttributeSection
          title=""
          attributes={getUsedAttributes('General')}
          formKey="generalAttributes"
          form={form}
          handleChange={handleChange}
          onRemoveAttribute={(name) => handleRemoveAttribute(name, 'General')}
          availableAttributes={getAvailableAttributes('General')}
          onAddAttribute={(attr) => handleAddAttribute(attr, 'General')}
        />
      </SectionCard>

      {/* Footer save button */}
      <div className="flex justify-end pb-6">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-60"
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
          ) : 'Save Product'}
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
