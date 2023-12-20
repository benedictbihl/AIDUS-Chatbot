import FAQJSON from "../../util/FAQ.json";
import { Message } from "ai";
import { Sources } from "../types";

type Question = {
  title: string;
  conversation_history: Message[];
  sources: Sources;
};

type FAQProps = {
  onQuestionSelect: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    question: Question,
  ) => void;
};

export const FAQ = ({ onQuestionSelect }: FAQProps) => {
  const faq = FAQJSON.map((q) => (
    <li
      key={q.title}
      className="p-2 hover:bg-gray-50 focus-within:bg-gray-50 ring-inset focus-within:outline-none focus-within:ring-2 focus-within:ring-textColor"
    >
      <button
        onClick={(e) => onQuestionSelect(e, q as Question)}
        className="text-left focus:outline-none"
      >
        &quot;{q.title}&quot;
      </button>
    </li>
  ));

  return (
    <ol className="flex gap-y-2 flex-col align-baseline p-2 max-h-screen overflow-y-auto">
      {faq}
    </ol>
  );
};
