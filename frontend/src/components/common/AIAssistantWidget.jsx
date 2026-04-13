import { useMemo, useState } from "react";
import { FiCpu, FiMessageCircle, FiSend, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
import axios from "../../lib/axios.js";
import { useCartStore } from "../../stores/useCartStore.jsx";

const initialMessages = [
  {
    role: "assistant",
    text: "Hi! I am your HardWorx AI assistant. Ask me about compatibility, bottlenecks, upgrades, or budget builds.",
  },
];

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [budget, setBudget] = useState("200000");
  const [purpose, setPurpose] = useState("gaming");
  const [isBuilding, setIsBuilding] = useState(false);
  const [pendingAddIds, setPendingAddIds] = useState([]);

  const { cartItems, addManyToCart, isUpdatingCart } = useCartStore();

  const selectedProductIds = useMemo(() => {
    return cartItems
      .map((item) => item.product?._id)
      .filter(Boolean);
  }, [cartItems]);

  const appendMessage = (role, text) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  const onAsk = async () => {
    const prompt = input.trim();
    if (!prompt || isSending) return;

    appendMessage("user", prompt);
    setInput("");
    setIsSending(true);

    try {
      const res = await axios.post("/ai/chat", {
        prompt,
        selectedProductIds,
      });
      appendMessage("assistant", res.data?.reply || "No response.");
    } catch (error) {
      const message = error.response?.data?.error || "AI request failed";
      appendMessage("assistant", `Sorry, I hit an error: ${message}`);
    } finally {
      setIsSending(false);
    }
  };

  const onCheckCartCompatibility = async () => {
    if (!selectedProductIds.length) {
      toast.error("Your cart is empty. Add parts first.");
      return;
    }

    setIsChecking(true);
    try {
      const res = await axios.post("/ai/compatibility", { selectedProductIds });
      appendMessage("assistant", res.data?.reply || "I could not analyze your cart right now.");
    } catch (error) {
      toast.error(error.response?.data?.error || "Compatibility check failed");
    } finally {
      setIsChecking(false);
    }
  };

  const onGenerateBuildPlan = async () => {
    const numericBudget = Number(budget);
    if (!Number.isFinite(numericBudget) || numericBudget < 40000) {
      toast.error("Enter a valid budget (minimum 40000 DA)");
      return;
    }

    setIsBuilding(true);
    try {
      const res = await axios.post("/ai/build-plan", {
        budget: numericBudget,
        purpose,
      });

      const plan = res.data?.plan;
      const summary = res.data?.summary || "Build plan generated.";
      if (!plan) {
        appendMessage("assistant", "I could not generate a build plan right now.");
        return;
      }

      setPendingAddIds(Array.isArray(res.data?.selectedProductIds) ? res.data.selectedProductIds : []);

      const selectedParts = plan.selectedParts || [];
      const topParts = selectedParts
        .slice(0, 3)
        .map((item) => item.name)
        .join(", ");
      const moreCount = Math.max(selectedParts.length - 3, 0);

      appendMessage(
        "assistant",
        [
          `Build ready for ${plan.purpose}.`,
          `${selectedParts.length} parts selected. Subtotal: ${Number(plan.subtotal || 0).toLocaleString()} DA. Remaining: ${Number(plan.remainingBudget || 0).toLocaleString()} DA.`,
          topParts ? `Top parts: ${topParts}${moreCount > 0 ? ` +${moreCount} more` : ""}.` : "",
          summary,
        ].join("\n\n"),
      );
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to generate build plan");
    } finally {
      setIsBuilding(false);
    }
  };

  const onApproveAndAdd = async () => {
    if (!pendingAddIds.length) {
      toast.error("No AI build ready to add");
      return;
    }

    const done = await addManyToCart(pendingAddIds);
    if (done) {
      setPendingAddIds([]);
      appendMessage("assistant", "Great! I added the approved build parts to your cart.");
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="flex h-[70vh] max-h-140 w-[92vw] max-w-97.5 flex-col overflow-hidden rounded-2xl border border-cyan-400/30 bg-slate-950/95 shadow-[0_0_25px_rgba(34,211,238,0.2)] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">AI Assistant</p>
              <p className="text-sm text-slate-300">PC Compatibility + Recommendations</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5"
              aria-label="Close AI assistant"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((message, idx) => (
              <div
                key={`${message.role}-${idx}`}
                className={`max-w-[92%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-cyan-400/20 text-cyan-100"
                    : "border border-white/10 bg-white/5 text-slate-200"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 p-3">
            <div className="mb-2 grid grid-cols-[1fr_auto_auto] gap-2">
              <input
                type="number"
                min="40000"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                className="h-9 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-white"
                placeholder="Budget in DA"
              />
              <select
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
                className="h-9 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-slate-200"
              >
                <option value="gaming">Gaming</option>
                <option value="balanced">Balanced</option>
                <option value="productivity">Productivity</option>
              </select>
              <button
                onClick={onGenerateBuildPlan}
                disabled={isBuilding}
                className="rounded-lg border border-violet-300/30 bg-violet-400/10 px-2.5 text-xs font-semibold text-violet-200 disabled:opacity-50"
              >
                {isBuilding ? "..." : "Build"}
              </button>
            </div>

            <button
              onClick={onCheckCartCompatibility}
              disabled={isChecking}
              className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-200 disabled:opacity-50"
            >
              <FiCpu className="h-4 w-4" />
              {isChecking ? "Checking compatibility..." : "Check cart compatibility"}
            </button>

            {pendingAddIds.length > 0 && (
              <button
                onClick={onApproveAndAdd}
                disabled={isUpdatingCart}
                className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200 disabled:opacity-50"
              >
                {isUpdatingCart ? "Adding build to cart..." : `Approve & Add ${pendingAddIds.length} parts to cart`}
              </button>
            )}

            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") onAsk();
                }}
                placeholder="Ask about bottlenecks, upgrades, or build advice..."
                className="h-10 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
              />
              <button
                onClick={onAsk}
                disabled={isSending || !input.trim()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 text-white disabled:opacity-50"
                aria-label="Send question"
              >
                <FiSend className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/15 px-4 py-3 text-sm font-semibold text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.3)] backdrop-blur-xl"
        >
          <FiMessageCircle className="h-4 w-4" /> AI Builder
        </button>
      )}
    </div>
  );
}
