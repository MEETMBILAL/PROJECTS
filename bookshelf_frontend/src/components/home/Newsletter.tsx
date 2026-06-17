"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <section className="bg-surface-alt">
      <div className="container-bs py-14">
        <div className="card-bs mx-auto flex max-w-3xl flex-col items-center gap-4 p-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
            <Mail size={22} />
          </span>
          <h2 className="text-3xl text-primary">Stay in the loop</h2>
          <p className="max-w-md text-text-secondary">
            Subscribe to get the latest arrivals, exclusive deals, and reading
            recommendations delivered to your inbox.
          </p>
          <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-bs flex-1"
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
