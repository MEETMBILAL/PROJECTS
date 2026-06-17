"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <section className="container-bs py-16">
      <div className="rounded-2xl border border-border bg-accent px-6 py-12 text-center">
        <Mail className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 font-display text-3xl text-ink">
          Stay in the loop
        </h2>
        <p className="mx-auto mt-2 max-w-md text-ink-secondary">
          Subscribe for new arrivals, exclusive discounts and reading
          recommendations.
        </p>
        <form
          onSubmit={submit}
          className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="input-bs flex-1 bg-white"
          />
          <button type="submit" className="btn-primary">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
