import type { BoardResponse, ColumnResponse, CreateColumnData } from "~/api/types";
import { fetchBoards as apiFetchBoards } from "~/api/boards/list";
import { createColumn as apiCreateColumn } from "~/api/columns/create";
import { updateColumn as apiUpdateColumn } from "~/api/columns/update";
import { deleteColumn as apiDeleteColumn } from "~/api/columns/delete";
import { reorderColumns as apiReorderColumns } from "~/api/columns/reorder";
import { getBoardColumns as apiGetBoardColumns } from "~/api/columns/list";

export async function fetchBoard(): Promise<BoardResponse> {
  return apiFetchBoards();
}

export async function createColumn(data: CreateColumnData): Promise<ColumnResponse> {
    return apiCreateColumn(data);
}

export async function updateColumn(columnId: number, boardId: number, data: { name: string; order: number }): Promise<ColumnResponse> {
    return apiUpdateColumn(columnId, { boardId, ...data });
}

export async function deleteColumn(columnId: number): Promise<ColumnResponse> {
    return apiDeleteColumn(columnId);
}

export async function reorderColumns(data: { boardId: number; columns: Array<{ id: number; order: number }> }): Promise<ColumnResponse> {
    return apiReorderColumns(data);
}

export async function getBoardColumns(boardId: number): Promise<ColumnResponse> {
    return apiGetBoardColumns(boardId);
}