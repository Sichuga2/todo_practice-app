import { NextResponse } from "next/server";

const ACCESS_PASSWORD = process.env.APP_PASSWORD || "1234";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.password !== ACCESS_PASSWORD) {
      return NextResponse.json(
        { error: "Неверный пароль" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ message: "Успешный вход" });
    response.cookies.set("auth_token", "valid_session", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

     return response;
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ message: "Вы вышли из системы" });
  response.cookies.delete("auth_token");
  return response;
}