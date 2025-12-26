"use client";
import { useState } from "react";

const services = [
  "TDS Return Filing Online",
  "GST Returns Filing Online",
  "Income Tax Returns",
  "Vendor Reconciliation",
  "Due Diligence",
  "Public Limited Company Registration",
  "Section 8 Company Registration",
  "Sole Proprietorship Registration",
  "Trademark Renewal",
  "PF Registration",
  "LEI Registration",
  "Shop and Establishment Registration",
  "Legal Metrology Registration",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbwM1c1uA_14bmQjKoHFS6u0Fr7qnnEiJlX9o_hf4kNjFzX47wEnSD5fkGKowKc9-ELM3Q/exec"; // 👈 IMPORTANT

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.email || !form.service) {
      setStatus("error");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("Name", form.name);
    formData.append("Phone", form.phone);
    formData.append("Email", form.email);
    formData.append("Service", form.service);
    formData.append("Source", "Free Consultation Form");

    try {
      const res = await fetch(scriptURL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      setForm({ name: "", phone: "", email: "", service: "" });
      setStatus("success");
    } catch {
      setStatus("error");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl  p-8 shadow-lg text-black">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
        Start Your Business with Free Consultation
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full rounded-lg border px-4 py-2"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full rounded-lg border px-4 py-2"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full rounded-lg border px-4 py-2"
        />
        <select
          name="service"
          value={form.service}
          onChange={handleChange}
          className="w-full rounded-lg border px-4 py-2"
        >
          <option value="">--- Select Service ---</option>
          {services.map((s, i) => (
            <option key={i}>{s}</option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-800 text-white rounded-lg py-3"
        >
          {loading ? "Submitting..." : "Book Free Consultation"}
        </button>

        {status === "success" && (
          <p className="text-green-600 text-center">
            ✅ Details submitted successfully
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-center">
            ❌ Please fill all fields or try again
          </p>
        )}
      </form>
    </div>
  );
}
