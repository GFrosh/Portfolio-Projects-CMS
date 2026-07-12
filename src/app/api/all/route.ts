import { NextResponse } from "next/server";
import { all } from "@/lib/db";


export async function GET() {
	const data = await all("SELECT * FROM users");
	return NextResponse.json(data);
}
