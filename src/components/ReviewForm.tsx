"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function ReviewForm({ projectId }: { projectId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating");
      return;
    }

    setIsSubmitting(true);
    const res = await submitReview(projectId, rating, comment);
    setIsSubmitting(false);

    if (res.success) {
      alert("Thank you for your feedback!");
      router.refresh(); // Refresh to hide the form
    } else {
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-3xl border border-amber-100 shadow-sm text-center">
      <h3 className="text-2xl font-bold text-amber-900 mb-2">Project Completed! 🎉</h3>
      <p className="text-amber-700 mb-6 max-w-lg mx-auto">
        Your interior project is officially handed over. Please take a moment to rate your experience with Anuresha.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star 
                className={`w-10 h-10 ${(hoverRating || rating) >= star ? "fill-amber-500 text-amber-500" : "text-stone-300"}`} 
              />
            </button>
          ))}
        </div>

        <textarea 
          placeholder="Share your experience working with us... (Optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm text-stone-900 mb-6 resize-none h-24"
        />

        <button 
          type="submit" 
          disabled={isSubmitting || rating === 0}
          className="w-full bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
