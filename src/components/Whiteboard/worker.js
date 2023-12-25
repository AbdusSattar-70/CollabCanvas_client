import pako from "pako";
import { fetchData } from "../../api/fetchData";

export const restored = (data)=>{
    const parseData =  JSON.parse(pako.inflate(data, { to: "string" }));
    return parseData;
  }


export const compressed = (data)=>{
        const compressedLines = pako.deflate(JSON.stringify(data));
    return compressedLines;
  }


  export const fetchPreviousLines = async (id) => {
    try {
      const res = await fetchData.get(`boards/${id}`);

      return res.data[0].lines;
    } catch (error) {
      console.error("Error fetching previous lines:", error);
    }
  };

