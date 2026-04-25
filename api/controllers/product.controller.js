import Product from "../models/product.model.js";
import mongoose from "mongoose";
import * as XLSX from "xlsx";

export const addProduct = async (req, res, next) => {
  const {
    modelName,
    modelTitle,
    modelCode,
    brand,
    isSellable,
    category,
    gender,
    description,
    price,
    taxRate,
    discount,
    hashtags,
    images,
    size,
    stock,
    lensAttributes,
    frameAttributes,
    generalAttributes,
    rx,
  } = req.body;
  const newProduct = new Product({
    modelName,
    modelTitle,
    modelCode,
    brand,
    isSellable,
    category,
    gender,
    description,
    price,
    taxRate,
    discount,
    hashtags,
    images,
    size,
    stock,
    lensAttributes,
    frameAttributes,
    generalAttributes,
    rx,
  });

  try {
    await newProduct.save();
    res.status(201).json("Product created successfully");
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { category, gender, brand, newArrivals, bestsellers, accessories, limit } = req.query;
    let query = {};
    // Add filters if they exist
    if (category) {
      if(category==='accessories'){
        query.category = 'Accessories';
      } else if(category==='glasses'){
        query.category = { $in: ['Sunglasses', 'Eyeglasses'] };
      }
      else{
        query.category = category[0].toUpperCase() + category.slice(1);
      }
    }
    if (gender) {
      // Map the URL parameter to the actual gender value
      const genderMap = {
        'women': 'Women',
        'men': 'Men',
        'kids': 'Kids'
      };
      
      // Include both specific gender and Unisex products for all gender selections
      query.gender = { $in: [genderMap[gender.toLowerCase()], 'Unisex'] };
    }

    // Optional brand filter
    if (brand) {
      query.brand = brand;
    }

    // Check if new arrivals filter is requested
    if (newArrivals === 'true') {
      // Case-insensitive regex pattern for various "new arrival" hashtag formats
      query.hashtags = {
        $regex: /new\s*arrival|new\s*arrivals/i
      };
    }
    
    let products;
    const parsedLimit =
      typeof limit === "string" && limit.trim().length > 0 ? Number.parseInt(limit, 10) : undefined;
    const safeLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined;

    if (bestsellers === 'true') {
      // Get products sorted by orders (highest to lowest) and limit to top sellers
      products = await Product.find(query).sort({ orders: -1 }).limit(safeLimit ?? 20);
    } else {
      const q = Product.find(query);
      if (safeLimit) q.limit(safeLimit);
      products = await q;
    }
    
    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
};

export const getAccessories = async (req, res, next) => {
  try {
    const products = await Product.find({ category: 'Accessories' });
    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
};

export const getProductsColor = async (req, res, next) => {

  const {modelName}=req.body;
  try {
    const products= await Product.find({modelName});
    res.status(200).json({
      success:true,message:products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};


export const getSingleProduct = async (req, res, next) => {
  const { attributeId } = req.params;  
  if (!mongoose.Types.ObjectId.isValid(attributeId)) { 
    return res.status(400).json({ message: "Invalid product ID" });
  }
  try {
    const product = await Product.findById(attributeId );
    res.status(200).json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server error fetching product' });
  }
};


export const updateProduct=async (req,res)=>{
    if(req.body._id!==req.params.id){
        console.log("error");
        return;
    }
    const {modelName,modelTitle,modelCode,brand,isSellable,category,gender,description,price,taxRate,discount,hashtags,images,size,stock,lensAttributes,frameAttributes,generalAttributes,rx}=req.body;
    try{

        const updatedProduct=await Product.findByIdAndUpdate(req.params.id,
            {$set:{
               modelName,modelTitle,modelCode,brand,isSellable,category,gender,description,price,taxRate,discount,hashtags,images,size,stock,lensAttributes,frameAttributes,generalAttributes,rx
            }},{new:true}
        )
        res.status(200).json({success:true,message:updatedProduct});
    }catch(error){
        console.log(error.message);
    }
}

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const testProducts = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const sampleProducts = await Product.find().limit(5);
    
    res.status(200).json({
      success: true,
      totalProducts,
      sampleProducts: sampleProducts.map(p => ({
        id: p._id,
        modelTitle: p.modelTitle,
        modelName: p.modelName,
        brand: p.brand,
        isSellable: p.isSellable,
        category: p.category
      }))
    });
  } catch (error) {
    console.error('Test products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching test products',
      error: error.message
    });
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;
    
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required' 
      });
    }

    const searchTerm = q.trim();
    
    // First, let's check if there are any products at all
    const totalProducts = await Product.countDocuments();
    
    // Get a sample product to check the structure
    const sampleProduct = await Product.findOne();
    
    // Create search query for multiple fields
    const searchQuery = {
      $or: [
        // Text search in basic fields
        { modelTitle: { $regex: searchTerm, $options: 'i' } },
        { modelName: { $regex: searchTerm, $options: 'i' } },
        { modelCode: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { hashtags: { $regex: searchTerm, $options: 'i' } },
        
        // Search in frame attributes
        { 
          frameAttributes: { 
            $elemMatch: { 
              $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { value: { $regex: searchTerm, $options: 'i' } }
              ]
            } 
          } 
        },
        
        // Search in lens attributes
        { 
          lensAttributes: { 
            $elemMatch: { 
              $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { value: { $regex: searchTerm, $options: 'i' } }
              ]
            } 
          } 
        },
        
        // Search in general attributes
        { 
          generalAttributes: { 
            $elemMatch: { 
              $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { value: { $regex: searchTerm, $options: 'i' } }
              ]
            } 
          } 
        }
      ]
    };

    // Try search without isSellable filter first
    let products = await Product.find(searchQuery)
      .limit(parseInt(limit))
      .sort({ orders: -1, createdAt: -1 });


    // If no results, try with isSellable filter
    if (products.length === 0) {
      searchQuery.isSellable = { $in: ['true', 'True', 'TRUE', true] };
      products = await Product.find(searchQuery)
        .limit(parseInt(limit))
        .sort({ orders: -1, createdAt: -1 });
    }

    // If still no results, try without any filters
    if (products.length === 0) {
      const simpleQuery = {
        $or: [
          { modelTitle: { $regex: searchTerm, $options: 'i' } },
          { modelName: { $regex: searchTerm, $options: 'i' } },
          { brand: { $regex: searchTerm, $options: 'i' } }
        ]
      };
      products = await Product.find(simpleQuery)
        .limit(parseInt(limit))
        .sort({ orders: -1, createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      products,
      total: products.length,
      searchTerm,
      debug: {
        totalProductsInDB: totalProducts,
        searchQuery: searchQuery
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during search',
      error: error.message
    });
  }
};

export const bulkAddProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload: products array is required",
      });
    }

    const requiredFields = [
      "category",
      "modelName",
      "modelCode",
      "gender",
      "price",
    ];

    const invalidIndex = products.findIndex((product) =>
      requiredFields.some((field) => {
        const value = product[field];
        return (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "")
        );
      })
    );

    if (invalidIndex !== -1) {
      return res.status(400).json({
        success: false,
        message: "Invalid Excel format: missing required fields",
        index: invalidIndex,
      });
    }

    const productsToInsert = products.map((p) => ({
      modelTitle: p.modelTitle,
      modelName: p.modelName,
      modelCode: p.modelCode,
      brand: p.brand || "Arora Opticals",
      isSellable: p.isSellable ?? "true",
      category: p.category,
      gender: p.gender,
      description: p.description || "",
      price: p.price,
      taxRate: p.taxRate ?? 18,
      discount: p.discount ?? 0,
      hashtags: p.hashtags || "",
      images: Array.isArray(p.images) ? p.images : [],
      size: Array.isArray(p.size) ? p.size : [],
      stock: Array.isArray(p.stock) ? p.stock : [],
      lensAttributes: Array.isArray(p.lensAttributes)
        ? p.lensAttributes
        : [],
      frameAttributes: Array.isArray(p.frameAttributes)
        ? p.frameAttributes
        : [],
      generalAttributes: Array.isArray(p.generalAttributes)
        ? p.generalAttributes
        : [],
      rx: p.rx,
    }));

    const inserted = await Product.insertMany(productsToInsert);

    return res.status(201).json({
      success: true,
      insertedCount: inserted.length,
    });
  } catch (error) {
    console.error("bulkAddProducts error:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid Excel format",
    });
  }
};

// export const getProductTemplate = async (req, res) => {
//   try {
//     const headers = [
//       "Category",
//       "Model Name",
//       "Model Number",
//       "Color Code",
//       "Brand",
//       "RX",
//       "Gender",
//       "Description",
//       "Price",
//       "Discount",
//       "Advertising Hashtags",
//       "Lens Color",
//       "Lens Base Color",
//       "Lens Width",
//       "Lens Treatment",
//       "Frame Color",
//       "Bridge Size",
//       "Fit",
//       "Exact Size",
//       "Shape",
//       "Temple Color",
//       "Frame Material",
//       "Temple Material",
//       "Image1",
//       "Image2",
//       "Image3",
//       "Image4",
//       "Image5",
//       "Image6",
//       "Image7",
//       "Image8",
//       "Image9",
//       "Image10",
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet([headers]);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

//     const buffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "buffer",
//     });

//     res.setHeader(
//       "Content-Disposition",
//       'attachment; filename="product-template.xlsx"'
//     );
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     return res.status(200).send(buffer);
//   } catch (error) {
//     console.error("getProductTemplate error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to generate Excel template",
//     });
//   }
// };