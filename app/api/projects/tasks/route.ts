import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.title || !body.title.trim() || !body.projectId) {
            return NextResponse.json(
                {error:"Укажите название задачи и проект"},
                {status:400}
            );
        }
        
        const newTask = await prisma.task.create({
            data: {
                title: body.title.trim(),
                projectId: Number(body.projectId),
                deadline: body.deadline ? new Date(body.deadline) : null,
            },
        });

        return NextResponse.json(newTask, {status: 201});
    }   catch(error) {
        return NextResponse.json(
            {error:"Не удалось создать задачу"},
            {status:500}
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