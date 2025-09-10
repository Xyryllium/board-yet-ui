import type { BoardResponse, CreateBoardData } from "~/api/types";
import { fetchBoards as apiFetchBoards } from "~/api/boards/list";
import { createBoard as apiCreateBoard } from "~/api/boards/create";

export async function fetchBoard(): Promise<BoardResponse> {
  return apiFetchBoards();
}

export async function createBoard(data: CreateBoardData): Promise<BoardResponse> {
    return apiCreateBoard(data)
}