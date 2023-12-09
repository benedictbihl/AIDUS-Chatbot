import React, { useRef } from "react";
import { Dialog as HeadlessDialog } from "@headlessui/react";
import { Button } from "./Button";

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const Dialog = ({ isOpen, onClose }: DialogProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <HeadlessDialog
      initialFocus={closeButtonRef}
      open={isOpen}
      onClose={() => onClose()}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <HeadlessDialog.Panel className="flex flex-col mx-auto max-w-3xl bg-white p-6 z-20 max-h-[90vh] overflow-x-hidden overflow-y-auto">
          <HeadlessDialog.Title className="text-primary font-semibold text-4xl left-7 relative after:h-6 after:bg-secondary-300 after:w-full after:relative after:block after:bottom-4 after:-left-7 after:-z-10">
            <div className="flex items-baseline">About AIDUS</div>
          </HeadlessDialog.Title>
          <div className="flex flex-col items-center justify-between">
            <p className="mt-4">
              AIDUS is a project by UCARE, an initiative by GA²LEN for
              increasing the knowledge of urticaria by research, advocating for
              awareness and accrediting an interactive network of centers of
              reference and excellence in urticaria.
            </p>
            <p>
              The chatbot aims to educate about urticaria and help them find
              quick answers to common questions by referencing thousands of
              pages of scientific literature.
            </p>
            <p className="my-2">
              <span className="font-semibold">For patients: </span>
              The chatbot is not intended to replace professional medical
              advice. If you have any concerns about your health, please consult
              a doctor.
            </p>
            <p className="mb-2">
              <span className="font-semibold">For doctors: </span>
              AIDUS can be used as a starting point for your own research by
              providing you with the sources of the information it provides.
              However, you should always verify the information by consulting
              the original sources.
            </p>
            <p className="mb-2">
              {" "}
              If you have further questions, feel free to contact us via the
              information provided in the{" "}
              <a
                className="text-primary font-semibold hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-primary-950"
                href="https://ga2len-ucare.com/imprint/"
              >
                imprint
              </a>
              .
            </p>
            <Button
              ref={closeButtonRef}
              className="mt-4"
              onClick={() => onClose()}
            >
              Understood
            </Button>
          </div>
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  );
};
