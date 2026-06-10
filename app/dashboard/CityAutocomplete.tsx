"use client";

import { useEffect, useState } from "react";

type Props = {
  value: string;
  onChange: (city: string) => void;
};

export default function CityAutocomplete({
  value,
  onChange,
}: Props) {
  const [query, setQuery] = useState(value);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.length < 2) {
        setCities([]);
        return;
      }

      try {
        const response = await fetch(
          `/api/cities?q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        setCities(data.cities || []);
      } catch {
        setCities([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Search city..."
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none focus:border-cyan-300/60"
      />

      {cities.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-white/10 bg-[#0f172a]">
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                setQuery(city);
                onChange(city);
                setCities([]);
              }}
              className="block w-full px-4 py-3 text-left hover:bg-cyan-300/10"
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}