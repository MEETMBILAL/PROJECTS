import { NextResponse } from "next/server";

export function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function parseCsvParam(value: string | null) {
  return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
}
