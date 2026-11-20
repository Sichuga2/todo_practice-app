import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();

    await prisma.project.create({
        data: {
            title: "Учёба и практика",
            description: "Задачи по программированию и закрытию практики в колледже",
            tasks: {
                create: [
                    {title:"Настроить окружение Next.js и Git", isCompleted: true},
                    {title:"Спроектировать базу данных SQLite в Prisma", isCompleted: true},
                    {title:"Сделать страницу с деталями проекта", isCompleted: false},
                    {title:"Заполнить дневник практики", isCompleted: false},
                ],
            },
        },
    });

    await prisma.project.create({
        data: {
            title: "Разработка игры",
            description: "Работа над собственным проектом",
            tasks: {
                create: [
                    {title: "Нарисовать спрайты главного персонажа", isCompleted: true},
                    {title: "Написать логику диалогов", isCompleted: false},
                    {title: "Протестировать механику на уровне", isCompleted: false},
                ],
            },
        },
    });

    await prisma.project.create({
        data: {
            title: "Личные дела",
            description: "Повседневные задачи",
            tasks: {
                create: [
                    {title: "Прибраться в комнате", isCompleted: false},
                    {title: "Купить продукты для ужина", isCompleted: true},
                    {title: "Приготовить ужин", isCompleted: true},
                ],
            },
        },
    });

    console.log("База данных успешно заполнена (3 проекта и 10 задач)!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });