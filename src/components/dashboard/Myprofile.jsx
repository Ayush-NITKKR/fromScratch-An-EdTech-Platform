import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineCake,
} from "react-icons/hi";

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const details = user?.additionalDetails || {};
  const phone = details?.contact;
  const gender = details?.gender;
  const about = details?.about;

  const dob = details?.dateofBirth
    ? new Date(details.dateofBirth).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto flex w-11/12 max-w-4xl flex-col gap-6 py-10 text-white">
      {/* Page heading */}
      <h1 className="text-3xl font-bold">
        My{" "}
        <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          Profile
        </span>
      </h1>

      {/* Main profile card */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-800/40 bg-[#0d1117] p-8">
        <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user?.image}
                alt={user?.firstName}
                className="h-20 w-20 rounded-full border-2 border-purple-500/60 object-cover sm:h-24 sm:w-24"
              />
              <span className="absolute bottom-0 right-0 rounded-full border-2 border-[#0d1117] bg-emerald-400 p-1.5" />
            </div>

            <div>
              <p className="text-xl font-semibold">
                {user?.firstName} {user?.lastName}
              </p>
              <span className="mt-1 inline-block rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-0.5 text-xs font-medium text-purple-300">
                {user?.accountType}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard/settings")}
            className="flex items-center gap-2 rounded-lg border border-purple-500/60 px-4 py-2 text-sm font-medium text-purple-300 transition-colors hover:bg-purple-500/10"
          >
            <FiEdit2 size={16} />
            Edit Profile
          </button>
        </div>

        <div className="relative my-6 h-px w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        {/* Details grid */}
        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
            <HiOutlineMail className="text-purple-400" size={20} />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Email</p>
              <p className="truncate text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
            <HiOutlinePhone className="text-purple-400" size={20} />
            <div>
              <p className="text-xs text-gray-400">Phone</p>
              <p className="text-sm">{phone || "Not added"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
            <HiOutlineCalendar className="text-purple-400" size={20} />
            <div>
              <p className="text-xs text-gray-400">Joined</p>
              <p className="text-sm">{joinedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
            <HiOutlineUser className="text-purple-400" size={20} />
            <div>
              <p className="text-xs text-gray-400">Gender</p>
              <p className="text-sm">{gender || "Not added"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
            <HiOutlineCake className="text-purple-400" size={20} />
            <div>
              <p className="text-xs text-gray-400">Date of birth</p>
              <p className="text-sm">{dob || "Not added"}</p>
            </div>
          </div>
        </div>

        {/* About — full width, separate from the grid since it's longer text */}
        <div className="relative mt-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
          <p className="text-xs text-gray-400">About</p>
          <p className="mt-1 text-sm text-gray-200">
            {about || "No bio added yet."}
          </p>
        </div>
      </div>

      {/* Stats row — students only */}
      {user?.accountType === "Student" && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-purple-800/40 bg-[#0d1117] p-6 text-center">
            <p className="text-2xl font-bold text-purple-300">
              {user?.courses?.length || 0}
            </p>
            <p className="mt-1 text-sm text-gray-400">Enrolled Courses</p>
          </div>
          <div className="rounded-2xl border border-purple-800/40 bg-[#0d1117] p-6 text-center">
            <p className="text-2xl font-bold text-purple-300">
              {user?.courseProgress?.length || 0}
            </p>
            <p className="mt-1 text-sm text-gray-400">In Progress</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;