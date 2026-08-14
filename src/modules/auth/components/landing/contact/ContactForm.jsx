// ============================================================
// AMIOUT Enterprise Edition
// ContactForm.jsx
// ============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, MessageSquare, Pencil, Send, Loader2 } from "lucide-react";

import { toast } from "sonner";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // Fake API (Replace later)

    await new Promise((resolve) => setTimeout(resolve, 1800));

    setLoading(false);

    toast.success("Message sent successfully 🚀");

    setForm({
      fullName: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-2xl"
    >
      {/* Header */}

      <div className="border-b border-white/10 p-8">
        <h3 className="text-4xl font-black text-white">Send a Message</h3>

        <p className="mt-4 text-lg leading-8 text-slate-400">
          Fill out the form below and I'll get back to you as soon as possible.
        </p>
      </div>

      {/* Form */}

      <form onSubmit={handleSubmit} className="space-y-6 p-8">
        {/* Name */}

        <InputField
          icon={User}
          label="Full Name"
          name="fullName"
          placeholder="Enter your full name"
          value={form.fullName}
          onChange={handleChange}
        />

        {/* Email */}

        <InputField
          icon={Mail}
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
        />

        {/* Subject */}

        <InputField
          icon={Pencil}
          label="Subject"
          name="subject"
          placeholder="Project Collaboration"
          value={form.subject}
          onChange={handleChange}
        />

        {/* Message */}

        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-300">
            Message
          </label>

          <div className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition-all duration-300 focus-within:border-cyan-500">
            <MessageSquare className="mt-1 h-6 w-6 text-cyan-400" />

            <textarea
              name="message"
              rows={6}
              required
              placeholder="Write your message..."
              value={form.message}
              onChange={handleChange}
              className="w-full resize-none bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Button */}

        <motion.button
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.97,
          }}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-8 py-5 font-semibold text-white shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Send Message
            </>
          )}
        </motion.button>

        {/* Bottom */}

        <p className="text-center text-sm leading-7 text-slate-500">
          Usually replies within
          <span className="font-semibold text-cyan-400"> 24 hours</span>
        </p>
      </form>
    </motion.div>
  );
};

const InputField = ({ icon: Icon, label, ...props }) => (
  <div>
    <label className="mb-3 block text-sm font-semibold text-slate-300">
      {label}
    </label>

    <div className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition-all duration-300 focus-within:border-cyan-500">
      <Icon className="h-6 w-6 text-cyan-400" />

      <input
        {...props}
        required
        className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
      />
    </div>
  </div>
);

export default ContactForm;
