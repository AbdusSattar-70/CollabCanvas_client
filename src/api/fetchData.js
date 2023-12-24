import axios from 'axios';
import pako from 'pako';
const BASE_URL = 'http://localhost:5000/api';
const BOARD_UPDATE_URL = "/update-board";

export const fetchData = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

 export const updateBoard = async (boardId, lines,thumbnailUrl) => {

      try {
        const compressedLines = pako.deflate(JSON.stringify(lines));
        const res = await fetchData.patch(BOARD_UPDATE_URL, {
          boardId,
          lines:compressedLines,
          url:thumbnailUrl
        });
        return res;
      } catch (error) {
        console.error("Error updating board:", error);
      }
    };