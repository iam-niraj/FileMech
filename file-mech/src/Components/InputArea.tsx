import React, { useRef } from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";

interface InputAreaProps {
  input: string;
  setInput: (value: string) => void;
  handleKeyPress: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  files: File[];
}

const InputArea: React.FC<InputAreaProps> = ({
  input,
  setInput,
  handleKeyPress,
  handleSend,
  handleFileChange,
  files,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    // <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-sm">
    //   <div className="flex items-end gap-2">
    //     <div className="flex-1">
    //       <textarea
    //         ref={textareaRef}
    //         value={input}
    //         onChange={(e) => setInput(e.target.value)}
    //         onKeyDown={handleKeyPress}
    //         placeholder="Ask something..."
    //         className="w-full p-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm resize-none min-h-[40px] max-h-[120px] border-0"
    //         rows={3}
    //       />
    //     </div>

    //     <div className="flex gap-2 px-2">
    //       <button
    //         onClick={() => fileInputRef.current?.click()}
    //         className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
    //         aria-label="Upload files"
    //       >
    //         <Paperclip size={20} />
    //         <input
    //           type="file"
    //           ref={fileInputRef}
    //           onChange={handleFileChange}
    //           className="hidden"
    //           multiple
    //           aria-label="File upload"
    //         />
    //       </button>

    //       <button
    //         onClick={handleSend}
    //         className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
    //         aria-label="Send message"
    //         disabled={!input.trim() && files.length === 0}
    //       >
    //         <Send size={20} />
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className="flex items-start space-x-4">
      <div className="min-w-0 flex-1">
        <form action="#" className="relative">
          <div className="rounded-lg bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask something..."
              id="comment"
              name="comment"
              rows={2}
              className="block w-full resize-none bg-transparent px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              defaultValue={""}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div aria-hidden="true" className="py-2">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pr-2 pl-3">
            <div className="flex items-center space-x-5">
              <div className="flex items-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  className="-m-2.5 flex size-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                >
                  <PaperClipIcon aria-hidden="true" className="size-5" />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    aria-label="File upload"
                  />
                  <span className="sr-only">Attach a file</span>
                </button>
              </div>
            </div>
            <div className="shrink-0">
              <button
                onClick={handleSend}
                disabled={!input.trim() && files.length === 0}
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputArea;
