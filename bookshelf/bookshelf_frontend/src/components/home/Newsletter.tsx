"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <section className="container-page py-14">
      <div className="rounded-2xl border border-bordercolor bg-accent px-8 py-12 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary text-surface">
          <Mail className="h-6 w-6" />
        </span>
        <h2 className="mt-4 font-display text-3xl text-text-primary">
          Stay in the loop
        </h2>
        <p className="mt-2 text-text-secondary">
          Get the latest releases, exclusive deals and reading recommendations.
        </p>
        <form
          onSubmit={submit}
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input flex-1"
            aria-label="Email"
          />
          <button type="submit" className="btn-primary">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
