export type UserType = "doctor" | "patient";

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
      version: string;
      metadata: {
        _metadata: {
          [key: string]: string | boolean;
        };
      };
      totalPages: number;
    };
  };
};
