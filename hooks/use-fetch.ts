'use client'
import { useState } from "react";
// import { toast } from "sonner";

type FetchFunction<T> = (...args: any[]) => Promise<T>;

export default function useFetch<T>(fn: FetchFunction<T>) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const wrappedFn = async (...args: any[]) => {
      setLoading(true);
      setError(null);
      try {
          const result = await fn(...args);
          setData(result);
          return result;
      } catch (e) {
          const error = e instanceof Error ? e : new Error('An error occurred');
          setError(error);
          throw error;
      } finally {
          setLoading(false);
      }
  };

  return {
      fn: wrappedFn,
      loading,
      data,
      setData,
      error
  };
}
