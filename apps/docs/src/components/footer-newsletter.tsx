"use client";

import { useState } from "react";
import { Button, Input, toast } from "@stacklyui/ui";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Client island: newsletter capture. No backend — it validates locally and
 *  confirms with a toast, so the footer stays a server component around it. */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setInvalid(true);
      toast.error("Enter a valid email address");
      return;
    }
    setInvalid(false);
    toast.success("You’re on the list", {
      description: "We’ll ping you when big things ship.",
    });
    setEmail("");
  }

  return (
    <form onSubmit={submit} noValidate className="mt-4 flex max-w-sm gap-2">
      <Input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (invalid) setInvalid(false);
        }}
        aria-invalid={invalid}
        aria-label="Email address"
        placeholder="you@company.com"
      />
      <Button type="submit">Subscribe</Button>
    </form>
  );
}
