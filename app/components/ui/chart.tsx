import React from "react";

type CustomTooltipProps = {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string | number;
};

export function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white p-2 shadow-md border rounded">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-gray-600">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
}
