"use client";

import { useMemo, useState } from "react";
import { City } from "country-state-city";

type Props = {
  value: string;
  onChange: (city: string) => void;
};

export default function CityAutocomplete({
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);

  const allCities = useMemo(() => {
    return City.getAllCities().map((city) => city.name);
  }, []);

  const filteredCities = useMemo(() => {
    if (!value) return [];

    return allCities
      .filter((city) =>
        city.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 10);
  }, [value, allCities]);

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search city..."
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none focus:border-cyan-300/60"
      />

      {open && filteredCities.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-white/10 bg-slate-900">
          {filteredCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                onChange(city);
                setOpen(false);
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