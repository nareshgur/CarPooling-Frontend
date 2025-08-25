import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useUpdateUserProfileMutation } from '../../store/slices/authApi';

const UpdateProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [updateUserDetails] = useUpdateUserProfileMutation();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '', // but disabled
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserDetails({
      name: formData.name,
      phone: formData.phone,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label>Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border px-2 py-1 w-full rounded"
        />
      </div>

      <div>
        <label>Email</label>
        <input
          name="email"
          value={formData.email}
          disabled // ✅ make email non-editable
          className="border px-2 py-1 w-full rounded bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div>
        <label>Phone</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="border px-2 py-1 w-full rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Update
      </button>
    </form>
  );
};

export default UpdateProfile;
