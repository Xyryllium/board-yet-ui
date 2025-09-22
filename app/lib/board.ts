import type { BoardResponse, CreateBoardData } from "~/api/types";
import { fetchBoards as apiFetchBoards } from "~/api/boards/listAll";
import { fetchBoard as apiFetchBoard } from "~/api/boards/list";
import { createBoard as apiCreateBoard } from "~/api/boards/create";

export async function fetchBoards(): Promise<BoardResponse> {
  return apiFetchBoards();
}

export async function fetchBoard(boardId: number): Promise<BoardResponse> {
  return apiFetchBoard(boardId);
}

export async function createBoard(data: CreateBoardData): Promise<BoardResponse> {
    return apiCreateBoard(data)
}