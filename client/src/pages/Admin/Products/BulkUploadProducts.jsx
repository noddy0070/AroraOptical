import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { baseURL } from "@/url";
import { TitleButton } from "@/components/button";
import { useNavigate } from "react-router-dom";

const REQUIRED_FIELDS = [
  "Category",
  "Model Name",
  "Model Number",
  "Color Code",
  "Brand",
  "Gender",
  "Price",
];

const BulkUploadProducts = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("idle");
  const [previewCount, setPreviewCount] = useState(0);

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setStatusMessage("");
    setStatusType("idle");
    setPreviewCount(0);
  };

  const normalizeRowToProduct = (row) => {
    const images = [];
    for (let i = 1; i <= 10; i += 1) {
      const key = `Image${i}`;
      if (row[key]) {
        images.push(String(row[key]).trim());
      }
    }

    const lensAttributes = [];
    if (row["Lens Color"]) {
      lensAttributes.push({
        name: "Lens Color",
        value: String(row["Lens Color"]).trim(),
      });
    }
    if (row["Lens Base Color"]) {
      lensAttributes.push({
        name: "Lens Base Color",
        value: String(row["Lens Base Color"]).trim(),
      });
    }
    if (row["Lens Width"]) {
      lensAttributes.push({
        name: "Lens Width",
        value: String(row["Lens Width"]).trim(),
      });
    }
    if (row["Lens Treatment"]) {
      lensAttributes.push({
        name: "Lens Treatment",
        value: String(row["Lens Treatment"]).trim(),
      });
    }

    const frameAttributes = [];
    if (row["Frame Color"]) {
      frameAttributes.push({
        name: "Frame Color",
        value: String(row["Frame Color"]).trim(),
      });
    }
    if (row["Bridge Size"]) {
      frameAttributes.push({
        name: "Bridge Size",
        value: String(row["Bridge Size"]).trim(),
      });
    }
    if (row["Fit"]) {
      frameAttributes.push({
        name: "Fit",
        value: String(row["Fit"]).trim(),
      });
    }
    if (row["Exact Size"]) {
      frameAttributes.push({
        name: "Exact Size",
        value: String(row["Exact Size"]).trim(),
      });
    }
    if (row["Shape"]) {
      frameAttributes.push({
        name: "Shape",
        value: String(row["Shape"]).trim(),
      });
    }
    if (row["Temple Color"]) {
      frameAttributes.push({
        name: "Temple Color",
        value: String(row["Temple Color"]).trim(),
      });
    }
    if (row["Frame Material"]) {
      frameAttributes.push({
        name: "Frame Material",
        value: String(row["Frame Material"]).trim(),
      });
    }
    if (row["Temple Material"]) {
      frameAttributes.push({
        name: "Temple Material",
        value: String(row["Temple Material"]).trim(),
      });
    }
    if (row["Color Code"]) {
      frameAttributes.push({
        name: "Color Code",
        value: String(row["Color Code"]).trim(),
      });
    }

    const generalAttributes = [];
    if (row["Gender"]) {
      generalAttributes.push({
        name: "Gender",
        value: String(row["Gender"]).trim(),
      });
    }
    let rx=String(row["RX"])
    return {
      modelTitle: String(row["Model Number"] || "").trim(),
      modelName: String(row["Model Name"] || "").trim(),
      modelCode: String(row["Color Code"] || "").trim(),
      brand: String(row["Brand"] || "Arora Opticals").trim(),
      rx:String(rx.toLowerCase()=='true'?true:false),
      isSellable: "true",
      category: String(row["Category"] || "").trim(),
      gender: String(row["Gender"] || "").trim(),
      description: String(row["Description"] || "").trim(),
      price: Number(row["Price"] || 0),
      taxRate: 18,
      discount: Number(row["Discount"] || 0),
      hashtags: String(row["Advertising Hashtags"] || "").trim(),
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
      setStatusType("error");
      setStatusMessage("Please select an Excel file first.");
      return;
    }

    setIsUploading(true);
    setStatusMessage("");
    setStatusType("idle");

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        if (!Array.isArray(rows) || rows.length === 0) {
          setStatusType("error");
          setStatusMessage("Invalid Excel format: no rows found.");
          setIsUploading(false);
          return;
        }

        const missingRequired = rows.some((row) =>
          REQUIRED_FIELDS.some(
            (field) =>
              row[field] === undefined ||
              row[field] === null ||
              String(row[field]).trim() === ""
          )
        );

        if (missingRequired) {
          setStatusType("error");
          setStatusMessage(
            "Invalid Excel format: one or more required fields are missing. Please use the latest template."
          );
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
          setStatusType("success");
          setStatusMessage(
            `Successfully inserted ${response.data.insertedCount} products.`
          );
        } else {
          setStatusType("error");
          setStatusMessage(
            response.data?.message || "Bulk upload failed. Please try again."
          );
        }
      } catch (error) {
        console.error("Bulk upload error:", error);
        setStatusType("error");
        setStatusMessage(
          "Invalid Excel format or server error. Please verify the file and try again."
        );
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      setStatusType("error");
      setStatusMessage("Failed to read the Excel file.");
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="w-full px-[2.25vw] py-[2.25vw] flex flex-col gap-8 font-roboto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Bulk Upload Products
        </h1>
        <div className="flex gap-3">
          <TitleButton
            btnHeight={3.5}
            btnRadius={3}
            btnWidth={14}
            btnTitle="Back to Products"
            onClick={() => navigate("/Admin/products")}
          />
        </div>
      </div>

      <div className="shadow-adminShadow w-full bg-white rounded-lg p-8 flex flex-col gap-6">
        <p className="text-gray-700 text-sm leading-relaxed">
          Upload an Excel file to create multiple products at once. Make sure
          the columns match the official template, including category, basic
          fields, lens attributes, frame attributes and image URLs.
        </p>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-800">
            Excel File (.xlsx, .xls)
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
          />
          {file && (
            <p className="text-xs text-gray-500">
              Selected file: <span className="font-semibold">{file.name}</span>
            </p>
          )}
        </div>

        {previewCount > 0 && (
          <p className="text-xs text-gray-600">
            Parsed products ready for upload:{" "}
            <span className="font-semibold">{previewCount}</span>
          </p>
        )}

        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="px-6 py-2 rounded-md bg-black text-white text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : "Upload Products"}
          </button>
        </div>

        {statusMessage && (
          <div
            className={`mt-4 text-sm rounded-md px-4 py-2 ${
              statusType === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {statusMessage}
          </div>
        )}

        <div className="mt-4 border-t pt-4 text-xs text-gray-500 space-y-1">
          <p className="font-semibold text-gray-700">
            Required columns in Excel:
          </p>
          <p>
            <span className="font-medium">Basic:</span> Category, Model Name,
            Model Number, Color Code, Gender, Description, Price, Discount,
            Advertising Hashtags
          </p>
          <p>
            <span className="font-medium">Lens:</span> Lens Color, Lens Base
            Color, Lens Width, Lens Treatment
          </p>
          <p>
            <span className="font-medium">Frame:</span> Frame Color, Bridge
            Size, Fit, Exact Size, Shape, Temple Color, Frame Material, Temple
            Material
          </p>
          <p>
            <span className="font-medium">Images:</span> Image1 ... Image10
            (each cell should contain an image URL)
          </p>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadProducts;

