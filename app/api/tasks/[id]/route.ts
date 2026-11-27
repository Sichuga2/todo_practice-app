import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskId = Number(id);
    const body = await request.json();

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Некорректный ID задачи" }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        isCompleted: body.isCompleted,
        ...(body.title !== undefined && { title: body.title.trim() }),
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json(
      { error: "Не удалось обновить задачу" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskId = Number(id);

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Некорректный ID задачи" }, { status: 400 });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ message: "Задача удалена" });
  } catch (error) {
    return NextResponse.json(
      { error: "Не удалось удалить задачу" },
      { status: 500 }
    );
  }
}