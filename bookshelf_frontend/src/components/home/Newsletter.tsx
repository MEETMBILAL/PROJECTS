"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <section className="container-bs py-14">
      <div className="overflow-hidden rounded-2xl border border-bsborder bg-accent px-6 py-12 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-surface mx-auto">
          <Mail size={22} />
        </span>
        <h2 className="mt-5 font-display text-3xl font-bold text-text-primary">
          Stay in the loop
        </h2>
        <p className="mx-auto mt-2 max-w-md text-text-secondary">
          Subscribe for new releases, exclusive discounts and reading recommendations.
        </p>
        <form onSubmit={subscribe} className="mx-auto mt-6 flex max-w-md gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input"
          />
          <button type="submit" className="btn-primary shrink-0 px-6">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
