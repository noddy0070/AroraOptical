import React from 'react';

export const FormField = ({ label, name, type = "text", value, onChange, placeholder = "Value", options , disable=false }) => (
  <div>
    <label className="text-mediumText font-bold">{label}</label>
    {options ? (
      <select name={name} value={value} onChange={onChange}
        className="w-full mt-[.5vw] py-[.75vw] px-[1vw] bg-adminInputBoxColor text-regularText rounded-[.45vw] border" >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    ) : type === "textarea" ? (
      <textarea name={name} placeholder={placeholder} value={value} onChange={onChange}
        className="w-full mt-[.5vw] py-[.75vw] px-[1vw] bg-adminInputBoxColor text-regularText rounded-[.45vw] border"/>
    ) : (
      <input disabled={disable} type={type} name={name} placeholder={placeholder} value={value} onChange={onChange}
        className="w-full mt-[.5vw] py-[.75vw] px-[1vw] bg-adminInputBoxColor text-regularText rounded-[.45vw] border"/>
    )}
  </div>
);

export const AttributeSection = ({ title, attributes, formKey, form, handleChange, onRemoveAttribute, availableAttributes, onAddAttribute }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [showCustomForm, setShowCustomForm] = React.useState(false);
  const [customAttribute, setCustomAttribute] = React.useState({ name: '', value: '' });

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.attribute-dropdown-container')) {
        setIsDropdownOpen(false);
        setShowCustomForm(false);
        setCustomAttribute({ name: '', value: '' });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const getAttributeValue = (name) =>
    form[formKey]?.find((attr) => attr.name === name)?.value || "";

  const isAttributeAdded = (attrName) => {
    return form[formKey]?.some(attr => attr.name === attrName);
  };

  const handleCustomAttributeSubmit = (e) => {
    e.preventDefault();
    if (customAttribute.name.trim()) {
      onAddAttribute({ 
        name: customAttribute.name.trim(),
        attributeType: title.split(' ')[0], // 'Frame', 'Lens', or 'General'
        attributeValueType: 'Single'
      });
      setCustomAttribute({ name: '', value: '' });
      setShowCustomForm(false);
      setIsDropdownOpen(false);
    }
  };

  if (!attributes?.length && !availableAttributes?.length) return null;

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-[.5vw]">
        <h6 className="text-h5Text font-bold">{title}</h6>
        {availableAttributes?.length > 0 && (
          <div className="relative attribute-dropdown-container">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
                if (!isDropdownOpen) {
                  setShowCustomForm(false);
                  setCustomAttribute({ name: '', value: '' });
                }
              }}
              className="text-blue-600 hover:text-blue-700 text-regularText flex items-center gap-[.5vw]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2vw" height="1.2vw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Attribute
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg z-10 min-w-[12vw]">
                {availableAttributes.map((attr) => !isAttributeAdded(attr.name) && (
                  <button
                    key={attr.name}
                    onClick={() => {
                      onAddAttribute(attr);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-regularText"
                  >
                    {attr.name}
                  </button>
                ))}
                
                {/* Divider */}
                <div className="border-t border-gray-200 my-2"></div>
                
                {/* Custom Attribute Option */}
                {!showCustomForm ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCustomForm(true);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-regularText text-blue-600"
                  >
                    + Add Custom Attribute
                  </button>
                ) : (
                  <form onSubmit={handleCustomAttributeSubmit} className="p-4 bg-gray-50" onClick={e => e.stopPropagation()}>
                    <input
                      type="text"
                      value={customAttribute.name}
                      onChange={(e) => setCustomAttribute(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Attribute Name"
                      className="w-full mb-2 p-2 border rounded"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCustomForm(false)}
                        className="flex-1 bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-[1vw] mb-[1.5vw] font-roboto">
        {attributes.map((attribute, index) => (
          <div key={index} className="relative">
            <FormField
              label={attribute.name}
              name={formKey}
              value={getAttributeValue(attribute.name)}
              onChange={(e) => handleChange(e, index, attribute.name)}
              options={attribute.attributeValues}
            />
            <button
              onClick={() => onRemoveAttribute(attribute.name)}
              className="absolute top-0 right-0 text-red-500 hover:text-red-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2vw" height="1.2vw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export const ArrayInputField = ({ label, name, values=[], handleChange }) => (
  <div className="col-span-1">
    <label className="text-mediumText font-bold">{label}</label>
    {values.map((value, index) => (
      <input key={index} type="text" name={name} value={value || ''} onChange={(e) => handleChange(e, index)}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full mt-[.5vw] py-[.75vw] px-[1vw] bg-adminInputBoxColor text-regularText rounded-[.45vw] border"/>
    ))}
  </div>
);


export const ArrayInputFieldPolicies = ({ label, name, values=[], handleChange }) => (
  <div className="col-span-1">
    {values.map((value, index) => (
      <>
    <label className="text-mediumText font-bold">{label } {index+1}</label>

      <textarea key={index} type="text" name={name} value={value || ''} onChange={(e) => handleChange(e, index)}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full mt-[.5vw] py-[.75vw] px-[1vw] bg-adminInputBoxColor text-regularText rounded-[.45vw] border"/>
      </>
    ))}
  </div>
);

