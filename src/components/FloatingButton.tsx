import { ComponentProps } from "react"
import { AiOutlineDownload } from "react-icons/ai"

export default function FloatingButton(props: ComponentProps<"button">) {
    return (
        <div className="fixed right-6 bottom-6 z-50">
            <div className="tooltip tooltip-left" data-tip="Download CV">
                <button
                    {...props}
                    type="button"
                    aria-label="Download CV as PDF"
                    className="flex items-center justify-center text-white rounded-full w-16 h-16 btn btn-primary shadow-large hover:shadow-xl hover:scale-110 transition-all duration-300 focus:ring-4 focus:ring-primary-300 focus:outline-none animate-fade-in">
                    <AiOutlineDownload className="w-6 h-6" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}
