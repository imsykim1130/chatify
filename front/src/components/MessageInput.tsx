import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useChatStore } from "../store/useChatStore.ts";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import useKeyboardSound from "../hooks/useKeyboardSound.ts";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<string>("");
  const { playRandomKeyStrokeSound } = useKeyboardSound();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, isSoundEnabled } = useChatStore();

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() && !preview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();
    sendMessage({
      text: text.trim(),
      image: preview,
    });
    // 초기화
    setText("");
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일을 선택해주세요");
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 border-t border-slate-700/50">
      {preview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={preview}
              alt="preview"
              className="size-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 size-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => handleSendMessage(e)}
        className="max-w-3xl mx-auto flex space-x-4"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (isSoundEnabled) {
              playRandomKeyStrokeSound();
            }
          }}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
          placeholder="메세지를 입력하세요"
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${preview ? "text-cyan-500" : ""}`}
        >
          <ImageIcon className="size-5" />
        </button>
        <button
          type="submit"
          disabled={!text.trim() && !preview}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="size-5" />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
