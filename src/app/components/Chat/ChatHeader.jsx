import { IoChatbubbleEllipses, IoWarningOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

function ChatHeader({ statusMeta, connectionState, showFullChatCTA }) {
    return (
        <div className="flex w-full h-12 items-center justify-between border-b border-[#1c2436] bg-[#0b101b] px-2 sm:h-12 sm:p-5">
            <div className="flex items-center gap-1.5 sm:gap-2.5">

                {
                    !showFullChatCTA && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#1c2436] text-[#819d25] sm:h-8 sm:w-8">
                            <IoChatbubbleEllipses className="text-base sm:text-lg" />
                        </div>
                    )
                }

                <div className="flex flex-col justify-center leading-none">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                    </div>
                </div>
            </div>

            <div className="flex h-full items-center gap-1.5 sm:gap-2">
                <div className="flex h-7 items-center gap-1.5 border border-[#1c2436] bg-[#0e1424] px-2 sm:h-8 sm:gap-2">
                    <span className={`h-1.5 w-1.5 shrink-0 ${statusMeta.dot}`} />
                    <span className={`hidden text-[9px] font-bold uppercase tracking-widest sm:block ${statusMeta.tone}`}>
                        {statusMeta.label}
                    </span>
                    {connectionState === "failed" && (
                        <IoWarningOutline className="text-xs text-rose-500 sm:text-sm" />
                    )}
                </div>

                {showFullChatCTA && (
                    <Link
                        to="/chat"
                        className="group flex h-7 w-7 items-center justify-center bg-[#1c2436] text-[#8aa0ff] transition-colors hover:bg-[#252e42] hover:text-white sm:h-8 sm:w-auto sm:gap-1.5 sm:px-3"
                        title="Full Chat"
                    >
                        <FiUsers className="text-sm transition-transform group-hover:-translate-y-px" />
                        <span className="hidden text-[9px] font-bold uppercase tracking-widest sm:block">
                            Expand
                        </span>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default ChatHeader;