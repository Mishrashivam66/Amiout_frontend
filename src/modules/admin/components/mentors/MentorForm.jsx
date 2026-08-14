import React from "react";

const MentorForm = ({ formData, setFormData, onSubmit, loading, onCancel }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "semester" || name === "totalStudents"
          ? Number(value)
          : name === "isActive"
            ? value === "true"
            : value,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Mentor Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Mentor Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
          />
        </div>

        {/* Course */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Course
          </label>

          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
          />
        </div>

        {/* Semester */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Semester
          </label>

          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Group */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Group
          </label>

          <input
            type="text"
            name="group"
            value={formData.group}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
          />
        </div>

        {/* Coordinator */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Coordinator
          </label>

          <input
            type="text"
            name="coordinator"
            value={formData.coordinator}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
          />
        </div>

        {/* Total Students */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Total Students
          </label>

          <input
            type="number"
            name="totalStudents"
            min="0"
            value={formData.totalStudents}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Status
          </label>

          <select
            name="isActive"
            value={String(formData.isActive)}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 border-t border-slate-700 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl bg-slate-700 px-6 py-3 font-medium text-white transition hover:bg-slate-600"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Mentor"}
        </button>
      </div>
    </form>
  );
};

export default MentorForm;
