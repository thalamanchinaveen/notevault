import React from 'react';

const InputField = ({ type, id, name, onChange, onBlur, value, touched, errors, placeholder }) => (
  <div className="mb-4">
    <input
      type={type}
      id={id}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      className={`w-full px-4 py-2 border-b-2 focus:outline-none ${
        touched && errors ? 'border-red-500' : 'border-teal-500'
      }`}
      placeholder={placeholder}
    />
    {touched && errors && <div className="text-red-500 text-sm">{errors}</div>}
  </div>
);

export default InputField;


{/* <InputField
type="text"
id="username"
name="username"
onChange={formik.handleChange}
onBlur={formik.handleBlur}
value={formik.values.username}
touched={formik.touched.username}
errors={formik.errors.username}
placeholder="Username"
/>  */}