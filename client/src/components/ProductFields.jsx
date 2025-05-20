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

export const AttributeSection = ({ title, attributes, formKey, form, handleChange }) => {
  const getAttributeValue = (name) =>
    form[formKey]?.find((attr) => attr.name === name)?.value || "";

  if (!attributes.length) return null;

  return (
    <>
      <h6 className="text-h5Text font-bold mb-[.5vw]">{title}</h6>
      <div className="grid grid-cols-2 gap-[1vw] mb-[1.5vw] font-roboto">
        {attributes.map((attribute, index) => (
          <div key={index} className="gap-[1vw] items-center">
            <label className="text-mediumText font-bold">{attribute.name}</label>
            {attribute.attributeValueType === "Single" ? (
              <input name={formKey} type="text" placeholder="Value" value={getAttributeValue(attribute.name)}
                onChange={(e) => handleChange(e, index, attribute.name)}
                className="w-full mt-[.5vw] py-[.75vw] px-[1vw] bg-adminInputBoxColor text-regularText rounded-[.45vw] border"/>
            ) : (
              <select name={formKey} value={getAttributeValue(attribute.name)}
                onChange={(e) => handleChange(e, index, attribute.name)} style={{ maxHeight: "12.5vw" }}
                className="w-full mt-[.5vw] py-[.75vw] px-[1vw] bg-adminInputBoxColor text-regularText rounded-[.45vw] border max-h-[12.5vw] overflow-y-auto">
                <option value="">Select {attribute.name}</option>
                {attribute.attributeValues.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            )}
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

