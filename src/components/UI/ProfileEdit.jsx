import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUserProfileMutation } from "../../store/slices/authApi";
import { toast } from "react-toastify";
import axios from "axios";
import { updateUser } from "../../store/slices/authSlice";

const UpdateProfile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [updateUserDetails, { isLoading }] = useUpdateUserProfileMutation();
  const dispatch = useDispatch();
  // ✅ Keep API profile response in state
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const ltoken = localStorage.getItem("token");
        console.log("The localstorage token is ", ltoken);

        const res = await axios.get("http://localhost:3000/api/user/profile", {
          headers: { "x-auth-token": ltoken },
        });

        console.log("Profile response ", res.data);
        setProfile(res.data.user); 
        dispatch(updateUser(res.data.user))

      } catch (err) {
        console.log("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Sync profile → formData
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      });
    }
  }, [profile]);

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
      }).unwrap();

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

  // ✅ Avoid rendering until profile is fetched
  if (!profile) {
    return <p>Loading profile...</p>;
  }

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
