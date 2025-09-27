"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Batch {
  id: string;
  crop: string;
  harvestedAt: string;
  farmer: string;
  location?: string;
}

export default function VerifyPage() {
  const { batchId } = useParams();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBatch() {
      try {
        const res = await fetch(`/api/verify/${batchId}`);
        if (!res.ok) {
          throw new Error("Batch not found");
        }
        const data = await res.json();
        setBatch(data);
      } catch (err: any) {
        setError(err.message);
      }
    }

    fetchBatch();
  }, [batchId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-100 text-red-700 p-6 rounded-xl shadow-md">
          ❌ {error}
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-gray-600">
          Loading batch details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          🌿 Batch Verified
        </h1>

        <div className="space-y-3">
          <p>
            <span className="font-semibold text-gray-700">Batch ID:</span>{" "}
            {batch.id}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Crop:</span>{" "}
            {batch.crop}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Harvested At:</span>{" "}
            {batch.harvestedAt}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Farmer:</span>{" "}
            {batch.farmer}
          </p>
          {batch.location && (
            <p>
              <span className="font-semibold text-gray-700">Location:</span>{" "}
              {batch.location}
            </p>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-500">
          ✅ This batch has been authenticated using HerbChain
        </div>
      </div>
    </div>
  );
}
