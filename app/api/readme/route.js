import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const resolvedPath = path.resolve(process.cwd(), "README.md");
    try {
      const content = await fs.readFile(resolvedPath, "utf-8");
      return NextResponse.json({
        success: true,
        content,
        exists: true,
        filePath: resolvedPath
      });
    } catch (err) {
      if (err.code === "ENOENT") {
        return NextResponse.json({
          success: true,
          content: "",
          exists: false,
          filePath: resolvedPath
        });
      }
      throw err;
    }
  } catch (error) {
    console.error("API Readme Error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
