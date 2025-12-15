// src/app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { deadline: 'asc' },
    });
    
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const todo = await prisma.todo.create({
      data: {
        name: body.name,
        deadline: new Date(body.deadline),
        priority: body.priority,
        status: body.status || 'Not started',
      },
    });
    
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}