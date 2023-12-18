export type UserType = "doctor" | "patient";

export type Sources = Array<{ sources: Document[] }> | undefined;

export type Document = {
  contentChunk: string;
  metadata: {
    loc: {
      lines: {
        to: number;
        from: number;
      };
      pageNumber: number;
    };
    pdf: {
      info: {
        Title: string;
        Author: string;
      };
      totalPages: number;
    };
  };
};
