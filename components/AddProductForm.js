"use client";

import { useState } from "react";
import { addProduct } from "@/app/actions";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddProductForm({ user }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("url", url);

    const result = await addProduct(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || "Saved. I will keep an eye on it.");
      setUrl("");
    }

    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste the product link you keep checking"
            className="h-12 text-base"
            required
            disabled={loading}
          />

          <Button
            type="submit"
            disabled={loading}
            className="h-10 bg-emerald-700 px-8 hover:bg-emerald-800 sm:h-12"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Watch it"
            )}
          </Button>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Works best with public product pages that show the current price.
        </p>
      </form>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
