import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileData, updateProfilePicture } from "../../services/updatingProfile";
import { useNavigate } from "react-router-dom";
import GenderDropdown from "../common/DropDown";

const Setting = () => {
  const [newImage, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    contactNumber: "",
    dateofBirth: "",
    about: "",
  });

  // Prefill form with existing user data once available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        gender: user.gender || "",
        contactNumber: user.contactNumber || "",
        dateofBirth: user.dateofBirth || "",
        about: user.about || "",
      });
    }
  }, [user]);

  const changeFromHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  function changeHandler(event) {
    const image = event.target.files[0];
    if (!image) return;
    setImage(image);
    setPreviewUrl(URL.createObjectURL(image));
  }

  function handleImageSubmit(e) {
    e.preventDefault();
    if (!newImage) return;
    const formdata = new FormData();
    formdata.append("image", newImage);
    dispatch(updateProfilePicture(formdata, token));
  }

  function handleFormDataSubmit(event) {
    event.preventDefault();
    dispatch(updateProfileData(formData, token, navigate));
  }

  function handleCancel() {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        gender: user.gender || "",
        contactNumber: user.contactNumber || "",
        dateofBirth: user.dateofBirth || "",
        about: user.about || "",
      });
    }
    navigate('/dashboard/my-profile');
  }

  const inputClasses =
    "w-full bg-[#161616] text-white border border-[#2a2a2a] rounded-lg px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-colors";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Edit Profile</h1>

        {/* Profile Picture */}
        <form
          onSubmit={handleImageSubmit}
          className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-gray-200">Profile Picture</h2>
          <div className="flex items-center gap-5">
            <img
              src={previewUrl || user?.image}
              alt="user profile"
              className="object-cover h-16 w-16 rounded-full border-2 border-[#7C3AED]"
            />
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={changeHandler}
                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#7C3AED] file:text-white file:font-medium hover:file:bg-[#6b2fd6] file:cursor-pointer cursor-pointer"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!newImage}
            className="px-5 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6b2fd6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Upload Image
          </button>
        </form>

        {/* Profile Info */}
        <form
          onSubmit={handleFormDataSubmit}
          className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 space-y-5"
        >
          <h2 className="text-lg font-semibold text-gray-200">Profile Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={changeFromHandler}
              className={inputClasses}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={changeFromHandler}
              className={inputClasses}
            />
          </div>

          <input
            type="date"
            name="dateofBirth"
            value={formData.dateofBirth}
            onChange={changeFromHandler}
            className={inputClasses}
          />

          <input
            type="text"
            name="contactNumber"
            placeholder="Phone number"
            value={formData.contactNumber}
            onChange={changeFromHandler}
            className={inputClasses}
          />

          <textarea
            name="about"
            placeholder="About you"
            value={formData.about}
            onChange={changeFromHandler}
            rows={3}
            className={inputClasses + " resize-none"}
          />
          <GenderDropdown value={formData.gender} onChange={changeFromHandler} options={["Male", "Female", "Non-binary", "Prefer not to say"]}/>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6b2fd6] transition-colors font-medium"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-lg border border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a] transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Setting;