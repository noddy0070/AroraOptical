import { useState, useEffect } from "react";
import axios from "axios";
import { State, City } from "country-state-city";
import { baseURL } from "@/url";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const COUNTRY = "IN";

const ROLE_OPTIONS = [
  { value: "user",            label: "Customer" },
  { value: "product-manager", label: "Product Manager" },
  { value: "super-admin",     label: "Super Admin" },
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

// ── Validation ────────────────────────────────────────────────────────────────
const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE   = /^[6-9]\d{9}$/;

const validate = (form) => {
  const errors = {};

  if (!form.name.trim())
    errors.name = "Name is required.";
  else if (form.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters.";

  if (!form.email.trim())
    errors.email = "Email is required.";
  else if (!EMAIL_RE.test(form.email.trim()))
    errors.email = "Enter a valid email address.";

  if (!form.role)
    errors.role = "Please select a role.";

  if (!form.password)
    errors.password = "Password is required.";
  else if (form.password.length < 8)
    errors.password = "Password must be at least 8 characters.";

  if (form.number && !PHONE_RE.test(form.number))
    errors.number = "Enter a valid 10-digit Indian mobile number.";

  if (form.zipcode && !/^\d{6}$/.test(form.zipcode))
    errors.zipcode = "Pincode must be exactly 6 digits.";

  return errors;
};

// ── Sub-components ────────────────────────────────────────────────────────────
const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-700">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
  </div>
);

const Input = ({ error, ...props }) => (
  <input
    {...props}
    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors ${
      error
        ? 'border-red-300 focus:ring-red-200 bg-red-50/30'
        : 'border-gray-200 focus:ring-gray-900 bg-white'
    }`}
  />
);

const Select = ({ error, children, ...props }) => (
  <select
    {...props}
    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors bg-white ${
      error
        ? 'border-red-300 focus:ring-red-200'
        : 'border-gray-200 focus:ring-gray-900'
    }`}
  >
    {children}
  </select>
);

// ── Main Component ────────────────────────────────────────────────────────────
const AddUser = () => {
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', number: '', role: '', gender: '', password: '', address: '', zipcode: '', state: '', city: '' });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [states, setStates]         = useState([]);
  const [cities, setCities]         = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity]   = useState('');

  useEffect(() => { setStates(State.getStatesOfCountry(COUNTRY)); }, []);

  useEffect(() => {
    if (selectedState) {
      setCities(City.getCitiesOfState(COUNTRY, selectedState));
      setSelectedCity('');
      setForm((f) => ({ ...f, city: '' }));
    }
  }, [selectedState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (touched[name]) {
      // Re-validate just this field on change after first blur
      const newErrors = validate({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    const newErrors = validate(form);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setForm((f) => ({ ...f, state: e.target.value }));
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setForm((f) => ({ ...f, city: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mark all fields touched
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]));
    setTouched(allTouched);

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await axios.post(`${baseURL}/api/admin/add-user`, form, { withCredentials: true });
      toast.success('User created successfully!');
      navigate('/Admin/user');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to create user.';
      if (typeof msg === 'string' && msg.toLowerCase().includes('duplicate') || msg.toLowerCase?.()?.includes('email')) {
        setErrors((prev) => ({ ...prev, email: 'An account with this email already exists.' }));
      } else {
        toast.error(typeof msg === 'string' ? msg : 'An error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add User</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create a new customer or staff account</p>
        </div>
        <button
          onClick={() => navigate('/Admin/user')}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
        >
          ← Back to Users
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">

          {/* Section: Basic Info */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" required error={errors.name}>
                <Input name="name" value={form.name} placeholder="e.g. Rahul Sharma" onChange={handleChange} onBlur={handleBlur} error={errors.name} />
              </Field>
              <Field label="Email Address" required error={errors.email}>
                <Input name="email" type="email" value={form.email} placeholder="email@example.com" onChange={handleChange} onBlur={handleBlur} error={errors.email} />
              </Field>
              <Field label="Phone Number" error={errors.number}>
                <Input name="number" value={form.number} placeholder="10-digit mobile number" maxLength={10} onChange={handleChange} onBlur={handleBlur} error={errors.number} />
              </Field>
              <Field label="Gender">
                <Select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </Select>
              </Field>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Section: Account */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Account Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Role" required error={errors.role}>
                <Select name="role" value={form.role} onChange={handleChange} onBlur={handleBlur} error={errors.role}>
                  <option value="">Select role</option>
                  {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </Select>
              </Field>
              <Field label="Password" required error={errors.password}>
                <Input name="password" type="password" value={form.password} placeholder="Min. 8 characters" onChange={handleChange} onBlur={handleBlur} error={errors.password} />
              </Field>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Section: Address (optional) */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Address <span className="normal-case font-normal text-gray-300">(optional)</span></h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="Street / Flat / Area">
                  <Input name="address" value={form.address} placeholder="Flat no., building, street…" onChange={handleChange} />
                </Field>
              </div>
              <Field label="State">
                <Select name="state" value={selectedState} onChange={handleStateChange}>
                  <option value="">Select state</option>
                  {states.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                </Select>
              </Field>
              <Field label="City">
                <Select name="city" value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
                  <option value="">Select city</option>
                  {cities.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                </Select>
              </Field>
              <Field label="Pincode" error={errors.zipcode}>
                <Input name="zipcode" value={form.zipcode} placeholder="6-digit pincode" maxLength={6} onChange={handleChange} onBlur={handleBlur} error={errors.zipcode} />
              </Field>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {submitting
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating…</>
                : 'Create User'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
