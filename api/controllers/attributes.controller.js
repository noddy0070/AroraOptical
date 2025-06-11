import Attributes from "../models/attributes.model.js";
export const addAttributes= async (req,res,next)=>{
    const {name,attributeType,attributeValueType}=req.body;
    const newAttribute= new Attributes({name,attributeType,attributeValueType});
    const existingProduct = await Attributes.findOne({ name });
    if (existingProduct) {
        return res.status(400).json({ message: 'Product already exists' });
    }
    try{
        await newAttribute.save();
        res.status(201).json('Attribute created successfully');
    }catch(error){
        console.log(error);
        next(error);
    }
}

export const getAttributes = async (req, res, next) => {
  
  
    try {
      const attributes = await Attributes.find();
  
      res.status(200).json(attributes);
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ message: 'Server error fetching products' });
    }
  };

export const deleteAttribute = async (req, res, next) => {
    const { attributeId } = req.params;
    try {
      const deletedAttribute = await Attributes.findByIdAndDelete(attributeId);
    
      if (!deletedAttribute) {
        return res.status(404).json({ message: 'Attribute not found' });
      }
  
      res.status(200).json({ message: 'Attribute deleted successfully' });
    } catch (err) {
      console.error('Error deleting attribute:', err);
      res.status(500).json({ message: 'Server error deleting attribute' });
    }
  }


  export const editAttribute = async (req, res, next) => {
    const {_id, name,attributeType,attributeValueType,attributeValues} = req.body; // whatever fields you allow to update
    try {
        const updatedAttribute = await Attributes.findOneAndUpdate(
            { _id }, // find by name
            {
                name: name,
                attributeType: attributeType,
                attributeValueType: attributeValueType,
                attributeValues: attributeValues
            },
            { new: true }
        );

        if (!updatedAttribute) {
            return res.status(404).json({ message: 'Attribute not found' });
        }

        res.status(200).json({ message: 'Attribute updated successfully', updatedAttribute });
    } catch (error) {
        console.error('Error editing attribute:', error);
        res.status(500).json({ message: 'Server error editing attribute' });
    }
};
