import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useUpdateUserProfileMutation } from "../../store/slices/authApi";
import { toast } from "react-toastify"; // ✅ use react-toastify, not react-hot-toast

const UpdateProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [updateUserDetails, { isLoading }] = useUpdateUserProfileMutation();

  const [formData, setFormData] = useState({
    name: user?.user?.name || "",
    email: user?.user?.email || "",
    phone: user?.user?.phone || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await updateUserDetails({
        name: formData.name,
        phone: formData.phone,
      }).unwrap(); // ✅ unwrap for clean handling

      toast.success("Profile updated successfully ✅", {
        position: "top-right",
        autoClose: 3000,
      });
      console.log("Update response:", res);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err?.data?.message || "Failed to update profile ❌", {
        position: "top-right",
        autoClose: 3000,
      });
    }
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
          disabled
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
        disabled={isLoading}
        className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

export default UpdateProfile;
